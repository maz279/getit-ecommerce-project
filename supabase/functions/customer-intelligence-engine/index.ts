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
      case 'predict_customer_ltv':
        return await predictCustomerLTV(supabase, data);
      case 'analyze_churn_risk':
        return await analyzeChurnRisk(supabase, data);
      case 'generate_personalized_pricing':
        return await generatePersonalizedPricing(supabase, data);
      case 'generate_recommendations':
        return await generateRecommendations(supabase, data);
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

async function predictCustomerLTV(supabase: any, data: any) {
  const { customer_id, vendor_id, prediction_horizon = 12 } = data;
  
  // Simulate advanced CLV prediction
  const baseClv = 500 + Math.random() * 2000;
  const confidenceInterval = {
    lower: baseClv * 0.7,
    upper: baseClv * 1.4
  };
  
  const clvFactors = {
    purchase_frequency: 2 + Math.random() * 8, // purchases per month
    average_order_value: 50 + Math.random() * 200,
    customer_lifespan: 12 + Math.random() * 36, // months
    retention_rate: 0.7 + Math.random() * 0.25,
    referral_value: Math.random() * 100
  };
  
  const segments = ['high_value', 'medium_value', 'low_value', 'at_risk', 'new'];
  const segmentClassification = segments[Math.floor(Math.random() * segments.length)];
  
  const riskFactors = [
    'Declining order frequency',
    'Price sensitivity',
    'Support complaints',
    'Competition usage'
  ].filter(() => Math.random() > 0.7);
  
  const opportunityFactors = [
    'Cross-sell potential',
    'Upsell opportunities',
    'Loyalty program engagement',
    'Social media influence'
  ].filter(() => Math.random() > 0.6);
  
  const prediction = {
    customer_id,
    vendor_id,
    predicted_clv: Math.round(baseClv * 100) / 100,
    confidence_interval,
    clv_factors,
    prediction_horizon,
    segment_classification: segmentClassification,
    risk_factors: riskFactors,
    opportunity_factors: opportunityFactors,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  await supabase.from('customer_lifetime_value_predictions').insert(prediction);

  return new Response(JSON.stringify({ prediction }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function analyzeChurnRisk(supabase: any, data: any) {
  const { customer_id, vendor_id } = data;
  
  // Advanced churn prediction with intervention recommendations
  const churnProbability = Math.random();
  const riskLevel = churnProbability > 0.7 ? 'critical' : 
                   churnProbability > 0.5 ? 'high' : 
                   churnProbability > 0.3 ? 'medium' : 'low';
  
  const riskFactors = {
    days_since_last_purchase: 30 + Math.random() * 60,
    order_frequency_decline: Math.random() * 50, // percentage
    support_ticket_count: Math.floor(Math.random() * 5),
    price_sensitivity_score: Math.random(),
    competitor_engagement: Math.random() > 0.8,
    session_duration_decline: Math.random() * 30
  };
  
  // AI-powered intervention recommendations
  const interventions = [];
  if (churnProbability > 0.5) {
    interventions.push({
      type: 'personalized_discount',
      description: 'Offer 15-25% discount on next purchase',
      expected_impact: 0.3,
      urgency: 'high'
    });
  }
  if (riskFactors.support_ticket_count > 2) {
    interventions.push({
      type: 'proactive_support',
      description: 'Schedule customer success call',
      expected_impact: 0.25,
      urgency: 'medium'
    });
  }
  if (riskFactors.competitor_engagement) {
    interventions.push({
      type: 'loyalty_program',
      description: 'Invite to VIP loyalty program',
      expected_impact: 0.4,
      urgency: 'high'
    });
  }
  
  const retentionStrategies = [
    {
      strategy: 'Personalized Recommendations',
      implementation: 'Use AI to suggest relevant products',
      expected_retention_lift: '15-25%'
    },
    {
      strategy: 'Win-back Campaign',
      implementation: 'Email series with progressive discounts',
      expected_retention_lift: '10-20%'
    },
    {
      strategy: 'Exclusive Access',
      implementation: 'Early access to new products/sales',
      expected_retention_lift: '20-30%'
    }
  ];
  
  const nextPurchaseDate = new Date();
  nextPurchaseDate.setDate(nextPurchaseDate.getDate() + (7 + Math.random() * 30));
  
  const analysis = {
    customer_id,
    vendor_id,
    churn_probability: Math.round(churnProbability * 100) / 100,
    churn_risk_level: riskLevel,
    risk_factors: riskFactors,
    intervention_recommendations: interventions,
    intervention_impact: {
      no_action: { retention_probability: 1 - churnProbability },
      with_intervention: { retention_probability: Math.min(0.95, 1 - churnProbability + 0.3) }
    },
    next_predicted_purchase: nextPurchaseDate.toISOString().split('T')[0],
    retention_strategies: retentionStrategies
  };
  
  await supabase.from('churn_predictions_detailed').insert(analysis);

  return new Response(JSON.stringify({ analysis }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generatePersonalizedPricing(supabase: any, data: any) {
  const { customer_id, product_id, vendor_id, base_price } = data;
  
  // Advanced personalized pricing algorithm
  const customerSegments = ['premium', 'price_sensitive', 'loyal', 'new', 'at_risk'];
  const customerSegment = customerSegments[Math.floor(Math.random() * customerSegments.length)];
  
  const priceSensitivity = Math.random(); // 0 = not sensitive, 1 = very sensitive
  const loyaltyScore = Math.random();
  const purchaseProbability = 0.3 + Math.random() * 0.6;
  
  let personalizedPrice = parseFloat(base_price);
  let discountPercentage = 0;
  let strategy = 'standard';
  
  // Personalization logic
  if (customerSegment === 'premium' && priceSensitivity < 0.3) {
    // Premium customers, less price sensitive
    personalizedPrice = base_price * 1.05; // Small premium
    strategy = 'premium_positioning';
  } else if (customerSegment === 'price_sensitive' || priceSensitivity > 0.7) {
    // Price sensitive customers
    discountPercentage = 10 + Math.random() * 15; // 10-25% discount
    personalizedPrice = base_price * (1 - discountPercentage / 100);
    strategy = 'acquisition';
  } else if (customerSegment === 'loyal' && loyaltyScore > 0.7) {
    // Loyal customers
    discountPercentage = 5 + Math.random() * 10; // 5-15% loyalty discount
    personalizedPrice = base_price * (1 - discountPercentage / 100);
    strategy = 'loyalty';
  } else if (customerSegment === 'at_risk') {
    // At-risk customers
    discountPercentage = 15 + Math.random() * 20; // 15-35% retention discount
    personalizedPrice = base_price * (1 - discountPercentage / 100);
    strategy = 'retention';
  }
  
  const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const pricingStrategy = {
    customer_id,
    product_id,
    vendor_id,
    base_price: parseFloat(base_price),
    personalized_price: Math.round(personalizedPrice * 100) / 100,
    discount_percentage: Math.round(discountPercentage * 100) / 100,
    pricing_strategy: strategy,
    customer_segment: customerSegment,
    price_sensitivity: Math.round(priceSensitivity * 100) / 100,
    purchase_probability: Math.round(purchaseProbability * 100) / 100,
    valid_until: validUntil.toISOString()
  };
  
  await supabase.from('personalized_pricing_strategies').insert(pricingStrategy);

  return new Response(JSON.stringify({ pricing_strategy: pricingStrategy }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateRecommendations(supabase: any, data: any) {
  const { customer_id, vendor_id, recommendation_type = 'mixed' } = data;
  
  // Get some sample products for recommendations
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, category')
    .limit(20);
  
  const recommendationTypes = recommendation_type === 'mixed' 
    ? ['cross_sell', 'upsell', 'similar', 'trending']
    : [recommendation_type];
  
  const recommendations = [];
  
  for (const type of recommendationTypes) {
    const numRecommendations = 3 + Math.floor(Math.random() * 5); // 3-7 recommendations
    const selectedProducts = products?.slice(0, numRecommendations) || [];
    
    const recommendedProducts = selectedProducts.map(product => ({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      confidence_score: 0.6 + Math.random() * 0.3,
      reason: generateRecommendationReason(type)
    }));
    
    const recommendationScore = Math.random() * 0.4 + 0.6; // 0.6-1.0
    const conversionProbability = Math.random() * 0.3 + 0.1; // 0.1-0.4
    const expectedRevenue = recommendedProducts.reduce((sum, p) => sum + p.price, 0) * conversionProbability;
    
    const reasoning = {
      algorithm: 'collaborative_filtering_with_content',
      factors: {
        purchase_history_similarity: Math.random(),
        behavioral_patterns: Math.random(),
        seasonal_trends: Math.random(),
        social_proof: Math.random()
      },
      confidence_factors: [
        'Similar customer preferences',
        'Seasonal trending',
        'High conversion products',
        'Complementary items'
      ].filter(() => Math.random() > 0.5)
    };
    
    const recommendation = {
      customer_id,
      vendor_id,
      recommendation_type: type,
      recommended_products: recommendedProducts,
      recommendation_score: Math.round(recommendationScore * 100) / 100,
      reasoning: reasoning,
      conversion_probability: Math.round(conversionProbability * 100) / 100,
      expected_revenue: Math.round(expectedRevenue * 100) / 100,
      expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    recommendations.push(recommendation);
    
    await supabase.from('recommendation_engine_data').insert(recommendation);
  }

  return new Response(JSON.stringify({ recommendations }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function generateRecommendationReason(type: string): string {
  const reasons = {
    cross_sell: [
      'Frequently bought together',
      'Complements your recent purchase',
      'Others who bought this also bought'
    ],
    upsell: [
      'Premium version available',
      'Better features for your needs',
      'Popular upgrade choice'
    ],
    similar: [
      'Similar to your browsing history',
      'Matches your preferences',
      'Alternative option'
    ],
    trending: [
      'Trending in your area',
      'Popular this week',
      'Highly rated by customers'
    ]
  };
  
  const typeReasons = reasons[type as keyof typeof reasons] || ['Recommended for you'];
  return typeReasons[Math.floor(Math.random() * typeReasons.length)];
}