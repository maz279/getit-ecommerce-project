
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type VendorRow = Database['public']['Tables']['vendors']['Row'];
type VendorCommissionRow = Database['public']['Tables']['vendor_commissions']['Row'];

export interface VendorData {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  commission_rate: number;
  rating: number;
  total_sales: number;
  trade_license: string;
  documents: any[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface VendorPerformanceReport {
  vendor_id: string;
  period_start: string;
  period_end: string;
  performance_score: number;
  total_orders: number;
  successful_orders: number;
  cancelled_orders: number;
  average_rating: number;
  response_time_hours: number;
  revenue_generated: number;
  commission_paid: number;
  customer_complaints: number;
}

export interface CommissionData {
  id: string;
  vendor_id: string;
  order_id: string;
  commission_amount: number;
  commission_rate: number;
  gross_amount: number;
  net_commission: number;
  transaction_date: string;
  status: string;
  commission_type: string;
  transaction_id: string;
  payout_batch_id?: string;
}

export class VendorManagementService {
  static async getVendors(filters?: any): Promise<VendorData[]> {
    try {
      let query = supabase
        .from('vendors')
        .select(`
          *,
          profiles:user_id (
            full_name,
            phone
          )
        `);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.search) {
        query = query.ilike('business_name', `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((vendor: any) => ({
        id: vendor.id,
        business_name: vendor.business_name,
        contact_name: vendor.profiles?.full_name || 'N/A',
        email: 'contact@vendor.com', // Fallback email
        phone: vendor.profiles?.phone || 'N/A',
        address: 'Address not provided',
        city: 'City not provided',
        status: vendor.status as 'pending' | 'approved' | 'suspended' | 'rejected',
        commission_rate: vendor.commission_rate,
        rating: vendor.rating,
        total_sales: vendor.total_sales,
        trade_license: vendor.trade_license || '',
        documents: [],
        created_at: vendor.created_at,
        updated_at: vendor.updated_at,
        user_id: vendor.user_id
      }));
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  }

  static async getVendorById(id: string): Promise<VendorData | null> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select(`
          *,
          profiles:user_id (
            full_name,
            phone
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        business_name: data.business_name,
        contact_name: data.profiles?.full_name || 'N/A',
        email: 'contact@vendor.com', // Fallback email
        phone: data.profiles?.phone || 'N/A',
        address: 'Address not provided',
        city: 'City not provided',
        status: data.status as 'pending' | 'approved' | 'suspended' | 'rejected',
        commission_rate: data.commission_rate,
        rating: data.rating,
        total_sales: data.total_sales,
        trade_license: data.trade_license || '',
        documents: [],
        created_at: data.created_at,
        updated_at: data.updated_at,
        user_id: data.user_id
      };
    } catch (error) {
      console.error('Error fetching vendor by ID:', error);
      throw error;
    }
  }

  static async updateVendorStatus(id: string, status: 'pending' | 'approved' | 'suspended' | 'rejected'): Promise<VendorData> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .update({ status })
        .eq('id', id)
        .select(`
          *,
          profiles:user_id (
            full_name,
            phone
          )
        `)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        business_name: data.business_name,
        contact_name: data.profiles?.full_name || 'N/A',
        email: 'contact@vendor.com', // Fallback email
        phone: data.profiles?.phone || 'N/A',
        address: 'Address not provided',
        city: 'City not provided',
        status: data.status as 'pending' | 'approved' | 'suspended' | 'rejected',
        commission_rate: data.commission_rate,
        rating: data.rating,
        total_sales: data.total_sales,
        trade_license: data.trade_license || '',
        documents: [],
        created_at: data.created_at,
        updated_at: data.updated_at,
        user_id: data.user_id
      };
    } catch (error) {
      console.error('Error updating vendor status:', error);
      throw error;
    }
  }

