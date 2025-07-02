import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const authHeader = req.headers.get('Authorization')!
    supabase.auth.setSession(authHeader)

    const { data: user } = await supabase.auth.getUser()
    if (!user?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const url = new URL(req.url)
    const analyticsType = url.searchParams.get('type')
    const period = url.searchParams.get('period') || 'daily'
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    switch (analyticsType) {
      case 'sales':
        let salesQuery = supabase
          .from('sales_analytics')
          .select('*')
          .eq('vendor_id', user.user.id)
          .eq('analytics_period', period)
          .order('analytics_date', { ascending: false })

        if (startDate && endDate) {
          salesQuery = salesQuery
            .gte('analytics_date', startDate)
            .lte('analytics_date', endDate)
        }

        const { data: salesData, error: salesError } = await salesQuery.limit(30)
        if (salesError) throw salesError

        // Calculate totals and trends
        const totalRevenue = salesData.reduce((sum, day) => sum + (day.total_revenue || 0), 0)
        const totalOrders = salesData.reduce((sum, day) => sum + (day.total_orders || 0), 0)
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

        return new Response(JSON.stringify({
          analytics: salesData,
          summary: {
            totalRevenue,
            totalOrders,
            avgOrderValue,
            period,
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'products':
        const { data: productAnalytics, error: productError } = await supabase
          .from('product_performance_analytics')
          .select(`
            *,
            products(name, description, image_url, price)
          `)
          .eq('vendor_id', user.user.id)
          .order('revenue', { ascending: false })
          .limit(50)

        if (productError) throw productError

        // Calculate product insights
        const topPerformers = productAnalytics.slice(0, 10)
        const totalProductRevenue = productAnalytics.reduce((sum, p) => sum + (p.revenue || 0), 0)
        const avgConversionRate = productAnalytics.reduce((sum, p) => sum + (p.conversion_rate || 0), 0) / productAnalytics.length

        return new Response(JSON.stringify({
          products: productAnalytics,
          insights: {
            topPerformers,
            totalProductRevenue,
            avgConversionRate,
            totalProducts: productAnalytics.length,
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'customers':
        const { data: customerAnalytics, error: customerError } = await supabase
          .from('customer_analytics')
          .select('*')
          .eq('vendor_id', user.user.id)
          .order('customer_lifetime_value', { ascending: false })
          .limit(100)

        if (customerError) throw customerError

        // Customer insights
        const totalCustomers = customerAnalytics.length
        const totalClv = customerAnalytics.reduce((sum, c) => sum + (c.customer_lifetime_value || 0), 0)
        const avgClv = totalCustomers > 0 ? totalClv / totalCustomers : 0
        const highValueCustomers = customerAnalytics.filter(c => c.customer_lifetime_value > avgClv * 1.5)
        const atRiskCustomers = customerAnalytics.filter(c => c.churn_risk_score > 0.7)

        return new Response(JSON.stringify({
          customers: customerAnalytics,
          insights: {
            totalCustomers,
            avgClv,
            highValueCustomers: highValueCustomers.length,
            atRiskCustomers: atRiskCustomers.length,
            topCustomers: customerAnalytics.slice(0, 20),
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'revenue':
        // Advanced revenue analytics with forecasting
        const { data: revenueData, error: revenueError } = await supabase
          .from('sales_analytics')
          .select('*')
          .eq('vendor_id', user.user.id)
          .order('analytics_date', { ascending: true })
          .limit(90) // Last 90 days

        if (revenueError) throw revenueError

        // Calculate revenue trends and forecasting
        const revenueByMonth = {}
        const revenueByCategory = {}
        let totalGrowth = 0

        revenueData.forEach(day => {
          const month = day.analytics_date.substring(0, 7) // YYYY-MM
          revenueByMonth[month] = (revenueByMonth[month] || 0) + day.total_revenue

          if (day.revenue_by_category) {
            Object.entries(day.revenue_by_category).forEach(([category, revenue]) => {
              revenueByCategory[category] = (revenueByCategory[category] || 0) + revenue
            })
          }

          totalGrowth += day.growth_metrics?.revenue_growth || 0
        })

        return new Response(JSON.stringify({
          revenueData,
          insights: {
            revenueByMonth,
            revenueByCategory,
            avgGrowthRate: totalGrowth / revenueData.length,
            monthlyTrend: Object.entries(revenueByMonth).map(([month, revenue]) => ({
              month,
              revenue
            })),
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'dashboard':
        // Comprehensive dashboard data
        const [salesResult, productResult, customerResult] = await Promise.all([
          supabase
            .from('sales_analytics')
            .select('*')
            .eq('vendor_id', user.user.id)
            .eq('analytics_period', 'daily')
            .order('analytics_date', { ascending: false })
            .limit(7),
          
          supabase
            .from('product_performance_analytics')
            .select('*')
            .eq('vendor_id', user.user.id)
            .order('revenue', { ascending: false })
            .limit(10),
          
          supabase
            .from('customer_analytics')
            .select('*')
            .eq('vendor_id', user.user.id)
            .order('customer_lifetime_value', { ascending: false })
            .limit(10)
        ])

        if (salesResult.error) throw salesResult.error
        if (productResult.error) throw productResult.error
        if (customerResult.error) throw customerResult.error

        const dashboardMetrics = {
          sales: {
            last7Days: salesResult.data,
            totalRevenue: salesResult.data.reduce((sum, day) => sum + (day.total_revenue || 0), 0),
            totalOrders: salesResult.data.reduce((sum, day) => sum + (day.total_orders || 0), 0),
          },
          products: {
            topPerforming: productResult.data,
            totalProducts: productResult.data.length,
          },
          customers: {
            topCustomers: customerResult.data,
            totalCustomers: customerResult.data.length,
          }
        }

        return new Response(JSON.stringify(dashboardMetrics), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        return new Response(JSON.stringify({ error: 'Invalid analytics type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

  } catch (error) {
    console.error('Analytics Error:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})