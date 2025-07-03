import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const { type, data } = await req.json()

    switch (type) {
      case 'get_recommendations':
        return await getRecommendations(supabaseClient, data)
      case 'track_interaction':
        return await trackInteraction(supabaseClient, data)
      case 'update_user_profile':
        return await updateUserProfile(supabaseClient, data)
      case 'get_trending':
        return await getTrendingProducts(supabaseClient, data)
      case 'personalized_search':
        return await getPersonalizedSearch(supabaseClient, data)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid request type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('ML recommendation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getRecommendations(supabase: any, params: any) {
  const { userId, productId, type: recType, limit = 10 } = params

  let recommendations = []

  switch (recType) {
    case 'user_based':
      recommendations = await getUserBasedRecommendations(supabase, userId, limit)
      break
    case 'item_based':
      recommendations = await getItemBasedRecommendations(supabase, productId, limit)
      break
    case 'trending':
      recommendations = await getTrendingRecommendations(supabase, limit)
      break
    case 'personalized':
      recommendations = await getPersonalizedRecommendations(supabase, userId, limit)
      break
    case 'similar_users':
      recommendations = await getSimilarUserRecommendations(supabase, userId, limit)
      break
    default:
      recommendations = await getHybridRecommendations(supabase, userId, productId, limit)
  }

  // Store recommendations for analytics
  if (recommendations.length > 0) {
    await storeRecommendations(supabase, userId, recommendations, recType)
  }

  return new Response(
    JSON.stringify({ recommendations }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getUserBasedRecommendations(supabase: any, userId: string, limit: number) {
  // Collaborative filtering based on user behavior similarity
  const userBehaviorQuery = `
    WITH user_preferences AS (
      SELECT 
        p.category_id,
        p.brand_id,
        AVG(pr.rating) as avg_rating,
        COUNT(*) as interaction_count
      FROM user_behaviors ub
      JOIN products p ON (ub.context_data->>'product_id')::uuid = p.id
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.user_id = ub.user_id
      WHERE ub.user_id = $1
        AND ub.activity_type IN ('product_view', 'add_to_cart', 'purchase')
        AND ub.created_at > NOW() - INTERVAL '30 days'
      GROUP BY p.category_id, p.brand_id
    ),
    similar_users AS (
      SELECT 
        ub2.user_id,
        COUNT(*) as similarity_score
      FROM user_behaviors ub1
      JOIN user_behaviors ub2 ON ub1.context_data->>'product_id' = ub2.context_data->>'product_id'
      WHERE ub1.user_id = $1 
        AND ub2.user_id != $1
        AND ub1.activity_type IN ('product_view', 'add_to_cart', 'purchase')
        AND ub2.activity_type IN ('product_view', 'add_to_cart', 'purchase')
      GROUP BY ub2.user_id
      ORDER BY similarity_score DESC
      LIMIT 50
    )
    SELECT DISTINCT
      p.*,
      AVG(pr.rating) as avg_rating,
      COUNT(pr.id) as review_count,
      SUM(CASE WHEN ub.activity_type = 'purchase' THEN 2 ELSE 1 END) as popularity_score
    FROM products p
    JOIN user_behaviors ub ON (ub.context_data->>'product_id')::uuid = p.id
    JOIN similar_users su ON ub.user_id = su.user_id
    LEFT JOIN product_reviews pr ON p.id = pr.product_id
    WHERE p.id NOT IN (
      SELECT (context_data->>'product_id')::uuid
      FROM user_behaviors
      WHERE user_id = $1 AND activity_type IN ('product_view', 'purchase')
    )
    AND p.is_active = true
    GROUP BY p.id
    ORDER BY popularity_score DESC, avg_rating DESC NULLS LAST
    LIMIT $2
  `

  const { data, error } = await supabase.rpc('execute_query', {
    query: userBehaviorQuery,
    params: [userId, limit]
  })

  if (error) {
    console.error('Error getting user-based recommendations:', error)
    return []
  }

  return data || []
}

async function getItemBasedRecommendations(supabase: any, productId: string, limit: number) {
  // Content-based filtering using product attributes
  const itemBasedQuery = `
    WITH product_features AS (
      SELECT 
        p.*,
        category_id,
        brand_id,
        price,
        specifications,
        tags
      FROM products p
      WHERE p.id = $1
    ),
    similar_products AS (
      SELECT 
        p2.*,
        AVG(pr.rating) as avg_rating,
        COUNT(pr.id) as review_count,
        CASE 
          WHEN p2.category_id = pf.category_id THEN 3
          ELSE 0
        END +
        CASE 
          WHEN p2.brand_id = pf.brand_id THEN 2
          ELSE 0
        END +
        CASE 
          WHEN ABS(p2.price - pf.price) < pf.price * 0.3 THEN 2
          ELSE 0
        END +
        CASE 
          WHEN p2.tags && pf.tags THEN 1
          ELSE 0
        END as similarity_score
      FROM products p2
      CROSS JOIN product_features pf
      LEFT JOIN product_reviews pr ON p2.id = pr.product_id
      WHERE p2.id != $1
        AND p2.is_active = true
      GROUP BY p2.id, pf.category_id, pf.brand_id, pf.price, pf.tags
      HAVING similarity_score > 2
      ORDER BY similarity_score DESC, avg_rating DESC NULLS LAST
      LIMIT $2
    )
    SELECT * FROM similar_products
  `

  const { data, error } = await supabase.rpc('execute_query', {
    query: itemBasedQuery,
    params: [productId, limit]
  })

  if (error) {
    console.error('Error getting item-based recommendations:', error)
    return []
  }

  return data || []
}

async function getTrendingRecommendations(supabase: any, limit: number) {
  // Trending products based on recent activity and sales
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_reviews(rating),
      real_time_metrics(metric_value)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit * 2)

  if (error) {
    console.error('Error getting trending recommendations:', error)
    return []
  }

  // Calculate trending score
  return data
    .map(product => ({
      ...product,
      trending_score: calculateTrendingScore(product)
    }))
    .sort((a, b) => b.trending_score - a.trending_score)
    .slice(0, limit)
}

function calculateTrendingScore(product: any): number {
  const now = Date.now()
  const createdAt = new Date(product.created_at).getTime()
  const daysSinceCreated = (now - createdAt) / (1000 * 60 * 60 * 24)
  
  const recencyScore = Math.max(0, 30 - daysSinceCreated) / 30
  const ratingScore = product.product_reviews?.length > 0 
    ? product.product_reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.product_reviews.length / 5
    : 0.5
  
  const activityScore = product.real_time_metrics?.length > 0
    ? Math.min(1, product.real_time_metrics.length / 100)
    : 0

  return (recencyScore * 0.4) + (ratingScore * 0.3) + (activityScore * 0.3)
}

async function getPersonalizedRecommendations(supabase: any, userId: string, limit: number) {
  // Get user's behavioral profile
  const { data: profile } = await supabase
    .from('user_behavioral_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!profile) {
    return await getTrendingRecommendations(supabase, limit)
  }

  // Use ML model for personalized recommendations
  const preferences = profile.preferences || {}
  const categoryWeights = preferences.categories || {}
  const brandWeights = preferences.brands || {}
  
  const personalizedQuery = `
    SELECT 
      p.*,
      AVG(pr.rating) as avg_rating,
      COUNT(pr.id) as review_count,
      (
        COALESCE(($1::jsonb->>(p.category_id::text))::numeric, 0.5) * 0.4 +
        COALESCE(($2::jsonb->>(p.brand_id::text))::numeric, 0.5) * 0.3 +
        (CASE WHEN p.price BETWEEN $3 AND $4 THEN 1.0 ELSE 0.5 END) * 0.3
      ) as personalization_score
    FROM products p
    LEFT JOIN product_reviews pr ON p.id = pr.product_id
    WHERE p.is_active = true
      AND p.id NOT IN (
        SELECT (context_data->>'product_id')::uuid
        FROM user_behaviors
        WHERE user_id = $5 AND activity_type = 'purchase'
      )
    GROUP BY p.id
    HAVING personalization_score > 0.4
    ORDER BY personalization_score DESC, avg_rating DESC NULLS LAST
    LIMIT $6
  `

  const priceRange = preferences.price_range || { min: 0, max: 999999 }

  const { data, error } = await supabase.rpc('execute_query', {
    query: personalizedQuery,
    params: [
      JSON.stringify(categoryWeights),
      JSON.stringify(brandWeights),
      priceRange.min,
      priceRange.max,
      userId,
      limit
    ]
  })

  if (error) {
    console.error('Error getting personalized recommendations:', error)
    return await getTrendingRecommendations(supabase, limit)
  }

  return data || []
}

async function getSimilarUserRecommendations(supabase: any, userId: string, limit: number) {
  // Find users with similar purchase patterns
  const similarUsersQuery = `
    WITH user_categories AS (
      SELECT 
        category_id,
        COUNT(*) as purchase_count
      FROM user_behaviors ub
      JOIN products p ON (ub.context_data->>'product_id')::uuid = p.id
      WHERE ub.user_id = $1 AND ub.activity_type = 'purchase'
      GROUP BY category_id
    ),
    similar_users AS (
      SELECT 
        ub2.user_id,
        COUNT(*) as similarity_score
      FROM user_categories uc
      JOIN user_behaviors ub2 ON ub2.context_data->>'category_id' = uc.category_id::text
      WHERE ub2.user_id != $1 AND ub2.activity_type = 'purchase'
      GROUP BY ub2.user_id
      ORDER BY similarity_score DESC
      LIMIT 20
    )
    SELECT DISTINCT
      p.*,
      AVG(pr.rating) as avg_rating,
      COUNT(pr.id) as review_count
    FROM products p
    JOIN user_behaviors ub ON (ub.context_data->>'product_id')::uuid = p.id
    JOIN similar_users su ON ub.user_id = su.user_id
    LEFT JOIN product_reviews pr ON p.id = pr.product_id
    WHERE p.id NOT IN (
      SELECT (context_data->>'product_id')::uuid
      FROM user_behaviors
      WHERE user_id = $1
    )
    AND p.is_active = true
    AND ub.activity_type IN ('purchase', 'add_to_cart')
    GROUP BY p.id
    ORDER BY COUNT(ub.id) DESC, avg_rating DESC NULLS LAST
    LIMIT $2
  `

  const { data, error } = await supabase.rpc('execute_query', {
    query: similarUsersQuery,
    params: [userId, limit]
  })

  if (error) {
    console.error('Error getting similar user recommendations:', error)
    return []
  }

  return data || []
}

async function getHybridRecommendations(supabase: any, userId: string, productId: string, limit: number) {
  // Combine multiple recommendation strategies
  const [userBased, itemBased, trending, personalized] = await Promise.all([
    getUserBasedRecommendations(supabase, userId, Math.ceil(limit * 0.3)),
    productId ? getItemBasedRecommendations(supabase, productId, Math.ceil(limit * 0.3)) : [],
    getTrendingRecommendations(supabase, Math.ceil(limit * 0.2)),
    getPersonalizedRecommendations(supabase, userId, Math.ceil(limit * 0.2))
  ])

  // Merge and deduplicate
  const allRecommendations = new Map()
  
  // Add weight scores for different strategies
  userBased.forEach(product => {
    allRecommendations.set(product.id, { ...product, hybrid_score: 0.4 })
  })
  
  itemBased.forEach(product => {
    const existing = allRecommendations.get(product.id)
    if (existing) {
      existing.hybrid_score += 0.3
    } else {
      allRecommendations.set(product.id, { ...product, hybrid_score: 0.3 })
    }
  })
  
  trending.forEach(product => {
    const existing = allRecommendations.get(product.id)
    if (existing) {
      existing.hybrid_score += 0.2
    } else {
      allRecommendations.set(product.id, { ...product, hybrid_score: 0.2 })
    }
  })
  
  personalized.forEach(product => {
    const existing = allRecommendations.get(product.id)
    if (existing) {
      existing.hybrid_score += 0.1
    } else {
      allRecommendations.set(product.id, { ...product, hybrid_score: 0.1 })
    }
  })

  return Array.from(allRecommendations.values())
    .sort((a, b) => b.hybrid_score - a.hybrid_score)
    .slice(0, limit)
}

async function storeRecommendations(supabase: any, userId: string, recommendations: any[], type: string) {
  const recommendationData = {
    user_id: userId,
    recommendation_type: type,
    recommended_products: recommendations.map(r => r.id),
    algorithm_version: '2.0',
    confidence_score: calculateConfidenceScore(recommendations),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }

  await supabase
    .from('ml_recommendations')
    .insert(recommendationData)
}

function calculateConfidenceScore(recommendations: any[]): number {
  if (recommendations.length === 0) return 0
  
  const avgRating = recommendations
    .filter(r => r.avg_rating)
    .reduce((sum, r) => sum + r.avg_rating, 0) / recommendations.length
  
  return Math.min(1, (avgRating / 5) * (recommendations.length / 10))
}

async function trackInteraction(supabase: any, interactionData: any) {
  // Track user interaction with recommendations for learning
  await supabase
    .from('recommendation_interactions')
    .insert({
      user_id: interactionData.userId,
      product_id: interactionData.productId,
      interaction_type: interactionData.type,
      recommendation_source: interactionData.source,
      position: interactionData.position
    })

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateUserProfile(supabase: any, profileData: any) {
  // Update user behavioral profile for better recommendations
  await supabase
    .from('user_behavioral_profiles')
    .upsert({
      user_id: profileData.userId,
      preferences: profileData.preferences,
      profile_confidence: profileData.confidence || 0.8
    })

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getTrendingProducts(supabase: any, params: any) {
  const { category, timeframe = '7d', limit = 20 } = params

  let query = supabase
    .from('products')
    .select(`
      *,
      product_reviews(rating),
      real_time_metrics(metric_value)
    `)
    .eq('is_active', true)

  if (category) {
    query = query.eq('category_id', category)
  }

  const { data, error } = await query.limit(limit * 2)

  if (error) {
    throw error
  }

  const trendingProducts = data
    .map(product => ({
      ...product,
      trending_score: calculateTrendingScore(product)
    }))
    .sort((a, b) => b.trending_score - a.trending_score)
    .slice(0, limit)

  return new Response(
    JSON.stringify({ products: trendingProducts }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getPersonalizedSearch(supabase: any, params: any) {
  const { userId, query, filters = {} } = params

  // Get user preferences to personalize search results
  const { data: profile } = await supabase
    .from('user_behavioral_profiles')
    .select('preferences')
    .eq('user_id', userId)
    .single()

  // Enhance search query with personalization
  const personalizedQuery = await supabase.functions.invoke('elasticsearch-search', {
    body: {
      query,
      filters: {
        ...filters,
        personalization: profile?.preferences || {}
      },
      userId
    }
  })

  return new Response(
    JSON.stringify(personalizedQuery.data),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}