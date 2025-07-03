import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://deno.land/x/supabase@1.0.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FraudDetectionRequest {
  user_id?: string
  transaction_data: any
  behavioral_data?: any
  device_context?: any
  session_context?: any
}

interface BangladeshSpecificChecks {
  mobile_money_verification: boolean
  nid_verification_status: string
  bank_account_verified: boolean
  phone_number_verified: boolean
  location_bangladesh: boolean
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, ...requestData } = await req.json()

    switch (action) {
      case 'detect_fraud':
        return await detectFraud(supabase, requestData)
      case 'analyze_behavioral_patterns':
        return await analyzeBehavioralPatterns(supabase, requestData)
      case 'update_fraud_models':
        return await updateFraudModels(supabase, requestData)
      case 'bangladesh_specific_checks':
        return await bangladeshSpecificChecks(supabase, requestData)
      case 'investigate_fraud_event':
        return await investigateFraudEvent(supabase, requestData)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Advanced Fraud Detection Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function detectFraud(supabase: any, data: FraudDetectionRequest) {
  const { user_id, transaction_data, behavioral_data, device_context, session_context } = data

  // Use database function for initial fraud pattern detection
  const { data: fraudAnalysis, error: fraudError } = await supabase.rpc('detect_fraud_patterns', {
    p_user_id: user_id,
    p_transaction_data: transaction_data
  })

  if (fraudError) throw fraudError

  // Enhanced ML-based analysis
  const mlAnalysis = await runMLFraudDetection(supabase, {
    user_id,
    transaction_data,
    behavioral_data,
    device_context,
    session_context
  })

  // Bangladesh-specific fraud checks
  const bangladeshChecks = await performBangladeshFraudChecks(supabase, transaction_data, user_id)

  // Combine all analysis results
  const combinedScore = Math.max(
    fraudAnalysis.fraud_score,
    mlAnalysis.ml_fraud_score,
    bangladeshChecks.bd_fraud_score
  )

  const riskLevel = combinedScore >= 70 ? 'high' : 
                   combinedScore >= 40 ? 'medium' : 'low'

  // Log fraud detection event
  const eventId = `fraud_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  await supabase.from('fraud_detection_events').insert({
    event_id: eventId,
    user_id,
    event_type: 'transaction_analysis',
    fraud_score: combinedScore,
    risk_level: riskLevel,
    detection_model: 'ml_enhanced_v2',
    triggered_rules: [
      ...fraudAnalysis.risk_factors,
      ...mlAnalysis.triggered_features,
      ...bangladeshChecks.triggered_checks
    ],
    event_data: transaction_data,
    behavioral_anomalies: mlAnalysis.behavioral_anomalies,
    bangladesh_specific_flags: bangladeshChecks.specific_flags,
    investigation_status: combinedScore >= 50 ? 'requires_review' : 'auto_approved'
  })

  // Real-time risk mitigation
  const mitigationActions = await determineMitigationActions(combinedScore, riskLevel, {
    fraudAnalysis,
    mlAnalysis,
    bangladeshChecks
  })

  return new Response(
    JSON.stringify({
      success: true,
      event_id: eventId,
      fraud_score: combinedScore,
      risk_level: riskLevel,
      requires_manual_review: fraudAnalysis.requires_manual_review || combinedScore >= 50,
      mitigation_actions: mitigationActions,
      detailed_analysis: {
        rule_based: fraudAnalysis,
        ml_based: mlAnalysis,
        bangladesh_specific: bangladeshChecks
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function runMLFraudDetection(supabase: any, data: any) {
  const { user_id, transaction_data, behavioral_data, device_context } = data

  // Get active fraud detection models
  const { data: models, error: modelsError } = await supabase
    .from('fraud_detection_models')
    .select('*')
    .eq('is_active', true)
    .order('accuracy_score', { ascending: false })

  if (modelsError) throw modelsError

  let mlFraudScore = 0
  const triggeredFeatures = []
  const behavioralAnomalies = []

  // Get user's behavioral profile for comparison
  const { data: profile } = await supabase
    .from('user_behavioral_profiles')
    .select('*')
    .eq('user_id', user_id)
    .single()

  for (const model of models) {
    const modelResult = await applyFraudModel(model, {
      transaction_data,
      behavioral_data,
      device_context,
      user_profile: profile
    })
    
    mlFraudScore = Math.max(mlFraudScore, modelResult.score)
    triggeredFeatures.push(...modelResult.triggered_features)
    behavioralAnomalies.push(...modelResult.anomalies)
  }

  return {
    ml_fraud_score: mlFraudScore,
    triggered_features: triggeredFeatures,
    behavioral_anomalies: behavioralAnomalies
  }
}

async function applyFraudModel(model: any, data: any) {
  const { algorithm_config, feature_weights, bangladesh_specific_rules } = model
  let score = 0
  const triggeredFeatures = []
  const anomalies = []

  // Transaction amount anomaly detection
  if (data.user_profile && data.transaction_data.amount) {
    const avgAmount = data.user_profile.transaction_patterns?.avg_amount || 1000
    const amountRatio = data.transaction_data.amount / avgAmount
    
    if (amountRatio > 5) {
      score += 25
      triggeredFeatures.push('unusual_amount')
    }
  }

  // Velocity checks
  if (data.transaction_data.time_since_last_transaction < 60) { // Less than 1 minute
    score += 20
    triggeredFeatures.push('high_velocity')
  }

  // Device context analysis
  if (data.device_context && data.user_profile) {
    const knownDevices = data.user_profile.device_patterns?.known_devices || []
    if (!knownDevices.includes(data.device_context.fingerprint)) {
      score += 15
      triggeredFeatures.push('unknown_device')
    }
  }

  // Bangladesh-specific rules
  if (bangladesh_specific_rules) {
    // Mobile money fraud patterns
    if (data.transaction_data.payment_method === 'mobile_money') {
      if (!data.transaction_data.beneficiary_verified) {
        score += 30
        triggeredFeatures.push('unverified_mobile_money_recipient')
      }
    }

    // Cross-border transaction monitoring
    if (data.transaction_data.recipient_country !== 'Bangladesh') {
      score += 20
      triggeredFeatures.push('international_transfer')
    }
  }

  // Time-based patterns (Bangladesh timezone)
  const currentHour = new Date().toLocaleString("en-US", {timeZone: "Asia/Dhaka"})
  const hour = new Date(currentHour).getHours()
  
  if (hour >= 2 && hour <= 5) { // Very late night transactions
    score += 15
    triggeredFeatures.push('unusual_time')
  }

  return {
    score: Math.min(100, score),
    triggered_features: triggeredFeatures,
    anomalies: anomalies
  }
}

async function performBangladeshFraudChecks(supabase: any, transactionData: any, userId?: string) {
  let bdFraudScore = 0
  const triggeredChecks = []
  const specificFlags = []

  // Mobile money fraud detection
  if (transactionData.payment_method === 'bkash' || 
      transactionData.payment_method === 'nagad' || 
      transactionData.payment_method === 'rocket') {
    
    // Check for suspicious mobile money patterns
    if (transactionData.amount > 50000) { // Above typical mobile money limits
      bdFraudScore += 25
      triggeredChecks.push('high_amount_mobile_money')
    }

    // Check recipient verification
    if (!transactionData.recipient_mobile_verified) {
      bdFraudScore += 20
      triggeredChecks.push('unverified_mobile_recipient')
    }

    specificFlags.push('mobile_money_transaction')
  }

  // NID verification status check
  if (userId) {
    const { data: kycData } = await supabase
      .from('bd_kyc_verifications')
      .select('verification_status')
      .eq('vendor_id', userId)
      .eq('verification_type', 'nid')
      .single()

    if (!kycData || kycData.verification_status !== 'verified') {
      bdFraudScore += 15
      triggeredChecks.push('unverified_nid')
      specificFlags.push('kyc_incomplete')
    }
  }

  // Location-based checks
  if (transactionData.location) {
    // Check if transaction originates from Bangladesh
    if (transactionData.location.country !== 'Bangladesh') {
      bdFraudScore += 30
      triggeredChecks.push('non_bangladesh_origin')
      specificFlags.push('cross_border_concern')
    }

    // Check for high-risk districts
    const highRiskDistricts = ['Cox\'s Bazar', 'Teknaf', 'Ukhiya'] // Example risk areas
    if (highRiskDistricts.includes(transactionData.location.district)) {
      bdFraudScore += 10
      triggeredChecks.push('high_risk_location')
    }
  }

  // Currency and amount patterns specific to Bangladesh
  if (transactionData.currency === 'BDT') {
    // Check for round number patterns (common in fraud)
    if (transactionData.amount % 1000 === 0 && transactionData.amount > 10000) {
      bdFraudScore += 5
      triggeredChecks.push('round_amount_pattern')
    }
  }

  return {
    bd_fraud_score: bdFraudScore,
    triggered_checks: triggeredChecks,
    specific_flags: specificFlags
  }
}

async function analyzeBehavioralPatterns(supabase: any, data: any) {
  const { user_id, recent_activities } = data

  // Get existing behavioral profile
  const { data: profile } = await supabase
    .from('user_behavioral_profiles')
    .select('*')
    .eq('user_id', user_id)
    .single()

  if (!profile) {
    // Create initial profile
    const newProfile = {
      user_id,
      behavior_patterns: analyzeInitialBehavior(recent_activities),
      profile_confidence: 0.1
    }

    await supabase.from('user_behavioral_profiles').insert(newProfile)
    
    return new Response(
      JSON.stringify({ success: true, message: 'Initial profile created' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Analyze pattern deviations
  const deviations = detectBehavioralDeviations(profile, recent_activities)
  
  // Update profile with new data
  const updatedProfile = updateBehavioralProfile(profile, recent_activities, deviations)
  
  await supabase
    .from('user_behavioral_profiles')
    .update(updatedProfile)
    .eq('user_id', user_id)

  return new Response(
    JSON.stringify({
      success: true,
      behavioral_analysis: {
        deviations_detected: deviations.length > 0,
        deviation_score: deviations.reduce((sum, d) => sum + d.severity, 0),
        deviations: deviations
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateFraudModels(supabase: any, data: any) {
  const { model_updates, performance_feedback } = data

  // Update model performance metrics
  for (const update of model_updates) {
    await supabase
      .from('fraud_detection_models')
      .update({
        performance_metrics: update.metrics,
        accuracy_score: update.accuracy,
        false_positive_rate: update.false_positive_rate,
        false_negative_rate: update.false_negative_rate,
        last_trained: new Date().toISOString()
      })
      .eq('model_name', update.model_name)
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Models updated successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function bangladeshSpecificChecks(supabase: any, data: BangladeshSpecificChecks) {
  // Implement comprehensive Bangladesh-specific fraud checks
  const checks = {
    mobile_money_verified: data.mobile_money_verification,
    nid_status: data.nid_verification_status,
    banking_verified: data.bank_account_verified,
    phone_verified: data.phone_number_verified,
    location_verified: data.location_bangladesh
  }

  let complianceScore = 0
  const complianceIssues = []

  Object.entries(checks).forEach(([key, value]) => {
    if (value) complianceScore += 20
    else complianceIssues.push(key)
  })

  return new Response(
    JSON.stringify({
      compliance_score: complianceScore,
      compliance_issues: complianceIssues,
      recommendations: generateComplianceRecommendations(complianceIssues)
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function investigateFraudEvent(supabase: any, data: any) {
  const { event_id, investigator_id, investigation_notes, resolution } = data

  await supabase
    .from('fraud_detection_events')
    .update({
      investigation_status: 'investigated',
      investigated_by: investigator_id,
      investigated_at: new Date().toISOString(),
      resolution_notes: investigation_notes,
      false_positive: resolution === 'false_positive'
    })
    .eq('event_id', event_id)

  return new Response(
    JSON.stringify({ success: true, message: 'Investigation completed' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

function analyzeInitialBehavior(activities: any[]) {
  // Analyze initial user behavior patterns
  return {
    typical_transaction_amount: calculateAverage(activities.map(a => a.amount || 0)),
    common_times: activities.map(a => new Date(a.timestamp).getHours()),
    preferred_payment_methods: [...new Set(activities.map(a => a.payment_method))],
    typical_locations: [...new Set(activities.map(a => a.location))]
  }
}

function detectBehavioralDeviations(profile: any, recentActivities: any[]) {
  const deviations = []
  
  // Check for amount deviations
  const recentAmounts = recentActivities.map(a => a.amount || 0)
  const avgRecent = calculateAverage(recentAmounts)
  const historicalAvg = profile.transaction_patterns?.avg_amount || 1000
  
  if (avgRecent > historicalAvg * 3) {
    deviations.push({
      type: 'amount_deviation',
      severity: 25,
      description: 'Significantly higher transaction amounts'
    })
  }
  
  return deviations
}

function updateBehavioralProfile(profile: any, newActivities: any[], deviations: any[]) {
  return {
    ...profile,
    last_pattern_update: new Date().toISOString(),
    profile_version: profile.profile_version + 1,
    risk_indicators: [...(profile.risk_indicators || []), ...deviations.map(d => d.type)]
  }
}

async function determineMitigationActions(score: number, riskLevel: string, analysis: any) {
  const actions = []
  
  if (score >= 70) {
    actions.push('block_transaction', 'require_manual_review', 'notify_security_team')
  } else if (score >= 40) {
    actions.push('require_additional_verification', 'flag_for_monitoring')
  } else if (score >= 20) {
    actions.push('increase_monitoring_frequency')
  }
  
  return actions
}

function calculateAverage(numbers: number[]): number {
  return numbers.length > 0 ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0
}

function generateComplianceRecommendations(issues: string[]): string[] {
  const recommendations = []
  
  if (issues.includes('nid_verification_status')) {
    recommendations.push('Complete NID verification process')
  }
  if (issues.includes('mobile_money_verification')) {
    recommendations.push('Verify mobile money account')
  }
  if (issues.includes('bank_account_verified')) {
    recommendations.push('Link and verify bank account')
  }
  
  return recommendations
}