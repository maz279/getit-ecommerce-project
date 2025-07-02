import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    console.log(`Elasticsearch Search Service: ${method} ${path}`);

    // Advanced Product Search
    if (path === '/elasticsearch-search/products' && method === 'GET') {
      const query = url.searchParams.get('q') || '';
      const categories = url.searchParams.get('categories')?.split(',') || [];
      const brands = url.searchParams.get('brands')?.split(',') || [];
      const minPrice = parseFloat(url.searchParams.get('min_price') || '0');
      const maxPrice = parseFloat(url.searchParams.get('max_price') || '999999');
      const rating = parseFloat(url.searchParams.get('min_rating') || '0');
      const sortBy = url.searchParams.get('sort_by') || 'relevance';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = (page - 1) * limit;

      // Enhanced PostgreSQL search with full-text search
      let searchQuery = supabase
        .from('products')
        .select(`
          *,
          brands(name, logo_url, is_verified),
          product_categories_enhanced(name, slug)
        `)
        .eq('status', 'active');

      // Advanced text search using PostgreSQL full-text search
      if (query) {
        searchQuery = searchQuery.or(`
          name.ilike.%${query}%,
          description.ilike.%${query}%,
          tags.cs.{${query}},
          searchable_content.fts.${query.split(' ').join('&')}
        `);
      }

      // Filter by categories
      if (categories.length > 0) {
        searchQuery = searchQuery.in('category_id', categories);
      }

      // Filter by brands
      if (brands.length > 0) {
        searchQuery = searchQuery.in('brand_id', brands);
      }

      // Price range filter
      searchQuery = searchQuery
        .gte('price', minPrice)
        .lte('price', maxPrice);

      // Rating filter
      if (rating > 0) {
        searchQuery = searchQuery.gte('rating_average', rating);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price_low':
          searchQuery = searchQuery.order('price', { ascending: true });
          break;
        case 'price_high':
          searchQuery = searchQuery.order('price', { ascending: false });
          break;
        case 'rating':
          searchQuery = searchQuery.order('rating_average', { ascending: false });
          break;
        case 'newest':
          searchQuery = searchQuery.order('created_at', { ascending: false });
          break;
        case 'popularity':
          searchQuery = searchQuery.order('sales_count', { ascending: false });
          break;
        case 'discount':
          searchQuery = searchQuery.order('compare_price', { ascending: false });
          break;
        default: // relevance
          if (query) {
            searchQuery = searchQuery.order('view_count', { ascending: false });
          } else {
            searchQuery = searchQuery.order('created_at', { ascending: false });
          }
      }

      const { data: products, error, count } = await searchQuery
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Product search error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get search aggregations for faceted search
      const { data: categoryAggs } = await supabase
        .from('products')
        .select('category_id, product_categories_enhanced(name)')
        .eq('status', 'active');

      const { data: brandAggs } = await supabase
        .from('products')
        .select('brand_id, brands(name)')
        .eq('status', 'active');

      // Calculate price ranges
      const { data: priceStats } = await supabase
        .from('products')
        .select('price')
        .eq('status', 'active')
        .order('price', { ascending: true });

      const priceRanges = [
        { label: 'Under ৳500', min: 0, max: 500, count: priceStats?.filter(p => p.price < 500).length || 0 },
        { label: '৳500 - ৳1000', min: 500, max: 1000, count: priceStats?.filter(p => p.price >= 500 && p.price < 1000).length || 0 },
        { label: '৳1000 - ৳5000', min: 1000, max: 5000, count: priceStats?.filter(p => p.price >= 1000 && p.price < 5000).length || 0 },
        { label: '৳5000+', min: 5000, max: 999999, count: priceStats?.filter(p => p.price >= 5000).length || 0 }
      ];

      // Log search analytics
      if (query) {
        await supabase.from('search_queries').insert({
          query,
          results_count: count || 0,
          filters: {
            categories,
            brands,
            min_price: minPrice,
            max_price: maxPrice,
            min_rating: rating,
            sort_by: sortBy
          },
          ip_address: req.headers.get('x-forwarded-for'),
          user_agent: req.headers.get('user-agent')
        });
      }

      return new Response(JSON.stringify({
        products,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil((count || 0) / limit)
        },
        facets: {
          categories: categoryAggs || [],
          brands: brandAggs || [],
          price_ranges: priceRanges,
          ratings: [
            { label: '4+ Stars', value: 4, count: products?.filter(p => p.rating_average >= 4).length || 0 },
            { label: '3+ Stars', value: 3, count: products?.filter(p => p.rating_average >= 3).length || 0 },
            { label: '2+ Stars', value: 2, count: products?.filter(p => p.rating_average >= 2).length || 0 }
          ]
        },
        filters_applied: { query, categories, brands, minPrice, maxPrice, rating, sortBy }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Search Suggestions/Autocomplete
    if (path === '/elasticsearch-search/suggestions' && method === 'GET') {
      const query = url.searchParams.get('q') || '';
      const limit = parseInt(url.searchParams.get('limit') || '10');

      if (!query || query.length < 2) {
        return new Response(JSON.stringify({ suggestions: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get product name suggestions
      const { data: productSuggestions } = await supabase
        .from('products')
        .select('name')
        .ilike('name', `%${query}%`)
        .eq('status', 'active')
        .limit(5);

      // Get category suggestions
      const { data: categorySuggestions } = await supabase
        .from('product_categories_enhanced')
        .select('name')
        .ilike('name', `%${query}%`)
        .eq('is_active', true)
        .limit(3);

      // Get brand suggestions
      const { data: brandSuggestions } = await supabase
        .from('brands')
        .select('name')
        .ilike('name', `%${query}%`)
        .limit(3);

      // Get popular search terms
      const { data: popularSearches } = await supabase
        .from('search_queries')
        .select('query')
        .ilike('query', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(5);

      const suggestions = [
        ...productSuggestions?.map(p => ({ text: p.name, type: 'product' })) || [],
        ...categorySuggestions?.map(c => ({ text: c.name, type: 'category' })) || [],
        ...brandSuggestions?.map(b => ({ text: b.name, type: 'brand' })) || [],
        ...popularSearches?.map(s => ({ text: s.query, type: 'search' })) || []
      ].slice(0, limit);

      return new Response(JSON.stringify({ suggestions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Visual Search (placeholder for future ML integration)
    if (path === '/elasticsearch-search/visual' && method === 'POST') {
      const { image_url, user_id } = await req.json();

      // For now, return similar products based on category matching
      // In a real implementation, this would use ML vision models
      const similarProducts = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('sales_count', { ascending: false })
        .limit(10);

      // Log visual search for future ML training
      await supabase.from('user_product_interactions').insert({
        user_id,
        product_id: null,
        interaction_type: 'visual_search',
        interaction_metadata: {
          image_url,
          timestamp: new Date().toISOString()
        }
      });

      return new Response(JSON.stringify({
        products: similarProducts.data || [],
        message: 'Visual search is currently in beta. Results are based on popularity.',
        confidence: 0.7
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Elasticsearch Search Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});