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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    switch (action) {
      case 'search':
        return await handleProductSearch(supabaseClient, req)
      case 'filters':
        return await handleGetFilters(supabaseClient)
      case 'comparison':
        return await handleProductComparison(supabaseClient, req)
      case 'track-view':
        return await handleTrackView(supabaseClient, req)
      case 'recently-viewed':
        return await handleRecentlyViewed(supabaseClient, req)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleProductSearch(supabaseClient: any, req: Request) {
  const url = new URL(req.url)
  const query = url.searchParams.get('q') || ''
  const minPrice = url.searchParams.get('minPrice')
  const maxPrice = url.searchParams.get('maxPrice')
  const minRating = url.searchParams.get('minRating')
  const sortBy = url.searchParams.get('sortBy') || 'popularity'
  const inStock = url.searchParams.get('inStock') === 'true'
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const offset = (page - 1) * limit

  let queryBuilder = supabaseClient
    .from('products')
    .select(`
      *,
      product_reviews!inner(rating),
      inventory!inner(current_stock)
    `)

  // Text search
  if (query) {
    queryBuilder = queryBuilder.ilike('name', `%${query}%`)
  }

  // Price range filter
  if (minPrice) {
    queryBuilder = queryBuilder.gte('price', parseFloat(minPrice))
  }
  if (maxPrice) {
    queryBuilder = queryBuilder.lte('price', parseFloat(maxPrice))
  }

  // Stock filter
  if (inStock) {
    queryBuilder = queryBuilder.gt('inventory.current_stock', 0)
  }

  // Sorting
  switch (sortBy) {
    case 'price_low':
      queryBuilder = queryBuilder.order('price', { ascending: true })
      break
    case 'price_high':
      queryBuilder = queryBuilder.order('price', { ascending: false })
      break
    case 'rating':
      queryBuilder = queryBuilder.order('product_reviews.rating', { ascending: false })
      break
    case 'newest':
      queryBuilder = queryBuilder.order('created_at', { ascending: false })
      break
    default:
      queryBuilder = queryBuilder.order('created_at', { ascending: false })
  }

  // Pagination
  queryBuilder = queryBuilder.range(offset, offset + limit - 1)

  const { data: products, error } = await queryBuilder

  if (error) {
    throw error
  }

  // Calculate average ratings
  const processedProducts = products?.map(product => {
    const reviews = product.product_reviews || []
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
      : 0
    
    return {
      ...product,
      avgRating: parseFloat(avgRating.toFixed(1)),
      reviewCount: reviews.length,
      inStock: product.inventory?.[0]?.current_stock > 0
    }
  })

  return new Response(JSON.stringify({ 
    products: processedProducts,
    pagination: { page, limit, hasMore: products?.length === limit }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleGetFilters(supabaseClient: any) {
  const { data: filters, error } = await supabaseClient
    .from('product_filters')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    throw error
  }

  return new Response(JSON.stringify({ filters }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleProductComparison(supabaseClient: any, req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { data: { user } } = await supabaseClient.auth.getUser(
    authHeader.replace('Bearer ', '')
  )

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  if (req.method === 'GET') {
    const { data: comparisons, error } = await supabaseClient
      .from('product_comparisons')
      .select('*')
      .eq('user_id', user.id)

    if (error) throw error

    return new Response(JSON.stringify({ comparisons }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  if (req.method === 'POST') {
    const { product_ids, comparison_name } = await req.json()

    const { data, error } = await supabaseClient
      .from('product_comparisons')
      .insert({
        user_id: user.id,
        product_ids,
        comparison_name
      })
      .select()

    if (error) throw error

    return new Response(JSON.stringify({ comparison: data[0] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleTrackView(supabaseClient: any, req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ success: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { data: { user } } = await supabaseClient.auth.getUser(
    authHeader.replace('Bearer ', '')
  )

  if (!user) {
    return new Response(JSON.stringify({ success: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { product_id, view_duration_seconds } = await req.json()

  const { error } = await supabaseClient
    .from('recently_viewed')
    .upsert({
      user_id: user.id,
      product_id,
      view_duration_seconds,
      viewed_at: new Date().toISOString()
    })

  return new Response(JSON.stringify({ success: !error }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleRecentlyViewed(supabaseClient: any, req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ products: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { data: { user } } = await supabaseClient.auth.getUser(
    authHeader.replace('Bearer ', '')
  )

  if (!user) {
    return new Response(JSON.stringify({ products: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { data: recentViews, error } = await supabaseClient
    .from('recently_viewed')
    .select(`
      *,
      products:product_id (*)
    `)
    .eq('user_id', user.id)
    .order('viewed_at', { ascending: false })
    .limit(10)

  if (error) throw error

  const products = recentViews?.map((view: any) => view.products).filter(Boolean) || []

  return new Response(JSON.stringify({ products }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}