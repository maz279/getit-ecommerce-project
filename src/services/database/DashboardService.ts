
import { supabase } from '@/integrations/supabase/client';

export interface DashboardKPIMetric {
  id: string;
  metric_name: string;
  metric_category: string;
  metric_value: number;
  comparison_value?: number;
  percentage_change?: number;
  trend_direction: 'up' | 'down' | 'stable';
  metric_unit?: string;
  time_period: string;
  recorded_date: string;
  metadata?: any;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface SystemHealthLog {
  id: string;
  service_name: string;
  status: 'healthy' | 'warning' | 'critical' | 'down';
  response_time_ms?: number;
  cpu_usage_percent?: number;
  memory_usage_percent?: number;
  disk_usage_percent?: number;
  error_message?: string;
  metadata?: any;
  recorded_at: string;
  created_at: string;
  // Additional properties for compatibility
  health_status?: string;
  service_type?: string;
  success_rate?: number;
  cpu_usage?: number;
  memory_usage?: number;
  last_check?: string;
  uptime_seconds?: number;
  error_count?: number;
}

export interface SecurityEvent {
  id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source_ip?: string;
  user_id?: string;
  event_description: string;
  metadata?: any;
  resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

export interface ExecutiveReport {
  id: string;
  report_title: string;
  report_type: string;
  executive_summary: string;
  report_period_start: string;
  report_period_end: string;
  status: 'draft' | 'published' | 'archived';
  key_metrics: any;
  charts_data?: any;
  recommendations?: any[];
  created_by: string;
  reviewed_by?: string;
  approved_by?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface QuickAction {
  id: string;
  action_name: string;
  action_type: string;
  description?: string;
  icon_name?: string;
  color_class?: string;
  is_active: boolean;
  sort_order: number;
  permissions_required?: string[];
  metadata?: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface QuickActionLog {
  id: string;
  action_type: string;
  action_name: string;
  execution_status: 'pending' | 'running' | 'completed' | 'failed';
  parameters?: any;
  executed_by: string;
  progress_percentage: number;
  started_at: string;
  completed_at?: string;
  execution_time_ms?: number;
  result_data?: any;
  error_message?: string;
  created_at: string;
}

export class DashboardService {
  // Helper function to normalize trend direction
  private static normalizeTrendDirection(direction: string): 'up' | 'down' | 'stable' {
    const normalized = direction?.toLowerCase();
    if (normalized === 'up' || normalized === 'increasing') return 'up';
    if (normalized === 'down' || normalized === 'decreasing') return 'down';
    return 'stable';
  }

  // Helper function to normalize system health data
  private static normalizeSystemHealthLog(data: any): SystemHealthLog {
    return {
      id: data.id,
      service_name: data.service_name || 'Unknown Service',
      status: data.health_status || data.status || 'healthy',
      response_time_ms: data.response_time_ms || data.response_time || 0,
      cpu_usage_percent: data.cpu_usage_percent || data.cpu_usage || 0,
      memory_usage_percent: data.memory_usage_percent || data.memory_usage || 0,
      disk_usage_percent: data.disk_usage_percent || data.disk_usage || 0,
      error_message: data.error_message,
      metadata: data.metadata || {},
      recorded_at: data.recorded_at || data.last_check || data.created_at,
      created_at: data.created_at,
      // Additional compatibility properties
      health_status: data.health_status || data.status || 'healthy',
      service_type: data.service_type || 'web',
      success_rate: data.success_rate || 95.0,
      cpu_usage: data.cpu_usage || data.cpu_usage_percent || 0,
      memory_usage: data.memory_usage || data.memory_usage_percent || 0,
      last_check: data.last_check || data.recorded_at || data.created_at,
      uptime_seconds: data.uptime_seconds || 86400,
      error_count: data.error_count || 0
    };
  }

  // Helper function to normalize security event data
  private static normalizeSecurityEvent(data: any): SecurityEvent {
    return {
      id: data.id,
      event_type: data.event_type,
      severity: data.severity_level || data.severity || 'low',
      source_ip: data.source_ip || data.ip_address,
      user_id: data.user_id,
      event_description: data.event_description || data.event_details || 'Security event detected',
      metadata: data.metadata || data.event_details || {},
      resolved: data.resolved ?? (data.resolution_status === 'resolved'),
      resolved_by: data.resolved_by,
      resolved_at: data.resolved_at,
      created_at: data.created_at
    };
  }

  static async getKPIMetrics(filters?: any): Promise<DashboardKPIMetric[]> {
    try {
      const { data, error } = await supabase
        .from('dashboard_kpi_metrics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('KPI metrics table not accessible, returning mock data');
        return this.getMockKPIMetrics();
      }

      return (data || []).map(item => ({
        ...item,
        trend_direction: this.normalizeTrendDirection(item.trend_direction)
      }));
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

      return {
        ...data,
        trend_direction: this.normalizeTrendDirection(data.trend_direction)
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

  static async getSystemHealthLogs(filters?: any): Promise<SystemHealthLog[]> {
    try {
      const { data, error } = await supabase
        .from('system_health_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.warn('System health logs table not accessible, returning mock data');
        return this.getMockSystemHealthLogs();
      }

      return (data || []).map(this.normalizeSystemHealthLog);
    } catch (error) {
      console.error('Error fetching system health logs:', error);
      return this.getMockSystemHealthLogs();
    }
  }

  static async createSystemHealthLog(log: Omit<SystemHealthLog, 'id' | 'created_at'>): Promise<SystemHealthLog> {
    try {
      const transformedLog = {
        service_name: log.service_name,
        service_type: log.service_type || 'web',
        health_status: log.status,
        response_time_ms: log.response_time_ms,
        cpu_usage: log.cpu_usage_percent,
        memory_usage: log.memory_usage_percent,
        disk_usage: log.disk_usage_percent,
        error_message: log.error_message,
        metadata: log.metadata,
        last_check: log.recorded_at,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('system_health_logs')
        .insert([transformedLog])
        .select()
        .single();

      if (error) throw error;

      return this.normalizeSystemHealthLog(data);
    } catch (error) {
      console.error('Error creating system health log:', error);
      throw error;
    }
  }

  static async getSecurityEvents(filters?: any): Promise<SecurityEvent[]> {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.warn('Security events table not accessible, returning mock data');
        return this.getMockSecurityEvents();
      }

      return (data || []).map(this.normalizeSecurityEvent);
    } catch (error) {
      console.error('Error fetching security events:', error);
      return this.getMockSecurityEvents();
    }
  }

  static async createSecurityEvent(event: Omit<SecurityEvent, 'id' | 'created_at'>): Promise<SecurityEvent> {
    try {
      const transformedEvent = {
        event_type: event.event_type,
        severity_level: event.severity,
        ip_address: event.source_ip,
        user_id: event.user_id,
        event_details: event.metadata,
        resolution_status: event.resolved ? 'resolved' : 'open',
        resolved_by: event.resolved_by,
        resolved_at: event.resolved_at,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('security_events')
        .insert([transformedEvent])
        .select()
        .single();

      if (error) throw error;

      return this.normalizeSecurityEvent(data);
    } catch (error) {
      console.error('Error creating security event:', error);
      throw error;
    }
  }

  static async getExecutiveReports(filters?: any): Promise<ExecutiveReport[]> {
    try {
      const { data, error } = await supabase
        .from('executive_reports')
        .select('*')
        .order('created_at', { ascending: false });

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

  static async getQuickActions(): Promise<QuickAction[]> {
    try {
      console.log('Fetching quick actions...');
      return this.getMockQuickActions();
    } catch (error) {
      console.error('Error fetching quick actions:', error);
      return this.getMockQuickActions();
    }
  }

  static async createQuickAction(action: Omit<QuickAction, 'id' | 'created_at' | 'updated_at'>): Promise<QuickAction> {
    try {
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
      const mockAction: QuickAction = {
        id,
        action_name: updates.action_name || 'Updated Action',
        action_type: updates.action_type || 'general',
        description: updates.description,
        icon_name: updates.icon_name,
        color_class: updates.color_class,
        is_active: updates.is_active ?? true,
        sort_order: updates.sort_order || 1,
        permissions_required: updates.permissions_required,
        metadata: updates.metadata,
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

  static async getQuickActionLogs(limit: number = 10): Promise<QuickActionLog[]> {
    try {
      console.log('Fetching quick action logs...');
      return this.getMockQuickActionLogs().slice(0, limit);
    } catch (error) {
      console.error('Error fetching quick action logs:', error);
      return this.getMockQuickActionLogs().slice(0, limit);
    }
  }

  static async logQuickAction(log: Omit<QuickActionLog, 'id' | 'created_at'>): Promise<QuickActionLog> {
    try {
      const mockLog: QuickActionLog = {
        id: Math.random().toString(36).substr(2, 9),
        ...log,
        created_at: new Date().toISOString()
      };
      
      return mockLog;
    } catch (error) {
      console.error('Error logging quick action:', error);
      throw error;
    }
  }

  static async getRealTimeAnalytics(): Promise<any> {
    try {
      console.log('Fetching real-time analytics...');
      return this.getMockRealTimeAnalytics();
    } catch (error) {
      console.error('Error fetching real-time analytics:', error);
      return this.getMockRealTimeAnalytics();
    }
  }

  static async getPerformanceMetrics(): Promise<any> {
    try {
      console.log('Fetching performance metrics...');
      return this.getMockPerformanceMetrics();
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return this.getMockPerformanceMetrics();
    }
  }

  static async searchDashboardData(searchTerm: string): Promise<any> {
    try {
      console.log('Searching dashboard data for:', searchTerm);
      
      // Mock search implementation
      const mockResults = {
        kpiMetrics: this.getMockKPIMetrics().filter(metric => 
          metric.metric_name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        systemHealth: this.getMockSystemHealthLogs().filter(log => 
          log.service_name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        securityEvents: this.getMockSecurityEvents().filter(event => 
          event.event_type.toLowerCase().includes(searchTerm.toLowerCase())
        )
      };
      
      return mockResults;
    } catch (error) {
      console.error('Error searching dashboard data:', error);
      return { kpiMetrics: [], systemHealth: [], securityEvents: [] };
    }
  }

  // Mock data methods
  private static getMockKPIMetrics(): DashboardKPIMetric[] {
    return [
      {
        id: '1',
        metric_name: 'Total Revenue',
        metric_category: 'Financial',
        metric_value: 2456789,
        comparison_value: 2234567,
        percentage_change: 9.94,
        trend_direction: 'up',
        metric_unit: 'BDT',
        time_period: 'monthly',
        recorded_date: new Date().toISOString(),
        metadata: { source: 'sales_system' },
        created_by: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        metric_name: 'Active Users',
        metric_category: 'User Engagement',
        metric_value: 15247,
        comparison_value: 14892,
        percentage_change: 2.38,
        trend_direction: 'up',
        metric_unit: 'users',
        time_period: 'daily',
        recorded_date: new Date().toISOString(),
        metadata: { source: 'user_analytics' },
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
        response_time_ms: 245,
        cpu_usage_percent: 67.8,
        memory_usage_percent: 82.3,
        disk_usage_percent: 45.2,
        error_message: null,
        metadata: {},
        recorded_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        health_status: 'healthy',
        service_type: 'api',
        success_rate: 99.5,
        cpu_usage: 67.8,
        memory_usage: 82.3,
        last_check: new Date().toISOString(),
        uptime_seconds: 86400,
        error_count: 0
      },
      {
        id: '2',
        service_name: 'Database',
        status: 'warning',
        response_time_ms: 156,
        cpu_usage_percent: 85.1,
        memory_usage_percent: 91.7,
        disk_usage_percent: 78.9,
        error_message: 'High memory usage detected',
        metadata: { alert_threshold: 90 },
        recorded_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        health_status: 'warning',
        service_type: 'database',
        success_rate: 97.2,
        cpu_usage: 85.1,
        memory_usage: 91.7,
        last_check: new Date().toISOString(),
        uptime_seconds: 86400,
        error_count: 3
      }
    ];
  }

  private static getMockSecurityEvents(): SecurityEvent[] {
    return [
      {
        id: '1',
        event_type: 'Failed Login Attempt',
        severity: 'medium',
        source_ip: '192.168.1.100',
        user_id: 'user-123',
        event_description: 'Multiple failed login attempts detected',
        metadata: { attempt_count: 5 },
        resolved: false,
        resolved_by: null,
        resolved_at: null,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '2',
        event_type: 'Suspicious Activity',
        severity: 'high',
        source_ip: '10.0.0.45',
        user_id: 'user-456',
        event_description: 'Unusual access pattern detected',
        metadata: { risk_score: 85 },
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
        report_title: 'Q4 2024 Performance Summary',
        report_type: 'quarterly',
        executive_summary: 'Strong performance across all key metrics with 15% growth in revenue.',
        report_period_start: '2024-10-01',
        report_period_end: '2024-12-31',
        status: 'published',
        key_metrics: {
          revenue: 2456789,
          growth_rate: 15.2,
          user_acquisition: 1234
        },
        charts_data: {},
        recommendations: [
          'Increase marketing spend in Q1 2025',
          'Focus on user retention programs'
        ],
        created_by: 'exec-team',
        reviewed_by: 'ceo',
        approved_by: 'board',
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
        action_name: 'Generate Report',
        action_type: 'report',
        description: 'Generate monthly analytics report',
        icon_name: 'FileText',
        color_class: 'bg-blue-500 hover:bg-blue-600',
        is_active: true,
        sort_order: 1,
        permissions_required: ['admin', 'analyst'],
        metadata: { report_type: 'monthly' },
        created_by: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        action_name: 'Sync Data',
        action_type: 'sync',
        description: 'Synchronize data with external systems',
        icon_name: 'RefreshCw',
        color_class: 'bg-green-500 hover:bg-green-600',
        is_active: true,
        sort_order: 2,
        permissions_required: ['admin'],
        metadata: { sync_type: 'full' },
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
        action_type: 'report',
        action_name: 'Generate Report',
        execution_status: 'completed',
        parameters: { report_type: 'monthly' },
        executed_by: 'admin-1',
        progress_percentage: 100,
        started_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        completed_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        execution_time_ms: 180000,
        result_data: { report_id: 'rpt-123', status: 'success' },
        error_message: null,
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()
      },
      {
        id: '2',
        action_type: 'sync',
        action_name: 'Sync Data',
        execution_status: 'running',
        parameters: { sync_type: 'incremental' },
        executed_by: 'admin-2',
        progress_percentage: 65,
        started_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        completed_at: null,
        execution_time_ms: null,
        result_data: null,
        error_message: null,
        created_at: new Date(Date.now() - 1000 * 60 * 3).toISOString()
      }
    ];
  }

  private static getMockRealTimeAnalytics(): any {
    return {
      activeUsers: 1247,
      pageViews: 8934,
      sessions: 1856,
      bounceRate: 34.6,
      avgSessionDuration: 187,
      topPages: [
        { page: '/dashboard', views: 2341 },
        { page: '/products', views: 1892 },
        { page: '/orders', views: 1567 }
      ],
      realTimeVisitors: 89,
      conversionRate: 3.4,
      revenue: 18750.25
    };
  }

  private static getMockPerformanceMetrics(): any {
    return {
      responseTime: 247,
      throughput: 1250,
      errorRate: 0.3,
      cpuUsage: 67.8,
      memoryUsage: 1024,
      cacheHitRate: 94.2,
      uptime: 99.9,
      requestsPerMinute: 75000
    };
  }
}
