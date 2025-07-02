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
      case 'predict_demand':
        return await predictDemand(supabase, data);
      case 'optimize_inventory':
        return await optimizeInventory(supabase, data);
      case 'generate_reorder_alerts':
        return await generateReorderAlerts(supabase, data);
      case 'forecast_stockouts':
        return await forecastStockouts(supabase, data);
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

async function predictDemand(supabase: any, data: any) {
  const { productId, predictionHorizon, vendorId } = data;
  
  // Fetch historical sales data
  const { data: salesHistory, error } = await supabase
    .from('order_items')
    .select(`
      quantity,
      total_price,
      created_at,
      orders!inner(created_at, status)
    `)
    .eq('product_id', productId)
    .eq('orders.status', 'completed')
    .gte('created_at', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Get current inventory
  const { data: inventory } = await supabase
    .from('product_inventory')
    .select('current_stock, minimum_stock_level, maximum_stock_level')
    .eq('product_id', productId)
    .single();

  // Get product info for seasonality factors
  const { data: product } = await supabase
    .from('products')
    .select('name, category_id, price, categories(name)')
    .eq('id', productId)
    .single();

  // Time series analysis for demand prediction
  const demandForecast = await calculateDemandForecast(salesHistory, predictionHorizon);
  
  // AI-enhanced predictions if OpenAI is available
  let aiEnhancedForecast = null;
  if (openAIApiKey) {
    aiEnhancedForecast = await generateAIDemandPrediction({
      salesHistory: salesHistory.slice(-30), // Last 30 records
      product,
      seasonality: demandForecast.seasonality,
      trend: demandForecast.trend,
      predictionHorizon
    });
  }

  // Calculate optimal stock levels
  const optimalStock = calculateOptimalStockLevels(
    demandForecast.predictedDemand,
    inventory,
    {
      leadTimeDays: 7, // Default lead time
      serviceLevel: 0.95, // 95% service level
      demandVariability: demandForecast.variability
    }
  );

  // Store prediction in database
  const prediction = {
    product_id: productId,
    vendor_id: vendorId,
    prediction_horizon: predictionHorizon,
    predicted_demand: demandForecast.predictedDemand,
    recommended_stock_level: optimalStock.recommendedStock,
    reorder_point: optimalStock.reorderPoint,
    lead_time_days: 7,
    confidence_score: demandForecast.confidence,
    seasonality_factor: demandForecast.seasonality,
    trend_factor: demandForecast.trend,
    external_factors: {
      ai_enhanced: !!aiEnhancedForecast,
      historical_data_points: salesHistory.length,
      demand_variability: demandForecast.variability
    },
    prediction_model: aiEnhancedForecast ? 'ai_enhanced_time_series' : 'time_series',
    valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };

  await supabase.from('inventory_predictions').insert(prediction);

  return new Response(JSON.stringify({
    prediction,
    ai_enhanced: !!aiEnhancedForecast,
    current_stock: inventory?.current_stock || 0,
    recommended_action: optimalStock.action
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function optimizeInventory(supabase: any, data: any) {
  const { vendorId, timeHorizon } = data;
  
  // Get all products for vendor
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id, name, price,
      product_inventory(current_stock, minimum_stock_level, maximum_stock_level)
    `)
    .eq('vendor_id', vendorId);

  if (error) throw error;

  const optimizationResults = [];
  
  for (const product of products) {
    if (!product.product_inventory?.[0]) continue;
    
    // Get recent predictions
    const { data: predictions } = await supabase
      .from('inventory_predictions')
      .select('*')
      .eq('product_id', product.id)
      .eq('vendor_id', vendorId)
      .gte('valid_until', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    const prediction = predictions?.[0];
    const inventory = product.product_inventory[0];
    
    if (!prediction) continue;

    // Calculate optimization recommendations
    const optimization = {
      product_id: product.id,
      product_name: product.name,
      current_stock: inventory.current_stock,
      predicted_demand: prediction.predicted_demand,
      recommended_stock: prediction.recommended_stock_level,
      reorder_point: prediction.reorder_point,
      action_required: determineAction(inventory, prediction),
      priority: calculatePriority(inventory, prediction),
      cost_impact: estimateCostImpact(product.price, inventory, prediction)
    };
    
    optimizationResults.push(optimization);
  }

  // Sort by priority
  optimizationResults.sort((a, b) => b.priority - a.priority);

  return new Response(JSON.stringify({
    total_products: products.length,
    optimized_products: optimizationResults.length,
    optimizations: optimizationResults,
    summary: {
      urgent_actions: optimizationResults.filter(o => o.priority > 8).length,
      total_cost_impact: optimizationResults.reduce((sum, o) => sum + Math.abs(o.cost_impact), 0)
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateReorderAlerts(supabase: any, data: any) {
  const { vendorId } = data;
  
  // Find products approaching reorder points
  const { data: alerts, error } = await supabase
    .rpc('get_reorder_alerts', { vendor_id: vendorId });

  if (error) {
    // Fallback query if RPC doesn't exist
    const { data: products } = await supabase
      .from('products')
      .select(`
        id, name,
        product_inventory!inner(current_stock, minimum_stock_level),
        inventory_predictions!left(predicted_demand, reorder_point, confidence_score)
      `)
      .eq('vendor_id', vendorId)
      .filter('product_inventory.current_stock', 'lte', 'product_inventory.minimum_stock_level');

    const formattedAlerts = products?.map(p => ({
      product_id: p.id,
      product_name: p.name,
      current_stock: p.product_inventory[0].current_stock,
      minimum_stock: p.product_inventory[0].minimum_stock_level,
      predicted_demand: p.inventory_predictions[0]?.predicted_demand || 0,
      urgency_score: calculateUrgencyScore(
        p.product_inventory[0].current_stock,
        p.product_inventory[0].minimum_stock_level,
        p.inventory_predictions[0]?.predicted_demand || 0
      )
    })) || [];

    return new Response(JSON.stringify({
      alerts_count: formattedAlerts.length,
      alerts: formattedAlerts.sort((a, b) => b.urgency_score - a.urgency_score)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ alerts }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function forecastStockouts(supabase: any, data: any) {
  const { vendorId, forecastDays } = data;
  
  // Get inventory predictions
  const { data: predictions, error } = await supabase
    .from('inventory_predictions')
    .select(`
      *,
      products!inner(name, vendor_id),
      product_inventory!inner(current_stock)
    `)
    .eq('products.vendor_id', vendorId)
    .gte('valid_until', new Date().toISOString());

  if (error) throw error;

  const stockoutForecasts = predictions.map(prediction => {
    const currentStock = prediction.product_inventory[0].current_stock;
    const dailyDemand = prediction.predicted_demand / prediction.prediction_horizon;
    const daysUntilStockout = currentStock / Math.max(dailyDemand, 0.1);
    
    return {
      product_id: prediction.product_id,
      product_name: prediction.products.name,
      current_stock: currentStock,
      daily_demand: dailyDemand,
      days_until_stockout: Math.max(0, daysUntilStockout),
      stockout_probability: calculateStockoutProbability(
        currentStock, 
        dailyDemand, 
        prediction.confidence_score,
        forecastDays
      ),
      risk_level: daysUntilStockout < 7 ? 'high' : daysUntilStockout < 14 ? 'medium' : 'low'
    };
  });

  // Sort by risk (soonest stockouts first)
  stockoutForecasts.sort((a, b) => a.days_until_stockout - b.days_until_stockout);

  return new Response(JSON.stringify({
    forecast_period_days: forecastDays,
    products_analyzed: stockoutForecasts.length,
    high_risk_products: stockoutForecasts.filter(f => f.risk_level === 'high').length,
    forecasts: stockoutForecasts
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Helper functions
async function generateAIDemandPrediction(data: any) {
  if (!openAIApiKey) return null;
  
  const prompt = `As an inventory management expert, analyze this product data and predict demand:
  
Product: ${data.product.name}
Category: ${data.product.categories?.name}
Recent Sales: ${JSON.stringify(data.salesHistory.slice(-10))}
Current Trend: ${data.trend}
Seasonality Factor: ${data.seasonality}
Prediction Horizon: ${data.predictionHorizon} days

Provide a JSON response with:
1. Predicted demand (number)
2. Confidence level (0-1)
3. Key factors influencing demand
4. Recommendations for inventory management`;

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
          { role: 'system', content: 'You are an expert inventory management analyst. Provide structured JSON responses.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
      }),
    });

    const aiResponse = await response.json();
    return JSON.parse(aiResponse.choices[0].message.content);
  } catch (error) {
    console.error('AI demand prediction failed:', error);
    return null;
  }
}

function calculateDemandForecast(salesHistory: any[], predictionHorizon: number) {
  if (salesHistory.length === 0) {
    return {
      predictedDemand: 0,
      confidence: 0.1,
      trend: 0,
      seasonality: 1,
      variability: 0
    };
  }

  // Calculate daily demand
  const dailyDemand = salesHistory.map(sale => ({
    date: sale.created_at.split('T')[0],
    quantity: sale.quantity
  }));

  // Group by date and sum quantities
  const demandByDate = dailyDemand.reduce((acc, curr) => {
    acc[curr.date] = (acc[curr.date] || 0) + curr.quantity;
    return acc;
  }, {});

  const demandValues = Object.values(demandByDate) as number[];
  
  if (demandValues.length === 0) {
    return {
      predictedDemand: 0,
      confidence: 0.1,
      trend: 0,
      seasonality: 1,
      variability: 0
    };
  }

  // Calculate moving average
  const avgDemand = demandValues.reduce((a, b) => a + b, 0) / demandValues.length;
  
  // Calculate trend
  const trend = calculateTrend(demandValues);
  
  // Simple seasonality (day of week effect)
  const seasonality = calculateSeasonality(dailyDemand);
  
  // Calculate variability (standard deviation)
  const variance = demandValues.reduce((sum, val) => sum + Math.pow(val - avgDemand, 2), 0) / demandValues.length;
  const variability = Math.sqrt(variance);
  
  // Predict demand for the horizon
  const predictedDemand = Math.max(0, avgDemand * predictionHorizon * (1 + trend) * seasonality);
  
  // Confidence based on data quality and variability
  const confidence = Math.max(0.1, Math.min(0.95, 
    (demandValues.length / 30) * (1 - Math.min(variability / avgDemand, 1))
  ));

  return {
    predictedDemand: Math.round(predictedDemand),
    confidence,
    trend,
    seasonality,
    variability
  };
}

function calculateOptimalStockLevels(predictedDemand: number, inventory: any, params: any) {
  const { leadTimeDays, serviceLevel, demandVariability } = params;
  
  // Safety stock calculation
  const safetyStock = Math.ceil(
    1.65 * Math.sqrt(leadTimeDays) * demandVariability * serviceLevel
  );
  
  // Reorder point
  const reorderPoint = (predictedDemand / 30) * leadTimeDays + safetyStock;
  
  // Recommended stock level (considering EOQ concepts)
  const recommendedStock = Math.max(
    reorderPoint + (predictedDemand / 2), // Buffer
    inventory?.minimum_stock_level || 0
  );
  
  // Determine action
  let action = 'monitor';
  if (inventory?.current_stock < reorderPoint) {
    action = 'urgent_reorder';
  } else if (inventory?.current_stock < recommendedStock * 0.8) {
    action = 'plan_reorder';
  } else if (inventory?.current_stock > recommendedStock * 1.5) {
    action = 'reduce_ordering';
  }

  return {
    recommendedStock: Math.round(recommendedStock),
    reorderPoint: Math.round(reorderPoint),
    safetyStock: Math.round(safetyStock),
    action
  };
}

function calculateTrend(values: number[]) {
  if (values.length < 2) return 0;
  
  const n = values.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
  const sumX2 = values.reduce((sum, _, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return slope / (sumY / n); // Normalize by average
}

function calculateSeasonality(dailyDemand: any[]) {
  // Simple day-of-week seasonality
  const dayOfWeekDemand = new Array(7).fill(0);
  const dayOfWeekCount = new Array(7).fill(0);
  
  dailyDemand.forEach(item => {
    const dayOfWeek = new Date(item.date).getDay();
    dayOfWeekDemand[dayOfWeek] += item.quantity;
    dayOfWeekCount[dayOfWeek]++;
  });
  
  const avgDemandByDay = dayOfWeekDemand.map((sum, i) => 
    dayOfWeekCount[i] > 0 ? sum / dayOfWeekCount[i] : 0
  );
  
  const overallAvg = avgDemandByDay.reduce((a, b) => a + b, 0) / 7;
  const currentDayOfWeek = new Date().getDay();
  
  return overallAvg > 0 ? avgDemandByDay[currentDayOfWeek] / overallAvg : 1;
}

function determineAction(inventory: any, prediction: any) {
  const currentStock = inventory.current_stock;
  const reorderPoint = prediction.reorder_point;
  const recommendedStock = prediction.recommended_stock_level;
  
  if (currentStock <= reorderPoint) return 'urgent_reorder';
  if (currentStock <= recommendedStock * 0.8) return 'plan_reorder';
  if (currentStock >= recommendedStock * 1.5) return 'reduce_ordering';
  return 'monitor';
}

function calculatePriority(inventory: any, prediction: any) {
  const stockRatio = inventory.current_stock / Math.max(prediction.recommended_stock_level, 1);
  const confidenceWeight = prediction.confidence_score;
  
  if (stockRatio < 0.3) return 10 * confidenceWeight; // Critical
  if (stockRatio < 0.5) return 8 * confidenceWeight;  // High
  if (stockRatio < 0.8) return 5 * confidenceWeight;  // Medium
  if (stockRatio > 2.0) return 3 * confidenceWeight;  // Overstock
  return 1 * confidenceWeight; // Normal
}

function estimateCostImpact(productPrice: number, inventory: any, prediction: any) {
  const stockDifference = prediction.recommended_stock_level - inventory.current_stock;
  return stockDifference * productPrice;
}

function calculateUrgencyScore(currentStock: number, minStock: number, predictedDemand: number) {
  const stockRatio = currentStock / Math.max(minStock, 1);
  const demandPressure = predictedDemand / Math.max(currentStock, 1);
  
  return Math.min(10, (1 / stockRatio) * demandPressure * 2);
}

function calculateStockoutProbability(currentStock: number, dailyDemand: number, confidence: number, forecastDays: number) {
  const daysUntilStockout = currentStock / Math.max(dailyDemand, 0.1);
  const timeRatio = forecastDays / Math.max(daysUntilStockout, 1);
  
  return Math.min(1, timeRatio * confidence);
}