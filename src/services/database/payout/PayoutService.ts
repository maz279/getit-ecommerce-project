
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type PayoutRequest = Database['public']['Tables']['payout_requests']['Row'];
type PayoutRequestInsert = Database['public']['Tables']['payout_requests']['Insert'];
type PayoutRequestUpdate = Database['public']['Tables']['payout_requests']['Update'];
type PayoutSchedule = Database['public']['Tables']['payout_schedules']['Row'];
type PayoutScheduleInsert = Database['public']['Tables']['payout_schedules']['Insert'];
type PayoutHistory = Database['public']['Tables']['payout_history']['Row'];
type PayoutFeesConfig = Database['public']['Tables']['payout_fees_config']['Row'];

export class PayoutService {
  // Payout Requests
  static async createPayoutRequest(request: PayoutRequestInsert): Promise<PayoutRequest> {
    const { data, error } = await supabase
      .from('payout_requests')
      .insert(request)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getPayoutRequests(filters?: {
    vendor_id?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: PayoutRequest[]; total: number }> {
    let query = supabase
      .from('payout_requests')
      .select('*, vendors(business_name)', { count: 'exact' });

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.date_from) {
      query = query.gte('request_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('request_date', filters.date_to);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
    }

    const { data, error, count } = await query
      .order('request_date', { ascending: false });

    if (error) throw error;
    return { data: data || [], total: count || 0 };
  }

  static async updatePayoutRequest(id: string, updates: PayoutRequestUpdate): Promise<PayoutRequest> {
    const { data, error } = await supabase
      .from('payout_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async approvePayoutRequest(id: string, approvedBy: string, notes?: string): Promise<PayoutRequest> {
    const { data, error } = await supabase
      .from('payout_requests')
      .update({
        status: 'approved',
        processed_by: approvedBy,
        processed_at: new Date().toISOString(),
        notes: notes
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Log the approval action
    await this.logPayoutHistory({
      payout_request_id: id,
      vendor_id: data.vendor_id,
      action: 'approved',
      performed_by: approvedBy,
      previous_status: 'pending',
      new_status: 'approved',
      notes: notes
    });

    return data;
  }

  static async rejectPayoutRequest(id: string, rejectedBy: string, reason: string): Promise<PayoutRequest> {
    const { data, error } = await supabase
      .from('payout_requests')
      .update({
        status: 'rejected',
        processed_by: rejectedBy,
        processed_at: new Date().toISOString(),
        rejection_reason: reason
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log the rejection action
    await this.logPayoutHistory({
      payout_request_id: id,
      vendor_id: data.vendor_id,
      action: 'rejected',
      performed_by: rejectedBy,
      previous_status: 'pending',
      new_status: 'rejected',
      notes: reason
    });

    return data;
  }

  // Payout Schedules
  static async createPayoutSchedule(schedule: PayoutScheduleInsert): Promise<PayoutSchedule> {
    const { data, error } = await supabase
      .from('payout_schedules')
      .insert(schedule)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getPayoutSchedules(vendorId?: string): Promise<PayoutSchedule[]> {
    let query = supabase
      .from('payout_schedules')
      .select('*, vendors(business_name)')
      .eq('is_active', true);

    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updatePayoutSchedule(id: string, updates: Partial<PayoutSchedule>): Promise<PayoutSchedule> {
    const { data, error } = await supabase
      .from('payout_schedules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Payout History
  static async logPayoutHistory(historyData: Omit<PayoutHistory, 'id' | 'created_at'>): Promise<PayoutHistory> {
    const { data, error } = await supabase
      .from('payout_history')
      .insert(historyData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getPayoutHistory(filters?: {
    vendor_id?: string;
    payout_request_id?: string;
    action?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: PayoutHistory[]; total: number }> {
    let query = supabase
      .from('payout_history')
      .select('*, vendors(business_name), profiles(full_name)', { count: 'exact' });

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters?.payout_request_id) {
      query = query.eq('payout_request_id', filters.payout_request_id);
    }
    if (filters?.action) {
      query = query.eq('action', filters.action);
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
    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], total: count || 0 };
  }

  // Fee Configuration
  static async getPayoutFeeConfigs(): Promise<PayoutFeesConfig[]> {
    const { data, error } = await supabase
      .from('payout_fees_config')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async calculatePayoutFee(paymentMethod: string, amount: number): Promise<number> {
    const { data: feeConfig, error } = await supabase
      .from('payout_fees_config')
      .select('*')
      .eq('payment_method', paymentMethod)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !feeConfig) return 0;

    let fee = 0;
    if (feeConfig.fee_type === 'fixed') {
      fee = feeConfig.fee_amount;
    } else if (feeConfig.fee_type === 'percentage') {
      fee = (amount * feeConfig.fee_amount) / 100;
    }

    // Apply min/max limits
    if (feeConfig.minimum_fee && fee < feeConfig.minimum_fee) {
      fee = feeConfig.minimum_fee;
    }
    if (feeConfig.maximum_fee && fee > feeConfig.maximum_fee) {
      fee = feeConfig.maximum_fee;
    }

    return fee;
  }

  // Analytics
  static async getPayoutAnalytics(dateRange?: { start: string; end: string }) {
    const { data, error } = await supabase
      .from('payout_requests')
      .select('*')
      .gte('request_date', dateRange?.start || '2024-01-01')
      .lte('request_date', dateRange?.end || '2024-12-31');

    if (error) throw error;

    const analytics = {
      totalPayouts: data?.length || 0,
      totalAmount: data?.reduce((sum, payout) => sum + (payout.request_amount || 0), 0) || 0,
      avgProcessingTime: 1.8, // This would be calculated from actual data
      successRate: 98.7, // This would be calculated from actual data
      byStatus: {
        pending: data?.filter(p => p.status === 'pending').length || 0,
        processing: data?.filter(p => p.status === 'processing').length || 0,
        approved: data?.filter(p => p.status === 'approved').length || 0,
        rejected: data?.filter(p => p.status === 'rejected').length || 0,
        paid: data?.filter(p => p.status === 'paid').length || 0
      },
      byPaymentMethod: {
        bank_transfer: data?.filter(p => p.payment_method === 'bank_transfer').length || 0,
        mobile_banking: data?.filter(p => p.payment_method === 'mobile_banking').length || 0,
        digital_wallet: data?.filter(p => p.payment_method === 'digital_wallet').length || 0,
        check: data?.filter(p => p.payment_method === 'check').length || 0
      }
    };

    return analytics;
  }
}
