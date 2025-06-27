import { supabase } from '@/integrations/supabase/client';

export interface VendorCommission {
  id: string;
  vendor_id: string;
  order_id?: string;
  product_id?: string;
  transaction_id: string;
  commission_rate: number;
  gross_amount: number;
  commission_amount: number;
  platform_fee: number;
  net_commission: number;
  status: 'pending' | 'approved' | 'paid' | 'disputed' | 'cancelled';
  commission_type: 'product_sale' | 'service_fee' | 'advertising' | 'subscription' | 'penalty' | 'bonus';
  payment_status: 'unpaid' | 'paid' | 'partially_paid';
  transaction_date: string;
  payment_date?: string;
  payment_due_date?: string;
  calculation_date: string;
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
  rate_type: 'percentage' | 'fixed' | 'tiered';
  base_rate: number;
  tier_rates: any[];
  minimum_amount: number;
  maximum_amount?: number;
  platform_fee_rate: number;
  processing_fee: number;
  effective_from: string;
  effective_to?: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionPayout {
  id: string;
  vendor_id: string;
  payout_batch_id: string;
  commission_ids: string[];
  total_commission: number;
  platform_fees: number;
  tax_deductions: number;
  other_deductions: number;
  net_payout_amount: number;
  period_start: string;
  period_end: string;
  payment_method: 'bank_transfer' | 'mobile_banking' | 'digital_wallet' | 'check' | 'cash';
  bank_account_info?: any;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  scheduled_date?: string;
  processed_date?: string;
  processed_by?: string;
  payment_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionDispute {
  id: string;
  commission_id: string;
  vendor_id: string;
  dispute_type: 'amount_calculation' | 'payment_delay' | 'incorrect_commission' | 'platform_fee_dispute' | 'other';
  dispute_reason: string;
  dispute_description?: string;
  disputed_amount: number;
  claimed_amount?: number;
  status: 'open' | 'under_review' | 'resolved' | 'rejected' | 'escalated';
  priority_level: 'low' | 'medium' | 'high' | 'urgent';
  evidence_files: any[];
  resolution_notes?: string;
  adjustment_amount: number;
  resolved_by?: string;
  resolved_at?: string;
  created_at?: string;
  updated_at: string;
}

export interface CommissionAnalytics {
  id: string;
  vendor_id?: string;
  analytics_period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  analytics_date: string;
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
  static async getCommissions(): Promise<VendorCommission[]> {
    try {
      const { data, error } = await supabase
        .from('vendor_commissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching commissions:', error);
        // Return mock data for development
        return [
          {
            id: '1',
            vendor_id: 'vendor-001',
            order_id: 'order-001',
            product_id: 'product-001',
            transaction_id: 'TXN-001',
            commission_rate: 15.5,
            gross_amount: 5000,
            commission_amount: 775,
            platform_fee: 50,
            net_commission: 725,
            status: 'approved' as const,
            commission_type: 'product_sale' as const,
            payment_status: 'paid' as const,
            transaction_date: '2024-01-15T10:30:00Z',
            payment_date: '2024-01-20T14:15:00Z',
            calculation_date: '2024-01-15T10:30:00Z',
            category: 'Electronics',
            payment_method: 'bank_transfer',
            currency: 'BDT',
            exchange_rate: 1.0,
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-20T14:15:00Z'
          },
          {
            id: '2',
            vendor_id: 'vendor-002',
            transaction_id: 'TXN-002',
            commission_rate: 12.0,
            gross_amount: 3200,
            commission_amount: 384,
            platform_fee: 32,
            net_commission: 352,
            status: 'pending' as const,
            commission_type: 'product_sale' as const,
            payment_status: 'unpaid' as const,
            transaction_date: '2024-01-16T09:15:00Z',
            calculation_date: '2024-01-16T09:15:00Z',
            category: 'Fashion',
            currency: 'BDT',
            exchange_rate: 1.0,
            created_at: '2024-01-16T09:15:00Z',
            updated_at: '2024-01-16T09:15:00Z'
          }
        ];
      }

      // Transform database data to match interface
      return (data || []).map(item => ({
        ...item,
        commission_type: item.commission_type as VendorCommission['commission_type'],
        status: item.status as VendorCommission['status'],
        payment_status: item.payment_status as VendorCommission['payment_status']
      }));
    } catch (error) {
      console.error('Error in getCommissions:', error);
      return [];
    }
  }

  static async createCommission(commission: Partial<VendorCommission>): Promise<VendorCommission | null> {
    try {
      const commissionData = {
        vendor_id: commission.vendor_id!,
        transaction_id: commission.transaction_id!,
        commission_rate: commission.commission_rate!,
        gross_amount: commission.gross_amount!,
        commission_amount: commission.commission_amount!,
        net_commission: commission.net_commission!,
        status: commission.status || 'pending',
        commission_type: commission.commission_type!,
        payment_status: commission.payment_status || 'unpaid',
        transaction_date: commission.transaction_date!,
        calculation_date: commission.calculation_date || new Date().toISOString(),
        currency: commission.currency || 'BDT',
        exchange_rate: commission.exchange_rate || 1.0,
        platform_fee: commission.platform_fee || 0,
        order_id: commission.order_id,
        product_id: commission.product_id,
        category: commission.category,
        payment_method: commission.payment_method,
        notes: commission.notes,
        created_by: commission.created_by,
        approved_by: commission.approved_by
      };

      const { data, error } = await supabase
        .from('vendor_commissions')
        .insert([commissionData])
        .select()
        .single();

      if (error) {
        console.error('Error creating commission:', error);
        return null;
      }

      return data as VendorCommission;
    } catch (error) {
      console.error('Error in createCommission:', error);
      return null;
    }
  }

  static async getCommissionRates(): Promise<VendorCommissionRate[]> {
    try {
      const { data, error } = await supabase
        .from('vendor_commission_rates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching commission rates:', error);
        return [
          {
            id: '1',
            vendor_id: 'vendor-001',
            category_id: 'electronics',
            rate_type: 'percentage' as const,
            base_rate: 15.5,
            tier_rates: [],
            minimum_amount: 0,
            maximum_amount: 50000,
            platform_fee_rate: 2.5,
            processing_fee: 25,
            effective_from: '2024-01-01',
            is_active: true,
            created_by: 'admin-001',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        ];
      }

      return (data || []).map(item => ({
        ...item,
        tier_rates: Array.isArray(item.tier_rates) ? item.tier_rates : [],
        rate_type: item.rate_type as VendorCommissionRate['rate_type']
      }));
    } catch (error) {
      console.error('Error in getCommissionRates:', error);
      return [];
    }
  }

  static async createCommissionRate(rate: Partial<VendorCommissionRate>): Promise<VendorCommissionRate | null> {
    try {
      const rateData = {
        vendor_id: rate.vendor_id!,
        rate_type: rate.rate_type!,
        base_rate: rate.base_rate!,
        created_by: rate.created_by!,
        tier_rates: rate.tier_rates || [],
        minimum_amount: rate.minimum_amount || 0,
        maximum_amount: rate.maximum_amount,
        platform_fee_rate: rate.platform_fee_rate || 0,
        processing_fee: rate.processing_fee || 0,
        effective_from: rate.effective_from || new Date().toISOString().split('T')[0],
        effective_to: rate.effective_to,
        is_active: rate.is_active !== false,
        category_id: rate.category_id,
        product_type: rate.product_type
      };

      const { data, error } = await supabase
        .from('vendor_commission_rates')
        .insert([rateData])
        .select()
        .single();

      if (error) {
        console.error('Error creating commission rate:', error);
        return null;
      }

      return data as VendorCommissionRate;
    } catch (error) {
      console.error('Error in createCommissionRate:', error);
      return null;
    }
  }

  static async getPayouts(): Promise<CommissionPayout[]> {
    try {
      const { data, error } = await supabase
        .from('commission_payouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payouts:', error);
        return [
          {
            id: '1',
            vendor_id: 'vendor-001',
            payout_batch_id: 'BATCH-001',
            commission_ids: ['comm-001', 'comm-002'],
            total_commission: 1500,
            platform_fees: 150,
            tax_deductions: 75,
            other_deductions: 25,
            net_payout_amount: 1250,
            period_start: '2024-01-01',
            period_end: '2024-01-31',
            payment_method: 'bank_transfer' as const,
            status: 'completed' as const,
            processed_date: '2024-02-05T10:00:00Z',
            created_at: '2024-02-01T00:00:00Z',
            updated_at: '2024-02-05T10:00:00Z'
          }
        ];
      }

      return (data || []).map(item => ({
        ...item,
        commission_ids: Array.isArray(item.commission_ids) ? item.commission_ids as string[] : [],
        payment_method: item.payment_method as CommissionPayout['payment_method'],
        status: item.status as CommissionPayout['status']
      }));
    } catch (error) {
      console.error('Error in getPayouts:', error);
      return [];
    }
  }

