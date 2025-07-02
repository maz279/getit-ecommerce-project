import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  details?: any;
}

interface SystemMetrics {
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  database_connections: number;
  active_users: number;
  api_requests_per_minute: number;
  error_rate: number;
}

// Comprehensive system monitoring
async function performHealthChecks(): Promise<HealthCheck[]> {
  const checks: HealthCheck[] = [];
  
  // Database health check
  const dbStart = Date.now();
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    checks.push({
      service: 'database',
      status: error ? 'down' : 'healthy',
      responseTime: Date.now() - dbStart,
      details: error ? error.message : 'Connected'
    });
  } catch (error) {
    checks.push({
      service: 'database',
      status: 'down',
      responseTime: Date.now() - dbStart,
      details: error.message
    });
  }
  
  // Edge Functions health check
  const functionsStart = Date.now();
  try {
    const { data, error } = await supabase.functions.invoke('business-analytics', {
      body: { type: 'health_check' }
    });
    checks.push({
      service: 'edge_functions',
      status: error ? 'degraded' : 'healthy',
      responseTime: Date.now() - functionsStart,
      details: 'Analytics service responding'
    });
  } catch (error) {
    checks.push({
      service: 'edge_functions',
      status: 'down',
      responseTime: Date.now() - functionsStart,
      details: error.message
    });
  }
  
  // Storage health check
  const storageStart = Date.now();
  try {
    const { data, error } = await supabase.storage.listBuckets();
    checks.push({
      service: 'storage',
      status: error ? 'down' : 'healthy',
      responseTime: Date.now() - storageStart,
      details: `${data?.length || 0} buckets available`
    });
  } catch (error) {
    checks.push({
      service: 'storage',
      status: 'down',
      responseTime: Date.now() - storageStart,
      details: error.message
    });
  }
  
  return checks;
}

// Collect system metrics
async function collectSystemMetrics(): Promise<SystemMetrics> {
  const now = new Date().toISOString();
  
  // Get active users (last 5 minutes)
  const { data: activeUsers } = await supabase
    .from('user_sessions')
    .select('count')
    .gte('last_activity', new Date(Date.now() - 5 * 60 * 1000).toISOString());
  
  // Get recent API requests
  const { data: apiRequests } = await supabase
    .from('api_gateway_logs')
    .select('count')
    .gte('created_at', new Date(Date.now() - 60 * 1000).toISOString());
  
  // Get error rate
  const { data: errors } = await supabase
    .from('error_tracking')
    .select('count')
    .gte('created_at', new Date(Date.now() - 60 * 1000).toISOString());
  
  // Mock CPU and memory metrics (would come from actual monitoring in production)
  const metrics: SystemMetrics = {
    timestamp: now,
    cpu_usage: Math.random() * 100,
    memory_usage: Math.random() * 100,
    database_connections: Math.floor(Math.random() * 50) + 10,
    active_users: activeUsers?.length || 0,
    api_requests_per_minute: apiRequests?.length || 0,
    error_rate: errors?.length || 0
  };
  
  // Store metrics
  await supabase.from('system_metrics').insert({
    metric_name: 'system_health',
    metric_data: metrics,
    created_at: now
  });
  
  return metrics;
}

// Performance optimization recommendations
async function generateOptimizationRecommendations(): Promise<string[]> {
  const recommendations: string[] = [];
  
  // Check database performance
  const { data: slowQueries } = await supabase
    .from('performance_tracking')
    .select('*')
    .gte('response_time', 1000)
    .limit(10);
    
  if (slowQueries && slowQueries.length > 0) {
    recommendations.push('Optimize slow database queries detected');
    recommendations.push('Consider adding database indexes for frequently queried columns');
  }
  
  // Check error rates
  const { data: recentErrors } = await supabase
    .from('error_tracking')
    .select('count')
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());
    
  if (recentErrors && recentErrors.length > 10) {
    recommendations.push('High error rate detected - investigate recent deployments');
  }
  
  // Check cache performance
  const { data: cacheStats } = await supabase
    .from('cache_statistics')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
    
  if (cacheStats) {
    const hitRate = cacheStats.filter(s => s.operation === 'hit').length / cacheStats.length;
    if (hitRate < 0.8) {
      recommendations.push('Cache hit rate is low - consider cache warming strategies');
    }
  }
  
  return recommendations;
}

// Security assessment
async function performSecurityAssessment(): Promise<any> {
  const assessment = {
    failedLogins: 0,
    suspiciousActivity: 0,
    securityEvents: [],
    riskLevel: 'low'
  };
  
  // Check failed authentication attempts
  const { data: authLogs } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('action', 'login_failed')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
  assessment.failedLogins = authLogs?.length || 0;
  
  // Check for suspicious activities
  const { data: suspiciousLogs } = await supabase
    .from('audit_logs')
    .select('*')
    .in('action', ['multiple_failed_logins', 'unusual_activity', 'security_violation'])
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
  assessment.suspiciousActivity = suspiciousLogs?.length || 0;
  
  // Determine risk level
  if (assessment.failedLogins > 100 || assessment.suspiciousActivity > 10) {
    assessment.riskLevel = 'high';
  } else if (assessment.failedLogins > 50 || assessment.suspiciousActivity > 5) {
    assessment.riskLevel = 'medium';
  }
  
  return assessment;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action } = await req.json();
    
    switch (action) {
      case 'health_check':
        const healthChecks = await performHealthChecks();
        return new Response(JSON.stringify({
          success: true,
          checks: healthChecks,
          overall_status: healthChecks.every(c => c.status === 'healthy') ? 'healthy' : 'degraded'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
        
      case 'system_metrics':
        const metrics = await collectSystemMetrics();
        return new Response(JSON.stringify({
          success: true,
          metrics
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
        
      case 'optimization_recommendations':
        const recommendations = await generateOptimizationRecommendations();
        return new Response(JSON.stringify({
          success: true,
          recommendations
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
        
      case 'security_assessment':
        const securityAssessment = await performSecurityAssessment();
        return new Response(JSON.stringify({
          success: true,
          assessment: securityAssessment
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
        
      case 'comprehensive_report':
        const [health, systemMetrics, optimizations, security] = await Promise.all([
          performHealthChecks(),
          collectSystemMetrics(),
          generateOptimizationRecommendations(),
          performSecurityAssessment()
        ]);
        
        return new Response(JSON.stringify({
          success: true,
          report: {
            timestamp: new Date().toISOString(),
            health,
            metrics: systemMetrics,
            optimizations,
            security,
            summary: {
              overall_health: health.every(c => c.status === 'healthy') ? 'healthy' : 'degraded',
              performance_score: Math.max(0, 100 - optimizations.length * 10),
              security_level: security.riskLevel
            }
          }
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
        
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
  } catch (error) {
    console.error('Platform monitoring error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

serve(handler);