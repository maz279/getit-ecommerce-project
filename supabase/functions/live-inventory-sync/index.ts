import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { action, data } = await req.json();

    switch (action) {
      case 'updateStock': {
        const { productId, newStock } = data;
        
        const { data: inventory, error } = await supabaseClient
          .from('product_inventory')
          .update({ current_stock: newStock })
          .eq('product_id', productId)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, inventory }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'getLiveInventory': {
        const { data: inventory, error } = await supabaseClient
          .from('product_inventory')
          .select(`*, products!inner(*)`)
          .limit(50);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, inventory }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});