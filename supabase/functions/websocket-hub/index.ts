import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse URL to get the endpoint type
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const endpoint = pathParts[pathParts.length - 2]; // e.g., 'orders', 'chat', 'inventory'
    const entityId = pathParts[pathParts.length - 1]; // e.g., orderId, chatId

    console.log(`WebSocket connection established for ${endpoint}/${entityId}`);

    socket.onopen = () => {
      console.log(`WebSocket opened for ${endpoint}/${entityId}`);
      socket.send(JSON.stringify({
        type: 'connection_established',
        endpoint,
        entityId,
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        await handleMessage(supabase, socket, endpoint, entityId, message);
      } catch (error) {
        console.error('Error handling message:', error);
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message'
        }));
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log(`WebSocket closed for ${endpoint}/${entityId}`);
    };

    return response;
  } catch (error) {
    console.error('WebSocket setup error:', error);
    return new Response("WebSocket setup failed", { status: 500 });
  }
});

async function handleMessage(supabase: any, socket: WebSocket, endpoint: string, entityId: string, message: any) {
  switch (endpoint) {
    case 'orders':
      await handleOrderTracking(supabase, socket, entityId, message);
      break;
    case 'chat':
      await handleLiveChat(supabase, socket, entityId, message);
      break;
    case 'inventory':
      await handleInventoryUpdates(supabase, socket, entityId, message);
      break;
    case 'notifications':
      await handleNotifications(supabase, socket, entityId, message);
      break;
    case 'analytics':
      await handleLiveAnalytics(supabase, socket, message);
      break;
    default:
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Unknown endpoint'
      }));
  }
}

async function handleOrderTracking(supabase: any, socket: WebSocket, orderId: string, message: any) {
  switch (message.type) {
    case 'subscribe_order':
      // Send current order status
      const { data: order, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .single();

      if (error) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Order not found'
        }));
        return;
      }

      socket.send(JSON.stringify({
        type: 'order_status',
        data: order
      }));

      // Set up real-time subscription
      const channel = supabase
        .channel(`order_${orderId}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        }, (payload: any) => {
          socket.send(JSON.stringify({
            type: 'order_updated',
            data: payload.new
          }));
        })
        .subscribe();

      break;

    case 'update_status':
      // Update order status (admin only)
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: message.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Failed to update order'
        }));
      }
      break;
  }
}

async function handleLiveChat(supabase: any, socket: WebSocket, chatId: string, message: any) {
  switch (message.type) {
    case 'join_chat':
      // Join chat room
      socket.send(JSON.stringify({
        type: 'chat_joined',
        chatId
      }));

      // Set up real-time subscription for new messages
      const channel = supabase
        .channel(`chat_${chatId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_conversation_messages',
          filter: `conversation_id=eq.${chatId}`
        }, (payload: any) => {
          socket.send(JSON.stringify({
            type: 'new_message',
            data: payload.new
          }));
        })
        .subscribe();

      break;

    case 'send_message':
      // Save message to database
      const { error } = await supabase
        .from('chat_conversation_messages')
        .insert({
          conversation_id: chatId,
          sender_id: message.senderId,
          message_content: message.content,
          message_type: message.messageType || 'text'
        });

      if (error) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Failed to send message'
        }));
      }
      break;
  }
}

async function handleInventoryUpdates(supabase: any, socket: WebSocket, productId: string, message: any) {
  switch (message.type) {
    case 'subscribe_inventory':
      // Send current inventory
      const { data: inventory, error } = await supabase
        .from('product_inventory')
        .select('*')
        .eq('product_id', productId)
        .single();

      if (error) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Product inventory not found'
        }));
        return;
      }

      socket.send(JSON.stringify({
        type: 'inventory_status',
        data: inventory
      }));

      // Set up real-time subscription
      const channel = supabase
        .channel(`inventory_${productId}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'product_inventory',
          filter: `product_id=eq.${productId}`
        }, (payload: any) => {
          socket.send(JSON.stringify({
            type: 'inventory_updated',
            data: payload.new
          }));
        })
        .subscribe();

      break;
  }
}

async function handleNotifications(supabase: any, socket: WebSocket, userId: string, message: any) {
  switch (message.type) {
    case 'subscribe_notifications':
      // Set up real-time subscription for user notifications
      const channel = supabase
        .channel(`notifications_${userId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'commission_notifications',
          filter: `recipient_id=eq.${userId}`
        }, (payload: any) => {
          socket.send(JSON.stringify({
            type: 'new_notification',
            data: payload.new
          }));
        })
        .subscribe();

      break;
  }
}

async function handleLiveAnalytics(supabase: any, socket: WebSocket, message: any) {
  switch (message.type) {
    case 'subscribe_analytics':
      // Send live analytics data
      const interval = setInterval(async () => {
        try {
          // Get real-time metrics
          const { data: metrics, error } = await supabase
            .from('real_time_metrics')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

          if (!error && metrics) {
            socket.send(JSON.stringify({
              type: 'analytics_update',
              data: metrics
            }));
          }
        } catch (error) {
          console.error('Analytics update error:', error);
        }
      }, 5000); // Update every 5 seconds

      // Clear interval when socket closes
      socket.addEventListener('close', () => {
        clearInterval(interval);
      });

      break;
  }
}