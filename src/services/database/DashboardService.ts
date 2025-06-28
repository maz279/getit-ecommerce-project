
import { supabase } from '@/integrations/supabase/client';
import type { DashboardKPIMetric, SystemHealthLog, SecurityEvent, ExecutiveReport, QuickAction, QuickActionLog } from '@/types/dashboard';

// Single DashboardService class definition
export class DashboardService {
  // KPI Metrics methods
  static async getKPIMetrics(filters?: any): Promise<DashboardKPIMetric[]> {
    const query = supabase
      .from('dashboard_kpi_metrics')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query.eq('metric_category', filters.category);
    }

    if (filters?.timeRange) {
      const timeRangeDate = new Date();
      timeRangeDate.setDate(timeRangeDate.getDate() - parseInt(filters.timeRange));
      query.gte('created_at', timeRangeDate.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(item => ({
      ...item,
      trend_direction: item.trend_direction as 'up' | 'down' | 'stable'
    }));
  }

  static async createKPIMetric(metric: Omit<DashboardKPIMetric, 'id' | 'created_at' | 'updated_at'>): Promise<DashboardKPIMetric> {
    const { data, error } = await supabase
      .from('dashboard_kpi_metrics')
      .insert([metric])
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      trend_direction: data.trend_direction as 'up' | 'down' | 'stable'
    };
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
    };
  }

  static async deleteKPIMetric(id: string): Promise<void> {
    const { error } = await supabase
      .from('dashboard_kpi_metrics')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // System Health methods
  static async getSystemHealthLogs(filters?: any): Promise<SystemHealthLog[]> {
    const query = supabase
      .from('performance_metrics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      service_name: item.endpoint_path || 'Unknown Service',
      status: 'healthy' as const,
      health_status: 'healthy' as const,
      service_type: item.metric_category || 'API',
      response_time_ms: item.response_time_ms,
      cpu_usage_percent: item.cpu_usage_percent,
      cpu_usage: item.cpu_usage_percent,
      memory_usage_percent: item.memory_usage_mb,
      memory_usage: item.memory_usage_mb,
      disk_usage_percent: 0,
      success_rate: item.success_count > 0 ? (item.success_count / (item.success_count + item.error_count)) * 100 : 100,
      last_check: item.recorded_at,
      uptime_seconds: 0,
      error_count: item.error_count,
      error_message: null,
      metadata: item.metadata,
      recorded_at: item.recorded_at,
      created_at: item.created_at
    }));
  }

  static async createSystemHealthLog(log: Omit<SystemHealthLog, 'id' | 'created_at'>): Promise<SystemHealthLog> {
    const performanceData = {
      endpoint_path: log.service_name,
      response_time_ms: log.response_time_ms || 0,
      cpu_usage_percent: log.cpu_usage_percent,
      memory_usage_mb: log.memory_usage_percent,
      error_count: 0,
      success_count: 1,
      metric_category: 'system_health',
      metadata: log.metadata
    };

    const { data, error } = await supabase
      .from('performance_metrics')
      .insert([performanceData])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      service_name: data.endpoint_path,
      status: 'healthy',
      health_status: 'healthy',
      service_type: data.metric_category,
      response_time_ms: data.response_time_ms,
      cpu_usage_percent: data.cpu_usage_percent,
      cpu_usage: data.cpu_usage_percent,
      memory_usage_percent: data.memory_usage_mb,
      memory_usage: data.memory_usage_mb,
      disk_usage_percent: 0,
      success_rate: 100,
      last_check: data.recorded_at,
      uptime_seconds: 0,
      error_count: data.error_count,
      error_message: null,
      metadata: data.metadata,
      recorded_at: data.recorded_at,
      created_at: data.created_at
    };
  }

  // Security Events methods
  static async getSecurityEvents(filters?: any): Promise<SecurityEvent[]> {
    // Mock data for now - replace with actual table query when available
    return [
      {
        id: '1',
        event_type: 'login_attempt',
        severity: 'medium' as const,
        source_ip: '192.168.1.1',
        user_id: null,
        event_description: 'Multiple failed login attempts detected',
        metadata: {},
        resolved: false,
        resolved_by: null,
        resolved_at: null,
        created_at: new Date().toISOString()
      }
    ];
  }

  static async createSecurityEvent(event: Omit<SecurityEvent, 'id' | 'created_at'>): Promise<SecurityEvent> {
    // Mock implementation - replace with actual database insert
    return {
      id: Math.random().toString(),
      ...event,
      created_at: new Date().toISOString()
    };
  }

  // Executive Reports methods
  static async getExecutiveReports(filters?: any): Promise<ExecutiveReport[]> {
    const query = supabase
      .from('executive_reports')
      .select('*')
      .order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(item => ({
      ...item,
      status: item.status as 'draft' | 'published' | 'archived'
    }));
  }

  static async createExecutiveReport(report: Omit<ExecutiveReport, 'id' | 'created_at' | 'updated_at'>): Promise<ExecutiveReport> {
    const { data, error } = await supabase
      .from('executive_reports')
      .insert([report])
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as 'draft' | 'published' | 'archived'
    };
  }

  // Quick Actions methods
  static async getQuickActions(): Promise<QuickAction[]> {
    // Mock data for now
    return [
      {
        id: '1',
        action_name: 'System Backup',
        action_type: 'maintenance',
        description: 'Run system backup',
        icon_name: 'backup',
        color_class: 'bg-blue-500',
        is_active: true,
        sort_order: 1,
        permissions_required: ['admin'],
        metadata: {},
        created_by: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  static async getQuickActionLogs(limit?: number): Promise<QuickActionLog[]> {
    const query = supabase
      .from('quick_actions_log')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(item => ({
      ...item,
      execution_status: item.execution_status as 'pending' | 'running' | 'completed' | 'failed'
    }));
  }

  static async createQuickAction(action: Omit<QuickAction, 'id' | 'created_at' | 'updated_at'>): Promise<QuickAction> {
    // Mock implementation
    return {
      id: Math.random().toString(),
      ...action,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  static async updateQuickAction(id: string, updates: Partial<QuickAction>): Promise<QuickAction> {
    // Mock implementation
    const existingActions = await this.getQuickActions();
    const existing = existingActions.find(a => a.id === id);
    if (!existing) throw new Error('Action not found');
    
    return {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };
  }

  static async logQuickAction(actionLog: Omit<QuickActionLog, 'id' | 'created_at'>): Promise<QuickActionLog> {
    const { data, error } = await supabase
      .from('quick_actions_log')
      .insert([actionLog])
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      execution_status: data.execution_status as 'pending' | 'running' | 'completed' | 'failed'
    };
  }

  // Real-time Analytics methods
  static async getRealTimeAnalytics(): Promise<any> {
    const query = supabase
      .from('realtime_analytics')
      .select('*')
      .order('timestamp_recorded', { ascending: false })
      .limit(100);

    const { data, error } = await query;
    if (error) throw error;

    return {
      activeUsers: data?.length || 0,
      pageViews: data?.reduce((sum, item) => sum + (item.metric_value || 0), 0) || 0,
      conversionRate: 0.15,
      bounceRate: 0.35,
      avgSessionDuration: 180,
      topPages: data?.slice(0, 5) || [],
      trafficSources: {
        direct: 45,
        organic: 30,
        social: 15,
        referral: 10
      }
    };
  }

  // Performance Metrics methods  
  static async getPerformanceMetrics(): Promise<any> {
    const query = supabase
      .from('performance_metrics')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(50);

    const { data, error } = await query;
    if (error) throw error;

    const avgResponseTime = data?.reduce((sum, item) => sum + item.response_time_ms, 0) / (data?.length || 1) || 0;
    const avgCpuUsage = data?.reduce((sum, item) => sum + (item.cpu_usage_percent || 0), 0) / (data?.length || 1) || 0;
    const avgMemoryUsage = data?.reduce((sum, item) => sum + (item.memory_usage_mb || 0), 0) / (data?.length || 1) || 0;

    return {
      responseTime: Math.round(avgResponseTime),
      cpuUsage: Math.round(avgCpuUsage),
      memoryUsage: Math.round(avgMemoryUsage),
      diskUsage: 65,
      networkLatency: 12,
      errorRate: 0.02,
      throughput: 1250,
      uptime: 99.9
    };
  }

  // Search methods
  static async searchDashboardData(searchTerm: string): Promise<any[]> {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    // Search across multiple tables
    const promises = [
      this.getKPIMetrics().then(data => 
        data.filter(item => 
          item.metric_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.metric_category.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(item => ({ ...item, type: 'kpi' }))
      ),
      this.getSystemHealthLogs().then(data =>
        data.filter(item =>
          item.service_name.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(item => ({ ...item, type: 'health' }))
      ),
      this.getExecutiveReports().then(data =>
        data.filter(item =>
          item.report_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.report_type.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(item => ({ ...item, type: 'report' }))
      )
    ];

    const results = await Promise.all(promises);
    return results.flat();
  }
}

// Export types for external use
export type { DashboardKPIMetric, SystemHealthLog, SecurityEvent, ExecutiveReport, QuickAction, QuickActionLog };
