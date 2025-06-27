
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Export all the interfaces so they can be imported by other components
export interface VendorCommission {
  id: string;
  vendor_id: string;
  order_id: string | null;
  product_id: string | null;
  transaction_id: string;
  commission_type: 'product_sale' | 'service_fee' | 'advertising' | 'subscription' | 'penalty' | 'bonus';
  commission_rate: number;
  gross_amount: number;
  commission_amount: number;
  platform_fee: number;
  net_commission: number;
  status: 'pending' | 'calculated' | 'approved' | 'paid' | 'disputed' | 'refunded';
  payment_status: 'unpaid' | 'processing' | 'paid' | 'failed' | 'cancelled';
  transaction_date: string;
  calculation_date: string;
  payment_due_date?: string;
  payment_date?: string;
  category?: string;
  payment_method?: string;
  currency: string;
  exchange_rate: number;
  notes?: string;
  created_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorCommissionRate {
  id: string;
  vendor_id: string;
  category_id?: string;
  product_type?: string;
  rate_type: 'percentage' | 'fixed_amount' | 'tiered';
  base_rate: number;
  minimum_amount: number;
  maximum_amount?: number;
  tier_rates: any[];
  effective_from: string;
  effective_to?: string;
  is_active: boolean;
  platform_fee_rate: number;
  processing_fee: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionPayout {
  id: string;
  vendor_id: string;
  payout_batch_id: string;
  total_commission: number;
  platform_fees: number;
  tax_deductions: number;
  other_deductions: number;
  net_payout_amount: number;
  period_start: string;
  period_end: string;
  payment_method: 'bank_transfer' | 'mobile_banking' | 'digital_wallet' | 'check' | 'cash';
  payment_reference?: string;
  bank_account_info?: any;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  scheduled_date?: string;
  processed_date?: string;
  commission_ids: string[];
  notes?: string;
  processed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionDispute {
  id: string;
  commission_id: string;
  vendor_id: string;
  dispute_type: 'calculation_error' | 'rate_discrepancy' | 'missing_commission' | 'overpayment' | 'refund_issue' | 'other';
  dispute_reason: string;
  dispute_description?: string;
  evidence_files: any[];
  disputed_amount: number;
  claimed_amount?: number;
  status: 'open' | 'under_review' | 'resolved' | 'rejected' | 'escalated';
  priority_level: 'low' | 'medium' | 'high' | 'urgent';
  resolution_notes?: string;
  adjustment_amount: number;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionAnalytics {
  id: string;
  vendor_id?: string;
  analytics_date: string;
  analytics_period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  total_gross_sales: number;
  total_commission_earned: number;
  total_platform_fees: number;
  net_commission: number;
  total_orders: number;
  average_commission_per_order: number;
  commission_rate_percentage: number;
  category_breakdown: any;
  previous_period_commission: number;
  growth_percentage: number;
  created_at: string;
}

export interface DashboardStats {
  totalCommissions: number;
  pendingCommissions: number;
  totalPayouts: number;
  pendingPayouts: number;
  totalDisputes: number;
  openDisputes: number;
  disputedAmount: number;
}

export class CommissionTrackingService {
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get commission stats
      const { data: commissions } = await supabase
        .from('vendor_commissions')
        .select('commission_amount, status');

      // Get payout stats
      const { data: payouts } = await supabase
        .from('commission_payouts')
        .select('net_payout_amount, status');

      // Get dispute stats
      const { data: disputes } = await supabase
        .from('commission_disputes')
        .select('disputed_amount, status');

      const totalCommissions = commissions?.reduce((sum, c) => sum + Number(c.commission_amount), 0) || 0;
      const pendingCommissions = commissions?.filter(c => c.status === 'pending').length || 0;
      
      const totalPayouts = payouts?.reduce((sum, p) => sum + Number(p.net_payout_amount), 0) || 0;
      const pendingPayouts = payouts?.filter(p => p.status === 'pending').length || 0;
      
      const totalDisputes = disputes?.length || 0;
      const openDisputes = disputes?.filter(d => d.status === 'open').length || 0;
      const disputedAmount = disputes?.reduce((sum, d) => sum + Number(d.disputed_amount), 0) || 0;

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

  static async getCommissions(): Promise<VendorCommission[]> {
    try {
      const { data, error } = await supabase
        .from('vendor_commissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        commission_type: item.commission_type as VendorCommission['commission_type'],
        status: item.status as VendorCommission['status'],
        payment_status: item.payment_status as VendorCommission['payment_status']
      }));
    } catch (error) {
      console.error('Error fetching commissions:', error);
      // Return mock data for development
      return [
        {
          id: '1',
          vendor_id: 'vendor-1',
          order_id: 'order-123',
          product_id: 'product-456',
          transaction_id: 'TXN-001',
          commission_type: 'product_sale',
          commission_rate: 8.5,
          gross_amount: 1000,
          commission_amount: 85,
          platform_fee: 5,
          net_commission: 80,
          status: 'pending',
          payment_status: 'unpaid',
          transaction_date: '2024-01-15T10:30:00Z',
          calculation_date: '2024-01-15T10:30:00Z',
          category: 'Electronics',
          currency: 'BDT',
          exchange_rate: 1,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        }
      ];
    }
  }

  static async getCommissionRates(): Promise<VendorCommissionRate[]> {
    try {
      const { data, error } = await supabase
        .from('vendor_commission_rates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        rate_type: item.rate_type as VendorCommissionRate['rate_type']
      }));
    } catch (error) {
      console.error('Error fetching commission rates:', error);
      // Return mock data for development
      return [
        {
          id: '1',
          vendor_id: 'vendor-1',
          product_type: 'Electronics',
          rate_type: 'percentage',
          base_rate: 8.5,
          minimum_amount: 0,
          tier_rates: [],
          effective_from: '2024-01-01',
          is_active: true,
          platform_fee_rate: 2.5,
          processing_fee: 0,
          created_by: 'admin-1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];
    }
  }

  static async getPayouts(): Promise<CommissionPayout[]> {
    try {
      const { data, error } = await supabase
        .from('commission_payouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        payment_method: item.payment_method as CommissionPayout['payment_method'],
        status: item.status as CommissionPayout['status'],
        commission_ids: Array.isArray(item.commission_ids) ? item.commission_ids : []
      }));
    } catch (error) {
      console.error('Error fetching payouts:', error);
      // Return mock data for development
      return [
        {
          id: '1',
          vendor_id: 'vendor-1',
          payout_batch_id: 'BATCH-001',
          total_commission: 1000,
          platform_fees: 50,
          tax_deductions: 100,
          other_deductions: 0,
          net_payout_amount: 850,
          period_start: '2024-01-01',
          period_end: '2024-01-31',
          payment_method: 'bank_transfer',
          status: 'pending',
          commission_ids: ['comm-1', 'comm-2'],
          created_at: '2024-02-01T00:00:00Z',
          updated_at: '2024-02-01T00:00:00Z'
        }
      ];
    }
  }

