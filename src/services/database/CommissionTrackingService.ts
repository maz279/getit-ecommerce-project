
import { supabase } from '@/integrations/supabase/client';

export interface VendorCommission {
  id?: string;
  vendor_id: string;
  order_id?: string;
  product_id?: string;
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
  calculation_date?: string;
  payment_due_date?: string;
  payment_date?: string;
  category?: string;
  payment_method?: string;
  currency: string;
  exchange_rate: number;
  notes?: string;
  created_by?: string;
  approved_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VendorCommissionRate {
  id?: string;
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
  created_at?: string;
  updated_at?: string;
}

export interface CommissionPayout {
  id?: string;
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
  created_at?: string;
  updated_at?: string;
}

export interface CommissionDispute {
  id?: string;
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
  created_at?: string;
  updated_at?: string;
}

export interface CommissionAnalytics {
  id?: string;
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
  created_at?: string;
}

export class CommissionTrackingService {
  // Commission Management
  static async getCommissions(filters?: any): Promise<VendorCommission[]> {
    let query = supabase.from('vendor_commissions').select('*');
    
    if (filters?.vendor_id) query = query.eq('vendor_id', filters.vendor_id);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.payment_status) query = query.eq('payment_status', filters.payment_status);
    if (filters?.commission_type) query = query.eq('commission_type', filters.commission_type);
    if (filters?.date_from) query = query.gte('transaction_date', filters.date_from);
    if (filters?.date_to) query = query.lte('transaction_date', filters.date_to);
    
    query = query.order('transaction_date', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createCommission(commission: Omit<VendorCommission, 'id'>): Promise<VendorCommission> {
    const { data, error } = await supabase
      .from('vendor_commissions')
      .insert(commission)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateCommission(id: string, updates: Partial<VendorCommission>): Promise<VendorCommission> {
    const { data, error } = await supabase
      .from('vendor_commissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteCommission(id: string): Promise<void> {
    const { error } = await supabase
      .from('vendor_commissions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Commission Rates Management
  static async getCommissionRates(filters?: any): Promise<VendorCommissionRate[]> {
    let query = supabase.from('vendor_commission_rates').select('*');
    
    if (filters?.vendor_id) query = query.eq('vendor_id', filters.vendor_id);
    if (filters?.is_active !== undefined) query = query.eq('is_active', filters.is_active);
    if (filters?.product_type) query = query.eq('product_type', filters.product_type);
    
    query = query.order('effective_from', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createCommissionRate(rate: Omit<VendorCommissionRate, 'id'>): Promise<VendorCommissionRate> {
    const { data, error } = await supabase
      .from('vendor_commission_rates')
      .insert(rate)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateCommissionRate(id: string, updates: Partial<VendorCommissionRate>): Promise<VendorCommissionRate> {
    const { data, error } = await supabase
      .from('vendor_commission_rates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Payout Management
  static async getPayouts(filters?: any): Promise<CommissionPayout[]> {
    let query = supabase.from('commission_payouts').select('*');
    
    if (filters?.vendor_id) query = query.eq('vendor_id', filters.vendor_id);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.payment_method) query = query.eq('payment_method', filters.payment_method);
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createPayout(payout: Omit<CommissionPayout, 'id'>): Promise<CommissionPayout> {
    const { data, error } = await supabase
      .from('commission_payouts')
      .insert(payout)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updatePayoutStatus(id: string, status: string, processedBy?: string): Promise<CommissionPayout> {
    const updates: any = { status };
    if (status === 'completed') {
      updates.processed_date = new Date().toISOString();
      updates.processed_by = processedBy;
    }
    
    const { data, error } = await supabase
      .from('commission_payouts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Analytics
  static async getCommissionAnalytics(filters?: any): Promise<CommissionAnalytics[]> {
    let query = supabase.from('commission_analytics').select('*');
    
    if (filters?.vendor_id) query = query.eq('vendor_id', filters.vendor_id);
    if (filters?.analytics_period) query = query.eq('analytics_period', filters.analytics_period);
    if (filters?.date_from) query = query.gte('analytics_date', filters.date_from);
    if (filters?.date_to) query = query.lte('analytics_date', filters.date_to);
    
    query = query.order('analytics_date', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async generateAnalytics(period: string, vendorId?: string): Promise<CommissionAnalytics> {
    // This would typically be done via a stored procedure or edge function
    // For now, we'll create a basic analytics entry
    const analytics = {
      vendor_id: vendorId,
      analytics_date: new Date().toISOString().split('T')[0],
      analytics_period: period as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
      total_gross_sales: 0,
      total_commission_earned: 0,
      total_platform_fees: 0,
      net_commission: 0,
      total_orders: 0,
      average_commission_per_order: 0,
      commission_rate_percentage: 0,
      category_breakdown: {},
      previous_period_commission: 0,
      growth_percentage: 0
    };

    const { data, error } = await supabase
      .from('commission_analytics')
      .insert(analytics)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Dispute Management
  static async getDisputes(filters?: any): Promise<CommissionDispute[]> {
    let query = supabase.from('commission_disputes').select('*');
    
    if (filters?.vendor_id) query = query.eq('vendor_id', filters.vendor_id);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.priority_level) query = query.eq('priority_level', filters.priority_level);
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createDispute(dispute: Omit<CommissionDispute, 'id'>): Promise<CommissionDispute> {
    const { data, error } = await supabase
      .from('commission_disputes')
      .insert(dispute)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async resolveDispute(id: string, resolutionNotes: string, adjustmentAmount: number, resolvedBy: string): Promise<CommissionDispute> {
    const { data, error } = await supabase
      .from('commission_disputes')
      .update({
        status: 'resolved',
        resolution_notes: resolutionNotes,
        adjustment_amount: adjustmentAmount,
        resolved_by: resolvedBy,
        resolved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Dashboard Statistics
  static async getDashboardStats(): Promise<any> {
    const [commissionsResult, payoutsResult, disputesResult] = await Promise.all([
      supabase.from('vendor_commissions').select('commission_amount, status, payment_status'),
      supabase.from('commission_payouts').select('net_payout_amount, status'),
      supabase.from('commission_disputes').select('disputed_amount, status')
    ]);

    const commissions = commissionsResult.data || [];
    const payouts = payoutsResult.data || [];
    const disputes = disputesResult.data || [];

    return {
      totalCommissions: commissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0),
      pendingCommissions: commissions.filter(c => c.status === 'pending').length,
      totalPayouts: payouts.reduce((sum, p) => sum + (p.net_payout_amount || 0), 0),
      pendingPayouts: payouts.filter(p => p.status === 'pending').length,
      totalDisputes: disputes.length,
      openDisputes: disputes.filter(d => d.status === 'open').length,
      disputedAmount: disputes.reduce((sum, d) => sum + (d.disputed_amount || 0), 0)
    };
  }
}
