
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type CommissionAnalytics = Database['public']['Tables']['commission_analytics']['Row'];

export class CommissionAnalyticsService {
  static async getAnalytics(filters?: {
    vendor_id?: string;
    period?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<CommissionAnalytics[]> {
    let query = supabase
      .from('commission_analytics')
      .select('*')
      .order('analytics_date', { ascending: false });

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters?.period) {
      query = query.eq('analytics_period', filters.period);
    }
    if (filters?.date_from) {
      query = query.gte('analytics_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('analytics_date', filters.date_to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getVendorSummary(vendorId: string, period?: string): Promise<{
    total_commissions: number;
    total_revenue: number;
    average_commission: number;
    commission_count: number;
  }> {
    let query = supabase
      .from('vendor_commissions')
      .select('commission_amount, gross_amount')
      .eq('vendor_id', vendorId);

    if (period) {
      const startDate = new Date();
      switch (period) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }
      query = query.gte('transaction_date', startDate.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;

    const commissions = data || [];
    const totalCommissions = commissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0);
    const totalRevenue = commissions.reduce((sum, c) => sum + (c.gross_amount || 0), 0);

    return {
      total_commissions: totalCommissions,
      total_revenue: totalRevenue,
      average_commission: commissions.length > 0 ? totalCommissions / commissions.length : 0,
      commission_count: commissions.length
    };
  }

  static async getDashboardStats(): Promise<{
    total_commissions: number;
    pending_payouts: number;
    active_disputes: number;
    monthly_growth: number;
  }> {
    // Get total commissions
    const { data: commissions } = await supabase
      .from('vendor_commissions')
      .select('commission_amount');

    // Get pending payouts
    const { data: payouts } = await supabase
      .from('commission_payouts')
      .select('total_commission')
      .eq('status', 'pending');

    // Get active disputes
    const { data: disputes } = await supabase
      .from('commission_disputes')
      .select('id')
      .in('status', ['open', 'under_review']);

    // Calculate monthly growth
    const currentMonth = new Date();
    const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    
    const { data: currentMonthData } = await supabase
      .from('vendor_commissions')
      .select('commission_amount')
      .gte('transaction_date', currentMonth.toISOString().split('T')[0]);

    const { data: lastMonthData } = await supabase
      .from('vendor_commissions')
      .select('commission_amount')
      .gte('transaction_date', lastMonth.toISOString().split('T')[0])
      .lt('transaction_date', currentMonth.toISOString().split('T')[0]);

    const currentTotal = (currentMonthData || []).reduce((sum, c) => sum + (c.commission_amount || 0), 0);
    const lastTotal = (lastMonthData || []).reduce((sum, c) => sum + (c.commission_amount || 0), 0);
    const monthlyGrowth = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0;

    return {
      total_commissions: (commissions || []).reduce((sum, c) => sum + (c.commission_amount || 0), 0),
      pending_payouts: (payouts || []).reduce((sum, p) => sum + (p.total_commission || 0), 0),
      active_disputes: (disputes || []).length,
      monthly_growth: monthlyGrowth
    };
  }
}
