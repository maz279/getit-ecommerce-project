
import { Database } from '@/integrations/supabase/types';

export type EnhancedVendorCommission = Database['public']['Tables']['vendor_commissions']['Row'];
export type VendorCommissionInsert = Database['public']['Tables']['vendor_commissions']['Insert'];
export type VendorCommissionUpdate = Database['public']['Tables']['vendor_commissions']['Update'];
export type CommissionAdjustment = Database['public']['Tables']['commission_adjustments']['Row'];
export type CommissionAdjustmentInsert = Database['public']['Tables']['commission_adjustments']['Insert'];
export type CommissionRateHistory = Database['public']['Tables']['commission_rate_history']['Row'];
export type CommissionReconciliation = Database['public']['Tables']['commission_reconciliation']['Row'];

export interface CommissionFilters {
  vendor_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  category?: string;
  commission_type?: string;
  payment_status?: string;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface CommissionInsert extends VendorCommissionInsert {
  // Additional fields for UI forms
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  total_pages: number;
  current_page: number;
}

export interface CommissionAnalytics {
  totalCommissions: number;
  totalAmount: number;
  averageCommission: number;
  pendingCommissions: number;
  approvedCommissions: number;
  paidCommissions: number;
}
