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
      return new Response(JSON.stringify({ status: 'healthy', service: 'product-service' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Route product operations
    switch (endpoint) {
      case 'products':
        let query = supabase.from('products').select('*');
        
        if (data?.category) {
          query = query.ilike('category_path', `%${data.category}%`);
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
        
        const { data: products, error: productsError } = await query;
        
        return new Response(JSON.stringify({ data: products, error: productsError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'product/create':
        const { data: newProduct, error: createError } = await supabase
          .from('products')
          .insert(data.productData)
          .select()
          .single();
        
        return new Response(JSON.stringify({ data: newProduct, error: createError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'product/update':
        const { data: updatedProduct, error: updateError } = await supabase
          .from('products')
          .update(data.updates)
          .eq('id', data.productId)
          .select()
          .single();
        
        return new Response(JSON.stringify({ data: updatedProduct, error: updateError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'product/inventory':
        const { data: inventory, error: inventoryError } = await supabase
          .from('product_inventory')
          .select('*')
          .eq('product_id', data.productId);
        
        return new Response(JSON.stringify({ data: inventory, error: inventoryError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'categories':
        const { data: categories, error: categoriesError } = await supabase
          .from('product_categories')
          .select('*')
          .order('name');
        
        return new Response(JSON.stringify({ data: categories, error: categoriesError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('Product service error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});