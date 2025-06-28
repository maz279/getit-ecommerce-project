
import { supabase } from '@/lib/supabase';
import type { DashboardKPIMetric, SystemHealthLog, SecurityEvent, ExecutiveReport, QuickAction, QuickActionLog } from '@/types/dashboard';

export class DashboardService {
  // KPI Metrics
  static async getKPIMetrics(filters?: any): Promise<DashboardKPIMetric[]> {
    let query = supabase
      .from('dashboard_kpi_metrics')
      .select('*')
      .order('recorded_date', { ascending: false });

    if (filters?.category) {
      query = query.eq('metric_category', filters.category);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      trend_direction: (item.trend_direction as 'up' | 'down' | 'stable') || 'stable'
    })) as DashboardKPIMetric[];
  }

  static async createKPIMetric(metric: Omit<DashboardKPIMetric, 'id' | 'created_at' | 'updated_at'>): Promise<DashboardKPIMetric> {
    const { data, error } = await supabase
      .from('dashboard_kpi_metrics')
      .insert(metric)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      trend_direction: (data.trend_direction as 'up' | 'down' | 'stable') || 'stable'
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
      trend_direction: (data.trend_direction as 'up' | 'down' | 'stable') || 'stable'
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
  static async getSystemHealthLogs(filters?: any): Promise<SystemHealthLog[]> {
    let query = supabase
      .from('system_health_logs')
      .select('*')
      .order('recorded_at', { ascending: false });

    if (filters?.service) {
      query = query.eq('service_name', filters.service);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      status: (item.status as 'healthy' | 'warning' | 'critical' | 'down') || 'healthy',
      health_status: (item.status as 'healthy' | 'warning' | 'critical' | 'down') || 'healthy',
      service_type: item.service_name?.split('-')[0] || 'service',
      success_rate: Math.random() * 100, // Mock data
      cpu_usage: item.cpu_usage_percent || 0,
      memory_usage: item.memory_usage_percent || 0,
      last_check: item.recorded_at,
      uptime_seconds: Math.floor(Math.random() * 86400), // Mock data
      error_count: Math.floor(Math.random() * 10) // Mock data
    })) as SystemHealthLog[];
  }

  static async createSystemHealthLog(log: Omit<SystemHealthLog, 'id' | 'created_at'>): Promise<SystemHealthLog> {
    const { data, error } = await supabase
      .from('system_health_logs')
      .insert({
        service_name: log.service_name,
        status: log.status,
        response_time_ms: log.response_time_ms,
        cpu_usage_percent: log.cpu_usage_percent,
        memory_usage_percent: log.memory_usage_percent,
        disk_usage_percent: log.disk_usage_percent,
        error_message: log.error_message,
        metadata: log.metadata,
        recorded_at: log.recorded_at || new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: (data.status as 'healthy' | 'warning' | 'critical' | 'down') || 'healthy',
      health_status: (data.status as 'healthy' | 'warning' | 'critical' | 'down') || 'healthy',
      service_type: data.service_name?.split('-')[0] || 'service',
      success_rate: Math.random() * 100,
      cpu_usage: data.cpu_usage_percent || 0,
      memory_usage: data.memory_usage_percent || 0,
      last_check: data.recorded_at,
      uptime_seconds: Math.floor(Math.random() * 86400),
      error_count: Math.floor(Math.random() * 10)
    } as SystemHealthLog;
  }

  // Security Events
  static async getSecurityEvents(filters?: any): Promise<SecurityEvent[]> {
    let query = supabase
      .from('security_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.severity) {
      query = query.eq('severity', filters.severity);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      severity: (item.severity as 'low' | 'medium' | 'high' | 'critical') || 'low'
    })) as SecurityEvent[];
  }

  static async createSecurityEvent(event: Omit<SecurityEvent, 'id' | 'created_at'>): Promise<SecurityEvent> {
    const { data, error } = await supabase
      .from('security_events')
      .insert({
        event_type: event.event_type,
        severity: event.severity,
        source_ip: event.source_ip,
        user_id: event.user_id,
        event_description: event.event_description,
        metadata: event.metadata,
        resolved: event.resolved || false,
        resolved_by: event.resolved_by,
        resolved_at: event.resolved_at
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      severity: (data.severity as 'low' | 'medium' | 'high' | 'critical') || 'low'
    } as SecurityEvent;
  }

  // Executive Reports
  static async getExecutiveReports(filters?: any): Promise<ExecutiveReport[]> {
    let query = supabase
      .from('executive_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      status: (item.status as 'draft' | 'published' | 'archived') || 'draft',
      recommendations: Array.isArray(item.recommendations) ? item.recommendations : []
    })) as ExecutiveReport[];
  }

  static async createExecutiveReport(report: Omit<ExecutiveReport, 'id' | 'created_at' | 'updated_at'>): Promise<ExecutiveReport> {
    const { data, error } = await supabase
      .from('executive_reports')
      .insert({
        report_title: report.report_title,
        report_type: report.report_type,
        executive_summary: report.executive_summary,
        report_period_start: report.report_period_start,
        report_period_end: report.report_period_end,
        status: report.status || 'draft',
        key_metrics: report.key_metrics,
        charts_data: report.charts_data,
        recommendations: report.recommendations || [],
        created_by: report.created_by,
        reviewed_by: report.reviewed_by,
        approved_by: report.approved_by,
        published_at: report.published_at
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: (data.status as 'draft' | 'published' | 'archived') || 'draft',
      recommendations: Array.isArray(data.recommendations) ? data.recommendations : []
    } as ExecutiveReport;
  }

  // Quick Actions
  static async getQuickActions(): Promise<QuickAction[]> {
    const { data, error } = await supabase
      .from('quick_actions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data as QuickAction[];
  }

  static async getQuickActionLogs(limit?: number): Promise<QuickActionLog[]> {
    let query = supabase
      .from('quick_actions_log')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      execution_status: (item.execution_status as 'pending' | 'running' | 'completed' | 'failed') || 'pending'
    })) as QuickActionLog[];
  }

  static async createQuickAction(action: Omit<QuickAction, 'id' | 'created_at' | 'updated_at'>): Promise<QuickAction> {
    const { data, error } = await supabase
      .from('quick_actions')
      .insert(action)
      .select()
      .single();

    if (error) throw error;
    return data as QuickAction;
  }

  static async updateQuickAction(id: string, updates: Partial<QuickAction>): Promise<QuickAction> {
    const { data, error } = await supabase
      .from('quick_actions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as QuickAction;
  }

  static async logQuickAction(actionLog: {
    action_type: string;
    action_name: string;
    executed_by: string;
    parameters?: any;
  }): Promise<QuickActionLog> {
    const { data, error } = await supabase
      .from('quick_actions_log')
      .insert({
        action_type: actionLog.action_type,
        action_name: actionLog.action_name,
        execution_status: 'pending',
        parameters: actionLog.parameters || {},
        executed_by: actionLog.executed_by,
        progress_percentage: 0,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      execution_status: (data.execution_status as 'pending' | 'running' | 'completed' | 'failed') || 'pending'
    } as QuickActionLog;
  }

  // Real-time Analytics
  static async getRealTimeAnalytics(): Promise<any> {
    // Mock implementation - in real scenario this would fetch from realtime_analytics table
    return {
      activeUsers: Math.floor(Math.random() * 1000) + 500,
      pageViews: Math.floor(Math.random() * 5000) + 2000,
      conversionRate: (Math.random() * 5 + 2).toFixed(2),
      bounceRate: (Math.random() * 30 + 25).toFixed(2),
      avgSessionDuration: Math.floor(Math.random() * 300) + 120,
      topPages: [
        { page: '/products', views: Math.floor(Math.random() * 500) + 200 },
        { page: '/categories', views: Math.floor(Math.random() * 400) + 150 },
        { page: '/deals', views: Math.floor(Math.random() * 300) + 100 }
      ],
      recentEvents: [
        { type: 'purchase', user: 'User123', amount: 150.50, timestamp: new Date().toISOString() },
        { type: 'signup', user: 'User456', amount: 0, timestamp: new Date().toISOString() },
        { type: 'purchase', user: 'User789', amount: 75.25, timestamp: new Date().toISOString() }
      ]
    };
  }

  // Performance Metrics
  static async getPerformanceMetrics(): Promise<any> {
    // Mock implementation - in real scenario this would fetch from performance_metrics table
    return {
      responseTime: Math.floor(Math.random() * 200) + 50,
      uptime: 99.9,
      errorRate: (Math.random() * 2).toFixed(3),
      throughput: Math.floor(Math.random() * 1000) + 500,
      cpuUsage: Math.floor(Math.random() * 30) + 20,
      memoryUsage: Math.floor(Math.random() * 40) + 30,
      diskUsage: Math.floor(Math.random() * 20) + 10,
      cacheHitRate: (Math.random() * 20 + 80).toFixed(1),
      databaseConnections: Math.floor(Math.random() * 50) + 25,
      queueDepth: Math.floor(Math.random() * 100) + 10
    };
  }

  // Dashboard Search
  static async searchDashboardData(searchTerm: string): Promise<any[]> {
    // Mock implementation - in real scenario this would search across multiple tables
    const mockResults = [
      { type: 'metric', name: 'Revenue Growth', value: '15.2%', category: 'financial' },
      { type: 'alert', name: 'Low Stock Alert', description: 'Product ABC running low', severity: 'medium' },
      { type: 'report', name: 'Monthly Sales Report', date: '2024-01-15', status: 'published' }
    ];

    return mockResults.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
}

// Clean exports without conflicts
export { DashboardService };
