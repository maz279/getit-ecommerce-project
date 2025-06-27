
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type VendorCommission = Database['public']['Tables']['vendor_commissions']['Row'];
type VendorCommissionRate = Database['public']['Tables']['vendor_commission_rates']['Row'];
type CommissionPayout = Database['public']['Tables']['commission_payouts']['Row'];
type CommissionAnalytics = Database['public']['Tables']['commission_analytics']['Row'];
type CommissionDispute = Database['public']['Tables']['commission_disputes']['Row'];

export class CommissionTrackingService {
  static async getDashboardStats() {
    try {
      // Get commission stats
      const { data: commissions } = await supabase
        .from('vendor_commissions')
        .select('*');

      const { data: payouts } = await supabase
        .from('commission_payouts')
        .select('*');

      const { data: disputes } = await supabase
        .from('commission_disputes')
        .select('*');

      const totalCommissions = commissions?.reduce((sum, c) => sum + Number(c.commission_amount || 0), 0) || 0;
      const pendingCommissions = commissions?.filter(c => c.status === 'pending').length || 0;
      const totalPayouts = payouts?.reduce((sum, p) => sum + Number(p.net_payout_amount || 0), 0) || 0;
      const pendingPayouts = payouts?.filter(p => p.status === 'pending').length || 0;
      const totalDisputes = disputes?.length || 0;
      const openDisputes = disputes?.filter(d => d.status === 'open').length || 0;
      const disputedAmount = disputes?.reduce((sum, d) => sum + Number(d.disputed_amount || 0), 0) || 0;

      return {
        totalCommissions,
        pendingCommissions,
        totalPayouts,
        pendingPayouts,
        totalDisputes,
        openDisputes,
        disputedAmount
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalCommissions: 0,
        pendingCommissions: 0,
        totalPayouts: 0,
        pendingPayouts: 0,
        totalDisputes: 0,
        openDisputes: 0,
        disputedAmount: 0
      };
    }
  }

  static async getCommissions(filters: {
    status?: string;
    vendorId?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}) {
    try {
      let query = supabase.from('vendor_commissions').select('*');

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.vendorId) {
        query = query.eq('vendor_id', filters.vendorId);
      }

      if (filters.dateFrom) {
        query = query.gte('transaction_date', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('transaction_date', filters.dateTo);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Type assertion to handle union types properly
      return (data || []).map(item => ({
        ...item,
        commission_type: item.commission_type as VendorCommission['commission_type'],
        status: item.status as VendorCommission['status'],
        payment_status: item.payment_status as VendorCommission['payment_status']
      }));
    } catch (error) {
      console.error('Error fetching commissions:', error);
      return [];
    }
  }

  static async getCommissionRates(vendorId?: string) {
    try {
      let query = supabase.from('vendor_commission_rates').select('*');

      if (vendorId) {
        query = query.eq('vendor_id', vendorId);
      }

      const { data, error } = await query
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type assertion to handle union types properly
      return (data || []).map(item => ({
        ...item,
        rate_type: item.rate_type as VendorCommissionRate['rate_type']
      }));
    } catch (error) {
      console.error('Error fetching commission rates:', error);
      return [];
    }
  }

  static async getPayouts(filters: {
    status?: string;
    vendorId?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}) {
    try {
      let query = supabase.from('commission_payouts').select('*');

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.vendorId) {
        query = query.eq('vendor_id', filters.vendorId);
      }

      if (filters.dateFrom) {
        query = query.gte('period_start', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('period_end', filters.dateTo);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Type assertion to handle union types properly
      return (data || []).map(item => ({
        ...item,
        status: item.status as CommissionPayout['status'],
        payment_method: item.payment_method as CommissionPayout['payment_method']
      }));
    } catch (error) {
      console.error('Error fetching payouts:', error);
      return [];
    }
  }

  static async getAnalytics(period: string = 'monthly') {
    try {
      const { data, error } = await supabase
        .from('commission_analytics')
        .select('*')
        .eq('analytics_period', period)
        .order('analytics_date', { ascending: false })
        .limit(12);

      if (error) throw error;

      // Type assertion to handle union types properly
      return (data || []).map(item => ({
        ...item,
        analytics_period: item.analytics_period as CommissionAnalytics['analytics_period']
      }));
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return [];
    }
  }

  static async getDisputes(filters: {
    status?: string;
    vendorId?: string;
    priority?: string;
  } = {}) {
    try {
      let query = supabase.from('commission_disputes').select('*');

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.vendorId) {
        query = query.eq('vendor_id', filters.vendorId);
      }

      if (filters.priority && filters.priority !== 'all') {
        query = query.eq('priority_level', filters.priority);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Type assertion to handle union types properly
      return (data || []).map(item => ({
        ...item,
        dispute_type: item.dispute_type as CommissionDispute['dispute_type'],
        status: item.status as CommissionDispute['status'],
        priority_level: item.priority_level as CommissionDispute['priority_level']
      }));
    } catch (error) {
      console.error('Error fetching disputes:', error);
      return [];
    }
  }

  static async createCommission(commission: Partial<VendorCommission>) {
    try {
      const { data, error } = await supabase
        .from('vendor_commissions')
        .insert([commission])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating commission:', error);
      throw error;
    }
  }

  static async createCommissionRate(rate: Partial<VendorCommissionRate>) {
    try {
      const { data, error } = await supabase
        .from('vendor_commission_rates')
        .insert([rate])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating commission rate:', error);
      throw error;
    }
  }

  static async createPayout(payout: Partial<CommissionPayout>) {
    try {
      const { data, error } = await supabase
        .from('commission_payouts')
        .insert([payout])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating payout:', error);
      throw error;
    }
  }

  static async updateCommissionStatus(id: string, status: VendorCommission['status']) {
    try {
      const { data, error } = await supabase
        .from('vendor_commissions')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating commission status:', error);
      throw error;
    }
  }

  static async updatePayoutStatus(id: string, status: CommissionPayout['status']) {
    try {
      const { data, error } = await supabase
        .from('commission_payouts')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating payout status:', error);
      throw error;
    }
  }

  static async resolveDispute(id: string, resolution_notes: string, adjustment_amount: number = 0) {
    try {
      const { data, error } = await supabase
        .from('commission_disputes')
        .update({
          status: 'resolved',
          resolution_notes,
          adjustment_amount,
          resolved_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error resolving dispute:', error);
      throw error;
    }
  }
}
