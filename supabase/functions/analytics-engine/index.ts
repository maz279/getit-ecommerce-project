import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://deno.land/x/supabase@1.0.0/mod.ts"

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
      case 'track-event':
        return await trackEvent(req, supabaseClient)
      case 'get-dashboard-data':
        return await getDashboardData(req, supabaseClient)
      case 'vendor-analytics':
        return await getVendorAnalytics(req, supabaseClient)
      case 'sales-analytics':
        return await getSalesAnalytics(req, supabaseClient)
      case 'real-time-metrics':
        return await getRealTimeMetrics(req, supabaseClient)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Analytics engine error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function trackEvent(req: Request, supabaseClient: any) {
  const { event_name, event_category, user_id, properties } = await req.json()
  
  await supabaseClient.from('analytics_events').insert({
    event_name,
    event_category,
    event_action: properties?.action || 'default',
    user_id,
    custom_properties: properties || {},
    page_url: properties?.page_url,
    session_id: properties?.session_id,
    created_at: new Date().toISOString()
  })

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getDashboardData(req: Request, supabaseClient: any) {
  const today = new Date().toISOString().split('T')[0]
  
  // Get key metrics
  const { data: totalOrders } = await supabaseClient
    .from('orders')
    .select('count', { count: 'exact' })
    .gte('created_at', today)
  
  const { data: totalRevenue } = await supabaseClient
    .from('orders')
    .select('total_amount')
    .gte('created_at', today)
    .eq('status', 'completed')
  
  const revenue = totalRevenue?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
  
  return new Response(JSON.stringify({
    success: true,
    data: {
      today_orders: totalOrders?.[0]?.count || 0,
      today_revenue: revenue,
      active_users: 150, // Mock data
      conversion_rate: 3.2 // Mock data
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getVendorAnalytics(req: Request, supabaseClient: any) {
  const { vendor_id, period } = await req.json()
  
  // Mock vendor analytics
  return new Response(JSON.stringify({
    success: true,
    analytics: {
      total_sales: 150000,
      commission_earned: 7500,
      orders_count: 45,
      avg_order_value: 3333,
      top_products: [
        { name: 'Product A', sales: 25000 },
        { name: 'Product B', sales: 18000 }
      ]
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getSalesAnalytics(req: Request, supabaseClient: any) {
  // Mock sales analytics
  return new Response(JSON.stringify({
    success: true,
    analytics: {
      total_revenue: 500000,
      growth_rate: 15.2,
      top_categories: [
        { category: 'Electronics', revenue: 200000 },
        { category: 'Fashion', revenue: 150000 }
      ]
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getRealTimeMetrics(req: Request, supabaseClient: any) {
  return new Response(JSON.stringify({
    success: true,
    metrics: {
      active_users: Math.floor(Math.random() * 500) + 100,
      current_orders: Math.floor(Math.random() * 50) + 10,
      revenue_today: Math.floor(Math.random() * 100000) + 50000
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}