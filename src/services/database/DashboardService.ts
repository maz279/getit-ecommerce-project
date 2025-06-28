
// Dashboard Service for handling all dashboard-related database operations
import { supabase } from '@/integrations/supabase/client';
import type { DashboardKPIMetric, SystemHealthLog, SecurityEvent, ExecutiveReport, QuickAction, QuickActionLog } from '@/types/dashboard';

// Export the types for use in other components
export type { DashboardKPIMetric, SystemHealthLog, SecurityEvent, ExecutiveReport, QuickAction, QuickActionLog };

export class DashboardService {
  // KPI Metrics Operations
  static async getKPIMetrics(filters?: any): Promise<DashboardKPIMetric[]> {
    try {
      let query = supabase
        .from('dashboard_kpi_metrics')
        .select('*')
        .order('recorded_date', { ascending: false });

      if (filters?.category) {
        query = query.eq('metric_category', filters.category);
      }

      if (filters?.dateRange) {
        query = query.gte('recorded_date', filters.dateRange.start)
                    .lte('recorded_date', filters.dateRange.end);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform database results to match interface
      return (data || []).map(item => ({
        ...item,
        trend_direction: (item.trend_direction as 'up' | 'down' | 'stable') || 'stable',
        metadata: (item.metadata as any) || {},
        comparison_value: item.comparison_value || null,
        percentage_change: item.percentage_change || null,
        metric_unit: item.metric_unit || null,
        created_by: item.created_by || null
      }));
    } catch (error) {
      console.error('Error fetching KPI metrics:', error);
      return [];
    }
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
      trend_direction: (data.trend_direction as 'up' | 'down' | 'stable') || 'stable',
      metadata: (data.metadata as any) || {},
      comparison_value: data.comparison_value || null,
      percentage_change: data.percentage_change || null,
      metric_unit: data.metric_unit || null,
      created_by: data.created_by || null
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
      trend_direction: (data.trend_direction as 'up' | 'down' | 'stable') || 'stable',
      metadata: (data.metadata as any) || {},
      comparison_value: data.comparison_value || null,
      percentage_change: data.percentage_change || null,
      metric_unit: data.metric_unit || null,
      created_by: data.created_by || null
    };
  }

