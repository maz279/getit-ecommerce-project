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

interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
  cooldown_minutes: number;
}

interface AlertInstance {
  rule_id: string;
  metric_value: number;
  severity: string;
  message: string;
  channels: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...payload } = await req.json();

    switch (action) {
      case 'check_alerts':
        return await checkAlerts();
      case 'create_alert_rule':
        return await createAlertRule(payload);
      case 'get_alert_history':
        return await getAlertHistory(payload);
      case 'send_test_alert':
        return await sendTestAlert(payload);
      case 'get_alert_rules':
        return await getAlertRules();
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Automated alerts error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function checkAlerts(): Promise<Response> {
  console.log('Checking alert conditions');
  
  // Get active alert rules
  const { data: alertRules } = await supabase
    .from('alert_rules')
    .select('*')
    .eq('is_active', true);

  if (!alertRules || alertRules.length === 0) {
    return new Response(JSON.stringify({ message: 'No active alert rules' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const triggeredAlerts: AlertInstance[] = [];

  for (const rule of alertRules) {
    try {
      const shouldTrigger = await evaluateAlertRule(rule);
      if (shouldTrigger) {
        const alertInstance = await createAlertInstance(rule, shouldTrigger.value);
        triggeredAlerts.push(alertInstance);
        
        // Send notifications
        await sendAlertNotifications(alertInstance);
      }
    } catch (error) {
      console.error(`Error evaluating rule ${rule.rule_name}:`, error);
    }
  }

  return new Response(JSON.stringify({ 
    triggered_alerts: triggeredAlerts.length,
    alerts: triggeredAlerts 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function evaluateAlertRule(rule: any): Promise<{ value: number } | null> {
  const { conditions } = rule;
  const metricName = conditions.metric_name;
  
  let currentValue: number;

  // Get current metric value based on type
  switch (metricName) {
    case 'cpu_usage':
      currentValue = await getCurrentCPUUsage();
      break;
    case 'memory_usage':
      currentValue = await getCurrentMemoryUsage();
      break;
    case 'response_time':
      currentValue = await getAverageResponseTime();
      break;
    case 'error_rate':
      currentValue = await getErrorRate();
      break;
    case 'active_users':
      currentValue = await getActiveUserCount();
      break;
    case 'order_volume':
      currentValue = await getOrderVolume();
      break;
    case 'fraud_score':
      currentValue = await getAverageFraudScore();
      break;
    default:
      console.warn(`Unknown metric: ${metricName}`);
      return null;
  }

  // Evaluate condition
  const threshold = conditions.threshold;
  const condition = conditions.operator;
  
  let shouldTrigger = false;
  
  switch (condition) {
    case 'greater_than':
      shouldTrigger = currentValue > threshold;
      break;
    case 'less_than':
      shouldTrigger = currentValue < threshold;
      break;
    case 'equals':
      shouldTrigger = currentValue === threshold;
      break;
    case 'not_equals':
      shouldTrigger = currentValue !== threshold;
      break;
  }

  // Check cooldown period
  if (shouldTrigger) {
    const recentAlert = await checkRecentAlert(rule.id);
    if (recentAlert) {
      console.log(`Alert ${rule.rule_name} is in cooldown period`);
      return null;
    }
  }

  return shouldTrigger ? { value: currentValue } : null;
}

async function createAlertInstance(rule: any, currentValue: number): Promise<AlertInstance> {
  const message = generateAlertMessage(rule, currentValue);
  
  const { data } = await supabase
    .from('alert_instances')
    .insert({
      alert_rule_id: rule.id,
      severity: rule.severity,
      summary: message,
      trigger_value: currentValue,
      fired_at: new Date().toISOString()
    })
    .select()
    .single();

  return {
    rule_id: rule.id,
    metric_value: currentValue,
    severity: rule.severity,
    message: message,
    channels: rule.notification_channels
  };
}

async function sendAlertNotifications(alert: AlertInstance): Promise<void> {
  console.log(`Sending alert notifications for ${alert.message}`);
  
  for (const channel of alert.channels) {
    try {
      switch (channel.type) {
        case 'email':
          await sendEmailAlert(alert, channel);
          break;
        case 'slack':
          await sendSlackAlert(alert, channel);
          break;
        case 'webhook':
          await sendWebhookAlert(alert, channel);
          break;
        case 'sms':
          await sendSMSAlert(alert, channel);
          break;
      }
    } catch (error) {
      console.error(`Failed to send alert via ${channel.type}:`, error);
    }
  }
}

async function sendEmailAlert(alert: AlertInstance, channel: any): Promise<void> {
  // Implementation would depend on email service (SendGrid, SES, etc.)
  console.log(`Sending email alert: ${alert.message}`);
}

async function sendSlackAlert(alert: AlertInstance, channel: any): Promise<void> {
  if (!channel.webhook_url) return;
  
  const payload = {
    text: `🚨 ${alert.severity.toUpperCase()} Alert`,
    attachments: [
      {
        color: getSeverityColor(alert.severity),
        fields: [
          {
            title: 'Alert',
            value: alert.message,
            short: false
          },
          {
            title: 'Severity',
            value: alert.severity,
            short: true
          },
          {
            title: 'Value',
            value: alert.metric_value.toString(),
            short: true
          }
        ],
        ts: Math.floor(Date.now() / 1000)
      }
    ]
  };

  await fetch(channel.webhook_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

async function sendWebhookAlert(alert: AlertInstance, channel: any): Promise<void> {
  if (!channel.url) return;
  
  await fetch(channel.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      alert: alert,
      timestamp: new Date().toISOString()
    })
  });
}

async function sendSMSAlert(alert: AlertInstance, channel: any): Promise<void> {
  // Implementation would depend on SMS service (Twilio, etc.)
  console.log(`Sending SMS alert: ${alert.message}`);
}

function generateAlertMessage(rule: any, currentValue: number): string {
  const { conditions } = rule;
  return `${rule.rule_name}: ${conditions.metric_name} is ${currentValue} (threshold: ${conditions.threshold})`;
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'danger';
    case 'high': return 'warning';
    case 'medium': return '#36a3e0';
    case 'low': return 'good';
    default: return '#36a3e0';
  }
}

async function checkRecentAlert(ruleId: string): Promise<boolean> {
  const { data } = await supabase
    .from('alert_instances')
    .select('*')
    .eq('alert_rule_id', ruleId)
    .gte('fired_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()) // 15 minutes
    .limit(1);

  return (data && data.length > 0) || false;
}

// Metric collection functions (these would integrate with actual monitoring systems)
async function getCurrentCPUUsage(): Promise<number> {
  // This would integrate with actual system monitoring
  return Math.random() * 100;
}

async function getCurrentMemoryUsage(): Promise<number> {
  return Math.random() * 100;
}

async function getAverageResponseTime(): Promise<number> {
  const { data } = await supabase
    .from('query_performance_logs')
    .select('execution_time_ms')
    .gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
    .limit(100);

  if (!data || data.length === 0) return 0;
  
  const avg = data.reduce((sum, log) => sum + log.execution_time_ms, 0) / data.length;
  return avg;
}

async function getErrorRate(): Promise<number> {
  // Calculate error rate from logs
  return Math.random() * 5; // Placeholder
}

async function getActiveUserCount(): Promise<number> {
  const { data } = await supabase
    .from('zero_trust_sessions')
    .select('user_id')
    .eq('status', 'active')
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

  return data?.length || 0;
}

async function getOrderVolume(): Promise<number> {
  const { data } = await supabase
    .from('orders')
    .select('id')
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

  return data?.length || 0;
}

async function getAverageFraudScore(): Promise<number> {
  const { data } = await supabase
    .from('fraud_detection_results')
    .select('fraud_score')
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
    .limit(100);

  if (!data || data.length === 0) return 0;
  
  const avg = data.reduce((sum, result) => sum + result.fraud_score, 0) / data.length;
  return avg;
}

async function createAlertRule(payload: any): Promise<Response> {
  const { data, error } = await supabase
    .from('alert_rules')
    .insert(payload)
    .select();

  if (error) throw error;

  return new Response(JSON.stringify({ success: true, data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getAlertHistory(payload: any): Promise<Response> {
  const { limit = 50, severity } = payload;
  
  let query = supabase
    .from('alert_instances')
    .select('*')
    .order('fired_at', { ascending: false })
    .limit(limit);

  if (severity) {
    query = query.eq('severity', severity);
  }

  const { data, error } = await query;

  if (error) throw error;

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function sendTestAlert(payload: any): Promise<Response> {
  const testAlert: AlertInstance = {
    rule_id: 'test',
    metric_value: 100,
    severity: 'medium',
    message: 'This is a test alert from GetIt monitoring system',
    channels: payload.channels || []
  };

  await sendAlertNotifications(testAlert);

  return new Response(JSON.stringify({ success: true, message: 'Test alert sent' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getAlertRules(): Promise<Response> {
  const { data, error } = await supabase
    .from('alert_rules')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}