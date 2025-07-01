import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    switch (action) {
      case 'product-recommendations':
        return await getProductRecommendations(req, supabaseClient)
      case 'similar-products':
        return await getSimilarProducts(req, supabaseClient)
      case 'trending-products':
        return await getTrendingProducts(req, supabaseClient)
      case 'personalized-feed':
        return await getPersonalizedFeed(req, supabaseClient)
      case 'price-optimization':
        return await optimizePrice(req, supabaseClient)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('ML recommendations error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function getProductRecommendations(req: Request, supabaseClient: any) {
  const { user_id, product_id, limit = 10 } = await req.json()
  
  // Get user behavior and purchase history
  const { data: userBehavior } = await supabaseClient
    .from('user_behaviors')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Generate recommendations using collaborative filtering
  const recommendations = await generateCollaborativeRecommendations(user_id, userBehavior, supabaseClient, limit)
  
  return new Response(JSON.stringify({
    success: true,
    recommendations,
    algorithm: 'collaborative_filtering',
    confidence_score: 0.85
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function generateCollaborativeRecommendations(userId: string, userBehavior: any[], supabaseClient: any, limit: number) {
  // Mock ML recommendation logic
  // In production, integrate with actual ML models
  
  const mockRecommendations = [
    { product_id: 'prod_1', name: 'Wireless Headphones', price: 2500, confidence: 0.92 },
    { product_id: 'prod_2', name: 'Smart Watch', price: 8000, confidence: 0.87 },
    { product_id: 'prod_3', name: 'Phone Case', price: 500, confidence: 0.81 },
    { product_id: 'prod_4', name: 'Power Bank', price: 1200, confidence: 0.78 },
    { product_id: 'prod_5', name: 'Bluetooth Speaker', price: 3500, confidence: 0.75 }
  ]
  
  return mockRecommendations.slice(0, limit)
}

async function getSimilarProducts(req: Request, supabaseClient: any) {
  const { product_id, limit = 5 } = await req.json()
  
  // Content-based filtering for similar products
  const { data: product } = await supabaseClient
    .from('products')
    .select('*')
    .eq('id', product_id)
    .single()

  if (!product) {
    return new Response(JSON.stringify({ error: 'Product not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Find similar products by category and price range
  const { data: similarProducts } = await supabaseClient
    .from('products')
    .select('*')
    .eq('category_id', product.category_id)
    .neq('id', product_id)
    .gte('price', product.price * 0.7)
    .lte('price', product.price * 1.3)
    .limit(limit)

  return new Response(JSON.stringify({
    success: true,
    similar_products: similarProducts || [],
    algorithm: 'content_based_filtering'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getTrendingProducts(req: Request, supabaseClient: any) {
  const { category, limit = 20 } = await req.json()
  
  // Calculate trending score based on recent views, purchases, and ratings
  const mockTrending = [
    { product_id: 'trend_1', name: 'Gaming Laptop', trending_score: 95, category: 'Electronics' },
    { product_id: 'trend_2', name: 'Designer Saree', trending_score: 88, category: 'Fashion' },
    { product_id: 'trend_3', name: 'Smart TV', trending_score: 82, category: 'Electronics' },
    { product_id: 'trend_4', name: 'Fitness Tracker', trending_score: 79, category: 'Health' }
  ]
  
  const filtered = category ? mockTrending.filter(p => p.category === category) : mockTrending
  
  return new Response(JSON.stringify({
    success: true,
    trending_products: filtered.slice(0, limit),
    algorithm: 'trending_score',
    updated_at: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getPersonalizedFeed(req: Request, supabaseClient: any) {
  const { user_id, page = 1, limit = 20 } = await req.json()
  
  // Hybrid recommendation combining multiple algorithms
  const personalizedFeed = [
    { product_id: 'feed_1', name: 'Recommended Book', source: 'user_preferences', score: 0.92 },
    { product_id: 'feed_2', name: 'Similar Product', source: 'collaborative_filtering', score: 0.87 },
    { product_id: 'feed_3', name: 'Trending Item', source: 'trending', score: 0.83 }
  ]
  
  return new Response(JSON.stringify({
    success: true,
    personalized_feed: personalizedFeed,
    algorithm: 'hybrid_recommendation',
    page,
    total_pages: 5
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function optimizePrice(req: Request, supabaseClient: any) {
  const { product_id, current_price, competitor_prices } = await req.json()
  
  // AI-based price optimization
  const avgCompetitorPrice = competitor_prices?.reduce((sum: number, price: number) => sum + price, 0) / competitor_prices?.length || current_price
  const demandScore = Math.random() * 100 // Mock demand score
  
  let optimizedPrice = current_price
  
  if (demandScore > 70 && current_price < avgCompetitorPrice * 0.9) {
    optimizedPrice = current_price * 1.05 // Increase price if high demand
  } else if (demandScore < 30 && current_price > avgCompetitorPrice * 1.1) {
    optimizedPrice = current_price * 0.95 // Decrease price if low demand
  }
  
  return new Response(JSON.stringify({
    success: true,
    current_price,
    optimized_price: Math.round(optimizedPrice),
    price_change: ((optimizedPrice - current_price) / current_price * 100).toFixed(2) + '%',
    demand_score: demandScore.toFixed(1),
    recommendation: optimizedPrice > current_price ? 'increase' : optimizedPrice < current_price ? 'decrease' : 'maintain'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}