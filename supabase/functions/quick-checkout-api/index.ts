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

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    switch (action) {
      case 'preferences':
        if (req.method === 'GET') {
          return await handleGetPreferences(supabaseClient, user.id)
        } else if (req.method === 'POST') {
          return await handleUpdatePreferences(supabaseClient, user.id, req)
        }
        break
      case 'quick-order':
        return await handleQuickOrder(supabaseClient, user.id, req)
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

async function handleGetPreferences(supabaseClient: any, userId: string) {
  const { data: preferences, error } = await supabaseClient
    .from('quick_checkout_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') { // Not found error
    throw error
  }

  return new Response(JSON.stringify({ preferences: preferences || null }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleUpdatePreferences(supabaseClient: any, userId: string, req: Request) {
  const {
    default_shipping_address,
    default_billing_address,
    default_payment_method,
    auto_apply_coupons,
    skip_review_step
  } = await req.json()

  const { data, error } = await supabaseClient
    .from('quick_checkout_preferences')
    .upsert({
      user_id: userId,
      default_shipping_address,
      default_billing_address,
      default_payment_method,
      auto_apply_coupons: auto_apply_coupons || false,
      skip_review_step: skip_review_step || false,
      updated_at: new Date().toISOString()
    })
    .select()

  if (error) {
    throw error
  }

  return new Response(JSON.stringify({ 
    success: true,
    preferences: data[0],
    message: 'Quick checkout preferences updated'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleQuickOrder(supabaseClient: any, userId: string, req: Request) {
  const { product_id, quantity = 1, use_preferences = true } = await req.json()

  if (!product_id) {
    return new Response(JSON.stringify({ error: 'Product ID is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Get user preferences if requested
  let preferences = null
  if (use_preferences) {
    const { data } = await supabaseClient
      .from('quick_checkout_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()
    preferences = data
  }

  // Get product details
  const { data: product, error: productError } = await supabaseClient
    .from('products')
    .select(`
      *,
      inventory!inner(current_stock)
    `)
    .eq('id', product_id)
    .single()

  if (productError || !product) {
    return new Response(JSON.stringify({ error: 'Product not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Check stock availability
  const availableStock = product.inventory?.[0]?.current_stock || 0
  if (availableStock < quantity) {
    return new Response(JSON.stringify({ 
      error: 'Insufficient stock',
      available_stock: availableStock
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Generate order number
  const orderNumber = `QCK-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

  // Calculate totals
  const subtotal = product.price * quantity
  const taxAmount = subtotal * 0.05 // 5% tax
  const shippingAmount = subtotal > 1000 ? 0 : 50 // Free shipping over 1000
  const totalAmount = subtotal + taxAmount + shippingAmount

  // Create the order
  const orderData = {
    order_number: orderNumber,
    customer_id: userId,
    status: 'pending',
    payment_status: 'pending',
    subtotal,
    tax_amount: taxAmount,
    shipping_amount: shippingAmount,
    total_amount: totalAmount,
    currency: 'BDT',
    shipping_address: preferences?.default_shipping_address || {},
    billing_address: preferences?.default_billing_address || preferences?.default_shipping_address || {},
    payment_method: preferences?.default_payment_method || 'cod'
  }

  const { data: order, error: orderError } = await supabaseClient
    .from('orders')
    .insert(orderData)
    .select()

  if (orderError) {
    throw orderError
  }

  // Create order items
  const { error: orderItemError } = await supabaseClient
    .from('order_items')
    .insert({
      order_id: order[0].id,
      product_id,
      quantity,
      unit_price: product.price,
      total_price: product.price * quantity,
      vendor_id: product.vendor_id,
      product_snapshot: {
        name: product.name,
        description: product.description,
        images: product.images
      }
    })

  if (orderItemError) {
    // Rollback order creation
    await supabaseClient.from('orders').delete().eq('id', order[0].id)
    throw orderItemError
  }

  return new Response(JSON.stringify({ 
    success: true,
    order: order[0],
    message: 'Quick order created successfully',
    next_step: preferences?.skip_review_step ? 'payment' : 'review'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}