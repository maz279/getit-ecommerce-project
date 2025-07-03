import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderData {
  customer_address: object
  payment_method: string
  items: Array<{
    product_id: string
    variant_id?: string
    quantity: number
    unit_price: number
  }>
  shipping_method?: string
  special_instructions?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method

    // Create Order
    if (path === '/order-management-service/orders' && method === 'POST') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const orderData: OrderData = await req.json()

      // Calculate totals
      let subtotal = 0
      const vendorTotals = new Map()

      for (const item of orderData.items) {
        const itemTotal = item.quantity * item.unit_price
        subtotal += itemTotal

        // Get product vendor
        const { data: product } = await supabaseClient
          .from('products')
          .select('vendor_id')
          .eq('id', item.product_id)
          .single()

        if (product) {
          const currentVendorTotal = vendorTotals.get(product.vendor_id) || 0
          vendorTotals.set(product.vendor_id, currentVendorTotal + itemTotal)
        }
      }

      const taxAmount = subtotal * 0.075 // 7.5% tax
      const shippingCost = 50 // Fixed shipping for now
      const totalAmount = subtotal + taxAmount + shippingCost

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Create main order
      const { data: order, error: orderError } = await supabaseClient
        .from('orders')
        .insert({
          customer_id: user.id,
          order_number: orderNumber,
          subtotal,
          tax_amount: taxAmount,
          shipping_cost: shippingCost,
          total_amount: totalAmount,
          customer_address: orderData.customer_address,
          payment_method: orderData.payment_method,
          shipping_method: orderData.shipping_method || 'standard',
          special_instructions: orderData.special_instructions,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price
      }))

      await supabaseClient.from('order_items').insert(orderItems)

      // Create vendor orders
      for (const [vendorId, vendorTotal] of vendorTotals.entries()) {
        const vendorOrderNumber = `VO-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
        const commissionRate = 0.15 // 15% commission
        const commissionAmount = vendorTotal * commissionRate
        const netAmount = vendorTotal - commissionAmount

        await supabaseClient.from('vendor_orders').insert({
          order_id: order.id,
          vendor_id: vendorId,
          vendor_order_number: vendorOrderNumber,
          subtotal: vendorTotal,
          commission_rate: commissionRate * 100,
          commission_amount: commissionAmount,
          net_amount: netAmount,
          total_amount: vendorTotal,
          status: 'pending',
          payment_status: 'pending'
        })
      }

      // Update inventory
      for (const item of orderData.items) {
        await supabaseClient.rpc('decrease_product_stock', {
          p_product_id: item.product_id,
          p_variant_id: item.variant_id,
          p_quantity: item.quantity
        })
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          order_id: order.id, 
          order_number: orderNumber,
          total_amount: totalAmount
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Orders
    if (path === '/order-management-service/orders' && method === 'GET') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '20')
      const status = url.searchParams.get('status')

      let query = supabaseClient
        .from('orders')
        .select(`
          *,
          order_items(*),
          profiles!inner(full_name, email)
        `, { count: 'exact' })
        .eq('customer_id', user.id)

      if (status) {
        query = query.eq('status', status)
      }

      const { data: orders, error, count } = await query
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify({
          orders,
          pagination: {
            page,
            limit,
            total: count,
            pages: Math.ceil((count || 0) / limit)
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Single Order
    if (path.startsWith('/order-management-service/orders/') && method === 'GET') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const orderId = path.split('/').pop()

      const { data: order, error } = await supabaseClient
        .from('orders')
        .select(`
          *,
          order_items(*),
          vendor_orders(*),
          shipments(*)
        `)
        .eq('id', orderId)
        .eq('customer_id', user.id)
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify(order),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update Order Status
    if (path.startsWith('/order-management-service/orders/') && path.endsWith('/status') && method === 'PUT') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const orderId = path.split('/')[3]
      const { status, reason } = await req.json()

      // Check if user is admin or vendor for this order
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || !['admin', 'vendor'].includes(profile.role)) {
        throw new Error('Insufficient permissions')
      }

      const { data, error } = await supabaseClient
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error

      // Create order timeline entry
      await supabaseClient.from('order_timeline').insert({
        order_id: orderId,
        status,
        notes: reason,
        created_by: user.id
      })

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Cancel Order
    if (path.startsWith('/order-management-service/orders/') && path.endsWith('/cancel') && method === 'POST') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const orderId = path.split('/')[3]
      const { reason } = await req.json()

      // Verify order ownership
      const { data: order } = await supabaseClient
        .from('orders')
        .select('customer_id, status')
        .eq('id', orderId)
        .single()

      if (!order || order.customer_id !== user.id) {
        throw new Error('Unauthorized to cancel this order')
      }

      if (!['pending', 'confirmed'].includes(order.status)) {
        throw new Error('Order cannot be cancelled at this stage')
      }

      // Update order status
      const { data, error } = await supabaseClient
        .from('orders')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error

      // Create cancellation record
      await supabaseClient.from('order_cancellations').insert({
        order_id: orderId,
        cancelled_by: user.id,
        cancellation_reason: reason,
        refund_status: 'pending'
      })

      // Restore inventory
      const { data: orderItems } = await supabaseClient
        .from('order_items')
        .select('product_id, variant_id, quantity')
        .eq('order_id', orderId)

      for (const item of orderItems || []) {
        await supabaseClient.rpc('increase_product_stock', {
          p_product_id: item.product_id,
          p_variant_id: item.variant_id,
          p_quantity: item.quantity
        })
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Order cancelled successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vendor Orders
    if (path === '/order-management-service/vendor-orders' && method === 'GET') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      // Get vendor ID
      const { data: vendor } = await supabaseClient
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!vendor) throw new Error('Vendor not found')

      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '20')
      const status = url.searchParams.get('status')

      let query = supabaseClient
        .from('vendor_orders')
        .select(`
          *,
          orders!inner(*),
          vendors(business_name)
        `, { count: 'exact' })
        .eq('vendor_id', vendor.id)

      if (status) {
        query = query.eq('status', status)
      }

      const { data: orders, error, count } = await query
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify({
          orders,
          pagination: {
            page,
            limit,
            total: count,
            pages: Math.ceil((count || 0) / limit)
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Order Management Service Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})