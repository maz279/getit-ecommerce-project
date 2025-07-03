import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { endpoint, data } = await req.json();

    // Health check
    if (endpoint === 'health') {
      return new Response(JSON.stringify({ status: 'healthy', service: 'notification-system' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Route notification operations
    switch (endpoint) {
      case 'notification/send':
        const result = await sendNotification(data);
        
        // Log notification
        const { data: notification, error: logError } = await supabase
          .from('notifications')
          .insert({
            user_id: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            channel: data.channel,
            status: result.success ? 'sent' : 'failed',
            metadata: result
          })
          .select()
          .single();
        
        return new Response(JSON.stringify({ 
          data: { notification, result }, 
          error: logError 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'notifications':
        let query = supabase.from('notifications').select('*');
        
        if (data?.userId) {
          query = query.eq('user_id', data.userId);
        }
        if (data?.status) {
          query = query.eq('status', data.status);
        }
        if (data?.limit) {
          query = query.limit(data.limit);
        }
        
        const { data: notifications, error: notificationsError } = await query
          .order('created_at', { ascending: false });
        
        return new Response(JSON.stringify({ data: notifications, error: notificationsError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'notification/mark-read':
        const { data: updated, error: updateError } = await supabase
          .from('notifications')
          .update({ read: true, read_at: new Date().toISOString() })
          .eq('id', data.notificationId)
          .select()
          .single();
        
        return new Response(JSON.stringify({ data: updated, error: updateError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'notification/templates':
        const { data: templates, error: templatesError } = await supabase
          .from('notification_templates')
          .select('*')
          .eq('is_active', true);
        
        return new Response(JSON.stringify({ data: templates, error: templatesError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'notification/bulk-send':
        const bulkResults = await Promise.all(
          data.recipients.map((recipient: any) => 
            sendNotification({ ...data, userId: recipient.userId })
          )
        );
        
        return new Response(JSON.stringify({ data: bulkResults }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('Notification system error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function sendNotification(data: any) {
  const { channel, type, title, message, userId } = data;
  
  try {
    switch (channel) {
      case 'email':
        return await sendEmail(data);
      
      case 'sms':
        return await sendSMS(data);
      
      case 'push':
        return await sendPushNotification(data);
      
      case 'in-app':
        return { success: true, channel: 'in-app', messageId: `in-app_${Date.now()}` };
      
      default:
        return { success: false, error: 'Unsupported notification channel' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function sendEmail(data: any) {
  // Mock email sending - integrate with actual email service
  return {
    success: true,
    channel: 'email',
    messageId: `email_${Date.now()}`,
    provider: 'mock-email-service'
  };
}

async function sendSMS(data: any) {
  // Mock SMS sending - integrate with actual SMS service
  return {
    success: true,
    channel: 'sms',
    messageId: `sms_${Date.now()}`,
    provider: 'mock-sms-service'
  };
}

async function sendPushNotification(data: any) {
  // Mock push notification - integrate with FCM/APNS
  return {
    success: true,
    channel: 'push',
    messageId: `push_${Date.now()}`,
    provider: 'mock-push-service'
  };
}