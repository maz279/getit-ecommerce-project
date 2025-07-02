import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

interface NotificationRequest {
  type: 'email' | 'sms' | 'push' | 'in_app';
  recipient: string;
  template: string;
  data: any;
  priority?: 'low' | 'medium' | 'high';
}

// Email Templates
const emailTemplates = {
  order_confirmation: {
    subject: 'Order Confirmed - #{orderId}',
    html: `
      <h1>Order Confirmation</h1>
      <p>Dear {{customerName}},</p>
      <p>Your order #{{orderId}} has been confirmed.</p>
      <p>Total Amount: {{amount}} {{currency}}</p>
      <p>Expected Delivery: {{deliveryDate}}</p>
      <p>Thank you for shopping with us!</p>
    `
  },
  vendor_payout: {
    subject: 'Payout Processed - {{amount}} {{currency}}',
    html: `
      <h1>Payout Processed</h1>
      <p>Dear {{vendorName}},</p>
      <p>Your payout of {{amount}} {{currency}} has been processed.</p>
      <p>Transaction ID: {{transactionId}}</p>
      <p>Processing Date: {{processedDate}}</p>
    `
  },
  payment_failed: {
    subject: 'Payment Failed - Order #{{orderId}}',
    html: `
      <h1>Payment Failed</h1>
      <p>Dear {{customerName}},</p>
      <p>We couldn't process your payment for order #{{orderId}}.</p>
      <p>Please try again or contact support.</p>
    `
  },
  low_stock_alert: {
    subject: 'Low Stock Alert - {{productName}}',
    html: `
      <h1>Low Stock Alert</h1>
      <p>Dear {{vendorName}},</p>
      <p>Your product "{{productName}}" is running low on stock.</p>
      <p>Current Stock: {{currentStock}}</p>
      <p>Minimum Level: {{minimumLevel}}</p>
      <p>Please restock soon to avoid stockouts.</p>
    `
  }
};

// SMS Templates
const smsTemplates = {
  order_otp: 'Your order OTP is: {{otp}}. Valid for 10 minutes.',
  delivery_update: 'Your order #{{orderId}} is {{status}}. Track: {{trackingUrl}}',
  payment_reminder: 'Payment pending for order #{{orderId}}. Amount: {{amount}} {{currency}}',
  vendor_alert: 'Urgent: {{message}}. Login to dashboard for details.'
};

// Email Service
async function sendEmail(recipient: string, template: string, data: any): Promise<any> {
  const emailTemplate = emailTemplates[template as keyof typeof emailTemplates];
  if (!emailTemplate) {
    throw new Error(`Email template '${template}' not found`);
  }
  
  let subject = emailTemplate.subject;
  let html = emailTemplate.html;
  
  // Replace template variables
  Object.keys(data).forEach(key => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(placeholder, data[key]);
    html = html.replace(placeholder, data[key]);
  });
  
  try {
    const result = await resend.emails.send({
      from: 'BDCommerce <noreply@bdcommerce.com>',
      to: [recipient],
      subject,
      html
    });
    
    // Log email
    await supabase.from('notification_logs').insert({
      type: 'email',
      recipient,
      template,
      status: 'sent',
      data,
      external_id: result.data?.id
    });
    
    return result;
  } catch (error) {
    await supabase.from('notification_logs').insert({
      type: 'email',
      recipient,
      template,
      status: 'failed',
      data,
      error_message: error.message
    });
    throw error;
  }
}

// SMS Service (Mock - replace with actual SMS provider)
async function sendSMS(recipient: string, template: string, data: any): Promise<any> {
  const smsTemplate = smsTemplates[template as keyof typeof smsTemplates];
  if (!smsTemplate) {
    throw new Error(`SMS template '${template}' not found`);
  }
  
  let message = smsTemplate;
  
  // Replace template variables
  Object.keys(data).forEach(key => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    message = message.replace(placeholder, data[key]);
  });
  
  // Mock SMS sending - replace with actual provider (Twilio, etc.)
  const mockResult = {
    success: true,
    messageId: `sms_${Date.now()}`,
    status: 'sent'
  };
  
  await supabase.from('notification_logs').insert({
    type: 'sms',
    recipient,
    template,
    status: 'sent',
    data: { ...data, message },
    external_id: mockResult.messageId
  });
  
  return mockResult;
}

// Push Notification Service
async function sendPushNotification(recipient: string, template: string, data: any): Promise<any> {
  // Mock push notification - replace with actual service (FCM, APNS)
  const notification = {
    title: data.title || 'BDCommerce Notification',
    body: data.message || 'You have a new notification',
    data: data
  };
  
  const mockResult = {
    success: true,
    notificationId: `push_${Date.now()}`,
    status: 'sent'
  };
  
  await supabase.from('notification_logs').insert({
    type: 'push',
    recipient,
    template,
    status: 'sent',
    data: notification,
    external_id: mockResult.notificationId
  });
  
  return mockResult;
}

// In-App Notification Service
async function sendInAppNotification(recipient: string, template: string, data: any): Promise<any> {
  const notification = {
    user_id: recipient,
    type: template,
    title: data.title,
    message: data.message,
    data: data,
    read: false
  };
  
  const { data: result, error } = await supabase
    .from('in_app_notifications')
    .insert(notification)
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  // Send real-time notification
  await supabase
    .channel(`user_${recipient}`)
    .send({
      type: 'broadcast',
      event: 'new_notification',
      payload: result
    });
  
  await supabase.from('notification_logs').insert({
    type: 'in_app',
    recipient,
    template,
    status: 'sent',
    data: notification,
    external_id: result.id
  });
  
  return result;
}

// Bulk Notification Service
async function sendBulkNotifications(notifications: NotificationRequest[]): Promise<any> {
  const results = [];
  
  for (const notification of notifications) {
    try {
      let result;
      switch (notification.type) {
        case 'email':
          result = await sendEmail(notification.recipient, notification.template, notification.data);
          break;
        case 'sms':
          result = await sendSMS(notification.recipient, notification.template, notification.data);
          break;
        case 'push':
          result = await sendPushNotification(notification.recipient, notification.template, notification.data);
          break;
        case 'in_app':
          result = await sendInAppNotification(notification.recipient, notification.template, notification.data);
          break;
        default:
          throw new Error(`Unsupported notification type: ${notification.type}`);
      }
      
      results.push({ ...notification, result, status: 'success' });
    } catch (error) {
      results.push({ ...notification, error: error.message, status: 'failed' });
    }
  }
  
  return results;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...data } = await req.json();
    
    switch (action) {
      case 'send_single':
        const { type, recipient, template, data: notificationData } = data;
        let result;
        
        switch (type) {
          case 'email':
            result = await sendEmail(recipient, template, notificationData);
            break;
          case 'sms':
            result = await sendSMS(recipient, template, notificationData);
            break;
          case 'push':
            result = await sendPushNotification(recipient, template, notificationData);
            break;
          case 'in_app':
            result = await sendInAppNotification(recipient, template, notificationData);
            break;
          default:
            throw new Error(`Unsupported notification type: ${type}`);
        }
        
        return new Response(JSON.stringify({
          success: true,
          result,
          message: 'Notification sent successfully'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
        
      case 'send_bulk':
        const bulkResults = await sendBulkNotifications(data.notifications);
        return new Response(JSON.stringify({
          success: true,
          results: bulkResults,
          message: 'Bulk notifications processed'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
        
      case 'get_templates':
        return new Response(JSON.stringify({
          email_templates: Object.keys(emailTemplates),
          sms_templates: Object.keys(smsTemplates)
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
        
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
  } catch (error) {
    console.error('Notification service error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

serve(handler);