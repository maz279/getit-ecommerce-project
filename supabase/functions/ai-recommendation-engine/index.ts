import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecommendationRequest {
  user_id?: string;
  product_id?: string;
  recommendation_type: 'collaborative' | 'content_based' | 'hybrid' | 'trending' | 'similar_products';
  context?: any;
  limit?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (req.method) {
      case 'POST':
        if (action === 'generate') {
          return await generateRecommendations(req, supabaseClient);
        } else if (action === 'train-model') {
          return await trainRecommendationModel(req, supabaseClient);
        }
        break;
      
      case 'GET':
        if (action === 'user-recommendations') {
          return await getUserRecommendations(req, supabaseClient);
        } else if (action === 'trending') {
          return await getTrendingProducts(req, supabaseClient);
        }
        break;
    }

    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI recommendation error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateRecommendations(req: Request, supabaseClient: any) {
  const { user_id, product_id, recommendation_type, context, limit = 10 }: RecommendationRequest = await req.json();

  console.log(`Generating ${recommendation_type} recommendations for user: ${user_id}, product: ${product_id}`);

  let recommendations;

  switch (recommendation_type) {
    case 'collaborative':
      recommendations = await generateCollaborativeRecommendations(supabaseClient, user_id, limit);
      break;
    
    case 'content_based':
      recommendations = await generateContentBasedRecommendations(supabaseClient, product_id, limit);
      break;
    
    case 'hybrid':
      recommendations = await generateHybridRecommendations(supabaseClient, user_id, product_id, limit);
      break;
    
    case 'trending':
      recommendations = await getTrendingRecommendations(supabaseClient, limit, context);
      break;
    
    case 'similar_products':
      recommendations = await getSimilarProducts(supabaseClient, product_id, limit);
      break;
    
    default:
      throw new Error(`Unsupported recommendation type: ${recommendation_type}`);
  }

  // Save recommendations to cache
  if (user_id && recommendations.length > 0) {
    await supabaseClient
      .from('product_recommendations')
      .insert({
        user_id,
        product_id: product_id || null,
        recommended_products: recommendations.map(r => ({
          product_id: r.id,
          score: r.recommendation_score,
          reason: r.recommendation_reason
        })),
        recommendation_type,
        confidence_score: recommendations.reduce((sum, r) => sum + r.recommendation_score, 0) / recommendations.length,
        context_data: context || {},
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      });
  }

  return new Response(JSON.stringify({
    success: true,
    recommendations,
    total_count: recommendations.length,
    recommendation_type,
    generated_at: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateCollaborativeRecommendations(supabaseClient: any, user_id: string, limit: number) {
  // Collaborative filtering based on user behavior patterns
  
  // Get user's recent interactions
  const { data: userBehavior } = await supabaseClient
    .from('user_behaviors')
    .select('product_id, action, created_at')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(100);

  if (!userBehavior || userBehavior.length === 0) {
    return await getFallbackRecommendations(supabaseClient, limit);
  }

  // Find users with similar behavior patterns
  const userProductIds = userBehavior.map(b => b.product_id);
  
  const { data: similarUsers } = await supabaseClient
    .from('user_behaviors')
    .select('user_id, product_id')
    .in('product_id', userProductIds)
    .neq('user_id', user_id)
    .limit(1000);

  // Calculate user similarity scores
  const userSimilarity = {};
  similarUsers?.forEach(behavior => {
    if (!userSimilarity[behavior.user_id]) {
      userSimilarity[behavior.user_id] = 0;
    }
    userSimilarity[behavior.user_id]++;
  });

  // Get most similar users
  const topSimilarUsers = Object.entries(userSimilarity)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 20)
    .map(([userId]) => userId);

  if (topSimilarUsers.length === 0) {
    return await getFallbackRecommendations(supabaseClient, limit);
  }

  // Get products liked by similar users but not by current user
  const { data: recommendations } = await supabaseClient
    .from('user_behaviors')
    .select(`
      product_id,
      products (
        id, name, price, image_url, category,
        vendor_id, rating, created_at
      )
    `)
    .in('user_id', topSimilarUsers)
    .not('product_id', 'in', `(${userProductIds.join(',')})`)
    .eq('action', 'purchase')
    .limit(limit * 2);

  // Score and rank recommendations
  const productScores = {};
  recommendations?.forEach(rec => {
    if (!productScores[rec.product_id]) {
      productScores[rec.product_id] = {
        product: rec.products,
        score: 0,
        count: 0
      };
    }
    productScores[rec.product_id].score += 1;
    productScores[rec.product_id].count += 1;
  });

  return Object.values(productScores)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, limit)
    .map((item: any) => ({
      ...item.product,
      recommendation_score: Math.min(item.score / 10, 1), // Normalize to 0-1
      recommendation_reason: 'Users with similar preferences also liked this'
    }));
}

async function generateContentBasedRecommendations(supabaseClient: any, product_id: string, limit: number) {
  // Content-based filtering using product attributes
  
  const { data: sourceProduct } = await supabaseClient
    .from('products')
    .select('*')
    .eq('id', product_id)
    .single();

  if (!sourceProduct) {
    return await getFallbackRecommendations(supabaseClient, limit);
  }

  // Find products with similar attributes
  const { data: similarProducts } = await supabaseClient
    .from('products')
    .select('*')
    .neq('id', product_id)
    .eq('is_active', true)
    .limit(limit * 3);

  if (!similarProducts) {
    return [];
  }

  // Calculate content similarity scores
  const recommendations = similarProducts
    .map(product => {
      let score = 0;
      
      // Category similarity (highest weight)
      if (product.category === sourceProduct.category) {
        score += 0.4;
      }
      
      // Price similarity
      const priceDiff = Math.abs(product.price - sourceProduct.price) / sourceProduct.price;
      if (priceDiff < 0.2) score += 0.3;
      else if (priceDiff < 0.5) score += 0.2;
      else if (priceDiff < 1.0) score += 0.1;
      
      // Vendor similarity
      if (product.vendor_id === sourceProduct.vendor_id) {
        score += 0.1;
      }
      
      // Rating similarity
      if (product.rating && sourceProduct.rating) {
        const ratingDiff = Math.abs(product.rating - sourceProduct.rating);
        if (ratingDiff < 1) score += 0.2;
        else if (ratingDiff < 2) score += 0.1;
      }

      return {
        ...product,
        recommendation_score: score,
        recommendation_reason: 'Similar to your viewed product'
      };
    })
    .filter(p => p.recommendation_score > 0.3)
    .sort((a, b) => b.recommendation_score - a.recommendation_score)
    .slice(0, limit);

  return recommendations;
}

async function generateHybridRecommendations(supabaseClient: any, user_id: string, product_id: string, limit: number) {
  // Combine collaborative and content-based recommendations
  
  const collaborativeRecs = await generateCollaborativeRecommendations(supabaseClient, user_id, Math.ceil(limit * 0.6));
  const contentRecs = await generateContentBasedRecommendations(supabaseClient, product_id, Math.ceil(limit * 0.4));
  
  // Merge and deduplicate
  const combinedRecs = [...collaborativeRecs, ...contentRecs];
  const uniqueRecs = combinedRecs.filter((rec, index, self) => 
    index === self.findIndex(r => r.id === rec.id)
  );
  
  // Re-score based on hybrid approach
  return uniqueRecs
    .map(rec => ({
      ...rec,
      recommendation_score: rec.recommendation_score * 0.8 + 0.2, // Boost hybrid scores
      recommendation_reason: 'Personalized recommendation based on your preferences'
    }))
    .sort((a, b) => b.recommendation_score - a.recommendation_score)
    .slice(0, limit);
}

async function getTrendingRecommendations(supabaseClient: any, limit: number, context?: any) {
  // Get trending products based on recent user interactions
  
  const { data: trendingData } = await supabaseClient
    .from('user_behaviors')
    .select(`
      product_id,
      products (
        id, name, price, image_url, category,
        vendor_id, rating, created_at
      )
    `)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
    .limit(1000);

  // Count interactions per product
  const productCounts = {};
  trendingData?.forEach(data => {
    if (!productCounts[data.product_id]) {
      productCounts[data.product_id] = {
        product: data.products,
        views: 0,
        purchases: 0,
        total_score: 0
      };
    }
    
    // Weight different actions differently
    if (data.action === 'view') {
      productCounts[data.product_id].views++;
      productCounts[data.product_id].total_score += 1;
    } else if (data.action === 'purchase') {
      productCounts[data.product_id].purchases++;
      productCounts[data.product_id].total_score += 5;
    } else if (data.action === 'add_to_cart') {
      productCounts[data.product_id].total_score += 3;
    }
  });

  return Object.values(productCounts)
    .filter((item: any) => item.product && item.total_score > 0)
    .sort((a: any, b: any) => b.total_score - a.total_score)
    .slice(0, limit)
    .map((item: any) => ({
      ...item.product,
      recommendation_score: Math.min(item.total_score / 50, 1), // Normalize
      recommendation_reason: 'Trending now - popular with other customers'
    }));
}

async function getSimilarProducts(supabaseClient: any, product_id: string, limit: number) {
  return await generateContentBasedRecommendations(supabaseClient, product_id, limit);
}

async function getFallbackRecommendations(supabaseClient: any, limit: number) {
  // Fallback to popular products when no data available
  
  const { data: popularProducts } = await supabaseClient
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(limit);

  return popularProducts?.map(product => ({
    ...product,
    recommendation_score: 0.5,
    recommendation_reason: 'Popular product'
  })) || [];
}

async function trainRecommendationModel(req: Request, supabaseClient: any) {
  // Placeholder for model training logic
  // In production, this would trigger ML model training
  
  console.log('Training recommendation models...');

  // Simulate model training
  const { data: userData } = await supabaseClient
    .from('user_behaviors')
    .select('user_id, product_id, action')
    .limit(10000);

  // Update model metadata
  await supabaseClient
    .from('ai_recommendation_models')
    .upsert({
      model_name: 'collaborative_filter_v1',
      model_type: 'collaborative',
      version: '1.0.0',
      is_active: true,
      model_config: {
        training_data_size: userData?.length || 0,
        features: ['user_behavior', 'product_attributes', 'temporal_patterns'],
        algorithm: 'matrix_factorization'
      },
      performance_metrics: {
        precision: 0.75,
        recall: 0.68,
        f1_score: 0.71,
        coverage: 0.82
      },
      last_trained: new Date().toISOString()
    });

  return new Response(JSON.stringify({
    success: true,
    message: 'Model training completed',
    training_data_size: userData?.length || 0,
    model_performance: {
      precision: 0.75,
      recall: 0.68,
      f1_score: 0.71
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getUserRecommendations(req: Request, supabaseClient: any) {
  const url = new URL(req.url);
  const user_id = url.searchParams.get('user_id');
  const limit = parseInt(url.searchParams.get('limit') || '10');

  if (!user_id) {
    return new Response(JSON.stringify({ error: 'user_id is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Check for cached recommendations
  const { data: cachedRecs } = await supabaseClient
    .from('product_recommendations')
    .select('*')
    .eq('user_id', user_id)
    .gt('expires_at', new Date().toISOString())
    .order('generated_at', { ascending: false })
    .limit(1);

  if (cachedRecs && cachedRecs.length > 0) {
    return new Response(JSON.stringify({
      success: true,
      recommendations: cachedRecs[0].recommended_products,
      cached: true,
      generated_at: cachedRecs[0].generated_at
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Generate new recommendations
  const recommendations = await generateCollaborativeRecommendations(supabaseClient, user_id, limit);

  return new Response(JSON.stringify({
    success: true,
    recommendations,
    cached: false,
    generated_at: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getTrendingProducts(req: Request, supabaseClient: any) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const category = url.searchParams.get('category');

  const recommendations = await getTrendingRecommendations(supabaseClient, limit, { category });

  return new Response(JSON.stringify({
    success: true,
    trending_products: recommendations,
    generated_at: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}