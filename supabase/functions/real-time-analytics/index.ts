import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RealTimeMetricsRequest {
  action: 'get_metrics' | 'update_metric' | 'subscribe_metrics';
  vendorId?: string;
  metricType?: 'sales' | 'inventory' | 'orders' | 'customers';
  timeframe?: 'realtime' | 'hourly' | 'daily';
  filters?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, vendorId, metricType, timeframe = 'realtime', filters = {} }: RealTimeMetricsRequest = await req.json();

    switch (action) {
      case 'get_metrics':
        return await getMetrics(supabaseClient, user.id, metricType, timeframe, filters);
      
      case 'update_metric':
        return await updateMetric(supabaseClient, user.id, filters);
      
      case 'subscribe_metrics':
        return await getSubscriptionData(supabaseClient, user.id, metricType);
      
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Realtime Analytics Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function getMetrics(supabaseClient: any, vendorId: string, metricType?: string, timeframe: string = 'realtime', filters: Record<string, any> = {}) {
  const now = new Date();
  let timeFilter = '';
  
  switch (timeframe) {
    case 'realtime':
      timeFilter = `recorded_at >= '${new Date(now.getTime() - 5 * 60 * 1000).toISOString()}'`;
      break;
    case 'hourly':
      timeFilter = `recorded_at >= '${new Date(now.getTime() - 60 * 60 * 1000).toISOString()}'`;
      break;
    case 'daily':
      timeFilter = `recorded_at >= '${new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()}'`;
      break;
  }

  // Get real-time metrics
  let query = supabaseClient
    .from('real_time_metrics')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('recorded_at', { ascending: false })
    .limit(100);

  if (metricType) {
    query = query.eq('metric_type', metricType);
  }

  const { data: metrics, error } = await query;
  if (error) throw error;

  // Get current dashboard KPIs
  const { data: kpis, error: kpiError } = await supabaseClient
    .from('dashboard_kpi_metrics')
    .select('*')
    .eq('created_by', vendorId)
    .order('recorded_date', { ascending: false })
    .limit(20);

  if (kpiError) throw kpiError;

  // Aggregate metrics by type
  const aggregatedMetrics = aggregateMetrics(metrics, timeframe);
  
  // Get live notifications
  const { data: notifications, error: notifError } = await supabaseClient
    .from('vendor_notifications')
    .select('*')
    .eq('vendor_id', vendorId)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(10);

  if (notifError) throw notifError;

  return new Response(
    JSON.stringify({
      success: true,
      metrics: aggregatedMetrics,
      kpis: kpis || [],
      notifications: notifications || [],
      timestamp: now.toISOString()
    }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function updateMetric(supabaseClient: any, vendorId: string, data: Record<string, any>) {
  const { metricType, metricKey, metricValue } = data;

  const { error } = await supabaseClient
    .from('real_time_metrics')
    .insert({
      vendor_id: vendorId,
      metric_type: metricType,
      metric_key: metricKey,
      metric_value: metricValue,
      recorded_at: new Date().toISOString()
    });

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function getSubscriptionData(supabaseClient: any, vendorId: string, metricType?: string) {
  // Get the latest subscription-ready data
  const { data: widgets, error: widgetError } = await supabaseClient
    .from('vendor_dashboard_widgets')
    .select('*')
    .eq('vendor_id', vendorId)
    .eq('is_active', true)
    .order('display_order');

  if (widgetError) throw widgetError;

  // Get live sales metrics
  const { data: salesMetrics, error: salesError } = await supabaseClient
    .from('live_sales_metrics')
    .select('*')
    .eq('vendor_id', vendorId)
    .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('recorded_at', { ascending: false })
    .limit(50);

  if (salesError) throw salesError;

  return new Response(
    JSON.stringify({
      success: true,
      widgets: widgets || [],
      liveMetrics: salesMetrics || []
    }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

function aggregateMetrics(metrics: any[], timeframe: string) {
  if (!metrics || metrics.length === 0) return {};
  
  const aggregated: Record<string, any> = {};
  
  metrics.forEach(metric => {
    const key = metric.metric_key;
    if (!aggregated[key]) {
      aggregated[key] = {
        type: metric.metric_type,
        values: [],
        latest: metric.metric_value,
        timestamp: metric.recorded_at
      };
    }
    aggregated[key].values.push({
      value: metric.metric_value,
      timestamp: metric.recorded_at
    });
  });

  return aggregated;
}