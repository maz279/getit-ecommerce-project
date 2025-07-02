import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRoom {
  room_type: 'customer_support' | 'vendor_customer' | 'live_shopping' | 'group_chat';
  participants: string[];
  metadata?: any;
}

interface ChatMessage {
  room_id: string;
  sender_id: string;
  message_type: 'text' | 'image' | 'file' | 'product' | 'system';
  content: string;
  metadata?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      supabaseClient.auth.setSession({
        access_token: authHeader.replace('Bearer ', ''),
        refresh_token: '',
      });
    }

    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // Get user's chat rooms
    if (path === '/real-time-messaging/rooms' && method === 'GET') {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      const { data: rooms, error } = await supabaseClient
        .from('chat_rooms')
        .select(`
          *,
          last_message:chat_messages(content, created_at, sender_id, message_type)
        `)
        .contains('participants', [user.id])
        .eq('status', 'active')
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) throw error;

      // Get unread message counts
      const roomsWithUnread = await Promise.all(
        rooms.map(async (room) => {
          const { data: unreadMessages } = await supabaseClient
            .from('chat_messages')
            .select('id')
            .eq('room_id', room.id)
            .not('read_by', 'cs', `{"${user.id}"}`)
            .neq('sender_id', user.id);

          return {
            ...room,
            unread_count: unreadMessages?.length || 0
          };
        })
      );

      return new Response(JSON.stringify({ rooms: roomsWithUnread }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create new chat room
    if (path === '/real-time-messaging/rooms' && method === 'POST') {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      const roomData: ChatRoom = await req.json();
      
      // Ensure current user is in participants
      if (!roomData.participants.includes(user.id)) {
        roomData.participants.push(user.id);
      }

      const { data: room, error } = await supabaseClient
        .from('chat_rooms')
        .insert([roomData])
        .select()
        .single();

      if (error) throw error;

      // Notify all participants
      for (const participantId of roomData.participants) {
        if (participantId !== user.id) {
          await supabaseClient
            .channel(`user-${participantId}`)
            .send({
              type: 'broadcast',
              event: 'new_chat_room',
              payload: { room }
            });
        }
      }

      return new Response(JSON.stringify({ 
        room,
        message: 'Chat room created successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get messages for a specific room
    if (path.includes('/rooms/') && path.includes('/messages') && method === 'GET') {
      const roomId = path.split('/')[3];
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      const limit = parseInt(url.searchParams.get('limit') || '50');
      const before = url.searchParams.get('before');

      // Verify user is participant in room
      const { data: room, error: roomError } = await supabaseClient
        .from('chat_rooms')
        .select('participants')
        .eq('id', roomId)
        .single();

      if (roomError) throw roomError;
      if (!room.participants.includes(user.id)) {
        throw new Error('Access denied to this chat room');
      }

      let query = supabaseClient
        .from('chat_messages')
        .select(`
          *,
          sender:profiles!chat_messages_sender_id_fkey(full_name, avatar_url)
        `)
        .eq('room_id', roomId)
        .eq('is_deleted', false);

      if (before) {
        query = query.lt('created_at', before);
      }

      const { data: messages, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Mark messages as read
      const messageIds = messages.map(m => m.id);
      if (messageIds.length > 0) {
        await supabaseClient
          .from('chat_messages')
          .update({
            read_by: supabaseClient.rpc('jsonb_set', {
              target: 'read_by',
              path: `{${user.id}}`,
              new_value: 'true'
            })
          })
          .in('id', messageIds)
          .neq('sender_id', user.id);
      }

      return new Response(JSON.stringify({ 
        messages: messages.reverse() // Return in chronological order
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send a message
    if (path.includes('/rooms/') && path.includes('/messages') && method === 'POST') {
      const roomId = path.split('/')[3];
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      const messageData: ChatMessage = await req.json();
      messageData.room_id = roomId;
      messageData.sender_id = user.id;

      // Verify user is participant in room
      const { data: room, error: roomError } = await supabaseClient
        .from('chat_rooms')
        .select('participants, room_type')
        .eq('id', roomId)
        .single();

      if (roomError) throw roomError;
      if (!room.participants.includes(user.id)) {
        throw new Error('Access denied to this chat room');
      }

      // Process message content based on type
      if (messageData.message_type === 'product' && messageData.metadata?.product_id) {
        // Fetch product details
        const { data: product } = await supabaseClient
          .from('products')
          .select('name, price, image_url')
          .eq('id', messageData.metadata.product_id)
          .single();

        if (product) {
          messageData.metadata.product_details = product;
        }
      }

      const { data: message, error } = await supabaseClient
        .from('chat_messages')
        .insert([messageData])
        .select(`
          *,
          sender:profiles!chat_messages_sender_id_fkey(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Update room's last message timestamp
      await supabaseClient
        .from('chat_rooms')
        .update({ last_message_at: message.created_at })
        .eq('id', roomId);

      // Broadcast message to all participants
      for (const participantId of room.participants) {
        if (participantId !== user.id) {
          await supabaseClient
            .channel(`user-${participantId}`)
            .send({
              type: 'broadcast',
              event: 'new_message',
              payload: { 
                message,
                room_id: roomId,
                room_type: room.room_type
              }
            });
        }
      }

      // Send push notification for mobile users
      await sendPushNotification(room.participants, user.id, message, room.room_type);

      return new Response(JSON.stringify({ 
        message,
        status: 'Message sent successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Edit message
    if (path.includes('/messages/') && path.includes('/edit') && method === 'PUT') {
      const messageId = path.split('/')[3];
      const { content } = await req.json();
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      const { data: message, error } = await supabaseClient
        .from('chat_messages')
        .update({ 
          content,
          is_edited: true,
          edited_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('sender_id', user.id) // Only sender can edit
        .select(`
          *,
          sender:profiles!chat_messages_sender_id_fkey(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Broadcast edit to participants
      const { data: room } = await supabaseClient
        .from('chat_rooms')
        .select('participants')
        .eq('id', message.room_id)
        .single();

      if (room) {
        for (const participantId of room.participants) {
          if (participantId !== user.id) {
            await supabaseClient
              .channel(`user-${participantId}`)
              .send({
                type: 'broadcast',
                event: 'message_edited',
                payload: { message }
              });
          }
        }
      }

      return new Response(JSON.stringify({ 
        message,
        status: 'Message edited successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Delete message
    if (path.includes('/messages/') && method === 'DELETE') {
      const messageId = path.split('/')[3];
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      const { data: message, error } = await supabaseClient
        .from('chat_messages')
        .update({ 
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          content: 'This message was deleted'
        })
        .eq('id', messageId)
        .eq('sender_id', user.id) // Only sender can delete
        .select('room_id')
        .single();

      if (error) throw error;

      // Broadcast deletion to participants
      const { data: room } = await supabaseClient
        .from('chat_rooms')
        .select('participants')
        .eq('id', message.room_id)
        .single();

      if (room) {
        for (const participantId of room.participants) {
          if (participantId !== user.id) {
            await supabaseClient
              .channel(`user-${participantId}`)
              .send({
                type: 'broadcast',
                event: 'message_deleted',
                payload: { message_id: messageId, room_id: message.room_id }
              });
          }
        }
      }

      return new Response(JSON.stringify({ 
        status: 'Message deleted successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Typing indicators
    if (path.includes('/rooms/') && path.includes('/typing') && method === 'POST') {
      const roomId = path.split('/')[3];
      const { is_typing } = await req.json();
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      // Get room participants
      const { data: room } = await supabaseClient
        .from('chat_rooms')
        .select('participants')
        .eq('id', roomId)
        .single();

      if (room && room.participants.includes(user.id)) {
        // Broadcast typing status to other participants
        for (const participantId of room.participants) {
          if (participantId !== user.id) {
            await supabaseClient
              .channel(`user-${participantId}`)
              .send({
                type: 'broadcast',
                event: 'typing_status',
                payload: { 
                  room_id: roomId,
                  user_id: user.id,
                  is_typing,
                  timestamp: new Date().toISOString()
                }
              });
          }
        }
      }

      return new Response(JSON.stringify({ 
        status: 'Typing status updated'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Archive/unarchive room
    if (path.includes('/rooms/') && path.includes('/archive') && method === 'PUT') {
      const roomId = path.split('/')[3];
      const { archive } = await req.json();
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      const { data: room, error } = await supabaseClient
        .from('chat_rooms')
        .update({ 
          status: archive ? 'archived' : 'active'
        })
        .eq('id', roomId)
        .contains('participants', [user.id])
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ 
        room,
        status: `Room ${archive ? 'archived' : 'unarchived'} successfully`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Customer support chat initiation
    if (path === '/real-time-messaging/support' && method === 'POST') {
      const { subject, initial_message } = await req.json();
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      // Find available support agent
      const { data: agents, error: agentsError } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('role', 'support_agent')
        .eq('status', 'online')
        .limit(1);

      if (agentsError) throw agentsError;

      const agentId = agents?.[0]?.id || null; // If no agent available, will be assigned later

      // Create support room
      const { data: room, error: roomError } = await supabaseClient
        .from('chat_rooms')
        .insert([{
          room_type: 'customer_support',
          participants: agentId ? [user.id, agentId] : [user.id],
          metadata: {
            subject,
            priority: 'normal',
            status: 'open'
          }
        }])
        .select()
        .single();

      if (roomError) throw roomError;

      // Send initial message
      if (initial_message) {
        await supabaseClient
          .from('chat_messages')
          .insert([{
            room_id: room.id,
            sender_id: user.id,
            message_type: 'text',
            content: initial_message
          }]);
      }

      return new Response(JSON.stringify({ 
        room,
        message: 'Support chat initiated'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Real-time Messaging Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function sendPushNotification(participants: string[], senderId: string, message: any, roomType: string) {
  // Mock implementation - would integrate with FCM/APNs
  const otherParticipants = participants.filter(id => id !== senderId);
  
  for (const participantId of otherParticipants) {
    console.log(`Sending push notification to user ${participantId} for new message in ${roomType} chat`);
  }
}