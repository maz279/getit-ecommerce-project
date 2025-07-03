import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

interface VoiceSearchRequest {
  audio_data: string;
  user_id?: string;
  session_id: string;
  language?: string;
  context?: Record<string, any>;
}

interface VoiceSearchResult {
  transcribed_text: string;
  confidence_score: number;
  intent_classification: Record<string, any>;
  search_results: any[];
  suggestions: string[];
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

    const { action, data } = await req.json();

    switch (action) {
      case 'transcribe_audio':
        return await transcribeAudio(supabase, data);
      case 'process_voice_search':
        return await processVoiceSearch(supabase, data);
      case 'analyze_intent':
        return await analyzeIntent(supabase, data);
      case 'generate_suggestions':
        return await generateSuggestions(supabase, data);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Voice search error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function transcribeAudio(supabase: any, request: VoiceSearchRequest) {
  console.log('Transcribing audio for session:', request.session_id);

  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    // Convert base64 audio to blob
    const audioBuffer = Uint8Array.from(atob(request.audio_data), c => c.charCodeAt(0));
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });

    // Prepare form data for OpenAI Whisper API
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    if (request.language) {
      formData.append('language', request.language);
    }

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const transcriptionResult = await response.json();
    const transcribedText = transcriptionResult.text;

    // Store voice search analytics
    await supabase
      .from('voice_search_analytics')
      .insert({
        user_id: request.user_id,
        session_id: request.session_id,
        voice_query: 'audio_data',
        transcribed_text: transcribedText,
        confidence_score: 0.9, // Whisper generally has high confidence
        language_detected: request.language || 'auto'
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        transcribed_text: transcribedText,
        confidence_score: 0.9
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Audio transcription error:', error);
    throw error;
  }
}

async function processVoiceSearch(supabase: any, data: any) {
  console.log('Processing voice search:', data.query);

  // Analyze search intent
  const intent = await classifySearchIntent(data.query);
  
  // Perform search based on intent
  let searchResults = [];
  
  switch (intent.category) {
    case 'product_search':
      searchResults = await searchProducts(supabase, data.query, intent);
      break;
    case 'category_browse':
      searchResults = await browsecategories(supabase, data.query, intent);
      break;
    case 'vendor_search':
      searchResults = await searchVendors(supabase, data.query, intent);
      break;
    case 'navigation':
      searchResults = await handleNavigation(data.query, intent);
      break;
    default:
      searchResults = await performGeneralSearch(supabase, data.query);
  }

  // Generate voice-friendly suggestions
  const suggestions = await generateVoiceSuggestions(data.query, searchResults);

  const result: VoiceSearchResult = {
    transcribed_text: data.query,
    confidence_score: 0.9,
    intent_classification: intent,
    search_results: searchResults,
    suggestions: suggestions
  };

  // Update analytics
  await supabase
    .from('voice_search_analytics')
    .update({
      intent_classification: intent,
      search_results: searchResults.slice(0, 5), // Store top 5 results
      user_interaction: { results_found: searchResults.length }
    })
    .eq('session_id', data.session_id)
    .eq('transcribed_text', data.query);

  return new Response(
    JSON.stringify({ success: true, result }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function analyzeIntent(supabase: any, data: any) {
  console.log('Analyzing search intent for:', data.query);

  const intent = await classifySearchIntent(data.query);
  
  // Enhanced intent analysis with NLP
  const enhancedIntent = {
    ...intent,
    entities: extractEntities(data.query),
    sentiment: analyzeSentiment(data.query),
    urgency_level: detectUrgency(data.query),
    language_style: analyzeLanguageStyle(data.query)
  };

  return new Response(
    JSON.stringify({ success: true, intent: enhancedIntent }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateSuggestions(supabase: any, data: any) {
  console.log('Generating voice search suggestions');

  const suggestions = [
    "Try saying 'Show me electronics under 5000 taka'",
    "Say 'Find women's clothing from trusted vendors'",
    "Ask 'What are today's best deals?'",
    "Try 'Search for books by Bengali authors'",
    "Say 'Show me products with free delivery'",
    "Ask 'Find gift items under 1000 taka'",
    "Try 'Show me top-rated smartphones'",
    "Say 'Find traditional clothes for Eid'"
  ];

  // Personalize suggestions based on user history
  if (data.user_id) {
    const { data: userHistory } = await supabase
      .from('voice_search_analytics')
      .select('transcribed_text, intent_classification')
      .eq('user_id', data.user_id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (userHistory && userHistory.length > 0) {
      const personalizedSuggestions = generatePersonalizedSuggestions(userHistory);
      suggestions.unshift(...personalizedSuggestions);
    }
  }

  return new Response(
    JSON.stringify({ success: true, suggestions: suggestions.slice(0, 8) }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Helper functions
async function classifySearchIntent(query: string): Promise<Record<string, any>> {
  const lowerQuery = query.toLowerCase();
  
  // Product search patterns
  if (lowerQuery.includes('find') || lowerQuery.includes('search') || lowerQuery.includes('show me')) {
    if (lowerQuery.includes('phone') || lowerQuery.includes('electronics') || lowerQuery.includes('laptop')) {
      return { category: 'product_search', subcategory: 'electronics', confidence: 0.9 };
    }
    if (lowerQuery.includes('clothes') || lowerQuery.includes('fashion') || lowerQuery.includes('dress')) {
      return { category: 'product_search', subcategory: 'fashion', confidence: 0.9 };
    }
    if (lowerQuery.includes('book') || lowerQuery.includes('education')) {
      return { category: 'product_search', subcategory: 'books', confidence: 0.9 };
    }
    return { category: 'product_search', subcategory: 'general', confidence: 0.7 };
  }

  // Category browsing
  if (lowerQuery.includes('category') || lowerQuery.includes('browse') || lowerQuery.includes('explore')) {
    return { category: 'category_browse', confidence: 0.8 };
  }

  // Vendor search
  if (lowerQuery.includes('vendor') || lowerQuery.includes('seller') || lowerQuery.includes('shop')) {
    return { category: 'vendor_search', confidence: 0.8 };
  }

  // Navigation
  if (lowerQuery.includes('go to') || lowerQuery.includes('open') || lowerQuery.includes('navigate')) {
    return { category: 'navigation', confidence: 0.8 };
  }

  return { category: 'general_search', confidence: 0.6 };
}

async function searchProducts(supabase: any, query: string, intent: any): Promise<any[]> {
  // Extract search terms
  const searchTerms = extractSearchTerms(query);
  
  // Build search query
  let searchQuery = supabase
    .from('products')
    .select('id, name, description, price, vendor_id, image_url, rating')
    .limit(10);

  // Apply category filter if detected
  if (intent.subcategory && intent.subcategory !== 'general') {
    searchQuery = searchQuery.ilike('category', `%${intent.subcategory}%`);
  }

  // Apply text search
  if (searchTerms.length > 0) {
    searchQuery = searchQuery.or(
      searchTerms.map(term => `name.ilike.%${term}%,description.ilike.%${term}%`).join(',')
    );
  }

  const { data: products } = await searchQuery;
  return products || [];
}

async function browsecategories(supabase: any, query: string, intent: any): Promise<any[]> {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .limit(8);

  return categories || [];
}

async function searchVendors(supabase: any, query: string, intent: any): Promise<any[]> {
  const { data: vendors } = await supabase
    .from('vendors')
    .select('id, business_name, rating, total_products')
    .limit(8);

  return vendors || [];
}

async function handleNavigation(query: string, intent: any): Promise<any[]> {
  const navigationOptions = [
    { name: 'Home', path: '/', description: 'Go to homepage' },
    { name: 'Categories', path: '/categories', description: 'Browse all categories' },
    { name: 'Wishlist', path: '/wishlist', description: 'View your wishlist' },
    { name: 'Cart', path: '/cart', description: 'View shopping cart' },
    { name: 'Account', path: '/account', description: 'Manage your account' }
  ];

  return navigationOptions;
}

async function performGeneralSearch(supabase: any, query: string): Promise<any[]> {
  // Fallback general search
  const { data: products } = await supabase
    .from('products')
    .select('id, name, description, price, vendor_id, image_url, rating')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(10);

  return products || [];
}

async function generateVoiceSuggestions(query: string, results: any[]): Promise<string[]> {
  const suggestions = [];

  if (results.length > 0) {
    suggestions.push(`Found ${results.length} items. Say "show details" for more information.`);
    suggestions.push(`Say "filter by price" to narrow down results.`);
    suggestions.push(`Ask "which one is most popular?" for recommendations.`);
  } else {
    suggestions.push(`No results found for "${query}". Try different keywords.`);
    suggestions.push(`Say "show similar products" for alternatives.`);
    suggestions.push(`Ask "what's trending today?" for popular items.`);
  }

  return suggestions;
}

function extractSearchTerms(query: string): string[] {
  // Remove common words and extract meaningful terms
  const stopWords = ['show', 'me', 'find', 'search', 'for', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'from'];
  return query.toLowerCase()
    .split(' ')
    .filter(word => word.length > 2 && !stopWords.includes(word));
}

function extractEntities(query: string): Record<string, any> {
  // Simple entity extraction
  const entities = {
    price_range: extractPriceRange(query),
    brand: extractBrand(query),
    color: extractColor(query),
    size: extractSize(query)
  };

  return entities;
}

function extractPriceRange(query: string): any {
  const priceMatch = query.match(/(\d+)\s*(taka|tk|৳)/i);
  if (priceMatch) {
    return { amount: parseInt(priceMatch[1]), currency: 'BDT' };
  }
  return null;
}

function extractBrand(query: string): string | null {
  const brands = ['samsung', 'apple', 'xiaomi', 'walton', 'singer', 'lg', 'sony'];
  for (const brand of brands) {
    if (query.toLowerCase().includes(brand)) {
      return brand;
    }
  }
  return null;
}

function extractColor(query: string): string | null {
  const colors = ['red', 'blue', 'green', 'black', 'white', 'yellow', 'pink', 'purple'];
  for (const color of colors) {
    if (query.toLowerCase().includes(color)) {
      return color;
    }
  }
  return null;
}

function extractSize(query: string): string | null {
  const sizeMatch = query.match(/(small|medium|large|xl|xxl|s|m|l)/i);
  return sizeMatch ? sizeMatch[1] : null;
}

function analyzeSentiment(query: string): string {
  const positiveWords = ['good', 'best', 'great', 'excellent', 'love', 'amazing'];
  const negativeWords = ['bad', 'worst', 'terrible', 'hate', 'awful', 'horrible'];

  const positive = positiveWords.some(word => query.toLowerCase().includes(word));
  const negative = negativeWords.some(word => query.toLowerCase().includes(word));

  if (positive) return 'positive';
  if (negative) return 'negative';
  return 'neutral';
}

function detectUrgency(query: string): string {
  const urgentWords = ['urgent', 'quickly', 'now', 'immediately', 'asap', 'fast'];
  const urgent = urgentWords.some(word => query.toLowerCase().includes(word));
  return urgent ? 'high' : 'normal';
}

function analyzeLanguageStyle(query: string): string {
  if (query.includes('please') || query.includes('thank you')) return 'polite';
  if (query.length < 10) return 'brief';
  if (query.includes('?')) return 'question';
  return 'statement';
}

function generatePersonalizedSuggestions(history: any[]): string[] {
  const suggestions = [];
  
  // Analyze user's search patterns
  const categories = history.map(h => h.intent_classification?.subcategory).filter(Boolean);
  const mostSearched = getMostFrequent(categories);

  if (mostSearched) {
    suggestions.push(`Try searching for more ${mostSearched} items`);
    suggestions.push(`Say "show new arrivals in ${mostSearched}"`);
  }

  return suggestions;
}

function getMostFrequent(arr: string[]): string | null {
  if (arr.length === 0) return null;
  
  const frequency: Record<string, number> = {};
  let maxCount = 0;
  let mostFrequent = null;

  for (const item of arr) {
    frequency[item] = (frequency[item] || 0) + 1;
    if (frequency[item] > maxCount) {
      maxCount = frequency[item];
      mostFrequent = item;
    }
  }

  return mostFrequent;
}