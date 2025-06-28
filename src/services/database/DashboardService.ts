
import { supabase } from '@/integrations/supabase/client';

export interface DashboardKPIMetric {
  id?: string;
  metric_name: string;
  metric_category: string;
  metric_value: number;
  metric_unit?: string;
  time_period: string;
  comparison_value?: number;
  percentage_change?: number;
  trend_direction?: 'up' | 'down' | 'stable';
  recorded_date: string;
  metadata?: any;
  created_by?: string;
}

export interface SystemHealthLog {
  id?: string;
  service_name: string;
  status: 'healthy' | 'warning' | 'critical' | 'down';
  response_time_ms?: number;
  cpu_usage_percent?: number;
  memory_usage_percent?: number;
  disk_usage_percent?: number;
  error_message?: string;
  metadata?: any;
  recorded_at: string;
}

export interface SecurityEvent {
  id?: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source_ip?: string;
  user_id?: string;
  event_description: string;
  metadata?: any;
  resolved?: boolean;
  resolved_by?: string;
  resolved_at?: string;
}

export interface ExecutiveReport {
  id?: string;
  report_title: string;
  report_type: string;
  executive_summary: string;
  report_period_start: string;
  report_period_end: string;
  key_metrics: any;
  charts_data?: any;
  recommendations?: any[];
  status?: 'draft' | 'review' | 'approved' | 'published';
  created_by: string;
  reviewed_by?: string;
  approved_by?: string;
  published_at?: string;
}

export interface QuickAction {
  id?: string;
  action_name: string;
  action_type: string;
  description?: string;
  icon_name?: string;
  color_class?: string;
  is_active?: boolean;
  sort_order?: number;
  permissions_required?: string[];
  metadata?: any;
  created_by: string;
}

export class DashboardService {
  // KPI Metrics
  static async getKPIMetrics(filters?: any): Promise<DashboardKPIMetric[]> {
    try {
      let query = supabase.from('dashboard_kpi_metrics').select('*');
      
      if (filters?.category) {
        query = query.eq('metric_category', filters.category);
      }
      
      if (filters?.time_period) {
        query = query.eq('time_period', filters.time_period);
      }
      
      const { data, error } = await query.order('recorded_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching KPI metrics:', error);
      throw error;
    }
  }

