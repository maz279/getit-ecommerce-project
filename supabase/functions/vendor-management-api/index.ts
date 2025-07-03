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
      return new Response(JSON.stringify({ status: 'healthy', service: 'vendor-management-api' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Route vendor management operations
    switch (endpoint) {
      case 'vendors':
        let query = supabase.from('vendors').select('*');
        
        if (data?.status) {
          query = query.eq('status', data.status);
        }
        if (data?.limit) {
          query = query.limit(data.limit);
        }
        
        const { data: vendors, error: vendorsError } = await query;
        
        return new Response(JSON.stringify({ data: vendors, error: vendorsError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'vendor/create':
        const { data: newVendor, error: createError } = await supabase
          .from('vendors')
          .insert(data.vendorData)
          .select()
          .single();
        
        return new Response(JSON.stringify({ data: newVendor, error: createError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'vendor/update':
        const { data: updatedVendor, error: updateError } = await supabase
          .from('vendors')
          .update(data.updates)
          .eq('id', data.vendorId)
          .select()
          .single();
        
        return new Response(JSON.stringify({ data: updatedVendor, error: updateError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'vendor/analytics':
        // Get vendor performance analytics
        const { data: analytics, error: analyticsError } = await supabase
          .from('vendor_analytics')
          .select('*')
          .eq('vendor_id', data.vendorId);
        
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
    console.error('Vendor management error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});