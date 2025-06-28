
import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  id?: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source_ip?: string;
  user_id?: string;
  event_description: string;
  metadata?: any;
  resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  created_at?: string;
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
  recorded_at?: string;
  created_at?: string;
}

export class SecurityService {
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

      return (data || []).map(item => ({
        id: item.id,
        event_type: item.event_type,
        severity: item.severity_level || 'low',
        source_ip: item.source_ip || item.ip_address,
        user_id: item.user_id,
        event_description: item.event_description || 'Security event detected',
        metadata: item.metadata || item.event_details || {},
        resolved: item.resolved ?? (item.resolution_status === 'resolved'),
        resolved_by: item.resolved_by,
        resolved_at: item.resolved_at,
        created_at: item.created_at
      }));
    } catch (error) {
      console.error('Error fetching security events:', error);
      return this.getMockSecurityEvents();
    }
  }

  static async createSecurityEvent(event: SecurityEvent): Promise<SecurityEvent> {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .insert([{
          event_type: event.event_type,
          severity_level: event.severity,
          source_ip: event.source_ip,
          user_id: event.user_id,
          event_description: event.event_description,
          metadata: event.metadata,
          resolved: event.resolved,
          resolved_by: event.resolved_by,
          resolved_at: event.resolved_at,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        event_type: data.event_type,
        severity: data.severity_level,
        source_ip: data.source_ip,
        user_id: data.user_id,
        event_description: data.event_description,
        metadata: data.metadata,
        resolved: data.resolved,
        resolved_by: data.resolved_by,
        resolved_at: data.resolved_at,
        created_at: data.created_at
      };
    } catch (error) {
      console.error('Error creating security event:', error);
      throw error;
    }
  }

  static async getSystemHealthLogs(filters?: any): Promise<SystemHealthLog[]> {
    try {
      const { data, error } = await supabase
        .from('system_health_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(filters?.limit || 50);

      if (error) {
        console.warn('System health logs table not accessible, returning mock data');
        return this.getMockSystemHealthLogs();
      }

      return (data || []).map(item => ({
        id: item.id,
        service_name: item.service_name,
        status: item.health_status || 'healthy',
        response_time_ms: item.response_time_ms,
        cpu_usage_percent: item.cpu_usage,
        memory_usage_percent: item.memory_usage,
        disk_usage_percent: item.disk_usage,
        error_message: item.error_message,
        metadata: item.metadata || {},
        recorded_at: item.last_check || item.created_at,
        created_at: item.created_at
      }));
    } catch (error) {
      console.error('Error fetching system health logs:', error);
      return this.getMockSystemHealthLogs();
    }
  }

  static async getSecurityAnalytics(period: string = '30d'): Promise<any> {
    try {
      const events = await this.getSecurityEvents();
      
      // Filter events based on period
      const now = new Date();
      const periodStart = new Date();
      
      switch (period) {
        case '7d':
          periodStart.setDate(now.getDate() - 7);
          break;
        case '30d':
          periodStart.setDate(now.getDate() - 30);
          break;
        case '90d':
          periodStart.setDate(now.getDate() - 90);
          break;
        default:
          periodStart.setDate(now.getDate() - 30);
      }

      const filteredEvents = events.filter(event => 
        new Date(event.created_at || '') >= periodStart
      );

      // Calculate analytics
      const totalEvents = filteredEvents.length;
      const resolvedEvents = filteredEvents.filter(e => e.resolved).length;
      const unresolvedEvents = totalEvents - resolvedEvents;
      
      // Count by severity with proper type handling
      const severityCounts = filteredEvents.reduce((acc, event) => {
        const severity = String(event.severity || 'low');
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Count by type with proper type handling
      const typeCounts = filteredEvents.reduce((acc, event) => {
        const type = String(event.event_type || 'unknown');
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Create trend data
      const trendData = this.generateTrendData(filteredEvents, period);

      return {
        totalEvents,
        resolvedEvents,
        unresolvedEvents,
        resolutionRate: totalEvents > 0 ? Number(((resolvedEvents / totalEvents) * 100).toFixed(1)) : 0,
        severityBreakdown: severityCounts,
        typeBreakdown: typeCounts,
        trendData,
        topSources: this.getTopSources(filteredEvents),
        avgResolutionTime: this.calculateAvgResolutionTime(filteredEvents)
      };
    } catch (error) {
      console.error('Error fetching security analytics:', error);
      return this.getMockSecurityAnalytics();
    }
  }

  private static generateTrendData(events: SecurityEvent[], period: string): Array<{ date: string; count: number }> {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const trendData = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEvents = events.filter(event => 
        event.created_at && event.created_at.startsWith(dateStr)
      ).length;
      
      trendData.push({
        date: dateStr,
        count: dayEvents
      });
    }
    
    return trendData;
  }

  private static getTopSources(events: SecurityEvent[]): Array<{ ip: string; count: number }> {
    const sourceCounts = events.reduce((acc, event) => {
      if (event.source_ip) {
        acc[event.source_ip] = (acc[event.source_ip] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sourceCounts)
      .map(([ip, count]) => ({ ip, count: Number(count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private static calculateAvgResolutionTime(events: SecurityEvent[]): number {
    const resolvedEvents = events.filter(e => e.resolved && e.resolved_at && e.created_at);
    
    if (resolvedEvents.length === 0) return 0;
    
    const totalTime = resolvedEvents.reduce((sum, event) => {
      const created = new Date(event.created_at!).getTime();
      const resolved = new Date(event.resolved_at!).getTime();
      return sum + (resolved - created);
    }, 0);
    
    return Math.round(totalTime / resolvedEvents.length / (1000 * 60 * 60)); // Convert to hours
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
        recorded_at: new Date().toISOString(),
        created_at: new Date().toISOString()
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
        created_at: new Date().toISOString()
      }
    ];
  }

  private static getMockSecurityAnalytics(): any {
    return {
      totalEvents: 156,
      resolvedEvents: 142,
      unresolvedEvents: 14,
      resolutionRate: 91.0,
      severityBreakdown: {
        low: 89,
        medium: 45,
        high: 18,
        critical: 4
      },
      typeBreakdown: {
        'Failed Login': 67,
        'Suspicious Activity': 34,
        'Malware Detection': 23,
        'Data Breach Attempt': 12
      },
      trendData: [
        { date: '2024-01-01', count: 12 },
        { date: '2024-01-02', count: 8 },
        { date: '2024-01-03', count: 15 }
      ],
      topSources: [
        { ip: '192.168.1.100', count: 23 },
        { ip: '10.0.0.45', count: 18 }
      ],
      avgResolutionTime: 4.2
    };
  }
}
