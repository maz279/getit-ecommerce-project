import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

interface WhatsAppRequest {
  action: 'send_message' | 'send_template' | 'send_media' | 'webhook' | 'get_templates';
  phone?: string;
  message?: string;
  template_name?: string;
  template_variables?: Record<string, any>;
  media?: {
    type: 'image' | 'document' | 'video';
    url: string;
    caption?: string;
  };
  webhook_data?: any;
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

    const body = await req.json();
    const { action } = body as WhatsAppRequest;

    switch (action) {
      case 'send_message':
        return await handleSendMessage(supabase, body);
      case 'send_template':
        return await handleSendTemplate(supabase, body);
      case 'send_media':
        return await handleSendMedia(supabase, body);
      case 'webhook':
        return await handleWebhook(supabase, body);
      case 'get_templates':
        return await handleGetTemplates(supabase);
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('WhatsApp Business API error:', error);
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

async function handleSendMessage(supabase: any, request: WhatsAppRequest) {
  console.log('Sending WhatsApp message:', { phone: request.phone });

  if (!isValidWhatsAppPhone(request.phone!)) {
    throw new Error('Invalid WhatsApp phone number format');
  }

  // Get WhatsApp Business API configuration
  const { data: config } = await supabase
    .from('notification_channels')
    .select('*')
    .eq('type', 'whatsapp')
    .eq('is_active', true)
    .single();

  if (!config) {
    throw new Error('WhatsApp Business API not configured');
  }

  const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
  const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

  if (!accessToken || !phoneNumberId) {
    throw new Error('WhatsApp Business API credentials not configured');
  }

  // Send message via WhatsApp Business API
  const result = await sendWhatsAppMessage(
    accessToken,
    phoneNumberId,
    request.phone!,
    request.message!
  );

  // Log message history
  await logWhatsAppHistory(supabase, {
    phone: request.phone!,
    message: request.message!,
    status: result.success ? 'sent' : 'failed',
    response: result.response,
    error: result.error,
    message_type: 'text'
  });

  return new Response(
    JSON.stringify({ 
      success: result.success,
      message_id: result.message_id,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleSendTemplate(supabase: any, request: WhatsAppRequest) {
  console.log('Sending WhatsApp template:', { 
    phone: request.phone, 
    template: request.template_name 
  });

  if (!isValidWhatsAppPhone(request.phone!)) {
    throw new Error('Invalid WhatsApp phone number format');
  }

  const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
  const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

  if (!accessToken || !phoneNumberId) {
    throw new Error('WhatsApp Business API credentials not configured');
  }

  // Send template message
  const result = await sendWhatsAppTemplate(
    accessToken,
    phoneNumberId,
    request.phone!,
    request.template_name!,
    request.template_variables || {}
  );

  await logWhatsAppHistory(supabase, {
    phone: request.phone!,
    message: `Template: ${request.template_name}`,
    status: result.success ? 'sent' : 'failed',
    response: result.response,
    error: result.error,
    message_type: 'template'
  });

  return new Response(
    JSON.stringify({ 
      success: result.success,
      message_id: result.message_id,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleSendMedia(supabase: any, request: WhatsAppRequest) {
  console.log('Sending WhatsApp media:', { 
    phone: request.phone, 
    media_type: request.media?.type 
  });

  if (!isValidWhatsAppPhone(request.phone!)) {
    throw new Error('Invalid WhatsApp phone number format');
  }

  const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
  const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

  if (!accessToken || !phoneNumberId) {
    throw new Error('WhatsApp Business API credentials not configured');
  }

  // Send media message
  const result = await sendWhatsAppMedia(
    accessToken,
    phoneNumberId,
    request.phone!,
    request.media!
  );

  await logWhatsAppHistory(supabase, {
    phone: request.phone!,
    message: `Media: ${request.media!.type}`,
    status: result.success ? 'sent' : 'failed',
    response: result.response,
    error: result.error,
    message_type: 'media'
  });

  return new Response(
    JSON.stringify({ 
      success: result.success,
      message_id: result.message_id,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleWebhook(supabase: any, request: WhatsAppRequest) {
  console.log('Processing WhatsApp webhook:', request.webhook_data);

  const webhookData = request.webhook_data;

  // Verify webhook (in production, verify webhook signature)
  if (webhookData.object === 'whatsapp_business_account') {
    for (const entry of webhookData.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'messages') {
          await processMessageWebhook(supabase, change.value);
        }
      }
    }
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetTemplates(supabase: any) {
  console.log('Getting WhatsApp templates');

  // Get approved WhatsApp templates
  const templates = await getWhatsAppTemplates();

  return new Response(
    JSON.stringify({ 
      success: true,
      templates,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function isValidWhatsAppPhone(phone: string): boolean {
  // WhatsApp accepts international format numbers
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

async function sendWhatsAppMessage(
  accessToken: string, 
  phoneNumberId: string, 
  phone: string, 
  message: string
) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone.replace('+', ''),
          text: { body: message },
          type: 'text'
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'WhatsApp API error');
    }

    return {
      success: true,
      message_id: data.messages[0].id,
      response: data
    };

  } catch (error) {
    console.error('WhatsApp send error:', error);
    return {
      success: false,
      error: error.message,
      message_id: null
    };
  }
}

async function sendWhatsAppTemplate(
  accessToken: string, 
  phoneNumberId: string, 
  phone: string, 
  templateName: string,
  variables: Record<string, any>
) {
  try {
    // Prepare template components
    const components = [];
    
    if (Object.keys(variables).length > 0) {
      components.push({
        type: 'body',
        parameters: Object.values(variables).map(value => ({
          type: 'text',
          text: String(value)
        }))
      });
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone.replace('+', ''),
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'en' },
            components: components
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'WhatsApp template API error');
    }

    return {
      success: true,
      message_id: data.messages[0].id,
      response: data
    };

  } catch (error) {
    console.error('WhatsApp template send error:', error);
    return {
      success: false,
      error: error.message,
      message_id: null
    };
  }
}

async function sendWhatsAppMedia(
  accessToken: string, 
  phoneNumberId: string, 
  phone: string, 
  media: { type: string, url: string, caption?: string }
) {
  try {
    const mediaObject: any = {
      link: media.url
    };

    if (media.caption) {
      mediaObject.caption = media.caption;
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone.replace('+', ''),
          type: media.type,
          [media.type]: mediaObject
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'WhatsApp media API error');
    }

    return {
      success: true,
      message_id: data.messages[0].id,
      response: data
    };

  } catch (error) {
    console.error('WhatsApp media send error:', error);
    return {
      success: false,
      error: error.message,
      message_id: null
    };
  }
}

async function processMessageWebhook(supabase: any, webhookValue: any) {
  const messages = webhookValue.messages || [];
  const statuses = webhookValue.statuses || [];

  // Process incoming messages
  for (const message of messages) {
    await supabase
      .from('whatsapp_messages')
      .insert([{
        message_id: message.id,
        from: message.from,
        timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString(),
        type: message.type,
        content: getMessageContent(message),
        metadata: message
      }]);
  }

  // Process status updates
  for (const status of statuses) {
    await supabase
      .from('notification_history')
      .update({
        status: mapWhatsAppStatus(status.status),
        delivered_at: status.status === 'delivered' ? new Date().toISOString() : null,
        opened_at: status.status === 'read' ? new Date().toISOString() : null
      })
      .eq('recipient', status.recipient_id);
  }
}

function getMessageContent(message: any): string {
  switch (message.type) {
    case 'text':
      return message.text.body;
    case 'image':
    case 'document':
    case 'video':
      return message[message.type].caption || `${message.type} message`;
    default:
      return `${message.type} message`;
  }
}

function mapWhatsAppStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'sent': 'sent',
    'delivered': 'delivered',
    'read': 'opened',
    'failed': 'failed'
  };
  return statusMap[status] || status;
}

async function getWhatsAppTemplates() {
  // Mock template data - in production, fetch from WhatsApp Business API
  return [
    {
      name: 'order_confirmation',
      category: 'TRANSACTIONAL',
      language: 'en',
      status: 'APPROVED',
      components: [
        {
          type: 'BODY',
          text: 'Your order {{1}} has been confirmed! Total amount: ৳{{2}}. You can track your order at {{3}}'
        }
      ]
    },
    {
      name: 'delivery_update',
      category: 'TRANSACTIONAL', 
      language: 'en',
      status: 'APPROVED',
      components: [
        {
          type: 'BODY',
          text: 'Good news! Your order {{1}} is out for delivery. Expected delivery: {{2}}'
        }
      ]
    },
    {
      name: 'eid_promotion',
      category: 'MARKETING',
      language: 'en',
      status: 'APPROVED',
      components: [
        {
          type: 'HEADER',
          text: 'Eid Mubarak!'
        },
        {
          type: 'BODY',
          text: 'Celebrate Eid with special offers! Get up to {{1}}% off on your favorite products. Shop now and save big!'
        }
      ]
    }
  ];
}

async function logWhatsAppHistory(supabase: any, logData: any) {
  await supabase
    .from('notification_history')
    .insert([{
      channel: 'whatsapp',
      recipient: logData.phone,
      content: logData.message,
      status: logData.status,
      provider_response: logData.response,
      error_details: logData.error ? { error: logData.error } : null,
      sent_at: new Date().toISOString(),
      metadata: {
        provider: 'meta_whatsapp',
        message_type: logData.message_type || 'text'
      }
    }]);
}