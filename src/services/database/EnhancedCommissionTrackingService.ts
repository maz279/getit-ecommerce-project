
import { supabase } from '@/integrations/supabase/client';

// Enhanced interfaces for the new database schema
export interface CommissionTrackingSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: 'system' | 'vendor' | 'category' | 'global';
  is_active: boolean;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionRateHistory {
  id: string;
  rate_id: string;
  old_rate: number;
  new_rate: number;
  change_reason?: string;
  changed_by: string;
  effective_date: string;
  created_at: string;
}

export interface CommissionAdjustment {
  id: string;
  commission_id: string;
  adjustment_type: 'bonus' | 'deduction' | 'correction' | 'penalty';
  adjustment_amount: number;
  adjustment_reason: string;
  reference_document?: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionReconciliation {
  id: string;
  vendor_id: string;
  reconciliation_period: string;
  period_start: string;
  period_end: string;
  calculated_commission: number;
  actual_commission: number;
  variance: number;
  variance_percentage: number;
  reconciliation_status: 'in_progress' | 'completed' | 'disputed';
  reconciled_by?: string;
  reconciled_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionNotification {
  id: string;
  notification_type: 'payout_ready' | 'dispute_raised' | 'rate_change' | 'threshold_reached';
  recipient_id: string;
  recipient_type: 'vendor' | 'admin' | 'finance';
  subject: string;
  message: string;
  notification_data: any;
  status: 'pending' | 'sent' | 'failed' | 'read';
  sent_at?: string;
  read_at?: string;
  created_at: string;
}

export interface EnhancedVendorCommission {
  id: string;
  vendor_id: string;
  order_id?: string;
  product_id?: string;
  transaction_id: string;
  commission_type: string;
  commission_rate: number;
  gross_amount: number;
  commission_amount: number;
  platform_fee: number;
  net_commission: number;
  tax_amount: number;
  discount_amount: number;
  shipping_commission: number;
  refund_amount: number;
  chargeback_amount: number;
  status: string;
  payment_status: string;
  transaction_date: string;
  payment_date?: string;
  payment_due_date?: string;
  category?: string;
  payment_method?: string;
  currency: string;
  exchange_rate: number;
  calculation_date: string;
  notes?: string;
  created_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export class EnhancedCommissionTrackingService {
  // Commission Management
  static async createCommission(commissionData: Partial<EnhancedVendorCommission>): Promise<EnhancedVendorCommission> {
    const { data, error } = await supabase
      .from('vendor_commissions')
      .insert([commissionData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCommission(id: string, updates: Partial<EnhancedVendorCommission>): Promise<EnhancedVendorCommission> {
    const { data, error } = await supabase
      .from('vendor_commissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getCommissionById(id: string): Promise<EnhancedVendorCommission> {
    const { data, error } = await supabase
      .from('vendor_commissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async getCommissions(filters?: {
    vendor_id?: string;
    status?: string;
    payment_status?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
    offset?: number;
  }): Promise<EnhancedVendorCommission[]> {
    let query = supabase.from('vendor_commissions').select('*');

    if (filters?.vendor_id) query = query.eq('vendor_id', filters.vendor_id);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.payment_status) query = query.eq('payment_status', filters.payment_status);
    if (filters?.date_from) query = query.gte('transaction_date', filters.date_from);
    if (filters?.date_to) query = query.lte('transaction_date', filters.date_to);
    if (filters?.limit) query = query.limit(filters.limit);
    if (filters?.offset) query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Commission Rate Management
  static async createCommissionRate(rateData: any): Promise<any> {
    const { data, error } = await supabase
      .from('vendor_commission_rates')
      .insert([rateData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCommissionRate(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('vendor_commission_rates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getCommissionRates(vendorId?: string): Promise<any[]> {
    let query = supabase.from('vendor_commission_rates').select('*');
    
    if (vendorId) query = query.eq('vendor_id', vendorId);
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Commission Rate History
  static async getRateHistory(rateId: string): Promise<CommissionRateHistory[]> {
    const { data, error } = await supabase
      .from('commission_rate_history')
      .select('*')
      .eq('rate_id', rateId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createRateHistoryEntry(historyData: Partial<CommissionRateHistory>): Promise<CommissionRateHistory> {
    const { data, error } = await supabase
      .from('commission_rate_history')
      .insert([historyData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Commission Adjustments
  static async createAdjustment(adjustmentData: Partial<CommissionAdjustment>): Promise<CommissionAdjustment> {
    const { data, error } = await supabase
      .from('commission_adjustments')
      .insert([adjustmentData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAdjustments(filters?: {
    commission_id?: string;
    status?: string;
    adjustment_type?: string;
  }): Promise<CommissionAdjustment[]> {
    let query = supabase.from('commission_adjustments').select('*');

    if (filters?.commission_id) query = query.eq('commission_id', filters.commission_id);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.adjustment_type) query = query.eq('adjustment_type', filters.adjustment_type);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async approveAdjustment(id: string, approvedBy: string): Promise<CommissionAdjustment> {
    const { data, error } = await supabase
      .from('commission_adjustments')
      .update({
        status: 'approved',
        approved_by: approvedBy,
        approved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Commission Reconciliation
  static async createReconciliation(reconciliationData: Partial<CommissionReconciliation>): Promise<CommissionReconciliation> {
    const { data, error } = await supabase
      .from('commission_reconciliation')
      .insert([reconciliationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getReconciliations(filters?: {
    vendor_id?: string;
    reconciliation_period?: string;
    status?: string;
  }): Promise<CommissionReconciliation[]> {
    let query = supabase.from('commission_reconciliation').select('*');

    if (filters?.vendor_id) query = query.eq('vendor_id', filters.vendor_id);
    if (filters?.reconciliation_period) query = query.eq('reconciliation_period', filters.reconciliation_period);
    if (filters?.status) query = query.eq('reconciliation_status', filters.status);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Commission Notifications
  static async createNotification(notificationData: Partial<CommissionNotification>): Promise<CommissionNotification> {
    const { data, error } = await supabase
      .from('commission_notifications')
      .insert([notificationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getNotifications(recipientId: string, recipientType: string): Promise<CommissionNotification[]> {
    const { data, error } = await supabase
      .from('commission_notifications')
      .select('*')
      .eq('recipient_id', recipientId)
      .eq('recipient_type', recipientType)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async markNotificationAsRead(id: string): Promise<CommissionNotification> {
    const { data, error } = await supabase
      .from('commission_notifications')
      .update({
        status: 'read',
        read_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Advanced Analytics
  static async getAdvancedAnalytics(params: {
    vendor_id?: string;
    date_from?: string;
    date_to?: string;
    group_by?: 'day' | 'week' | 'month' | 'quarter';
  }): Promise<any> {
    // This would typically call a stored procedure or complex query
    const { data, error } = await supabase.rpc('get_commission_analytics', params);
    if (error) throw error;
    return data;
  }

  // Calculate Commission using stored procedure
  static async calculateCommission(
    vendorId: string,
    grossAmount: number,
    productCategory?: string,
    transactionDate?: string
  ): Promise<{
    commission_amount: number;
    commission_rate: number;
    platform_fee: number;
    net_commission: number;
  }> {
    const { data, error } = await supabase.rpc('calculate_vendor_commission', {
      p_vendor_id: vendorId,
      p_gross_amount: grossAmount,
      p_product_category: productCategory,
      p_transaction_date: transactionDate || new Date().toISOString().split('T')[0]
    });

    if (error) throw error;
    return data[0];
  }

  // Bulk Operations
  static async bulkUpdateCommissions(updates: { id: string; data: Partial<EnhancedVendorCommission> }[]): Promise<void> {
    const promises = updates.map(({ id, data }) => 
      supabase.from('vendor_commissions').update(data).eq('id', id)
    );
    
    await Promise.all(promises);
  }

  static async bulkApproveCommissions(commissionIds: string[], approvedBy: string): Promise<void> {
    const { error } = await supabase
      .from('vendor_commissions')
      .update({
        status: 'approved',
        approved_by: approvedBy,
        updated_at: new Date().toISOString()
      })
      .in('id', commissionIds);

    if (error) throw error;
  }

  // Search and Filtering
  static async searchCommissions(searchTerm: string, filters?: any): Promise<EnhancedVendorCommission[]> {
    let query = supabase
      .from('vendor_commissions')
      .select('*')
      .or(`transaction_id.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query = query.eq(key, value);
      });
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  // Settings Management
  static async getSettings(): Promise<CommissionTrackingSetting[]> {
    const { data, error } = await supabase
      .from('commission_tracking_settings')
      .select('*')
      .eq('is_active', true)
      .order('setting_key');

    if (error) throw error;
    return data || [];
  }

  static async updateSetting(settingKey: string, settingValue: any, updatedBy: string): Promise<CommissionTrackingSetting> {
    const { data, error } = await supabase
      .from('commission_tracking_settings')
      .upsert({
        setting_key: settingKey,
        setting_value: settingValue,
        updated_by: updatedBy,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
