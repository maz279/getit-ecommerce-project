import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (req.method === "GET") {
      console.log(`Search API - Query: ${query}, Category: ${category}, Price Range: ${minPrice}-${maxPrice}`);
      
      // Search products with filters
      let productsQuery = supabaseClient
        .from('products')
        .select(`
          *,
          categories!inner(name, slug),
          vendors(name, slug)
        `)
        .eq('is_active', true);

      // Add text search if query provided
      if (query) {
        productsQuery = productsQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      }

      // Add category filter
      if (category) {
        productsQuery = productsQuery.eq('categories.slug', category);
      }

      // Add price filters
      if (minPrice) {
        productsQuery = productsQuery.gte('price', parseFloat(minPrice));
      }
      if (maxPrice) {
        productsQuery = productsQuery.lte('price', parseFloat(maxPrice));
      }

      // Add pagination
      productsQuery = productsQuery
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      const { data: products, error: productsError, count } = await productsQuery;

      if (productsError) {
        console.error('Search API Error:', productsError);
        return new Response(
          JSON.stringify({ error: 'Failed to search products', details: productsError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      // Search categories if no specific filters
      let categories = [];
      if (!category && query) {
        const { data: categoryData } = await supabaseClient
          .from('categories')
          .select('*')
          .ilike('name', `%${query}%`)
          .eq('is_active', true)
          .limit(5);
        categories = categoryData || [];
      }

      // Search vendors if no specific filters
      let vendors = [];
      if (query) {
        const { data: vendorData } = await supabaseClient
          .from('vendors')
          .select('*')
          .ilike('name', `%${query}%`)
          .eq('is_active', true)
          .limit(5);
        vendors = vendorData || [];
      }

      // Get search suggestions
      const suggestions = [];
      if (query.length >= 2) {
        const { data: suggestionData } = await supabaseClient
          .from('products')
          .select('name')
          .ilike('name', `%${query}%`)
          .eq('is_active', true)
          .limit(5);
        
        if (suggestionData) {
          suggestions.push(...suggestionData.map(p => p.name));
        }
      }

      const response = {
        success: true,
        data: {
          products: products || [],
          categories,
          vendors,
          suggestions,
          pagination: {
            total: count || 0,
            limit,
            offset,
            hasMore: (count || 0) > offset + limit
          }
        }
      };

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Handle search analytics/logging
    if (req.method === "POST") {
      const { searchTerm, userId, resultCount, filters } = await req.json();
      
      // Log search query for analytics
      const { error: logError } = await supabaseClient
        .from('search_queries')
        .insert({
          search_term: searchTerm,
          user_id: userId,
          result_count: resultCount,
          filters: filters || {},
          created_at: new Date().toISOString()
        });

      if (logError) {
        console.error('Search logging error:', logError);
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Search logged' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error('Search API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});