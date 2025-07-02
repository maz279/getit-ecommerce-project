import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  type?: 'text' | 'voice' | 'image' | 'ai';
  filters?: Record<string, any>;
  page?: number;
  limit?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const {
      query,
      type = 'text',
      filters = {},
      page = 1,
      limit = 20
    }: SearchRequest = await req.json();

    const startTime = Date.now();
    const sessionId = crypto.randomUUID();

    // Check AI cache first
    const queryHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(query.toLowerCase())
    );
    const hashArray = Array.from(new Uint8Array(queryHash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    let enhancedQuery = query;
    let aiSuggestions: string[] = [];

    // Check cache
    const { data: cachedResult } = await supabase
      .from('ai_search_cache')
      .select('*')
      .eq('query_hash', hashHex)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cachedResult) {
      enhancedQuery = cachedResult.enhanced_query;
      aiSuggestions = cachedResult.ai_suggestions;
      
      // Update usage count
      await supabase
        .from('ai_search_cache')
        .update({ usage_count: cachedResult.usage_count + 1 })
        .eq('id', cachedResult.id);
    } else if (type === 'ai' || query.length > 50) {
      // Enhanced AI processing for complex queries
      try {
        const openAIKey = Deno.env.get('OPENAI_API_KEY');
        if (openAIKey) {
          const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: 'You are a search query optimizer for an e-commerce platform. Transform user queries into optimized search terms and suggest related keywords. Return JSON with "enhanced_query" and "suggestions" array.'
                },
                {
                  role: 'user',
                  content: `Optimize this search query: "${query}"`
                }
              ],
              max_tokens: 300,
              temperature: 0.3
            })
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            const aiResult = JSON.parse(aiData.choices[0].message.content);
            enhancedQuery = aiResult.enhanced_query || query;
            aiSuggestions = aiResult.suggestions || [];

            // Cache the result
            await supabase.from('ai_search_cache').insert({
              query_hash: hashHex,
              original_query: query,
              enhanced_query: enhancedQuery,
              ai_suggestions: aiSuggestions,
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            });
          }
        }
      } catch (error) {
        console.error('AI enhancement failed:', error);
      }
    }

    // Perform the actual search with enhanced query
    const searchTerms = enhancedQuery.toLowerCase().split(' ').filter(term => term.length > 2);
    
    let searchQuery = supabase
      .from('products')
      .select(`
        *,
        categories(name, slug),
        vendors(business_name, rating)
      `);

    // Apply text search
    if (searchTerms.length > 0) {
      const searchCondition = searchTerms
        .map(term => `name.ilike.%${term}%,description.ilike.%${term}%,tags.cs.{${term}}`)
        .join(',');
      searchQuery = searchQuery.or(searchCondition);
    }

    // Apply filters
    if (filters.category) {
      searchQuery = searchQuery.eq('category_id', filters.category);
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

    // Apply pagination
    const offset = (page - 1) * limit;
    searchQuery = searchQuery
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    const { data: products, error } = await searchQuery;

    if (error) {
      throw error;
    }

    const searchDuration = Date.now() - startTime;

    // Log search analytics
    await supabase.from('search_analytics').insert({
      session_id: sessionId,
      search_query: query,
      search_type: type,
      filters_applied: filters,
      results_count: products?.length || 0,
      search_duration_ms: searchDuration,
      ai_enhancement_used: type === 'ai' || !!cachedResult,
      ai_suggestions: aiSuggestions
    });

    return new Response(JSON.stringify({
      results: products || [],
      total: products?.length || 0,
      page,
      limit,
      search_duration_ms: searchDuration,
      enhanced_query: enhancedQuery !== query ? enhancedQuery : undefined,
      ai_suggestions: aiSuggestions.length > 0 ? aiSuggestions : undefined,
      session_id: sessionId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      results: [],
      total: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});