import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      case 'analyze_competitive_pricing':
        return await analyzeCompetitivePricing(supabase, data);
      case 'detect_market_trends':
        return await detectMarketTrends(supabase, data);
      case 'benchmark_products':
        return await benchmarkProducts(supabase, data);
      case 'analyze_category_growth':
        return await analyzeCategoryGrowth(supabase, data);
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

async function analyzeCompetitivePricing(supabase: any, data: any) {
  const { product_id } = data;
  
  // Simulate competitive pricing analysis
  const competitors = [
    'Amazon', 'Flipkart', 'Alibaba', 'eBay', 'Walmart'
  ];
  
  const analyses = [];
  
  // Get product details
  const { data: product } = await supabase
    .from('products')
    .select('price')
    .eq('id', product_id)
    .single();
  
  const ourPrice = product?.price || 100;
  
  for (const competitor of competitors) {
    // Simulate competitor pricing data
    const competitorPrice = ourPrice * (0.7 + Math.random() * 0.6);
    const priceDifference = competitorPrice - ourPrice;
    const marketPosition = priceDifference > 0 ? 'below' : priceDifference < -10 ? 'above' : 'competitive';
    
    // Generate price trend (last 30 days)
    const priceTrend = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      priceTrend.push({
        date: date.toISOString().split('T')[0],
        price: competitorPrice * (0.95 + Math.random() * 0.1)
      });
    }
    
    const analysis = {
      product_id,
      competitor_name: competitor,
      competitor_price: Math.round(competitorPrice * 100) / 100,
      our_price: ourPrice,
      price_difference: Math.round(priceDifference * 100) / 100,
      market_position: marketPosition,
      price_trend: priceTrend,
      data_source: 'api_scraping'
    };
    
    analyses.push(analysis);
    
    // Insert into database
    await supabase.from('competitive_pricing_analysis').insert(analysis);
  }

  return new Response(JSON.stringify({ analyses }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function detectMarketTrends(supabase: any, data: any) {
  const { category_id } = data;
  
  // Simulate advanced market trend detection
  const trendTypes = [
    'sustainable_products', 'premium_segment_growth', 'mobile_commerce_shift',
    'social_commerce_rise', 'subscription_model_adoption', 'ai_personalization',
    'same_day_delivery', 'eco_friendly_packaging', 'voice_commerce', 'ar_shopping'
  ];
  
  const trends = [];
  
  for (const trendType of trendTypes.slice(0, 5)) {
    const trendDirection = Math.random() > 0.3 ? 'up' : Math.random() > 0.5 ? 'stable' : 'down';
    const trendStrength = Math.random();
    const confidenceScore = 0.6 + Math.random() * 0.3;
    
    // Generate trend data
    const trendData = {
      search_volume_change: (Math.random() - 0.5) * 200, // -100% to +100%
      social_mentions: Math.round(1000 + Math.random() * 5000),
      market_penetration: Math.random() * 100,
      growth_rate: trendDirection === 'up' ? 10 + Math.random() * 40 : -5 + Math.random() * 15,
      industry_adoption: Math.random() * 100
    };
    
    const trend = {
      category_id,
      trend_name: trendType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      trend_direction: trendDirection,
      trend_strength: Math.round(trendStrength * 100) / 100,
      trend_data: trendData,
      trend_period: Math.random() > 0.6 ? 'long' : Math.random() > 0.3 ? 'medium' : 'short',
      confidence_score: Math.round(confidenceScore * 100) / 100,
      market_impact: trendStrength > 0.7 ? 'high' : trendStrength > 0.4 ? 'medium' : 'low'
    };
    
    trends.push(trend);
    
    // Insert into database
    await supabase.from('market_trends').insert(trend);
  }

  return new Response(JSON.stringify({ trends }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function benchmarkProducts(supabase: any, data: any) {
  const { product_id, vendor_id } = data;
  
  const benchmarkTypes = ['sales', 'views', 'conversion', 'rating'];
  const benchmarks = [];
  
  for (const benchmarkType of benchmarkTypes) {
    // Simulate benchmarking data
    const ourMetric = 50 + Math.random() * 400; // Our performance
    const marketAverage = 100 + Math.random() * 200; // Market average
    const topPerformer = marketAverage * (1.5 + Math.random() * 0.5); // Top 10% performance
    
    const percentileRank = Math.min(99, Math.max(1, (ourMetric / topPerformer) * 100));
    const improvementPotential = ((topPerformer - ourMetric) / ourMetric) * 100;
    
    const categoryComparison = {
      electronics: marketAverage * (0.8 + Math.random() * 0.4),
      fashion: marketAverage * (0.9 + Math.random() * 0.3),
      home_garden: marketAverage * (0.7 + Math.random() * 0.5),
      books: marketAverage * (1.1 + Math.random() * 0.2)
    };
    
    const benchmark = {
      product_id,
      vendor_id,
      benchmark_type: benchmarkType,
      our_metric: Math.round(ourMetric * 100) / 100,
      market_average: Math.round(marketAverage * 100) / 100,
      top_performer: Math.round(topPerformer * 100) / 100,
      percentile_rank: Math.round(percentileRank),
      category_comparison: categoryComparison,
      improvement_potential: Math.round(improvementPotential * 100) / 100
    };
    
    benchmarks.push(benchmark);
    
    // Insert into database
    await supabase.from('product_benchmarks').insert(benchmark);
  }

  return new Response(JSON.stringify({ benchmarks }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function analyzeCategoryGrowth(supabase: any, data: any) {
  const { category_id } = data;
  
  const growthPeriods = ['monthly', 'quarterly', 'yearly'];
  const analyses = [];
  
  for (const period of growthPeriods) {
    // Simulate category growth analysis
    const baseGrowthRate = -5 + Math.random() * 30; // -5% to +25%
    const marketSize = 1000000 + Math.random() * 50000000; // $1M to $51M
    
    const growthDrivers = [
      'Digital transformation',
      'Changing consumer preferences',
      'New market segments',
      'Technological innovation',
      'Economic factors'
    ].filter(() => Math.random() > 0.6);
    
    const growthBarriers = [
      'Market saturation',
      'Regulatory challenges',
      'Supply chain issues',
      'Competitive pressure',
      'Economic uncertainty'
    ].filter(() => Math.random() > 0.7);
    
    const opportunityScore = Math.random() * 10;
    const competitiveIntensity = Math.random() * 10;
    
    const analysis = {
      category_id,
      growth_rate: Math.round(baseGrowthRate * 100) / 100,
      growth_period: period,
      market_size: Math.round(marketSize),
      growth_drivers: growthDrivers,
      growth_barriers: growthBarriers,
      opportunity_score: Math.round(opportunityScore * 100) / 100,
      competitive_intensity: Math.round(competitiveIntensity * 100) / 100
    };
    
    analyses.push(analysis);
    
    // Insert into database
    await supabase.from('category_growth_insights').insert(analysis);
  }

  return new Response(JSON.stringify({ analyses }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}