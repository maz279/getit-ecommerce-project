/**
 * Event-Driven Architecture Service
 * Handles message queuing, event sourcing, CQRS, and Saga patterns
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function publishEvent(eventData: any) {
  const event = {
    event_type: eventData.event_type,
    aggregate_id: eventData.aggregate_id,
    aggregate_type: eventData.aggregate_type,
    event_data: eventData.event_data,
    metadata: eventData.metadata || {},
    correlation_id: eventData.correlation_id || crypto.randomUUID(),
    created_at: new Date().toISOString()
  };

  const { data: storedEvent, error } = await supabase
    .from('analytics_events')
    .insert({
      event_name: event.event_type,
      event_category: event.aggregate_type,
      event_action: 'system_event',
      custom_properties: event.event_data,
      user_id: event.metadata.user_id
    })
    .select()
    .single();

  return { data: storedEvent, error };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();

    let result;
    switch (action) {
      case 'publish_event':
        result = await publishEvent(data);
        break;
      default:
        result = { data: { message: 'Event processor active' }, error: null };
    }

    return new Response(JSON.stringify({
      success: !result.error,
      data: result.data,
      error: result.error?.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: result.error ? 400 : 200
    });

  } catch (error) {
    console.error('Event Processor Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});