  static async deleteKPIMetric(id: string): Promise<void> {
    const { error } = await supabase
      .from('dashboard_kpi_metrics')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // System Health Operations
  static async getSystemHealthLogs(filters?: any): Promise<SystemHealthLog[]> {
    try {
      let query = supabase
        .from('system_health_logs')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Transform database results to match SystemHealthLog interface
      return (data || []).map(item => ({
        id: item.id,
        service_name: item.service_name,
        status: (item.health_status as 'healthy' | 'warning' | 'critical' | 'down') || 'healthy',
        response_time_ms: item.response_time || null,
        cpu_usage_percent: item.cpu_usage || null,
        memory_usage_percent: item.memory_usage || null,
        disk_usage_percent: item.disk_usage || null,
        error_message: item.error_details ? JSON.stringify(item.error_details) : null,
        metadata: (item.error_details as any) || {},
        recorded_at: item.last_check || item.created_at,
        created_at: item.created_at,
        // Additional properties from extended interface
        health_status: (item.health_status as 'healthy' | 'warning' | 'critical' | 'down') || 'healthy',
        service_type: item.service_type || 'unknown',
        success_rate: item.success_rate || 0,
        cpu_usage: item.cpu_usage || null,
        memory_usage: item.memory_usage || null,
        last_check: item.last_check || item.created_at,
        uptime_seconds: item.uptime_seconds || 0,
        error_count: item.error_count || 0
      }));
    } catch (error) {
      console.error('Error fetching system health logs:', error);
      return [];
    }
  }

  static async createSystemHealthLog(log: Omit<SystemHealthLog, 'id' | 'created_at'>): Promise<SystemHealthLog> {
    // Transform SystemHealthLog to database schema
    const dbLog = {
      service_name: log.service_name,
      health_status: log.status,
      service_type: log.service_type || 'unknown',
      response_time: log.response_time_ms || null,
      cpu_usage: log.cpu_usage_percent || null,
      memory_usage: log.memory_usage_percent || null,
      disk_usage: log.disk_usage_percent || null,
      success_rate: log.success_rate || 0,
      uptime_seconds: log.uptime_seconds || 0,
      error_count: log.error_count || 0,
      error_details: log.metadata || {},
      last_check: log.recorded_at
    };

    const { data, error } = await supabase
      .from('system_health_logs')
      .insert([dbLog])
      .select()
      .single();

    if (error) throw error;
    
    // Transform back to SystemHealthLog interface
    return {
      id: data.id,
      service_name: data.service_name,
      status: (data.health_status as 'healthy' | 'warning' | 'critical' | 'down') || 'healthy',
      response_time_ms: data.response_time || null,
      cpu_usage_percent: data.cpu_usage || null,
      memory_usage_percent: data.memory_usage || null,
      disk_usage_percent: data.disk_usage || null,
      error_message: data.error_details ? JSON.stringify(data.error_details) : null,
      metadata: (data.error_details as any) || {},
      recorded_at: data.last_check || data.created_at,
      created_at: data.created_at,
      health_status: (data.health_status as 'healthy' | 'warning' | 'critical' | 'down') || 'healthy',
      service_type: data.service_type || 'unknown',
      success_rate: data.success_rate || 0,
      cpu_usage: data.cpu_usage || null,
      memory_usage: data.memory_usage || null,
      last_check: data.last_check || data.created_at,
      uptime_seconds: data.uptime_seconds || 0,
      error_count: data.error_count || 0
    };
  }

  // Security Events Operations
  static async getSecurityEvents(filters?: any): Promise<SecurityEvent[]> {
    try {
      let query = supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Transform database results to match SecurityEvent interface
      return (data || []).map(item => ({
        id: item.id,
        event_type: item.event_type,
        severity: (item.severity_level as 'low' | 'medium' | 'high' | 'critical') || 'low',
        source_ip: item.ip_address as string || null,
        user_id: item.user_id || null,
        event_description: item.event_details ? JSON.stringify(item.event_details) : 'Security event occurred',
        metadata: (item.event_details as any) || {},
        resolved: item.resolution_status === 'resolved',
        resolved_by: item.resolved_by || null,
        resolved_at: item.resolved_at || null,
        created_at: item.created_at
      }));
    } catch (error) {
      console.error('Error fetching security events:', error);
      return [];
    }
  }

  static async createSecurityEvent(event: Omit<SecurityEvent, 'id' | 'created_at'>): Promise<SecurityEvent> {
    // Transform SecurityEvent to database schema
    const dbEvent = {
      event_type: event.event_type,
      severity_level: event.severity,
      ip_address: event.source_ip,
      user_id: event.user_id,
      event_details: event.metadata || {},
      resolution_status: event.resolved ? 'resolved' : 'open',
      resolved_by: event.resolved_by,
      resolved_at: event.resolved_at
    };

    const { data, error } = await supabase
      .from('security_events')
      .insert([dbEvent])
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      event_type: data.event_type,
      severity: (data.severity_level as 'low' | 'medium' | 'high' | 'critical') || 'low',
      source_ip: data.ip_address as string || null,
      user_id: data.user_id || null,
      event_description: data.event_details ? JSON.stringify(data.event_details) : 'Security event occurred',
      metadata: (data.event_details as any) || {},
      resolved: data.resolution_status === 'resolved',
      resolved_by: data.resolved_by || null,
      resolved_at: data.resolved_at || null,
      created_at: data.created_at
    };
  }

