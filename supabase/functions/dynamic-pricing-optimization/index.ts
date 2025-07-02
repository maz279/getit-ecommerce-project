import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, data } = await req.json();

    switch (action) {
      case 'analyze_pricing':
        return await analyzePricing(supabase, data);
      case 'generate_suggestions':
        return await generatePricingSuggestions(supabase, data);
      case 'optimize_margins':
        return await optimizeMargins(supabase, data);
      case 'competitive_analysis':
        return await competitiveAnalysis(supabase, data);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzePricing(supabase: any, data: any) {
  const { productIds, vendorId } = data;
  
  // Get product data with sales history
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id, name, price, cost_price,
      category_id, vendor_id,
      categories(name),
      order_items(quantity, total_price, created_at, orders!inner(status))
    `)
    .in('id', productIds)
    .eq('vendor_id', vendorId);

  if (error) throw error;

  const pricingAnalysis = await Promise.all(products.map(async (product) => {
    // Calculate demand elasticity
    const salesData = product.order_items.filter(item => 
      item.orders.status === 'completed'
    );
    
    const demandElasticity = calculateDemandElasticity(salesData, product.price);
    
    // Get competitive pricing data
    const competitiveData = await getCompetitivePricing(supabase, product);
    
    // Calculate optimal price range
    const optimalPricing = calculateOptimalPricing(product, demandElasticity, competitiveData);
    
    // AI-enhanced pricing recommendations
    let aiRecommendations = null;
    if (openAIApiKey) {
      aiRecommendations = await generateAIPricingRecommendations({
        product,
        salesData: salesData.slice(-20),
        competitiveData,
        demandElasticity,
        optimalPricing
      });
    }

    return {
      product_id: product.id,
      product_name: product.name,
      current_price: product.price,
      cost_price: product.cost_price,
      current_margin: ((product.price - product.cost_price) / product.price * 100).toFixed(2),
      demand_elasticity: demandElasticity,
      competitive_position: competitiveData.position,
      optimal_price_range: optimalPricing.range,
      recommended_price: optimalPricing.recommendedPrice,
      expected_impact: optimalPricing.expectedImpact,
      ai_insights: aiRecommendations,
      last_analysis: new Date().toISOString()
    };
  }));

  return new Response(JSON.stringify({
    products_analyzed: pricingAnalysis.length,
    analysis: pricingAnalysis,
    summary: {
      avg_elasticity: pricingAnalysis.reduce((sum, p) => sum + p.demand_elasticity, 0) / pricingAnalysis.length,
      total_potential_impact: pricingAnalysis.reduce((sum, p) => sum + p.expected_impact.revenue_change, 0)
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generatePricingSuggestions(supabase: any, data: any) {
  const { productId, strategy, vendorId } = data;
  
  // Get product and related data
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id, name, price, cost_price, category_id,
      categories(name),
      product_inventory(current_stock, minimum_stock_level)
    `)
    .eq('id', productId)
    .eq('vendor_id', vendorId)
    .single();

  if (error) throw error;

  // Get pricing rules for this product/category
  const { data: pricingRules, error: rulesError } = await supabase
    .from('dynamic_pricing_rules')
    .select('*')
    .or(`product_id.eq.${productId},category_id.eq.${product.category_id}`)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (rulesError) throw rulesError;

  const rule = pricingRules[0];
  if (!rule) {
    throw new Error('No pricing rules found for this product');
  }

  // Apply pricing strategy
  const suggestion = await applyPricingStrategy(supabase, product, rule, strategy);
  
  // Store suggestion in database
  const pricingSuggestion = {
    product_id: productId,
    rule_id: rule.id,
    current_price: product.price,
    suggested_price: suggestion.suggestedPrice,
    price_change_percentage: suggestion.changePercentage,
    reasoning: suggestion.reasoning,
    confidence_score: suggestion.confidence,
    estimated_impact: suggestion.estimatedImpact,
    status: 'pending',
    valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };

  await supabase.from('dynamic_pricing_suggestions').insert(pricingSuggestion);

  return new Response(JSON.stringify({
    suggestion: pricingSuggestion,
    strategy_applied: strategy,
    confidence_level: suggestion.confidence > 0.8 ? 'high' : suggestion.confidence > 0.6 ? 'medium' : 'low'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function optimizeMargins(supabase: any, data: any) {
  const { vendorId, targetMargin, constraints } = data;
  
  // Get all products for vendor
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id, name, price, cost_price,
      order_items(quantity, total_price, created_at, orders!inner(status))
    `)
    .eq('vendor_id', vendorId);

  if (error) throw error;

  const marginOptimizations = products.map(product => {
    const currentMargin = ((product.price - product.cost_price) / product.price * 100);
    const marginGap = targetMargin - currentMargin;
    
    // Calculate sales velocity
    const recentSales = product.order_items
      .filter(item => item.orders.status === 'completed')
      .filter(item => new Date(item.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    const salesVelocity = recentSales.length / 30; // Sales per day
    
    // Calculate optimal price for target margin
    const optimalPrice = product.cost_price / (1 - targetMargin / 100);
    const priceChange = ((optimalPrice - product.price) / product.price * 100);
    
    // Estimate impact on sales (simple elasticity model)
    const elasticity = -1.5; // Assume moderate elasticity
    const volumeChange = elasticity * priceChange;
    const newVolume = salesVelocity * (1 + volumeChange / 100);
    
    const currentRevenue = salesVelocity * product.price * 30;
    const newRevenue = newVolume * optimalPrice * 30;
    const revenueImpact = newRevenue - currentRevenue;

    return {
      product_id: product.id,
      product_name: product.name,
      current_price: product.price,
      current_margin: currentMargin.toFixed(2),
      target_margin: targetMargin,
      optimal_price: optimalPrice.toFixed(2),
      price_change_percentage: priceChange.toFixed(2),
      estimated_volume_change: volumeChange.toFixed(2),
      estimated_revenue_impact: revenueImpact.toFixed(2),
      recommendation: priceChange > 10 ? 'gradual_increase' : priceChange < -10 ? 'evaluate_costs' : 'implement',
      risk_level: Math.abs(priceChange) > 15 ? 'high' : Math.abs(priceChange) > 5 ? 'medium' : 'low'
    };
  });

  // Sort by potential revenue impact
  marginOptimizations.sort((a, b) => parseFloat(b.estimated_revenue_impact) - parseFloat(a.estimated_revenue_impact));

  return new Response(JSON.stringify({
    total_products: products.length,
    optimizations: marginOptimizations,
    summary: {
      total_revenue_impact: marginOptimizations.reduce((sum, opt) => sum + parseFloat(opt.estimated_revenue_impact), 0),
      high_risk_changes: marginOptimizations.filter(opt => opt.risk_level === 'high').length,
      immediate_opportunities: marginOptimizations.filter(opt => opt.recommendation === 'implement').length
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function competitiveAnalysis(supabase: any, data: any) {
  const { productId, competitors } = data;
  
  // Get product details
  const { data: product, error } = await supabase
    .from('products')
    .select('id, name, price, category_id, categories(name)')
    .eq('id', productId)
    .single();

  if (error) throw error;

  // Get competitive pricing data (from competitive_pricing_analysis table)
  const { data: competitivePricing, error: compError } = await supabase
    .from('competitive_pricing_analysis')
    .select('*')
    .eq('product_id', productId)
    .order('last_updated', { ascending: false });

  if (compError) throw compError;

  // Calculate competitive metrics
  const competitiveMetrics = {
    our_price: product.price,
    market_average: 0,
    lowest_competitor: null,
    highest_competitor: null,
    price_position: 'unknown',
    market_share_estimate: 0,
    recommended_action: 'monitor'
  };

  if (competitivePricing.length > 0) {
    const prices = competitivePricing.map(cp => cp.competitor_price);
    competitiveMetrics.market_average = prices.reduce((a, b) => a + b, 0) / prices.length;
    competitiveMetrics.lowest_competitor = Math.min(...prices);
    competitiveMetrics.highest_competitor = Math.max(...prices);
    
    // Determine price position
    if (product.price < competitiveMetrics.market_average * 0.9) {
      competitiveMetrics.price_position = 'below_market';
      competitiveMetrics.recommended_action = 'consider_price_increase';
    } else if (product.price > competitiveMetrics.market_average * 1.1) {
      competitiveMetrics.price_position = 'above_market';
      competitiveMetrics.recommended_action = 'justify_premium_or_reduce';
    } else {
      competitiveMetrics.price_position = 'market_aligned';
      competitiveMetrics.recommended_action = 'maintain_competitive_watch';
    }
    
    // Estimate market share based on price competitiveness
    const priceCompetitiveness = 1 - (product.price - competitiveMetrics.lowest_competitor) / 
      (competitiveMetrics.highest_competitor - competitiveMetrics.lowest_competitor);
    competitiveMetrics.market_share_estimate = Math.max(0, Math.min(100, priceCompetitiveness * 100));
  }

  // AI-enhanced competitive insights
  let aiInsights = null;
  if (openAIApiKey && competitivePricing.length > 0) {
    aiInsights = await generateCompetitiveInsights({
      product,
      competitivePricing,
      competitiveMetrics
    });
  }

  return new Response(JSON.stringify({
    product_id: productId,
    product_name: product.name,
    competitive_analysis: competitiveMetrics,
    competitor_details: competitivePricing,
    ai_insights: aiInsights,
    recommendations: {
      immediate: competitiveMetrics.recommended_action,
      strategic: generateStrategicRecommendations(competitiveMetrics),
      risk_factors: identifyRiskFactors(competitiveMetrics, competitivePricing)
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Helper functions
async function generateAIPricingRecommendations(data: any) {
  if (!openAIApiKey) return null;
  
  const prompt = `As a pricing strategist, analyze this product data and provide pricing recommendations:

Product: ${data.product.name}
Current Price: $${data.product.price}
Cost: $${data.product.cost_price}
Recent Sales: ${JSON.stringify(data.salesData.slice(-5))}
Demand Elasticity: ${data.demandElasticity}
Competitive Position: ${data.competitiveData.position}

Provide JSON response with:
1. Recommended price point
2. Reasoning for the recommendation
3. Expected impact on sales and revenue
4. Risk assessment
5. Implementation timeline`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert pricing strategist. Provide structured JSON responses with actionable recommendations.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
      }),
    });

    const aiResponse = await response.json();
    return JSON.parse(aiResponse.choices[0].message.content);
  } catch (error) {
    console.error('AI pricing recommendations failed:', error);
    return null;
  }
}

function calculateDemandElasticity(salesData: any[], currentPrice: number) {
  if (salesData.length < 2) return -1; // Default elasticity
  
  // Group sales by time periods and calculate average quantities
  const periods = {};
  salesData.forEach(sale => {
    const period = new Date(sale.created_at).toISOString().slice(0, 7); // YYYY-MM
    if (!periods[period]) {
      periods[period] = { quantity: 0, count: 0, avgPrice: 0 };
    }
    periods[period].quantity += sale.quantity;
    periods[period].count += 1;
    periods[period].avgPrice += sale.total_price / sale.quantity;
  });

  // Calculate average price per period
  Object.keys(periods).forEach(period => {
    periods[period].avgPrice = periods[period].avgPrice / periods[period].count;
  });

  const periodData = Object.values(periods) as any[];
  if (periodData.length < 2) return -1;

  // Simple elasticity calculation (percentage change in quantity / percentage change in price)
  let totalElasticity = 0;
  let validPairs = 0;

  for (let i = 1; i < periodData.length; i++) {
    const prevPeriod = periodData[i - 1];
    const currPeriod = periodData[i];
    
    const quantityChange = (currPeriod.quantity - prevPeriod.quantity) / prevPeriod.quantity;
    const priceChange = (currPeriod.avgPrice - prevPeriod.avgPrice) / prevPeriod.avgPrice;
    
    if (Math.abs(priceChange) > 0.01) { // Avoid division by near-zero
      totalElasticity += quantityChange / priceChange;
      validPairs++;
    }
  }

  return validPairs > 0 ? totalElasticity / validPairs : -1;
}

async function getCompetitivePricing(supabase: any, product: any) {
  const { data: competitorData } = await supabase
    .from('competitive_pricing_analysis')
    .select('competitor_name, competitor_price, our_price')
    .eq('product_id', product.id)
    .order('last_updated', { ascending: false })
    .limit(5);

  if (!competitorData || competitorData.length === 0) {
    return {
      position: 'unknown',
      averagePrice: product.price,
      priceRange: { min: product.price, max: product.price }
    };
  }

  const prices = competitorData.map(c => c.competitor_price);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  
  let position = 'competitive';
  if (product.price < avgPrice * 0.9) position = 'below_market';
  else if (product.price > avgPrice * 1.1) position = 'premium';

  return {
    position,
    averagePrice: avgPrice,
    priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
    competitors: competitorData
  };
}

function calculateOptimalPricing(product: any, elasticity: number, competitiveData: any) {
  const currentPrice = product.price;
  const costPrice = product.cost_price || currentPrice * 0.7; // Assume 30% margin if cost not available
  
  // Price optimization based on elasticity and competition
  const competitivePressure = competitiveData.position === 'premium' ? -0.1 : 
                             competitiveData.position === 'below_market' ? 0.1 : 0;
  
  // Optimal price considering elasticity and competition
  const elasticityFactor = Math.max(-2, Math.min(-0.5, elasticity)); // Constrain elasticity
  const optimalMarkup = 1 / (1 + elasticityFactor) + competitivePressure;
  
  const recommendedPrice = Math.max(costPrice * 1.1, currentPrice * (1 + optimalMarkup * 0.1));
  const changePercentage = (recommendedPrice - currentPrice) / currentPrice * 100;
  
  // Estimate impact
  const volumeChange = elasticity * changePercentage;
  const revenueChange = changePercentage + volumeChange + (changePercentage * volumeChange / 100);

  return {
    recommendedPrice,
    range: {
      min: costPrice * 1.1,
      max: competitiveData.priceRange.max || currentPrice * 1.3
    },
    expectedImpact: {
      price_change: changePercentage,
      volume_change: volumeChange,
      revenue_change: revenueChange
    }
  };
}

async function applyPricingStrategy(supabase: any, product: any, rule: any, strategy: string) {
  let suggestedPrice = product.price;
  let reasoning = {};
  let confidence = 0.5;

  switch (strategy) {
    case 'competitive':
      const { data: competitors } = await supabase
        .from('competitive_pricing_analysis')
        .select('competitor_price')
        .eq('product_id', product.id);
      
      if (competitors && competitors.length > 0) {
        const avgCompetitorPrice = competitors.reduce((sum, c) => sum + c.competitor_price, 0) / competitors.length;
        suggestedPrice = avgCompetitorPrice * (1 - 0.05); // 5% below average
        reasoning = { strategy: 'competitive', benchmark: avgCompetitorPrice, discount: 0.05 };
        confidence = 0.8;
      }
      break;

    case 'demand_based':
      // Get recent order volume
      const { data: recentOrders } = await supabase
        .from('order_items')
        .select('quantity')
        .eq('product_id', product.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      
      const totalDemand = recentOrders?.reduce((sum, o) => sum + o.quantity, 0) || 0;
      const demandMultiplier = totalDemand > 50 ? 1.1 : totalDemand > 20 ? 1.05 : 0.95;
      
      suggestedPrice = product.price * demandMultiplier;
      reasoning = { strategy: 'demand_based', recent_demand: totalDemand, multiplier: demandMultiplier };
      confidence = 0.7;
      break;

    case 'inventory_based':
      const inventory = product.product_inventory?.[0];
      if (inventory) {
        const stockRatio = inventory.current_stock / inventory.minimum_stock_level;
        const inventoryMultiplier = stockRatio > 2 ? 0.9 : stockRatio < 0.5 ? 1.15 : 1;
        
        suggestedPrice = product.price * inventoryMultiplier;
        reasoning = { strategy: 'inventory_based', stock_ratio: stockRatio, multiplier: inventoryMultiplier };
        confidence = 0.6;
      }
      break;

    case 'margin_optimization':
      const targetMargin = 0.3; // 30% margin
      const costPrice = product.cost_price || product.price * 0.7;
      suggestedPrice = costPrice / (1 - targetMargin);
      reasoning = { strategy: 'margin_optimization', target_margin: targetMargin, cost_price: costPrice };
      confidence = 0.9;
      break;
  }

  // Apply rule constraints
  suggestedPrice = Math.max(rule.min_price, Math.min(rule.max_price, suggestedPrice));
  
  const changePercentage = (suggestedPrice - product.price) / product.price * 100;

  return {
    suggestedPrice: Math.round(suggestedPrice * 100) / 100,
    changePercentage: Math.round(changePercentage * 100) / 100,
    reasoning,
    confidence,
    estimatedImpact: {
      revenue_change: changePercentage * 0.8, // Simplified impact model
      margin_change: ((suggestedPrice - (product.cost_price || product.price * 0.7)) / suggestedPrice) * 100
    }
  };
}

async function generateCompetitiveInsights(data: any) {
  if (!openAIApiKey) return null;
  
  const prompt = `Analyze this competitive pricing data and provide strategic insights:

Product: ${data.product.name}
Our Price: $${data.product.price}
Market Average: $${data.competitiveMetrics.market_average}
Price Position: ${data.competitiveMetrics.price_position}
Competitors: ${JSON.stringify(data.competitivePricing.slice(0, 3))}

Provide insights on:
1. Competitive positioning opportunities
2. Market trends and threats
3. Pricing strategy recommendations
4. Competitive advantages to leverage`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a competitive intelligence analyst. Provide strategic insights in JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
      }),
    });

    const aiResponse = await response.json();
    return JSON.parse(aiResponse.choices[0].message.content);
  } catch (error) {
    console.error('AI competitive insights failed:', error);
    return null;
  }
}

function generateStrategicRecommendations(metrics: any) {
  const recommendations = [];
  
  if (metrics.price_position === 'below_market') {
    recommendations.push('Consider gradual price increases to improve margins');
    recommendations.push('Evaluate if current pricing reflects true product value');
  } else if (metrics.price_position === 'above_market') {
    recommendations.push('Justify premium pricing with enhanced value proposition');
    recommendations.push('Monitor customer retention and acquisition rates');
  }
  
  if (metrics.market_share_estimate < 15) {
    recommendations.push('Focus on competitive pricing to gain market share');
  } else if (metrics.market_share_estimate > 40) {
    recommendations.push('Consider premium pricing strategy to maximize profits');
  }
  
  return recommendations;
}

function identifyRiskFactors(metrics: any, competitivePricing: any[]) {
  const risks = [];
  
  if (metrics.price_position === 'above_market') {
    risks.push('High price may limit market penetration');
  }
  
  if (competitivePricing.length > 3) {
    risks.push('High competitive pressure in the market');
  }
  
  const priceVariance = competitivePricing.length > 0 ? 
    Math.max(...competitivePricing.map(c => c.competitor_price)) - 
    Math.min(...competitivePricing.map(c => c.competitor_price)) : 0;
  
  if (priceVariance > metrics.market_average * 0.3) {
    risks.push('High price volatility in the market');
  }
  
  return risks;
}