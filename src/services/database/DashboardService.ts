
import { supabase } from '@/integrations/supabase/client';

// Types for dashboard entities
export interface DashboardKPIMetric {
  id?: string;
  metric_name: string;
  metric_category: 'revenue' | 'users' | 'orders' | 'performance' | 'security' | 'inventory';
  metric_value: number;
  metric_unit?: string;
  comparison_value?: number;
  percentage_change?: number;
  trend_direction?: 'up' | 'down' | 'stable';
  time_period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  recorded_date?: string;
  metadata?: any;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SystemHealthLog {
  id?: string;
  service_name: string;
  service_type: 'database' | 'api' | 'cache' | 'search' | 'payment' | 'notification';
  health_status: 'healthy' | 'warning' | 'critical' | 'down';
  response_time_ms?: number;
  error_count?: number;
  success_rate?: number;
  cpu_usage?: number;
  memory_usage?: number;
  disk_usage?: number;
  uptime_seconds?: number;
  last_check?: string;
  error_details?: any;
  alerts_triggered?: any[];
  created_at?: string;
}

export interface SecurityEvent {
  id?: string;
  event_type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'data_breach_attempt' | 'unauthorized_access' | 'password_reset';
  severity_level: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  ip_address: string;
  user_agent?: string;
  location_data?: any;
  event_details: any;
  is_blocked?: boolean;
  resolution_status?: 'open' | 'investigating' | 'resolved' | 'false_positive';
  resolved_by?: string;
  resolved_at?: string;
  created_at?: string;
}

export interface ExecutiveReport {
  id?: string;
  report_title: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom';
  report_period_start: string;
  report_period_end: string;
  key_metrics: any;
  executive_summary: string;
  recommendations?: any[];
  charts_data?: any;
  status?: 'draft' | 'review' | 'approved' | 'published';
  created_by: string; // Required field
  reviewed_by?: string;
  approved_by?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuickAction {
  id?: string;
  action_type: 'bulk_update' | 'data_export' | 'system_maintenance' | 'user_management' | 'order_processing' | 'inventory_sync';
  action_name: string;
  parameters?: any;
  execution_status?: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress_percentage?: number;
  result_data?: any;
  error_message?: string;
  execution_time_ms?: number;
  executed_by: string; // Required field
  started_at?: string;
  completed_at?: string;
  created_at?: string;
}

export interface RealTimeAnalytics {
  id?: string;
  metric_type: 'page_views' | 'active_users' | 'transactions' | 'api_calls' | 'errors' | 'conversions';
  metric_value: number;
  dimensions?: any;
  timestamp_recorded?: string;
  session_id?: string;
  user_id?: string;
  page_url?: string;
  referrer?: string;
  device_info?: any;
  geographic_data?: any;
  created_at?: string;
}

export interface PerformanceMetrics {
  id?: string;
  metric_category: 'api_performance' | 'database_performance' | 'frontend_performance' | 'search_performance' | 'cache_performance';
  endpoint_path?: string;
  method_type?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  response_time_ms: number;
  status_code?: number;
  error_count?: number;
  success_count?: number;
  throughput_per_second?: number;
  memory_usage_mb?: number;
  cpu_usage_percent?: number;
  cache_hit_rate?: number;
  recorded_at?: string;
  metadata?: any;
  created_at?: string;
}

export class DashboardService {
  // KPI Metrics
  static async getKPIMetrics(filters?: any): Promise<DashboardKPIMetric[]> {
    let query = supabase.from('dashboard_kpi_metrics').select('*');
    
    if (filters?.category) {
      query = query.eq('metric_category', filters.category);
    }
    if (filters?.time_period) {
      query = query.eq('time_period', filters.time_period);
    }
    if (filters?.date_from) {
      query = query.gte('recorded_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('recorded_date', filters.date_to);
    }
    
    const { data, error } = await query.order('recorded_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createKPIMetric(metric: DashboardKPIMetric): Promise<DashboardKPIMetric> {
    const { data, error } = await supabase
      .from('dashboard_kpi_metrics')
      .insert(metric)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateKPIMetric(id: string, updates: Partial<DashboardKPIMetric>): Promise<DashboardKPIMetric> {
    const { data, error } = await supabase
      .from('dashboard_kpi_metrics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteKPIMetric(id: string): Promise<void> {
    const { error } = await supabase
      .from('dashboard_kpi_metrics')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // System Health Logs
  static async getSystemHealthLogs(limit?: number): Promise<SystemHealthLog[]> {
    let query = supabase.from('system_health_logs').select('*');
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query.order('last_check', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createSystemHealthLog(log: SystemHealthLog): Promise<SystemHealthLog> {
    const { data, error } = await supabase
      .from('system_health_logs')
      .insert(log)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Security Events
  static async getSecurityEvents(filters?: any): Promise<SecurityEvent[]> {
    let query = supabase.from('security_events').select('*');
    
    if (filters?.event_type) {
      query = query.eq('event_type', filters.event_type);
    }
    if (filters?.severity_level) {
      query = query.eq('severity_level', filters.severity_level);
    }
    if (filters?.resolution_status) {
      query = query.eq('resolution_status', filters.resolution_status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createSecurityEvent(event: SecurityEvent): Promise<SecurityEvent> {
    const { data, error } = await supabase
      .from('security_events')
      .insert(event)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Executive Reports
  static async getExecutiveReports(filters?: any): Promise<ExecutiveReport[]> {
    let query = supabase.from('executive_reports').select('*');
    
    if (filters?.report_type) {
      query = query.eq('report_type', filters.report_type);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createExecutiveReport(report: ExecutiveReport): Promise<ExecutiveReport> {
    const { data, error } = await supabase
      .from('executive_reports')
      .insert(report)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Quick Actions
  static async getQuickActions(limit?: number): Promise<QuickAction[]> {
    let query = supabase.from('quick_actions_log').select('*');
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createQuickAction(action: QuickAction): Promise<QuickAction> {
    const { data, error } = await supabase
      .from('quick_actions_log')
      .insert(action)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateQuickAction(id: string, updates: Partial<QuickAction>): Promise<QuickAction> {
    const { data, error } = await supabase
      .from('quick_actions_log')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Real-time Analytics
  static async getRealTimeAnalytics(filters?: any): Promise<RealTimeAnalytics[]> {
    let query = supabase.from('realtime_analytics').select('*');
    
    if (filters?.metric_type) {
      query = query.eq('metric_type', filters.metric_type);
    }
    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    
    const { data, error } = await query.order('timestamp_recorded', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Performance Metrics
  static async getPerformanceMetrics(filters?: any): Promise<PerformanceMetrics[]> {
    let query = supabase.from('performance_metrics').select('*');
    
    if (filters?.metric_category) {
      query = query.eq('metric_category', filters.metric_category);
    }
    if (filters?.endpoint_path) {
      query = query.eq('endpoint_path', filters.endpoint_path);
    }
    
    const { data, error } = await query.order('recorded_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
}
