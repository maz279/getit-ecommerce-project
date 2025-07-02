import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LiveShoppingRequest {
  action: 'create_session' | 'join_session' | 'leave_session' | 'add_product' | 'interact' | 'get_sessions' | 'update_metrics';
  sessionId?: string;
  userId?: string;
  productId?: string;
  interactionType?: string;
  interactionData?: any;
  sessionConfig?: any;
  streamConfig?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, sessionId, userId, productId, interactionType, interactionData, sessionConfig, streamConfig }: LiveShoppingRequest = 
      await req.json();

    let result;

    switch (action) {
      case 'create_session':
        result = await createLiveSession(supabase, userId!, sessionConfig, streamConfig);
        break;
      
      case 'join_session':
        result = await joinLiveSession(supabase, sessionId!, userId!);
        break;
      
      case 'leave_session':
        result = await leaveLiveSession(supabase, sessionId!, userId!);
        break;
      
      case 'add_product':
        result = await addProductToSession(supabase, sessionId!, productId!);
        break;
      
      case 'interact':
        result = await recordInteraction(supabase, sessionId!, userId!, interactionType!, interactionData);
        break;
      
      case 'get_sessions':
        result = await getLiveSessions(supabase, userId);
        break;
      
      case 'update_metrics':
        result = await updateSessionMetrics(supabase, sessionId!, interactionData);
        break;
      
      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Live Shopping Service Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function createLiveSession(supabase: any, hostId: string, sessionConfig: any, streamConfig: any) {
  // Generate stream URL (in production, integrate with streaming service like Agora, Twilio Video, etc.)
  const streamUrl = `https://stream.getit-bangladesh.com/live/${Date.now()}`;
  
  const { data: session, error } = await supabase
    .from('live_shopping_sessions')
    .insert({
      host_id: hostId,
      title: sessionConfig.title || 'Live Shopping Session',
      description: sessionConfig.description || '',
      scheduled_start: sessionConfig.scheduledStart || new Date().toISOString(),
      stream_url: streamUrl,
      viewer_count: 0,
      status: 'scheduled',
      interaction_metrics: {
        likes: 0,
        comments: 0,
        shares: 0,
        purchases: 0
      },
      monetization_data: {
        revenue: 0,
        commission_rate: streamConfig.commissionRate || 5,
        featured_products: []
      }
    })
    .select()
    .single();

  if (error) throw error;

  // Create chat room for the session
  await supabase
    .from('chat_rooms')
    .insert({
      name: `Live Session: ${sessionConfig.title}`,
      type: 'live_shopping',
      metadata: { session_id: session.id },
      is_active: true
    });

  // Broadcast session creation
  await supabase
    .from('realtime_events')
    .insert({
      event_type: 'session_created',
      room_id: `live_session_${session.id}`,
      user_id: hostId,
      event_data: {
        session_id: session.id,
        title: sessionConfig.title,
        stream_url: streamUrl
      }
    });

  return session;
}

async function joinLiveSession(supabase: any, sessionId: string, userId: string) {
  // Update user presence
  await supabase
    .from('user_presence')
    .upsert({
      user_id: userId,
      status: 'online',
      current_room: `live_session_${sessionId}`,
      activity_data: {
        session_id: sessionId,
        joined_at: new Date().toISOString()
      },
      last_seen: new Date().toISOString()
    });

  // Increment viewer count
  const { data: session } = await supabase
    .from('live_shopping_sessions')
    .select('viewer_count')
    .eq('id', sessionId)
    .single();

  await supabase
    .from('live_shopping_sessions')
    .update({ viewer_count: (session?.viewer_count || 0) + 1 })
    .eq('id', sessionId);

  // Record interaction
  await supabase
    .from('live_shopping_interactions')
    .insert({
      session_id: sessionId,
      user_id: userId,
      interaction_type: 'join',
      interaction_data: { timestamp: new Date().toISOString() }
    });

  // Broadcast join event
  await supabase
    .from('realtime_events')
    .insert({
      event_type: 'user_joined',
      room_id: `live_session_${sessionId}`,
      user_id: userId,
      event_data: {
        session_id: sessionId,
        viewer_count: (session?.viewer_count || 0) + 1
      }
    });

  return { success: true, viewer_count: (session?.viewer_count || 0) + 1 };
}

async function leaveLiveSession(supabase: any, sessionId: string, userId: string) {
  // Update user presence
  await supabase
    .from('user_presence')
    .update({
      current_room: null,
      activity_data: {
        last_session: sessionId,
        left_at: new Date().toISOString()
      }
    })
    .eq('user_id', userId);

  // Decrement viewer count
  const { data: session } = await supabase
    .from('live_shopping_sessions')
    .select('viewer_count')
    .eq('id', sessionId)
    .single();

  const newViewerCount = Math.max((session?.viewer_count || 1) - 1, 0);
  
  await supabase
    .from('live_shopping_sessions')
    .update({ viewer_count: newViewerCount })
    .eq('id', sessionId);

  // Record interaction
  await supabase
    .from('live_shopping_interactions')
    .insert({
      session_id: sessionId,
      user_id: userId,
      interaction_type: 'leave',
      interaction_data: { timestamp: new Date().toISOString() }
    });

  return { success: true, viewer_count: newViewerCount };
}

async function addProductToSession(supabase: any, sessionId: string, productId: string) {
  const { data: product } = await supabase
    .from('products')
    .select('*, vendors (business_name)')
    .eq('id', productId)
    .single();

  if (!product) throw new Error('Product not found');

  // Update session with featured product
  const { data: session } = await supabase
    .from('live_shopping_sessions')
    .select('monetization_data')
    .eq('id', sessionId)
    .single();

  const monetizationData = session?.monetization_data || {};
  monetizationData.featured_products = monetizationData.featured_products || [];
  monetizationData.featured_products.push({
    product_id: productId,
    featured_at: new Date().toISOString(),
    special_price: product.discounted_price || product.price
  });

  await supabase
    .from('live_shopping_sessions')
    .update({ monetization_data: monetizationData })
    .eq('id', sessionId);

  // Broadcast product addition
  await supabase
    .from('realtime_events')
    .insert({
      event_type: 'product_featured',
      room_id: `live_session_${sessionId}`,
      event_data: {
        session_id: sessionId,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          vendor: product.vendors?.business_name
        }
      }
    });

  return { product, session_id: sessionId };
}

