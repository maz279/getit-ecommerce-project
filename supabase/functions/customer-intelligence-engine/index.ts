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
      case 'analyze_journey':
        return await analyzeCustomerJourney(supabase, data);
      case 'get_journey_analytics':
        return await getJourneyAnalytics(supabase, data);
      case 'predict_next_action':
        return await predictNextAction(supabase, data);
      case 'segment_customers':
        return await segmentCustomers(supabase, data);
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

async function analyzeCustomerJourney(supabase: any, data: any) {
  const { customer_id, vendor_id } = data;
  
  // Get customer behavior data
  const { data: behaviors, error: behaviorError } = await supabase
    .from('user_behaviors')
    .select('*')
    .eq('user_id', customer_id)
    .order('created_at', { ascending: false })
    .limit(100);

  if (behaviorError) throw behaviorError;

  // Analyze journey patterns
  const journeyStages = ['awareness', 'consideration', 'purchase', 'retention', 'advocacy'];
  const stageAnalysis = {};
  
  for (const stage of journeyStages) {
    const stageEvents = behaviors.filter(b => 
      getEventStage(b.event_type, b.event_data) === stage
    );
    
    stageAnalysis[stage] = {
      event_count: stageEvents.length,
      last_interaction: stageEvents[0]?.created_at || null,
      conversion_indicators: calculateConversionIndicators(stageEvents),
      time_spent: calculateTimeSpent(stageEvents)
    };
  }

  // Store journey analytics
  const journeyData = {
    customer_id,
    vendor_id,
    journey_start: behaviors[behaviors.length - 1]?.created_at || new Date().toISOString(),
    current_stage_id: getCurrentStage(behaviors),
    stage_analysis: stageAnalysis,
    total_interactions: behaviors.length,
    last_interaction: behaviors[0]?.created_at || new Date().toISOString(),
    journey_metadata: {
      device_types: [...new Set(behaviors.map(b => b.event_data?.device_type).filter(Boolean))],
      channels: [...new Set(behaviors.map(b => b.event_data?.channel).filter(Boolean))],
      products_viewed: [...new Set(behaviors.filter(b => b.event_type === 'product_view').map(b => b.event_data?.product_id).filter(Boolean))]
    }
  };

  const { error: insertError } = await supabase
    .from('customer_journey_analytics')
    .upsert(journeyData, { onConflict: 'customer_id' });

  if (insertError) throw insertError;

  return new Response(JSON.stringify({ success: true, journey: journeyData }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getJourneyAnalytics(supabase: any, data: any) {
  const { vendor_id, date_range = '30_days' } = data;
  
  let dateFilter = new Date();
  dateFilter.setDate(dateFilter.getDate() - (date_range === '7_days' ? 7 : date_range === '30_days' ? 30 : 90));

  const { data: analytics, error } = await supabase
    .from('customer_journey_analytics')
    .select('*')
    .eq('vendor_id', vendor_id)
    .gte('created_at', dateFilter.toISOString());

  if (error) throw error;

  // Aggregate analytics
  const summary = {
    total_customers: analytics.length,
    stage_distribution: {},
    avg_interactions: analytics.reduce((sum, a) => sum + a.total_interactions, 0) / analytics.length || 0,
    conversion_funnel: calculateConversionFunnel(analytics),
    top_channels: getTopChannels(analytics),
    journey_insights: generateJourneyInsights(analytics)
  };

  // Calculate stage distribution
  const stages = ['awareness', 'consideration', 'purchase', 'retention', 'advocacy'];
  stages.forEach(stage => {
    summary.stage_distribution[stage] = analytics.filter(a => a.current_stage_id === stage).length;
  });

  return new Response(JSON.stringify({ success: true, analytics: summary }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function predictNextAction(supabase: any, data: any) {
  const { customer_id } = data;
  
  // Get AI insights for prediction
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiKey) {
    return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Get customer data
  const { data: customer, error: customerError } = await supabase
    .from('customer_journey_analytics')
    .select('*')
    .eq('customer_id', customer_id)
    .single();

  if (customerError) throw customerError;

  // Get recent behaviors
  const { data: behaviors, error: behaviorError } = await supabase
    .from('user_behaviors')
    .select('*')
    .eq('user_id', customer_id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (behaviorError) throw behaviorError;

  // Use AI to predict next action
  const prompt = `
    Analyze this customer journey data and predict the next most likely action:
    
    Current Stage: ${customer.current_stage_id}
    Total Interactions: ${customer.total_interactions}
    Recent Behaviors: ${JSON.stringify(behaviors.slice(0, 5))}
    Journey Metadata: ${JSON.stringify(customer.journey_metadata)}
    
    Provide a JSON response with:
    - predicted_action: the most likely next action
    - confidence_score: 0-1 confidence level
    - recommended_interventions: array of suggested interventions
    - timing_recommendation: when to take action
  `;

  const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a customer journey analytics expert. Respond only with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    }),
  });

  const aiData = await aiResponse.json();
  const prediction = JSON.parse(aiData.choices[0].message.content);

  return new Response(JSON.stringify({ success: true, prediction }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function segmentCustomers(supabase: any, data: any) {
  const { vendor_id } = data;
  
  const { data: customers, error } = await supabase
    .from('customer_journey_analytics')
    .select('*')
    .eq('vendor_id', vendor_id);

  if (error) throw error;

  // Segment customers based on journey patterns
  const segments = {
    'new_visitors': customers.filter(c => c.total_interactions <= 3 && c.current_stage_id === 'awareness'),
    'engaged_browsers': customers.filter(c => c.total_interactions > 3 && c.current_stage_id === 'consideration'),
    'active_buyers': customers.filter(c => c.current_stage_id === 'purchase'),
    'loyal_customers': customers.filter(c => c.current_stage_id === 'retention' && c.total_interactions > 10),
    'advocates': customers.filter(c => c.current_stage_id === 'advocacy'),
    'at_risk': customers.filter(c => {
      const lastInteraction = new Date(c.last_interaction);
      const daysSince = (Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince > 30 && c.current_stage_id !== 'advocacy';
    })
  };

  // Calculate segment metrics
  const segmentMetrics = {};
  Object.keys(segments).forEach(segment => {
    const customers = segments[segment];
    segmentMetrics[segment] = {
      count: customers.length,
      avg_interactions: customers.reduce((sum, c) => sum + c.total_interactions, 0) / customers.length || 0,
      most_common_stage: getMostCommonStage(customers),
      recommended_actions: getRecommendedActions(segment, customers)
    };
  });

  return new Response(JSON.stringify({ success: true, segments: segmentMetrics }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Helper functions
function getEventStage(eventType: string, eventData: any) {
  const stageMapping = {
    'page_view': 'awareness',
    'search': 'awareness',
    'product_view': 'consideration',
    'add_to_cart': 'consideration',
    'purchase': 'purchase',
    'review': 'retention',
    'referral': 'advocacy'
  };
  return stageMapping[eventType] || 'awareness';
}

function calculateConversionIndicators(events: any[]) {
  return {
    product_views: events.filter(e => e.event_type === 'product_view').length,
    cart_additions: events.filter(e => e.event_type === 'add_to_cart').length,
    purchases: events.filter(e => e.event_type === 'purchase').length
  };
}

function calculateTimeSpent(events: any[]) {
  if (events.length < 2) return 0;
  const first = new Date(events[events.length - 1].created_at);
  const last = new Date(events[0].created_at);
  return Math.round((last.getTime() - first.getTime()) / (1000 * 60)); // minutes
}

function getCurrentStage(behaviors: any[]) {
  if (!behaviors.length) return 'awareness';
  
  const recentEvents = behaviors.slice(0, 5);
  const stageScores = {
    'awareness': 0,
    'consideration': 0,
    'purchase': 0,
    'retention': 0,
    'advocacy': 0
  };

  recentEvents.forEach(event => {
    const stage = getEventStage(event.event_type, event.event_data);
    stageScores[stage]++;
  });

  return Object.keys(stageScores).reduce((a, b) => stageScores[a] > stageScores[b] ? a : b);
}

function calculateConversionFunnel(analytics: any[]) {
  const stages = ['awareness', 'consideration', 'purchase', 'retention', 'advocacy'];
  const funnel = {};
  
  stages.forEach((stage, index) => {
    const stageCount = analytics.filter(a => a.current_stage_id === stage).length;
    const conversionRate = index === 0 ? 100 : (stageCount / analytics.length) * 100;
    funnel[stage] = {
      count: stageCount,
      conversion_rate: Math.round(conversionRate * 100) / 100
    };
  });

  return funnel;
}

function getTopChannels(analytics: any[]) {
  const channelCounts = {};
  analytics.forEach(a => {
    const channels = a.journey_metadata?.channels || [];
    channels.forEach(channel => {
      channelCounts[channel] = (channelCounts[channel] || 0) + 1;
    });
  });

  return Object.entries(channelCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([channel, count]) => ({ channel, count }));
}

function generateJourneyInsights(analytics: any[]) {
  const insights = [];
  
  // Average journey length
  const avgJourneyLength = analytics.reduce((sum, a) => sum + a.total_interactions, 0) / analytics.length;
  if (avgJourneyLength > 15) {
    insights.push("Customers have long journey paths - consider simplifying the purchase process");
  }

  // Stage bottlenecks
  const stageDistribution = {};
  analytics.forEach(a => {
    stageDistribution[a.current_stage_id] = (stageDistribution[a.current_stage_id] || 0) + 1;
  });

  const considerationCount = stageDistribution['consideration'] || 0;
  const purchaseCount = stageDistribution['purchase'] || 0;
  if (considerationCount > purchaseCount * 3) {
    insights.push("High consideration-to-purchase drop-off detected - review conversion barriers");
  }

  return insights;
}

function getMostCommonStage(customers: any[]) {
  const stageCounts = {};
  customers.forEach(c => {
    stageCounts[c.current_stage_id] = (stageCounts[c.current_stage_id] || 0) + 1;
  });
  return Object.keys(stageCounts).reduce((a, b) => stageCounts[a] > stageCounts[b] ? a : b);
}

function getRecommendedActions(segment: string, customers: any[]) {
  const actions = {
    'new_visitors': ['Send welcome email series', 'Show product recommendations', 'Offer first-time buyer discount'],
    'engaged_browsers': ['Send cart abandonment emails', 'Show limited-time offers', 'Provide customer reviews'],
    'active_buyers': ['Upsell complementary products', 'Offer loyalty program', 'Request product reviews'],
    'loyal_customers': ['Offer exclusive deals', 'Invite to VIP program', 'Ask for referrals'],
    'advocates': ['Feature their reviews', 'Offer referral rewards', 'Engage on social media'],
    'at_risk': ['Send re-engagement campaign', 'Offer comeback discount', 'Survey for feedback']
  };
  return actions[segment] || ['Monitor customer behavior', 'Personalize communications'];
}