
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type definitions for enhanced commission tracking
export type EnhancedVendorCommission = Database['public']['Tables']['vendor_commissions']['Row'] & {
  vendor_name?: string;
  product_name?: string;
  order_number?: string;
};

export type CommissionRateHistory = Database['public']['Tables']['commission_rate_history']['Row'];
export type CommissionAdjustment = Database['public']['Tables']['commission_adjustments']['Row'];
export type CommissionReconciliation = Database['public']['Tables']['commission_reconciliation']['Row'];
export type CommissionNotification = Database['public']['Tables']['commission_notifications']['Row'];
export type CommissionTrackingSetting = Database['public']['Tables']['commission_tracking_settings']['Row'];

// Insert types (without id, created_at, updated_at)
export type CommissionInsert = Database['public']['Tables']['vendor_commissions']['Insert'];
export type CommissionRateHistoryInsert = Database['public']['Tables']['commission_rate_history']['Insert'];
export type CommissionAdjustmentInsert = Database['public']['Tables']['commission_adjustments']['Insert'];
export type CommissionReconciliationInsert = Database['public']['Tables']['commission_reconciliation']['Insert'];
export type CommissionNotificationInsert = Database['public']['Tables']['commission_notifications']['Insert'];
export type CommissionTrackingSettingInsert = Database['public']['Tables']['commission_tracking_settings']['Insert'];

// Filter and pagination interfaces
export interface CommissionFilters {
  vendor_id?: string;
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
  commission_type?: string;
  search?: string;
}

