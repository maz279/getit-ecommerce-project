import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const url = new URL(req.url);
    const dashboardType = url.searchParams.get('type') || 'overview';
    const timeRange = url.searchParams.get('timeRange') || '7d';

    console.log(`Generating ML analytics dashboard: ${dashboardType} for ${timeRange}`);

    // Get predictive analytics data
    const { data: salesForecasts } = await supabaseClient
      .from('ai_sales_forecasts')
      .select('*')
      .gte('forecast_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('forecast_date', { ascending: false });

    // Get behavioral analytics
    const { data: userBehaviors } = await supabaseClient
      .from('user_behaviors')
      .select('*')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1000);

    // Get ML recommendations performance
    const { data: mlRecommendations } = await supabaseClient
      .from('ml_recommendations')
      .select('*')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(100);

    // Calculate behavioral insights
    const behaviorPatterns = userBehaviors?.reduce((acc: any, behavior) => {
      const action = behavior.action_type;
      acc[action] = (acc[action] || 0) + 1;
      return acc;
    }, {}) || {};

    // Calculate recommendation effectiveness
    const recEffectiveness = mlRecommendations?.reduce((acc: any, rec) => {
      acc.total++;
      if (rec.interaction_data?.clicked) acc.clicked++;
      if (rec.interaction_data?.converted) acc.converted++;
      return acc;
    }, { total: 0, clicked: 0, converted: 0 }) || { total: 0, clicked: 0, converted: 0 };

    // Generate market intelligence insights
    const marketInsights = {
      trendingCategories: Object.entries(behaviorPatterns)
        .sort(([,a]: any, [,b]: any) => b - a)
        .slice(0, 5),
      conversionRate: recEffectiveness.total > 0 ? 
        (recEffectiveness.converted / recEffectiveness.total * 100).toFixed(2) : 0,
      clickThroughRate: recEffectiveness.total > 0 ? 
        (recEffectiveness.clicked / recEffectiveness.total * 100).toFixed(2) : 0,
    };

    const dashboardData = {
      overview: {
        totalUsers: userBehaviors?.length || 0,
        totalRecommendations: mlRecommendations?.length || 0,
        conversionRate: marketInsights.conversionRate,
        avgSessionDuration: Math.round(Math.random() * 300 + 120), // Mock data
      },
      predictive: {
        salesForecasts: salesForecasts?.slice(0, 10) || [],
        revenueProjection: salesForecasts?.reduce((sum, forecast) => 
          sum + (forecast.predicted_sales || 0), 0) || 0,
        growthTrend: Math.round(Math.random() * 20 + 5), // Mock percentage
      },
      behavioral: {
        userActions: behaviorPatterns,
        sessionPatterns: {
          peakHours: [9, 12, 15, 18, 21],
          avgPagesPerSession: Math.round(Math.random() * 10 + 3),
          bounceRate: Math.round(Math.random() * 30 + 20),
        },
        customerSegments: [
          { name: 'High Value', count: Math.round(Math.random() * 1000 + 500), percentage: 25 },
          { name: 'Regular', count: Math.round(Math.random() * 2000 + 1000), percentage: 50 },
          { name: 'New', count: Math.round(Math.random() * 1000 + 200), percentage: 25 },
        ],
      },
      marketIntelligence: {
        ...marketInsights,
        competitorAnalysis: {
          marketShare: Math.round(Math.random() * 15 + 10),
          positionRank: Math.round(Math.random() * 5 + 1),
        },
        opportunities: [
          "Mobile commerce growth potential",
          "Voice search optimization",
          "Cross-selling automation",
          "Personalization enhancement",
        ],
      },
    };

    console.log(`Generated dashboard data for ${dashboardType}:`, dashboardData[dashboardType as keyof typeof dashboardData]);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: dashboardData[dashboardType as keyof typeof dashboardData] || dashboardData.overview,
        meta: { type: dashboardType, timeRange, generatedAt: new Date().toISOString() }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ML analytics dashboard:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});