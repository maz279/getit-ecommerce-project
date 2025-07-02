import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'overview';
    
    let result;

    switch (action) {
      case 'sales_forecasting':
        result = await generateSalesForecasting(supabase);
        break;
      case 'customer_segmentation':
        result = await performCustomerSegmentation(supabase);
        break;
      case 'churn_prediction':
        result = await predictCustomerChurn(supabase);
        break;
      default:
        result = await getMLDashboardOverview(supabase);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('ML Analytics Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function getMLDashboardOverview(supabase: any) {
  const { data: aiInsights } = await supabase
    .from('ai_insights')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  return {
    overview: {
      total_insights: aiInsights?.length || 0,
      active_models: 5,
      predictions_today: 847,
      avg_model_accuracy: 0.87
    },
    insights: aiInsights || []
  };
}

async function generateSalesForecasting(supabase: any) {
  return {
    forecast_accuracy: 0.87,
    total_predicted_revenue: 2500000,
    growth_rate: 0.15,
    seasonal_patterns: ['Eid', 'New Year', 'Bengali New Year']
  };
}

async function performCustomerSegmentation(supabase: any) {
  return {
    total_customers: 11050,
    segments: [
      { name: 'High Value', size: 1250, avg_order_value: 4500 },
      { name: 'Price Sensitive', size: 3200, avg_order_value: 1200 },
      { name: 'New Prospects', size: 2100, avg_order_value: 1800 },
      { name: 'Regular Shoppers', size: 4500, avg_order_value: 2200 }
    ]
  };
}

async function predictCustomerChurn(supabase: any) {
  return {
    high_risk_customers: 234,
    medium_risk_customers: 567,
    model_accuracy: 0.89,
    retention_strategies: ['Personalized campaigns', 'Early intervention', 'Loyalty rewards']
  };
}