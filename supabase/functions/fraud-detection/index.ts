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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    switch (action) {
      case 'analyze-transaction':
        return await analyzeTransaction(req, supabaseClient)
      case 'check-user-behavior':
        return await checkUserBehavior(req, supabaseClient)
      case 'validate-order':
        return await validateOrder(req, supabaseClient)
      case 'risk-assessment':
        return await performRiskAssessment(req, supabaseClient)
      case 'fraud-rules':
        return await manageFraudRules(req, supabaseClient)
      case 'alert-management':
        return await manageAlerts(req, supabaseClient)
      case 'fraud-analytics':
        return await getFraudAnalytics(req, supabaseClient)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Fraud detection error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function analyzeTransaction(req: Request, supabaseClient: any) {
  const { transaction_id, user_id, amount, payment_method, order_details } = await req.json()
  
  console.log('Analyzing transaction:', { transaction_id, user_id, amount, payment_method })
  
  const riskFactors = []
  let riskScore = 0
  
  // Rule 1: High amount transactions
  if (amount > 50000) {
    riskScore += 30
    riskFactors.push({ rule: 'high_amount', weight: 30, description: 'Transaction amount exceeds 50,000 BDT' })
  }
  
  // Rule 2: Multiple transactions in short time
  const { data: recentTransactions } = await supabaseClient
    .from('payments')
    .select('*')
    .eq('user_id', user_id)
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
  
  if (recentTransactions && recentTransactions.length > 5) {
    riskScore += 25
    riskFactors.push({ rule: 'velocity_check', weight: 25, description: 'Multiple transactions in last hour' })
  }
  
  // Rule 3: New user with high amount
  const { data: userProfile } = await supabaseClient
    .from('profiles')
    .select('created_at')
    .eq('id', user_id)
    .single()
  
  if (userProfile) {
    const accountAge = Date.now() - new Date(userProfile.created_at).getTime()
    const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24)
    
    if (daysSinceCreation < 7 && amount > 10000) {
      riskScore += 20
      riskFactors.push({ rule: 'new_user_high_amount', weight: 20, description: 'New user making high-value transaction' })
    }
  }
  
  // Rule 4: Unusual payment method patterns
  const { data: userPaymentHistory } = await supabaseClient
    .from('payments')
    .select('payment_method')
    .eq('user_id', user_id)
    .limit(10)
  
  const paymentMethods = userPaymentHistory?.map(p => p.payment_method) || []
  if (paymentMethods.length > 0 && !paymentMethods.includes(payment_method)) {
    riskScore += 15
    riskFactors.push({ rule: 'unusual_payment_method', weight: 15, description: 'Using new payment method' })
  }
  
  // Determine risk level
  let riskLevel = 'low'
  let action = 'allow'
  
  if (riskScore >= 50) {
    riskLevel = 'high'
    action = 'block'
  } else if (riskScore >= 30) {
    riskLevel = 'medium'
    action = 'review'
  }
  
  // Store fraud alert if risk is medium or high
  if (riskScore >= 30) {
    await supabaseClient
      .from('fraud_alerts')
      .insert({
        user_id,
        order_id: transaction_id,
        alert_type: 'transaction_risk',
        risk_score: riskScore,
        risk_factors: riskFactors,
        status: 'pending'
      })
  }
  
  return new Response(JSON.stringify({
    success: true,
    fraud_analysis: {
      transaction_id,
      risk_score: riskScore,
      risk_level: riskLevel,
      recommended_action: action,
      risk_factors: riskFactors,
      analyzed_at: new Date().toISOString()
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function checkUserBehavior(req: Request, supabaseClient: any) {
  const { user_id, session_data, behavior_patterns } = await req.json()
  
  const { data: userBehaviors } = await supabaseClient
    .from('user_behaviors')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(100)
  
  const behaviorScore = analyzeBehaviorPatterns(userBehaviors || [], behavior_patterns)
  
  return new Response(JSON.stringify({
    success: true,
    behavior_analysis: {
      user_id,
      behavior_score: behaviorScore.score,
      anomalies: behaviorScore.anomalies,
      recommendations: behaviorScore.recommendations
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function validateOrder(req: Request, supabaseClient: any) {
  const { order_id, order_data } = await req.json()
  
  const validationResults = {
    is_valid: true,
    issues: [],
    risk_score: 0
  }
  
  // Validate order items against inventory
  for (const item of order_data.items || []) {
    const { data: inventory } = await supabaseClient
      .from('inventory')
      .select('current_stock, price')
      .eq('product_id', item.product_id)
      .single()
    
    if (!inventory) {
      validationResults.issues.push(`Product ${item.product_id} not found in inventory`)
      validationResults.risk_score += 10
    } else if (inventory.current_stock < item.quantity) {
      validationResults.issues.push(`Insufficient stock for product ${item.product_id}`)
      validationResults.risk_score += 15
    }
  }
  
  if (validationResults.risk_score > 20) {
    validationResults.is_valid = false
  }
  
  return new Response(JSON.stringify({
    success: true,
    validation: validationResults
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function performRiskAssessment(req: Request, supabaseClient: any) {
  const { assessment_type, data } = await req.json()
  
  let assessment
  
  switch (assessment_type) {
    case 'vendor':
      assessment = await assessVendorRisk(supabaseClient, data)
      break
    case 'customer':
      assessment = await assessCustomerRisk(supabaseClient, data)
      break
    case 'transaction':
      assessment = await assessTransactionRisk(supabaseClient, data)
      break
    default:
      throw new Error('Invalid assessment type')
  }
  
  return new Response(JSON.stringify({
    success: true,
    risk_assessment: assessment
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function manageFraudRules(req: Request, supabaseClient: any) {
  const { action, rule_data } = await req.json()
  
  switch (action) {
    case 'create':
      return await createFraudRule(supabaseClient, rule_data)
    case 'update':
      return await updateFraudRule(supabaseClient, rule_data)
    case 'delete':
      return await deleteFraudRule(supabaseClient, rule_data.rule_id)
    case 'list':
      return await listFraudRules(supabaseClient)
    default:
      throw new Error('Invalid rule action')
  }
}

async function manageAlerts(req: Request, supabaseClient: any) {
  const { action, alert_data } = await req.json()
  
  switch (action) {
    case 'list':
      return await listFraudAlerts(supabaseClient, alert_data)
    case 'resolve':
      return await resolveFraudAlert(supabaseClient, alert_data)
    case 'escalate':
      return await escalateFraudAlert(supabaseClient, alert_data)
    default:
      throw new Error('Invalid alert action')
  }
}

async function getFraudAnalytics(req: Request, supabaseClient: any) {
  const { period = '30days', analytics_type = 'summary' } = await req.json()
  
  const { data: fraudAlerts } = await supabaseClient
    .from('fraud_alerts')
    .select('*')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
  
  const analytics = {
    total_alerts: fraudAlerts?.length || 0,
    high_risk_alerts: fraudAlerts?.filter(a => a.risk_score >= 50).length || 0,
    resolved_alerts: fraudAlerts?.filter(a => a.status === 'resolved').length || 0,
    false_positives: fraudAlerts?.filter(a => a.status === 'false_positive').length || 0,
    detection_rate: calculateDetectionRate(fraudAlerts || []),
    top_risk_factors: getTopRiskFactors(fraudAlerts || [])
  }
  
  return new Response(JSON.stringify({
    success: true,
    fraud_analytics: analytics,
    period
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

// Helper functions
function analyzeBehaviorPatterns(behaviors: any[], patterns: any) {
  let score = 0
  const anomalies = []
  
  // Analyze login patterns
  const loginTimes = behaviors.filter(b => b.behavior_type === 'login').map(b => new Date(b.created_at).getHours())
  if (loginTimes.length > 0) {
    const avgLoginHour = loginTimes.reduce((sum, hour) => sum + hour, 0) / loginTimes.length
    const lastLoginHour = loginTimes[0]
    
    if (Math.abs(lastLoginHour - avgLoginHour) > 6) {
      score += 15
      anomalies.push('Unusual login time detected')
    }
  }
  
  return {
    score,
    anomalies,
    recommendations: score > 30 ? ['Monitor user activity', 'Additional verification'] : []
  }
}

async function assessVendorRisk(supabaseClient: any, vendorData: any) {
  // Mock vendor risk assessment
  return {
    vendor_id: vendorData.vendor_id,
    risk_level: 'low',
    risk_score: 15,
    factors: ['Good payment history', 'Verified documents']
  }
}

async function assessCustomerRisk(supabaseClient: any, customerData: any) {
  // Mock customer risk assessment
  return {
    customer_id: customerData.customer_id,
    risk_level: 'medium',
    risk_score: 35,
    factors: ['New account', 'High-value orders']
  }
}

async function assessTransactionRisk(supabaseClient: any, transactionData: any) {
  // Mock transaction risk assessment
  return {
    transaction_id: transactionData.transaction_id,
    risk_level: 'low',
    risk_score: 20,
    factors: ['Normal amount', 'Verified payment method']
  }
}

async function createFraudRule(supabaseClient: any, ruleData: any) {
  const { data: rule, error } = await supabaseClient
    .from('fraud_detection_rules')
    .insert(ruleData)
    .select()
    .single()
  
  if (error) throw new Error(`Failed to create rule: ${error.message}`)
  
  return new Response(JSON.stringify({
    success: true,
    rule_id: rule.id
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function updateFraudRule(supabaseClient: any, ruleData: any) {
  const { data: rule, error } = await supabaseClient
    .from('fraud_detection_rules')
    .update(ruleData)
    .eq('id', ruleData.rule_id)
    .select()
    .single()
  
  if (error) throw new Error(`Failed to update rule: ${error.message}`)
  
  return new Response(JSON.stringify({
    success: true,
    updated: true
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function deleteFraudRule(supabaseClient: any, ruleId: string) {
  const { error } = await supabaseClient
    .from('fraud_detection_rules')
    .delete()
    .eq('id', ruleId)
  
  if (error) throw new Error(`Failed to delete rule: ${error.message}`)
  
  return new Response(JSON.stringify({
    success: true,
    deleted: true
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function listFraudRules(supabaseClient: any) {
  const { data: rules, error } = await supabaseClient
    .from('fraud_detection_rules')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(`Failed to list rules: ${error.message}`)
  
  return new Response(JSON.stringify({
    success: true,
    rules: rules || []
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function listFraudAlerts(supabaseClient: any, filters: any) {
  let query = supabaseClient
    .from('fraud_alerts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.risk_level) query = query.gte('risk_score', filters.risk_level === 'high' ? 50 : 30)
  
  const { data: alerts, error } = await query
  
  if (error) throw new Error(`Failed to list alerts: ${error.message}`)
  
  return new Response(JSON.stringify({
    success: true,
    alerts: alerts || []
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function resolveFraudAlert(supabaseClient: any, alertData: any) {
  const { error } = await supabaseClient
    .from('fraud_alerts')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      resolved_by: alertData.resolved_by,
      investigation_notes: alertData.notes
    })
    .eq('id', alertData.alert_id)
  
  if (error) throw new Error(`Failed to resolve alert: ${error.message}`)
  
  return new Response(JSON.stringify({
    success: true,
    resolved: true
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function escalateFraudAlert(supabaseClient: any, alertData: any) {
  const { error } = await supabaseClient
    .from('fraud_alerts')
    .update({
      status: 'escalated',
      investigation_notes: alertData.escalation_reason
    })
    .eq('id', alertData.alert_id)
  
  if (error) throw new Error(`Failed to escalate alert: ${error.message}`)
  
  return new Response(JSON.stringify({
    success: true,
    escalated: true
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

function calculateDetectionRate(alerts: any[]) {
  const total = alerts.length
  const detected = alerts.filter(a => a.status !== 'false_positive').length
  return total > 0 ? (detected / total) * 100 : 0
}

function getTopRiskFactors(alerts: any[]) {
  const factors: any = {}
  
  alerts.forEach(alert => {
    if (alert.risk_factors) {
      alert.risk_factors.forEach((factor: any) => {
        if (factors[factor.rule]) {
          factors[factor.rule]++
        } else {
          factors[factor.rule] = 1
        }
      })
    }
  })
  
  return Object.entries(factors)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([rule, count]) => ({ rule, count }))
}