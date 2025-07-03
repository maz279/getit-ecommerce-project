import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LocationUpdate {
  orderId: string;
  latitude: number;
  longitude: number;
  address: string;
  agentId?: string;
  agentName?: string;
  estimatedDelivery?: string;
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

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    switch (req.method) {
      case 'POST':
        if (path === 'update-location') {
          const locationData: LocationUpdate = await req.json();
          
          // Call the database function to update location
          const { data, error } = await supabaseClient.rpc('update_order_location', {
            p_order_id: locationData.orderId,
            p_latitude: locationData.latitude,
            p_longitude: locationData.longitude,
            p_address: locationData.address,
            p_agent_id: locationData.agentId || null,
            p_agent_name: locationData.agentName || null,
            p_estimated_delivery: locationData.estimatedDelivery || null
          });

          if (error) {
            console.error('Location update error:', error);
            return new Response(
              JSON.stringify({ error: 'Failed to update location' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Send real-time notification to connected clients
          const channel = supabaseClient.channel('order-tracking');
          channel.send({
            type: 'broadcast',
            event: 'location_update',
            payload: {
              orderId: locationData.orderId,
              location: {
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                address: locationData.address,
              },
              timestamp: new Date().toISOString(),
            }
          });

          return new Response(
            JSON.stringify({ success: true, trackingId: data }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;

      case 'GET':
        if (path === 'tracking') {
          const orderId = url.searchParams.get('orderId');
          if (!orderId) {
            return new Response(
              JSON.stringify({ error: 'Order ID required' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Get order tracking events
          const { data: trackingEvents, error } = await supabaseClient
            .from('order_tracking_events')
            .select(`
              *,
              orders!inner(customer_id, order_number),
              vendor_orders(vendor_id, order_number)
            `)
            .eq('order_id', orderId)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Tracking fetch error:', error);
            return new Response(
              JSON.stringify({ error: 'Failed to fetch tracking data' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify({ trackingEvents }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;

      case 'PUT':
        if (path === 'delay-notification') {
          const { orderId, delayReason, newEstimatedDelivery } = await req.json();
          
          // Insert delay notification
          const { error } = await supabaseClient
            .from('order_tracking_events')
            .insert({
              order_id: orderId,
              event_type: 'delay_notification',
              event_data: {
                reason: delayReason,
                new_estimated_delivery: newEstimatedDelivery,
                status: 'delayed'
              },
              estimated_delivery: newEstimatedDelivery,
              created_by: user.id
            });

          if (error) {
            console.error('Delay notification error:', error);
            return new Response(
              JSON.stringify({ error: 'Failed to send delay notification' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Send communication to customer
          const { error: commError } = await supabaseClient
            .from('order_communications')
            .insert({
              order_id: orderId,
              communication_type: 'sms',
              recipient_type: 'customer',
              recipient_id: user.id,
              subject: 'Delivery Delay Notification',
              message_content: `Your order delivery has been delayed. New estimated delivery: ${newEstimatedDelivery}. Reason: ${delayReason}`,
              template_id: 'delay_notification',
              metadata: { delayReason, newEstimatedDelivery }
            });

          return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});