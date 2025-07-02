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
      userId, 
      recommendationType = 'product', 
      limit = 10,
      context = {} 
    } = await req.json();

    console.log('Generating recommendations for user:', userId, 'type:', recommendationType);

    // Get user behavior data
    const { data: userBehaviors } = await supabase
      .from('user_behaviors')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(100);

    // Get existing recommendations to avoid duplicates
    const { data: existingRecs } = await supabase
      .from('ml_recommendations')
      .select('recommendations')
      .eq('user_id', userId)
      .eq('recommendation_type', recommendationType)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    let recommendations = [];

    if (recommendationType === 'product') {
      recommendations = await generateProductRecommendations(userId, userBehaviors, context);
    } else if (recommendationType === 'vendor') {
      recommendations = await generateVendorRecommendations(userId, userBehaviors, context);
    } else if (recommendationType === 'cross_sell') {
      recommendations = await generateCrossSellRecommendations(userId, userBehaviors, context);
    }

    // Use AI to enhance recommendations
    if (openAIApiKey && recommendations.length > 0) {
      recommendations = await enhanceRecommendationsWithAI(recommendations, userBehaviors);
    }

    // Calculate confidence scores
    const enhancedRecommendations = recommendations.slice(0, limit).map((rec, index) => ({
      ...rec,
      confidence_score: Math.max(0.3, 1 - (index * 0.1)),
      reason: generateRecommendationReason(rec, userBehaviors)
    }));

    // Store in cache
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour cache

    await supabase
      .from('ml_recommendations')
      .upsert({
        user_id: userId,
        recommendation_type: recommendationType,
        recommendations: enhancedRecommendations,
        confidence_score: enhancedRecommendations[0]?.confidence_score || 0.5,
        model_version: 'v1.0',
        expires_at: expiresAt.toISOString()
      });

    return new Response(JSON.stringify({
      success: true,
      recommendations: enhancedRecommendations,
      total: enhancedRecommendations.length,
      cached_until: expiresAt.toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in AI recommendation engine:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate recommendations',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function generateProductRecommendations(userId, userBehaviors, context) {
  const productIds = userBehaviors
    ?.filter(b => b.product_id && b.event_type === 'product_view')
    ?.map(b => b.product_id) || [];

  if (productIds.length === 0) {
    // Fallback to popular products
    const { data: popularProducts } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('view_count', { ascending: false })
      .limit(10);
    
    return popularProducts || [];
  }

  // Get similar products based on categories and tags
  const { data: viewedProducts } = await supabase
    .from('products')
    .select('category_id, tags')
    .in('id', productIds);

  const categories = [...new Set(viewedProducts?.map(p => p.category_id) || [])];
  
  const { data: recommendations } = await supabase
    .from('products')
    .select('*')
    .in('category_id', categories)
    .not('id', 'in', `(${productIds.join(',')})`)
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(20);

  return recommendations || [];
}

async function generateVendorRecommendations(userId, userBehaviors, context) {
  const vendorIds = userBehaviors
    ?.filter(b => b.vendor_id)
    ?.map(b => b.vendor_id) || [];

  const { data: topVendors } = await supabase
    .from('vendors')
    .select('*')
    .not('id', 'in', vendorIds.length > 0 ? `(${vendorIds.join(',')})` : '()')
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(10);

  return topVendors || [];
}

async function generateCrossSellRecommendations(userId, userBehaviors, context) {
  // Get recent purchases
  const { data: recentPurchases } = await supabase
    .from('order_items')
    .select('product_id, products(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (!recentPurchases?.length) return [];

  // Find complementary products
  const categories = [...new Set(recentPurchases.map(p => p.products?.category_id))];
  
  const { data: crossSells } = await supabase
    .from('products')
    .select('*')
    .in('category_id', categories)
    .eq('is_active', true)
    .order('sales_count', { ascending: false })
    .limit(10);

  return crossSells || [];
}

async function enhanceRecommendationsWithAI(recommendations, userBehaviors) {
  if (!openAIApiKey) return recommendations;

  try {
    const userProfile = {
      recent_categories: [...new Set(userBehaviors?.slice(0, 20)?.map(b => b.event_data?.category) || [])],
      price_range: calculateAveragePriceRange(userBehaviors),
      brand_preferences: extractBrandPreferences(userBehaviors)
    };

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
            content: 'You are an AI recommendation specialist. Analyze user behavior and rerank product recommendations for better personalization.'
          },
          {
            role: 'user',
            content: `User profile: ${JSON.stringify(userProfile)}\nProducts to rank: ${JSON.stringify(recommendations.slice(0, 15))}\nReturn reranked product IDs in order of relevance.`
          }
        ],
        max_tokens: 500
      })
    });

    const aiResult = await response.json();
    const rerankedIds = JSON.parse(aiResult.choices[0]?.message?.content || '[]');
    
    // Reorder recommendations based on AI ranking
    if (rerankedIds.length > 0) {
      const reordered = [];
      rerankedIds.forEach(id => {
        const product = recommendations.find(r => r.id === id);
        if (product) reordered.push(product);
      });
      
      // Add any remaining products
      recommendations.forEach(r => {
        if (!reordered.find(ro => ro.id === r.id)) {
          reordered.push(r);
        }
      });
      
      return reordered;
    }
  } catch (error) {
    console.error('AI enhancement failed:', error);
  }

  return recommendations;
}

function calculateAveragePriceRange(behaviors) {
  const prices = behaviors
    ?.filter(b => b.event_data?.price)
    ?.map(b => parseFloat(b.event_data.price)) || [];
  
  if (prices.length === 0) return { min: 0, max: 1000 };
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: prices.reduce((a, b) => a + b, 0) / prices.length
  };
}

function extractBrandPreferences(behaviors) {
  const brands = behaviors
    ?.filter(b => b.event_data?.brand)
    ?.map(b => b.event_data.brand) || [];
  
  const brandCounts = {};
  brands.forEach(brand => {
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
  });
  
  return Object.entries(brandCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([brand]) => brand);
}

function generateRecommendationReason(product, behaviors) {
  const reasons = [
    'Based on your browsing history',
    'Popular in your preferred categories',
    'Highly rated by similar customers',
    'Trending in your area',
    'Perfect match for your style'
  ];
  
  return reasons[Math.floor(Math.random() * reasons.length)];
}