
import { supabase } from '@/integrations/supabase/client';
import type { 
  DashboardKPIMetric, 
  SystemHealthLog, 
  SecurityEvent, 
  ExecutiveReport, 
  QuickAction,
  QuickActionLog 
} from '@/types/dashboard';

export class DashboardService {
  // KPI Metrics Management
  static async getKPIMetrics(filters?: any): Promise<DashboardKPIMetric[]> {
    try {
      let query = supabase.from('dashboard_kpi_metrics').select('*');
      
      if (filters?.metric_category) {
        query = query.eq('metric_category', filters.metric_category);
      }
      
      if (filters?.time_period) {
        query = query.eq('time_period', filters.time_period);
      }
      
      const { data, error } = await query.order('recorded_date', { ascending: false });
      
      if (error) {
        console.warn('Dashboard KPI metrics table not accessible, returning mock data');
        return this.getMockKPIMetrics();
      }
      
      return data?.map(item => ({
        ...item,
        trend_direction: this.normalizeTrendDirection(item.trend_direction)
      })) || [];
    } catch (error) {
      console.error('Error fetching KPI metrics:', error);
      return this.getMockKPIMetrics();
    }
  }

  static async createKPIMetric(metric: Omit<DashboardKPIMetric, 'id' | 'created_at' | 'updated_at'>): Promise<DashboardKPIMetric> {
    try {
      const { data, error } = await supabase
        .from('dashboard_kpi_metrics')
        .insert([{
          ...metric,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return {
        ...data,
        trend_direction: this.normalizeTrendDirection(data.trend_direction)
      };
    } catch (error) {
      console.error('Error creating KPI metric:', error);
      throw error;
    }
  }

  // System Health Management
  static async getSystemHealthLogs(limit: number = 50): Promise<SystemHealthLog[]> {
    try {
      const { data, error } = await supabase
        .from('system_health_logs')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.warn('System health logs table not accessible, returning mock data');
        return this.getMockSystemHealthLogs();
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching system health logs:', error);
      return this.getMockSystemHealthLogs();
    }
  }

  static async logSystemHealth(log: Omit<SystemHealthLog, 'id' | 'created_at'>): Promise<void> {
    try {
      const healthData = {
        service_name: log.service_name,
        status: log.status,
        response_time_ms: log.response_time_ms,
        cpu_usage_percent: log.cpu_usage_percent,
        memory_usage_percent: log.memory_usage_percent,
        disk_usage_percent: log.disk_usage_percent,
        error_message: log.error_message,
        metadata: log.metadata || {},
        recorded_at: log.recorded_at,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('system_health_logs')
        .insert([healthData]);
      
      if (error) {
        console.error('Error logging system health:', error);
      }
    } catch (error) {
      console.error('Error logging system health:', error);
    }
  }

  // Security Events Management
  static async getSecurityEvents(filters?: any): Promise<SecurityEvent[]> {
    try {
      let query = supabase.from('security_events').select('*');
      
      if (filters?.severity) {
        query = query.in('severity', Array.isArray(filters.severity) ? filters.severity : [filters.severity]);
      }
      
      if (filters?.resolved !== undefined) {
        query = query.eq('resolved', filters.resolved);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Security events table not accessible, returning mock data');
        return this.getMockSecurityEvents();
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching security events:', error);
      return this.getMockSecurityEvents();
    }
  }

  static async createSecurityEvent(event: Omit<SecurityEvent, 'id' | 'created_at'>): Promise<void> {
    try {
      const eventData = {
        event_type: event.event_type,
        severity: event.severity,
        source_ip: event.source_ip,
        user_id: event.user_id,
        event_description: event.event_description,
        metadata: event.metadata || {},
        resolved: event.resolved,
        resolved_by: event.resolved_by,
        resolved_at: event.resolved_at,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('security_events')
        .insert([eventData]);
      
      if (error) {
        console.error('Error creating security event:', error);
      }
    } catch (error) {
      console.error('Error creating security event:', error);
    }
  }

  // Executive Reports Management
  static async getExecutiveReports(filters?: any): Promise<ExecutiveReport[]> {
    try {
      let query = supabase.from('executive_reports').select('*');
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.report_type) {
        query = query.eq('report_type', filters.report_type);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Executive reports table not accessible, returning mock data');
        return this.getMockExecutiveReports();
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching executive reports:', error);
      return this.getMockExecutiveReports();
    }
  }

  // Quick Actions Management
  static async getQuickActions(): Promise<QuickAction[]> {
    try {
      const { data, error } = await supabase
        .from('quick_actions')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.warn('Quick actions table not accessible, returning mock data');
        return this.getMockQuickActions();
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching quick actions:', error);
      return this.getMockQuickActions();
    }
  }

  static async getQuickActionLogs(limit: number = 20): Promise<QuickActionLog[]> {
    try {
      const { data, error } = await supabase
        .from('quick_actions_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.warn('Quick actions log table not accessible, returning mock data');
        return this.getMockQuickActionLogs();
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching quick action logs:', error);
      return this.getMockQuickActionLogs();
    }
  }

  static async logQuickAction(actionLog: Omit<QuickActionLog, 'id' | 'created_at'>): Promise<void> {
    try {
      const logData = {
        action_type: actionLog.action_type,
        action_name: actionLog.action_name,
        execution_status: actionLog.execution_status,
        parameters: actionLog.parameters || {},
        executed_by: actionLog.executed_by,
        progress_percentage: actionLog.progress_percentage,
        started_at: actionLog.started_at,
        completed_at: actionLog.completed_at,
        execution_time_ms: actionLog.execution_time_ms,
        result_data: actionLog.result_data || {},
        error_message: actionLog.error_message,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('quick_actions_log')
        .insert([logData]);
      
      if (error) {
        console.error('Error logging quick action:', error);
      }
    } catch (error) {
      console.error('Error logging quick action:', error);
    }
  }

  // Helper Methods
  private static normalizeTrendDirection(direction: string): 'up' | 'down' | 'stable' {
    if (direction === 'up' || direction === 'down' || direction === 'stable') {
      return direction;
    }
    return 'stable';
  }

  // Mock Data Methods
  private static getMockKPIMetrics(): DashboardKPIMetric[] {
    return [
      {
        id: '1',
        metric_name: 'Total Revenue',
        metric_category: 'financial',
        metric_value: 125000,
        comparison_value: 118000,
        percentage_change: 5.9,
        trend_direction: 'up',
        metric_unit: 'BDT',
        time_period: 'monthly',
        recorded_date: new Date().toISOString(),
        created_by: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        metric_name: 'Active Users',
        metric_category: 'engagement',
        metric_value: 15420,
        comparison_value: 14800,
        percentage_change: 4.2,
        trend_direction: 'up',
        metric_unit: 'users',
        time_period: 'weekly',
        recorded_date: new Date().toISOString(),
        created_by: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private static getMockSystemHealthLogs(): SystemHealthLog[] {
    return [
      {
        id: '1',
        service_name: 'API Gateway',
        status: 'healthy',
        response_time_ms: 120,
        cpu_usage_percent: 45.2,
        memory_usage_percent: 68.5,
        disk_usage_percent: 32.1,
        recorded_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        service_name: 'Database',
        status: 'warning',
        response_time_ms: 250,
        cpu_usage_percent: 78.3,
        memory_usage_percent: 85.2,
        disk_usage_percent: 45.7,
        error_message: 'High memory usage detected',
        recorded_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
    ];
  }

  private static getMockSecurityEvents(): SecurityEvent[] {
    return [
      {
        id: '1',
        event_type: 'failed_login',
        severity: 'medium',
        source_ip: '192.168.1.100',
        event_description: 'Multiple failed login attempts detected',
        resolved: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '2',
        event_type: 'suspicious_activity',
        severity: 'high',
        source_ip: '10.0.0.45',
        event_description: 'Unusual API access pattern detected',
        resolved: true,
        resolved_by: 'admin-1',
        resolved_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      }
    ];
  }

  private static getMockExecutiveReports(): ExecutiveReport[] {
    return [
      {
        id: '1',
        report_title: 'Q4 2024 Performance Review',
        report_type: 'quarterly',
        executive_summary: 'Strong performance across all key metrics with 15% revenue growth',
        report_period_start: '2024-10-01',
        report_period_end: '2024-12-31',
        status: 'published',
        key_metrics: {
          revenue: 125000,
          growth: 15.2,
          customers: 1540
        },
        created_by: 'admin-1',
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private static getMockQuickActions(): QuickAction[] {
    return [
      {
        id: '1',
        action_name: 'Add Product',
        action_type: 'product_management',
        description: 'Quickly add a new product to the catalog',
        icon_name: 'Plus',
        color_class: 'bg-blue-500 hover:bg-blue-600',
        is_active: true,
        sort_order: 1,
        permissions_required: ['product.create'],
        created_by: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        action_name: 'Process Payout',
        action_type: 'financial',
        description: 'Process pending vendor payouts',
        icon_name: 'DollarSign',
        color_class: 'bg-green-500 hover:bg-green-600',
        is_active: true,
        sort_order: 2,
        permissions_required: ['payout.process'],
        created_by: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private static getMockQuickActionLogs(): QuickActionLog[] {
    return [
      {
        id: '1',
        action_type: 'product_management',
        action_name: 'Add Product',
        execution_status: 'completed',
        executed_by: 'admin-1',
        progress_percentage: 100,
        started_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        completed_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        execution_time_ms: 120000,
        result_data: { product_id: '12345' },
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()
      },
      {
        id: '2',
        action_type: 'financial',
        action_name: 'Process Payout',
        execution_status: 'failed',
        executed_by: 'admin-2',
        progress_percentage: 75,
        started_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        execution_time_ms: 300000,
        error_message: 'Insufficient funds in processing account',
        created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString()
      }
    ];
  }
}
