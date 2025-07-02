import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TrustVerificationRequest {
  user_id: string
  session_id: string
  device_fingerprint: string
  ip_address: string
  location_data: any
  user_agent: string
  verification_methods: string[]
}

interface SecurityContext {
  device_known: boolean
  location_familiar: boolean
  location_country: string
  time_pattern_normal: boolean
  network_trusted: boolean
  behavioral_consistent: boolean
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
      case 'verify_trust':
        return await verifyTrust(supabase, requestData)
      case 'continuous_verification':
        return await performContinuousVerification(supabase, requestData)
      case 'update_behavioral_profile':
        return await updateBehavioralProfile(supabase, requestData)
      case 'check_zero_trust_policies':
        return await checkZeroTrustPolicies(supabase, requestData)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Zero Trust Security Engine Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function verifyTrust(supabase: any, data: TrustVerificationRequest) {
  const { user_id, session_id, device_fingerprint, ip_address, location_data, user_agent, verification_methods } = data

  // Analyze security context
  const securityContext = await analyzeSecurityContext(supabase, data)
  
  // Calculate trust score using database function
  const { data: trustScore, error: scoreError } = await supabase.rpc('calculate_trust_score', {
    p_user_id: user_id,
    p_session_id: session_id,
    p_context_data: securityContext
  })

  if (scoreError) throw scoreError

  // Determine verification level based on trust score
  let verificationLevel = 'basic'
  if (trustScore >= 80) verificationLevel = 'high'
  else if (trustScore >= 60) verificationLevel = 'medium'
  else if (trustScore >= 40) verificationLevel = 'low'
  else verificationLevel = 'critical'

  // Create or update zero trust session
  const sessionData = {
    user_id,
    session_id,
    trust_score: trustScore,
    verification_level: verificationLevel,
    device_fingerprint,
    ip_address,
    location_data,
    context_analysis: securityContext,
    risk_factors: securityContext.risk_factors || [],
    verification_methods,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  }

  const { data: session, error: sessionError } = await supabase
    .from('zero_trust_sessions')
    .upsert(sessionData, { onConflict: 'session_id' })
    .select()
    .single()

  if (sessionError) throw sessionError

  // Store security context analysis
  await supabase.from('security_context_analysis').insert({
    session_id,
    context_type: 'initial_verification',
    device_context: { fingerprint: device_fingerprint, user_agent },
    network_context: { ip_address, trusted: securityContext.network_trusted },
    behavioral_context: securityContext,
    geolocation_context: location_data,
    threat_indicators: securityContext.threat_indicators || [],
    confidence_score: trustScore,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  })

  return new Response(
    JSON.stringify({
      success: true,
      trust_score: trustScore,
      verification_level: verificationLevel,
      session_id,
      requires_additional_verification: trustScore < 60,
      recommended_actions: securityContext.recommended_actions || []
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function performContinuousVerification(supabase: any, data: any) {
  const { session_id, new_context } = data

  // Get existing session
  const { data: session, error: sessionError } = await supabase
    .from('zero_trust_sessions')
    .select('*')
    .eq('session_id', session_id)
    .eq('status', 'active')
    .single()

  if (sessionError || !session) {
    return new Response(
      JSON.stringify({ error: 'Session not found or expired' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Analyze new context for anomalies
  const contextAnalysis = await analyzeContextChanges(supabase, session, new_context)
  
  // Update trust score based on continuous monitoring
  let newTrustScore = session.trust_score
  if (contextAnalysis.anomaly_detected) {
    newTrustScore = Math.max(0, newTrustScore - 20)
  }

  // Update session with new analysis
  await supabase
    .from('zero_trust_sessions')
    .update({
      trust_score: newTrustScore,
      context_analysis: { ...session.context_analysis, ...contextAnalysis },
      continuous_checks: [...(session.continuous_checks || []), {
        timestamp: new Date().toISOString(),
        result: contextAnalysis
      }],
      last_verification: new Date().toISOString()
    })
    .eq('session_id', session_id)

  return new Response(
    JSON.stringify({
      success: true,
      trust_score: newTrustScore,
      anomaly_detected: contextAnalysis.anomaly_detected,
      requires_reauthentication: newTrustScore < 30
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateBehavioralProfile(supabase: any, data: any) {
  const { user_id, new_behavior_data } = data

  // Get existing profile or create new one
  const { data: existingProfile } = await supabase
    .from('user_behavioral_profiles')
    .select('*')
    .eq('user_id', user_id)
    .single()

  let profileData
  if (existingProfile) {
    // Update existing profile with new data
    profileData = {
      behavior_patterns: { ...existingProfile.behavior_patterns, ...new_behavior_data.behavior_patterns },
      transaction_patterns: { ...existingProfile.transaction_patterns, ...new_behavior_data.transaction_patterns },
      device_patterns: { ...existingProfile.device_patterns, ...new_behavior_data.device_patterns },
      location_patterns: { ...existingProfile.location_patterns, ...new_behavior_data.location_patterns },
      time_patterns: { ...existingProfile.time_patterns, ...new_behavior_data.time_patterns },
      last_pattern_update: new Date().toISOString(),
      profile_version: existingProfile.profile_version + 1
    }
  } else {
    // Create new profile
    profileData = {
      user_id,
      ...new_behavior_data,
      baseline_established_at: new Date().toISOString(),
      profile_confidence: 0.1 // Start with low confidence
    }
  }

  const { data: profile, error } = await supabase
    .from('user_behavioral_profiles')
    .upsert(profileData, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true, profile }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function checkZeroTrustPolicies(supabase: any, data: any) {
  const { user_id, resource_type, action, context } = data

  // Get active policies
  const { data: policies, error: policiesError } = await supabase
    .from('zero_trust_policies')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: false })

  if (policiesError) throw policiesError

  const policyResults = []
  let accessGranted = true
  let requiredActions = []

  for (const policy of policies) {
    const result = evaluatePolicy(policy, { user_id, resource_type, action, context })
    policyResults.push(result)
    
    if (!result.compliant) {
      accessGranted = false
      requiredActions.push(...result.required_actions)
    }
  }

  return new Response(
    JSON.stringify({
      access_granted: accessGranted,
      policy_results: policyResults,
      required_actions: requiredActions
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function analyzeSecurityContext(supabase: any, data: TrustVerificationRequest): Promise<SecurityContext> {
  const { user_id, device_fingerprint, ip_address, location_data } = data

  // Check device history
  const { data: deviceHistory } = await supabase
    .from('zero_trust_sessions')
    .select('device_fingerprint')
    .eq('user_id', user_id)
    .contains('device_fingerprint', device_fingerprint)
    .limit(1)

  // Check location patterns
  const { data: locationHistory } = await supabase
    .from('user_behavioral_profiles')
    .select('location_patterns')
    .eq('user_id', user_id)
    .single()

  // Analyze current time against user patterns
  const currentHour = new Date().getHours()
  const isNormalTime = currentHour >= 6 && currentHour <= 23

  return {
    device_known: deviceHistory && deviceHistory.length > 0,
    location_familiar: locationHistory && 
      locationHistory.location_patterns?.frequent_locations?.includes(location_data?.city),
    location_country: location_data?.country || 'unknown',
    time_pattern_normal: isNormalTime,
    network_trusted: await checkNetworkTrust(ip_address),
    behavioral_consistent: true // Will be enhanced with ML models
  }
}

async function analyzeContextChanges(supabase: any, session: any, newContext: any) {
  // Compare new context with existing session context
  const existingContext = session.context_analysis
  
  let anomalyScore = 0
  const anomalies = []

  // Check for significant location change
  if (newContext.location && existingContext.location_country !== newContext.location.country) {
    anomalyScore += 30
    anomalies.push('location_change')
  }

  // Check for device change
  if (newContext.device_fingerprint !== session.device_fingerprint) {
    anomalyScore += 40
    anomalies.push('device_change')
  }

  // Check for unusual activity patterns
  if (newContext.activity_unusual) {
    anomalyScore += 20
    anomalies.push('unusual_activity')
  }

  return {
    anomaly_detected: anomalyScore > 25,
    anomaly_score: anomalyScore,
    detected_anomalies: anomalies,
    timestamp: new Date().toISOString()
  }
}

async function checkNetworkTrust(ipAddress: string): Promise<boolean> {
  // Implement IP reputation checking
  // For now, return true for private networks and Bangladesh IPs
  const privateRanges = [
    /^10\./,
    /^172\.1[6-9]\./,
    /^172\.2[0-9]\./,
    /^172\.3[0-1]\./,
    /^192\.168\./
  ]
  
  return privateRanges.some(range => range.test(ipAddress))
}

function evaluatePolicy(policy: any, context: any): any {
  const { conditions, trust_requirements, verification_requirements } = policy
  
  let compliant = true
  const requiredActions = []
  
  // Evaluate trust score requirements
  if (trust_requirements.minimum_score && context.trust_score < trust_requirements.minimum_score) {
    compliant = false
    requiredActions.push('increase_trust_score')
  }
  
  // Evaluate verification requirements
  if (verification_requirements.includes('mfa') && !context.mfa_verified) {
    compliant = false
    requiredActions.push('mfa_verification')
  }
  
  return {
    policy_name: policy.policy_name,
    compliant,
    required_actions: requiredActions
  }
}