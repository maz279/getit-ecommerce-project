import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  action: 'send_notification' | 'create_template' | 'schedule_notification' | 'get_templates' | 'process_queue';
  templateName?: string;
  userId?: string;
  channel?: 'email' | 'sms' | 'push' | 'whatsapp' | 'in_app';
  recipient?: string;
  variables?: Record<string, any>;
  scheduleTime?: string;
  priority?: number;
  templateData?: any;
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

    const { 
      action, 
      templateName, 
      userId, 
      channel, 
      recipient, 
      variables = {}, 
      scheduleTime, 
      priority = 5,
      templateData 
    }: NotificationRequest = await req.json();

    console.log('Notification Request:', { action, templateName, userId, channel });

    let result;

    switch (action) {
      case 'send_notification':
        result = await sendNotification(supabase, templateName!, userId!, channel!, recipient, variables, priority);
        break;
      
      case 'create_template':
        result = await createTemplate(supabase, templateData);
        break;
      
      case 'schedule_notification':
        result = await scheduleNotification(supabase, templateName!, userId!, channel!, recipient!, variables, scheduleTime!, priority);
        break;
      
      case 'get_templates':
        result = await getTemplates(supabase, channel);
        break;
      
      case 'process_queue':
        result = await processNotificationQueue(supabase);
        break;
      
      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Notification Engine Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Notification operation failed' 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function sendNotification(
  supabase: any, 
  templateName: string, 
  userId: string, 
  channel: string, 
  recipient?: string, 
  variables: Record<string, any> = {},
  priority: number = 5
) {
  // Get template
  const { data: template } = await supabase
    .from('notification_templates')
    .select('*')
    .eq('template_name', templateName)
    .eq('template_type', channel)
    .eq('is_active', true)
    .single();

  if (!template) {
    throw new Error(`Template '${templateName}' not found for channel '${channel}'`);
  }

  // Get user info if recipient not provided
  if (!recipient && userId) {
    const { data: user } = await supabase.auth.admin.getUserById(userId);
    
    if (user?.user) {
      recipient = channel === 'email' ? user.user.email : user.user.phone;
    }
  }

  if (!recipient) {
    throw new Error('Recipient not found');
  }

  // Process template with variables
  const processedContent = processTemplate(template.content_en, variables);
  const processedSubject = template.subject_en ? processTemplate(template.subject_en, variables) : null;

  // Queue notification
  const { data: notification, error } = await supabase
    .from('notification_queue')
    .insert({
      user_id: userId,
      template_id: template.id,
      channel,
      recipient,
      subject: processedSubject,
      content: processedContent,
      variables,
      priority,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;

  // Process immediately for high priority
  if (priority <= 3) {
    await processNotificationItem(supabase, notification);
  }

  return { notificationId: notification.id, status: 'queued' };
}

async function createTemplate(supabase: any, templateData: any) {
  const { error } = await supabase
    .from('notification_templates')
    .insert(templateData);

  if (error) throw error;

  return { templateCreated: true };
}

async function scheduleNotification(
  supabase: any, 
  templateName: string, 
  userId: string, 
  channel: string, 
  recipient: string, 
  variables: Record<string, any>, 
  scheduleTime: string,
  priority: number
) {
  const { data: template } = await supabase
    .from('notification_templates')
    .select('*')
    .eq('template_name', templateName)
    .eq('template_type', channel)
    .eq('is_active', true)
    .single();

  if (!template) {
    throw new Error(`Template '${templateName}' not found`);
  }

  const processedContent = processTemplate(template.content_en, variables);
  const processedSubject = template.subject_en ? processTemplate(template.subject_en, variables) : null;

  const { data: notification, error } = await supabase
    .from('notification_queue')
    .insert({
      user_id: userId,
      template_id: template.id,
      channel,
      recipient,
      subject: processedSubject,
      content: processedContent,
      variables,
      priority,
      status: 'pending',
      scheduled_at: scheduleTime
    })
    .select()
    .single();

  if (error) throw error;

  return { notificationId: notification.id, scheduledFor: scheduleTime };
}

async function getTemplates(supabase: any, channel?: string) {
  let query = supabase
    .from('notification_templates')
    .select('*')
    .eq('is_active', true);

  if (channel) {
    query = query.eq('template_type', channel);
  }

  const { data: templates, error } = await query;
  
  if (error) throw error;

  return templates || [];
}

async function processNotificationQueue(supabase: any) {
  // Get pending notifications
  const { data: notifications } = await supabase
    .from('notification_queue')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_at', new Date().toISOString())
    .order('priority', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(50);

  if (!notifications || notifications.length === 0) {
    return { processed: 0 };
  }

  let processed = 0;
  let failed = 0;

  for (const notification of notifications) {
    try {
      await processNotificationItem(supabase, notification);
      processed++;
    } catch (error) {
      console.error('Failed to process notification:', error);
      failed++;
      
      // Update notification status
      await supabase
        .from('notification_queue')
        .update({
          status: 'failed',
          error_message: error.message,
          retry_count: notification.retry_count + 1
        })
        .eq('id', notification.id);
    }
  }

  return { processed, failed };
}

async function processNotificationItem(supabase: any, notification: any) {
  let success = false;

  switch (notification.channel) {
    case 'email':
      success = await sendEmail(notification);
      break;
    
    case 'sms':
      success = await sendSMS(notification);
      break;
    
    case 'push':
      success = await sendPushNotification(notification);
      break;
    
    case 'whatsapp':
      success = await sendWhatsApp(notification);
      break;
    
    case 'in_app':
      success = await sendInAppNotification(supabase, notification);
      break;
    
    default:
      throw new Error(`Unsupported channel: ${notification.channel}`);
  }

  // Update notification status
  await supabase
    .from('notification_queue')
    .update({
      status: success ? 'sent' : 'failed',
      sent_at: success ? new Date().toISOString() : null,
      error_message: success ? null : 'Failed to send'
    })
    .eq('id', notification.id);

  return success;
}

async function sendEmail(notification: any): Promise<boolean> {
  // Integration with email service (SendGrid, SES, etc.)
  console.log('Sending email:', {
    to: notification.recipient,
    subject: notification.subject,
    content: notification.content
  });
  
  // Mock implementation - replace with actual email service
  return Math.random() > 0.1; // 90% success rate
}

async function sendSMS(notification: any): Promise<boolean> {
  // Integration with SMS service (Twilio, local BD SMS providers)
  console.log('Sending SMS:', {
    to: notification.recipient,
    message: notification.content
  });
  
  // Mock implementation - replace with actual SMS service
  return Math.random() > 0.05; // 95% success rate
}

async function sendPushNotification(notification: any): Promise<boolean> {
  // Integration with push notification service (FCM, APNS)
  console.log('Sending push notification:', {
    to: notification.recipient,
    title: notification.subject,
    body: notification.content
  });
  
  // Mock implementation - replace with actual push service
  return Math.random() > 0.02; // 98% success rate
}

async function sendWhatsApp(notification: any): Promise<boolean> {
  // Integration with WhatsApp Business API
  console.log('Sending WhatsApp message:', {
    to: notification.recipient,
    message: notification.content
  });
  
  // Mock implementation - replace with actual WhatsApp API
  return Math.random() > 0.03; // 97% success rate
}

async function sendInAppNotification(supabase: any, notification: any): Promise<boolean> {
  // Store in-app notification in database
  const { error } = await supabase
    .from('user_notifications')
    .insert({
      user_id: notification.user_id,
      title: notification.subject,
      message: notification.content,
      type: 'in_app',
      is_read: false
    });

  return !error;
}

function processTemplate(template: string, variables: Record<string, any>): string {
  let processed = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    processed = processed.replace(new RegExp(placeholder, 'g'), String(value));
  }
  
  return processed;
}