  static async createPayout(payout: Partial<CommissionPayout>): Promise<CommissionPayout | null> {
    try {
      const payoutData = {
        vendor_id: payout.vendor_id!,
        payout_batch_id: payout.payout_batch_id!,
        total_commission: payout.total_commission!,
        net_payout_amount: payout.net_payout_amount!,
        period_start: payout.period_start!,
        period_end: payout.period_end!,
        payment_method: payout.payment_method!,
        commission_ids: payout.commission_ids || [],
        platform_fees: payout.platform_fees || 0,
        tax_deductions: payout.tax_deductions || 0,
        other_deductions: payout.other_deductions || 0,
        status: payout.status || 'pending',
        scheduled_date: payout.scheduled_date,
        processed_date: payout.processed_date,
        processed_by: payout.processed_by,
        payment_reference: payout.payment_reference,
        bank_account_info: payout.bank_account_info,
        notes: payout.notes
      };

      const { data, error } = await supabase
        .from('commission_payouts')
        .insert([payoutData])
        .select()
        .single();

      if (error) {
        console.error('Error creating payout:', error);
        return null;
      }

      return data as CommissionPayout;
    } catch (error) {
      console.error('Error in createPayout:', error);
      return null;
    }
  }

  static async getDisputes(): Promise<CommissionDispute[]> {
    try {
      const { data, error } = await supabase
        .from('commission_disputes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching disputes:', error);
        return [
          {
            id: '1',
            commission_id: 'comm-001',
            vendor_id: 'vendor-001',
            dispute_type: 'amount_calculation' as const,
            dispute_reason: 'Incorrect commission calculation',
            dispute_description: 'The commission was calculated at 10% instead of 15%',
            disputed_amount: 250,
            claimed_amount: 500,
            status: 'open' as const,
            priority_level: 'high' as const,
            evidence_files: [],
            adjustment_amount: 0,
            created_at: '2024-01-20T09:00:00Z',
            updated_at: '2024-01-20T09:00:00Z'
          }
        ];
      }

      return (data || []).map(item => ({
        ...item,
        dispute_type: item.dispute_type as CommissionDispute['dispute_type'],
        status: item.status as CommissionDispute['status'],
        priority_level: item.priority_level as CommissionDispute['priority_level'],
        evidence_files: Array.isArray(item.evidence_files) ? item.evidence_files : []
      }));
    } catch (error) {
      console.error('Error in getDisputes:', error);
      return [];
    }
  }

  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      // In a real implementation, these would be calculated from the database
      return {
        totalCommissions: 125000,
        pendingCommissions: 15,
        totalPayouts: 98000,
        pendingPayouts: 8,
        totalDisputes: 3,
        openDisputes: 2,
        disputedAmount: 1500
      };
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
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
}
