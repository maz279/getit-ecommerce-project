import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MetricPayload {
  metric_name: string;
  metric_type: 'counter' | 'gauge' | 'histogram' | 'summary';
  metric_value: number;
  labels?: Record<string, any>;
  service_name: string;
  instance_id?: string;
}

interface HealthCheckPayload {
  service_name: string;
  endpoint_url: string;
  check_type: 'http' | 'tcp' | 'database' | 'custom';
}

interface AlertPayload {
  rule_id: string;
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  summary: string;
  description?: string;
  trigger_value?: number;
  labels?: Record<string, any>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const path = url.pathname.replace('/functions/v1/monitoring-system', '');

    switch (path) {
      case '/metrics/collect':
        return await collectMetrics(req, supabase);
      case '/health/check':
        return await performHealthCheck(req, supabase);
      case '/alerts/fire':
        return await fireAlert(req, supabase);
      case '/alerts/resolve':
        return await resolveAlert(req, supabase);
      case '/sla/evaluate':
        return await evaluateSLA(req, supabase);
      case '/dashboards/data':
        return await getDashboardData(req, supabase);
      case '/traces/create':
        return await createTrace(req, supabase);
      case '/logs/ingest':
        return await ingestLogs(req, supabase);
      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Monitoring system error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function collectMetrics(req: Request, supabase: any) {
  const payload: MetricPayload = await req.json();
  
  const { data, error } = await supabase
    .from('metrics_collection')
    .insert({
      metric_name: payload.metric_name,
      metric_type: payload.metric_type,
      metric_value: payload.metric_value,
      labels: payload.labels || {},
      service_name: payload.service_name,
      instance_id: payload.instance_id,
      timestamp: new Date().toISOString()
    });

  if (error) {
    console.error('Failed to collect metric:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ 
    success: true,
    message: 'Metric collected successfully' 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function performHealthCheck(req: Request, supabase: any) {
  const payload: HealthCheckPayload = await req.json();
  
  let status = 'healthy';
  let response_time_ms = 0;
  let status_code = 200;
  let error_message = null;
  let health_score = 100;

  try {
    const start = Date.now();
    
    if (payload.check_type === 'http') {
      const response = await fetch(payload.endpoint_url, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });
      response_time_ms = Date.now() - start;
      status_code = response.status;
      
      if (status_code >= 200 && status_code < 300) {
        status = 'healthy';
        health_score = 100;
      } else if (status_code >= 400 && status_code < 500) {
        status = 'degraded';
        health_score = 60;
      } else {
        status = 'unhealthy';
        health_score = 0;
      }
    }
  } catch (error) {
    status = 'unhealthy';
    health_score = 0;
    error_message = error.message;
    response_time_ms = 10000; // timeout duration
  }

  const { data, error: dbError } = await supabase
    .from('system_health_checks')
    .insert({
      service_name: payload.service_name,
      endpoint_url: payload.endpoint_url,
      check_type: payload.check_type,
      status,
      response_time_ms,
      status_code,
      error_message,
      health_score,
      metadata: {},
      checked_at: new Date().toISOString()
    });

  if (dbError) {
    console.error('Failed to save health check:', dbError);
  }

  return new Response(JSON.stringify({
    service_name: payload.service_name,
    status,
    response_time_ms,
    health_score,
    checked_at: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function fireAlert(req: Request, supabase: any) {
  const payload: AlertPayload = await req.json();
  
  const { data, error } = await supabase
    .from('alert_instances')
    .insert({
      alert_rule_id: payload.rule_id,
      status: 'firing',
      severity: payload.severity,
      summary: payload.summary,
      description: payload.description,
      trigger_value: payload.trigger_value,
      labels: payload.labels || {},
      annotations: {},
      fired_at: new Date().toISOString()
    });

  if (error) {
    console.error('Failed to fire alert:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  console.log(`Alert fired: ${payload.summary} (${payload.severity})`);

  return new Response(JSON.stringify({ 
    success: true,
    alert_id: data?.[0]?.id,
    message: 'Alert fired successfully' 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function resolveAlert(req: Request, supabase: any) {
  const { alert_id } = await req.json();
  
  const { data, error } = await supabase
    .from('alert_instances')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString()
    })
    .eq('id', alert_id);

  if (error) {
    console.error('Failed to resolve alert:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ 
    success: true,
    message: 'Alert resolved successfully' 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function evaluateSLA(req: Request, supabase: any) {
  const { service_name, sla_type } = await req.json();
  
  const { data: slaConfig, error: slaError } = await supabase
    .from('sla_configurations')
    .select('*')
    .eq('service_name', service_name)
    .eq('sla_type', sla_type)
    .eq('is_active', true)
    .single();

  if (slaError || !slaConfig) {
    return new Response(JSON.stringify({ 
      error: 'SLA configuration not found' 
    }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  let current_value = 99.5;
  
  if (sla_type === 'response_time') {
    const { data: metrics } = await supabase
      .from('metrics_collection')
      .select('metric_value')
      .eq('service_name', service_name)
      .eq('metric_name', 'response_time')
      .gte('timestamp', new Date(Date.now() - 5 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: false });
    
    if (metrics?.length) {
      current_value = metrics.reduce((sum, m) => sum + m.metric_value, 0) / metrics.length;
    }
  }

  let violation_type = null;
  if (current_value < slaConfig.critical_threshold) {
    violation_type = 'critical';
  } else if (current_value < slaConfig.warning_threshold) {
    violation_type = 'warning';
  }

  if (violation_type) {
    await supabase
      .from('sla_violations')
      .insert({
        sla_config_id: slaConfig.id,
        violation_type,
        current_value,
        expected_value: slaConfig.target_value,
        duration_minutes: 5,
        impact_assessment: {},
        root_cause_analysis: {},
        mitigation_actions: []
      });
  }

  return new Response(JSON.stringify({
    service_name,
    sla_type,
    target_value: slaConfig.target_value,
    current_value,
    compliance: current_value >= slaConfig.target_value,
    violation_type
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getDashboardData(req: Request, supabase: any) {
  const url = new URL(req.url);
  const dashboard_id = url.searchParams.get('dashboard_id');
  
  if (!dashboard_id) {
    return new Response(JSON.stringify({ error: 'Dashboard ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const { data: dashboard, error } = await supabase
    .from('business_dashboards')
    .select('*')
    .eq('id', dashboard_id)
    .single();

  if (error || !dashboard) {
    return new Response(JSON.stringify({ error: 'Dashboard not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const panelData = dashboard.panels.map((panel: any) => ({
    ...panel,
    data: generateMockData(panel.type),
    last_updated: new Date().toISOString()
  }));

  return new Response(JSON.stringify({
    dashboard_name: dashboard.dashboard_name,
    dashboard_type: dashboard.dashboard_type,
    panels: panelData,
    refresh_interval: dashboard.refresh_interval
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function createTrace(req: Request, supabase: any) {
  const payload = await req.json();
  
  const { data, error } = await supabase
    .from('distributed_traces')
    .insert({
      trace_id: payload.trace_id,
      span_id: payload.span_id,
      parent_span_id: payload.parent_span_id,
      operation_name: payload.operation_name,
      service_name: payload.service_name,
      start_time: payload.start_time,
      end_time: payload.end_time,
      duration_ms: payload.duration_ms,
      tags: payload.tags || {},
      logs: payload.logs || [],
      status: payload.status || 'ok',
      error_message: payload.error_message,
      baggage: payload.baggage || {}
    });

  if (error) {
    console.error('Failed to create trace:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ 
    success: true,
    trace_id: payload.trace_id,
    span_id: payload.span_id
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function ingestLogs(req: Request, supabase: any) {
  const payload = await req.json();
  
  const { data, error } = await supabase
    .from('centralized_logs')
    .insert({
      log_level: payload.log_level,
      service_name: payload.service_name,
      instance_id: payload.instance_id,
      message: payload.message,
      structured_data: payload.structured_data || {},
      request_id: payload.request_id,
      user_id: payload.user_id,
      ip_address: payload.ip_address,
      user_agent: payload.user_agent,
      stack_trace: payload.stack_trace,
      correlation_id: payload.correlation_id,
      business_context: payload.business_context || {}
    });

  if (error) {
    console.error('Failed to ingest log:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ 
    success: true,
    message: 'Log ingested successfully' 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

function generateMockData(type: string) {
  switch (type) {
    case 'metric':
      return Math.floor(Math.random() * 1000) + 500;
    case 'chart':
      return Array.from({ length: 24 }, (_, i) => ({
        time: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
        value: Math.floor(Math.random() * 100) + 50
      }));
    case 'pie':
      return [
        { name: 'Completed', value: 45 },
        { name: 'Processing', value: 30 },
        { name: 'Pending', value: 15 },
        { name: 'Failed', value: 10 }
      ];
    case 'table':
      return [
        { vendor: 'Tech Store BD', sales: 15000, rating: 4.8 },
        { vendor: 'Fashion Hub', sales: 12000, rating: 4.6 },
        { vendor: 'Home Essentials', sales: 8000, rating: 4.5 }
      ];
    case 'status':
      return { status: 'healthy', services: 12, degraded: 1, unhealthy: 0 };
    default:
      return null;
  }
}