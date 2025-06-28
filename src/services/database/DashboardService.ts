
import { supabase } from '@/integrations/supabase/client';

export interface DashboardKPIMetric {
  id?: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  metric_category: string;
  time_period: string;
  comparison_value?: number;
  percentage_change?: number;
  trend_direction?: 'up' | 'down' | 'stable';
  recorded_date: string;
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
  cpu_usage?: number;
  memory_usage_mb?: number;
  disk_usage?: number;
  uptime_seconds?: number;
  error_count?: number;
  last_check: string;
  error_details?: any;
  alerts_triggered?: any[];
  metadata?: any;
  created_at?: string;
}

export interface SecurityEvent {
  id?: string;
  event_type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'data_breach_attempt' | 'unauthorized_access' | 'password_reset';
  severity_level: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  ip_address?: string;
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
  report_type: string;
  executive_summary: string;
  report_period_start: string;
  report_period_end: string;
  key_metrics: any;
  charts_data?: any;
  recommendations?: any[];
  status?: 'draft' | 'reviewed' | 'approved' | 'published';
  created_by: string;
  reviewed_by?: string;
  approved_by?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuickAction {
  id?: string;
  action_name: string;
  action_type: string;
  execution_status?: 'pending' | 'running' | 'completed' | 'failed';
  progress_percentage?: number;
  parameters?: any;
  result_data?: any;
  executed_by: string;
  started_at?: string;
  completed_at?: string;
  execution_time_ms?: number;
  error_message?: string;
  created_at?: string;
}

export class DashboardService {
  // KPI Metrics Management
  static async getKPIMetrics(filters?: {
    metric_category?: string;
    time_period?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }): Promise<DashboardKPIMetric[]> {
    let query = supabase
      .from('dashboard_kpi_metrics')
      .select('*')
      .order('recorded_date', { ascending: false });

    if (filters?.metric_category) {
      query = query.eq('metric_category', filters.metric_category);
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
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      trend_direction: item.trend_direction as 'up' | 'down' | 'stable'
    })) as DashboardKPIMetric[];
  }

  static async createKPIMetric(metric: DashboardKPIMetric): Promise<DashboardKPIMetric> {
    const { data, error } = await supabase
      .from('dashboard_kpi_metrics')
      .insert(metric)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      trend_direction: data.trend_direction as 'up' | 'down' | 'stable'
    } as DashboardKPIMetric;
  }

  static async updateKPIMetric(id: string, updates: Partial<DashboardKPIMetric>): Promise<DashboardKPIMetric> {
    const { data, error } = await supabase
      .from('dashboard_kpi_metrics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      trend_direction: data.trend_direction as 'up' | 'down' | 'stable'
    } as DashboardKPIMetric;
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
    let query = supabase
      .from('system_health_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      service_type: item.service_type as 'database' | 'api' | 'cache' | 'search' | 'payment' | 'notification',
      health_status: item.health_status as 'healthy' | 'warning' | 'critical' | 'down'
    })) as SystemHealthLog[];
  }

  static async createSystemHealthLog(log: SystemHealthLog): Promise<SystemHealthLog> {
    const { data, error } = await supabase
      .from('system_health_logs')
      .insert(log)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      service_type: data.service_type as 'database' | 'api' | 'cache' | 'search' | 'payment' | 'notification',
      health_status: data.health_status as 'healthy' | 'warning' | 'critical' | 'down'
    } as SystemHealthLog;
  }

  // Security Events
  static async getSecurityEvents(filters?: {
    event_type?: string;
    severity_level?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }): Promise<SecurityEvent[]> {
    let query = supabase
      .from('security_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.event_type) {
      query = query.eq('event_type', filters.event_type);
    }
    if (filters?.severity_level) {
      query = query.eq('severity_level', filters.severity_level);
    }
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      event_type: item.event_type as 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'data_breach_attempt' | 'unauthorized_access' | 'password_reset',
      severity_level: item.severity_level as 'low' | 'medium' | 'high' | 'critical',
      resolution_status: item.resolution_status as 'open' | 'investigating' | 'resolved' | 'false_positive'
    })) as SecurityEvent[];
  }

  static async createSecurityEvent(event: SecurityEvent): Promise<SecurityEvent> {
    const { data, error } = await supabase
      .from('security_events')
      .insert({
        ...event,
        ip_address: event.ip_address || null
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      event_type: data.event_type as 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'data_breach_attempt' | 'unauthorized_access' | 'password_reset',
      severity_level: data.severity_level as 'low' | 'medium' | 'high' | 'critical',
      resolution_status: data.resolution_status as 'open' | 'investigating' | 'resolved' | 'false_positive'
    } as SecurityEvent;
  }

  // Executive Reports
  static async getExecutiveReports(filters?: {
    report_type?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }): Promise<ExecutiveReport[]> {
    let query = supabase
      .from('executive_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.report_type) {
      query = query.eq('report_type', filters.report_type);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      recommendations: Array.isArray(item.recommendations) ? item.recommendations : [],
      status: item.status as 'draft' | 'reviewed' | 'approved' | 'published'
    })) as ExecutiveReport[];
  }

  static async createExecutiveReport(report: ExecutiveReport): Promise<ExecutiveReport> {
    const { data, error } = await supabase
      .from('executive_reports')
      .insert(report)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
      status: data.status as 'draft' | 'reviewed' | 'approved' | 'published'
    } as ExecutiveReport;
  }

  // Quick Actions
  static async getQuickActions(limit?: number): Promise<QuickAction[]> {
    let query = supabase
      .from('quick_actions_log')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      execution_status: item.execution_status as 'pending' | 'running' | 'completed' | 'failed'
    })) as QuickAction[];
  }

  static async createQuickAction(action: QuickAction): Promise<QuickAction> {
    const { data, error } = await supabase
      .from('quick_actions_log')
      .insert(action)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      execution_status: data.execution_status as 'pending' | 'running' | 'completed' | 'failed'
    } as QuickAction;
  }

  static async updateQuickAction(id: string, updates: Partial<QuickAction>): Promise<QuickAction> {
    const { data, error } = await supabase
      .from('quick_actions_log')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      execution_status: data.execution_status as 'pending' | 'running' | 'completed' | 'failed'
    } as QuickAction;
  }

  // Real-time Analytics
  static async getRealTimeAnalytics(filters?: any): Promise<any> {
    const { data, error } = await supabase
      .from('realtime_analytics')
      .select('*')
      .order('timestamp_recorded', { ascending: false })
      .limit(filters?.limit || 100);

    if (error) throw error;
    return data || [];
  }

  // Performance Metrics
  static async getPerformanceMetrics(filters?: any): Promise<any> {
    const { data, error } = await supabase
      .from('performance_metrics')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(filters?.limit || 100);

    if (error) throw error;
    return data || [];
  }
}
