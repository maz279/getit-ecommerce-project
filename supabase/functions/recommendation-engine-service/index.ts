import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface RecommendationRequest {
  user_id?: string;
  product_id?: string;
  category_id?: string;
  algorithm?: 'collaborative' | 'content_based' | 'hybrid' | 'popularity' | 'cultural';
  limit?: number;
  cultural_context?: string;
  language?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (action) {
      case 'user-recommendations':
        return await getUserRecommendations(req);
      case 'product-recommendations':
        return await getProductRecommendations(req);
      case 'trending-recommendations':
        return await getTrendingRecommendations(req);
      case 'cultural-recommendations':
        return await getCulturalRecommendations(req);
      case 'collaborative-filtering':
        return await collaborativeFiltering(req);
      case 'content-based-filtering':
        return await contentBasedFiltering(req);
      case 'hybrid-recommendations':
        return await hybridRecommendations(req);
      case 'train-model':
        return await trainRecommendationModel(req);
      case 'model-performance':
        return await getModelPerformance(req);
      case 'track-interaction':
        return await trackUserInteraction(req);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Recommendation Engine Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getUserRecommendations(req: Request) {
  const recRequest: RecommendationRequest = await req.json();
  const { user_id, algorithm = 'hybrid', limit = 10, cultural_context, language = 'english' } = recRequest;

  console.log('User Recommendations Request:', { user_id, algorithm, limit, cultural_context });

  if (!user_id) {
    throw new Error('user_id is required');
  }

  // Get user profile and preferences
  const { data: userProfile } = await supabase
    .from('user_search_profiles')
    .select('*')
    .eq('user_id', user_id)
    .single();

  // Get user behavior data
  const { data: userBehavior } = await supabase
    .from('user_behaviors')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(100);

  let recommendations = [];

  switch (algorithm) {
    case 'collaborative':
      recommendations = await generateCollaborativeRecommendations(user_id, userBehavior, limit);
      break;
    case 'content_based':
      recommendations = await generateContentBasedRecommendations(user_id, userProfile, userBehavior, limit);
      break;
    case 'cultural':
      recommendations = await generateCulturalRecommendations(user_id, cultural_context, language, limit);
      break;
    case 'hybrid':
    default:
      recommendations = await generateHybridRecommendations(user_id, userProfile, userBehavior, cultural_context, limit);
      break;
  }

  // Log recommendation generation
  await supabase.from('ai_product_recommendations').insert(
    recommendations.map(rec => ({
      user_id,
      product_id: rec.product_id,
      recommendation_type: algorithm,
      confidence_score: rec.confidence_score,
      recommendation_data: {
        algorithm_used: algorithm,
        cultural_context,
        user_preferences: userProfile?.search_preferences || {}
      }
    }))
  );

  return new Response(JSON.stringify({
    success: true,
    recommendations,
    algorithm_used: algorithm,
    user_profile_used: !!userProfile,
    cultural_context
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getProductRecommendations(req: Request) {
  const { product_id, algorithm = 'content_based', limit = 10 } = await req.json();

  console.log('Product Recommendations Request:', { product_id, algorithm, limit });

  if (!product_id) {
    throw new Error('product_id is required');
  }

  // Get product details
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      categories(id, name, bangla_name),
      vendors(id, name, rating)
    `)
    .eq('id', product_id)
    .single();

  if (!product) {
    throw new Error('Product not found');
  }

  let recommendations = [];

  switch (algorithm) {
    case 'content_based':
      recommendations = await generateProductSimilarityRecommendations(product, limit);
      break;
    case 'collaborative':
      recommendations = await generateProductCollaborativeRecommendations(product_id, limit);
      break;
    case 'hybrid':
    default:
      const contentRecs = await generateProductSimilarityRecommendations(product, Math.ceil(limit / 2));
      const collabRecs = await generateProductCollaborativeRecommendations(product_id, Math.floor(limit / 2));
      recommendations = [...contentRecs, ...collabRecs];
      break;
  }

  return new Response(JSON.stringify({
    success: true,
    product,
    recommendations,
    algorithm_used: algorithm
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getTrendingRecommendations(req: Request) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const category_id = url.searchParams.get('category_id');
  const period = url.searchParams.get('period') || '7d';

  console.log('Trending Recommendations:', { limit, category_id, period });

  const days = period === '30d' ? 30 : 7;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Get trending products based on recent interactions
  let query = supabase
    .from('user_behaviors')
    .select(`
      product_id,
      COUNT(*) as interaction_count,
      products!inner(
        id, name, price, image_url, average_rating, category_id,
        categories(name, bangla_name),
        vendors(name, rating)
      )
    `)
    .gte('created_at', startDate.toISOString())
    .in('event_type', ['view', 'cart_add', 'purchase'])
    .not('product_id', 'is', null);

  if (category_id) {
    query = query.eq('products.category_id', category_id);
  }

  const { data: trendingData } = await query
    .group('product_id')
    .order('interaction_count', { ascending: false })
    .limit(limit);

  const recommendations = (trendingData || []).map((item: any) => ({
    product_id: item.product_id,
    ...item.products,
    confidence_score: Math.min(0.95, item.interaction_count / 100), // Normalize to 0-0.95
    recommendation_reason: 'trending',
    interaction_count: item.interaction_count
  }));

  return new Response(JSON.stringify({
    success: true,
    recommendations,
    period,
    category_id
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getCulturalRecommendations(req: Request) {
  const { user_id, cultural_context, language = 'english', limit = 15 } = await req.json();

  console.log('Cultural Recommendations:', { user_id, cultural_context, language, limit });

  // Get cultural context configuration
  const { data: context } = await supabase
    .from('cultural_search_context')
    .select('*')
    .eq('context_name', cultural_context)
    .eq('is_active', true)
    .single();

  if (!context) {
    throw new Error('Cultural context not found');
  }

  // Get products that match cultural context
  let query = supabase
    .from('products')
    .select(`
      *,
      categories!inner(name, bangla_name),
      vendors(name, rating)
    `)
    .eq('is_active', true);

  // Apply cultural category boosting
  if (context.boost_categories && context.boost_categories.length > 0) {
    query = query.in('category_id', context.boost_categories);
  }

  // Apply cultural keyword filtering
  if (context.boost_keywords && context.boost_keywords.length > 0) {
    const keywordConditions = context.boost_keywords.map(keyword => `tags.cs.{${keyword}}`);
    query = query.or(keywordConditions.join(','));
  }

  const { data: culturalProducts } = await query
    .order('average_rating', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  const recommendations = (culturalProducts || []).map(product => ({
    ...product,
    confidence_score: context.boost_factor || 0.8,
    recommendation_reason: 'cultural_context',
    cultural_context: cultural_context
  }));

  return new Response(JSON.stringify({
    success: true,
    recommendations,
    cultural_context: context,
    language
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateCollaborativeRecommendations(user_id: string, userBehavior: any[], limit: number) {
  console.log('Generating collaborative recommendations for user:', user_id);

  if (!userBehavior || userBehavior.length === 0) {
    return [];
  }

  // Find similar users based on behavior patterns
  const userProductIds = userBehavior
    .filter(b => b.product_id)
    .map(b => b.product_id);

  if (userProductIds.length === 0) {
    return [];
  }

  // Find users who interacted with similar products
  const { data: similarUsers } = await supabase
    .from('user_behaviors')
    .select('user_id, product_id, event_type')
    .in('product_id', userProductIds)
    .neq('user_id', user_id)
    .limit(1000);

  if (!similarUsers || similarUsers.length === 0) {
    return [];
  }

  // Calculate user similarity scores
  const userSimilarity: { [key: string]: number } = {};
  similarUsers.forEach(behavior => {
    if (!userSimilarity[behavior.user_id]) {
      userSimilarity[behavior.user_id] = 0;
    }
    // Weight by interaction type
    const weight = behavior.event_type === 'purchase' ? 3 : behavior.event_type === 'cart_add' ? 2 : 1;
    userSimilarity[behavior.user_id] += weight;
  });

  // Get top similar users
  const topSimilarUsers = Object.entries(userSimilarity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([userId]) => userId);

  // Get products liked by similar users
  const { data: recommendedProducts } = await supabase
    .from('user_behaviors')
    .select(`
      product_id,
      COUNT(*) as recommendation_score,
      products!inner(
        id, name, price, image_url, average_rating,
        categories(name, bangla_name),
        vendors(name, rating)
      )
    `)
    .in('user_id', topSimilarUsers)
    .not('product_id', 'in', `(${userProductIds.join(',')})`) // Exclude already interacted products
    .in('event_type', ['cart_add', 'purchase'])
    .group('product_id')
    .order('recommendation_score', { ascending: false })
    .limit(limit);

  return (recommendedProducts || []).map((item: any) => ({
    product_id: item.product_id,
    ...item.products,
    confidence_score: Math.min(0.9, item.recommendation_score / 10),
    recommendation_reason: 'collaborative_filtering'
  }));
}

async function generateContentBasedRecommendations(user_id: string, userProfile: any, userBehavior: any[], limit: number) {
  console.log('Generating content-based recommendations for user:', user_id);

  // Extract user preferences from behavior and profile
  const preferences = {
    categories: new Set(),
    vendors: new Set(),
    price_range: { min: 0, max: Infinity },
    tags: new Set()
  };

  // Analyze user behavior for preferences
  if (userBehavior) {
    for (const behavior of userBehavior) {
      if (behavior.behavior_data?.category_id) {
        preferences.categories.add(behavior.behavior_data.category_id);
      }
      if (behavior.behavior_data?.vendor_id) {
        preferences.vendors.add(behavior.behavior_data.vendor_id);
      }
      if (behavior.behavior_data?.tags) {
        behavior.behavior_data.tags.forEach((tag: string) => preferences.tags.add(tag));
      }
    }
  }

  // Use profile preferences if available
  if (userProfile?.category_preferences) {
    Object.keys(userProfile.category_preferences).forEach(cat => preferences.categories.add(cat));
  }

  // Build recommendation query
  let query = supabase
    .from('products')
    .select(`
      *,
      categories(name, bangla_name),
      vendors(name, rating)
    `)
    .eq('is_active', true);

  // Apply category preferences
  if (preferences.categories.size > 0) {
    query = query.in('category_id', Array.from(preferences.categories));
  }

  // Apply vendor preferences
  if (preferences.vendors.size > 0) {
    query = query.in('vendor_id', Array.from(preferences.vendors));
  }

  // Apply tag preferences
  if (preferences.tags.size > 0) {
    const tagConditions = Array.from(preferences.tags).map(tag => `tags.cs.{${tag}}`);
    query = query.or(tagConditions.join(','));
  }

  const { data: contentProducts } = await query
    .order('average_rating', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  return (contentProducts || []).map(product => ({
    ...product,
    confidence_score: 0.7, // Base confidence for content-based
    recommendation_reason: 'content_based_filtering'
  }));
}

async function generateHybridRecommendations(user_id: string, userProfile: any, userBehavior: any[], cultural_context: string | undefined, limit: number) {
  console.log('Generating hybrid recommendations for user:', user_id);

  const recommendations = [];

  // Get collaborative recommendations (30% weight)
  const collabRecs = await generateCollaborativeRecommendations(user_id, userBehavior, Math.ceil(limit * 0.3));
  recommendations.push(...collabRecs.map(rec => ({ ...rec, algorithm: 'collaborative' })));

  // Get content-based recommendations (40% weight)
  const contentRecs = await generateContentBasedRecommendations(user_id, userProfile, userBehavior, Math.ceil(limit * 0.4));
  recommendations.push(...contentRecs.map(rec => ({ ...rec, algorithm: 'content_based' })));

  // Get cultural recommendations if context available (20% weight)
  if (cultural_context) {
    const culturalRecs = await generateCulturalRecommendations({ 
      json: () => Promise.resolve({ user_id, cultural_context, limit: Math.ceil(limit * 0.2) }) 
    } as Request);
    const culturalData = await culturalRecs.json();
    if (culturalData.success) {
      recommendations.push(...culturalData.recommendations.map((rec: any) => ({ ...rec, algorithm: 'cultural' })));
    }
  }

  // Get trending recommendations (10% weight)
  const trendingUrl = new URL('http://example.com');
  trendingUrl.searchParams.set('limit', Math.ceil(limit * 0.1).toString());
  const trendingRecs = await getTrendingRecommendations({ url: trendingUrl } as Request);
  const trendingData = await trendingRecs.json();
  if (trendingData.success) {
    recommendations.push(...trendingData.recommendations.map((rec: any) => ({ ...rec, algorithm: 'trending' })));
  }

  // Remove duplicates and sort by confidence score
  const uniqueRecs = recommendations.reduce((acc, rec) => {
    if (!acc.find(r => r.id === rec.id)) {
      acc.push(rec);
    }
    return acc;
  }, []);

  return uniqueRecs
    .sort((a, b) => b.confidence_score - a.confidence_score)
    .slice(0, limit)
    .map(rec => ({
      ...rec,
      recommendation_reason: 'hybrid_algorithm'
    }));
}

async function generateProductSimilarityRecommendations(product: any, limit: number) {
  console.log('Generating product similarity recommendations for:', product.name);

  // Find similar products based on category, vendor, tags, and price range
  let query = supabase
    .from('products')
    .select(`
      *,
      categories(name, bangla_name),
      vendors(name, rating)
    `)
    .eq('is_active', true)
    .neq('id', product.id); // Exclude the current product

  // Same category
  if (product.category_id) {
    query = query.eq('category_id', product.category_id);
  }

  // Similar price range (±20%)
  if (product.price) {
    const priceRange = product.price * 0.2;
    query = query
      .gte('price', product.price - priceRange)
      .lte('price', product.price + priceRange);
  }

  const { data: similarProducts } = await query
    .order('average_rating', { ascending: false })
    .limit(limit);

  // Calculate similarity scores
  return (similarProducts || []).map(similar => {
    let similarityScore = 0.5; // Base score

    // Same category bonus
    if (similar.category_id === product.category_id) {
      similarityScore += 0.2;
    }

    // Same vendor bonus
    if (similar.vendor_id === product.vendor_id) {
      similarityScore += 0.1;
    }

    // Tag similarity
    if (product.tags && similar.tags) {
      const commonTags = product.tags.filter((tag: string) => similar.tags.includes(tag));
      similarityScore += (commonTags.length / Math.max(product.tags.length, similar.tags.length)) * 0.2;
    }

    return {
      ...similar,
      confidence_score: Math.min(similarityScore, 0.95),
      recommendation_reason: 'product_similarity'
    };
  });
}

async function generateProductCollaborativeRecommendations(product_id: string, limit: number) {
  console.log('Generating product collaborative recommendations for:', product_id);

  // Find users who interacted with this product
  const { data: productUsers } = await supabase
    .from('user_behaviors')
    .select('user_id')
    .eq('product_id', product_id)
    .in('event_type', ['view', 'cart_add', 'purchase']);

  if (!productUsers || productUsers.length === 0) {
    return [];
  }

  const userIds = productUsers.map(u => u.user_id);

  // Find other products these users also liked
  const { data: relatedProducts } = await supabase
    .from('user_behaviors')
    .select(`
      product_id,
      COUNT(*) as interaction_count,
      products!inner(
        id, name, price, image_url, average_rating,
        categories(name, bangla_name),
        vendors(name, rating)
      )
    `)
    .in('user_id', userIds)
    .neq('product_id', product_id)
    .in('event_type', ['cart_add', 'purchase'])
    .group('product_id')
    .order('interaction_count', { ascending: false })
    .limit(limit);

  return (relatedProducts || []).map((item: any) => ({
    product_id: item.product_id,
    ...item.products,
    confidence_score: Math.min(0.9, item.interaction_count / 20),
    recommendation_reason: 'users_also_liked'
  }));
}

async function trackUserInteraction(req: Request) {
  const { user_id, product_id, interaction_type, recommendation_id } = await req.json();

  console.log('Tracking user interaction:', { user_id, product_id, interaction_type, recommendation_id });

  // Update recommendation tracking
  if (recommendation_id) {
    const updateData: any = {};
    
    if (interaction_type === 'click') {
      updateData.clicked = true;
    } else if (interaction_type === 'purchase') {
      updateData.purchased = true;
      updateData.conversion_tracked = true;
    }

    await supabase
      .from('ai_product_recommendations')
      .update(updateData)
      .eq('id', recommendation_id);
  }

  // Track user behavior
  await supabase
    .from('user_behaviors')
    .insert({
      user_id,
      product_id,
      event_type: interaction_type,
      behavior_data: {
        source: 'recommendation_engine',
        recommendation_id
      }
    });

  return new Response(JSON.stringify({
    success: true,
    message: 'Interaction tracked successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function trainRecommendationModel(req: Request) {
  const { model_type = 'hybrid', retrain = false } = await req.json();

  console.log('Training recommendation model:', { model_type, retrain });

  // Get existing model or create new one
  let { data: model } = await supabase
    .from('recommendation_models')
    .select('*')
    .eq('model_type', model_type)
    .eq('is_active', true)
    .single();

  if (!model) {
    // Create new model
    const { data: newModel } = await supabase
      .from('recommendation_models')
      .insert({
        model_name: `${model_type}_model_v1`,
        model_type,
        algorithm_config: {
          type: model_type,
          parameters: getDefaultModelParameters(model_type)
        }
      })
      .select()
      .single();
    
    model = newModel;
  }

  // Mock training process (in real implementation, this would train actual ML models)
  const trainingData = await getTrainingData(model_type);
  const performanceMetrics = await simulateModelTraining(model_type, trainingData);

  // Update model with training results
  await supabase
    .from('recommendation_models')
    .update({
      training_data_size: trainingData.size,
      accuracy_score: performanceMetrics.accuracy,
      last_trained_at: new Date().toISOString(),
      performance_metrics: performanceMetrics
    })
    .eq('id', model.id);

  return new Response(JSON.stringify({
    success: true,
    model_id: model.id,
    model_type,
    training_results: performanceMetrics,
    training_data_size: trainingData.size
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getModelPerformance(req: Request) {
  const url = new URL(req.url);
  const model_type = url.searchParams.get('model_type') || 'hybrid';

  const { data: model } = await supabase
    .from('recommendation_models')
    .select('*')
    .eq('model_type', model_type)
    .eq('is_active', true)
    .single();

  if (!model) {
    throw new Error('Model not found');
  }

  // Get recent recommendation performance
  const { data: recentRecs } = await supabase
    .from('ai_product_recommendations')
    .select('clicked, purchased, conversion_tracked')
    .eq('recommendation_type', model_type)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  const performance = {
    model_info: model,
    click_through_rate: 0,
    conversion_rate: 0,
    total_recommendations: recentRecs?.length || 0
  };

  if (recentRecs && recentRecs.length > 0) {
    const clicks = recentRecs.filter(r => r.clicked).length;
    const conversions = recentRecs.filter(r => r.purchased).length;
    
    performance.click_through_rate = clicks / recentRecs.length;
    performance.conversion_rate = conversions / recentRecs.length;
  }

  return new Response(JSON.stringify({
    success: true,
    performance
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Helper functions

function getDefaultModelParameters(model_type: string) {
  switch (model_type) {
    case 'collaborative':
      return {
        similarity_threshold: 0.3,
        min_interactions: 5,
        neighborhood_size: 20
      };
    case 'content_based':
      return {
        feature_weights: {
          category: 0.4,
          vendor: 0.2,
          tags: 0.3,
          price: 0.1
        }
      };
    case 'hybrid':
      return {
        algorithm_weights: {
          collaborative: 0.4,
          content_based: 0.3,
          cultural: 0.2,
          trending: 0.1
        }
      };
    default:
      return {};
  }
}

async function getTrainingData(model_type: string) {
  // Get training data from user behaviors and interactions
  const { data: behaviors } = await supabase
    .from('user_behaviors')
    .select('*')
    .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

  const { data: recommendations } = await supabase
    .from('ai_product_recommendations')
    .select('*')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  return {
    size: (behaviors?.length || 0) + (recommendations?.length || 0),
    behaviors: behaviors || [],
    recommendations: recommendations || []
  };
}

async function simulateModelTraining(model_type: string, trainingData: any) {
  // Mock training simulation (in real implementation, this would use actual ML algorithms)
  const baseAccuracy = {
    collaborative: 0.75,
    content_based: 0.70,
    hybrid: 0.82,
    cultural: 0.68
  };

  const accuracy = baseAccuracy[model_type as keyof typeof baseAccuracy] || 0.70;
  
  // Add some randomness and data-size-based improvement
  const dataBonus = Math.min(0.1, trainingData.size / 10000);
  const finalAccuracy = Math.min(0.95, accuracy + dataBonus + (Math.random() - 0.5) * 0.05);

  return {
    accuracy: finalAccuracy,
    precision: finalAccuracy * 0.95,
    recall: finalAccuracy * 0.90,
    f1_score: finalAccuracy * 0.92,
    training_time_minutes: 5 + Math.random() * 10,
    convergence: true
  };
}