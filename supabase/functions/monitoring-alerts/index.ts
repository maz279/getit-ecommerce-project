import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AlertRule {
  id: string;
  rule_name: string;
  metric_type: string;
  threshold: number;
  comparison: 'gt' | 'lt' | 'eq';
  severity: 'low' | 'medium' | 'high' | 'critical';
  is_active: boolean;
}

interface MetricValue {
  service_name: string;
  metric_type: string;
  value: number;
  timestamp: string;
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
    const action = url.searchParams.get('action')

    console.log(`🚨 Monitoring Alerts Service - Action: ${action}`)

    switch (action) {
      case 'evaluate-alerts': {
        const alerts = await evaluateAlertRules(supabaseClient)
        return new Response(JSON.stringify({ alerts, count: alerts.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'create-alert-rule': {
        const alertRule = await req.json()
        const result = await createAlertRule(supabaseClient, alertRule)
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'get-active-alerts': {
        const activeAlerts = await getActiveAlerts(supabaseClient)
        return new Response(JSON.stringify(activeAlerts), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'acknowledge-alert': {
        const { alert_id } = await req.json()
        const result = await acknowledgeAlert(supabaseClient, alert_id)
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'get-alert-history': {
        const history = await getAlertHistory(supabaseClient)
        return new Response(JSON.stringify(history), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'test-notification': {
        const { alert_rule_id } = await req.json()
        const result = await testNotification(supabaseClient, alert_rule_id)
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('❌ Monitoring Alerts Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function evaluateAlertRules(supabaseClient: any) {
  console.log('🔍 Evaluating alert rules...')

  // Get all active alert rules
  const { data: alertRules, error: rulesError } = await supabaseClient
    .from('alert_rules')
    .select('*')
    .eq('is_active', true)

  if (rulesError) {
    console.error('Error fetching alert rules:', rulesError)
    throw rulesError
  }

  const triggeredAlerts = []

  for (const rule of alertRules || []) {
    const recentMetrics = await getRecentMetrics(supabaseClient, rule.metric_type)
    
    for (const metric of recentMetrics) {
      const isTriggered = evaluateCondition(metric.value, rule.threshold, rule.conditions?.comparison || 'gt')
      
      if (isTriggered) {
        const alert = await createAlertInstance(supabaseClient, rule, metric)
        triggeredAlerts.push(alert)
        
        // Send notification
        await sendAlertNotification(supabaseClient, alert)
      }
    }
  }

  return triggeredAlerts
}

async function getRecentMetrics(supabaseClient: any, metricType: string) {
  const { data, error } = await supabaseClient
    .from('performance_metrics')
    .select('*')
    .eq('metric_type', metricType)
    .gte('timestamp', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
    .order('timestamp', { ascending: false })

  if (error) throw error
  return data || []
}

function evaluateCondition(value: number, threshold: number, comparison: string): boolean {
  switch (comparison) {
    case 'gt':
      return value > threshold
    case 'lt':
      return value < threshold
    case 'eq':
      return value === threshold
    default:
      return false
  }
}

async function createAlertInstance(supabaseClient: any, rule: AlertRule, metric: MetricValue) {
  const alertInstance = {
    alert_rule_id: rule.id,
    severity: rule.severity,
    summary: `${rule.rule_name}: ${metric.service_name} ${metric.metric_type} is ${metric.value}`,
    description: `Alert triggered for ${metric.service_name}. ${metric.metric_type} value of ${metric.value} exceeds threshold of ${rule.threshold}`,
    labels: {
      service: metric.service_name,
      metric_type: metric.metric_type,
      rule_name: rule.rule_name
    },
    annotations: {
      current_value: metric.value,
      threshold: rule.threshold,
      timestamp: metric.timestamp
    },
    trigger_value: metric.value,
    fired_at: new Date().toISOString(),
    status: 'firing'
  }

  const { data, error } = await supabaseClient
    .from('alert_instances')
    .insert(alertInstance)
    .select()
    .single()

  if (error) throw error
  return data
}

async function sendAlertNotification(supabaseClient: any, alert: any) {
  // Call notification system to send alert
  try {
    const notificationResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/notification-system?action=send-alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify({
        alert_id: alert.id,
        service_name: alert.labels?.service || 'unknown',
        severity: alert.severity,
        message: alert.summary,
        timestamp: alert.fired_at
      })
    })

    if (!notificationResponse.ok) {
      console.error('Failed to send alert notification')
    }
  } catch (error) {
    console.error('Error sending alert notification:', error)
  }
}

async function createAlertRule(supabaseClient: any, alertRule: Partial<AlertRule>) {
  const { data, error } = await supabaseClient
    .from('alert_rules')
    .insert({
      rule_name: alertRule.rule_name,
      rule_type: 'metric_threshold',
      severity: alertRule.severity,
      conditions: {
        metric_type: alertRule.metric_type,
        threshold: alertRule.threshold,
        comparison: alertRule.comparison
      },
      notification_channels: ['email', 'slack'],
      escalation_rules: {
        escalation_timeout: 300, // 5 minutes
        escalation_levels: [
          { level: 1, channels: ['slack'] },
          { level: 2, channels: ['email', 'slack'] },
          { level: 3, channels: ['email', 'slack', 'sms'] }
        ]
      },
      is_active: true
    })
    .select()
    .single()

  if (error) throw error
  return data
}

async function getActiveAlerts(supabaseClient: any) {
  const { data, error } = await supabaseClient
    .from('alert_instances')
    .select('*')
    .eq('status', 'firing')
    .is('resolved_at', null)
    .order('fired_at', { ascending: false })

  if (error) throw error
  return data || []
}

async function acknowledgeAlert(supabaseClient: any, alertId: string) {
  const { data, error } = await supabaseClient
    .from('alert_instances')
    .update({
      status: 'acknowledged',
      resolved_at: new Date().toISOString()
    })
    .eq('id', alertId)
    .select()
    .single()

  if (error) throw error
  return data
}

async function getAlertHistory(supabaseClient: any) {
  const { data, error } = await supabaseClient
    .from('alert_instances')
    .select(`
      *,
      alert_rules (
        rule_name,
        severity,
        rule_type
      )
    `)
    .order('fired_at', { ascending: false })
    .limit(100)

  if (error) throw error
  return data || []
}

async function testNotification(supabaseClient: any, alertRuleId: string) {
  // Get alert rule details
  const { data: rule, error } = await supabaseClient
    .from('alert_rules')
    .select('*')
    .eq('id', alertRuleId)
    .single()

  if (error) throw error

  // Send test notification
  try {
    const notificationResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/notification-system?action=send-alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify({
        alert_id: 'test-' + crypto.randomUUID(),
        service_name: 'test-service',
        severity: rule.severity,
        message: `[TEST] ${rule.rule_name} - This is a test notification`,
        timestamp: new Date().toISOString()
      })
    })

    return {
      success: notificationResponse.ok,
      message: 'Test notification sent successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to send test notification: ${error.message}`
    }
  }
}