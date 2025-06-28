
import { supabase } from '@/integrations/supabase/client';

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
  created_at: string;
  updated_at: string;
  documents: any[];
}

export interface VendorPerformanceReport {
  id: string;
  vendor_id: string;
  period_start: string;
  period_end: string;
  performance_score: number;
  total_orders: number;
  successful_orders: number;
  cancelled_orders: number;
  average_rating: number;
  average_response_time: number;
  revenue_generated: number;
  commission_paid: number;
  customer_complaints: number;
}

export interface VendorAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageRating: number;
  topProducts: any[];
  performanceTrend: any[];
}

export class VendorManagementService {
  static async getVendors(filters?: any): Promise<VendorData[]> {
    try {
      let query = supabase
        .from('vendors')
        .select('*');

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.ilike('business_name', `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching vendors:', error);
        throw error;
      }

      // Map database results to VendorData interface with fallback values
      return (data || []).map((vendor: any): VendorData => ({
        id: vendor.id,
        business_name: vendor.business_name || '',
        contact_name: vendor.contact_name || 'N/A', // Fallback since field doesn't exist in DB
        email: vendor.email || 'N/A', // Fallback since field doesn't exist in DB
        phone: vendor.phone || 'N/A', // Fallback since field doesn't exist in DB
        address: vendor.address || 'N/A', // Fallback since field doesn't exist in DB
        city: vendor.city || 'N/A', // Fallback since field doesn't exist in DB
        status: vendor.status as 'pending' | 'approved' | 'suspended' | 'rejected',
        commission_rate: vendor.commission_rate || 0,
        rating: vendor.rating || 0,
        total_sales: vendor.total_sales || 0,
        created_at: vendor.created_at || '',
        updated_at: vendor.updated_at || '',
        documents: vendor.documents || []
      }));
    } catch (error) {
      console.error('Error in getVendors:', error);
      throw error;
    }
  }

  static async getVendorById(id: string): Promise<VendorData | null> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching vendor by ID:', error);
        throw error;
      }

      if (!data) return null;

      // Map database result to VendorData interface with fallback values
      return {
        id: data.id,
        business_name: data.business_name || '',
        contact_name: data.contact_name || 'N/A',
        email: data.email || 'N/A',
        phone: data.phone || 'N/A',
        address: data.address || 'N/A',
        city: data.city || 'N/A',
        status: data.status as 'pending' | 'approved' | 'suspended' | 'rejected',
        commission_rate: data.commission_rate || 0,
        rating: data.rating || 0,
        total_sales: data.total_sales || 0,
        created_at: data.created_at || '',
        updated_at: data.updated_at || '',
        documents: data.documents || []
      };
    } catch (error) {
      console.error('Error in getVendorById:', error);
      throw error;
    }
  }

  static async updateVendor(id: string, updates: Partial<VendorData>): Promise<VendorData> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .update({
          business_name: updates.business_name,
          status: updates.status,
          commission_rate: updates.commission_rate,
          rating: updates.rating,
          total_sales: updates.total_sales,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating vendor:', error);
        throw error;
      }

      // Map database result to VendorData interface with fallback values
      return {
        id: data.id,
        business_name: data.business_name || '',
        contact_name: data.contact_name || 'N/A',
        email: data.email || 'N/A',
        phone: data.phone || 'N/A',
        address: data.address || 'N/A',
        city: data.city || 'N/A',
        status: data.status as 'pending' | 'approved' | 'suspended' | 'rejected',
        commission_rate: data.commission_rate || 0,
        rating: data.rating || 0,
        total_sales: data.total_sales || 0,
        created_at: data.created_at || '',
        updated_at: data.updated_at || '',
        documents: data.documents || []
      };
    } catch (error) {
      console.error('Error in updateVendor:', error);
      throw error;
    }
  }

  static async createCommission(commissionData: {
    vendor_id: string;
    order_id: string;
    product_id: string;
    gross_amount: number;
    commission_rate: number;
    commission_amount: number;
    platform_fee: number;
    net_commission: number;
    currency: string;
    transaction_date: string;
    status: 'pending' | 'approved' | 'paid' | 'disputed';
    payout_batch_id: string;
    notes: string;
  }): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('vendor_commissions')
        .insert({
          vendor_id: commissionData.vendor_id,
          order_id: commissionData.order_id,
          product_id: commissionData.product_id,
          gross_amount: commissionData.gross_amount,
          commission_rate: commissionData.commission_rate,
          commission_amount: commissionData.commission_amount,
          platform_fee: commissionData.platform_fee,
          net_commission: commissionData.net_commission,
          currency: commissionData.currency,
          transaction_date: commissionData.transaction_date,
          status: commissionData.status,
          payout_batch_id: commissionData.payout_batch_id,
          notes: commissionData.notes,
          commission_type: 'sale', // Required field
          transaction_id: `txn_${Date.now()}` // Required field
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating commission:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createCommission:', error);
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

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching performance reports:', error);
        throw error;
      }

      // Map database results to VendorPerformanceReport interface with fallback values
      return (data || []).map((report: any): VendorPerformanceReport => ({
        id: report.id,
        vendor_id: report.vendor_id,
        period_start: report.report_period_start || '',
        period_end: report.report_period_end || '',
        performance_score: report.customer_satisfaction_score || 0,
        total_orders: report.total_orders || 0,
        successful_orders: report.total_orders || 0, // Using total_orders as fallback
        cancelled_orders: 0, // Fallback since field doesn't exist
        average_rating: report.average_rating || 0,
        average_response_time: report.response_time_hours || 0,
        revenue_generated: report.total_revenue || 0,
        commission_paid: report.commission_paid || 0,
        customer_complaints: report.total_complaints || 0
      }));
    } catch (error) {
      console.error('Error in getPerformanceReports:', error);
      throw error;
    }
  }

  static async getVendorAnalytics(vendorId: string, period: string = '30d'): Promise<VendorAnalytics> {
    try {
      // Get basic vendor analytics
      const { data: commissionData, error: commissionError } = await supabase
        .from('vendor_commissions')
        .select('*')
        .eq('vendor_id', vendorId);

      if (commissionError) {
        console.error('Error fetching commission data:', commissionError);
        throw commissionError;
      }

      // Get performance data
      const { data: performanceData, error: performanceError } = await supabase
        .from('vendor_performance_reports')
        .select('*')
        .eq('vendor_id', vendorId)
        .limit(1);

      if (performanceError) {
        console.error('Error fetching performance data:', performanceError);
        throw performanceError;
      }

      // Calculate analytics
      const totalRevenue = commissionData?.reduce((sum, item) => sum + (item.gross_amount || 0), 0) || 0;
      const totalOrders = commissionData?.length || 0;
      const averageRating = performanceData?.[0]?.average_rating || 0;

      return {
        totalRevenue,
        totalOrders,
        averageRating,
        topProducts: [], // Placeholder - would need product sales data
        performanceTrend: [] // Placeholder - would need historical data
      };
    } catch (error) {
      console.error('Error in getVendorAnalytics:', error);
      throw error;
    }
  }
}
