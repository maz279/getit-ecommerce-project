import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Product {
  id?: string;
  name: string;
  name_bn?: string;
  description?: string;
  description_bn?: string;
  sku: string;
  price: number;
  stock_quantity: number;
  images: string[];
  category_id: string;
  vendor_id: string;
  is_active?: boolean;
  featured?: boolean;
  is_new?: boolean;
}

interface ProductFilters {
  category_id?: string;
  vendor_id?: string;
  min_price?: number;
  max_price?: number;
  is_active?: boolean;
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
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

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    const method = req.method;

    console.log(`Products API - ${method} ${path}`);

    // GET /products-api - List products with filters
    if (method === 'GET' && !path) {
      const filters: ProductFilters = {};
      
      // Parse query parameters
      for (const [key, value] of url.searchParams.entries()) {
        if (key === 'limit' || key === 'offset') {
          filters[key] = parseInt(value);
        } else if (key === 'min_price' || key === 'max_price') {
          filters[key] = parseFloat(value);
        } else if (key === 'is_active' || key === 'featured') {
          filters[key] = value === 'true';
        } else {
          filters[key as keyof ProductFilters] = value;
        }
      }

      let query = supabase
        .from('products')
        .select(`
          *,
          categories!inner(id, name, name_bn),
          vendors!inner(id, business_name, logo, rating)
        `);

      // Apply filters
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters.vendor_id) {
        query = query.eq('vendor_id', filters.vendor_id);
      }
      if (filters.min_price !== undefined) {
        query = query.gte('price', filters.min_price);
      }
      if (filters.max_price !== undefined) {
        query = query.lte('price', filters.max_price);
      }
      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }
      if (filters.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%, description.ilike.%${filters.search}%`);
      }

      // Apply pagination
      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
      } else if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /products-api/{id} - Get single product
    if (method === 'GET' && path) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories!inner(id, name, name_bn),
          vendors!inner(id, business_name, logo, rating, total_sales)
        `)
        .eq('id', path)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return new Response(JSON.stringify({ error: 'Product not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /products-api - Create new product
    if (method === 'POST') {
      const product: Product = await req.json();

      // Validate required fields
      if (!product.name || !product.sku || !product.price || !product.category_id || !product.vendor_id) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if SKU already exists
      const { data: existingSku } = await supabase
        .from('products')
        .select('sku')
        .eq('sku', product.sku)
        .single();

      if (existingSku) {
        return new Response(JSON.stringify({ error: 'SKU already exists' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...product,
          is_active: product.is_active ?? true,
          featured: product.featured ?? false,
          is_new: product.is_new ?? true,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating product:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Product created successfully:', data.id);
      return new Response(JSON.stringify({ data }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT /products-api/{id} - Update product
    if (method === 'PUT' && path) {
      const updates: Partial<Product> = await req.json();

      // Check if SKU change conflicts with existing
      if (updates.sku) {
        const { data: existingSku } = await supabase
          .from('products')
          .select('id, sku')
          .eq('sku', updates.sku)
          .neq('id', path)
          .single();

        if (existingSku) {
          return new Response(JSON.stringify({ error: 'SKU already exists' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', path)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Product updated successfully:', path);
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /products-api/{id} - Delete product
    if (method === 'DELETE' && path) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', path);

      if (error) {
        console.error('Error deleting product:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Product deleted successfully:', path);
      return new Response(JSON.stringify({ message: 'Product deleted successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Products API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});