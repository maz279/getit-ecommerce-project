
import { supabase } from '@/integrations/supabase/client';

export interface SecurityAnalytics {
  totalEvents: number;
  criticalEvents: number;
  resolvedEvents: number;
  avgResolutionTime: number;
  topThreats: Array<{
    type: string;
    count: number;
    severity: string;
  }>;
  trendsData: Array<{
    date: string;
    events: number;
    severity: string;
  }>;
}

export class SecurityService {
  static async getSecurityEvents(filters?: any): Promise<any[]> {
    try {
      let query = supabase.from('security_events').select('*');
      
      if (filters?.severity) {
        query = query.in('severity', filters.severity);
      }
      
      if (filters?.resolved !== undefined) {
        query = query.eq('resolved', filters.resolved);
      }
      
      if (filters?.dateRange) {
        query = query
          .gte('created_at', filters.dateRange.start)
          .lte('created_at', filters.dateRange.end);
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

  static async createSecurityEvent(event: any): Promise<any> {
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

  static async updateSecurityEvent(id: string, updates: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating security event:', error);
      throw error;
    }
  }

  static async getSecurityAnalytics(period: string = '30d'): Promise<SecurityAnalytics> {
    try {
      const events = await this.getSecurityEvents({
        dateRange: this.getDateRange(period)
      });

      return this.processSecurityAnalytics(events);
    } catch (error) {
      console.error('Error fetching security analytics:', error);
      return this.getMockSecurityAnalytics();
    }
  }

  static async getSystemHealthLogs(filters?: any): Promise<any[]> {
    try {
      let query = supabase.from('system_health_logs').select('*');
      
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters?.service) {
        query = query.eq('service_name', filters.service);
      }
      
      const { data, error } = await query.order('recorded_at', { ascending: false });
      
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

  private static getDateRange(period: string): { start: string; end: string } {
    const end = new Date();
    const start = new Date();
    
    switch (period) {
      case '7d':
        start.setDate(start.getDate() - 7);
        break;
      case '30d':
        start.setDate(start.getDate() - 30);
        break;
      case '90d':
        start.setDate(start.getDate() - 90);
        break;
      default:
        start.setDate(start.getDate() - 30);
    }
    
    return {
      start: start.toISOString(),
      end: end.toISOString()
    };
  }

  private static processSecurityAnalytics(events: any[]): SecurityAnalytics {
    const totalEvents = events.length;
    const criticalEvents = events.filter(e => e.severity === 'critical').length;
    const resolvedEvents = events.filter(e => e.resolved).length;
    
    // Calculate average resolution time
    const resolvedWithTime = events.filter(e => e.resolved && e.resolved_at);
    const avgResolutionTime = resolvedWithTime.length > 0
      ? resolvedWithTime.reduce((acc, e) => {
          const created = new Date(e.created_at);
          const resolved = new Date(e.resolved_at);
          return acc + (resolved.getTime() - created.getTime());
        }, 0) / resolvedWithTime.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    // Top threats
    const threatCounts = events.reduce((acc, e) => {
      acc[e.event_type] = (acc[e.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topThreats = Object.entries(threatCounts)
      .map(([type, count]) => ({
        type,
        count,
        severity: events.find(e => e.event_type === type)?.severity || 'medium'
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Trends data (simplified)
    const trendsData = this.generateTrendsData(events);

    return {
      totalEvents,
      criticalEvents,
      resolvedEvents,
      avgResolutionTime,
      topThreats,
      trendsData
    };
  }

  private static generateTrendsData(events: any[]): Array<{ date: string; events: number; severity: string }> {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEvents = events.filter(e => 
        e.created_at.startsWith(dateStr)
      );
      
      last7Days.push({
        date: dateStr,
        events: dayEvents.length,
        severity: dayEvents.length > 10 ? 'high' : dayEvents.length > 5 ? 'medium' : 'low'
      });
    }
    
    return last7Days;
  }

  private static getMockSecurityEvents(): any[] {
    return [
      {
        id: '1',
        event_type: 'Failed Login Attempt',
        severity: 'medium',
        source_ip: '192.168.1.100',
        event_description: 'Multiple failed login attempts from IP 192.168.1.100',
        resolved: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
      },
      {
        id: '2',
        event_type: 'Suspicious File Access',
        severity: 'high',
        source_ip: '10.0.0.50',
        event_description: 'Unauthorized access attempt to sensitive files',
        resolved: true,
        resolved_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
      },
      {
        id: '3',
        event_type: 'DDoS Attack',
        severity: 'critical',
        source_ip: '203.0.113.0',
        event_description: 'High volume of requests detected from multiple IPs',
        resolved: true,
        resolved_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
      }
    ];
  }

  private static getMockSystemHealthLogs(): any[] {
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
      },
      {
        id: '3',
        service_name: 'File Storage',
        status: 'healthy',
        response_time_ms: 156,
        cpu_usage_percent: 42.3,
        memory_usage_percent: 55.1,
        recorded_at: new Date(Date.now() - 600000).toISOString()
      }
    ];
  }

  private static getMockSecurityAnalytics(): SecurityAnalytics {
    return {
      totalEvents: 45,
      criticalEvents: 3,
      resolvedEvents: 38,
      avgResolutionTime: 2.5,
      topThreats: [
        { type: 'Failed Login Attempt', count: 15, severity: 'medium' },
        { type: 'Suspicious File Access', count: 8, severity: 'high' },
        { type: 'DDoS Attack', count: 3, severity: 'critical' },
        { type: 'Malware Detection', count: 12, severity: 'high' },
        { type: 'Unauthorized API Access', count: 7, severity: 'medium' }
      ],
      trendsData: [
        { date: '2024-01-01', events: 5, severity: 'low' },
        { date: '2024-01-02', events: 8, severity: 'medium' },
        { date: '2024-01-03', events: 12, severity: 'high' },
        { date: '2024-01-04', events: 3, severity: 'low' },
        { date: '2024-01-05', events: 7, severity: 'medium' },
        { date: '2024-01-06', events: 6, severity: 'medium' },
        { date: '2024-01-07', events: 4, severity: 'low' }
      ]
    };
  }
}