  static async getDisputes(): Promise<CommissionDispute[]> {
    try {
      const { data, error } = await supabase
        .from('commission_disputes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        dispute_type: item.dispute_type as CommissionDispute['dispute_type'],
        status: item.status as CommissionDispute['status'],
        priority_level: item.priority_level as CommissionDispute['priority_level'],
        evidence_files: Array.isArray(item.evidence_files) ? item.evidence_files : []
      }));
    } catch (error) {
      console.error('Error fetching disputes:', error);
      // Return mock data for development
      return [
        {
          id: '1',
          commission_id: 'comm-1',
          vendor_id: 'vendor-1',
          dispute_type: 'calculation_error',
          dispute_reason: 'Commission rate applied incorrectly',
          disputed_amount: 25,
          status: 'open',
          priority_level: 'medium',
          adjustment_amount: 0,
          evidence_files: [],
          created_at: '2024-01-20T00:00:00Z',
          updated_at: '2024-01-20T00:00:00Z'
        }
      ];
    }
  }

  // Create operations with proper typing
  static async createCommission(commission: Omit<VendorCommission, 'id' | 'created_at' | 'updated_at'>): Promise<VendorCommission> {
    const { data, error } = await supabase
      .from('vendor_commissions')
      .insert([commission])
      .select()
      .single();

    if (error) throw error;
    return data as VendorCommission;
  }

  static async createCommissionRate(rate: Omit<VendorCommissionRate, 'id' | 'created_at' | 'updated_at'>): Promise<VendorCommissionRate> {
    const { data, error } = await supabase
      .from('vendor_commission_rates')
      .insert([rate])
      .select()
      .single();

    if (error) throw error;
    return data as VendorCommissionRate;
  }

  static async createPayout(payout: Omit<CommissionPayout, 'id' | 'created_at' | 'updated_at'>): Promise<CommissionPayout> {
    const { data, error } = await supabase
      .from('commission_payouts')
      .insert([payout])
      .select()
      .single();

    if (error) throw error;
    return data as CommissionPayout;
  }
}
