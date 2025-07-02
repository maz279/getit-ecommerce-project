import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface PerformanceMetric {
  metric_category: string;
  metric_name: string;
  metric_value: number;
  measurement_unit: string;
  resource_identifier?: string;
  user_id?: string;
  session_id?: string;
  device_type?: string;
  connection_type?: string;
  additional_metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...data } = await req.json();

    switch (action) {
      case 'log_metric':
        return await logPerformanceMetric(data);
      
      case 'get_metrics':
        return await getPerformanceMetrics(data);
      
      case 'get_dashboard':
        return await getPerformanceDashboard(data);
      
      case 'analyze_performance':
        return await analyzePerformance(data);
      
      case 'set_alerts':
        return await setPerformanceAlerts(data);
      
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Performance Monitoring Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function logPerformanceMetric(metricData: PerformanceMetric) {
  // Enrich metric with performance grading
  const performanceGrade = calculatePerformanceGrade(
    metricData.metric_category,
    metricData.metric_value,
    metricData.measurement_unit
  );
  
  const isSlowPerformance = isSlowPerformanceThreshold(
    metricData.metric_category,
    metricData.metric_value
  );
  
  // Store metric
  const { data, error } = await supabase
    .from('enhanced_performance_metrics')
    .insert({
      ...metricData,
      performance_grade: performanceGrade,
      is_slow_performance: isSlowPerformance,
      geographic_region: await getGeographicRegion(metricData.additional_metadata?.ip_address),
      timestamp: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;

  // Check if alert thresholds are exceeded
  if (isSlowPerformance) {
    await createPerformanceAlert(metricData, performanceGrade);
  }

  // Update real-time analytics
  await updateRealTimeMetrics(metricData);

  return new Response(JSON.stringify({ 
    success: true, 
    metric_id: data.id,
    performance_grade: performanceGrade
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getPerformanceMetrics(params: any) {
  const {
    category,
    time_range = '1h',
    aggregation = 'avg',
    user_id,
    resource_identifier
  } = params;

  // Calculate time range
  const endTime = new Date();
  const startTime = new Date();
  
  switch (time_range) {
    case '5m': startTime.setMinutes(endTime.getMinutes() - 5); break;
    case '1h': startTime.setHours(endTime.getHours() - 1); break;
    case '24h': startTime.setHours(endTime.getHours() - 24); break;
    case '7d': startTime.setDate(endTime.getDate() - 7); break;
    default: startTime.setHours(endTime.getHours() - 1);
  }

  // Build query
  let query = supabase
    .from('enhanced_performance_metrics')
    .select('*')
    .gte('timestamp', startTime.toISOString())
    .lte('timestamp', endTime.toISOString());

  if (category) query = query.eq('metric_category', category);
  if (user_id) query = query.eq('user_id', user_id);
  if (resource_identifier) query = query.eq('resource_identifier', resource_identifier);

  const { data: metrics, error } = await query.order('timestamp', { ascending: false });

  if (error) throw error;

  // Aggregate metrics
  const aggregatedData = aggregateMetrics(metrics || [], aggregation);
  
  // Calculate performance insights
  const insights = calculatePerformanceInsights(metrics || []);

  return new Response(JSON.stringify({
    success: true,
    metrics: aggregatedData,
    insights,
    total_samples: metrics?.length || 0
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getPerformanceDashboard(params: any) {
  const { time_range = '24h' } = params;
  
  // Get overall performance summary
  const [
    pageLoadMetrics,
    apiResponseMetrics,
    databaseMetrics,
    cacheMetrics
  ] = await Promise.all([
    getMetricsSummary('page_load', time_range),
    getMetricsSummary('api_response', time_range),
    getMetricsSummary('db_query', time_range),
    getMetricsSummary('cache_hit', time_range)
  ]);

  // Get performance trends
  const trends = await getPerformanceTrends(time_range);
  
  // Get slow performance incidents
  const slowIncidents = await getSlowPerformanceIncidents(time_range);
  
  // Get device/connection performance breakdown
  const deviceBreakdown = await getDevicePerformanceBreakdown(time_range);

  return new Response(JSON.stringify({
    success: true,
    dashboard: {
      overview: {
        page_load: pageLoadMetrics,
        api_response: apiResponseMetrics,
        database: databaseMetrics,
        cache: cacheMetrics
      },
      trends,
      slow_incidents: slowIncidents,
      device_breakdown: deviceBreakdown,
      last_updated: new Date().toISOString()
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function analyzePerformance(params: any) {
  const { resource_identifier, analysis_type = 'comprehensive' } = params;
  
  // Get historical data for the resource
  const { data: metrics, error } = await supabase
    .from('enhanced_performance_metrics')
    .select('*')
    .eq('resource_identifier', resource_identifier)
    .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('timestamp', { ascending: true });

  if (error) throw error;

  const analysis = {
    resource_identifier,
    analysis_type,
    performance_score: calculateOverallPerformanceScore(metrics || []),
    trends: analyzeTrends(metrics || []),
    anomalies: detectAnomalies(metrics || []),
    recommendations: generateRecommendations(metrics || []),
    comparative_analysis: await getComparativeAnalysis(resource_identifier, metrics || [])
  };

  return new Response(JSON.stringify({ success: true, analysis }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function setPerformanceAlerts(alertConfig: any) {
  const { metric_category, metric_name, threshold_value, condition, notification_channels } = alertConfig;
  
  // Store alert configuration
  const { data, error } = await supabase
    .from('performance_alerts_config')
    .upsert({
      metric_category,
      metric_name,
      threshold_value,
      condition,
      notification_channels,
      is_active: true,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(JSON.stringify({ 
    success: true, 
    alert_id: data.id,
    message: 'Performance alert configured successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Helper functions
function calculatePerformanceGrade(category: string, value: number, unit: string): string {
  const thresholds = {
    page_load: { excellent: 1000, good: 2500, poor: 5000 }, // ms
    api_response: { excellent: 200, good: 500, poor: 1000 }, // ms
    db_query: { excellent: 50, good: 200, poor: 500 }, // ms
    cache_hit: { excellent: 95, good: 85, poor: 70 } // percentage
  };

  const categoryThresholds = thresholds[category as keyof typeof thresholds];
  if (!categoryThresholds) return 'unknown';

  if (category === 'cache_hit') {
    // Higher is better for cache hit rate
    if (value >= categoryThresholds.excellent) return 'excellent';
    if (value >= categoryThresholds.good) return 'good';
    if (value >= categoryThresholds.poor) return 'poor';
    return 'critical';
  } else {
    // Lower is better for response times
    if (value <= categoryThresholds.excellent) return 'excellent';
    if (value <= categoryThresholds.good) return 'good';
    if (value <= categoryThresholds.poor) return 'poor';
    return 'critical';
  }
}

function isSlowPerformanceThreshold(category: string, value: number): boolean {
  const slowThresholds = {
    page_load: 3000, // ms
    api_response: 1000, // ms
    db_query: 500, // ms
    cache_hit: 70 // percentage (below this is slow)
  };

  const threshold = slowThresholds[category as keyof typeof slowThresholds];
  if (!threshold) return false;

  return category === 'cache_hit' ? value < threshold : value > threshold;
}

async function createPerformanceAlert(metric: PerformanceMetric, grade: string) {
  await supabase.from('performance_alerts').insert({
    alert_type: 'slow_performance',
    severity: grade === 'critical' ? 'critical' : 'warning',
    metric_category: metric.metric_category,
    metric_name: metric.metric_name,
    metric_value: metric.metric_value,
    resource_identifier: metric.resource_identifier,
    user_id: metric.user_id,
    description: `${metric.metric_category} performance degraded: ${metric.metric_value}${metric.measurement_unit}`,
    alert_data: {
      performance_grade: grade,
      session_id: metric.session_id,
      device_type: metric.device_type
    }
  });
}

async function updateRealTimeMetrics(metric: PerformanceMetric) {
  await supabase.from('real_time_metrics').upsert({
    vendor_id: metric.user_id,
    metric_type: 'performance',
    metric_key: `${metric.metric_category}_${metric.metric_name}`,
    metric_value: {
      value: metric.metric_value,
      unit: metric.measurement_unit,
      timestamp: new Date().toISOString()
    }
  });
}

async function getGeographicRegion(ipAddress?: string): Promise<string> {
  // In production, integrate with IP geolocation service
  return 'unknown';
}

function aggregateMetrics(metrics: any[], aggregation: string) {
  if (metrics.length === 0) return [];

  const grouped = groupBy(metrics, (m) => {
    const date = new Date(m.timestamp);
    // Group by 5-minute intervals
    const interval = Math.floor(date.getTime() / (5 * 60 * 1000)) * (5 * 60 * 1000);
    return new Date(interval).toISOString();
  });

  return Object.entries(grouped).map(([timestamp, groupMetrics]) => {
    const values = groupMetrics.map((m: any) => m.metric_value);
    
    let aggregatedValue: number;
    switch (aggregation) {
      case 'avg':
        aggregatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
      case 'max':
        aggregatedValue = Math.max(...values);
        break;
      case 'min':
        aggregatedValue = Math.min(...values);
        break;
      case 'p95':
        aggregatedValue = percentile(values, 95);
        break;
      default:
        aggregatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
    }

    return {
      timestamp,
      value: aggregatedValue,
      sample_count: values.length
    };
  });
}

function calculatePerformanceInsights(metrics: any[]) {
  if (metrics.length === 0) return {};

  const values = metrics.map(m => m.metric_value);
  const grades = metrics.map(m => m.performance_grade);
  
  return {
    average: values.reduce((sum, val) => sum + val, 0) / values.length,
    median: percentile(values, 50),
    p95: percentile(values, 95),
    p99: percentile(values, 99),
    grade_distribution: {
      excellent: grades.filter(g => g === 'excellent').length,
      good: grades.filter(g => g === 'good').length,
      poor: grades.filter(g => g === 'poor').length,
      critical: grades.filter(g => g === 'critical').length
    },
    slow_performance_rate: metrics.filter(m => m.is_slow_performance).length / metrics.length
  };
}

async function getMetricsSummary(category: string, timeRange: string) {
  const endTime = new Date();
  const startTime = new Date();
  
  switch (timeRange) {
    case '1h': startTime.setHours(endTime.getHours() - 1); break;
    case '24h': startTime.setHours(endTime.getHours() - 24); break;
    case '7d': startTime.setDate(endTime.getDate() - 7); break;
    default: startTime.setHours(endTime.getHours() - 24);
  }

  const { data: metrics, error } = await supabase
    .from('enhanced_performance_metrics')
    .select('metric_value, performance_grade, is_slow_performance')
    .eq('metric_category', category)
    .gte('timestamp', startTime.toISOString())
    .lte('timestamp', endTime.toISOString());

  if (error || !metrics) return null;

  const values = metrics.map(m => m.metric_value);
  
  return {
    total_samples: metrics.length,
    average: values.reduce((sum, val) => sum + val, 0) / values.length,
    p95: percentile(values, 95),
    slow_performance_rate: metrics.filter(m => m.is_slow_performance).length / metrics.length,
    grade_distribution: {
      excellent: metrics.filter(m => m.performance_grade === 'excellent').length,
      good: metrics.filter(m => m.performance_grade === 'good').length,
      poor: metrics.filter(m => m.performance_grade === 'poor').length,
      critical: metrics.filter(m => m.performance_grade === 'critical').length
    }
  };
}

// Utility functions
function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  
  if (lower === upper) return sorted[lower];
  
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

async function getPerformanceTrends(timeRange: string) {
  // Implementation for performance trends analysis
  return [];
}

async function getSlowPerformanceIncidents(timeRange: string) {
  // Implementation for slow performance incidents
  return [];
}

async function getDevicePerformanceBreakdown(timeRange: string) {
  // Implementation for device performance breakdown
  return {};
}

function calculateOverallPerformanceScore(metrics: any[]): number {
  // Implementation for overall performance score calculation
  return 85;
}

function analyzeTrends(metrics: any[]) {
  // Implementation for trend analysis
  return {};
}

function detectAnomalies(metrics: any[]) {
  // Implementation for anomaly detection
  return [];
}

function generateRecommendations(metrics: any[]) {
  // Implementation for performance recommendations
  return [];
}

async function getComparativeAnalysis(resourceId: string, metrics: any[]) {
  // Implementation for comparative analysis
  return {};
}