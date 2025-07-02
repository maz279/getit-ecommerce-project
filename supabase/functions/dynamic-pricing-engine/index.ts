import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PricingRule {
  rule_name: string;
  rule_type: 'competitor_based' | 'demand_based' | 'inventory_based' | 'time_based' | 'user_segment';
  conditions: any;
  actions: any;
  priority: number;
  is_active: boolean;
  valid_from?: string;
  valid_until?: string;
}

interface PriceCalculationRequest {
  product_id: string;
  vendor_id: string;
  base_price: number;
  user_segment?: string;
  current_inventory?: number;
  context?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      supabaseClient.auth.setSession({
        access_token: authHeader.replace('Bearer ', ''),
        refresh_token: '',
      });
    }

    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // Get all active pricing rules
    if (path === '/dynamic-pricing-engine/rules' && method === 'GET') {
      const { data: rules, error } = await supabaseClient
        .from('pricing_rules')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ rules }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create new pricing rule
    if (path === '/dynamic-pricing-engine/rules' && method === 'POST') {
      const ruleData: PricingRule = await req.json();
      
      const { data: rule, error } = await supabaseClient
        .from('pricing_rules')
        .insert([ruleData])
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ 
        rule,
        message: 'Pricing rule created successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate dynamic price for a product
    if (path === '/dynamic-pricing-engine/calculate' && method === 'POST') {
      const request: PriceCalculationRequest = await req.json();
      
      // Get applicable pricing rules
      const { data: rules, error: rulesError } = await supabaseClient
        .from('pricing_rules')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (rulesError) throw rulesError;

      let finalPrice = request.base_price;
      const appliedRules: any[] = [];
      const priceAdjustments: any[] = [];

      // Get current market data
      const marketData = await getMarketData(request.product_id, supabaseClient);
      
      // Apply rules in priority order
      for (const rule of rules) {
        const adjustment = await evaluateRule(rule, request, marketData);
        
        if (adjustment.applied) {
          appliedRules.push({
            rule_id: rule.id,
            rule_name: rule.rule_name,
            rule_type: rule.rule_type,
            adjustment_type: adjustment.type,
            adjustment_value: adjustment.value,
            old_price: finalPrice,
            new_price: adjustment.new_price
          });
          
          priceAdjustments.push(adjustment);
          finalPrice = adjustment.new_price;
        }
      }

      // Record price change if different from base price
      if (finalPrice !== request.base_price) {
        const { error: historyError } = await supabaseClient
          .from('price_history')
          .insert([{
            product_id: request.product_id,
            vendor_id: request.vendor_id,
            old_price: request.base_price,
            new_price: finalPrice,
            change_reason: `Dynamic pricing applied: ${appliedRules.map(r => r.rule_name).join(', ')}`,
            rule_applied_id: appliedRules[0]?.rule_id
          }]);
      }

      return new Response(JSON.stringify({
        original_price: request.base_price,
        final_price: finalPrice,
        price_change: finalPrice - request.base_price,
        price_change_percentage: ((finalPrice - request.base_price) / request.base_price) * 100,
        applied_rules: appliedRules,
        price_adjustments: priceAdjustments,
        market_data: marketData,
        calculation_timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Batch price calculation for multiple products
    if (path === '/dynamic-pricing-engine/calculate-batch' && method === 'POST') {
      const { products } = await req.json();
      
      const results = [];
      
      for (const product of products) {
        try {
          const response = await calculateDynamicPrice(product, supabaseClient);
          results.push({
            product_id: product.product_id,
            success: true,
            ...response
          });
        } catch (error) {
          results.push({
            product_id: product.product_id,
            success: false,
            error: error.message
          });
        }
      }

      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get competitor prices
    if (path === '/dynamic-pricing-engine/competitor-analysis' && method === 'POST') {
      const { product_id, competitor_urls } = await req.json();
      
      const competitorPrices = await getCompetitorPrices(product_id, competitor_urls);
      
      // Calculate competitive positioning
      const analysis = {
        average_competitor_price: competitorPrices.reduce((sum, p) => sum + p.price, 0) / competitorPrices.length,
        min_competitor_price: Math.min(...competitorPrices.map(p => p.price)),
        max_competitor_price: Math.max(...competitorPrices.map(p => p.price)),
        competitor_prices: competitorPrices,
        recommended_actions: generateCompetitiveRecommendations(competitorPrices)
      };

      return new Response(JSON.stringify({ analysis }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Price optimization suggestions
    if (path === '/dynamic-pricing-engine/optimize' && method === 'POST') {
      const { product_id, vendor_id, time_period = '30d' } = await req.json();
      
      // Get historical data
      const { data: priceHistory, error: historyError } = await supabaseClient
        .from('price_history')
        .select('*')
        .eq('product_id', product_id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (historyError) throw historyError;

      // Get sales data
      const { data: salesData, error: salesError } = await supabaseClient
        .from('order_items')
        .select('quantity, price, created_at')
        .eq('product_id', product_id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (salesError) throw salesError;

      // Calculate price elasticity and optimization
      const optimization = calculatePriceOptimization(priceHistory, salesData);

      return new Response(JSON.stringify({ optimization }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Dynamic Pricing Engine Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getMarketData(productId: string, supabaseClient: any) {
  // Get demand indicators
  const { data: recentOrders } = await supabaseClient
    .from('order_items')
    .select('quantity, created_at')
    .eq('product_id', productId)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  // Get inventory levels
  const { data: inventory } = await supabaseClient
    .from('product_inventory')
    .select('current_stock, reserved_stock')
    .eq('product_id', productId)
    .single();

  // Get competitor data (mock for now)
  const competitorData = {
    average_price: 0,
    price_range: { min: 0, max: 0 }
  };

  return {
    weekly_demand: recentOrders?.reduce((sum, order) => sum + order.quantity, 0) || 0,
    current_stock: inventory?.current_stock || 0,
    stock_level: inventory?.current_stock > 100 ? 'high' : inventory?.current_stock > 20 ? 'medium' : 'low',
    competitor_data: competitorData,
    market_trends: {
      demand_trend: 'stable', // Would be calculated from historical data
      price_trend: 'stable'
    }
  };
}

async function evaluateRule(rule: any, request: PriceCalculationRequest, marketData: any) {
  const { rule_type, conditions, actions } = rule;
  
  let shouldApply = false;
  let adjustmentValue = 0;
  let adjustmentType = 'percentage';

  switch (rule_type) {
    case 'demand_based':
      if (conditions.high_demand_threshold && marketData.weekly_demand >= conditions.high_demand_threshold) {
        shouldApply = true;
        adjustmentValue = actions.high_demand_increase || 0;
      } else if (conditions.low_demand_threshold && marketData.weekly_demand <= conditions.low_demand_threshold) {
        shouldApply = true;
        adjustmentValue = -(actions.low_demand_decrease || 0);
      }
      break;

    case 'inventory_based':
      if (conditions.low_stock_threshold && marketData.current_stock <= conditions.low_stock_threshold) {
        shouldApply = true;
        adjustmentValue = actions.low_stock_increase || 0;
      } else if (conditions.high_stock_threshold && marketData.current_stock >= conditions.high_stock_threshold) {
        shouldApply = true;
        adjustmentValue = -(actions.high_stock_decrease || 0);
      }
      break;

    case 'time_based':
      const currentHour = new Date().getHours();
      if (conditions.peak_hours && conditions.peak_hours.includes(currentHour)) {
        shouldApply = true;
        adjustmentValue = actions.peak_hour_increase || 0;
      }
      break;

    case 'user_segment':
      if (request.user_segment && conditions.segments && conditions.segments[request.user_segment]) {
        shouldApply = true;
        adjustmentValue = conditions.segments[request.user_segment].discount || 0;
        adjustmentValue = -Math.abs(adjustmentValue); // Discounts are negative
      }
      break;
  }

  if (!shouldApply) {
    return { applied: false };
  }

  let newPrice = request.base_price;
  
  if (adjustmentType === 'percentage') {
    newPrice = request.base_price * (1 + adjustmentValue / 100);
  } else {
    newPrice = request.base_price + adjustmentValue;
  }

  // Apply min/max constraints
  if (actions.min_price && newPrice < actions.min_price) {
    newPrice = actions.min_price;
  }
  if (actions.max_price && newPrice > actions.max_price) {
    newPrice = actions.max_price;
  }

  return {
    applied: true,
    type: adjustmentType,
    value: adjustmentValue,
    new_price: Math.round(newPrice * 100) / 100
  };
}

async function calculateDynamicPrice(request: PriceCalculationRequest, supabaseClient: any) {
  // This would contain the same logic as the main calculate endpoint
  // Extracted for reuse in batch operations
  return {};
}

async function getCompetitorPrices(productId: string, competitorUrls: string[]) {
  // Mock implementation - in production, this would scrape competitor websites
  return [
    { source: 'Competitor A', price: 1200, url: 'https://competitor-a.com' },
    { source: 'Competitor B', price: 1150, url: 'https://competitor-b.com' },
    { source: 'Competitor C', price: 1300, url: 'https://competitor-c.com' }
  ];
}

function generateCompetitiveRecommendations(competitorPrices: any[]) {
  const avgPrice = competitorPrices.reduce((sum, p) => sum + p.price, 0) / competitorPrices.length;
  const minPrice = Math.min(...competitorPrices.map(p => p.price));
  
  return [
    {
      strategy: 'competitive_parity',
      suggested_price: avgPrice,
      reasoning: 'Price at market average for competitive positioning'
    },
    {
      strategy: 'price_leadership',
      suggested_price: minPrice - 50,
      reasoning: 'Undercut lowest competitor to gain market share'
    },
    {
      strategy: 'premium_positioning',
      suggested_price: avgPrice * 1.1,
      reasoning: 'Position as premium option with 10% markup'
    }
  ];
}

function calculatePriceOptimization(priceHistory: any[], salesData: any[]) {
  // Calculate price elasticity
  const priceChanges = [];
  const demandChanges = [];
  
  for (let i = 1; i < priceHistory.length; i++) {
    const priceChange = (priceHistory[i].new_price - priceHistory[i-1].new_price) / priceHistory[i-1].new_price;
    priceChanges.push(priceChange);
    
    // Calculate corresponding demand change
    const beforeSales = salesData.filter(s => s.created_at <= priceHistory[i].created_at).length;
    const afterSales = salesData.filter(s => s.created_at > priceHistory[i].created_at).length;
    const demandChange = afterSales > 0 ? (afterSales - beforeSales) / Math.max(beforeSales, 1) : 0;
    demandChanges.push(demandChange);
  }
  
  // Simple price elasticity calculation
  const elasticity = priceChanges.length > 0 ? 
    demandChanges.reduce((sum, d, i) => sum + (d / Math.max(Math.abs(priceChanges[i]), 0.01)), 0) / priceChanges.length : 0;
  
  return {
    price_elasticity: elasticity,
    optimal_price_increase: elasticity < -1 ? 0 : 5, // Suggest 5% increase if demand is inelastic
    confidence_level: priceHistory.length >= 5 ? 'high' : 'low',
    recommendations: [
      {
        action: elasticity < -1 ? 'maintain_price' : 'increase_price',
        reasoning: elasticity < -1 ? 'Demand is elastic - price increases will hurt sales' : 'Demand is inelastic - room for price optimization'
      }
    ]
  };
}