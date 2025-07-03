import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400, 
      headers: corsHeaders 
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const url = new URL(req.url);
  const channel = url.searchParams.get('channel') || 'general';
  const userId = url.searchParams.get('user_id');

  console.log(`WebSocket connection established for channel: ${channel}, user: ${userId}`);

  // Store active connection
  const connectionId = crypto.randomUUID();
  const connectionInfo = {
    id: connectionId,
    user_id: userId,
    channel: channel,
    connected_at: new Date().toISOString(),
    status: 'active'
  };

  // Track connection in database
  await supabaseClient.from('real_time_metrics').insert([{
    vendor_id: userId,
    metric_type: 'connection',
    metric_key: 'websocket_connect',
    metric_value: connectionInfo
  }]);

  socket.onopen = () => {
    console.log(`WebSocket opened for user ${userId} in channel ${channel}`);
    socket.send(JSON.stringify({
      type: 'connection_established',
      channel: channel,
      connection_id: connectionId,
      timestamp: new Date().toISOString()
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);

      switch (message.type) {
        case 'chat_message':
          await handleChatMessage(supabaseClient, socket, message, userId, channel);
          break;
        case 'order_update':
          await handleOrderUpdate(supabaseClient, socket, message, userId);
          break;
        case 'inventory_update':
          await handleInventoryUpdate(supabaseClient, socket, message, userId);
          break;
        case 'ping':
          socket.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  };

  socket.onclose = async () => {
    console.log(`WebSocket closed for user ${userId}`);
    
    // Update connection status
    await supabaseClient.from('real_time_metrics').insert([{
      vendor_id: userId,
      metric_type: 'connection',
      metric_key: 'websocket_disconnect',
      metric_value: { connection_id: connectionId, disconnected_at: new Date().toISOString() }
    }]);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return response;
});

async function handleChatMessage(supabase: any, socket: WebSocket, message: any, userId: string, channel: string) {
  // Store chat message
  const { data, error } = await supabase.from('ai_chatbot_conversations').insert([{
    user_id: userId,
    session_id: channel,
    conversation_data: [message],
    context_data: { channel, type: 'live_chat' }
  }]);

  if (error) {
    console.error('Error storing chat message:', error);
    return;
  }

  // Broadcast to channel (in real implementation, you'd broadcast to all connected sockets in the channel)
  const broadcastMessage = {
    type: 'chat_broadcast',
    channel: channel,
    message: message.content,
    user_id: userId,
    timestamp: new Date().toISOString()
  };

  socket.send(JSON.stringify(broadcastMessage));

  // Log real-time metric
  await supabase.from('real_time_metrics').insert([{
    vendor_id: userId,
    metric_type: 'chat',
    metric_key: 'message_sent',
    metric_value: { channel, message_length: message.content?.length || 0 }
  }]);
}

async function handleOrderUpdate(supabase: any, socket: WebSocket, message: any, userId: string) {
  const { order_id, status, updates } = message;

  // Update order status
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', order_id);

  if (error) {
    console.error('Error updating order:', error);
    socket.send(JSON.stringify({
      type: 'error',
      message: 'Failed to update order'
    }));
    return;
  }

  // Send confirmation
  socket.send(JSON.stringify({
    type: 'order_updated',
    order_id: order_id,
    status: status,
    timestamp: new Date().toISOString()
  }));

  // Log metric
  await supabase.from('real_time_metrics').insert([{
    vendor_id: userId,
    metric_type: 'order',
    metric_key: 'status_update',
    metric_value: { order_id, old_status: updates?.old_status, new_status: status }
  }]);
}

async function handleInventoryUpdate(supabase: any, socket: WebSocket, message: any, userId: string) {
  const { product_id, quantity_change, operation } = message;

  try {
    // Update inventory
    const { data: inventory, error: fetchError } = await supabase
      .from('product_inventory')
      .select('current_stock')
      .eq('product_id', product_id)
      .single();

    if (fetchError) throw fetchError;

    const newStock = operation === 'add' 
      ? inventory.current_stock + quantity_change 
      : inventory.current_stock - quantity_change;

    const { error: updateError } = await supabase
      .from('product_inventory')
      .update({ 
        current_stock: Math.max(0, newStock),
        updated_at: new Date().toISOString()
      })
      .eq('product_id', product_id);

    if (updateError) throw updateError;

    // Send confirmation
    socket.send(JSON.stringify({
      type: 'inventory_updated',
      product_id: product_id,
      new_stock: Math.max(0, newStock),
      change: quantity_change,
      operation: operation,
      timestamp: new Date().toISOString()
    }));

    // Log metric
    await supabase.from('real_time_metrics').insert([{
      vendor_id: userId,
      metric_type: 'inventory',
      metric_key: 'stock_update',
      metric_value: { 
        product_id, 
        old_stock: inventory.current_stock, 
        new_stock: Math.max(0, newStock),
        operation 
      }
    }]);

  } catch (error) {
    console.error('Error updating inventory:', error);
    socket.send(JSON.stringify({
      type: 'error',
      message: 'Failed to update inventory'
    }));
  }
}