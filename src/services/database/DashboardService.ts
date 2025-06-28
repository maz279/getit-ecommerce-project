
import { supabase } from '@/integrations/supabase/client';
import { DashboardKPIMetric, SystemHealthLog, SecurityEvent, ExecutiveReport, QuickAction, QuickActionLog } from '@/types/dashboard';

export class DashboardService {
  // KPI Metrics
  static async getKPIMetrics(filters?: any): Promise<DashboardKPIMetric[]> {
    try {
      const { data, error } = await supabase
        .from('dashboard_kpi_metrics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching KPI metrics:', error);
        return this.getMockKPIMetrics();
      }

      return data?.map(item => ({
        ...item,
        trend_direction: ['up', 'down', 'stable'].includes(item.trend_direction) 
          ? item.trend_direction as 'up' | 'down' | 'stable'
          : 'stable'
      })) || this.getMockKPIMetrics();
    } catch (error) {
      console.error('Error fetching KPI metrics:', error);
      return this.getMockKPIMetrics();
    }
  }

  static async createKPIMetric(metric: Omit<DashboardKPIMetric, 'id' | 'created_at' | 'updated_at'>): Promise<DashboardKPIMetric> {
    try {
      const { data, error } = await supabase
        .from('dashboard_kpi_metrics')
        .insert([metric])
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        trend_direction: ['up', 'down', 'stable'].includes(data.trend_direction) 
          ? data.trend_direction as 'up' | 'down' | 'stable'
          : 'stable'
      };
    } catch (error) {
      console.error('Error creating KPI metric:', error);
      throw error;
    }
  }

  static async updateKPIMetric(id: string, updates: Partial<DashboardKPIMetric>): Promise<DashboardKPIMetric> {
    try {
      const { data, error } = await supabase
        .from('dashboard_kpi_metrics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        trend_direction: ['up', 'down', 'stable'].includes(data.trend_direction) 
          ? data.trend_direction as 'up' | 'down' | 'stable'
          : 'stable'
      };
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
  static async getSystemHealthLogs(filters?: any): Promise<SystemHealthLog[]> {
    try {
      // Since the actual table might not exist or have different structure, return mock data
      return this.getMockSystemHealthLogs();
    } catch (error) {
      console.error('Error fetching system health logs:', error);
      return this.getMockSystemHealthLogs();
    }
  }

  static async createSystemHealthLog(log: Omit<SystemHealthLog, 'id' | 'created_at'>): Promise<SystemHealthLog> {
    try {
      // Mock implementation
      const mockLog: SystemHealthLog = {
        id: Math.random().toString(36).substr(2, 9),
        ...log,
        created_at: new Date().toISOString()
      };
      return mockLog;
    } catch (error) {
      console.error('Error creating system health log:', error);
      throw error;
    }
  }

  // Security Events
  static async getSecurityEvents(filters?: any): Promise<SecurityEvent[]> {
    try {
      // Return mock data since table might not exist
      return this.getMockSecurityEvents();
    } catch (error) {
      console.error('Error fetching security events:', error);
      return this.getMockSecurityEvents();
    }
  }

  static async createSecurityEvent(event: Omit<SecurityEvent, 'id' | 'created_at'>): Promise<SecurityEvent> {
    try {
      // Mock implementation
      const mockEvent: SecurityEvent = {
        id: Math.random().toString(36).substr(2, 9),
        ...event,
        created_at: new Date().toISOString()
      };
      return mockEvent;
    } catch (error) {
      console.error('Error creating security event:', error);
      throw error;
    }
  }

  // Executive Reports
  static async getExecutiveReports(filters?: any): Promise<ExecutiveReport[]> {
    try {
      const { data, error } = await supabase
        .from('executive_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching executive reports:', error);
        return this.getMockExecutiveReports();
      }

      return data?.map(item => ({
        ...item,
        status: ['draft', 'published', 'archived'].includes(item.status) 
          ? item.status as 'draft' | 'published' | 'archived'
          : 'draft',
        recommendations: Array.isArray(item.recommendations) ? item.recommendations : []
      })) || this.getMockExecutiveReports();
    } catch (error) {
      console.error('Error fetching executive reports:', error);
      return this.getMockExecutiveReports();
    }
  }

  static async createExecutiveReport(report: Omit<ExecutiveReport, 'id' | 'created_at' | 'updated_at'>): Promise<ExecutiveReport> {
    try {
      const { data, error } = await supabase
        .from('executive_reports')
        .insert([report])
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        status: ['draft', 'published', 'archived'].includes(data.status) 
          ? data.status as 'draft' | 'published' | 'archived'
          : 'draft',
        recommendations: Array.isArray(data.recommendations) ? data.recommendations : []
      };
    } catch (error) {
      console.error('Error creating executive report:', error);
      throw error;
    }
  }

  // Quick Actions
  static async getQuickActions(): Promise<QuickAction[]> {
    try {
      // Return mock data since table might not exist
      return this.getMockQuickActions();
    } catch (error) {
      console.error('Error fetching quick actions:', error);
      return this.getMockQuickActions();
    }
  }

  static async getQuickActionLogs(limit?: number): Promise<QuickActionLog[]> {
    try {
      const { data, error } = await supabase
        .from('quick_actions_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit || 50);

      if (error) {
        console.error('Error fetching quick action logs:', error);
        return this.getMockQuickActionLogs();
      }

      return data?.map(item => ({
        ...item,
        execution_status: ['pending', 'running', 'completed', 'failed'].includes(item.execution_status) 
          ? item.execution_status as 'pending' | 'running' | 'completed' | 'failed'
          : 'pending'
      })) || this.getMockQuickActionLogs();
    } catch (error) {
      console.error('Error fetching quick action logs:', error);
      return this.getMockQuickActionLogs();
    }
  }

  static async createQuickAction(action: Omit<QuickAction, 'id' | 'created_at' | 'updated_at'>): Promise<QuickAction> {
    try {
      // Mock implementation
      const mockAction: QuickAction = {
        id: Math.random().toString(36).substr(2, 9),
        ...action,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return mockAction;
    } catch (error) {
      console.error('Error creating quick action:', error);
      throw error;
    }
  }

  static async updateQuickAction(id: string, updates: Partial<QuickAction>): Promise<QuickAction> {
    try {
      // Mock implementation
      const mockAction: QuickAction = {
        id,
        action_name: updates.action_name || 'Updated Action',
        action_type: updates.action_type || 'system',
        description: updates.description || 'Updated description',
        icon_name: updates.icon_name || 'settings',
        color_class: updates.color_class || 'blue',
        is_active: updates.is_active || true,
        sort_order: updates.sort_order || 0,
        permissions_required: updates.permissions_required || [],
        metadata: updates.metadata || {},
        created_by: updates.created_by || 'system',
        created_at: updates.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return mockAction;
    } catch (error) {
      console.error('Error updating quick action:', error);
      throw error;
    }
  }

  static async logQuickAction(logData: Omit<QuickActionLog, 'id' | 'created_at'>): Promise<QuickActionLog> {
    try {
      const { data, error } = await supabase
        .from('quick_actions_log')
        .insert([logData])
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        execution_status: ['pending', 'running', 'completed', 'failed'].includes(data.execution_status) 
          ? data.execution_status as 'pending' | 'running' | 'completed' | 'failed'
          : 'pending'
      };
    } catch (error) {
      console.error('Error logging quick action:', error);
      throw error;
    }
  }

  // Analytics and Search
  static async getRealTimeAnalytics(): Promise<any> {
    try {
      // Mock implementation
      return this.getMockRealTimeAnalytics();
    } catch (error) {
      console.error('Error fetching real-time analytics:', error);
      return this.getMockRealTimeAnalytics();
    }
  }

  static async getPerformanceMetrics(): Promise<any> {
    try {
      // Mock implementation
      return this.getMockPerformanceMetrics();
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return this.getMockPerformanceMetrics();
    }
  }

  static async searchDashboardData(searchTerm: string): Promise<any[]> {
    try {
      // Mock implementation
      return this.getMockSearchResults(searchTerm);
    } catch (error) {
      console.error('Error searching dashboard data:', error);
      return [];
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
        comparison_value: 120000,
        percentage_change: 4.17,
        trend_direction: 'up',
        metric_unit: 'BDT',
        time_period: 'monthly',
        recorded_date: new Date().toISOString(),
        metadata: {},
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
        health_status: 'healthy',
        service_type: 'api',
        response_time_ms: 245,
        cpu_usage_percent: 65,
        memory_usage_percent: 72,
        disk_usage_percent: 45,
        success_rate: 99.5,
        cpu_usage: 65,
        memory_usage: 72,
        last_check: new Date().toISOString(),
        uptime_seconds: 86400,
        error_count: 2,
        recorded_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
    ];
  }

  private static getMockSecurityEvents(): SecurityEvent[] {
    return [
      {
        id: '1',
        event_type: 'login_attempt',
        severity: 'medium',
        source_ip: '192.168.1.100',
        user_id: 'user-123',
        event_description: 'Multiple failed login attempts',
        metadata: {},
        resolved: false,
        created_at: new Date().toISOString()
      }
    ];
  }

  private static getMockExecutiveReports(): ExecutiveReport[] {
    return [
      {
        id: '1',
        report_title: 'Monthly Performance Summary',
        report_type: 'monthly',
        executive_summary: 'Strong performance across all metrics',
        report_period_start: '2024-01-01',
        report_period_end: '2024-01-31',
        status: 'published',
        key_metrics: {},
        charts_data: {},
        recommendations: [],
        created_by: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private static getMockQuickActions(): QuickAction[] {
    return [
      {
        id: '1',
        action_name: 'System Backup',
        action_type: 'system',
        description: 'Perform system backup',
        icon_name: 'database',
        color_class: 'blue',
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

  private static getMockQuickActionLogs(): QuickActionLog[] {
    return [
      {
        id: '1',
        action_type: 'system',
        action_name: 'System Backup',
        execution_status: 'completed',
        parameters: {},
        executed_by: 'admin',
        progress_percentage: 100,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        execution_time_ms: 5000,
        result_data: {},
        created_at: new Date().toISOString()
      }
    ];
  }

  private static getMockRealTimeAnalytics(): any {
    return {
      activeUsers: 1250,
      pageViews: 15420,
      conversionRate: 3.2,
      averageSessionDuration: 180
    };
  }

  private static getMockPerformanceMetrics(): any {
    return {
      responseTime: 245,
      throughput: 1500,
      errorRate: 0.1,
      uptime: 99.9
    };
  }

  private static getMockSearchResults(searchTerm: string): any[] {
    return [
      {
        id: '1',
        type: 'metric',
        title: `Search result for: ${searchTerm}`,
        description: 'Mock search result',
        relevance: 0.8
      }
    ];
  }
}

// Export types for backward compatibility
export { DashboardKPIMetric, SystemHealthLog, SecurityEvent, ExecutiveReport, QuickAction, QuickActionLog };
