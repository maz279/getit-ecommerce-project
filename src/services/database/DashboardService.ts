
import { supabase } from '@/lib/supabase';
import type { DashboardKPIMetric, SystemHealthLog, SecurityEvent, ExecutiveReport, QuickAction, QuickActionLog } from '@/types/dashboard';

// Export the types for use in other components
export type { DashboardKPIMetric, SystemHealthLog, SecurityEvent, ExecutiveReport, QuickAction, QuickActionLog };

export const DashboardService = {
  // KPI Metrics
  async getKPIMetrics(filters?: any): Promise<DashboardKPIMetric[]> {
    let query = supabase
      .from('dashboard_kpi_metrics')
      .select('*')
      .order('recorded_date', { ascending: false });

    if (filters?.category) {
      query = query.eq('metric_category', filters.category);
    }
    if (filters?.timeRange) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(filters.timeRange));
      query = query.gte('recorded_date', startDate.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createKPIMetric(metric: Omit<DashboardKPIMetric, 'id' | 'created_at' | 'updated_at'>): Promise<DashboardKPIMetric> {
    const { data, error } = await supabase
      .from('dashboard_kpi_metrics')
      .insert(metric)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateKPIMetric(id: string, updates: Partial<DashboardKPIMetric>): Promise<DashboardKPIMetric> {
    const { data, error } = await supabase
      .from('dashboard_kpi_metrics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteKPIMetric(id: string): Promise<void> {
    const { error } = await supabase
      .from('dashboard_kpi_metrics')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // System Health
  async getSystemHealthLogs(filters?: any): Promise<SystemHealthLog[]> {
    let query = supabase
      .from('system_health_logs')
      .select('*')
      .order('recorded_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(log => ({
      ...log,
      health_status: log.status,
      service_type: log.service_name,
      success_rate: log.cpu_usage_percent ? (100 - log.cpu_usage_percent) : 95,
      cpu_usage: log.cpu_usage_percent,
      memory_usage: log.memory_usage_percent,
      last_check: log.recorded_at,
      uptime_seconds: 86400,
      error_count: log.error_message ? 1 : 0
    })) as SystemHealthLog[];
  },

  async createSystemHealthLog(log: Omit<SystemHealthLog, 'id' | 'created_at'>): Promise<SystemHealthLog> {
    const { data, error } = await supabase
      .from('system_health_logs')
      .insert(log)
      .select()
      .single();
    
    if (error) throw error;
    return data as SystemHealthLog;
  },

  // Security Events
  async getSecurityEvents(filters?: any): Promise<SecurityEvent[]> {
    let query = supabase
      .from('security_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.severity) {
      query = query.eq('severity', filters.severity);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createSecurityEvent(event: Omit<SecurityEvent, 'id' | 'created_at'>): Promise<SecurityEvent> {
    const { data, error } = await supabase
      .from('security_events')
      .insert(event)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Executive Reports
  async getExecutiveReports(filters?: any): Promise<ExecutiveReport[]> {
    let query = supabase
      .from('executive_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(report => ({
      ...report,
      key_metrics: typeof report.key_metrics === 'string' ? JSON.parse(report.key_metrics) : report.key_metrics,
      charts_data: typeof report.charts_data === 'string' ? JSON.parse(report.charts_data) : report.charts_data,
      recommendations: Array.isArray(report.recommendations) ? report.recommendations : 
                     typeof report.recommendations === 'string' ? JSON.parse(report.recommendations) : []
    })) as ExecutiveReport[];
  },

  async createExecutiveReport(report: Omit<ExecutiveReport, 'id' | 'created_at' | 'updated_at'>): Promise<ExecutiveReport> {
    const { data, error } = await supabase
      .from('executive_reports')
      .insert(report)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      key_metrics: typeof data.key_metrics === 'string' ? JSON.parse(data.key_metrics) : data.key_metrics,
      charts_data: typeof data.charts_data === 'string' ? JSON.parse(data.charts_data) : data.charts_data,
      recommendations: Array.isArray(data.recommendations) ? data.recommendations : 
                     typeof data.recommendations === 'string' ? JSON.parse(data.recommendations) : []
    } as ExecutiveReport;
  },

  // Quick Actions
  async getQuickActions(): Promise<QuickAction[]> {
    const { data, error } = await supabase
      .from('quick_actions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data || []).map(action => ({
      ...action,
      permissions_required: Array.isArray(action.permissions_required) ? action.permissions_required :
                          typeof action.permissions_required === 'string' ? JSON.parse(action.permissions_required) : []
    })) as QuickAction[];
  },

  async getQuickActionLogs(limit?: number): Promise<QuickActionLog[]> {
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
  },

  async createQuickAction(action: Omit<QuickAction, 'id' | 'created_at' | 'updated_at'>): Promise<QuickAction> {
    const { data, error } = await supabase
      .from('quick_actions')
      .insert(action)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      permissions_required: Array.isArray(data.permissions_required) ? data.permissions_required :
                          typeof data.permissions_required === 'string' ? JSON.parse(data.permissions_required) : []
    } as QuickAction;
  },

  async updateQuickAction(id: string, updates: Partial<QuickAction>): Promise<QuickAction> {
    const { data, error } = await supabase
      .from('quick_actions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      permissions_required: Array.isArray(data.permissions_required) ? data.permissions_required :
                          typeof data.permissions_required === 'string' ? JSON.parse(data.permissions_required) : []
    } as QuickAction;
  },

  async logQuickAction(actionLog: Omit<QuickActionLog, 'id' | 'created_at'>): Promise<QuickActionLog> {
    const { data, error } = await supabase
      .from('quick_actions_log')
      .insert(actionLog)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Real-time Analytics
  async getRealTimeAnalytics(): Promise<any> {
    const { data, error } = await supabase
      .from('realtime_analytics')
      .select('*')
      .order('timestamp_recorded', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || {};
  },

  // Performance Metrics
  async getPerformanceMetrics(): Promise<any> {
    const { data, error } = await supabase
      .from('performance_metrics')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || {};
  },

  // Dashboard Search
  async searchDashboardData(searchTerm: string): Promise<any[]> {
    const promises = [
      this.getKPIMetrics({ search: searchTerm }),
      this.getSystemHealthLogs({ search: searchTerm }),
      this.getSecurityEvents({ search: searchTerm })
    ];

    try {
      const results = await Promise.allSettled(promises);
      const searchResults = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => (result as PromiseFulfilledResult<any[]>).value || []);

      return searchResults;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }
};