  static async getPerformanceReports(filters?: any): Promise<VendorPerformanceReport[]> {
    try {
      let query = supabase
        .from('vendor_performance_reports')
        .select('*');

      if (filters?.vendor_id) {
        query = query.eq('vendor_id', filters.vendor_id);
      }
      if (filters?.period_start) {
        query = query.gte('report_date', filters.period_start);
      }
      if (filters?.period_end) {
        query = query.lte('report_date', filters.period_end);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Performance reports query error:', error);
        return [];
      }

      return (data || []).map((report: any) => ({
        vendor_id: report.vendor_id || '',
        period_start: report.report_date || new Date().toISOString(),
        period_end: report.report_date || new Date().toISOString(),
        performance_score: report.performance_score || 0,
        total_orders: report.total_orders || 0,
        successful_orders: report.successful_orders || 0,
        cancelled_orders: report.cancelled_orders || 0,
        average_rating: report.average_rating || 0,
        response_time_hours: report.response_time_hours || 0,
        revenue_generated: report.total_revenue || 0,
        commission_paid: report.commission_paid || 0,
        customer_complaints: report.customer_complaints || 0
      }));
    } catch (error) {
      console.error('Error fetching performance reports:', error);
      return [];
    }
  }

  static async getCommissions(filters?: any): Promise<CommissionData[]> {
    try {
      let query = supabase
        .from('vendor_commissions')
        .select('*');

      if (filters?.vendor_id) {
        query = query.eq('vendor_id', filters.vendor_id);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.date_from) {
        query = query.gte('transaction_date', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('transaction_date', filters.date_to);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((commission: any) => ({
        id: commission.id,
        vendor_id: commission.vendor_id,
        order_id: commission.order_id || '',
        commission_amount: commission.commission_amount,
        commission_rate: commission.commission_rate,
        gross_amount: commission.gross_amount,
        net_commission: commission.net_commission,
        transaction_date: commission.transaction_date,
        status: commission.status,
        commission_type: commission.commission_type || 'sales',
        transaction_id: commission.transaction_id || commission.id,
        payout_batch_id: commission.payout_batch_id || undefined
      }));
    } catch (error) {
      console.error('Error fetching commissions:', error);
      throw error;
    }
  }

  static async createCommission(commissionData: Omit<CommissionData, 'id'>): Promise<CommissionData> {
    try {
      const { data, error } = await supabase
        .from('vendor_commissions')
        .insert({
          vendor_id: commissionData.vendor_id,
          order_id: commissionData.order_id,
          commission_amount: commissionData.commission_amount,
          commission_rate: commissionData.commission_rate,
          gross_amount: commissionData.gross_amount,
          net_commission: commissionData.net_commission,
          transaction_date: commissionData.transaction_date,
          status: commissionData.status,
          commission_type: commissionData.commission_type,
          transaction_id: commissionData.transaction_id,
          payout_batch_id: commissionData.payout_batch_id
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        vendor_id: data.vendor_id,
        order_id: data.order_id || '',
        commission_amount: data.commission_amount,
        commission_rate: data.commission_rate,
        gross_amount: data.gross_amount,
        net_commission: data.net_commission,
        transaction_date: data.transaction_date,
        status: data.status,
        commission_type: data.commission_type || 'sales',
        transaction_id: data.transaction_id || data.id,
        payout_batch_id: data.payout_batch_id || undefined
      };
    } catch (error) {
      console.error('Error creating commission:', error);
      throw error;
    }
  }

  static async getVendorAnalytics(vendorId: string, period: string = '30d'): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('vendor_commissions')
        .select('*')
        .eq('vendor_id', vendorId);

      if (error) throw error;

      return {
        totalCommissions: data?.length || 0,
        totalAmount: data?.reduce((sum, item) => sum + (item.commission_amount || 0), 0) || 0,
        averageCommission: data?.length ? (data.reduce((sum, item) => sum + (item.commission_amount || 0), 0) / data.length) : 0
      };
    } catch (error) {
      console.error('Error fetching vendor analytics:', error);
      throw error;
    }
  }
}