export interface PaginationParams {
  page: number;
  per_page: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export class EnhancedCommissionTrackingService {
  // Commission Management
  static async getCommissions(
    filters: CommissionFilters = {},
    pagination: PaginationParams = { page: 1, per_page: 50 }
  ): Promise<PaginatedResponse<EnhancedVendorCommission>> {
    let query = supabase
      .from('vendor_commissions')
      .select('*, vendors(business_name), products(name)', { count: 'exact' });

    // Apply filters
    if (filters.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.payment_status) {
      query = query.eq('payment_status', filters.payment_status);
    }
    if (filters.date_from) {
      query = query.gte('transaction_date', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('transaction_date', filters.date_to);
    }
    if (filters.commission_type) {
      query = query.eq('commission_type', filters.commission_type);
    }
    if (filters.search) {
      query = query.or(`transaction_id.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`);
    }

    // Apply pagination and sorting
    const offset = (pagination.page - 1) * pagination.per_page;
    const sortBy = pagination.sort_by || 'created_at';
    const sortOrder = pagination.sort_order || 'desc';
    
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + pagination.per_page - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page: pagination.page,
      per_page: pagination.per_page,
      total_pages: Math.ceil((count || 0) / pagination.per_page)
    };
  }

  static async createCommission(commission: CommissionInsert): Promise<EnhancedVendorCommission> {
    const { data, error } = await supabase
      .from('vendor_commissions')
      .insert(commission)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCommission(id: string, updates: Partial<CommissionInsert>): Promise<EnhancedVendorCommission> {
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

  static async bulkCreateCommissions(commissions: CommissionInsert[]): Promise<EnhancedVendorCommission[]> {
    const { data, error } = await supabase
      .from('vendor_commissions')
      .insert(commissions)
      .select();

    if (error) throw error;
    return data || [];
  }

  static async bulkUpdateCommissions(updates: Array<{ id: string; data: Partial<CommissionInsert> }>): Promise<void> {
    for (const update of updates) {
      await this.updateCommission(update.id, update.data);
    }
  }

  static async bulkDeleteCommissions(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('vendor_commissions')
      .delete()
      .in('id', ids);

    if (error) throw error;
  }

  // Commission Rate History
  static async getRateHistory(rateId?: string): Promise<CommissionRateHistory[]> {
    let query = supabase
      .from('commission_rate_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (rateId) {
      query = query.eq('rate_id', rateId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createRateHistory(history: CommissionRateHistoryInsert): Promise<CommissionRateHistory> {
    const { data, error } = await supabase
      .from('commission_rate_history')
      .insert(history)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async bulkCreateRateHistory(histories: CommissionRateHistoryInsert[]): Promise<CommissionRateHistory[]> {
    const { data, error } = await supabase
      .from('commission_rate_history')
      .insert(histories)
      .select();

    if (error) throw error;
    return data || [];
  }

  // Commission Adjustments
  static async getAdjustments(commissionId?: string): Promise<CommissionAdjustment[]> {
    let query = supabase
      .from('commission_adjustments')
      .select('*')
      .order('created_at', { ascending: false });

    if (commissionId) {
      query = query.eq('commission_id', commissionId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createAdjustment(adjustment: CommissionAdjustmentInsert): Promise<CommissionAdjustment> {
    const { data, error } = await supabase
      .from('commission_adjustments')
      .insert(adjustment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateAdjustment(id: string, updates: Partial<CommissionAdjustmentInsert>): Promise<CommissionAdjustment> {
    const { data, error } = await supabase
      .from('commission_adjustments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async bulkCreateAdjustments(adjustments: CommissionAdjustmentInsert[]): Promise<CommissionAdjustment[]> {
    const { data, error } = await supabase
      .from('commission_adjustments')
      .insert(adjustments)
      .select();

    if (error) throw error;
    return data || [];
  }

  // Commission Reconciliation
  static async getReconciliations(vendorId?: string): Promise<CommissionReconciliation[]> {
    let query = supabase
      .from('commission_reconciliation')
      .select('*')
      .order('created_at', { ascending: false });

    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createReconciliation(reconciliation: CommissionReconciliationInsert): Promise<CommissionReconciliation> {
    const { data, error } = await supabase
      .from('commission_reconciliation')
      .insert(reconciliation)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateReconciliation(id: string, updates: Partial<CommissionReconciliationInsert>): Promise<CommissionReconciliation> {
    const { data, error } = await supabase
      .from('commission_reconciliation')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async bulkCreateReconciliations(reconciliations: CommissionReconciliationInsert[]): Promise<CommissionReconciliation[]> {
    const { data, error } = await supabase
      .from('commission_reconciliation')
      .insert(reconciliations)
      .select();

    if (error) throw error;
    return data || [];
  }

  // Commission Notifications
  static async getNotifications(recipientId?: string): Promise<CommissionNotification[]> {
    let query = supabase
      .from('commission_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (recipientId) {
      query = query.eq('recipient_id', recipientId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createNotification(notification: CommissionNotificationInsert): Promise<CommissionNotification> {
    const { data, error } = await supabase
      .from('commission_notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async markNotificationAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('commission_notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  // Commission Tracking Settings
  static async getSettings(): Promise<CommissionTrackingSetting[]> {
    const { data, error } = await supabase
      .from('commission_tracking_settings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createSetting(setting: CommissionTrackingSettingInsert): Promise<CommissionTrackingSetting> {
    const { data, error } = await supabase
      .from('commission_tracking_settings')
      .insert(setting)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSetting(id: string, updates: Partial<CommissionTrackingSettingInsert>): Promise<CommissionTrackingSetting> {
    const { data, error } = await supabase
      .from('commission_tracking_settings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Analytics and Reporting
  static async getCommissionAnalytics(vendorId?: string, period?: string): Promise<any> {
    let query = supabase
      .from('commission_analytics')
      .select('*')
      .order('analytics_date', { ascending: false });

    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }
    if (period) {
      query = query.eq('analytics_period', period);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getCommissionSummary(vendorId?: string): Promise<any> {
    let query = supabase
      .from('vendor_commissions')
      .select('status, payment_status, commission_amount.sum(), gross_amount.sum(), count()')
      .eq('status', 'approved');

    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Database functions
  static async calculateCommission(
    vendorId: string,
    grossAmount: number,
    productCategory?: string,
    transactionDate?: string
  ): Promise<any> {
    const { data, error } = await supabase.rpc('calculate_vendor_commission', {
      p_vendor_id: vendorId,
      p_gross_amount: grossAmount,
      p_product_category: productCategory,
      p_transaction_date: transactionDate
    });

    if (error) throw error;
    return data;
  }

  static async updateAnalytics(vendorId?: string, analyticsDate?: string): Promise<void> {
    const { error } = await supabase.rpc('update_commission_analytics', {
      p_vendor_id: vendorId,
      p_analytics_date: analyticsDate
    });

    if (error) throw error;
  }

  // Export functions
  static async exportCommissions(filters: CommissionFilters = {}): Promise<EnhancedVendorCommission[]> {
    let query = supabase
      .from('vendor_commissions')
      .select('*, vendors(business_name), products(name)');

    // Apply filters (same as getCommissions but without pagination)
    if (filters.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.payment_status) {
      query = query.eq('payment_status', filters.payment_status);
    }
    if (filters.date_from) {
      query = query.gte('transaction_date', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('transaction_date', filters.date_to);
    }
    if (filters.commission_type) {
      query = query.eq('commission_type', filters.commission_type);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  // Search functionality
  static async searchCommissions(searchTerm: string, limit: number = 50): Promise<EnhancedVendorCommission[]> {
    const { data, error } = await supabase
      .from('vendor_commissions')
      .select('*, vendors(business_name), products(name)')
      .or(`transaction_id.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`)
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}