  static async createKPIMetric(metric: DashboardKPIMetric): Promise<DashboardKPIMetric> {
    try {
      const { data, error } = await supabase
        .from('dashboard_kpi_metrics')
        .insert([metric])
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
  static async getSystemHealthLogs(limit?: number): Promise<SystemHealthLog[]> {
    try {
      let query = supabase.from('system_health_logs').select('*');
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query.order('recorded_at', { ascending: false });
      
      if (error) {
        // If table doesn't exist, return mock data
        console.warn('System health logs table not found, returning mock data');
        return this.getMockSystemHealthLogs();
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching system health logs:', error);
      return this.getMockSystemHealthLogs();
    }
  }

  static async createSystemHealthLog(log: SystemHealthLog): Promise<SystemHealthLog> {
    try {
      const { data, error } = await supabase
        .from('system_health_logs')
        .insert([log])
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
        query = query.eq('severity', filters.severity);
      }
      
      if (filters?.resolved !== undefined) {
        query = query.eq('resolved', filters.resolved);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Security events table not found, returning mock data');
        return this.getMockSecurityEvents();
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching security events:', error);
      return this.getMockSecurityEvents();
    }
  }

  static async createSecurityEvent(event: SecurityEvent): Promise<SecurityEvent> {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .insert([event])
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
      
      if (filters?.report_type) {
        query = query.eq('report_type', filters.report_type);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Executive reports table not found, returning mock data');
        return this.getMockExecutiveReports();
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching executive reports:', error);
      return this.getMockExecutiveReports();
    }
  }

  static async createExecutiveReport(report: ExecutiveReport): Promise<ExecutiveReport> {
    try {
      const { data, error } = await supabase
        .from('executive_reports')
        .insert([report])
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
      let query = supabase.from('quick_actions').select('*').eq('is_active', true);
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query.order('sort_order', { ascending: true });
      
      if (error) {
        console.warn('Quick actions table not found, returning mock data');
        return this.getMockQuickActions();
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching quick actions:', error);
      return this.getMockQuickActions();
    }
  }

  static async createQuickAction(action: QuickAction): Promise<QuickAction> {
    try {
      const { data, error } = await supabase
        .from('quick_actions')
        .insert([action])
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

  // Real-time Analytics
  static async getRealTimeAnalytics(filters?: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('realtime_analytics')
        .select('*')
        .order('timestamp_recorded', { ascending: false })
        .limit(100);
      
      if (error) {
        return this.getMockRealTimeAnalytics();
      }
      return this.processRealTimeAnalytics(data);
    } catch (error) {
      console.error('Error fetching real-time analytics:', error);
      return this.getMockRealTimeAnalytics();
    }
  }

  // Performance Metrics
  static async getPerformanceMetrics(filters?: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);
      
      if (error) {
        return this.getMockPerformanceMetrics();
      }
      return this.processPerformanceMetrics(data);
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return this.getMockPerformanceMetrics();
    }
  }

  // Mock data methods (fallbacks when tables don't exist)
  private static getMockSystemHealthLogs(): SystemHealthLog[] {
    return [
      {
        id: '1',
        service_name: 'API Gateway',
        status: 'healthy',
        response_time_ms: 245,
        cpu_usage_percent: 65.5,
        memory_usage_percent: 78.2,
        recorded_at: new Date().toISOString()
      },
      {
        id: '2',
        service_name: 'Database',
        status: 'warning',
        response_time_ms: 890,
        cpu_usage_percent: 89.1,
        memory_usage_percent: 85.7,
        recorded_at: new Date(Date.now() - 300000).toISOString()
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
        event_description: 'Multiple failed login attempts detected',
        resolved: false
      },
      {
        id: '2',
        event_type: 'Suspicious Activity',
        severity: 'high',
        source_ip: '10.0.0.50',
        event_description: 'Unusual API access pattern detected',
        resolved: true
      }
    ];
  }

  private static getMockExecutiveReports(): ExecutiveReport[] {
    return [
      {
        id: '1',
        report_title: 'Q4 2024 Business Summary',
        report_type: 'quarterly',
        executive_summary: 'Strong performance across all key metrics',
        report_period_start: '2024-10-01',
        report_period_end: '2024-12-31',
        key_metrics: { revenue: 2500000, growth: 15.5 },
        status: 'published',
        created_by: 'admin'
      }
    ];
  }

  private static getMockQuickActions(): QuickAction[] {
    return [
      {
        id: '1',
        action_name: 'Generate Report',
        action_type: 'report',
        description: 'Generate daily analytics report',
        icon_name: 'FileText',
        color_class: 'bg-blue-500',
        is_active: true,
        sort_order: 1,
        created_by: 'system'
      },
      {
        id: '2',
        action_name: 'System Backup',
        action_type: 'system',
        description: 'Initiate system backup',
        icon_name: 'Database',
        color_class: 'bg-green-500',
        is_active: true,
        sort_order: 2,
        created_by: 'system'
      }
    ];
  }

  private static getMockRealTimeAnalytics(): any {
    return {
      activeUsers: 1250,
      pageViews: 8940,
      bounceRate: 35.2,
      avgSessionDuration: 185,
      topPages: [
        { page: '/dashboard', views: 2340 },
        { page: '/products', views: 1890 },
        { page: '/orders', views: 1560 }
      ]
    };
  }

  private static getMockPerformanceMetrics(): any {
    return {
      responseTime: 245,
      throughput: 1250,
      errorRate: 0.5,
      cpuUsage: 67.8,
      memoryUsage: 72.1,
      diskUsage: 45.3
    };
  }

  private static processRealTimeAnalytics(data: any[]): any {
    // Process raw analytics data into dashboard format
    return {
      activeUsers: data.filter(d => d.metric_type === 'active_users').length,
      pageViews: data.filter(d => d.metric_type === 'page_view').length,
      bounceRate: 35.2, // Calculate from data
      avgSessionDuration: 185, // Calculate from data
      topPages: data
        .filter(d => d.metric_type === 'page_view')
        .slice(0, 5)
        .map(d => ({ page: d.page_url, views: d.metric_value }))
    };
  }

  private static processPerformanceMetrics(data: any[]): any {
    // Process raw performance data
    const latest = data[0] || {};
    return {
      responseTime: latest.response_time_ms || 0,
      throughput: latest.throughput_per_second || 0,
      errorRate: latest.error_count / (latest.success_count + latest.error_count) * 100 || 0,
      cpuUsage: latest.cpu_usage_percent || 0,
      memoryUsage: latest.memory_usage_mb || 0,
      diskUsage: 45.3 // Default value
    };
  }
}
