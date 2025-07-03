import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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

    if (req.method === 'GET') {
      // WhatsApp webhook verification
      const url = new URL(req.url);
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');
      
      if (mode === 'subscribe' && token === 'getit_whatsapp_verify') {
        console.log('WhatsApp webhook verified');
        return new Response(challenge, { headers: corsHeaders });
      }
      
      return new Response('Forbidden', { status: 403 });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      console.log('WhatsApp message received:', JSON.stringify(body, null, 2));

      // Process WhatsApp messages
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === 'messages') {
            const messages = change.value.messages || [];
            
            for (const message of messages) {
              // Create support ticket for WhatsApp message
              await supabase
                .from('support_tickets')
                .insert({
                  subject: 'WhatsApp Inquiry',
                  description: message.text?.body || 'WhatsApp message',
                  priority: 'medium',
                  status: 'open',
                  channel: 'whatsapp',
                  metadata: {
                    whatsapp_id: message.from,
                    message_id: message.id
                  }
                });

              console.log('WhatsApp ticket created for:', message.from);
            }
          }
        }
      }

      return new Response('OK', { headers: corsHeaders });
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('WhatsApp integration error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});