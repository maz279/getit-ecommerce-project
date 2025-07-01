import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Monitoring configuration
const MONITORING_CONFIGS = {
  metrics: {
    retention_days: 30,
    collection_interval: 60000, // 1 minute
    alert_thresholds: {
      response_time: 5000, // 5 seconds
      error_rate: 5, // 5%
      cpu_usage: 80, // 80%
      memory_usage: 90, // 90%
      disk_usage: 85 // 85%
    }
  },
  logs: {
    retention_days: 7,
    max_log_size: 1000000, // 1MB per log entry
    log_levels: ['error', 'warn', 'info', 'debug']
  },
  alerts: {
    email_notifications: true,
    slack_notifications: true,
    escalation_timeout: 300000, // 5 minutes
    max_alerts_per_hour: 10
  }
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
      case 'log':
        return await logEvent(req, supabaseClient)
      case 'metrics':
        return await recordMetrics(req, supabaseClient)
      case 'health-check':
        return await healthCheck(req, supabaseClient)
      case 'alerts':
        return await createAlert(req, supabaseClient)
      case 'get-logs':
        return await getLogs(req, supabaseClient)
      case 'get-metrics':
        return await getMetrics(req, supabaseClient)
      case 'dashboard':
        return await getDashboardData(req, supabaseClient)
      case 'system-status':
        return await getSystemStatus(req, supabaseClient)
      case 'error-tracking':
        return await trackError(req, supabaseClient)
      case 'performance':
        return await trackPerformance(req, supabaseClient)
      case 'audit':
        return await auditLog(req, supabaseClient)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Monitoring system error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function logEvent(req: Request, supabaseClient: any) {
  const { 
    level, 
    message, 
    service, 
    user_id, 
    session_id, 
    metadata, 
    timestamp = new Date().toISOString() 
  } = await req.json()

  if (!level || !message || !service) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const logEntry = {
      log_level: level,
      message: message,
      service_name: service,
      user_id: user_id,
      session_id: session_id,
      metadata: metadata || {},
      timestamp: timestamp,
      created_at: new Date().toISOString()
    }

    await supabaseClient
      .from('system_logs')
      .insert(logEntry)

    // Check if this is an error that needs alerting
    if (level === 'error') {
      await checkErrorAlerts(supabaseClient, logEntry)
    }

    return new Response(JSON.stringify({
      success: true,
      logged: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function recordMetrics(req: Request, supabaseClient: any) {
  const { 
    metric_name, 
    metric_value, 
    metric_type = 'counter', 
    service, 
    tags = {},
    timestamp = new Date().toISOString() 
  } = await req.json()

  try {
    const metricEntry = {
      metric_name: metric_name,
      metric_value: metric_value,
      metric_type: metric_type,
      service_name: service,
      tags: tags,
      timestamp: timestamp,
      created_at: new Date().toISOString()
    }

    await supabaseClient
      .from('system_metrics')
      .insert(metricEntry)

    // Check if metric exceeds threshold
    await checkMetricAlerts(supabaseClient, metricEntry)

    return new Response(JSON.stringify({
      success: true,
      recorded: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function healthCheck(req: Request, supabaseClient: any) {
  const startTime = Date.now()
  const checks = []

  try {
    // Database health check
    const dbStart = Date.now()
    const { data: dbCheck } = await supabaseClient
      .from('system_metrics')
      .select('count', { count: 'exact' })
      .limit(1)
    
    checks.push({
      name: 'database',
      status: dbCheck ? 'healthy' : 'unhealthy',
      response_time: Date.now() - dbStart,
      details: dbCheck ? 'Connection successful' : 'Connection failed'
    })

    // Storage health check
    const storageStart = Date.now()
    try {
      const { data: buckets } = await supabaseClient.storage.listBuckets()
      checks.push({
        name: 'storage',
        status: 'healthy',
        response_time: Date.now() - storageStart,
        details: `${buckets?.length || 0} buckets available`
      })
    } catch (error) {
      checks.push({
        name: 'storage',
        status: 'unhealthy',
        response_time: Date.now() - storageStart,
        details: error.message
      })
    }

    // Edge Functions health check
    const functionsStart = Date.now()
    try {
      // Test a simple function call (self-reference)
      const functionResponse = await supabaseClient.functions.invoke('monitoring-system', {
        body: { action: 'ping' }
      })
      
      checks.push({
        name: 'edge_functions',
        status: 'healthy',
        response_time: Date.now() - functionsStart,
        details: 'Functions responding'
      })
    } catch (error) {
      checks.push({
        name: 'edge_functions',
        status: 'degraded',
        response_time: Date.now() - functionsStart,
        details: 'Limited functionality'
      })
    }

    const totalResponseTime = Date.now() - startTime
    const overallStatus = checks.every(check => check.status === 'healthy') ? 'healthy' : 
                         checks.some(check => check.status === 'unhealthy') ? 'unhealthy' : 'degraded'

    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      response_time: totalResponseTime,
      checks: checks,
      version: '1.0.0'
    }

    // Log health check result
    await supabaseClient
      .from('health_checks')
      .insert({
        status: overallStatus,
        response_time: totalResponseTime,
        checks_data: checks,
        created_at: new Date().toISOString()
      })

    return new Response(JSON.stringify(healthData), {
      status: overallStatus === 'healthy' ? 200 : 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      response_time: Date.now() - startTime
    }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function createAlert(req: Request, supabaseClient: any) {
  const { 
    alert_type, 
    severity, 
    title, 
    message, 
    service, 
    metadata = {} 
  } = await req.json()

  try {
    const alertEntry = {
      alert_type: alert_type,
      severity: severity,
      title: title,
      message: message,
      service_name: service,
      metadata: metadata,
      status: 'open',
      created_at: new Date().toISOString()
    }

    const { data: alert, error } = await supabaseClient
      .from('system_alerts')
      .insert(alertEntry)
      .select()
      .single()

    if (error) {
      throw error
    }

    // Send notifications based on severity
    if (severity === 'critical' || severity === 'high') {
      await sendAlertNotifications(supabaseClient, alert)
    }

    return new Response(JSON.stringify({
      success: true,
      alert_id: alert.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function getLogs(req: Request, supabaseClient: any) {
  const url = new URL(req.url)
  const service = url.searchParams.get('service')
  const level = url.searchParams.get('level')
  const limit = parseInt(url.searchParams.get('limit') || '100')
  const offset = parseInt(url.searchParams.get('offset') || '0')

  try {
    let query = supabaseClient
      .from('system_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (service) {
      query = query.eq('service_name', service)
    }

    if (level) {
      query = query.eq('log_level', level)
    }

    const { data: logs, error } = await query

    if (error) {
      throw error
    }

    return new Response(JSON.stringify({
      success: true,
      logs: logs,
      total: logs?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function getMetrics(req: Request, supabaseClient: any) {
  const url = new URL(req.url)
  const service = url.searchParams.get('service')
  const metricName = url.searchParams.get('metric_name')
  const timeRange = url.searchParams.get('time_range') || '1h'

  try {
    const timeRangeMs = parseTimeRange(timeRange)
    const startTime = new Date(Date.now() - timeRangeMs).toISOString()

    let query = supabaseClient
      .from('system_metrics')
      .select('*')
      .gte('created_at', startTime)
      .order('created_at', { ascending: true })

    if (service) {
      query = query.eq('service_name', service)
    }

    if (metricName) {
      query = query.eq('metric_name', metricName)
    }

    const { data: metrics, error } = await query

    if (error) {
      throw error
    }

    return new Response(JSON.stringify({
      success: true,
      metrics: metrics,
      time_range: timeRange,
      total: metrics?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function getDashboardData(req: Request, supabaseClient: any) {
  try {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()

    // Get recent alerts
    const { data: recentAlerts } = await supabaseClient
      .from('system_alerts')
      .select('*')
      .gte('created_at', oneDayAgo)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get error rate
    const { data: errorLogs } = await supabaseClient
      .from('system_logs')
      .select('count', { count: 'exact' })
      .eq('log_level', 'error')
      .gte('created_at', oneHourAgo)

    const { data: totalLogs } = await supabaseClient
      .from('system_logs')
      .select('count', { count: 'exact' })
      .gte('created_at', oneHourAgo)

    // Get service health
    const { data: latestHealthCheck } = await supabaseClient
      .from('health_checks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Calculate metrics
    const errorCount = errorLogs?.[0]?.count || 0
    const totalCount = totalLogs?.[0]?.count || 0
    const errorRate = totalCount > 0 ? (errorCount / totalCount * 100).toFixed(2) : '0.00'

    return new Response(JSON.stringify({
      success: true,
      dashboard: {
        system_health: latestHealthCheck?.status || 'unknown',
        error_rate: parseFloat(errorRate),
        recent_alerts: recentAlerts || [],
        total_errors_last_hour: errorCount,
        total_requests_last_hour: totalCount,
        last_health_check: latestHealthCheck?.created_at,
        response_time: latestHealthCheck?.response_time
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function getSystemStatus(req: Request, supabaseClient: any) {
  try {
    // Get latest metrics for each service
    const { data: services } = await supabaseClient
      .from('system_metrics')
      .select('service_name')
      .not('service_name', 'is', null)
      .order('created_at', { ascending: false })

    const uniqueServices = [...new Set(services?.map(s => s.service_name) || [])]

    const serviceStatuses = []
    for (const service of uniqueServices) {
      const { data: latestMetrics } = await supabaseClient
        .from('system_metrics')
        .select('*')
        .eq('service_name', service)
        .order('created_at', { ascending: false })
        .limit(5)

      serviceStatuses.push({
        service: service,
        status: 'operational', // Would be calculated based on metrics
        latest_metrics: latestMetrics
      })
    }

    return new Response(JSON.stringify({
      success: true,
      system_status: {
        overall_status: 'operational',
        services: serviceStatuses,
        last_updated: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function trackError(req: Request, supabaseClient: any) {
  const { error_message, stack_trace, service, user_id, metadata = {} } = await req.json()

  try {
    await supabaseClient
      .from('error_tracking')
      .insert({
        error_message: error_message,
        stack_trace: stack_trace,
        service_name: service,
        user_id: user_id,
        metadata: metadata,
        created_at: new Date().toISOString()
      })

    return new Response(JSON.stringify({
      success: true,
      tracked: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function trackPerformance(req: Request, supabaseClient: any) {
  const { operation_name, duration, service, metadata = {} } = await req.json()

  try {
    await supabaseClient
      .from('performance_tracking')
      .insert({
        operation_name: operation_name,
        duration_ms: duration,
        service_name: service,
        metadata: metadata,
        created_at: new Date().toISOString()
      })

    return new Response(JSON.stringify({
      success: true,
      tracked: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function auditLog(req: Request, supabaseClient: any) {
  const { action, resource, user_id, changes = {}, metadata = {} } = await req.json()

  try {
    await supabaseClient
      .from('audit_logs')
      .insert({
        action: action,
        resource_type: resource,
        user_id: user_id,
        changes: changes,
        metadata: metadata,
        created_at: new Date().toISOString()
      })

    return new Response(JSON.stringify({
      success: true,
      logged: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function checkErrorAlerts(supabaseClient: any, logEntry: any) {
  // Check if error rate is above threshold
  const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
  
  const { data: recentErrors } = await supabaseClient
    .from('system_logs')
    .select('count', { count: 'exact' })
    .eq('log_level', 'error')
    .eq('service_name', logEntry.service_name)
    .gte('created_at', oneMinuteAgo)

  const errorCount = recentErrors?.[0]?.count || 0
  
  if (errorCount > 5) { // More than 5 errors in 1 minute
    await createAlert(
      new Request('', { 
        method: 'POST',
        body: JSON.stringify({
          alert_type: 'error_rate',
          severity: 'high',
          title: 'High Error Rate Detected',
          message: `Service ${logEntry.service_name} has generated ${errorCount} errors in the last minute`,
          service: logEntry.service_name,
          metadata: { error_count: errorCount, threshold: 5 }
        })
      }),
      supabaseClient
    )
  }
}

async function checkMetricAlerts(supabaseClient: any, metricEntry: any) {
  const thresholds = MONITORING_CONFIGS.metrics.alert_thresholds
  const metricName = metricEntry.metric_name
  const metricValue = metricEntry.metric_value

  let shouldAlert = false
  let alertMessage = ''

  if (metricName.includes('response_time') && metricValue > thresholds.response_time) {
    shouldAlert = true
    alertMessage = `Response time (${metricValue}ms) exceeds threshold (${thresholds.response_time}ms)`
  } else if (metricName.includes('cpu') && metricValue > thresholds.cpu_usage) {
    shouldAlert = true
    alertMessage = `CPU usage (${metricValue}%) exceeds threshold (${thresholds.cpu_usage}%)`
  } else if (metricName.includes('memory') && metricValue > thresholds.memory_usage) {
    shouldAlert = true
    alertMessage = `Memory usage (${metricValue}%) exceeds threshold (${thresholds.memory_usage}%)`
  }

  if (shouldAlert) {
    await createAlert(
      new Request('', {
        method: 'POST',
        body: JSON.stringify({
          alert_type: 'metric_threshold',
          severity: 'medium',
          title: `Metric Threshold Exceeded: ${metricName}`,
          message: alertMessage,
          service: metricEntry.service_name,
          metadata: { metric_name: metricName, metric_value: metricValue }
        })
      }),
      supabaseClient
    )
  }
}

async function sendAlertNotifications(supabaseClient: any, alert: any) {
  // This would integrate with notification systems
  console.log('Alert notification:', alert.title)
  
  // Could call notification-system edge function here
  try {
    await supabaseClient.functions.invoke('notification-system', {
      body: {
        action: 'send-alert',
        alert: alert
      }
    })
  } catch (error) {
    console.error('Failed to send alert notification:', error)
  }
}

function parseTimeRange(timeRange: string): number {
  const timeRangeMap: { [key: string]: number } = {
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000
  }
  
  return timeRangeMap[timeRange] || timeRangeMap['1h']
}