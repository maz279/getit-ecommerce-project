import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebSocketConnection {
  socket: WebSocket
  userId?: string
  channels: Set<string>
  metadata: Record<string, any>
}

const connections = new Map<string, WebSocketConnection>()
const channels = new Map<string, Set<string>>()

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )

  const upgradeHeader = req.headers.get("upgrade") || ""
  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 })
  }

  const { socket, response } = Deno.upgradeWebSocket(req)
  const connectionId = crypto.randomUUID()

  socket.onopen = () => {
    console.log(`WebSocket connection opened: ${connectionId}`)
    connections.set(connectionId, {
      socket,
      channels: new Set(),
      metadata: {}
    })
    
    socket.send(JSON.stringify({
      type: 'connection_established',
      connectionId,
      timestamp: new Date().toISOString()
    }))
  }

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data)
      const connection = connections.get(connectionId)
      
      if (!connection) return

      switch (message.type) {
        case 'authenticate':
          await handleAuthentication(connection, message, supabaseClient)
          break
          
        case 'join_channel':
          handleJoinChannel(connectionId, connection, message.channel)
          break
          
        case 'leave_channel':
          handleLeaveChannel(connectionId, connection, message.channel)
          break
          
        case 'live_shopping_join':
          await handleLiveShoppingJoin(connection, message, supabaseClient)
          break
          
        case 'live_shopping_message':
          await handleLiveShoppingMessage(connection, message, supabaseClient)
          break
          
        case 'product_view':
          await handleProductView(connection, message, supabaseClient)
          break
          
        case 'cart_update':
          await handleCartUpdate(connection, message, supabaseClient)
          break
          
        case 'order_status_subscribe':
          handleOrderStatusSubscribe(connection, message)
          break
          
        default:
          console.log('Unknown message type:', message.type)
      }
    } catch (error) {
      console.error('Error processing message:', error)
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }))
    }
  }

  socket.onclose = () => {
    console.log(`WebSocket connection closed: ${connectionId}`)
    const connection = connections.get(connectionId)
    if (connection) {
      // Remove from all channels
      connection.channels.forEach(channel => {
        const channelConnections = channels.get(channel)
        if (channelConnections) {
          channelConnections.delete(connectionId)
          if (channelConnections.size === 0) {
            channels.delete(channel)
          }
        }
      })
    }
    connections.delete(connectionId)
  }

  return response
})

async function handleAuthentication(
  connection: WebSocketConnection, 
  message: any, 
  supabase: any
) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(message.token)
    
    if (error || !user) {
      connection.socket.send(JSON.stringify({
        type: 'auth_error',
        message: 'Invalid authentication token'
      }))
      return
    }

    connection.userId = user.id
    connection.metadata = { ...connection.metadata, ...message.metadata }
    
    connection.socket.send(JSON.stringify({
      type: 'authenticated',
      userId: user.id,
      timestamp: new Date().toISOString()
    }))

    // Auto-join user-specific channels
    handleJoinChannel('', connection, `user:${user.id}`)
    
  } catch (error) {
    console.error('Authentication error:', error)
    connection.socket.send(JSON.stringify({
      type: 'auth_error',
      message: 'Authentication failed'
    }))
  }
}

function handleJoinChannel(connectionId: string, connection: WebSocketConnection, channel: string) {
  connection.channels.add(channel)
  
  if (!channels.has(channel)) {
    channels.set(channel, new Set())
  }
  channels.get(channel)!.add(connectionId)
  
  connection.socket.send(JSON.stringify({
    type: 'channel_joined',
    channel,
    timestamp: new Date().toISOString()
  }))
  
  // Broadcast join event to other channel members
  broadcastToChannel(channel, {
    type: 'user_joined_channel',
    userId: connection.userId,
    channel,
    timestamp: new Date().toISOString()
  }, connectionId)
}

function handleLeaveChannel(connectionId: string, connection: WebSocketConnection, channel: string) {
  connection.channels.delete(channel)
  
  const channelConnections = channels.get(channel)
  if (channelConnections) {
    channelConnections.delete(connectionId)
    if (channelConnections.size === 0) {
      channels.delete(channel)
    }
  }
  
  connection.socket.send(JSON.stringify({
    type: 'channel_left',
    channel,
    timestamp: new Date().toISOString()
  }))
}

async function handleLiveShoppingJoin(
  connection: WebSocketConnection, 
  message: any, 
  supabase: any
) {
  const sessionId = message.sessionId
  
  // Join live shopping channel
  handleJoinChannel('', connection, `live_shopping:${sessionId}`)
  
  // Get current session data
  const { data: session } = await supabase
    .from('live_shopping_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()
    
  if (session) {
    connection.socket.send(JSON.stringify({
      type: 'live_shopping_data',
      session,
      timestamp: new Date().toISOString()
    }))
  }
}

async function handleLiveShoppingMessage(
  connection: WebSocketConnection, 
  message: any, 
  supabase: any
) {
  if (!connection.userId) {
    connection.socket.send(JSON.stringify({
      type: 'error',
      message: 'Authentication required'
    }))
    return
  }

  // Store message in database
  const { data, error } = await supabase
    .from('live_shopping_messages')
    .insert({
      session_id: message.sessionId,
      user_id: connection.userId,
      message_type: message.messageType || 'chat',
      content: message.content,
      metadata: message.metadata || {}
    })
    .select()
    .single()

  if (error) {
    console.error('Error storing live shopping message:', error)
    return
  }

  // Broadcast to all session participants
  broadcastToChannel(`live_shopping:${message.sessionId}`, {
    type: 'live_shopping_message',
    message: data,
    timestamp: new Date().toISOString()
  })
}

async function handleProductView(
  connection: WebSocketConnection, 
  message: any, 
  supabase: any
) {
  // Update product view count
  const { error } = await supabase.rpc('increment_product_views', {
    product_id: message.productId,
    user_id: connection.userId
  })

  if (error) {
    console.error('Error updating product views:', error)
  }

  // Broadcast real-time product activity
  broadcastToChannel(`product:${message.productId}`, {
    type: 'product_activity',
    activity: 'view',
    productId: message.productId,
    timestamp: new Date().toISOString()
  })
}

async function handleCartUpdate(
  connection: WebSocketConnection, 
  message: any, 
  supabase: any
) {
  if (!connection.userId) return

  // Update cart in database
  const { data, error } = await supabase
    .from('shopping_carts')
    .upsert({
      user_id: connection.userId,
      product_id: message.productId,
      quantity: message.quantity,
      variant_data: message.variantData || {}
    })
    .select()

  if (error) {
    console.error('Error updating cart:', error)
    return
  }

  // Send cart update confirmation
  connection.socket.send(JSON.stringify({
    type: 'cart_updated',
    cartItem: data[0],
    timestamp: new Date().toISOString()
  }))
}

function handleOrderStatusSubscribe(connection: WebSocketConnection, message: any) {
  if (!connection.userId) return
  
  // Subscribe to order updates
  handleJoinChannel('', connection, `order:${message.orderId}`)
}

function broadcastToChannel(channel: string, message: any, excludeConnectionId?: string) {
  const channelConnections = channels.get(channel)
  if (!channelConnections) return

  channelConnections.forEach(connectionId => {
    if (connectionId === excludeConnectionId) return
    
    const connection = connections.get(connectionId)
    if (connection && connection.socket.readyState === WebSocket.OPEN) {
      connection.socket.send(JSON.stringify(message))
    }
  })
}