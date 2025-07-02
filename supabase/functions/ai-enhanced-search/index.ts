import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      query, 
      searchType = 'semantic',
      userId,
      filters = {},
      limit = 20 
    } = await req.json();

    console.log('Enhanced search request:', { query, searchType, userId });

    let results = [];
    let searchTimeStart = Date.now();

    // Check cache first
    const queryHash = await generateQueryHash(query + JSON.stringify(filters));
    const { data: cachedResult } = await supabase
      .from('ai_search_cache')
      .select('*')
      .eq('query_hash', queryHash)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cachedResult) {
      console.log('Returning cached search results');
      await updateCacheUsage(cachedResult.id);
      
      return new Response(JSON.stringify({
        success: true,
        results: cachedResult.ai_suggestions,
        search_type: searchType,
        cached: true,
        search_time_ms: Date.now() - searchTimeStart
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Enhance query with AI if semantic search
    let enhancedQuery = query;
    let semanticTokens = [];
    
    if (searchType === 'semantic' && openAIApiKey) {
      const aiEnhancement = await enhanceQueryWithAI(query);
      enhancedQuery = aiEnhancement.enhanced_query;
      semanticTokens = aiEnhancement.tokens;
    }

    // Perform different types of search
    switch (searchType) {
      case 'semantic':
        results = await performSemanticSearch(enhancedQuery, filters, limit);
        break;
      case 'visual':
        results = await performVisualSearch(query, filters, limit);
        break;
      case 'voice':
        results = await performVoiceSearch(query, filters, limit);
        break;
      default:
        results = await performTextSearch(enhancedQuery, filters, limit);
    }

    // Apply ML ranking
    if (results.length > 0 && userId) {
      results = await applyMLRanking(results, userId);
    }

    const searchTimeMs = Date.now() - searchTimeStart;

    // Cache results
    await cacheSearchResults(queryHash, query, enhancedQuery, semanticTokens, results);

    // Log search analytics
    await logSearchQuery(userId, query, searchType, results.length, searchTimeMs);

    return new Response(JSON.stringify({
      success: true,
      results: results.slice(0, limit),
      enhanced_query: enhancedQuery,
      semantic_tokens: semanticTokens,
      search_type: searchType,
      total_results: results.length,
      search_time_ms: searchTimeMs,
      cached: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in enhanced search:', error);
    return new Response(JSON.stringify({ 
      error: 'Search failed',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function enhanceQueryWithAI(query) {
  if (!openAIApiKey) return { enhanced_query: query, tokens: [] };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are a search query enhancement AI. Transform user queries into better search terms and extract semantic tokens. Return JSON with enhanced_query and tokens array.'
          },
          {
            role: 'user',
            content: `Enhance this search query for an e-commerce platform: "${query}"`
          }
        ],
        max_tokens: 200
      })
    });

    const result = await response.json();
    const enhancement = JSON.parse(result.choices[0]?.message?.content || '{}');
    
    return {
      enhanced_query: enhancement.enhanced_query || query,
      tokens: enhancement.tokens || []
    };
  } catch (error) {
    console.error('AI query enhancement failed:', error);
    return { enhanced_query: query, tokens: [] };
  }
}

async function performSemanticSearch(query, filters, limit) {
  console.log('Performing semantic search for:', query);
  
  // Full-text search on products with ranking
  let searchQuery = supabase
    .from('products')
    .select(`
      *,
      categories(name),
      vendors(name, rating)
    `)
    .eq('is_active', true)
    .textSearch('searchable_content', query, { config: 'english' })
    .order('rating', { ascending: false })
    .limit(limit);

  // Apply filters
  if (filters.category_id) {
    searchQuery = searchQuery.eq('category_id', filters.category_id);
  }
  if (filters.price_min) {
    searchQuery = searchQuery.gte('price', filters.price_min);
  }
  if (filters.price_max) {
    searchQuery = searchQuery.lte('price', filters.price_max);
  }
  if (filters.vendor_id) {
    searchQuery = searchQuery.eq('vendor_id', filters.vendor_id);
  }

  const { data, error } = await searchQuery;
  
  if (error) {
    console.error('Semantic search error:', error);
    return [];
  }

  return data || [];
}

async function performVisualSearch(imageData, filters, limit) {
  console.log('Performing visual search');
  
  // For visual search, we would typically use an AI vision model
  // For now, return products from similar categories based on image analysis
  
  try {
    if (openAIApiKey && imageData.startsWith('data:image')) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'Analyze this image and return relevant product search terms as JSON array.'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'What products are shown in this image?' },
                { type: 'image_url', image_url: { url: imageData } }
              ]
            }
          ],
          max_tokens: 100
        })
      });

      const result = await response.json();
      const searchTerms = JSON.parse(result.choices[0]?.message?.content || '[]');
      
      if (searchTerms.length > 0) {
        return await performSemanticSearch(searchTerms.join(' '), filters, limit);
      }
    }
  } catch (error) {
    console.error('Visual search AI failed:', error);
  }

  // Fallback to popular products
  const { data } = await supabase
    .from('products')
    .select('*, categories(name), vendors(name, rating)')
    .eq('is_active', true)
    .order('view_count', { ascending: false })
    .limit(limit);

  return data || [];
}

