import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { request_data, user_context, endpoint_info } = await req.json()

    // Simple anomaly detection logic
    let anomalyScore = 0
    let severityLevel = 'low'
    let threatClassification = null
    const behaviorIndicators: Record<string, any> = {}
    const mitigationActions: string[] = []

    // Check for unusual request patterns
    if (request_data) {
      // High request frequency from single IP
      if (request_data.requests_per_minute > 60) {
        anomalyScore += 30
        behaviorIndicators.high_frequency = request_data.requests_per_minute
        mitigationActions.push('rate_limit_enforcement')
      }

      // Unusual user agent patterns
      if (request_data.user_agent && (
        request_data.user_agent.includes('bot') || 
        request_data.user_agent.includes('crawler') ||
        request_data.user_agent.length < 10
      )) {
        anomalyScore += 20
        behaviorIndicators.suspicious_user_agent = request_data.user_agent
        mitigationActions.push('user_agent_verification')
      }

      // Geographic anomalies
      if (user_context?.country && user_context.country !== 'BD') {
        const suspiciousCountries = ['CN', 'RU', 'KP']
        if (suspiciousCountries.includes(user_context.country)) {
          anomalyScore += 40
          behaviorIndicators.geographic_anomaly = user_context.country
          mitigationActions.push('geographic_blocking')
        }
      }

      // Unusual request size
      if (request_data.payload_size > 10000000) { // 10MB
        anomalyScore += 25
        behaviorIndicators.large_payload = request_data.payload_size
        mitigationActions.push('payload_size_limiting')
      }

      // SQL injection patterns
      if (request_data.query_params && JSON.stringify(request_data.query_params).match(/(union|select|insert|delete|drop|exec)/i)) {
        anomalyScore += 60
        behaviorIndicators.sql_injection_attempt = true
        threatClassification = 'sql_injection'
        mitigationActions.push('request_blocking', 'security_alert')
      }

      // XSS patterns
      if (request_data.payload && request_data.payload.match(/<script|javascript:|on\w+=/i)) {
        anomalyScore += 50
        behaviorIndicators.xss_attempt = true
        threatClassification = 'cross_site_scripting'
        mitigationActions.push('request_sanitization', 'security_alert')
      }
    }

    // Determine severity level
    if (anomalyScore >= 70) {
      severityLevel = 'critical'
    } else if (anomalyScore >= 40) {
      severityLevel = 'high'
    } else if (anomalyScore >= 20) {
      severityLevel = 'medium'
    }

    // Only log if anomaly score is significant
    if (anomalyScore >= 20) {
      await supabase.from('anomaly_detection_events').insert({
        event_type: threatClassification || 'suspicious_activity',
        anomaly_score: anomalyScore,
        severity_level: severityLevel,
        affected_service: endpoint_info?.service_name,
        affected_endpoint: endpoint_info?.endpoint_path,
        request_pattern: request_data,
        behavior_indicators: behaviorIndicators,
        threat_classification: threatClassification,
        mitigation_actions: mitigationActions
      })

      console.log(`Anomaly Detected: Score ${anomalyScore}, Severity: ${severityLevel}, Threat: ${threatClassification || 'unknown'}`)
    }

    return new Response(
      JSON.stringify({
        anomaly_detected: anomalyScore >= 20,
        anomaly_score: anomalyScore,
        severity_level: severityLevel,
        threat_classification: threatClassification,
        behavior_indicators: behaviorIndicators,
        mitigation_actions: mitigationActions,
        recommended_action: anomalyScore >= 70 ? 'block' : anomalyScore >= 40 ? 'monitor' : 'allow'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AI Anomaly Detector Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})