async function recordInteraction(supabase: any, sessionId: string, userId: string, interactionType: string, interactionData: any) {
  // Record the interaction
  await supabase
    .from('live_shopping_interactions')
    .insert({
      session_id: sessionId,
      user_id: userId,
      interaction_type: interactionType,
      interaction_data: interactionData
    });

  // Update session metrics
  const { data: session } = await supabase
    .from('live_shopping_sessions')
    .select('interaction_metrics')
    .eq('id', sessionId)
    .single();

  const metrics = session?.interaction_metrics || {};
  metrics[interactionType] = (metrics[interactionType] || 0) + 1;

  await supabase
    .from('live_shopping_sessions')
    .update({ interaction_metrics: metrics })
    .eq('id', sessionId);

  // Broadcast interaction
  await supabase
    .from('realtime_events')
    .insert({
      event_type: 'interaction',
      room_id: `live_session_${sessionId}`,
      user_id: userId,
      event_data: {
        session_id: sessionId,
        interaction_type: interactionType,
        data: interactionData,
        metrics: metrics
      }
    });

  return { success: true, metrics };
}

async function getLiveSessions(supabase: any, userId?: string) {
  let query = supabase
    .from('live_shopping_sessions')
    .select(`
      *,
      vendors (business_name, logo_url),
      live_shopping_interactions (
        interaction_type,
        user_id
      )
    `)
    .order('scheduled_start', { ascending: false });

  if (userId) {
    // Get sessions for specific user
    query = query.eq('host_id', userId);
  } else {
    // Get active/upcoming public sessions
    query = query.in('status', ['scheduled', 'live', 'upcoming']);
  }

  const { data: sessions, error } = await query;
  if (error) throw error;

  return sessions;
}

async function updateSessionMetrics(supabase: any, sessionId: string, metricsData: any) {
  const { data: session } = await supabase
    .from('live_shopping_sessions')
    .select('interaction_metrics, monetization_data')
    .eq('id', sessionId)
    .single();

  const updatedMetrics = { ...session?.interaction_metrics, ...metricsData.interaction_metrics };
  const updatedMonetization = { ...session?.monetization_data, ...metricsData.monetization_data };

  await supabase
    .from('live_shopping_sessions')
    .update({
      interaction_metrics: updatedMetrics,
      monetization_data: updatedMonetization
    })
    .eq('id', sessionId);

  return { metrics: updatedMetrics, monetization: updatedMonetization };
}