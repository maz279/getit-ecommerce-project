import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

interface FraudAnalysisRequest {
  transaction_id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  device_info: {
    ip_address: string;
    user_agent: string;
    device_id: string;
  };
  behavioral_data: {
    session_duration: number;
    pages_visited: number;
    previous_purchases: number;
  };
}

interface FraudScore {
  overall_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: string[];
  recommendations: string[];
  requires_manual_review: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...payload } = await req.json();

    switch (action) {
      case 'analyze_transaction':
        return await analyzeTransaction(payload as FraudAnalysisRequest);
      case 'get_fraud_patterns':
        return await getFraudPatterns();
      case 'update_fraud_rules':
        return await updateFraudRules(payload);
      case 'get_fraud_analytics':
        return await getFraudAnalytics();
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Fraud detection error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeTransaction(request: FraudAnalysisRequest): Promise<Response> {
  console.log('Analyzing transaction for fraud:', request.transaction_id);
  
  // Get user behavioral profile
  const { data: userProfile } = await supabase
    .from('user_behavioral_profiles')
    .select('*')
    .eq('user_id', request.user_id)
    .single();

  // Calculate fraud score
  let fraudScore = 0;
  const riskFactors: string[] = [];
  const recommendations: string[] = [];

  // Amount-based analysis
  if (request.amount > 50000) {
    fraudScore += 25;
    riskFactors.push('High transaction amount');
  }

  // Behavioral analysis
  if (userProfile) {
    const avgAmount = userProfile.transaction_patterns?.avg_amount || 1000;
    if (request.amount > avgAmount * 3) {
      fraudScore += 20;
      riskFactors.push('Amount significantly higher than user average');
    }
  } else {
    fraudScore += 15;
    riskFactors.push('New user with no transaction history');
  }

  // Device and location analysis
  const { data: recentSessions } = await supabase
    .from('zero_trust_sessions')
    .select('*')
    .eq('user_id', request.user_id)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(5);

  if (recentSessions && recentSessions.length > 0) {
    const knownDevices = recentSessions.filter(s => 
      s.device_fingerprint === request.device_info.device_id
    ).length;
    
    if (knownDevices === 0) {
      fraudScore += 20;
      riskFactors.push('Unknown device');
    }
  }

  // Time-based analysis
  const hour = new Date().getHours();
  if (hour >= 2 && hour <= 5) {
    fraudScore += 10;
    riskFactors.push('Transaction during unusual hours');
  }

  // Payment method analysis
  if (request.payment_method === 'cod' && request.amount > 10000) {
    fraudScore += 15;
    riskFactors.push('High value COD transaction');
  }

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (fraudScore >= 70) riskLevel = 'critical';
  else if (fraudScore >= 50) riskLevel = 'high';
  else if (fraudScore >= 30) riskLevel = 'medium';
  else riskLevel = 'low';

  // Generate recommendations
  if (fraudScore >= 50) {
    recommendations.push('Require additional verification');
    recommendations.push('Contact customer for confirmation');
  }
  if (fraudScore >= 70) {
    recommendations.push('Block transaction pending manual review');
    recommendations.push('Flag account for monitoring');
  }

  const result: FraudScore = {
    overall_score: fraudScore,
    risk_level: riskLevel,
    risk_factors: riskFactors,
    recommendations: recommendations,
    requires_manual_review: fraudScore >= 50
  };

  // Store fraud analysis
  await supabase.from('fraud_detection_results').insert({
    transaction_id: request.transaction_id,
    user_id: request.user_id,
    fraud_score: fraudScore,
    risk_level: riskLevel,
    risk_factors: riskFactors,
    analysis_data: request,
    requires_review: fraudScore >= 50
  });

  console.log('Fraud analysis completed:', result);
  
  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getFraudPatterns(): Promise<Response> {
  console.log('Fetching fraud patterns');
  
  const { data: patterns } = await supabase
    .from('ai_fraud_rules')
    .select('*')
    .eq('is_active', true)
    .order('accuracy_score', { ascending: false });

  const { data: recentDetections } = await supabase
    .from('fraud_detection_results')
    .select('*')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(100);

  // Analyze patterns
  const patternAnalysis = {
    total_rules: patterns?.length || 0,
    recent_detections: recentDetections?.length || 0,
    high_risk_transactions: recentDetections?.filter(d => d.risk_level === 'high' || d.risk_level === 'critical').length || 0,
    most_common_factors: analyzeMostCommonFactors(recentDetections || []),
    fraud_trends: analyzeFraudTrends(recentDetections || [])
  };

  return new Response(JSON.stringify(patternAnalysis), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function updateFraudRules(payload: any): Promise<Response> {
  console.log('Updating fraud rules');
  
  const { rule_name, rule_type, threshold_config, is_active } = payload;
  
  const { data, error } = await supabase
    .from('ai_fraud_rules')
    .upsert({
      rule_name,
      rule_type,
      threshold_config,
      is_active,
      last_trained: new Date().toISOString()
    })
    .select();

  if (error) throw error;

  return new Response(JSON.stringify({ success: true, data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getFraudAnalytics(): Promise<Response> {
  console.log('Fetching fraud analytics');
  
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const { data: weeklyStats } = await supabase
    .from('fraud_detection_results')
    .select('*')
    .gte('created_at', lastWeek.toISOString());

  const { data: monthlyStats } = await supabase
    .from('fraud_detection_results')
    .select('*')
    .gte('created_at', lastMonth.toISOString());

  const analytics = {
    weekly_detections: weeklyStats?.length || 0,
    monthly_detections: monthlyStats?.length || 0,
    avg_fraud_score: calculateAverageScore(weeklyStats || []),
    prevention_rate: calculatePreventionRate(weeklyStats || []),
    false_positive_rate: calculateFalsePositiveRate(weeklyStats || []),
    top_risk_factors: getTopRiskFactors(weeklyStats || []),
    daily_trends: getDailyTrends(weeklyStats || [])
  };

  return new Response(JSON.stringify(analytics), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function analyzeMostCommonFactors(detections: any[]): any {
  const factorCounts: { [key: string]: number } = {};
  
  detections.forEach(detection => {
    if (detection.risk_factors) {
      detection.risk_factors.forEach((factor: string) => {
        factorCounts[factor] = (factorCounts[factor] || 0) + 1;
      });
    }
  });

  return Object.entries(factorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([factor, count]) => ({ factor, count }));
}

function analyzeFraudTrends(detections: any[]): any {
  const dailyTrends: { [key: string]: number } = {};
  
  detections.forEach(detection => {
    const date = new Date(detection.created_at).toISOString().split('T')[0];
    dailyTrends[date] = (dailyTrends[date] || 0) + 1;
  });

  return Object.entries(dailyTrends).map(([date, count]) => ({ date, count }));
}

function calculateAverageScore(detections: any[]): number {
  if (detections.length === 0) return 0;
  const total = detections.reduce((sum, d) => sum + (d.fraud_score || 0), 0);
  return Math.round(total / detections.length);
}

function calculatePreventionRate(detections: any[]): number {
  const prevented = detections.filter(d => d.requires_review && d.risk_level !== 'low').length;
  return detections.length > 0 ? Math.round((prevented / detections.length) * 100) : 0;
}

function calculateFalsePositiveRate(detections: any[]): number {
  // This would need actual feedback data in a real implementation
  return Math.round(Math.random() * 10); // Placeholder
}

function getTopRiskFactors(detections: any[]): any[] {
  const factors: { [key: string]: number } = {};
  
  detections.forEach(detection => {
    if (detection.risk_factors) {
      detection.risk_factors.forEach((factor: string) => {
        factors[factor] = (factors[factor] || 0) + 1;
      });
    }
  });

  return Object.entries(factors)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([factor, count]) => ({ factor, count }));
}

function getDailyTrends(detections: any[]): any[] {
  const trends: { [key: string]: number } = {};
  
  detections.forEach(detection => {
    const date = new Date(detection.created_at).toISOString().split('T')[0];
    trends[date] = (trends[date] || 0) + 1;
  });

  return Object.entries(trends)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}