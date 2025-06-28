
import { supabase } from '@/integrations/supabase/client';

export interface UserActivity {
  id?: string;
  user_id?: string;
  activity_type: string;
  activity_description: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
  created_at?: string;
}

export class UserActivityService {
  static async getUserActivities(filters?: any): Promise<UserActivity[]> {
    try {
      let query = supabase.from('user_activity_logs').select('*');
      
      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      
      if (filters?.activity_type) {
        query = query.eq('activity_type', filters.activity_type);
      }
      
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters?.dateRange) {
        query = query
          .gte('created_at', filters.dateRange.start)
          .lte('created_at', filters.dateRange.end);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.warn('User activity logs table not accessible, returning mock data');
        return this.getMockUserActivities();
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching user activities:', error);
      return this.getMockUserActivities();
    }
  }

  static async logUserActivity(activity: UserActivity): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_activity_logs')
        .insert([{
          ...activity,
          created_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error('Error logging user activity:', error);
      }
    } catch (error) {
      console.error('Error logging user activity:', error);
    }
  }

  static async getUserActivityAnalytics(period: string = '30d'): Promise<any> {
    try {
      const dateRange = this.getDateRange(period);
      const activities = await this.getUserActivities({ dateRange });
      
      return this.processActivityAnalytics(activities);
    } catch (error) {
      console.error('Error fetching user activity analytics:', error);
      return this.getMockActivityAnalytics();
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

  private static processActivityAnalytics(activities: UserActivity[]): any {
    const totalActivities = activities.length;
    const uniqueUsers = new Set(activities.map(a => a.user_id).filter(Boolean)).size;
    
    // Activity types breakdown
    const activityTypes = activities.reduce((acc, activity) => {
      acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Daily activity trends
    const dailyTrends = this.generateDailyTrends(activities);
    
    // Top active users
    const userActivityCounts = activities.reduce((acc, activity) => {
      if (activity.user_id) {
        acc[activity.user_id] = (acc[activity.user_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const topUsers = Object.entries(userActivityCounts)
      .map(([userId, count]) => ({ userId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      totalActivities,
      uniqueUsers,
      activityTypes,
      dailyTrends,
      topUsers,
      avgActivitiesPerUser: uniqueUsers > 0 ? Math.round(totalActivities / uniqueUsers) : 0
    };
  }

  private static generateDailyTrends(activities: UserActivity[]): Array<{ date: string; count: number }> {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayActivities = activities.filter(a => 
        a.created_at && a.created_at.startsWith(dateStr)
      ).length;
      
      last7Days.push({
        date: dateStr,
        count: dayActivities
      });
    }
    
    return last7Days;
  }

  private static getMockUserActivities(): UserActivity[] {
    return [
      {
        id: '1',
        user_id: 'user-1',
        activity_type: 'login',
        activity_description: 'User logged in successfully',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
      },
      {
        id: '2',
        user_id: 'user-2',
        activity_type: 'order_placed',
        activity_description: 'User placed order #12345',
        ip_address: '192.168.1.101',
        metadata: { order_id: '12345', amount: 150.00 },
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '3',
        user_id: 'user-1',
        activity_type: 'profile_updated',
        activity_description: 'User updated profile information',
        ip_address: '192.168.1.100',
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        id: '4',
        user_id: 'user-3',
        activity_type: 'password_changed',
        activity_description: 'User changed password',
        ip_address: '192.168.1.102',
        created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString()
      }
    ];
  }

  private static getMockActivityAnalytics(): any {
    return {
      totalActivities: 156,
      uniqueUsers: 23,
      activityTypes: {
        login: 45,
        logout: 42,
        order_placed: 28,
        profile_updated: 15,
        password_changed: 8,
        product_viewed: 18
      },
      dailyTrends: [
        { date: '2024-01-01', count: 18 },
        { date: '2024-01-02', count: 22 },
        { date: '2024-01-03', count: 15 },
        { date: '2024-01-04', count: 28 },
        { date: '2024-01-05', count: 31 },
        { date: '2024-01-06', count: 25 },
        { date: '2024-01-07', count: 17 }
      ],
      topUsers: [
        { userId: 'user-1', count: 15 },
        { userId: 'user-2', count: 12 },
        { userId: 'user-3', count: 9 },
        { userId: 'user-4', count: 8 },
        { userId: 'user-5', count: 7 }
      ],
      avgActivitiesPerUser: 7
    };
  }
}
