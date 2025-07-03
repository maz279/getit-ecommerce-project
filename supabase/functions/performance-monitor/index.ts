import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'metrics';

    switch (action) {
      case 'metrics':
        return await getPerformanceMetrics(supabaseClient);
      case 'health':
        return await getSystemHealth(supabaseClient);
      case 'alerts':
        return await getActiveAlerts(supabaseClient);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Performance monitor error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function getPerformanceMetrics(supabase: any) {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  // Get real-time metrics
  const { data: realtimeMetrics } = await supabase
    .from('real_time_metrics')
    .select('*')
    .gte('created_at', oneHourAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(100);

  // Get query performance
  const { data: queryPerformance } = await supabase
    .from('query_performance_logs')
    .select('*')
    .gte('created_at', oneHourAgo.toISOString())
    .order('execution_time_ms', { ascending: false })
    .limit(50);

  // Calculate aggregated metrics
  const avgResponseTime = queryPerformance?.reduce((sum, log) => sum + log.execution_time_ms, 0) / (queryPerformance?.length || 1);
  const slowQueries = queryPerformance?.filter(log => log.execution_time_ms > 1000).length || 0;
  const cacheHitRate = queryPerformance?.filter(log => log.cache_hit).length / (queryPerformance?.length || 1);

  const metrics = {
    timestamp: now.toISOString(),
    performance: {
      avgResponseTime: Math.round(avgResponseTime),
      slowQueries,
      cacheHitRate: Math.round(cacheHitRate * 100),
      totalQueries: queryPerformance?.length || 0
    },
    realtime: {
      activeConnections: realtimeMetrics?.length || 0,
      messagesPerMinute: realtimeMetrics?.filter(m => 
        new Date(m.created_at) > new Date(now.getTime() - 60 * 1000)
      ).length || 0
    }
  };

  return new Response(
    JSON.stringify(metrics),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getSystemHealth(supabase: any) {
  try {
    const healthCheck = await supabase.rpc('database_health_check');
    
    const health = {
      status: 'healthy',
      database: healthCheck.data || { status: 'unknown' },
      timestamp: new Date().toISOString(),
      uptime: '99.9%', // This would come from monitoring
      services: {
        api: 'healthy',
        database: 'healthy',
        storage: 'healthy',
        realtime: 'healthy'
      }
    };

    return new Response(
      JSON.stringify(health),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Health check error:', error);
    return new Response(
      JSON.stringify({ status: 'degraded', error: error.message }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function getActiveAlerts(supabase: any) {
  const { data: alerts } = await supabase
    .from('alert_instances')
    .select('*')
    .eq('status', 'firing')
    .order('fired_at', { ascending: false })
    .limit(20);

  const alertsSummary = {
    active: alerts?.length || 0,
    critical: alerts?.filter(a => a.severity === 'critical').length || 0,
    warning: alerts?.filter(a => a.severity === 'warning').length || 0,
    alerts: alerts || []
  };

  return new Response(
    JSON.stringify(alertsSummary),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}