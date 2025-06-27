
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type VendorCommission = Database['public']['Tables']['vendor_commissions']['Row'];

export class CommissionAnalyticsService {
  static async getAnalytics(filters?: {
    vendor_id?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<any> {
    let query = supabase
      .from('commission_analytics')
      .select('*')
      .order('analytics_date', { ascending: false });

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
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

  static async getVendorSummary(vendorId: string): Promise<any> {
    const { data, error } = await supabase
      .from('commission_analytics')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('analytics_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getDashboardStats(): Promise<import('../commission/types').CommissionAnalytics> {
    const { data: commissions, error } = await supabase
      .from('vendor_commissions')
      .select('commission_amount, status, payment_status');

    if (error) throw error;

    const totalCommissions = commissions?.length || 0;
    const totalAmount = commissions?.reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0;
    const averageCommission = totalCommissions > 0 ? totalAmount / totalCommissions : 0;
    const pendingCommissions = commissions?.filter(c => c.status === 'pending').length || 0;
    const approvedCommissions = commissions?.filter(c => c.status === 'approved').length || 0;
    const paidCommissions = commissions?.filter(c => c.payment_status === 'paid').length || 0;

    return {
      totalCommissions,
      totalAmount,
      averageCommission,
      pendingCommissions,
      approvedCommissions,
      paidCommissions
    };
  }
}
