
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export interface DashboardKPIMetric {
  id?: string;
  metric_name: string;
  metric_value: number;
  metric_category: string;
  time_period: string;
  comparison_value?: number;
  percentage_change?: number;
  trend_direction?: 'up' | 'down' | 'stable';
  metric_unit?: string;
  metadata?: any;
  created_by?: string;
  recorded_date?: string;
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
  error_details?: any;
  alerts_triggered?: any[];
  metadata?: any;
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
}

export interface ExecutiveReport {
  id?: string;
  report_title: string;
  report_type: string;
  report_period_start: string;
  report_period_end: string;
  executive_summary: string;
  key_metrics: any;
  recommendations?: any[];
  charts_data?: any;
  status?: 'draft' | 'published' | 'archived';
  created_by: string;
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
  execution_time_ms?: number;
  error_message?: string;
  created_at?: string;
}

export class DashboardService {
  // KPI Metrics Management
  static async getKPIMetrics(filters?: any): Promise<DashboardKPIMetric[]> {
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
    if (filters?.date_from) {
      query = query.gte('recorded_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('recorded_date', filters.date_to);
    }

    const { data, error } = await query;
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
    let query = supabase
      .from('system_health_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
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
    if (filters?.resolution_status) {
      query = query.eq('resolution_status', filters.resolution_status);
    }

    const { data, error } = await query;
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
    let query = supabase
      .from('quick_actions_log')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createQuickAction(action: QuickAction): Promise<QuickAction> {
    const { data, error } = await supabase
      .from('quick_actions_log')
      .insert({
        ...action,
        execution_status: action.execution_status || 'pending',
        progress_percentage: action.progress_percentage || 0
      })
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
  static async getRealTimeAnalytics(filters?: any): Promise<any[]> {
    let query = supabase
      .from('realtime_analytics')
      .select('*')
      .order('timestamp_recorded', { ascending: false })
      .limit(100);

    if (filters?.metric_type) {
      query = query.eq('metric_type', filters.metric_type);
    }
    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Performance Metrics
  static async getPerformanceMetrics(filters?: any): Promise<any[]> {
    let query = supabase
      .from('performance_metrics')
      .select('*')
      .order('recorded_at', { ascending: false });

    if (filters?.metric_category) {
      query = query.eq('metric_category', filters.metric_category);
    }
    if (filters?.date_from) {
      query = query.gte('recorded_at', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('recorded_at', filters.date_to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Vendor Management
  static async getVendors(filters?: any): Promise<any[]> {
    let query = supabase
      .from('vendors')
      .select(`
        *,
        vendor_ratings (
          overall_rating,
          total_reviews,
          service_quality,
          delivery_speed,
          communication,
          product_quality
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.search) {
      query = query.ilike('business_name', `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getVendorPerformance(vendorId?: string): Promise<any[]> {
    let query = supabase
      .from('vendor_performance_reports')
      .select('*')
      .order('report_period_end', { ascending: false });

    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Order Analytics  
  static async getOrderAnalytics(filters?: any): Promise<any[]> {
    let query = supabase
      .from('order_analytics')
      .select('*')
      .order('analytics_date', { ascending: false });

    if (filters?.date_from) {
      query = query.gte('analytics_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('analytics_date', filters.date_to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Platform Metrics
  static async getPlatformMetrics(filters?: any): Promise<any[]> {
    let query = supabase
      .from('platform_metrics')
      .select('*')
      .order('metric_date', { ascending: false });

    if (filters?.date_from) {
      query = query.gte('metric_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('metric_date', filters.date_to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Commission Management
  static async getCommissions(filters?: any): Promise<any[]> {
    let query = supabase
      .from('vendor_commissions')
      .select(`
        *,
        vendors (
          business_name,
          email
        ),
        orders (
          order_number,
          total_amount
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.date_from) {
      query = query.gte('transaction_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('transaction_date', filters.date_to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Review Moderation
  static async getReviewModeration(filters?: any): Promise<any[]> {
    let query = supabase
      .from('review_moderation')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.moderation_status) {
      query = query.eq('moderation_status', filters.moderation_status);
    }
    if (filters?.priority_level) {
      query = query.eq('priority_level', filters.priority_level);
    }
    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async updateReviewModerationStatus(
    id: string, 
    status: string, 
    moderatorId: string, 
    notes?: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from('review_moderation')
      .update({
        moderation_status: status,
        moderator_id: moderatorId,
        moderation_notes: notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