async function performVoiceSearch(audioQuery, filters, limit) {
  console.log('Performing voice search');
  
  // For voice search, audioQuery would be transcribed text
  // Use the same semantic search with the transcribed text
  return await performSemanticSearch(audioQuery, filters, limit);
}

async function performTextSearch(query, filters, limit) {
  console.log('Performing text search for:', query);
  
  const { data } = await supabase
    .from('products')
    .select(`
      *,
      categories(name),
      vendors(name, rating)
    `)
    .eq('is_active', true)
    .ilike('name', `%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  return data || [];
}

async function applyMLRanking(results, userId) {
  // Get user preferences from behavior data
  const { data: userBehaviors } = await supabase
    .from('user_behaviors')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(50);

  if (!userBehaviors?.length) return results;

  // Extract user preferences
  const viewedCategories = userBehaviors
    .filter(b => b.event_type === 'product_view')
    .map(b => b.event_data?.category_id)
    .filter(Boolean);

  const preferredVendors = userBehaviors
    .filter(b => b.vendor_id)
    .map(b => b.vendor_id);

  // Score and rerank results
  return results
    .map(product => ({
      ...product,
      ml_score: calculateMLScore(product, viewedCategories, preferredVendors)
    }))
    .sort((a, b) => b.ml_score - a.ml_score);
}

function calculateMLScore(product, userCategories, userVendors) {
  let score = 0;
  
  // Category preference boost
  if (userCategories.includes(product.category_id)) {
    score += 0.3;
  }
  
  // Vendor preference boost
  if (userVendors.includes(product.vendor_id)) {
    score += 0.2;
  }
  
  // Rating boost
  score += (product.rating || 0) * 0.1;
  
  // Popularity boost
  score += Math.min((product.view_count || 0) / 1000, 0.2);
  
  return score;
}

async function generateQueryHash(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function cacheSearchResults(queryHash, originalQuery, enhancedQuery, semanticTokens, results) {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 2); // 2 hour cache

  await supabase
    .from('ai_search_cache')
    .upsert({
      query_hash: queryHash,
      original_query: originalQuery,
      enhanced_query: enhancedQuery,
      semantic_tokens: semanticTokens,
      ai_suggestions: results,
      expires_at: expiresAt.toISOString()
    });
}

async function updateCacheUsage(cacheId) {
  await supabase.rpc('increment_cache_usage', { cache_id: cacheId });
}

async function logSearchQuery(userId, query, queryType, resultsCount, searchTimeMs) {
  await supabase
    .from('search_queries')
    .insert({
      user_id: userId,
      query: query,
      query_type: queryType,
      results_count: resultsCount,
      search_time_ms: searchTimeMs,
      session_id: `session_${Date.now()}`
    });
}