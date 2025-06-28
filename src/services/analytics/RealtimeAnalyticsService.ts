
import { supabase } from '@/integrations/supabase/client';

export interface RealtimeMetric {
  id?: string;
  metric_type: string;
  metric_value: number;
  user_id?: string;
  session_id?: string;
  page_url?: string;
  referrer?: string;
  device_info?: any;
  geographic_data?: any;
  dimensions?: any;
  timestamp_recorded?: string;
}

export interface AnalyticsFilter {
  metric_type?: string;
  date_from?: string;
  date_to?: string;
  user_id?: string;
  page_url?: string;
  limit?: number;
}

export class RealtimeAnalyticsService {
  // Record real-time metrics
  static async recordMetric(metric: RealtimeMetric): Promise<any> {
    const { data, error } = await supabase
      .from('realtime_analytics')
      .insert({
        ...metric,
        timestamp_recorded: metric.timestamp_recorded || new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get real-time metrics
  static async getMetrics(filters?: AnalyticsFilter): Promise<RealtimeMetric[]> {
    let query = supabase
      .from('realtime_analytics')
      .select('*')
      .order('timestamp_recorded', { ascending: false });

    if (filters?.metric_type) {
      query = query.eq('metric_type', filters.metric_type);
    }
    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    if (filters?.page_url) {
      query = query.eq('page_url', filters.page_url);
    }
    if (filters?.date_from) {
      query = query.gte('timestamp_recorded', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('timestamp_recorded', filters.date_to);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Get dashboard analytics
  static async getDashboardAnalytics(period: string = '24h'): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case '1h':
        startDate.setHours(endDate.getHours() - 1);
        break;
      case '24h':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
    }

    const { data: metrics, error } = await supabase
      .from('realtime_analytics')
      .select('*')
      .gte('timestamp_recorded', startDate.toISOString())
      .lte('timestamp_recorded', endDate.toISOString());

    if (error) throw error;

    // Process metrics for dashboard
    const activeUsers = new Set(metrics?.map(m => m.user_id).filter(Boolean)).size;
    const pageViews = metrics?.filter(m => m.metric_type === 'page_view').length || 0;
    const uniqueVisitors = new Set(metrics?.map(m => m.session_id).filter(Boolean)).size;
    
    // Group by hour for trends
    const hourlyData = metrics?.reduce((acc: any, metric: any) => {
      const hour = new Date(metric.timestamp_recorded).getHours();
      if (!acc[hour]) {
        acc[hour] = { hour, views: 0, users: new Set() };
      }
      acc[hour].views++;
      if (metric.user_id) acc[hour].users.add(metric.user_id);
      return acc;
    }, {}) || {};

    const hourlyTrends = Object.values(hourlyData).map((h: any) => ({
      hour: h.hour,
      views: h.views,
      users: h.users.size
    }));

    // Top pages
    const pageMetrics = metrics?.reduce((acc: any, metric: any) => {
      if (metric.page_url) {
        acc[metric.page_url] = (acc[metric.page_url] || 0) + 1;
      }
      return acc;
    }, {}) || {};

    const topPages = Object.entries(pageMetrics)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([page, views]) => ({ page, views }));

    return {
      activeUsers,
      pageViews,
      uniqueVisitors,
      hourlyTrends,
      topPages,
      bounceRate: this.calculateBounceRate(metrics || []),
      averageSessionDuration: this.calculateAverageSessionDuration(metrics || []),
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  }

  // Performance metrics
  static async getPerformanceMetrics(filters?: AnalyticsFilter): Promise<any> {
    const { data: metrics, error } = await supabase
      .from('performance_metrics')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(filters?.limit || 100);

    if (error) throw error;

    const avgResponseTime = metrics?.reduce((sum, m) => sum + (m.response_time_ms || 0), 0) / (metrics?.length || 1);
    const errorRate = metrics?.reduce((sum, m) => sum + (m.error_count || 0), 0) / (metrics?.length || 1);
    const successRate = ((metrics?.reduce((sum, m) => sum + (m.success_count || 0), 0) || 0) / 
                        (metrics?.length || 1)) * 100;

    // Group by endpoint
    const endpointMetrics = metrics?.reduce((acc: any, metric: any) => {
      const endpoint = metric.endpoint_path || 'unknown';
      if (!acc[endpoint]) {
        acc[endpoint] = {
          endpoint,
          total_requests: 0,
          avg_response_time: 0,
          error_count: 0,
          success_count: 0
        };
      }
      acc[endpoint].total_requests++;
      acc[endpoint].avg_response_time += metric.response_time_ms || 0;
      acc[endpoint].error_count += metric.error_count || 0;
      acc[endpoint].success_count += metric.success_count || 0;
      return acc;
    }, {}) || {};

    // Calculate averages
    Object.values(endpointMetrics).forEach((ep: any) => {
      ep.avg_response_time = ep.avg_response_time / ep.total_requests;
      ep.success_rate = (ep.success_count / ep.total_requests) * 100;
    });

    return {
      avgResponseTime,
      errorRate,
      successRate,
      totalRequests: metrics?.length || 0,
      endpointMetrics: Object.values(endpointMetrics),
      recentMetrics: metrics?.slice(0, 20) || []
    };
  }

  // Helper methods
  private static calculateBounceRate(metrics: any[]): number {
    const sessions = metrics.reduce((acc: any, metric: any) => {
      if (metric.session_id) {
        if (!acc[metric.session_id]) {
          acc[metric.session_id] = [];
        }
        acc[metric.session_id].push(metric);
      }
      return acc;
    }, {});

    const totalSessions = Object.keys(sessions).length;
    if (totalSessions === 0) return 0;

    const singlePageSessions = Object.values(sessions).filter(
      (session: any) => session.length === 1
    ).length;

    return (singlePageSessions / totalSessions) * 100;
  }

  private static calculateAverageSessionDuration(metrics: any[]): number {
    const sessions = metrics.reduce((acc: any, metric: any) => {
      if (metric.session_id) {
        if (!acc[metric.session_id]) {
          acc[metric.session_id] = [];
        }
        acc[metric.session_id].push(new Date(metric.timestamp_recorded).getTime());
      }
      return acc;
    }, {});

    const durations = Object.values(sessions).map((times: any) => {
      if (times.length < 2) return 0;
      return Math.max(...times) - Math.min(...times);
    });

    const totalDuration = durations.reduce((sum: number, duration: number) => sum + duration, 0);
    return durations.length > 0 ? totalDuration / durations.length / 1000 : 0; // Return in seconds
  }

  // Real-time dashboard updates
  static async subscribeToRealtimeUpdates(callback: (data: any) => void): Promise<any> {
    return supabase
      .channel('realtime-analytics')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'realtime_analytics' 
        }, 
        callback
      )
      .subscribe();
  }

  static async unsubscribeFromRealtimeUpdates(subscription: any): Promise<void> {
    await supabase.removeChannel(subscription);
  }
}
