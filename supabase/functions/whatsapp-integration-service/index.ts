import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppRequest {
  action: 'setup_integration' | 'send_message' | 'webhook' | 'create_template' | 'get_templates' | 'broadcast';
  vendorId?: string;
  businessAccountId?: string;
  phoneNumberId?: string;
  accessToken?: string;
  recipientPhone?: string;
  messageType?: string;
  messageContent?: any;
  templateName?: string;
  templateData?: any;
  broadcastData?: any;
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

    const { action, vendorId, businessAccountId, phoneNumberId, accessToken, recipientPhone, messageType, messageContent, templateName, templateData, broadcastData }: WhatsAppRequest = 
      await req.json();

    let result;

    switch (action) {
      case 'setup_integration':
        result = await setupWhatsAppIntegration(supabase, vendorId!, businessAccountId!, phoneNumberId!, accessToken!);
        break;
      
      case 'send_message':
        result = await sendWhatsAppMessage(supabase, vendorId!, recipientPhone!, messageType!, messageContent);
        break;
      
      case 'webhook':
        result = await handleWebhook(supabase, req);
        break;
      
      case 'create_template':
        result = await createMessageTemplate(supabase, vendorId!, templateName!, templateData!);
        break;
      
      case 'get_templates':
        result = await getMessageTemplates(supabase, vendorId!);
        break;
      
      case 'broadcast':
        result = await sendBroadcastMessage(supabase, vendorId!, broadcastData!);
        break;
      
      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('WhatsApp Integration Error:', error);
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

async function setupWhatsAppIntegration(supabase: any, vendorId: string, businessAccountId: string, phoneNumberId: string, accessToken: string) {
  // Verify the WhatsApp Business API credentials
  const verifyUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}`;
  const verifyResponse = await fetch(verifyUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!verifyResponse.ok) {
    throw new Error('Invalid WhatsApp Business API credentials');
  }

  const phoneInfo = await verifyResponse.json();
  
  // Generate webhook verify token
  const webhookVerifyToken = crypto.randomUUID();

  // Store integration in database
  const { data: integration, error } = await supabase
    .from('whatsapp_integrations')
    .upsert({
      vendor_id: vendorId,
      business_account_id: businessAccountId,
      phone_number_id: phoneNumberId,
      access_token: accessToken,
      webhook_verify_token: webhookVerifyToken,
      status: 'active',
      integration_config: {
        phone_number: phoneInfo.display_phone_number,
        verified_name: phoneInfo.verified_name,
        quality_rating: phoneInfo.quality_rating,
        messaging_limit: phoneInfo.messaging_limit
      }
    })
    .select()
    .single();

  if (error) throw error;

  // Create default message templates
  const defaultTemplates = [
    {
      name: 'order_confirmation',
      category: 'TRANSACTIONAL',
      language: 'bn',
      components: [
        {
          type: 'HEADER',
          format: 'TEXT',
          text: 'অর্ডার নিশ্চিতকরণ'
        },
        {
          type: 'BODY',
          text: 'আপনার অর্ডার #{{1}} সফলভাবে গৃহীত হয়েছে। ডেলিভারি সময়: {{2}}। ধন্যবাদ!'
        }
      ]
    },
    {
      name: 'delivery_update',
      category: 'TRANSACTIONAL',
      language: 'bn',
      components: [
        {
          type: 'HEADER',
          format: 'TEXT',
          text: 'ডেলিভারি আপডেট'
        },
        {
          type: 'BODY',
          text: 'আপনার অর্ডার #{{1}} এর স্ট্যাটাস: {{2}}। ট্র্যাকিং লিঙ্ক: {{3}}'
        }
      ]
    }
  ];

  await supabase
    .from('whatsapp_integrations')
    .update({
      message_templates: defaultTemplates
    })
    .eq('id', integration.id);

  return {
    integration_id: integration.id,
    webhook_verify_token: webhookVerifyToken,
    phone_number: phoneInfo.display_phone_number,
    status: 'active'
  };
}

async function sendWhatsAppMessage(supabase: any, vendorId: string, recipientPhone: string, messageType: string, messageContent: any) {
  // Get vendor's WhatsApp integration
  const { data: integration } = await supabase
    .from('whatsapp_integrations')
    .select('*')
    .eq('vendor_id', vendorId)
    .eq('status', 'active')
    .single();

  if (!integration) {
    throw new Error('WhatsApp integration not found or inactive');
  }

  // Prepare message payload based on type
  let messagePayload: any = {
    messaging_product: 'whatsapp',
    to: recipientPhone.replace(/[^\d]/g, ''), // Clean phone number
    type: messageType
  };

  switch (messageType) {
    case 'text':
      messagePayload.text = { body: messageContent.text };
      break;
    
    case 'template':
      messagePayload.template = {
        name: messageContent.template_name,
        language: { code: messageContent.language || 'bn' },
        components: messageContent.parameters ? [
          {
            type: 'body',
            parameters: messageContent.parameters.map((param: string) => ({ type: 'text', text: param }))
          }
        ] : []
      };
      break;
    
    case 'image':
      messagePayload.image = {
        link: messageContent.image_url,
        caption: messageContent.caption || ''
      };
      break;
    
    case 'document':
      messagePayload.document = {
        link: messageContent.document_url,
        filename: messageContent.filename,
        caption: messageContent.caption || ''
      };
      break;
    
    default:
      throw new Error('Unsupported message type');
  }

  // Send message via WhatsApp Business API
  const response = await fetch(`https://graph.facebook.com/v18.0/${integration.phone_number_id}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${integration.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(messagePayload)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`WhatsApp API Error: ${result.error?.message || 'Unknown error'}`);
  }

  // Log the message
  await supabase
    .from('whatsapp_messages')
    .insert({
      integration_id: integration.id,
      vendor_id: vendorId,
      recipient_phone: recipientPhone,
      message_type: messageType,
      message_content: messageContent,
      whatsapp_message_id: result.messages?.[0]?.id,
      status: 'sent',
      sent_at: new Date().toISOString()
    });

  return {
    message_id: result.messages?.[0]?.id,
    status: 'sent',
    recipient: recipientPhone
  };
}

