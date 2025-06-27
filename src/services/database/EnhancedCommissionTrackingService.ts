
import { CommissionCRUDOperations } from './commission/CommissionCRUDOperations';
import { CommissionAnalyticsService } from './commission/CommissionAnalyticsService';
import { CommissionAdjustmentService } from './commission/CommissionAdjustmentService';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Re-export types for backward compatibility
export type EnhancedVendorCommission = Database['public']['Tables']['vendor_commissions']['Row'];
export type VendorCommissionInsert = Database['public']['Tables']['vendor_commissions']['Insert'];
export type VendorCommissionUpdate = Database['public']['Tables']['vendor_commissions']['Update'];
export type CommissionDispute = Database['public']['Tables']['commission_disputes']['Row'];
export type CommissionPayout = Database['public']['Tables']['commission_payouts']['Row'];
export type CommissionAdjustment = Database['public']['Tables']['commission_adjustments']['Row'];
export type CommissionRateHistory = Database['public']['Tables']['commission_rate_history']['Row'];
export type CommissionReconciliation = Database['public']['Tables']['commission_reconciliation']['Row'];

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

  // Reconciliation operations
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
}
