import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, searchContext } = await req.json();
    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');

    if (!deepseekApiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are an intelligent search assistant for GetIt, a multi-vendor ecommerce platform in Bangladesh. 
            Analyze search queries and provide:
            1. Enhanced search suggestions
            2. Product recommendations based on query intent
            3. Category suggestions
            4. Price range estimates
            5. Related search terms
            
            Always respond in JSON format with structured data for ecommerce search enhancement.
            Consider local Bangladesh market preferences, popular brands, and seasonal trends.`
          },
          {
            role: 'user',
            content: `Search query: "${query}"
            Context: ${JSON.stringify(searchContext || {})}
            
            Provide intelligent search enhancement suggestions.`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DeepSeek API error:', errorData);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse AI response and structure it for search enhancement
    let structuredResponse;
    try {
      structuredResponse = JSON.parse(aiResponse);
    } catch {
      // Fallback if AI doesn't return valid JSON
      structuredResponse = {
        enhancedQuery: query,
        suggestions: [query + " price", query + " review", query + " buy online"],
        categories: [],
        priceRange: null,
        intent: "product"
      };
    }

    return new Response(
      JSON.stringify({
        enhancedQuery: structuredResponse.enhancedQuery || query,
        suggestions: structuredResponse.suggestions || [],
        categories: structuredResponse.categories || [],
        priceRange: structuredResponse.priceRange || null,
        intent: structuredResponse.intent || "product",
        relatedTerms: structuredResponse.relatedTerms || [],
        aiProvider: "deepseek"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in deepseek-search function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Search enhancement failed', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});