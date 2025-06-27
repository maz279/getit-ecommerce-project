
import { CommissionCRUDOperations } from './commission/CommissionCRUDOperations';
import { CommissionAnalyticsService } from './commission/CommissionAnalyticsService';
import { CommissionAdjustmentService } from './commission/CommissionAdjustmentService';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Export types
export type {
  EnhancedVendorCommission,
  VendorCommissionInsert,
  VendorCommissionUpdate,
  CommissionAdjustment,
  CommissionAdjustmentInsert,
  CommissionRateHistory,
  CommissionReconciliation,
  CommissionFilters,
  PaginationParams,
  CommissionInsert,
  PaginatedResponse,
  CommissionAnalytics
} from './commission/types';

// Re-export other types for backward compatibility
export type CommissionDispute = Database['public']['Tables']['commission_disputes']['Row'];
export type CommissionPayout = Database['public']['Tables']['commission_payouts']['Row'];

export class EnhancedCommissionTrackingService {
  // Re-export CRUD operations
  static getCommissions = CommissionCRUDOperations.getCommissions;
  static getCommissionById = CommissionCRUDOperations.getCommissionById;
  static createCommission = CommissionCRUDOperations.createCommission;
  static updateCommission = CommissionCRUDOperations.updateCommission;
  static deleteCommission = CommissionCRUDOperations.deleteCommission;
  static bulkCreateCommissions = CommissionCRUDOperations.bulkCreateCommissions;
  static bulkUpdateCommissions = CommissionCRUDOperations.bulkUpdateCommissions;

  // Re-export analytics operations
  static getAnalytics = CommissionAnalyticsService.getAnalytics;
  static getVendorSummary = CommissionAnalyticsService.getVendorSummary;
  static getDashboardStats = CommissionAnalyticsService.getDashboardStats;

  // Re-export adjustment operations
  static getAdjustments = CommissionAdjustmentService.getAdjustments;
  static createAdjustment = CommissionAdjustmentService.createAdjustment;
  static approveAdjustment = CommissionAdjustmentService.approveAdjustment;
  static rejectAdjustment = CommissionAdjustmentService.rejectAdjustment;

  // Enhanced method with pagination support
  static async getCommissionsWithPagination(
    filters: import('./commission/types').CommissionFilters = {},
    pagination: import('./commission/types').PaginationParams = {}
  ): Promise<import('./commission/types').PaginatedResponse<import('./commission/types').EnhancedVendorCommission>> {
    const { page = 1, limit = 50 } = pagination;
    const offset = (page - 1) * limit;

    const commissions = await this.getCommissions({
      ...filters,
      limit,
      offset
    });

    // Get total count for pagination
    let countQuery = supabase
      .from('vendor_commissions')
      .select('*', { count: 'exact', head: true });

    if (filters.vendor_id) {
      countQuery = countQuery.eq('vendor_id', filters.vendor_id);
    }
    if (filters.status) {
      countQuery = countQuery.eq('status', filters.status);
    }
    if (filters.date_from) {
      countQuery = countQuery.gte('transaction_date', filters.date_from);
    }
    if (filters.date_to) {
      countQuery = countQuery.lte('transaction_date', filters.date_to);
    }

    const { count } = await countQuery;
    const total = count || 0;
    const total_pages = Math.ceil(total / limit);

    return {
      data: commissions,
      total,
      total_pages,
      current_page: page
    };
  }

  // Add bulk delete method
  static async bulkDeleteCommissions(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('vendor_commissions')
      .delete()
      .in('id', ids);

    if (error) throw error;
  }

  // Dispute operations
  static async getDisputes(filters?: { vendor_id?: string; status?: string }): Promise<CommissionDispute[]> {
    let query = supabase
      .from('commission_disputes')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Payout operations
  static async getPayouts(filters?: { vendor_id?: string; status?: string }): Promise<CommissionPayout[]> {
    let query = supabase
      .from('commission_payouts')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Rate history operations
  static async getRateHistory(rateId?: string): Promise<Database['public']['Tables']['commission_rate_history']['Row'][]> {
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

  // Reconciliation operations
  static async getReconciliations(vendorId?: string): Promise<Database['public']['Tables']['commission_reconciliation']['Row'][]> {
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
}
