import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

interface NotificationRequest {
  action: 'send' | 'send_bulk' | 'create_campaign' | 'get_analytics' | 'schedule' | 'test_ab';
  notification?: {
    user_id?: string;
    template_name: string;
    channel: string[];
    variables: Record<string, any>;
    language?: 'en' | 'bn';
    priority?: number;
    scheduled_at?: string;
  };
  campaign?: {
    name: string;
    description?: string;
    template_id: string;
    target_audience: Record<string, any>;
    channels: string[];
    scheduled_at?: string;
  };
  bulk_notifications?: Array<{
    user_id: string;
    template_name: string;
    variables: Record<string, any>;
    channel: string[];
  }>;
  analytics_query?: {
    campaign_id?: string;
    date_from: string;
    date_to: string;
    channel?: string;
  };
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

    const { action, notification, campaign, bulk_notifications, analytics_query }: NotificationRequest = await req.json();

    switch (action) {
      case 'send':
        return await handleSingleNotification(supabase, notification!);
      case 'send_bulk':
        return await handleBulkNotifications(supabase, bulk_notifications!);
      case 'create_campaign':
        return await handleCreateCampaign(supabase, campaign!);
      case 'get_analytics':
        return await handleGetAnalytics(supabase, analytics_query!);
      case 'schedule':
        return await handleScheduleNotification(supabase, notification!);
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Notification engine error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleSingleNotification(supabase: any, notification: any) {
  console.log('Processing single notification:', notification);

  // Get template
  const { data: template, error: templateError } = await supabase
    .from('notification_templates')
    .select('*')
    .eq('template_name', notification.template_name)
    .eq('is_active', true)
    .single();

  if (templateError || !template) {
    throw new Error(`Template not found: ${notification.template_name}`);
  }

  // Process each channel
  const results = [];
  for (const channel of notification.channel) {
    try {
      const result = await sendNotificationChannel(supabase, {
        ...notification,
        template,
        channel
      });
      results.push(result);
    } catch (error) {
      console.error(`Error sending to ${channel}:`, error);
      results.push({ channel, success: false, error: error.message });
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      results,
      notification_id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleBulkNotifications(supabase: any, notifications: any[]) {
  console.log('Processing bulk notifications:', notifications.length);

  const batchSize = 100;
  const results = [];

  for (let i = 0; i < notifications.length; i += batchSize) {
    const batch = notifications.slice(i, i + batchSize);
    const batchPromises = batch.map(notification => 
      handleSingleNotification(supabase, notification)
        .then(response => response.json())
        .catch(error => ({ success: false, error: error.message }))
    );

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      total_processed: notifications.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleCreateCampaign(supabase: any, campaign: any) {
  console.log('Creating campaign:', campaign);

  const { data, error } = await supabase
    .from('notification_campaigns')
    .insert([{
      ...campaign,
      created_at: new Date().toISOString(),
      status: campaign.scheduled_at ? 'scheduled' : 'draft'
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create campaign: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      campaign: data,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetAnalytics(supabase: any, query: any) {
  console.log('Getting analytics:', query);

  const { data, error } = await supabase
    .from('notification_analytics')
    .select('*')
    .gte('date', query.date_from)
    .lte('date', query.date_to)
    .eq(query.campaign_id ? 'campaign_id' : undefined, query.campaign_id)
    .eq(query.channel ? 'channel' : undefined, query.channel);

  if (error) {
    throw new Error(`Failed to get analytics: ${error.message}`);
  }

  // Calculate summary metrics
  const summary = data.reduce((acc, row) => ({
    total_sent: acc.total_sent + row.total_sent,
    total_delivered: acc.total_delivered + row.total_delivered,
    total_opened: acc.total_opened + row.total_opened,
    total_clicked: acc.total_clicked + row.total_clicked,
    total_failed: acc.total_failed + row.total_failed,
    revenue_generated: acc.revenue_generated + parseFloat(row.revenue_generated || 0)
  }), {
    total_sent: 0,
    total_delivered: 0,
    total_opened: 0,
    total_clicked: 0,
    total_failed: 0,
    revenue_generated: 0
  });

  return new Response(
    JSON.stringify({ 
      success: true, 
      analytics: data,
      summary,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleScheduleNotification(supabase: any, notification: any) {
  console.log('Scheduling notification:', notification);

  const { data, error } = await supabase
    .from('notification_queue')
    .insert([{
      user_id: notification.user_id,
      template_id: notification.template_name,
      channel: notification.channel[0],
      recipient: notification.user_id,
      variables: notification.variables,
      status: 'scheduled',
      scheduled_at: notification.scheduled_at,
      priority: notification.priority || 1
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to schedule notification: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      scheduled_notification: data,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function sendNotificationChannel(supabase: any, params: any) {
  const { template, channel, variables, user_id, language = 'en' } = params;

  // Get channel configuration
  const { data: channelConfig } = await supabase
    .from('notification_channels')
    .select('*')
    .eq('type', channel)
    .eq('is_active', true)
    .order('priority')
    .limit(1)
    .single();

  if (!channelConfig) {
    throw new Error(`No active channel found for type: ${channel}`);
  }

  // Process template content
  const subject = processTemplate(
    language === 'bn' ? template.subject_bn : template.subject_en,
    variables
  );
  const content = processTemplate(
    language === 'bn' ? template.content_bn : template.content_en,
    variables
  );

  // Send via appropriate provider
  let result;
  switch (channel) {
    case 'email':
      result = await sendEmail(channelConfig, subject, content, variables);
      break;
    case 'sms':
      result = await sendSMS(channelConfig, content, variables);
      break;
    case 'push':
      result = await sendPush(channelConfig, subject, content, variables);
      break;
    case 'whatsapp':
      result = await sendWhatsApp(channelConfig, content, variables);
      break;
    case 'in_app':
      result = await createInAppNotification(supabase, user_id, subject, content);
      break;
    default:
      throw new Error(`Unsupported channel: ${channel}`);
  }

  // Log notification history
  await supabase
    .from('notification_history')
    .insert([{
      user_id,
      channel,
      template_id: template.id,
      subject,
      content,
      recipient: variables.email || variables.phone || user_id,
      status: result.success ? 'sent' : 'failed',
      provider_response: result.response,
      error_details: result.error,
      sent_at: new Date().toISOString(),
      metadata: { variables, channel_config: channelConfig.name }
    }]);

  return { channel, success: result.success, response: result.response };
}

function processTemplate(template: string, variables: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] !== undefined ? String(variables[key]) : match;
  });
}

async function sendEmail(channelConfig: any, subject: string, content: string, variables: any) {
  // Simulate email sending - in production, integrate with SendGrid, SES, etc.
  console.log('Sending email:', { subject, to: variables.email });
  
  // Mock email API call
  return {
    success: true,
    response: { message_id: crypto.randomUUID(), status: 'sent' }
  };
}

async function sendSMS(channelConfig: any, content: string, variables: any) {
  // Simulate SMS sending - integrate with SSL Wireless, Banglalink, etc.
  console.log('Sending SMS:', { content, to: variables.phone });
  
  // Bangladesh phone number validation
  const phoneRegex = /^(\+88|88)?01[3-9]\d{8}$/;
  if (!phoneRegex.test(variables.phone)) {
    throw new Error('Invalid Bangladesh phone number format');
  }
  
  return {
    success: true,
    response: { message_id: crypto.randomUUID(), status: 'sent' }
  };
}

async function sendPush(channelConfig: any, title: string, content: string, variables: any) {
  // Simulate push notification - integrate with FCM
  console.log('Sending push notification:', { title, content });
  
  return {
    success: true,
    response: { message_id: crypto.randomUUID(), status: 'sent' }
  };
}

async function sendWhatsApp(channelConfig: any, content: string, variables: any) {
  // Simulate WhatsApp Business API
  console.log('Sending WhatsApp message:', { content, to: variables.phone });
  
  return {
    success: true,
    response: { message_id: crypto.randomUUID(), status: 'sent' }
  };
}

async function createInAppNotification(supabase: any, user_id: string, title: string, message: string) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{
      user_id,
      title,
      message,
      type: 'info',
      read: false,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create in-app notification: ${error.message}`);
  }

  return {
    success: true,
    response: { notification_id: data.id, status: 'created' }
  };
}