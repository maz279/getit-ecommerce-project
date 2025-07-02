import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  searchType: 'text' | 'voice' | 'visual' | 'bengali_phonetic';
  filters?: {
    category?: string;
    priceRange?: { min: number; max: number };
    vendor?: string;
    rating?: number;
    location?: string;
  };
  language?: 'en' | 'bn';
  userId?: string;
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      query, 
      searchType, 
      filters = {}, 
      language = 'en', 
      userId, 
      page = 1, 
      limit = 20 
    }: SearchRequest = await req.json();

    console.log('Enhanced Search Request:', { query, searchType, filters, language });

    let searchResults;
    
    // Process different search types
    switch (searchType) {
      case 'bengali_phonetic':
        searchResults = await performBengaliPhoneticSearch(supabase, query, filters, page, limit);
        break;
      
      case 'voice':
        // Convert voice to text first (would integrate with speech-to-text service)
        searchResults = await performTextSearch(supabase, query, filters, page, limit, language);
        break;
      
      case 'visual':
        // Extract features from image and find similar products
        searchResults = await performVisualSearch(supabase, query, filters, page, limit);
        break;
      
      case 'text':
      default:
        searchResults = await performTextSearch(supabase, query, filters, page, limit, language);
        break;
    }

    // Store search query for analytics
    if (userId) {
      await supabase
        .from('search_queries')
        .insert({
          user_id: userId,
          query,
          search_type: searchType,
          filters,
          results_count: searchResults.length,
          language
        });
    }

    // Get AI-powered recommendations based on search
    const recommendations = await getSearchRecommendations(supabase, query, userId, searchResults);

    return new Response(JSON.stringify({
      success: true,
      data: {
        results: searchResults,
        recommendations,
        totalCount: searchResults.length,
        page,
        hasMore: searchResults.length === limit
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Enhanced Search Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Search failed' 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function performTextSearch(
  supabase: any, 
  query: string, 
  filters: any, 
  page: number, 
  limit: number,
  language: string
) {
  // Basic text search with PostgreSQL full-text search
  let searchQuery = supabase
    .from('products')
    .select(`
      *,
      categories (name, name_bn),
      vendors (business_name, rating)
    `);

  // Apply text search
  if (language === 'bn') {
    // Search Bengali fields
    searchQuery = searchQuery.or(`name_bn.ilike.%${query}%, description_bn.ilike.%${query}%`);
  } else {
    // Search English fields and use full-text search
    searchQuery = searchQuery.textSearch('searchable_content', query);
  }

  // Apply filters
  if (filters.category) {
    searchQuery = searchQuery.eq('category_id', filters.category);
  }
  
  if (filters.priceRange) {
    searchQuery = searchQuery
      .gte('price', filters.priceRange.min)
      .lte('price', filters.priceRange.max);
  }
  
  if (filters.vendor) {
    searchQuery = searchQuery.eq('vendor_id', filters.vendor);
  }
  
  if (filters.rating) {
    searchQuery = searchQuery.gte('average_rating', filters.rating);
  }

  // Pagination
  searchQuery = searchQuery
    .range((page - 1) * limit, page * limit - 1)
    .order('relevance', { ascending: false });

  const { data, error } = await searchQuery;
  
  if (error) throw error;
  
  return data || [];
}

async function performBengaliPhoneticSearch(
  supabase: any, 
  query: string, 
  filters: any, 
  page: number, 
  limit: number
) {
  // Convert Bengali phonetic to Bengali script
  const bengaliQuery = convertPhoneticToBengali(query);
  
  // Search with both original and converted query
  let searchQuery = supabase
    .from('products')
    .select(`
      *,
      categories (name, name_bn),
      vendors (business_name, rating)
    `)
    .or(`name_bn.ilike.%${query}%, name_bn.ilike.%${bengaliQuery}%, description_bn.ilike.%${query}%, description_bn.ilike.%${bengaliQuery}%`);

  // Apply filters and pagination
  if (filters.category) {
    searchQuery = searchQuery.eq('category_id', filters.category);
  }
  
  const { data, error } = await searchQuery
    .range((page - 1) * limit, page * limit - 1);
  
  if (error) throw error;
  
  return data || [];
}

async function performVisualSearch(
  supabase: any, 
  imageUrl: string, 
  filters: any, 
  page: number, 
  limit: number
) {
  // This would integrate with an image recognition service
  // For now, return similar products based on category
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (name, name_bn),
      vendors (business_name, rating)
    `)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  
  if (error) throw error;
  
  return data || [];
}

async function getSearchRecommendations(
  supabase: any, 
  query: string, 
  userId?: string, 
  searchResults: any[] = []
) {
  if (!userId) return [];

  // Get user's search history and preferences
  const { data: userRecommendations } = await supabase
    .from('product_recommendations')
    .select(`
      *,
      products (*)
    `)
    .eq('user_id', userId)
    .eq('recommendation_type', 'ai_personalized')
    .gte('expires_at', new Date().toISOString())
    .order('score', { ascending: false })
    .limit(5);

  return userRecommendations || [];
}

function convertPhoneticToBengali(phoneticText: string): string {
  // Simple phonetic to Bengali conversion
  // This should be replaced with a proper library like Avro or similar
  const phoneticMap: Record<string, string> = {
    'a': 'আ',
    'i': 'ই',
    'u': 'উ',
    'e': 'এ',
    'o': 'ও',
    'k': 'ক',
    'g': 'গ',
    'c': 'চ',
    'j': 'জ',
    't': 'ত',
    'd': 'দ',
    'n': 'ন',
    'p': 'প',
    'b': 'ব',
    'm': 'ম',
    'r': 'র',
    'l': 'ল',
    's': 'স',
    'h': 'হ'
  };

  return phoneticText
    .toLowerCase()
    .split('')
    .map(char => phoneticMap[char] || char)
    .join('');
}