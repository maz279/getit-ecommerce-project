import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SocialRequest {
  action: 'share_product' | 'start_live_session' | 'join_live_session' | 'get_social_login' | 'track_social_interaction';
  userId?: string;
  productId?: string;
  platform?: string;
  sessionId?: string;
  socialData?: any;
  interactionType?: string;
  content?: string;
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

    const { action, userId, productId, platform, sessionId, socialData, interactionType, content }: SocialRequest = 
      await req.json();

    console.log('Social Commerce Request:', { action, userId, productId, platform });

    let result;

    switch (action) {
      case 'share_product':
        result = await shareProduct(supabase, userId!, productId!, platform!);
        break;
      
      case 'start_live_session':
        result = await startLiveSession(supabase, userId!, socialData);
        break;
      
      case 'join_live_session':
        result = await joinLiveSession(supabase, userId!, sessionId!);
        break;
      
      case 'get_social_login':
        result = await getSocialLoginUrl(platform!, socialData);
        break;
      
      case 'track_social_interaction':
        result = await trackSocialInteraction(supabase, userId!, sessionId!, interactionType!, content);
        break;
      
      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Social Commerce Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Social commerce operation failed' 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function shareProduct(supabase: any, userId: string, productId: string, platform: string) {
  // Get product details
  const { data: product } = await supabase
    .from('products')
    .select('*, vendors (business_name)')
    .eq('id', productId)
    .single();

  if (!product) {
    throw new Error('Product not found');
  }

  // Generate shareable URL with tracking
  const shareId = `${Date.now().toString(36)}${Math.random().toString(36).substring(2)}`;
  const shareUrl = `https://getit-bangladesh.com/product/${productId}?ref=${shareId}&shared_by=${userId}`;

  // Record the share
  const { data: share, error } = await supabase
    .from('product_shares')
    .insert({
      user_id: userId,
      product_id: productId,
      platform,
      shared_url: shareUrl
    })
    .select()
    .single();

  if (error) throw error;

  // Generate platform-specific share content
  let shareContent;
  
  switch (platform) {
    case 'facebook':
      shareContent = {
        url: shareUrl,
        title: `Check out ${product.name} on Getit Bangladesh!`,
        description: product.description?.substring(0, 200) || '',
        image: product.images?.[0] || '',
        hashtags: ['GetitBangladesh', 'OnlineShopping', 'Bangladesh']
      };
      break;
    
    case 'whatsapp':
      shareContent = {
        text: `🛍️ ${product.name}\n💰 ৳${product.price}\n\nCheck it out: ${shareUrl}\n\n#GetitBangladesh #OnlineShopping`
      };
      break;
    
    case 'telegram':
      shareContent = {
        text: `🛍️ ${product.name}\n💰 ৳${product.price}\n\nVendor: ${product.vendors?.business_name}\n\n${shareUrl}`,
        image: product.images?.[0] || ''
      };
      break;
    
    default:
      shareContent = {
        url: shareUrl,
        text: `Check out ${product.name} on Getit Bangladesh!`
      };
  }

  // Award sharing points to user
  try {
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/loyalty-rewards-engine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify({
        action: 'earn_points',
        userId,
        points: 10,
        referenceType: 'product_share',
        referenceId: share.id,
        description: `Shared product: ${product.name}`
      })
    });
  } catch (error) {
    console.log('Failed to award sharing points:', error);
  }

  return {
    shareId: share.id,
    shareUrl,
    shareContent
  };
}

async function startLiveSession(supabase: any, userId: string, sessionData: any) {
  const { title, description, scheduledStart, scheduledEnd, featuredProducts } = sessionData;

  // Get user's vendor ID
  const { data: vendor } = await supabase
    .from('vendors')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!vendor) {
    throw new Error('User is not a vendor');
  }

  // Create live session
  const { data: session, error } = await supabase
    .from('live_shopping_sessions')
    .insert({
      vendor_id: vendor.id,
      host_id: userId,
      title,
      description,
      scheduled_start: scheduledStart,
      scheduled_end: scheduledEnd,
      featured_products: featuredProducts || [],
      status: 'scheduled'
    })
    .select()
    .single();

  if (error) throw error;

  // Create associated chat room
  const { data: chatRoom } = await supabase
    .from('chat_rooms')
    .insert({
      name: `Live Session: ${title}`,
      description: `Chat for live shopping session`,
      created_by: userId,
      is_private: false
    })
    .select()
    .single();

  // Update session with chat room ID
  if (chatRoom) {
    await supabase
      .from('live_shopping_sessions')
      .update({ chat_room_id: chatRoom.id })
      .eq('id', session.id);
  }

  return {
    sessionId: session.id,
    chatRoomId: chatRoom?.id,
    streamUrl: `wss://live-stream.getit-bangladesh.com/session/${session.id}`,
    scheduledStart: session.scheduled_start
  };
}

async function joinLiveSession(supabase: any, userId: string, sessionId: string) {
  // Get session details
  const { data: session } = await supabase
    .from('live_shopping_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (!session) {
    throw new Error('Live session not found');
  }

  if (session.status !== 'live' && session.status !== 'scheduled') {
    throw new Error('Session is not available');
  }

  // Record user joining
  const { error } = await supabase
    .from('live_shopping_interactions')
    .insert({
      session_id: sessionId,
      user_id: userId,
      interaction_type: 'join'
    });

  if (error) throw error;

  // Update viewer count
  await supabase
    .from('live_shopping_sessions')
    .update({ 
      viewer_count: session.viewer_count + 1,
      analytics_data: {
        ...session.analytics_data,
        unique_viewers: (session.analytics_data?.unique_viewers || 0) + 1
      }
    })
    .eq('id', sessionId);

  return {
    sessionDetails: session,
    streamUrl: session.stream_url,
    chatRoomId: session.chat_room_id,
    featuredProducts: session.featured_products
  };
}

async function getSocialLoginUrl(platform: string, redirectUrl: string) {
  // Generate OAuth URLs for different platforms
  const clientIds = {
    facebook: Deno.env.get('FACEBOOK_CLIENT_ID'),
    google: Deno.env.get('GOOGLE_CLIENT_ID')
  };

  let authUrl;

  switch (platform) {
    case 'facebook':
      authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientIds.facebook}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=email,public_profile&response_type=code`;
      break;
    
    case 'google':
      authUrl = `https://accounts.google.com/oauth/authorize?client_id=${clientIds.google}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=openid email profile&response_type=code&access_type=offline`;
      break;
    
    default:
      throw new Error('Unsupported social platform');
  }

  return { authUrl };
}

async function trackSocialInteraction(
  supabase: any, 
  userId: string, 
  sessionId: string, 
  interactionType: string, 
  content?: string
) {
  const { error } = await supabase
    .from('live_shopping_interactions')
    .insert({
      session_id: sessionId,
      user_id: userId,
      interaction_type: interactionType,
      content,
      metadata: {
        timestamp: new Date().toISOString(),
        user_agent: 'api'
      }
    });

  if (error) throw error;

  // Update session analytics
  const { data: session } = await supabase
    .from('live_shopping_sessions')
    .select('analytics_data')
    .eq('id', sessionId)
    .single();

  if (session) {
    const analytics = session.analytics_data || {};
    analytics[interactionType] = (analytics[interactionType] || 0) + 1;

    await supabase
      .from('live_shopping_sessions')
      .update({ analytics_data: analytics })
      .eq('id', sessionId);
  }

  return { interactionRecorded: true };
}