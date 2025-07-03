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
      return new Response(JSON.stringify({ status: 'healthy', service: 'ai-enhanced-search' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Route search operations
    switch (endpoint) {
      case 'search':
        const searchResults = await performSearch(supabase, data);
        
        // Log search query
        await supabase.from('search_queries').insert({
          query: data.query,
          user_id: data.userId,
          results_count: searchResults.length,
          search_type: data.searchType || 'text',
          filters: data.filters || {}
        });
        
        return new Response(JSON.stringify({ data: searchResults }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'search/suggestions':
        const suggestions = await generateSuggestions(supabase, data.query);
        
        return new Response(JSON.stringify({ data: suggestions }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'search/autocomplete':
        const autocomplete = await getAutocomplete(supabase, data.query);
        
        return new Response(JSON.stringify({ data: autocomplete }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'search/trending':
        const { data: trending, error: trendingError } = await supabase
          .from('search_queries')
          .select('query, count(*)')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .limit(10);
        
        return new Response(JSON.stringify({ data: trending, error: trendingError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'search/filters':
        const filters = await getSearchFilters(supabase);
        
        return new Response(JSON.stringify({ data: filters }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('AI search error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function performSearch(supabase: any, data: any) {
  const { query, filters = {}, limit = 20, searchType = 'text' } = data;
  
  let searchQuery = supabase
    .from('products')
    .select(`
      *,
      vendors(business_name),
      product_inventory(current_stock)
    `);

  // Text search
  if (query) {
    searchQuery = searchQuery.or(
      `name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`
    );
  }

  // Apply filters
  if (filters.category) {
    searchQuery = searchQuery.ilike('category_path', `%${filters.category}%`);
  }
  
  if (filters.priceMin) {
    searchQuery = searchQuery.gte('price', filters.priceMin);
  }
  
  if (filters.priceMax) {
    searchQuery = searchQuery.lte('price', filters.priceMax);
  }
  
  if (filters.vendor) {
    searchQuery = searchQuery.eq('vendor_id', filters.vendor);
  }
  
  if (filters.inStock) {
    searchQuery = searchQuery.gt('product_inventory.current_stock', 0);
  }

  // Execute search
  const { data: products, error } = await searchQuery
    .eq('status', 'published')
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return products || [];
}

async function generateSuggestions(supabase: any, query: string) {
  if (!query || query.length < 2) {
    return [];
  }

  // Get product name suggestions
  const { data: products } = await supabase
    .from('products')
    .select('name')
    .ilike('name', `%${query}%`)
    .limit(5);

  // Get category suggestions
  const { data: categories } = await supabase
    .from('product_categories')
    .select('name')
    .ilike('name', `%${query}%`)
    .limit(3);

  return [
    ...(products?.map((p: any) => ({ type: 'product', text: p.name })) || []),
    ...(categories?.map((c: any) => ({ type: 'category', text: c.name })) || [])
  ];
}

async function getAutocomplete(supabase: any, query: string) {
  if (!query || query.length < 2) {
    return [];
  }

  const { data: recent } = await supabase
    .from('search_queries')
    .select('query')
    .ilike('query', `%${query}%`)
    .limit(5)
    .order('created_at', { ascending: false });

  return recent?.map((r: any) => r.query) || [];
}

async function getSearchFilters(supabase: any) {
  // Get available categories
  const { data: categories } = await supabase
    .from('product_categories')
    .select('id, name, parent_id')
    .order('name');

  // Get price ranges
  const { data: priceStats } = await supabase
    .from('products')
    .select('price')
    .not('price', 'is', null);

  const prices = priceStats?.map((p: any) => p.price) || [];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Get popular brands/vendors
  const { data: vendors } = await supabase
    .from('vendors')
    .select('id, business_name')
    .eq('status', 'approved')
    .limit(20);

  return {
    categories: categories || [],
    priceRange: { min: minPrice, max: maxPrice },
    vendors: vendors || []
  };
}