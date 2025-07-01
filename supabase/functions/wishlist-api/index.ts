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

    switch (req.method) {
      case 'GET':
        return await handleGetWishlist(supabaseClient, user.id)
      case 'POST':
        return await handleAddToWishlist(supabaseClient, user.id, req)
      case 'DELETE':
        return await handleRemoveFromWishlist(supabaseClient, user.id, req)
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
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

async function handleGetWishlist(supabaseClient: any, userId: string) {
  const { data: wishlistItems, error } = await supabaseClient
    .from('wishlists')
    .select(`
      *,
      products:product_id (
        *,
        inventory!inner(current_stock),
        product_reviews(rating)
      )
    `)
    .eq('user_id', userId)
    .order('added_at', { ascending: false })

  if (error) {
    throw error
  }

  // Process wishlist items with product details
  const processedItems = wishlistItems?.map((item: any) => {
    const product = item.products
    const reviews = product?.product_reviews || []
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
      : 0

    return {
      ...item,
      product: {
        ...product,
        avgRating: parseFloat(avgRating.toFixed(1)),
        reviewCount: reviews.length,
        inStock: product?.inventory?.[0]?.current_stock > 0
      }
    }
  }) || []

  return new Response(JSON.stringify({ wishlistItems: processedItems }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleAddToWishlist(supabaseClient: any, userId: string, req: Request) {
  const { product_id, notes, priority } = await req.json()

  if (!product_id) {
    return new Response(JSON.stringify({ error: 'Product ID is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { data, error } = await supabaseClient
    .from('wishlists')
    .upsert({
      user_id: userId,
      product_id,
      notes,
      priority: priority || 1,
      added_at: new Date().toISOString()
    })
    .select()

  if (error) {
    throw error
  }

  return new Response(JSON.stringify({ 
    success: true, 
    wishlistItem: data[0],
    message: 'Product added to wishlist'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleRemoveFromWishlist(supabaseClient: any, userId: string, req: Request) {
  const url = new URL(req.url)
  const productId = url.searchParams.get('product_id')

  if (!productId) {
    return new Response(JSON.stringify({ error: 'Product ID is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { error } = await supabaseClient
    .from('wishlists')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (error) {
    throw error
  }

  return new Response(JSON.stringify({ 
    success: true,
    message: 'Product removed from wishlist'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}