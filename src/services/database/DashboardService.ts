
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

// Type definitions with strict literal types
export interface DashboardKPIMetric {
  id: string;
  metric_name: string;
  metric_category: 'revenue' | 'users' | 'orders' | 'performance' | 'security' | 'inventory';
  metric_value: number;
  metric_unit?: string;
  comparison_value?: number;
  percentage_change?: number;
  trend_direction?: 'up' | 'down' | 'stable';
  time_period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  recorded_date: string;
  metadata?: Json;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SystemHealthLog {
  id: string;
  service_name: string;
  service_type: 'database' | 'api' | 'cache' | 'search' | 'payment' | 'notification';
  health_status: 'healthy' | 'warning' | 'critical' | 'down';
  response_time_ms?: number;
  error_count: number;
  success_rate?: number;
  cpu_usage?: number;
  memory_usage?: number;
  disk_usage?: number;
  uptime_seconds?: number;
  last_check: string;
  error_details?: Json;
  alerts_triggered?: Json;
  created_at: string;
}

export interface SecurityEvent {
  id: string;
  event_type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'data_breach_attempt' | 'unauthorized_access' | 'password_reset';
  severity_level: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  ip_address: string;
  user_agent?: string;
  location_data?: Json;
  event_details: Json;
  is_blocked: boolean;
  resolution_status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

export interface ExecutiveReport {
  id: string;
  report_title: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom';
  report_period_start: string;
  report_period_end: string;
  key_metrics: Json;
  executive_summary: string;
  recommendations?: Json;
  charts_data?: Json;
  status: 'draft' | 'review' | 'approved' | 'published';
  created_by: string;
  reviewed_by?: string;
  approved_by?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface QuickAction {
  id: string;
  action_type: 'bulk_update' | 'data_export' | 'system_maintenance' | 'user_management' | 'order_processing' | 'inventory_sync';
  action_name: string;
  parameters?: Json;
  execution_status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress_percentage: number;
  result_data?: Json;
  error_message?: string;
  execution_time_ms?: number;
  executed_by: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface RealTimeAnalytics {
  id: string;
  metric_type: 'page_views' | 'active_users' | 'transactions' | 'api_calls' | 'errors' | 'conversions';
  metric_value: number;
  dimensions?: Json;
  timestamp_recorded: string;
  session_id?: string;
  user_id?: string;
  page_url?: string;
  referrer?: string;
  device_info?: Json;
  geographic_data?: Json;
  created_at: string;
}

export interface PerformanceMetrics {
  id: string;
  metric_category: 'api_performance' | 'database_performance' | 'frontend_performance' | 'search_performance' | 'cache_performance';
  endpoint_path?: string;
  method_type?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  response_time_ms: number;
  status_code?: number;
  error_count: number;
  success_count: number;
  throughput_per_second?: number;
  memory_usage_mb?: number;
  cpu_usage_percent?: number;
  cache_hit_rate?: number;
  recorded_at: string;
  metadata?: Json;
  created_at: string;
}

// Helper function to safely cast enum values
function validateEnumValue<T extends string>(value: string, validValues: readonly T[]): T {
  return validValues.includes(value as T) ? (value as T) : validValues[0];
}

// Helper function to transform database row to typed interface
function transformKPIMetric(row: any): DashboardKPIMetric {
  return {
    ...row,
    metric_category: validateEnumValue(row.metric_category, ['revenue', 'users', 'orders', 'performance', 'security', 'inventory'] as const),
    trend_direction: validateEnumValue(row.trend_direction || 'stable', ['up', 'down', 'stable'] as const),
    time_period: validateEnumValue(row.time_period, ['hourly', 'daily', 'weekly', 'monthly', 'yearly'] as const)
  };
}

function transformSystemHealthLog(row: any): SystemHealthLog {
  return {
    ...row,
    service_type: validateEnumValue(row.service_type, ['database', 'api', 'cache', 'search', 'payment', 'notification'] as const),
    health_status: validateEnumValue(row.health_status, ['healthy', 'warning', 'critical', 'down'] as const)
  };
}

function transformSecurityEvent(row: any): SecurityEvent {
  return {
    ...row,
    event_type: validateEnumValue(row.event_type, ['login_attempt', 'failed_login', 'suspicious_activity', 'data_breach_attempt', 'unauthorized_access', 'password_reset'] as const),
    severity_level: validateEnumValue(row.severity_level, ['low', 'medium', 'high', 'critical'] as const),
    resolution_status: validateEnumValue(row.resolution_status, ['open', 'investigating', 'resolved', 'false_positive'] as const)
  };
}

function transformExecutiveReport(row: any): ExecutiveReport {
  return {
    ...row,
    report_type: validateEnumValue(row.report_type, ['daily', 'weekly', 'monthly', 'quarterly', 'annual', 'custom'] as const),
    status: validateEnumValue(row.status, ['draft', 'review', 'approved', 'published'] as const)
  };
}

function transformQuickAction(row: any): QuickAction {
  return {
    ...row,
    action_type: validateEnumValue(row.action_type, ['bulk_update', 'data_export', 'system_maintenance', 'user_management', 'order_processing', 'inventory_sync'] as const),
    execution_status: validateEnumValue(row.execution_status, ['pending', 'running', 'completed', 'failed', 'cancelled'] as const)
  };
}

function transformRealTimeAnalytics(row: any): RealTimeAnalytics {
  return {
    ...row,
    metric_type: validateEnumValue(row.metric_type, ['page_views', 'active_users', 'transactions', 'api_calls', 'errors', 'conversions'] as const)
  };
}

function transformPerformanceMetrics(row: any): PerformanceMetrics {
  return {
    ...row,
    metric_category: validateEnumValue(row.metric_category, ['api_performance', 'database_performance', 'frontend_performance', 'search_performance', 'cache_performance'] as const),
    method_type: row.method_type ? validateEnumValue(row.method_type, ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const) : undefined
  };
}

export class DashboardService {
  // KPI Metrics operations
  static async getKPIMetrics(filters?: any): Promise<DashboardKPIMetric[]> {
    let query = supabase.from('dashboard_kpi_metrics').select('*');
    
    if (filters?.category) {
      query = query.eq('metric_category', filters.category);
    }
    
    if (filters?.timeRange) {
      const { from, to } = filters.timeRange;
      query = query.gte('recorded_date', from).lte('recorded_date', to);
    }

    const { data, error } = await query.order('recorded_date', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(transformKPIMetric);
  }

  static async createKPIMetric(metric: Omit<DashboardKPIMetric, 'id' | 'created_at' | 'updated_at'>): Promise<DashboardKPIMetric> {
    const { data, error } = await supabase
      .from('dashboard_kpi_metrics')
      .insert(metric)
      .select()
      .single();
    
    if (error) throw error;
    return transformKPIMetric(data);
  }

  static async updateKPIMetric(id: string, updates: Partial<DashboardKPIMetric>): Promise<DashboardKPIMetric> {
    const { data, error } = await supabase
      .from('dashboard_kpi_metrics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return transformKPIMetric(data);
  }

  static async deleteKPIMetric(id: string): Promise<void> {
    const { error } = await supabase
      .from('dashboard_kpi_metrics')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // System Health operations
  static async getSystemHealthLogs(limit = 50): Promise<SystemHealthLog[]> {
    const { data, error } = await supabase
      .from('system_health_logs')
      .select('*')
      .order('last_check', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data || []).map(transformSystemHealthLog);
  }

  static async createSystemHealthLog(log: Omit<SystemHealthLog, 'id' | 'created_at'>): Promise<SystemHealthLog> {
    const { data, error } = await supabase
      .from('system_health_logs')
      .insert(log)
      .select()
      .single();
    
    if (error) throw error;
    return transformSystemHealthLog(data);
  }

  // Security Events operations
  static async getSecurityEvents(filters?: any): Promise<SecurityEvent[]> {
    let query = supabase.from('security_events').select('*');
    
    if (filters?.severity) {
      query = query.eq('severity_level', filters.severity);
    }
    
    if (filters?.eventType) {
      query = query.eq('event_type', filters.eventType);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(transformSecurityEvent);
  }

  static async createSecurityEvent(event: Omit<SecurityEvent, 'id' | 'created_at'>): Promise<SecurityEvent> {
    const { data, error } = await supabase
      .from('security_events')
      .insert(event)
      .select()
      .single();
    
    if (error) throw error;
    return transformSecurityEvent(data);
  }

  // Executive Reports operations
  static async getExecutiveReports(filters?: any): Promise<ExecutiveReport[]> {
    let query = supabase.from('executive_reports').select('*');
    
    if (filters?.reportType) {
      query = query.eq('report_type', filters.reportType);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(transformExecutiveReport);
  }

  static async createExecutiveReport(report: Omit<ExecutiveReport, 'id' | 'created_at' | 'updated_at'>): Promise<ExecutiveReport> {
    const { data, error } = await supabase
      .from('executive_reports')
      .insert(report)
      .select()
      .single();
    
    if (error) throw error;
    return transformExecutiveReport(data);
  }

  // Quick Actions operations
  static async getQuickActions(limit = 20): Promise<QuickAction[]> {
    const { data, error } = await supabase
      .from('quick_actions_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data || []).map(transformQuickAction);
  }

  static async createQuickAction(action: Omit<QuickAction, 'id' | 'created_at'>): Promise<QuickAction> {
    const { data, error } = await supabase
      .from('quick_actions_log')
      .insert(action)
      .select()
      .single();
    
    if (error) throw error;
    return transformQuickAction(data);
  }

  static async updateQuickAction(id: string, updates: Partial<QuickAction>): Promise<QuickAction> {
    const { data, error } = await supabase
      .from('quick_actions_log')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return transformQuickAction(data);
  }

  // Real-time Analytics operations
  static async getRealTimeAnalytics(filters?: any): Promise<RealTimeAnalytics[]> {
    let query = supabase.from('realtime_analytics').select('*');
    
    if (filters?.metricType) {
      query = query.eq('metric_type', filters.metricType);
    }
    
    if (filters?.timeRange) {
      const { from, to } = filters.timeRange;
      query = query.gte('timestamp_recorded', from).lte('timestamp_recorded', to);
    }

    const { data, error } = await query.order('timestamp_recorded', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(transformRealTimeAnalytics);
  }

  // Performance Metrics operations
  static async getPerformanceMetrics(filters?: any): Promise<PerformanceMetrics[]> {
    let query = supabase.from('performance_metrics').select('*');
    
    if (filters?.category) {
      query = query.eq('metric_category', filters.category);
    }
    
    if (filters?.timeRange) {
      const { from, to } = filters.timeRange;
      query = query.gte('recorded_at', from).lte('recorded_at', to);
    }

    const { data, error } = await query.order('recorded_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(transformPerformanceMetrics);
  }
}
