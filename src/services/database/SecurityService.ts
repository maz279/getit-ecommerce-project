
import { supabase } from '@/integrations/supabase/client';

export interface SecurityEventData {
  event_type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'data_breach_attempt' | 'unauthorized_access' | 'password_reset';
  severity_level: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  location_data?: any;
  event_details: any;
  is_blocked?: boolean;
  resolution_status?: 'open' | 'investigating' | 'resolved' | 'false_positive';
}

export interface SecurityAlert {
  id?: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  source_ip?: string;
  affected_user?: string;
  detection_time: string;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  assigned_to?: string;
  resolution_notes?: string;
}

export class SecurityService {
  // Security Events Management
  static async createSecurityEvent(eventData: SecurityEventData): Promise<any> {
    const { data, error } = await supabase
      .from('security_events')
      .insert({
        ...eventData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getSecurityEvents(filters?: {
    event_type?: string;
    severity_level?: string;
    resolution_status?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }): Promise<any[]> {
    let query = supabase
      .from('security_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.event_type) {
      query = query.eq('event_type', filters.event_type);
    }
    if (filters?.severity_level) {
      query = query.eq('severity_level', filters.severity_level);
    }
    if (filters?.resolution_status) {
      query = query.eq('resolution_status', filters.resolution_status);
    }
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async updateSecurityEvent(
    id: string,
    updates: {
      resolution_status?: string;
      resolved_by?: string;
      resolved_at?: string;
      is_blocked?: boolean;
    }
  ): Promise<any> {
    const { data, error } = await supabase
      .from('security_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // System Health Monitoring
  static async recordSystemHealth(healthData: {
    service_name: string;
    service_type: 'database' | 'api' | 'cache' | 'search' | 'payment' | 'notification';
    health_status: 'healthy' | 'warning' | 'critical' | 'down';
    response_time_ms?: number;
    cpu_usage?: number;
    memory_usage_mb?: number;
    disk_usage?: number;
    uptime_seconds?: number;
    error_count?: number;
    error_details?: any;
    alerts_triggered?: any[];
    metadata?: any;
  }): Promise<any> {
    const { data, error } = await supabase
      .from('system_health_logs')
      .insert({
        ...healthData,
        last_check: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getSystemHealthLogs(filters?: {
    service_type?: string;
    health_status?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }): Promise<any[]> {
    let query = supabase
      .from('system_health_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.service_type) {
      query = query.eq('service_type', filters.service_type);
    }
    if (filters?.health_status) {
      query = query.eq('health_status', filters.health_status);
    }
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Security Analytics
  static async getSecurityAnalytics(period: string = '30d'): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
    }

    const { data: events, error } = await supabase
      .from('security_events')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (error) throw error;

    // Group events by type and severity
    const eventsByType = events?.reduce((acc: any, event: any) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {}) || {};

    const eventsBySeverity = events?.reduce((acc: any, event: any) => {
      acc[event.severity_level] = (acc[event.severity_level] || 0) + 1;
      return acc;
    }, {}) || {};

    const resolvedEvents = events?.filter(e => e.resolution_status === 'resolved').length || 0;
    const openEvents = events?.filter(e => e.resolution_status === 'open').length || 0;
    const criticalEvents = events?.filter(e => e.severity_level === 'critical').length || 0;

    return {
      totalEvents: events?.length || 0,
      resolvedEvents,
      openEvents,
      criticalEvents,
      eventsByType,
      eventsBySeverity,
      resolutionRate: events?.length ? (resolvedEvents / events.length) * 100 : 0,
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  }

  // Threat Detection
  static async detectSuspiciousActivity(userId: string, activityData: any): Promise<boolean> {
    try {
      // Simple rule-based detection (can be enhanced with ML)
      const suspiciousIndicators = [];

      // Check for multiple failed login attempts
      const recentFailedLogins = await supabase
        .from('security_events')
        .select('*')
        .eq('user_id', userId)
        .eq('event_type', 'failed_login')
        .gte('created_at', new Date(Date.now() - 3600000).toISOString()) // Last hour
        .limit(5);

      if (recentFailedLogins.data && recentFailedLogins.data.length >= 3) {
        suspiciousIndicators.push('multiple_failed_logins');
      }

      // Check for unusual IP addresses
      if (activityData.ip_address) {
        const recentLogins = await supabase
          .from('security_events')
          .select('*')
          .eq('user_id', userId)
          .eq('event_type', 'login_attempt')
          .gte('created_at', new Date(Date.now() - 86400000).toISOString()) // Last 24 hours
          .limit(10);

        const uniqueIPs = new Set(recentLogins.data?.map(l => l.ip_address) || []);
        if (uniqueIPs.size > 3) {
          suspiciousIndicators.push('multiple_ip_addresses');
        }
      }

      // If suspicious activity detected, create security event
      if (suspiciousIndicators.length > 0) {
        await this.createSecurityEvent({
          event_type: 'suspicious_activity',
          severity_level: 'high',
          user_id: userId,
          ip_address: activityData.ip_address,
          user_agent: activityData.user_agent,
          event_details: {
            indicators: suspiciousIndicators,
            activity_data: activityData
          },
          resolution_status: 'open'
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error detecting suspicious activity:', error);
      return false;
    }
  }
}
