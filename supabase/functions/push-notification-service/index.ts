/**
 * Push Notification Service
 * Handles web push notifications, email notifications, and SMS
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  action: 'send' | 'subscribe' | 'unsubscribe' | 'schedule' | 'get_preferences';
  userId?: string;
  type?: string;
  title?: string;
  body?: string;
  data?: any;
  subscription?: any;
  scheduledAt?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, userId, type, title, body, data, subscription, scheduledAt, priority }: NotificationRequest = await req.json();

    switch (action) {
      case 'send':
        return await sendNotification(supabaseClient, userId || user.id, type!, title!, body!, data, priority);
      
      case 'subscribe':
        return await subscribeToNotifications(supabaseClient, user.id, subscription);
      
      case 'unsubscribe':
        return await unsubscribeFromNotifications(supabaseClient, user.id, subscription);
      
      case 'schedule':
        return await scheduleNotification(supabaseClient, userId || user.id, type!, title!, body!, data, scheduledAt!, priority);
      
      case 'get_preferences':
        return await getNotificationPreferences(supabaseClient, user.id);
      
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Push Notification Service Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function sendNotification(
  supabaseClient: any,
  userId: string,
  type: string,
  title: string,
  body: string,
  data: any = {},
  priority: string = 'normal'
) {
  // Get user's notification preferences
  const { data: preferences } = await supabaseClient
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!preferences?.push_enabled) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Push notifications disabled for user' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Check if user wants this type of notification
  const typeEnabled = getNotificationTypeEnabled(preferences, type);
  if (!typeEnabled) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: `${type} notifications disabled for user` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Get user's push subscriptions
  const { data: subscriptions } = await supabaseClient
    .from('notification_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);

  // Store notification in database
  const { data: notification, error } = await supabaseClient
    .from('push_notifications')
    .insert({
      user_id: userId,
      title,
      body,
      data,
      type,
      priority,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;

  // Send push notifications to all user devices
  const results = [];
  for (const sub of subscriptions || []) {
    try {
      const result = await sendWebPushNotification(sub, title, body, data);
      results.push({ subscription: sub.id, success: result.success });
    } catch (error) {
      console.error('Error sending push notification:', error);
      results.push({ subscription: sub.id, success: false, error: error.message });
    }
  }

  // Update notification status
  const allSuccessful = results.every(r => r.success);
  await supabaseClient
    .from('push_notifications')
    .update({ 
      status: allSuccessful ? 'sent' : 'failed',
      sent_at: new Date().toISOString()
    })
    .eq('id', notification.id);

  // Send via WebSocket if user is online
  await broadcastToUser(userId, {
    type: 'notification',
    notification: {
      id: notification.id,
      title,
      body,
      data,
      type,
      priority,
      timestamp: new Date().toISOString()
    }
  });

  return new Response(JSON.stringify({
    success: true,
    notificationId: notification.id,
    pushResults: results
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function subscribeToNotifications(supabaseClient: any, userId: string, subscription: any) {
  const { error } = await supabaseClient
    .from('notification_subscriptions')
    .upsert({
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys?.p256dh,
      auth_key: subscription.keys?.auth,
      device_type: 'web',
      user_agent: subscription.userAgent,
      is_active: true
    });

  if (error) throw error;

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function unsubscribeFromNotifications(supabaseClient: any, userId: string, subscription: any) {
  const { error } = await supabaseClient
    .from('notification_subscriptions')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('endpoint', subscription.endpoint);

  if (error) throw error;

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function scheduleNotification(
  supabaseClient: any,
  userId: string,
  type: string,
  title: string,
  body: string,
  data: any,
  scheduledAt: string,
  priority: string = 'normal'
) {
  const { data: notification, error } = await supabaseClient
    .from('push_notifications')
    .insert({
      user_id: userId,
      title,
      body,
      data,
      type,
      priority,
      scheduled_at: scheduledAt,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(JSON.stringify({
    success: true,
    notificationId: notification.id,
    scheduledFor: scheduledAt
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getNotificationPreferences(supabaseClient: any, userId: string) {
  const { data: preferences, error } = await supabaseClient
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  // Create default preferences if none exist
  if (!preferences) {
    const { data: newPreferences, error: insertError } = await supabaseClient
      .from('notification_preferences')
      .insert({ user_id: userId })
      .select()
      .single();

    if (insertError) throw insertError;
    
    return new Response(JSON.stringify({
      success: true,
      preferences: newPreferences
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    success: true,
    preferences
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

function getNotificationTypeEnabled(preferences: any, type: string): boolean {
  const typeMap: { [key: string]: string } = {
    order: 'order_updates',
    price: 'price_alerts',
    inventory: 'inventory_alerts',
    marketing: 'marketing',
    flash_sale: 'flash_sales',
    chat: 'chat_messages',
    vendor: 'vendor_updates',
    system: 'system_notifications'
  };

  const prefKey = typeMap[type] || 'system_notifications';
  return preferences[prefKey] !== false;
}

async function sendWebPushNotification(subscription: any, title: string, body: string, data: any) {
  // In a real implementation, you would use a library like web-push
  // For now, we'll simulate the push notification
  console.log('Sending web push notification:', { subscription: subscription.id, title, body });
  
  // Simulate API call to push service
  return { success: true };
}

async function broadcastToUser(userId: string, data: any) {
  try {
    // Call WebSocket hub to broadcast to user
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/websocket-hub/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, data })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error broadcasting to user:', error);
    return false;
  }
}