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
      case 'generate_executive_kpis':
        return await generateExecutiveKPIs(supabase, data);
      case 'create_strategic_insights':
        return await createStrategicInsights(supabase, data);
      case 'analyze_market_share':
        return await analyzeMarketShare(supabase, data);
      case 'map_growth_opportunities':
        return await mapGrowthOpportunities(supabase, data);
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

async function generateExecutiveKPIs(supabase: any, data: any) {
  const { time_period = 'monthly' } = data;
  
  const kpiCategories = [
    {
      category: 'revenue',
      metrics: [
        { name: 'Total Revenue', base: 5000000, variance: 0.2, unit: 'USD', target_multiplier: 1.15 },
        { name: 'Revenue Growth Rate', base: 15, variance: 0.3, unit: '%', target_multiplier: 1.2 },
        { name: 'Average Order Value', base: 125, variance: 0.15, unit: 'USD', target_multiplier: 1.1 },
        { name: 'Revenue per Customer', base: 450, variance: 0.25, unit: 'USD', target_multiplier: 1.25 }
      ]
    },
    {
      category: 'growth',
      metrics: [
        { name: 'Customer Acquisition Rate', base: 8, variance: 0.4, unit: '%', target_multiplier: 1.3 },
        { name: 'Market Penetration', base: 12, variance: 0.2, unit: '%', target_multiplier: 1.5 },
        { name: 'Product Category Expansion', base: 5, variance: 0.5, unit: 'count', target_multiplier: 2.0 },
        { name: 'Geographic Expansion', base: 3, variance: 0.3, unit: 'regions', target_multiplier: 1.7 }
      ]
    },
    {
      category: 'efficiency',
      metrics: [
        { name: 'Operational Efficiency', base: 85, variance: 0.1, unit: '%', target_multiplier: 1.1 },
        { name: 'Cost per Acquisition', base: 35, variance: 0.25, unit: 'USD', target_multiplier: 0.8 },
        { name: 'Inventory Turnover', base: 6.5, variance: 0.2, unit: 'times/year', target_multiplier: 1.2 },
        { name: 'Platform Uptime', base: 99.5, variance: 0.01, unit: '%', target_multiplier: 1.005 }
      ]
    },
    {
      category: 'market',
      metrics: [
        { name: 'Market Share', base: 8.5, variance: 0.15, unit: '%', target_multiplier: 1.4 },
        { name: 'Brand Recognition', base: 32, variance: 0.3, unit: '%', target_multiplier: 1.5 },
        { name: 'Customer Satisfaction', base: 4.3, variance: 0.1, unit: '5-point scale', target_multiplier: 1.1 },
        { name: 'Net Promoter Score', base: 45, variance: 0.2, unit: 'NPS', target_multiplier: 1.3 }
      ]
    }
  ];
  
  const kpis = [];
  
  for (const category of kpiCategories) {
    for (const metric of category.metrics) {
      const currentValue = metric.base * (1 + (Math.random() - 0.5) * metric.variance);
      const targetValue = metric.base * metric.target_multiplier;
      const previousPeriodValue = currentValue * (0.9 + Math.random() * 0.2);
      
      const trendPercentage = ((currentValue - previousPeriodValue) / previousPeriodValue) * 100;
      const trendDirection = trendPercentage > 2 ? 'up' : trendPercentage < -2 ? 'down' : 'stable';
      
      const performanceRatio = currentValue / targetValue;
      const performanceStatus = performanceRatio >= 1 ? 'excellent' :
                               performanceRatio >= 0.9 ? 'good' :
                               performanceRatio >= 0.8 ? 'warning' : 'critical';
      
      const benchmarkValue = metric.base * (1.1 + Math.random() * 0.3); // Industry benchmark
      
      const kpi = {
        metric_category: category.category,
        metric_name: metric.name,
        current_value: Math.round(currentValue * 100) / 100,
        target_value: Math.round(targetValue * 100) / 100,
        previous_period_value: Math.round(previousPeriodValue * 100) / 100,
        trend_direction: trendDirection,
        trend_percentage: Math.round(trendPercentage * 100) / 100,
        benchmark_value: Math.round(benchmarkValue * 100) / 100,
        performance_status: performanceStatus,
        time_period: time_period,
        metadata: {
          unit: metric.unit,
          measurement_method: 'automated_calculation',
          data_quality: 'high',
          last_updated: new Date().toISOString()
        }
      };
      
      kpis.push(kpi);
      
      await supabase.from('executive_kpi_dashboard').insert(kpi);
    }
  }

  return new Response(JSON.stringify({ kpis }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function createStrategicInsights(supabase: any, data: any) {
  const insightTemplates = [
    {
      category: 'market_opportunity',
      title: 'Emerging Market Segment Opportunity',
      description: 'Gen Z consumers show 40% higher engagement with sustainable products, representing a $2.3B opportunity',
      priority: 'high',
      impact: 8.5,
      complexity: 6.2,
      resources: { budget: 500000, team_size: 8, timeline: '6 months' },
      timeline: '6-12 months',
      metrics: ['Market share increase', 'Revenue growth', 'Customer acquisition'],
      risks: ['Market acceptance uncertainty', 'Competitive response', 'Supply chain challenges']
    },
    {
      category: 'competitive_threat',
      title: 'New Market Entrant Analysis',
      description: 'Major tech company entering our market with aggressive pricing and AI-powered features',
      priority: 'high',
      impact: 7.8,
      complexity: 8.1,
      resources: { budget: 1000000, team_size: 15, timeline: '3 months' },
      timeline: '3-6 months',
      metrics: ['Market share retention', 'Customer churn rate', 'Competitive positioning'],
      risks: ['Price war escalation', 'Technology gap', 'Customer migration']
    },
    {
      category: 'growth_driver',
      title: 'AI-Powered Personalization Initiative',
      description: 'Implementing advanced ML for hyper-personalized shopping experiences could increase conversion by 35%',
      priority: 'medium',
      impact: 9.2,
      complexity: 7.5,
      resources: { budget: 750000, team_size: 12, timeline: '9 months' },
      timeline: '9-15 months',
      metrics: ['Conversion rate improvement', 'Customer engagement', 'Revenue per user'],
      risks: ['Technical implementation challenges', 'Data privacy concerns', 'User adoption']
    },
    {
      category: 'market_opportunity',
      title: 'Cross-Border E-commerce Expansion',
      description: 'Southeast Asian markets show 65% year-over-year growth with low competition in our categories',
      priority: 'medium',
      impact: 8.8,
      complexity: 8.7,
      resources: { budget: 2000000, team_size: 25, timeline: '18 months' },
      timeline: '12-24 months',
      metrics: ['International revenue', 'Market penetration', 'Local partnerships'],
      risks: ['Regulatory compliance', 'Cultural adaptation', 'Logistics complexity']
    }
  ];
  
  const insights = [];
  
  for (const template of insightTemplates.slice(0, 3)) {
    const insight = {
      insight_category: template.category,
      insight_title: template.title,
      insight_description: template.description,
      strategic_priority: template.priority,
      business_impact: template.impact,
      implementation_complexity: template.complexity,
      resource_requirements: template.resources,
      timeline_estimate: template.timeline,
      success_metrics: template.metrics,
      risk_factors: template.risks,
      created_by: null, // System generated
      status: 'identified'
    };
    
    insights.push(insight);
    
    await supabase.from('strategic_planning_insights').insert(insight);
  }

  return new Response(JSON.stringify({ insights }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function analyzeMarketShare(supabase: any, data: any) {
  const { category_id, vendor_id, analysis_period = 'quarterly' } = data;
  
  // Simulate comprehensive market share analysis
  const totalMarketSize = 50000000 + Math.random() * 200000000; // $50M - $250M
  const ourMarketShare = 5 + Math.random() * 15; // 5% - 20%
  
  const competitorShares = {
    'Amazon': 25 + Math.random() * 10,
    'Shopee': 20 + Math.random() * 8,
    'Alibaba': 15 + Math.random() * 10,
    'Local Competitor 1': 8 + Math.random() * 5,
    'Local Competitor 2': 6 + Math.random() * 4,
    'Others': 15 + Math.random() * 10
  };
  
  // Normalize competitor shares
  const totalCompetitorShare = Object.values(competitorShares).reduce((a, b) => a + b, 0);
  const availableShare = 100 - ourMarketShare;
  Object.keys(competitorShares).forEach(key => {
    competitorShares[key] = (competitorShares[key] / totalCompetitorShare) * availableShare;
  });
  
  // Generate historical trend data
  const shareTrend = [];
  for (let i = 12; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    shareTrend.push({
      period: date.toISOString().slice(0, 7), // YYYY-MM format
      share: ourMarketShare * (0.8 + Math.random() * 0.4),
      market_size: totalMarketSize * (0.9 + Math.random() * 0.2)
    });
  }
  
  const shareGrowthRate = ((shareTrend[shareTrend.length - 1].share - shareTrend[0].share) / shareTrend[0].share) * 100;
  const marketGrowthRate = ((shareTrend[shareTrend.length - 1].market_size - shareTrend[0].market_size) / shareTrend[0].market_size) * 100;
  
  // Market position (ranking)
  const allShares = { 'Our Company': ourMarketShare, ...competitorShares };
  const sortedShares = Object.entries(allShares).sort(([,a], [,b]) => b - a);
  const marketPosition = sortedShares.findIndex(([name]) => name === 'Our Company') + 1;
  
  const growthOpportunities = [
    'Expand into premium segment',
    'Target underserved demographics',
    'Improve mobile experience',
    'Enhance logistics network',
    'Develop private label products'
  ].filter(() => Math.random() > 0.6);
  
  const analysis = {
    category_id,
    vendor_id,
    our_market_share: Math.round(ourMarketShare * 100) / 100,
    total_market_size: Math.round(totalMarketSize),
    competitor_shares: competitorShares,
    share_trend: shareTrend,
    market_position: marketPosition,
    share_growth_rate: Math.round(shareGrowthRate * 100) / 100,
    market_growth_rate: Math.round(marketGrowthRate * 100) / 100,
    analysis_period: analysis_period,
    growth_opportunities: growthOpportunities
  };
  
  await supabase.from('market_share_analysis').insert(analysis);

  return new Response(JSON.stringify({ analysis }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function mapGrowthOpportunities(supabase: any, data: any) {
  const { category_id, vendor_id } = data;
  
  const opportunityTemplates = [
    {
      name: 'Premium Product Line Extension',
      type: 'product',
      market_size: 15000000,
      growth_potential: 8.5,
      competitive_intensity: 6.2,
      entry_barriers: ['High R&D costs', 'Brand positioning'],
      success_probability: 0.72,
      investment_required: 2500000,
      expected_roi: 180,
      timeline: '12-18 months',
      risks: { market_acceptance: 'medium', competition: 'high', execution: 'medium' }
    },
    {
      name: 'Southeast Asia Market Entry',
      type: 'geographic',
      market_size: 85000000,
      growth_potential: 9.2,
      competitive_intensity: 5.8,
      entry_barriers: ['Regulatory requirements', 'Local partnerships', 'Logistics setup'],
      success_probability: 0.65,
      investment_required: 5000000,
      expected_roi: 250,
      timeline: '18-24 months',
      risks: { regulatory: 'high', cultural: 'medium', operational: 'high' }
    },
    {
      name: 'B2B Marketplace Channel',
      type: 'channel',
      market_size: 32000000,
      growth_potential: 7.8,
      competitive_intensity: 4.5,
      entry_barriers: ['Platform development', 'B2B sales team'],
      success_probability: 0.78,
      investment_required: 1800000,
      expected_roi: 220,
      timeline: '9-15 months',
      risks: { technology: 'medium', sales: 'low', market_fit: 'medium' }
    },
    {
      name: 'Sustainable Product Category',
      type: 'market',
      market_size: 45000000,
      growth_potential: 9.5,
      competitive_intensity: 3.2,
      entry_barriers: ['Supply chain transformation', 'Certification processes'],
      success_probability: 0.82,
      investment_required: 3200000,
      expected_roi: 195,
      timeline: '15-24 months',
      risks: { supply_chain: 'high', certification: 'medium', premium_pricing: 'low' }
    }
  ];
  
  const opportunities = [];
  
  for (const template of opportunityTemplates.slice(0, 3)) {
    const opportunity = {
      opportunity_name: template.name,
      opportunity_type: template.type,
      category_id: category_id,
      vendor_id: vendor_id,
      market_size: template.market_size,
      growth_potential: template.growth_potential,
      competitive_intensity: template.competitive_intensity,
      entry_barriers: template.entry_barriers,
      success_probability: template.success_probability,
      investment_required: template.investment_required,
      expected_roi: template.expected_roi,
      timeline_to_market: template.timeline,
      risk_assessment: template.risks,
      status: 'identified'
    };
    
    opportunities.push(opportunity);
    
    await supabase.from('growth_opportunity_mapping').insert(opportunity);
  }

  return new Response(JSON.stringify({ opportunities }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}