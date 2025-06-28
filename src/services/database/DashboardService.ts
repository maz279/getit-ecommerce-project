
import { supabase } from '@/integrations/supabase/client';

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
  error_details?: any;
  alerts_triggered?: any[];
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
}

export class DashboardService {
  static async getKPIMetrics(filters?: {
    category?: string;
    time_period?: string;
    date_range?: { start: string; end: string };
  }) {
    try {
      let query = supabase
        .from('dashboard_kpi_metrics')
        .select('*')
        .order('recorded_date', { ascending: false });

      if (filters?.category) {
        query = query.eq('metric_category', filters.category);
      }

      if (filters?.time_period) {
        query = query.eq('time_period', filters.time_period);
      }

      if (filters?.date_range) {
        query = query
          .gte('recorded_date', filters.date_range.start)
          .lte('recorded_date', filters.date_range.end);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching KPI metrics:', error);
      throw error;
    }
  }

  static async createKPIMetric(metric: DashboardKPIMetric) {
    try {
      const { data, error } = await supabase
        .from('dashboard_kpi_metrics')
        .insert(metric)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating KPI metric:', error);
      throw error;
    }
  }

  static async updateKPIMetric(id: string, updates: Partial<DashboardKPIMetric>) {
    try {
      const { data, error } = await supabase
        .from('dashboard_kpi_metrics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating KPI metric:', error);
      throw error;
    }
  }

  static async deleteKPIMetric(id: string) {
    try {
      const { error } = await supabase
        .from('dashboard_kpi_metrics')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting KPI metric:', error);
      throw error;
    }
  }

  static async getSystemHealthLogs(limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('system_health_logs')
        .select('*')
        .order('last_check', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching system health logs:', error);
      throw error;
    }
  }

  static async createSystemHealthLog(log: SystemHealthLog) {
    try {
      const { data, error } = await supabase
        .from('system_health_logs')
        .insert(log)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating system health log:', error);
      throw error;
    }
  }

  static async getSecurityEvents(filters?: {
    severity?: string;
    event_type?: string;
    date_range?: { start: string; end: string };
  }) {
    try {
      let query = supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.severity) {
        query = query.eq('severity_level', filters.severity);
      }

      if (filters?.event_type) {
        query = query.eq('event_type', filters.event_type);
      }

      if (filters?.date_range) {
        query = query
          .gte('created_at', filters.date_range.start)
          .lte('created_at', filters.date_range.end);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching security events:', error);
      throw error;
    }
  }

  static async createSecurityEvent(event: SecurityEvent) {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .insert(event)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating security event:', error);
      throw error;
    }
  }

  static async getExecutiveReports(filters?: {
    report_type?: string;
    status?: string;
  }) {
    try {
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

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching executive reports:', error);
      throw error;
    }
  }

  static async createExecutiveReport(report: ExecutiveReport) {
    try {
      const { data, error } = await supabase
        .from('executive_reports')
        .insert(report)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating executive report:', error);
      throw error;
    }
  }

  static async getQuickActions(limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('quick_actions_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching quick actions:', error);
      throw error;
    }
  }

  static async createQuickAction(action: QuickAction) {
    try {
      const { data, error } = await supabase
        .from('quick_actions_log')
        .insert(action)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating quick action:', error);
      throw error;
    }
  }

  static async updateQuickAction(id: string, updates: Partial<QuickAction>) {
    try {
      const { data, error } = await supabase
        .from('quick_actions_log')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating quick action:', error);
      throw error;
    }
  }

  static async getRealTimeAnalytics(filters?: {
    metric_type?: string;
    time_range?: { start: string; end: string };
  }) {
    try {
      let query = supabase
        .from('realtime_analytics')
        .select('*')
        .order('timestamp_recorded', { ascending: false })
        .limit(1000);

      if (filters?.metric_type) {
        query = query.eq('metric_type', filters.metric_type);
      }

      if (filters?.time_range) {
        query = query
          .gte('timestamp_recorded', filters.time_range.start)
          .lte('timestamp_recorded', filters.time_range.end);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching real-time analytics:', error);
      throw error;
    }
  }

  static async getPerformanceMetrics(filters?: {
    category?: string;
    endpoint?: string;
    time_range?: { start: string; end: string };
  }) {
    try {
      let query = supabase
        .from('performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(500);

      if (filters?.category) {
        query = query.eq('metric_category', filters.category);
      }

      if (filters?.endpoint) {
        query = query.eq('endpoint_path', filters.endpoint);
      }

      if (filters?.time_range) {
        query = query
          .gte('recorded_at', filters.time_range.start)
          .lte('recorded_at', filters.time_range.end);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw error;
    }
  }
}
