import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://deno.land/x/supabase@1.0.0/mod.ts";

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
      return new Response(JSON.stringify({ status: 'healthy', service: 'orders-api' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Route order operations
    switch (endpoint) {
      case 'orders':
        let query = supabase.from('orders').select(`
          *,
          order_items(*),
          order_tracking(*)
        `);
        
        if (data?.customer_id) {
          query = query.eq('customer_id', data.customer_id);
        }
        if (data?.vendor_id) {
          query = query.eq('vendor_id', data.vendor_id);
        }
        if (data?.status) {
          query = query.eq('status', data.status);
        }
        if (data?.limit) {
          query = query.limit(data.limit);
        }
        
        const { data: orders, error: ordersError } = await query.order('created_at', { ascending: false });
        
        return new Response(JSON.stringify({ data: orders, error: ordersError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'order/create':
        const { data: newOrder, error: createError } = await supabase
          .from('orders')
          .insert(data.orderData)
          .select()
          .single();
        
        return new Response(JSON.stringify({ data: newOrder, error: createError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'order/update':
        const { data: updatedOrder, error: updateError } = await supabase
          .from('orders')
          .update(data.updates)
          .eq('id', data.orderId)
          .select()
          .single();
        
        return new Response(JSON.stringify({ data: updatedOrder, error: updateError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'order/tracking':
        const { data: tracking, error: trackingError } = await supabase
          .from('order_tracking')
          .select('*')
          .eq('order_id', data.orderId)
          .order('created_at', { ascending: false });
        
        return new Response(JSON.stringify({ data: tracking, error: trackingError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'order/analytics':
        // Get order analytics data
        const { data: analytics, error: analyticsError } = await supabase
          .rpc('get_order_analytics', { period: data?.period || 'month' });
        
        return new Response(JSON.stringify({ data: analytics, error: analyticsError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('Orders API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});