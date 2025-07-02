import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LiveShoppingSession {
  id?: string;
  host_id: string;
  title: string;
  description?: string;
  scheduled_start: string;
  featured_products: any[];
  chat_enabled: boolean;
  recording_enabled: boolean;
}

interface LiveShoppingInteraction {
  session_id: string;
  user_id?: string;
  interaction_type: 'view' | 'like' | 'share' | 'comment' | 'purchase' | 'add_to_cart';
  interaction_data: any;
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

    // Live Shopping Sessions Management
    if (path === '/live-shopping-service/sessions' && method === 'GET') {
      const status = url.searchParams.get('status') || 'live';
      
      const { data: sessions, error } = await supabaseClient
        .from('live_shopping_sessions')
        .select(`
          *,
          host:profiles!live_shopping_sessions_host_id_fkey(full_name, avatar_url)
        `)
        .eq('status', status)
        .order('scheduled_start', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ sessions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === '/live-shopping-service/sessions' && method === 'POST') {
      const sessionData: LiveShoppingSession = await req.json();
      
      const { data: session, error } = await supabaseClient
        .from('live_shopping_sessions')
        .insert([sessionData])
        .select()
        .single();

      if (error) throw error;

      // Generate stream credentials
      const streamKey = crypto.randomUUID();
      const rtmpUrl = `rtmp://live.getit.com.bd/live/${streamKey}`;

      const { error: updateError } = await supabaseClient
        .from('live_shopping_sessions')
        .update({ 
          stream_key: streamKey,
          rtmp_url: rtmpUrl 
        })
        .eq('id', session.id);

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ 
        session: { ...session, stream_key: streamKey, rtmp_url: rtmpUrl },
        message: 'Live shopping session created successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Start Live Session
    if (path.includes('/sessions/') && path.includes('/start') && method === 'POST') {
      const sessionId = path.split('/')[3];
      
      const { data: session, error } = await supabaseClient
        .from('live_shopping_sessions')
        .update({ 
          status: 'live',
          actual_start: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      // Notify viewers through real-time
      const { error: notifyError } = await supabaseClient
        .channel(`live-session-${sessionId}`)
        .send({
          type: 'broadcast',
          event: 'session_started',
          payload: { session }
        });

      return new Response(JSON.stringify({ 
        session,
        message: 'Live session started' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // End Live Session
    if (path.includes('/sessions/') && path.includes('/end') && method === 'POST') {
      const sessionId = path.split('/')[3];
      
      const { data: session, error } = await supabaseClient
        .from('live_shopping_sessions')
        .update({ 
          status: 'ended',
          actual_end: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ 
        session,
        message: 'Live session ended' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Record Interaction
    if (path === '/live-shopping-service/interactions' && method === 'POST') {
      const interaction: LiveShoppingInteraction = await req.json();
      
      const { data, error } = await supabaseClient
        .from('live_shopping_interactions')
        .insert([interaction])
        .select()
        .single();

      if (error) throw error;

      // Update viewer count for 'view' interactions
      if (interaction.interaction_type === 'view') {
        const { error: updateError } = await supabaseClient.rpc('increment_viewer_count', {
          session_id: interaction.session_id
        });
      }

      // Broadcast interaction to live viewers
      const { error: broadcastError } = await supabaseClient
        .channel(`live-session-${interaction.session_id}`)
        .send({
          type: 'broadcast',
          event: 'new_interaction',
          payload: { interaction: data }
        });

      return new Response(JSON.stringify({ 
        interaction: data,
        message: 'Interaction recorded' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Session Analytics
    if (path.includes('/sessions/') && path.includes('/analytics') && method === 'GET') {
      const sessionId = path.split('/')[3];
      
      const { data: analytics, error } = await supabaseClient
        .from('live_shopping_interactions')
        .select(`
          interaction_type,
          interaction_data,
          timestamp
        `)
        .eq('session_id', sessionId);

      if (error) throw error;

      // Calculate analytics
      const totalInteractions = analytics.length;
      const interactionsByType = analytics.reduce((acc, interaction) => {
        acc[interaction.interaction_type] = (acc[interaction.interaction_type] || 0) + 1;
        return acc;
      }, {});

      const totalSales = analytics
        .filter(i => i.interaction_type === 'purchase')
        .reduce((sum, i) => sum + (i.interaction_data?.amount || 0), 0);

      return new Response(JSON.stringify({
        analytics: {
          total_interactions: totalInteractions,
          interactions_by_type: interactionsByType,
          total_sales: totalSales,
          engagement_rate: totalInteractions / Math.max(1, interactionsByType.view || 1),
          conversion_rate: (interactionsByType.purchase || 0) / Math.max(1, interactionsByType.view || 1)
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Chat Messages for Live Sessions
    if (path.includes('/sessions/') && path.includes('/chat') && method === 'GET') {
      const sessionId = path.split('/')[3];
      
      const { data: messages, error } = await supabaseClient
        .from('chat_messages')
        .select(`
          *,
          sender:profiles!chat_messages_sender_id_fkey(full_name, avatar_url)
        `)
        .eq('room_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return new Response(JSON.stringify({ messages }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path.includes('/sessions/') && path.includes('/chat') && method === 'POST') {
      const sessionId = path.split('/')[3];
      const { content, message_type = 'text', metadata = {} } = await req.json();
      
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      // Ensure chat room exists for session
      const { data: room, error: roomError } = await supabaseClient
        .from('chat_rooms')
        .select('id')
        .eq('id', sessionId)
        .single();

      if (roomError) {
        // Create chat room for session
        const { error: createRoomError } = await supabaseClient
          .from('chat_rooms')
          .insert([{
            id: sessionId,
            room_type: 'live_shopping',
            participants: [user.id],
            metadata: { session_id: sessionId }
          }]);
        
        if (createRoomError) throw createRoomError;
      }

      const { data: message, error } = await supabaseClient
        .from('chat_messages')
        .insert([{
          room_id: sessionId,
          sender_id: user.id,
          message_type,
          content,
          metadata
        }])
        .select(`
          *,
          sender:profiles!chat_messages_sender_id_fkey(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Broadcast message to live viewers
      const { error: broadcastError } = await supabaseClient
        .channel(`live-session-${sessionId}`)
        .send({
          type: 'broadcast',
          event: 'new_message',
          payload: { message }
        });

      return new Response(JSON.stringify({ 
        message,
        status: 'Message sent' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Live Shopping Service Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});