async function handleWebhook(supabase: any, req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  // Handle webhook verification
  if (mode === 'subscribe') {
    // Verify the token against stored tokens
    const { data: integrations } = await supabase
      .from('whatsapp_integrations')
      .select('webhook_verify_token')
      .eq('webhook_verify_token', token);

    if (integrations && integrations.length > 0) {
      return new Response(challenge, { status: 200 });
    } else {
      return new Response('Verification failed', { status: 403 });
    }
  }

  // Handle incoming messages and status updates
  if (req.method === 'POST') {
    const body = await req.json();
    
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'messages') {
          await processIncomingMessage(supabase, change.value);
        }
      }
    }
    
    return new Response('OK', { status: 200 });
  }

  return new Response('Method not allowed', { status: 405 });
}

async function processIncomingMessage(supabase: any, messageData: any) {
  const messages = messageData.messages || [];
  const statuses = messageData.statuses || [];

  // Process incoming messages
  for (const message of messages) {
    await supabase
      .from('whatsapp_messages')
      .insert({
        whatsapp_message_id: message.id,
        sender_phone: message.from,
        message_type: message.type,
        message_content: {
          text: message.text?.body || '',
          image: message.image,
          document: message.document
        },
        status: 'received',
        received_at: new Date(parseInt(message.timestamp) * 1000).toISOString()
      });
  }

  // Process status updates
  for (const status of statuses) {
    await supabase
      .from('whatsapp_messages')
      .update({
        status: status.status,
        delivered_at: status.status === 'delivered' ? new Date(parseInt(status.timestamp) * 1000).toISOString() : null,
        read_at: status.status === 'read' ? new Date(parseInt(status.timestamp) * 1000).toISOString() : null
      })
      .eq('whatsapp_message_id', status.id);
  }
}

async function createMessageTemplate(supabase: any, vendorId: string, templateName: string, templateData: any) {
  const { data: integration } = await supabase
    .from('whatsapp_integrations')
    .select('*')
    .eq('vendor_id', vendorId)
    .single();

  if (!integration) {
    throw new Error('WhatsApp integration not found');
  }

  // Add template to integration
  const currentTemplates = integration.message_templates || [];
  currentTemplates.push({
    name: templateName,
    ...templateData,
    created_at: new Date().toISOString()
  });

  await supabase
    .from('whatsapp_integrations')
    .update({ message_templates: currentTemplates })
    .eq('id', integration.id);

  return { template_name: templateName, status: 'created' };
}

async function getMessageTemplates(supabase: any, vendorId: string) {
  const { data: integration } = await supabase
    .from('whatsapp_integrations')
    .select('message_templates')
    .eq('vendor_id', vendorId)
    .single();

  return integration?.message_templates || [];
}

async function sendBroadcastMessage(supabase: any, vendorId: string, broadcastData: any) {
  const { recipients, messageType, messageContent } = broadcastData;
  const results = [];

  for (const recipient of recipients) {
    try {
      const result = await sendWhatsAppMessage(supabase, vendorId, recipient, messageType, messageContent);
      results.push({ recipient, success: true, result });
    } catch (error) {
      results.push({ recipient, success: false, error: error.message });
    }
  }

  return {
    total_recipients: recipients.length,
    successful_sends: results.filter(r => r.success).length,
    failed_sends: results.filter(r => !r.success).length,
    results
  };
}