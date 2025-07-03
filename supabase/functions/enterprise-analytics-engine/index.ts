import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, data } = await req.json();

    switch (action) {
      case 'advanced_market_analysis':
        return await performAdvancedMarketAnalysis(supabaseClient, data);
      case 'customer_lifetime_value':
        return await calculateCustomerLifetimeValue(supabaseClient, data);
      case 'predictive_analytics':
        return await generatePredictiveAnalytics(supabaseClient, data);
      case 'competitive_intelligence':
        return await getCompetitiveIntelligence(supabaseClient, data);
      case 'supply_chain_optimization':
        return await optimizeSupplyChain(supabaseClient, data);
      case 'dynamic_pricing':
        return await calculateDynamicPricing(supabaseClient, data);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Enterprise analytics error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Advanced market analysis (Amazon-level)
async function performAdvancedMarketAnalysis(supabase: any, data: any) {
  const { timeframe = '30', category, region } = data;
  
  // Market trend analysis
  const { data: salesData } = await supabase
    .from('order_items')
    .select(`
      quantity,
      unit_price,
      total_price,
      created_at,
      products(category, brand, vendor_id),
      orders(customer_id, shipping_address)
    `)
    .gte('created_at', new Date(Date.now() - parseInt(timeframe) * 24 * 60 * 60 * 1000).toISOString());

  // Customer behavior patterns
  const { data: customerData } = await supabase
    .from('user_behaviors')
    .select('*')
    .gte('created_at', new Date(Date.now() - parseInt(timeframe) * 24 * 60 * 60 * 1000).toISOString());

  // Market share analysis
  const categoryStats = salesData?.reduce((acc: any, item: any) => {
    const cat = item.products?.category || 'Unknown';
    if (!acc[cat]) {
      acc[cat] = { revenue: 0, units: 0, vendors: new Set() };
    }
    acc[cat].revenue += item.total_price;
    acc[cat].units += item.quantity;
    acc[cat].vendors.add(item.products?.vendor_id);
    return acc;
  }, {});

  // Growth trends
  const revenueByDay = salesData?.reduce((acc: any, item: any) => {
    const date = item.created_at.split('T')[0];
    acc[date] = (acc[date] || 0) + item.total_price;
    return acc;
  }, {});

  const totalRevenue = Object.values(revenueByDay || {}).reduce((sum: number, rev: any) => sum + rev, 0);
  const avgDailyRevenue = totalRevenue / parseInt(timeframe);

  // Market penetration insights
  const uniqueCustomers = new Set(salesData?.map(item => item.orders?.customer_id)).size;
  const totalOrders = salesData?.length || 0;
  const avgOrderValue = totalRevenue / totalOrders;

  return new Response(
    JSON.stringify({
      market_analysis: {
        timeframe: `${timeframe} days`,
        total_revenue: totalRevenue,
        avg_daily_revenue: avgDailyRevenue,
        unique_customers: uniqueCustomers,
        total_orders: totalOrders,
        avg_order_value: avgOrderValue,
        category_performance: Object.entries(categoryStats || {}).map(([cat, stats]: any) => ({
          category: cat,
          revenue: stats.revenue,
          units_sold: stats.units,
          vendor_count: stats.vendors.size,
          market_share: (stats.revenue / totalRevenue) * 100
        })),
        growth_trend: Object.entries(revenueByDay || {}).map(([date, revenue]) => ({
          date,
          revenue
        })),
        insights: [
          `Top performing category: ${Object.entries(categoryStats || {}).sort((a: any, b: any) => b[1].revenue - a[1].revenue)[0]?.[0] || 'N/A'}`,
          `Customer acquisition rate: ${(uniqueCustomers / parseInt(timeframe)).toFixed(2)} new customers/day`,
          `Revenue growth trend: ${avgDailyRevenue > 0 ? 'Positive' : 'Needs attention'}`
        ]
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Customer Lifetime Value (CLV) calculation
async function calculateCustomerLifetimeValue(supabase: any, data: any) {
  const { customer_segments, prediction_period = 12 } = data;

  // Get customer purchase history
  const { data: customerOrders } = await supabase
    .from('orders')
    .select(`
      id,
      customer_id,
      total_amount,
      created_at,
      order_items(quantity, unit_price, total_price)
    `)
    .order('created_at', { ascending: true });

  // Calculate CLV metrics per customer
  const customerMetrics = customerOrders?.reduce((acc: any, order: any) => {
    const customerId = order.customer_id;
    if (!acc[customerId]) {
      acc[customerId] = {
        total_spent: 0,
        order_count: 0,
        first_order: order.created_at,
        last_order: order.created_at,
        avg_order_value: 0,
        purchase_frequency: 0,
        lifetime_days: 0
      };
    }
    
    acc[customerId].total_spent += order.total_amount;
    acc[customerId].order_count += 1;
    acc[customerId].last_order = order.created_at;
    
    return acc;
  }, {});

  // Calculate CLV for each customer
  const clvResults = Object.entries(customerMetrics || {}).map(([customerId, metrics]: any) => {
    const lifetimeDays = (new Date(metrics.last_order).getTime() - new Date(metrics.first_order).getTime()) / (1000 * 60 * 60 * 24);
    const avgOrderValue = metrics.total_spent / metrics.order_count;
    const purchaseFrequency = metrics.order_count / Math.max(lifetimeDays / 30, 1); // Orders per month
    
    // CLV = Average Order Value × Purchase Frequency × Customer Lifetime (months)
    const predictedLifetime = Math.max(lifetimeDays / 30, prediction_period);
    const clv = avgOrderValue * purchaseFrequency * predictedLifetime;
    
    return {
      customer_id: customerId,
      total_spent: metrics.total_spent,
      order_count: metrics.order_count,
      avg_order_value: avgOrderValue,
      purchase_frequency: purchaseFrequency,
      predicted_clv: clv,
      lifetime_days: lifetimeDays,
      segment: clv > 50000 ? 'high_value' : clv > 20000 ? 'medium_value' : 'low_value'
    };
  });

  // Segment analysis
  const segmentStats = clvResults.reduce((acc: any, customer: any) => {
    const segment = customer.segment;
    if (!acc[segment]) {
      acc[segment] = { count: 0, total_clv: 0, avg_clv: 0 };
    }
    acc[segment].count += 1;
    acc[segment].total_clv += customer.predicted_clv;
    return acc;
  }, {});

  Object.keys(segmentStats).forEach(segment => {
    segmentStats[segment].avg_clv = segmentStats[segment].total_clv / segmentStats[segment].count;
  });

  return new Response(
    JSON.stringify({
      clv_analysis: {
        total_customers: clvResults.length,
        avg_clv: clvResults.reduce((sum, c) => sum + c.predicted_clv, 0) / clvResults.length,
        segment_breakdown: segmentStats,
        top_customers: clvResults.sort((a, b) => b.predicted_clv - a.predicted_clv).slice(0, 10),
        insights: [
          `High-value customers (${segmentStats.high_value?.count || 0}) represent ${((segmentStats.high_value?.total_clv || 0) / clvResults.reduce((sum, c) => sum + c.predicted_clv, 0) * 100).toFixed(1)}% of total CLV`,
          `Average customer lifetime: ${(clvResults.reduce((sum, c) => sum + c.lifetime_days, 0) / clvResults.length / 30).toFixed(1)} months`,
          `Top 10% customers drive ${((clvResults.slice(0, Math.ceil(clvResults.length * 0.1)).reduce((sum, c) => sum + c.predicted_clv, 0) / clvResults.reduce((sum, c) => sum + c.predicted_clv, 0)) * 100).toFixed(1)}% of total predicted value`
        ]
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// AI-powered predictive analytics
async function generatePredictiveAnalytics(supabase: any, data: any) {
  const { prediction_type, timeframe = 30 } = data;

  // Demand forecasting
  if (prediction_type === 'demand_forecast') {
    const { data: salesHistory } = await supabase
      .from('order_items')
      .select(`
        quantity,
        created_at,
        products(id, name, category, brand)
      `)
      .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

    // Simple trend analysis (in production, use advanced ML models)
    const productDemand = salesHistory?.reduce((acc: any, item: any) => {
      const productId = item.products?.id;
      const date = item.created_at.split('T')[0];
      
      if (!acc[productId]) {
        acc[productId] = {
          product_name: item.products?.name,
          category: item.products?.category,
          daily_sales: {},
          total_quantity: 0
        };
      }
      
      acc[productId].daily_sales[date] = (acc[productId].daily_sales[date] || 0) + item.quantity;
      acc[productId].total_quantity += item.quantity;
      return acc;
    }, {});

    // Calculate forecasts based on trends
    const forecasts = Object.entries(productDemand || {}).map(([productId, data]: any) => {
      const dailySales = Object.values(data.daily_sales);
      const avgDailySales = dailySales.reduce((sum: number, qty: any) => sum + qty, 0) / dailySales.length;
      const predictedDemand = avgDailySales * timeframe;
      
      // Simple trend calculation
      const recentSales = dailySales.slice(-7).reduce((sum: number, qty: any) => sum + qty, 0) / 7;
      const olderSales = dailySales.slice(0, 7).reduce((sum: number, qty: any) => sum + qty, 0) / 7;
      const trendDirection = recentSales > olderSales ? 'increasing' : 'decreasing';
      const trendMagnitude = Math.abs((recentSales - olderSales) / olderSales) * 100;

      return {
        product_id: productId,
        product_name: data.product_name,
        category: data.category,
        predicted_demand: Math.round(predictedDemand),
        confidence_score: Math.min(95, 60 + (dailySales.length * 2)), // Higher confidence with more data
        trend_direction: trendDirection,
        trend_magnitude: trendMagnitude,
        recommended_action: predictedDemand > data.total_quantity * 0.5 ? 'increase_inventory' : 'maintain_current'
      };
    });

    return new Response(
      JSON.stringify({
        prediction_type: 'demand_forecast',
        timeframe_days: timeframe,
        forecasts: forecasts.sort((a, b) => b.predicted_demand - a.predicted_demand).slice(0, 20),
        summary: {
          total_products_analyzed: forecasts.length,
          high_demand_products: forecasts.filter(f => f.predicted_demand > 100).length,
          increasing_trend_products: forecasts.filter(f => f.trend_direction === 'increasing').length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ error: 'Prediction type not supported' }),
    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Competitive intelligence
async function getCompetitiveIntelligence(supabase: any, data: any) {
  // This would integrate with external APIs for real competitive data
  // For now, provide internal market positioning
  
  const { data: vendorStats } = await supabase
    .from('vendors')
    .select(`
      id,
      business_name,
      vendor_commissions(commission_amount, transaction_date),
      vendor_ratings(overall_rating, total_reviews)
    `);

  const marketPositioning = vendorStats?.map((vendor: any) => {
    const totalRevenue = vendor.vendor_commissions?.reduce((sum: number, comm: any) => sum + (comm.commission_amount || 0), 0) || 0;
    const avgRating = vendor.vendor_ratings?.[0]?.overall_rating || 0;
    const reviewCount = vendor.vendor_ratings?.[0]?.total_reviews || 0;
    
    return {
      vendor_id: vendor.id,
      business_name: vendor.business_name,
      market_share: totalRevenue, // Will be calculated as percentage
      rating: avgRating,
      review_count: reviewCount,
      performance_score: (avgRating * 20) + Math.min(reviewCount / 10, 30) // 0-100 score
    };
  }).sort((a: any, b: any) => b.performance_score - a.performance_score);

  const totalMarketRevenue = marketPositioning?.reduce((sum, vendor) => sum + vendor.market_share, 0) || 1;
  
  marketPositioning?.forEach((vendor: any) => {
    vendor.market_share_percentage = (vendor.market_share / totalMarketRevenue) * 100;
  });

  return new Response(
    JSON.stringify({
      competitive_intelligence: {
        market_leaders: marketPositioning?.slice(0, 5),
        market_concentration: {
          top_5_market_share: marketPositioning?.slice(0, 5).reduce((sum, v) => sum + v.market_share_percentage, 0),
          herfindahl_index: marketPositioning?.reduce((sum, v) => sum + Math.pow(v.market_share_percentage, 2), 0) / 100
        },
        insights: [
          `Market leader: ${marketPositioning?.[0]?.business_name} with ${marketPositioning?.[0]?.market_share_percentage.toFixed(1)}% market share`,
          `Average vendor rating: ${(marketPositioning?.reduce((sum, v) => sum + v.rating, 0) / marketPositioning?.length).toFixed(1)}/5.0`,
          `Market competition level: ${marketPositioning?.[0]?.market_share_percentage > 30 ? 'Concentrated' : 'Competitive'}`
        ]
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Supply chain optimization
async function optimizeSupplyChain(supabase: any, data: any) {
  const { data: inventoryData } = await supabase
    .from('product_inventory')
    .select(`
      product_id,
      current_stock,
      minimum_stock_level,
      maximum_stock_level,
      products(name, category, vendor_id),
      stock_alerts(alert_type, severity)
    `);

  const optimizationRecommendations = inventoryData?.map((item: any) => {
    const stockRatio = item.current_stock / item.maximum_stock_level;
    const isLowStock = item.current_stock <= item.minimum_stock_level;
    const hasAlerts = item.stock_alerts?.length > 0;

    let recommendation = 'maintain_current';
    let priority = 'low';
    let action_needed = false;

    if (isLowStock) {
      recommendation = 'urgent_restock';
      priority = 'high';
      action_needed = true;
    } else if (stockRatio < 0.3) {
      recommendation = 'increase_stock';
      priority = 'medium';
      action_needed = true;
    } else if (stockRatio > 0.8) {
      recommendation = 'reduce_ordering';
      priority = 'low';
    }

    return {
      product_id: item.product_id,
      product_name: item.products?.name,
      category: item.products?.category,
      vendor_id: item.products?.vendor_id,
      current_stock: item.current_stock,
      stock_ratio: stockRatio,
      recommendation,
      priority,
      action_needed,
      has_alerts: hasAlerts
    };
  });

  const criticalItems = optimizationRecommendations?.filter(item => item.action_needed);
  const lowStockItems = optimizationRecommendations?.filter(item => item.recommendation === 'urgent_restock');

  return new Response(
    JSON.stringify({
      supply_chain_optimization: {
        total_products: optimizationRecommendations?.length || 0,
        critical_items: criticalItems?.length || 0,
        low_stock_alerts: lowStockItems?.length || 0,
        recommendations: optimizationRecommendations?.filter(item => item.action_needed).slice(0, 20),
        summary: {
          healthy_stock: optimizationRecommendations?.filter(item => !item.action_needed).length || 0,
          needs_attention: criticalItems?.length || 0,
          optimization_score: Math.max(0, 100 - (criticalItems?.length || 0) * 5)
        },
        insights: [
          `${lowStockItems?.length || 0} products need urgent restocking`,
          `${optimizationRecommendations?.filter(item => item.stock_ratio > 0.8).length || 0} products may be overstocked`,
          `Supply chain health score: ${Math.max(0, 100 - (criticalItems?.length || 0) * 5)}%`
        ]
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Dynamic pricing optimization
async function calculateDynamicPricing(supabase: any, data: any) {
  const { product_ids, market_conditions = 'normal' } = data;

  const { data: productData } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      category,
      vendor_id,
      order_items(quantity, unit_price, created_at),
      product_inventory(current_stock),
      product_reviews(rating)
    `)
    .in('id', product_ids || []);

  const pricingRecommendations = productData?.map((product: any) => {
    const recentSales = product.order_items?.filter((item: any) => 
      new Date(item.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ) || [];
    
    const salesVelocity = recentSales.length;
    const avgRating = product.product_reviews?.reduce((sum: number, review: any) => sum + review.rating, 0) / (product.product_reviews?.length || 1) || 0;
    const stockLevel = product.product_inventory?.[0]?.current_stock || 0;
    
    // Pricing factors
    let priceMultiplier = 1.0;
    
    // Demand-based pricing
    if (salesVelocity > 20) priceMultiplier += 0.05; // High demand
    if (salesVelocity < 5) priceMultiplier -= 0.05;  // Low demand
    
    // Quality-based pricing
    if (avgRating > 4.5) priceMultiplier += 0.03;
    if (avgRating < 3.0) priceMultiplier -= 0.08;
    
    // Inventory-based pricing
    if (stockLevel < 10) priceMultiplier += 0.02; // Low stock
    if (stockLevel > 100) priceMultiplier -= 0.02; // High stock
    
    // Market conditions
    if (market_conditions === 'high_demand') priceMultiplier += 0.05;
    if (market_conditions === 'recession') priceMultiplier -= 0.10;
    
    const recommendedPrice = product.price * priceMultiplier;
    const priceChange = ((recommendedPrice - product.price) / product.price) * 100;

    return {
      product_id: product.id,
      product_name: product.name,
      current_price: product.price,
      recommended_price: Math.round(recommendedPrice * 100) / 100,
      price_change_percentage: Math.round(priceChange * 100) / 100,
      factors: {
        sales_velocity: salesVelocity,
        avg_rating: avgRating,
        stock_level: stockLevel,
        market_conditions
      },
      recommendation: Math.abs(priceChange) > 2 ? 'adjust_price' : 'maintain_price',
      confidence_score: Math.min(95, 60 + (recentSales.length * 2))
    };
  });

  return new Response(
    JSON.stringify({
      dynamic_pricing: {
        analyzed_products: pricingRecommendations?.length || 0,
        avg_price_change: pricingRecommendations?.reduce((sum, p) => sum + Math.abs(p.price_change_percentage), 0) / (pricingRecommendations?.length || 1),
        recommendations: pricingRecommendations,
        summary: {
          increase_price: pricingRecommendations?.filter(p => p.price_change_percentage > 2).length || 0,
          decrease_price: pricingRecommendations?.filter(p => p.price_change_percentage < -2).length || 0,
          maintain_price: pricingRecommendations?.filter(p => Math.abs(p.price_change_percentage) <= 2).length || 0
        }
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}