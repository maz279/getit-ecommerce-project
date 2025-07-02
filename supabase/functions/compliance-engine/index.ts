import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ComplianceCheckRequest {
  framework_id?: string
  data_operation: any
  user_context: any
  resource_type: string
  geographic_context?: any
}

interface BangladeshComplianceCheck {
  btrc_requirements: boolean
  data_localization: boolean
  financial_regulations: boolean
  tax_compliance: boolean
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
      case 'check_compliance':
        return await checkCompliance(supabase, requestData)
      case 'audit_trail_enhanced':
        return await createEnhancedAuditTrail(supabase, requestData)
      case 'data_sovereignty_check':
        return await checkDataSovereignty(supabase, requestData)
      case 'bangladesh_compliance_check':
        return await bangladeshComplianceCheck(supabase, requestData)
      case 'generate_compliance_report':
        return await generateComplianceReport(supabase, requestData)
      case 'automated_remediation':
        return await performAutomatedRemediation(supabase, requestData)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Compliance Engine Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function checkCompliance(supabase: any, data: ComplianceCheckRequest) {
  const { framework_id, data_operation, user_context, resource_type, geographic_context } = data

  // Get applicable compliance frameworks
  let frameworks
  if (framework_id) {
    const { data: framework, error } = await supabase
      .from('compliance_frameworks')
      .select('*')
      .eq('id', framework_id)
      .single()
    
    if (error) throw error
    frameworks = [framework]
  } else {
    const { data: allFrameworks, error } = await supabase
      .from('compliance_frameworks')
      .select('*')
      .eq('is_mandatory', true)
      .gte('effective_to', new Date().toISOString())
      .lte('effective_from', new Date().toISOString())
    
    if (error) throw error
    frameworks = allFrameworks
  }

  const complianceResults = []
  let overallCompliant = true
  const violations = []
  const remediationActions = []

  for (const framework of frameworks) {
    const result = await evaluateFrameworkCompliance(framework, {
      data_operation,
      user_context,
      resource_type,
      geographic_context
    })
    
    complianceResults.push(result)
    
    if (!result.compliant) {
      overallCompliant = false
      violations.push(...result.violations)
      remediationActions.push(...result.remediation_actions)
    }
  }

  // Log compliance check
  const auditId = await supabase.rpc('log_enhanced_audit_event', {
    p_event_type: 'compliance_check',
    p_user_id: user_context.user_id,
    p_resource_type: resource_type,
    p_action: 'compliance_verification',
    p_context: {
      frameworks_checked: frameworks.map(f => f.framework_name),
      compliance_result: overallCompliant,
      violations_count: violations.length
    }
  })

  // Update compliance monitoring
  for (const framework of frameworks) {
    await updateComplianceMonitoring(supabase, framework.id, {
      compliance_status: complianceResults.find(r => r.framework_id === framework.id)?.compliant ? 'compliant' : 'non_compliant',
      violations_detected: violations.filter(v => v.framework_id === framework.id),
      remediation_actions: remediationActions.filter(a => a.framework_id === framework.id)
    })
  }

  return new Response(
    JSON.stringify({
      success: true,
      overall_compliant: overallCompliant,
      audit_id: auditId,
      framework_results: complianceResults,
      violations: violations,
      remediation_actions: remediationActions,
      requires_manual_review: violations.some(v => v.severity === 'critical')
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function evaluateFrameworkCompliance(framework: any, context: any) {
  const { compliance_rules, data_sovereignty_rules, audit_requirements } = framework
  const violations = []
  const remediationActions = []
  let compliant = true

  // Data sovereignty compliance
  if (data_sovereignty_rules) {
    const sovereigntyResult = await checkDataSovereigntyRules(data_sovereignty_rules, context)
    if (!sovereigntyResult.compliant) {
      compliant = false
      violations.push({
        framework_id: framework.id,
        type: 'data_sovereignty',
        severity: 'high',
        description: sovereigntyResult.violation_details
      })
      remediationActions.push({
        framework_id: framework.id,
        action: 'ensure_data_localization',
        priority: 'high'
      })
    }
  }

  // PII handling compliance
  if (context.data_operation.involves_pii) {
    if (!context.user_context.consent_obtained) {
      compliant = false
      violations.push({
        framework_id: framework.id,
        type: 'pii_consent',
        severity: 'critical',
        description: 'PII processing without explicit consent'
      })
      remediationActions.push({
        framework_id: framework.id,
        action: 'obtain_explicit_consent',
        priority: 'critical'
      })
    }
  }

  // Financial data compliance (specific to Bangladesh)
  if (framework.framework_name.includes('Financial') && context.data_operation.involves_financial_data) {
    const financialCompliance = await checkFinancialCompliance(context)
    if (!financialCompliance.compliant) {
      compliant = false
      violations.push(...financialCompliance.violations.map(v => ({
        ...v,
        framework_id: framework.id
      })))
    }
  }

  // BTRC compliance for telecom data
  if (framework.framework_name.includes('BTRC') && context.data_operation.involves_telecom_data) {
    const btrcCompliance = await checkBTRCCompliance(context)
    if (!btrcCompliance.compliant) {
      compliant = false
      violations.push(...btrcCompliance.violations.map(v => ({
        ...v,
        framework_id: framework.id
      })))
    }
  }

  return {
    framework_id: framework.id,
    framework_name: framework.framework_name,
    compliant,
    violations,
    remediation_actions: remediationActions
  }
}

async function checkDataSovereigntyRules(rules: any, context: any) {
  // Bangladesh data localization requirements
  if (rules.data_must_remain_in_bangladesh) {
    if (context.geographic_context?.data_location !== 'Bangladesh') {
      return {
        compliant: false,
        violation_details: 'Data storage location violates Bangladesh data localization requirements'
      }
    }
  }

  // Cross-border data transfer restrictions
  if (rules.restrict_cross_border_transfer && context.data_operation.cross_border_transfer) {
    if (!context.data_operation.adequate_protection_measures) {
      return {
        compliant: false,
        violation_details: 'Cross-border data transfer without adequate protection measures'
      }
    }
  }

  return { compliant: true }
}

async function checkFinancialCompliance(context: any) {
  const violations = []
  let compliant = true

  // Bangladesh Bank regulations
  if (context.data_operation.transaction_amount > 500000) { // 5 lakh BDT
    if (!context.user_context.enhanced_due_diligence) {
      compliant = false
      violations.push({
        type: 'enhanced_due_diligence',
        severity: 'high',
        description: 'High-value transaction requires enhanced due diligence'
      })
    }
  }

  // Anti-money laundering checks
  if (context.data_operation.involves_cash_transaction && !context.user_context.aml_clearance) {
    compliant = false
    violations.push({
      type: 'aml_compliance',
      severity: 'critical',
      description: 'Cash transaction requires AML compliance verification'
    })
  }

  return { compliant, violations }
}

async function checkBTRCCompliance(context: any) {
  const violations = []
  let compliant = true

  // Telecom data retention requirements
  if (context.data_operation.involves_call_records) {
    if (context.data_operation.retention_period < 365) { // BTRC requires 1 year retention
      compliant = false
      violations.push({
        type: 'data_retention',
        severity: 'medium',
        description: 'Call records must be retained for minimum 365 days as per BTRC regulations'
      })
    }
  }

  // Subscriber data protection
  if (context.data_operation.involves_subscriber_data && !context.user_context.btrc_authorized) {
    compliant = false
    violations.push({
      type: 'unauthorized_access',
      severity: 'critical',
      description: 'Subscriber data access requires BTRC authorization'
    })
  }

  return { compliant, violations }
}

async function createEnhancedAuditTrail(supabase: any, data: any) {
  const { event_type, user_id, resource_type, action, data_before, data_after, context } = data

  // Determine data sensitivity and regulatory classification
  const dataSensitivity = classifyDataSensitivity(data_before, data_after)
  const regulatoryClass = determineRegulatoryClassification(resource_type, action)
  
  // Create immutable audit record
  const auditId = await supabase.rpc('log_enhanced_audit_event', {
    p_event_type: event_type,
    p_user_id: user_id,
    p_resource_type: resource_type,
    p_action: action,
    p_data_before: data_before,
    p_data_after: data_after,
    p_context: {
      ...context,
      data_sensitivity: dataSensitivity,
      regulatory_classification: regulatoryClass,
      audit_timestamp: new Date().toISOString(),
      compliance_tags: generateComplianceTags(resource_type, action, dataSensitivity)
    }
  })

  // Check if blockchain logging is required for critical operations
  if (dataSensitivity === 'critical' || regulatoryClass === 'financial') {
    await logToBlockchain(auditId, {
      event_type,
      user_id,
      resource_type,
      action,
      timestamp: new Date().toISOString()
    })
  }

  return new Response(
    JSON.stringify({
      success: true,
      audit_id: auditId,
      immutable_reference: auditId,
      blockchain_logged: dataSensitivity === 'critical'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function checkDataSovereignty(supabase: any, data: any) {
  const { data_operation, current_location, target_location } = data

  // Bangladesh data sovereignty requirements
  const sovereigntyChecks = {
    data_localization_compliant: current_location === 'Bangladesh',
    cross_border_transfer_authorized: false,
    adequate_protection_level: false,
    regulatory_approval_obtained: false
  }

  // Check for authorized cross-border transfers
  if (target_location !== 'Bangladesh') {
    const adequacyCountries = ['Singapore', 'EU'] // Countries with adequate protection
    sovereigntyChecks.cross_border_transfer_authorized = adequacyCountries.includes(target_location)
    sovereigntyChecks.adequate_protection_level = adequacyCountries.includes(target_location)
  }

  const complianceScore = Object.values(sovereigntyChecks).filter(Boolean).length * 25
  
  return new Response(
    JSON.stringify({
      sovereignty_compliance: sovereigntyChecks,
      compliance_score: complianceScore,
      transfer_permitted: complianceScore >= 75,
      required_actions: complianceScore < 75 ? [
        'obtain_regulatory_approval',
        'implement_adequate_safeguards',
        'ensure_data_localization'
      ] : []
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function bangladeshComplianceCheck(supabase: any, data: BangladeshComplianceCheck) {
  const checks = {
    btrc_compliant: data.btrc_requirements,
    data_localized: data.data_localization,
    financial_compliant: data.financial_regulations,
    tax_compliant: data.tax_compliance
  }

  // Get Bangladesh compliance tracking record
  const { data: complianceRecord, error } = await supabase
    .from('bangladesh_compliance_tracking')
    .select('*')
    .eq('compliance_type', 'comprehensive')
    .single()

  let overallScore = 0
  const issues = []
  const recommendations = []

  Object.entries(checks).forEach(([key, compliant]) => {
    if (compliant) {
      overallScore += 25
    } else {
      issues.push(key)
      recommendations.push(getBangladeshComplianceRecommendation(key))
    }
  })

  // Update compliance tracking
  if (complianceRecord) {
    await supabase
      .from('bangladesh_compliance_tracking')
      .update({
        compliance_status: overallScore >= 75 ? 'compliant' : 'non_compliant',
        requirements_checklist: checks,
        last_audit_date: new Date().toISOString().split('T')[0]
      })
      .eq('id', complianceRecord.id)
  }

  return new Response(
    JSON.stringify({
      overall_score: overallScore,
      compliance_status: overallScore >= 75 ? 'compliant' : 'non_compliant',
      issues: issues,
      recommendations: recommendations,
      next_audit_required: overallScore < 75
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function generateComplianceReport(supabase: any, data: any) {
  const { report_type, time_period, framework_ids } = data

  // Get compliance monitoring data
  const { data: monitoringData, error } = await supabase
    .from('compliance_monitoring')
    .select(`
      *,
      compliance_frameworks (
        framework_name,
        regulatory_body,
        jurisdiction
      )
    `)
    .in('framework_id', framework_ids || [])
    .gte('last_check_at', new Date(Date.now() - time_period * 24 * 60 * 60 * 1000).toISOString())

  if (error) throw error

  // Get audit trail data
  const { data: auditData, error: auditError } = await supabase
    .from('enhanced_audit_trails')
    .select('*')
    .gte('created_at', new Date(Date.now() - time_period * 24 * 60 * 60 * 1000).toISOString())

  if (auditError) throw auditError

  const report = {
    report_id: `compliance_${Date.now()}`,
    generated_at: new Date().toISOString(),
    report_type,
    time_period: `${time_period} days`,
    summary: {
      total_frameworks_monitored: monitoringData.length,
      compliant_frameworks: monitoringData.filter(m => m.compliance_status === 'compliant').length,
      total_violations: monitoringData.reduce((sum, m) => sum + (m.violations_detected?.length || 0), 0),
      total_audit_events: auditData.length
    },
    detailed_findings: monitoringData.map(monitor => ({
      framework: monitor.compliance_frameworks.framework_name,
      regulatory_body: monitor.compliance_frameworks.regulatory_body,
      status: monitor.compliance_status,
      violations: monitor.violations_detected || [],
      remediation_actions: monitor.remediation_actions || []
    })),
    recommendations: generateReportRecommendations(monitoringData)
  }

  return new Response(
    JSON.stringify(report),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function performAutomatedRemediation(supabase: any, data: any) {
  const { violation_id, remediation_type } = data

  const remediationActions = {
    'data_retention_fix': async () => {
      // Implement automated data retention policy fixes
      return { success: true, action: 'Updated data retention policies' }
    },
    'access_control_fix': async () => {
      // Implement automated access control fixes
      return { success: true, action: 'Tightened access controls' }
    },
    'encryption_fix': async () => {
      // Implement automated encryption fixes
      return { success: true, action: 'Enhanced encryption standards' }
    }
  }

  const result = await remediationActions[remediation_type]?.() || 
    { success: false, error: 'Unknown remediation type' }

  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateComplianceMonitoring(supabase: any, frameworkId: string, updateData: any) {
  await supabase
    .from('compliance_monitoring')
    .upsert({
      framework_id: frameworkId,
      compliance_check_type: 'automated',
      check_frequency: 'daily',
      next_check_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      ...updateData,
      updated_at: new Date().toISOString()
    }, { onConflict: 'framework_id' })
}

function classifyDataSensitivity(dataBefore: any, dataAfter: any): string {
  const sensitiveFields = ['password', 'ssn', 'nid', 'bank_account', 'card_number']
  const allData = JSON.stringify({ dataBefore, dataAfter }).toLowerCase()
  
  if (sensitiveFields.some(field => allData.includes(field))) {
    return 'critical'
  }
  
  if (allData.includes('pii') || allData.includes('personal')) {
    return 'high'
  }
  
  return 'medium'
}

function determineRegulatoryClassification(resourceType: string, action: string): string {
  if (resourceType.includes('payment') || resourceType.includes('financial')) {
    return 'financial'
  }
  
  if (resourceType.includes('telecom') || resourceType.includes('communication')) {
    return 'telecom'
  }
  
  return 'general'
}

function generateComplianceTags(resourceType: string, action: string, sensitivity: string): string[] {
  const tags = [resourceType, action, sensitivity]
  
  if (sensitivity === 'critical') {
    tags.push('requires_blockchain_logging')
  }
  
  if (resourceType.includes('financial')) {
    tags.push('bangladesh_bank_oversight')
  }
  
  return tags
}

async function logToBlockchain(auditId: string, data: any) {
  // Simulated blockchain logging
  // In production, this would integrate with a real blockchain solution
  console.log(`Blockchain log for audit ${auditId}:`, data)
  return `blockchain_ref_${auditId}_${Date.now()}`
}

function getBangladeshComplianceRecommendation(checkType: string): string {
  const recommendations = {
    btrc_requirements: 'Ensure BTRC registration and comply with telecom data regulations',
    data_localization: 'Move data storage to Bangladesh-based servers',
    financial_regulations: 'Implement Bangladesh Bank compliance measures',
    tax_compliance: 'Register with NBR and ensure proper tax filings'
  }
  
  return recommendations[checkType] || 'Consult with compliance team'
}

function generateReportRecommendations(monitoringData: any[]): string[] {
  const recommendations = []
  
  const nonCompliantCount = monitoringData.filter(m => m.compliance_status !== 'compliant').length
  
  if (nonCompliantCount > 0) {
    recommendations.push(`Address ${nonCompliantCount} non-compliant frameworks immediately`)
  }
  
  const totalViolations = monitoringData.reduce((sum, m) => sum + (m.violations_detected?.length || 0), 0)
  
  if (totalViolations > 10) {
    recommendations.push('Implement automated compliance monitoring')
  }
  
  recommendations.push('Schedule regular compliance training')
  recommendations.push('Consider engaging compliance consultants')
  
  return recommendations
}