import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

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
      case 'generate_sales_forecast':
        return await generateSalesForecast(supabase, data);
      case 'generate_market_insights':
        return await generateMarketInsights(supabase, data);
      case 'generate_bi_insights':
        return await generateBIInsights(supabase, data);
      case 'generate_kpi_metrics':
        return await generateKPIMetrics(supabase, data);
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

async function generateSalesForecast(supabase: any, data: any) {
  // Mock sales forecasting logic
  const forecasts = [];
  const today = new Date();
  
  for (let i = 1; i <= 12; i++) {
    const futureDate = new Date(today);
    futureDate.setMonth(futureDate.getMonth() + i);
    
    forecasts.push({
      forecast_type: data.period || 'monthly',
      forecast_period_start: futureDate.toISOString().split('T')[0],
      forecast_period_end: new Date(futureDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      predicted_sales: Math.round(50000 + Math.random() * 100000),
      predicted_units: Math.round(100 + Math.random() * 500),
      confidence_interval: { lower: 0.7, upper: 0.9 },
      model_accuracy: 85 + Math.random() * 10,
      algorithm_used: data.algorithm || 'linear_regression'
    });
  }

  return new Response(JSON.stringify({ forecasts }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateMarketInsights(supabase: any, data: any) {
  // Mock market insights
  const insights = [
    {
      insight_type: 'trends',
      title: 'E-commerce Growth Acceleration',
      description: 'Mobile commerce is showing 25% month-over-month growth',
      trend_direction: 'up',
      confidence_score: 0.92,
      data: { growth_rate: 25, mobile_percentage: 68 }
    },
    {
      insight_type: 'competition',
      title: 'Competitive Pricing Opportunity',
      description: 'Electronics category shows 15% pricing advantage opportunity',
      trend_direction: 'stable',
      confidence_score: 0.78,
      data: { price_advantage: 15, category: 'electronics' }
    }
  ];

  return new Response(JSON.stringify({ insights }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateBIInsights(supabase: any, data: any) {
  const insights = [
    {
      insight_category: 'revenue',
      insight_title: 'Revenue Spike Detected',
      insight_description: 'Unusual 40% revenue increase in fashion category',
      insight_type: 'anomaly',
      priority: 'high',
      confidence_score: 0.95,
      impact_score: 0.88,
      action_items: ['Investigate supply chain', 'Scale marketing', 'Monitor inventory']
    }
  ];

  return new Response(JSON.stringify({ insights }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateKPIMetrics(supabase: any, data: any) {
  const metrics = [
    {
      metric_name: 'Monthly Revenue',
      metric_category: 'sales',
      metric_value: 2400000,
      metric_unit: 'BDT',
      comparison_value: 2100000,
      percentage_change: 14.3,
      trend_direction: 'up',
      time_period: 'monthly'
    },
    {
      metric_name: 'Active Customers',
      metric_category: 'customers',
      metric_value: 12500,
      metric_unit: 'count',
      comparison_value: 11800,
      percentage_change: 5.9,
      trend_direction: 'up',
      time_period: 'monthly'
    }
  ];

  return new Response(JSON.stringify({ metrics }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}