  // Executive Reports Operations
  static async getExecutiveReports(filters?: any): Promise<ExecutiveReport[]> {
    try {
      const { data, error } = await supabase
        .from('executive_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        key_metrics: (item.key_metrics as any) || {},
        charts_data: (item.charts_data as any) || {},
        recommendations: Array.isArray(item.recommendations) 
          ? item.recommendations 
          : (item.recommendations ? [item.recommendations] : [])
      }));
    } catch (error) {
      console.error('Error fetching executive reports:', error);
      return [];
    }
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
      key_metrics: (data.key_metrics as any) || {},
      charts_data: (data.charts_data as any) || {},
      recommendations: Array.isArray(data.recommendations) 
        ? data.recommendations 
        : (data.recommendations ? [data.recommendations] : [])
    };
  }

  // Quick Actions Operations
  static async getQuickActions(): Promise<QuickAction[]> {
    try {
      const { data, error } = await supabase
        .from('quick_actions')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        metadata: (item.metadata as any) || {},
        permissions_required: Array.isArray(item.permissions_required) 
          ? item.permissions_required 
          : (item.permissions_required ? [item.permissions_required] : [])
      }));
    } catch (error) {
      console.error('Error fetching quick actions:', error);
      return [];
    }
  }

  static async getQuickActionLogs(limit?: number): Promise<QuickActionLog[]> {
    try {
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
        parameters: (item.parameters as any) || {},
        result_data: (item.result_data as any) || {}
      }));
    } catch (error) {
      console.error('Error fetching quick action logs:', error);
      return [];
    }
  }

  static async createQuickAction(action: Omit<QuickAction, 'id' | 'created_at' | 'updated_at'>): Promise<QuickAction> {
    const { data, error } = await supabase
      .from('quick_actions')
      .insert([action])
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      metadata: (data.metadata as any) || {},
      permissions_required: Array.isArray(data.permissions_required) 
        ? data.permissions_required 
        : (data.permissions_required ? [data.permissions_required] : [])
    };
  }

  static async updateQuickAction(id: string, updates: Partial<QuickAction>): Promise<QuickAction> {
    const { data, error } = await supabase
      .from('quick_actions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      metadata: (data.metadata as any) || {},
      permissions_required: Array.isArray(data.permissions_required) 
        ? data.permissions_required 
        : (data.permissions_required ? [data.permissions_required] : [])
    };
  }

  static async logQuickAction(actionLog: { 
    action_type: string; 
    action_name: string; 
    executed_by: string; 
    parameters?: any; 
  }): Promise<QuickActionLog> {
    const logEntry = {
      ...actionLog,
      execution_status: 'pending' as const,
      progress_percentage: 0,
      started_at: new Date().toISOString(),
      parameters: actionLog.parameters || {},
    };

    const { data, error } = await supabase
      .from('quick_actions_log')
      .insert([logEntry])
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      parameters: (data.parameters as any) || {},
      result_data: (data.result_data as any) || {}
    };
  }

  // Real-time Analytics Operations
  static async getRealTimeAnalytics(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('realtime_analytics')
        .select('*')
        .gte('timestamp_recorded', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp_recorded', { ascending: false });

      if (error) throw error;

      // Process and aggregate real-time data
      const processedData = {
        activeUsers: data?.filter(d => d.metric_type === 'active_users').length || 0,
        pageViews: data?.filter(d => d.metric_type === 'page_view').length || 0,
        conversions: data?.filter(d => d.metric_type === 'conversion').length || 0,
        revenue: data?.filter(d => d.metric_type === 'revenue').reduce((sum, d) => sum + (d.metric_value || 0), 0) || 0,
        topPages: [],
        trafficSources: {},
        deviceBreakdown: {},
        geographicData: {}
      };

      return processedData;
    } catch (error) {
      console.error('Error fetching real-time analytics:', error);
      return {
        activeUsers: 0,
        pageViews: 0,
        conversions: 0,
        revenue: 0,
        topPages: [],
        trafficSources: {},
        deviceBreakdown: {},
        geographicData: {}
      };
    }
  }

  // Performance Metrics Operations
  static async getPerformanceMetrics(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Process performance data
      const processedMetrics = {
        averageResponseTime: data?.reduce((sum, d) => sum + (d.response_time_ms || 0), 0) / (data?.length || 1) || 0,
        uptime: 99.9,
        errorRate: (data?.filter(d => d.error_count && d.error_count > 0).length || 0) / (data?.length || 1) * 100,
        throughput: data?.reduce((sum, d) => sum + (d.throughput_per_second || 0), 0) || 0,
        cpuUsage: data?.reduce((sum, d) => sum + (d.cpu_usage_percent || 0), 0) / (data?.length || 1) || 0,
        memoryUsage: data?.reduce((sum, d) => sum + (d.memory_usage_mb || 0), 0) / (data?.length || 1) || 0
      };

      return processedMetrics;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return {
        averageResponseTime: 0,
        uptime: 99.9,
        errorRate: 0,
        throughput: 0,
        cpuUsage: 0,
        memoryUsage: 0
      };
    }
  }

  // Dashboard Search Operations
  static async searchDashboardData(searchTerm: string): Promise<any[]> {
    try {
      // Search across multiple tables
      const [kpiResults, healthResults, securityResults] = await Promise.all([
        supabase
          .from('dashboard_kpi_metrics')
          .select('*')
          .ilike('metric_name', `%${searchTerm}%`)
          .limit(10),
        supabase
          .from('system_health_logs')
          .select('*')
          .ilike('service_name', `%${searchTerm}%`)
          .limit(10),
        supabase
          .from('security_events')
          .select('*')
          .ilike('event_type', `%${searchTerm}%`)
          .limit(10)
      ]);

      const results = [];

      if (kpiResults.data) {
        results.push(...kpiResults.data.map(item => ({
          ...item,
          type: 'kpi_metric',
          title: item.metric_name,
          description: `${item.metric_category} - ${item.metric_value} ${item.metric_unit || ''}`
        })));
      }

      if (healthResults.data) {
        results.push(...healthResults.data.map(item => ({
          ...item,
          type: 'health_log',
          title: item.service_name,
          description: `Health Status: ${item.health_status}`
        })));
      }

      if (securityResults.data) {
        results.push(...securityResults.data.map(item => ({
          ...item,
          type: 'security_event',
          title: item.event_type,
          description: `Severity: ${item.severity_level}`
        })));
      }

      return results;
    } catch (error) {
      console.error('Error searching dashboard data:', error);
      return [];
    }
  }
}
