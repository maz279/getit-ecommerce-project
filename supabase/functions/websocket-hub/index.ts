/**
 * WebSocket Hub - Centralized real-time connection management
 * Handles WebSocket connections, subscriptions, and message routing
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebSocketMessage {
  type: 'subscribe' | 'unsubscribe' | 'message' | 'heartbeat';
  channel?: string;
  payload?: any;
  userId?: string;
}

// Store active connections
const connections = new Map<string, WebSocket>();
const userConnections = new Map<string, Set<string>>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { headers } = req;
    const upgradeHeader = headers.get("upgrade") || "";

    // Handle WebSocket upgrade for real-time connections
    if (upgradeHeader.toLowerCase() === "websocket") {
      const { socket, response } = Deno.upgradeWebSocket(req);
      const connectionId = crypto.randomUUID();
      
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      socket.onopen = () => {
        console.log(`WebSocket connection established: ${connectionId}`);
        connections.set(connectionId, socket);
        
        // Send connection confirmation
        socket.send(JSON.stringify({
          type: 'connection_established',
          connectionId,
          timestamp: new Date().toISOString()
        }));
      };

      socket.onmessage = async (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          await handleWebSocketMessage(connectionId, message, supabaseClient);
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
          socket.send(JSON.stringify({
            type: 'error',
            error: 'Invalid message format'
          }));
        }
      };

      socket.onclose = async () => {
        console.log(`WebSocket connection closed: ${connectionId}`);
        await cleanupConnection(connectionId, supabaseClient);
      };

      socket.onerror = (error) => {
        console.error(`WebSocket error: ${connectionId}`, error);
      };

      return response;
    }

    // Handle HTTP requests for connection management
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (action) {
      case 'stats':
        return new Response(JSON.stringify({
          activeConnections: connections.size,
          connectedUsers: userConnections.size,
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'broadcast':
        return await handleBroadcast(req);

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('WebSocket Hub Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function handleWebSocketMessage(
  connectionId: string, 
  message: WebSocketMessage, 
  supabaseClient: any
) {
  const socket = connections.get(connectionId);
  if (!socket) return;

  switch (message.type) {
    case 'subscribe':
      await handleSubscription(connectionId, message, supabaseClient);
      break;

    case 'unsubscribe':
      await handleUnsubscription(connectionId, message);
      break;

    case 'heartbeat':
      socket.send(JSON.stringify({
        type: 'heartbeat_response',
        timestamp: new Date().toISOString()
      }));
      await updateLastActivity(connectionId, supabaseClient);
      break;

    case 'message':
      await handleMessage(connectionId, message, supabaseClient);
      break;

    default:
      socket.send(JSON.stringify({
        type: 'error',
        error: 'Unknown message type'
      }));
  }
}

async function handleSubscription(
  connectionId: string, 
  message: WebSocketMessage, 
  supabaseClient: any
) {
  const { channel, userId } = message;
  const socket = connections.get(connectionId);
  
  if (!socket || !channel) return;

  // Store user connection mapping
  if (userId) {
    if (!userConnections.has(userId)) {
      userConnections.set(userId, new Set());
    }
    userConnections.get(userId)?.add(connectionId);

    // Store connection in database
    await supabaseClient
      .from('websocket_connections')
      .upsert({
        user_id: userId,
        connection_id: connectionId,
        channel_subscriptions: [channel],
        connected_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        is_active: true
      });
  }

  // Send subscription confirmation
  socket.send(JSON.stringify({
    type: 'subscription_confirmed',
    channel,
    connectionId,
    timestamp: new Date().toISOString()
  }));

  console.log(`User ${userId} subscribed to ${channel} on connection ${connectionId}`);
}

async function handleUnsubscription(connectionId: string, message: WebSocketMessage) {
  const { channel, userId } = message;
  const socket = connections.get(connectionId);
  
  if (!socket) return;

  // Send unsubscription confirmation
  socket.send(JSON.stringify({
    type: 'unsubscription_confirmed',
    channel,
    connectionId,
    timestamp: new Date().toISOString()
  }));

  console.log(`User ${userId} unsubscribed from ${channel} on connection ${connectionId}`);
}

async function handleMessage(
  connectionId: string, 
  message: WebSocketMessage, 
  supabaseClient: any
) {
  const { payload, userId } = message;
  
  // Handle different message types
  switch (payload?.type) {
    case 'chat_message':
      await broadcastToChannel(`chat_${payload.roomId}`, {
        type: 'new_message',
        data: payload.data,
        from: userId,
        timestamp: new Date().toISOString()
      });
      break;

    case 'order_update':
      await broadcastToUser(payload.customerId, {
        type: 'order_status_update',
        data: payload.data,
        timestamp: new Date().toISOString()
      });
      break;

    case 'inventory_update':
      await broadcastToChannel(`inventory_${payload.productId}`, {
        type: 'stock_update',
        data: payload.data,
        timestamp: new Date().toISOString()
      });
      break;

    default:
      console.log('Unknown message payload type:', payload?.type);
  }
}

async function broadcastToChannel(channel: string, data: any) {
  const message = JSON.stringify({
    type: 'broadcast',
    channel,
    data,
    timestamp: new Date().toISOString()
  });

  // Broadcast to all connections subscribed to the channel
  for (const [connectionId, socket] of connections) {
    try {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    } catch (error) {
      console.error(`Error broadcasting to ${connectionId}:`, error);
      connections.delete(connectionId);
    }
  }
}

async function broadcastToUser(userId: string, data: any) {
  const userConnectionIds = userConnections.get(userId);
  if (!userConnectionIds) return;

  const message = JSON.stringify({
    type: 'user_message',
    data,
    timestamp: new Date().toISOString()
  });

  for (const connectionId of userConnectionIds) {
    const socket = connections.get(connectionId);
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(message);
      } catch (error) {
        console.error(`Error sending to user ${userId} connection ${connectionId}:`, error);
        userConnectionIds.delete(connectionId);
        connections.delete(connectionId);
      }
    }
  }
}

async function handleBroadcast(req: Request) {
  const { channel, data, userId } = await req.json();

  if (userId) {
    await broadcastToUser(userId, data);
  } else if (channel) {
    await broadcastToChannel(channel, data);
  } else {
    return new Response(JSON.stringify({ error: 'Missing channel or userId' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function updateLastActivity(connectionId: string, supabaseClient: any) {
  await supabaseClient
    .from('websocket_connections')
    .update({ 
      last_activity: new Date().toISOString() 
    })
    .eq('connection_id', connectionId);
}

async function cleanupConnection(connectionId: string, supabaseClient: any) {
  connections.delete(connectionId);

  // Remove from user connections
  for (const [userId, connectionIds] of userConnections) {
    connectionIds.delete(connectionId);
    if (connectionIds.size === 0) {
      userConnections.delete(userId);
    }
  }

  // Update database
  await supabaseClient
    .from('websocket_connections')
    .update({ is_active: false })
    .eq('connection_id', connectionId);
}