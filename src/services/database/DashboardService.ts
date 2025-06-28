
import { supabase } from '@/integrations/supabase/client';
import type { 
  DashboardKPIMetric, 
  SystemHealthLog, 
  SecurityEvent, 
  ExecutiveReport, 
  QuickAction, 
  QuickActionLog 
} from '@/types/dashboard';

// Re-export types for external use
export type { 
  DashboardKPIMetric, 
  SystemHealthLog, 
  SecurityEvent, 
  ExecutiveReport, 
  QuickAction, 
  QuickActionLog 
};

export class DashboardService {
  // KPI Metrics
  static async getKPIMetrics(filters?: any): Promise<DashboardKPIMetric[]> {
    try {
      let query = supabase.from('dashboard_kpi_metrics').select('*');
      
      if (filters?.category) {
        query = query.eq('metric_category', filters.category);
      }
      
      if (filters?.dateRange) {
        query = query
          .gte('recorded_date', filters.dateRange.start)
          .lte('recorded_date', filters.dateRange.end);
      }
      
      const { data, error } = await query.order('recorded_date', { ascending: false });
      
      if (error) {
        console.warn('KPI metrics table not accessible, returning mock data');
        return this.getMockKPIMetrics();
      }
      
      return data?.map(item => ({
        ...item,
        trend_direction: (item.trend_direction === 'up' || item.trend_direction === 'down' || item.trend_direction === 'stable') 
          ? item.trend_direction : 'stable'
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
      return data;
    } catch (error) {
      console.error('Error creating KPI metric:', error);
      throw error;
    }
  }

  static async updateKPIMetric(id: string, updates: Partial<DashboardKPIMetric>): Promise<DashboardKPIMetric> {
    try {
      const { data, error } = await supabase
        .from('dashboard_kpi_metrics')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
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

  static async deleteKPIMetric(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('dashboard_kpi_metrics')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting KPI metric:', error);
      throw error;
    }
  }

  // System Health Logs
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

  static async createSystemHealthLog(log: Omit<SystemHealthLog, 'id' | 'created_at'>): Promise<SystemHealthLog> {
    try {
      const { data, error } = await supabase
        .from('system_health_logs')
        .insert([{
          ...log,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating system health log:', error);
      throw error;
    }
  }

  // Security Events
  static async getSecurityEvents(filters?: any): Promise<SecurityEvent[]> {
    try {
      let query = supabase.from('security_events').select('*');
      
      if (filters?.severity) {
        query = query.in('severity', filters.severity);
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

  static async createSecurityEvent(event: Omit<SecurityEvent, 'id' | 'created_at'>): Promise<SecurityEvent> {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .insert([{
          ...event,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating security event:', error);
      throw error;
    }
  }

  // Executive Reports
  static async getExecutiveReports(filters?: any): Promise<ExecutiveReport[]> {
    try {
      let query = supabase.from('executive_reports').select('*');
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.type) {
        query = query.eq('report_type', filters.type);
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

  static async createExecutiveReport(report: Omit<ExecutiveReport, 'id' | 'created_at' | 'updated_at'>): Promise<ExecutiveReport> {
    try {
      const { data, error } = await supabase
        .from('executive_reports')
        .insert([{
          ...report,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating executive report:', error);
      throw error;
    }
  }

  // Quick Actions
  static async getQuickActions(limit?: number): Promise<QuickAction[]> {
    try {
      let query = supabase.from('quick_actions').select('*');
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query
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

  static async createQuickAction(action: Omit<QuickAction, 'id' | 'created_at' | 'updated_at'>): Promise<QuickAction> {
    try {
      const { data, error } = await supabase
        .from('quick_actions')
        .insert([{
          ...action,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating quick action:', error);
      throw error;
    }
  }

  static async updateQuickAction(id: string, updates: Partial<QuickAction>): Promise<QuickAction> {
    try {
      const { data, error } = await supabase
        .from('quick_actions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
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

  static async getQuickActionLogs(limit: number = 50): Promise<QuickActionLog[]> {
    try {
      const { data, error } = await supabase
        .from('quick_actions_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.warn('Quick action logs table not accessible, returning mock data');
        return this.getMockQuickActionLogs();
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching quick action logs:', error);
      return this.getMockQuickActionLogs();
    }
  }

  static async logQuickAction(log: Omit<QuickActionLog, 'id' | 'created_at'>): Promise<QuickActionLog> {
    try {
      const { data, error } = await supabase
        .from('quick_actions_log')
        .insert([{
          ...log,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging quick action:', error);
      throw error;
    }
  }

  // Real-time Analytics and Performance Metrics (delegated to specialized services)
  static async getRealTimeAnalytics(filters?: any): Promise<any> {
    try {
      const { RealtimeAnalyticsService } = await import('@/services/analytics/RealtimeAnalyticsService');
      return await RealtimeAnalyticsService.getDashboardAnalytics();
    } catch (error) {
      console.error('Error fetching real-time analytics:', error);
      return {
        activeUsers: 0,
        pageViews: 0,
        sessions: 0,
        bounceRate: 0,
        avgSessionDuration: 0
      };
    }
  }

  static async getPerformanceMetrics(filters?: any): Promise<any> {
    try {
      const { RealtimeAnalyticsService } = await import('@/services/analytics/RealtimeAnalyticsService');
      return await RealtimeAnalyticsService.getPerformanceMetrics();
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return {
        responseTime: 0,
        throughput: 0,
        errorRate: 0,
        uptime: 99.9
      };
    }
  }

  // Mock data methods
  private static getMockKPIMetrics(): DashboardKPIMetric[] {
    return [
      {
        id: '1',
        metric_name: 'Total Revenue',
        metric_category: 'Financial',
        metric_value: 125000,
        comparison_value: 118000,
        percentage_change: 5.9,
        trend_direction: 'up',
        metric_unit: 'BDT',
        time_period: 'monthly',
        recorded_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        metric_name: 'Active Users',
        metric_category: 'User Engagement',
        metric_value: 1247,
        comparison_value: 1156,
        percentage_change: 7.9,
        trend_direction: 'up',
        time_period: 'daily',
        recorded_date: new Date().toISOString(),
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
        response_time_ms: 245,
        cpu_usage_percent: 65.2,
        memory_usage_percent: 72.1,
        disk_usage_percent: 45.8,
        recorded_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        service_name: 'Database',
        status: 'warning',
        response_time_ms: 890,
        cpu_usage_percent: 85.3,
        memory_usage_percent: 78.9,
        disk_usage_percent: 82.1,
        error_message: 'High CPU usage detected',
        recorded_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
    ];
  }

  private static getMockSecurityEvents(): SecurityEvent[] {
    return [
      {
        id: '1',
        event_type: 'Failed Login',
        severity: 'medium',
        source_ip: '192.168.1.100',
        event_description: 'Multiple failed login attempts detected',
        resolved: false,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        event_type: 'Suspicious Activity',
        severity: 'high',
        source_ip: '10.0.0.25',
        user_id: 'user-123',
        event_description: 'Unusual access pattern detected',
        resolved: true,
        resolved_by: 'admin-1',
        resolved_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }

  private static getMockExecutiveReports(): ExecutiveReport[] {
    return [
      {
        id: '1',
        report_title: 'Q4 2024 Performance Summary',
        report_type: 'quarterly',
        executive_summary: 'Strong performance across all key metrics with 15% revenue growth.',
        report_period_start: '2024-10-01',
        report_period_end: '2024-12-31',
        status: 'published',
        key_metrics: {
          revenue: 450000,
          growth: 15.2,
          customers: 2500
        },
        created_by: 'admin-1',
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
        created_by: 'admin-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        action_name: 'Process Payout',
        action_type: 'financial',
        description: 'Process vendor payouts',
        icon_name: 'DollarSign',
        color_class: 'bg-green-500 hover:bg-green-600',
        is_active: true,
        sort_order: 2,
        created_by: 'admin-1',
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
        started_at: new Date(Date.now() - 5000).toISOString(),
        completed_at: new Date().toISOString(),
        execution_time_ms: 2500,
        result_data: { success: true, product_id: 'prod-123' },
        created_at: new Date().toISOString()
      }
    ];
  }
}
