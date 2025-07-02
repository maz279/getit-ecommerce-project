import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  const { headers } = req
  const upgradeHeader = headers.get("upgrade") || ""

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { socket, response } = Deno.upgradeWebSocket(req)
  const sessionId = crypto.randomUUID()
  const connectionId = crypto.randomUUID()
  
  // Get user from auth header
  const authHeader = headers.get('authorization')
  let userId = null
  if (authHeader) {
    try {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      userId = user?.id
    } catch (error) {
      console.log('Auth error:', error)
    }
  }

  socket.onopen = async () => {
    console.log(`WebSocket connected: ${sessionId}`)
    
    // Register session in database
    await supabase.from('websocket_sessions').insert({
      session_id: sessionId,
      user_id: userId,
      connection_id: connectionId,
      gateway_node: 'edge-function-node',
      connection_status: 'active',
      metadata: {
        user_agent: headers.get('user-agent'),
        ip: headers.get('x-forwarded-for') || 'unknown'
      }
    })

    socket.send(JSON.stringify({
      type: 'connection_established',
      session_id: sessionId,
      timestamp: new Date().toISOString()
    }))
  }

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data)
      const startTime = Date.now()

      // Log incoming message
      await supabase.from('websocket_message_logs').insert({
        session_id: sessionId,
        message_type: message.type || 'unknown',
        message_payload: message,
        direction: 'inbound'
      })

      // Update session activity
      await supabase.from('websocket_sessions')
        .update({ 
          last_activity: new Date().toISOString(),
          message_count: supabase.raw('message_count + 1')
        })
        .eq('session_id', sessionId)

      // Handle different message types
      switch (message.type) {
        case 'subscribe':
          await handleSubscription(message, sessionId, socket, supabase)
          break
        case 'unsubscribe':
          await handleUnsubscription(message, sessionId, socket, supabase)
          break
        case 'ping':
          socket.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }))
          break
        default:
          await routeMessage(message, sessionId, socket, supabase)
      }

      // Log processing time
      const processingTime = Date.now() - startTime
      await supabase.from('websocket_message_logs')
        .update({ processing_time_ms: processingTime })
        .eq('session_id', sessionId)
        .eq('direction', 'inbound')
        .order('processed_at', { ascending: false })
        .limit(1)

    } catch (error) {
      console.error('Message processing error:', error)
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }))
    }
  }

  socket.onclose = async () => {
    console.log(`WebSocket disconnected: ${sessionId}`)
    
    // Update session status
    await supabase.from('websocket_sessions')
      .update({ connection_status: 'disconnected' })
      .eq('session_id', sessionId)
  }

  socket.onerror = async (error) => {
    console.error(`WebSocket error for ${sessionId}:`, error)
    
    // Log error
    await supabase.from('websocket_message_logs').insert({
      session_id: sessionId,
      message_type: 'error',
      message_payload: { error: error.toString() },
      direction: 'system',
      status: 'error',
      error_message: error.toString()
    })
  }

  return response
})

async function handleSubscription(message: any, sessionId: string, socket: WebSocket, supabase: any) {
  const { channel } = message
  
  // Update subscriptions
  const { data: session } = await supabase
    .from('websocket_sessions')
    .select('channel_subscriptions')
    .eq('session_id', sessionId)
    .single()

  if (session) {
    const subscriptions = session.channel_subscriptions || []
    if (!subscriptions.includes(channel)) {
      subscriptions.push(channel)
      
      await supabase.from('websocket_sessions')
        .update({ channel_subscriptions: subscriptions })
        .eq('session_id', sessionId)
    }
  }

  socket.send(JSON.stringify({
    type: 'subscription_confirmed',
    channel,
    timestamp: new Date().toISOString()
  }))
}

async function handleUnsubscription(message: any, sessionId: string, socket: WebSocket, supabase: any) {
  const { channel } = message
  
  // Remove from subscriptions
  const { data: session } = await supabase
    .from('websocket_sessions')
    .select('channel_subscriptions')
    .eq('session_id', sessionId)
    .single()

  if (session) {
    const subscriptions = (session.channel_subscriptions || []).filter((c: string) => c !== channel)
    
    await supabase.from('websocket_sessions')
      .update({ channel_subscriptions: subscriptions })
      .eq('session_id', sessionId)
  }

  socket.send(JSON.stringify({
    type: 'unsubscription_confirmed',
    channel,
    timestamp: new Date().toISOString()
  }))
}

async function routeMessage(message: any, sessionId: string, socket: WebSocket, supabase: any) {
  // Create event stream entry
  await supabase.from('event_streams').insert({
    event_id: crypto.randomUUID(),
    event_type: message.type || 'websocket_message',
    source_service: 'websocket-gateway',
    event_payload: {
      session_id: sessionId,
      message: message
    },
    routing_key: message.routing_key || 'default'
  })

  // Echo back for now - in production, this would route to appropriate services
  socket.send(JSON.stringify({
    type: 'message_received',
    original_message: message,
    timestamp: new Date().toISOString()
  }))
}