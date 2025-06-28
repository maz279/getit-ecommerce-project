
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Types from database
type Vendor = Database['public']['Tables']['vendors']['Row'];
type VendorCommission = Database['public']['Tables']['vendor_commissions']['Row'];
type VendorPerformanceReport = Database['public']['Tables']['vendor_performance_reports']['Row'];

// Interface definitions for the service
export interface VendorData {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  rating: number;
  total_sales: number;
  commission_rate: number;
  documents: any[];
  created_at: string;
  updated_at: string;
}

export interface VendorPerformanceReport {
  id: string;
  vendor_id: string;
  report_date: string;
  period_start: string;
  period_end: string;
  performance_score: number;
  total_orders: number;
  successful_orders: number;
  cancelled_orders: number;
  average_rating: number;
  average_response_time_hours: number;
  revenue_generated: number;
  commission_paid: number;
  customer_complaints: number;
}

export class VendorManagementService {
  // Get all vendors with pagination and filters
  static async getVendors(filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: VendorData[]; total: number }> {
    try {
      let query = supabase
        .from('vendors')
        .select(`
          *,
          profiles!vendors_user_id_fkey (
            full_name,
            phone
          )
        `, { count: 'exact' });

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.or(`business_name.ilike.%${filters.search}%,trade_license.ilike.%${filters.search}%`);
      }

      // Apply pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data: rawData, error, count } = await query;

      if (error) throw error;

      // Map database results to VendorData interface
      const data: VendorData[] = (rawData || []).map(vendor => ({
        id: vendor.id,
        business_name: vendor.business_name || '',
        contact_name: vendor.profiles?.full_name || 'N/A',
        email: 'N/A', // Email would need to be stored in vendors table or profiles
        phone: vendor.profiles?.phone || 'N/A',
        address: 'N/A', // Address would need to be added to database schema
        city: 'N/A', // City would need to be added to database schema
        status: vendor.status as 'pending' | 'approved' | 'suspended' | 'rejected',
        rating: vendor.rating || 0,
        total_sales: vendor.total_sales || 0,
        commission_rate: vendor.commission_rate || 0,
        documents: [], // Documents would need to be fetched separately
        created_at: vendor.created_at,
        updated_at: vendor.updated_at
      }));

      return {
        data,
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  }

  // Get single vendor by ID
  static async getVendorById(id: string): Promise<VendorData | null> {
    try {
      const { data: rawData, error } = await supabase
        .from('vendors')
        .select(`
          *,
          profiles!vendors_user_id_fkey (
            full_name,
            phone
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!rawData) return null;

      // Map database result to VendorData interface
      const vendorData: VendorData = {
        id: rawData.id,
        business_name: rawData.business_name || '',
        contact_name: rawData.profiles?.full_name || 'N/A',
        email: 'N/A', // Email would need to be stored in vendors table or profiles
        phone: rawData.profiles?.phone || 'N/A',
        address: 'N/A', // Address would need to be added to database schema
        city: 'N/A', // City would need to be added to database schema
        status: rawData.status as 'pending' | 'approved' | 'suspended' | 'rejected',
        rating: rawData.rating || 0,
        total_sales: rawData.total_sales || 0,
        commission_rate: rawData.commission_rate || 0,
        documents: [], // Documents would need to be fetched separately
        created_at: rawData.created_at,
        updated_at: rawData.updated_at
      };

      return vendorData;
    } catch (error) {
      console.error('Error fetching vendor:', error);
      throw error;
    }
  }

  // Update vendor status
  static async updateVendorStatus(id: string, status: 'pending' | 'approved' | 'suspended' | 'rejected'): Promise<void> {
    try {
      const { error } = await supabase
        .from('vendors')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating vendor status:', error);
      throw error;
    }
  }

  // Get vendors by status
  static async getVendorsByStatus(status: string): Promise<VendorData[]> {
    try {
      const { data: rawData, error } = await supabase
        .from('vendors')
        .select(`
          *,
          profiles!vendors_user_id_fkey (
            full_name,
            phone
          )
        `)
        .eq('status', status);

      if (error) throw error;

      // Map database results to VendorData interface
      const data: VendorData[] = (rawData || []).map(vendor => ({
        id: vendor.id,
        business_name: vendor.business_name || '',
        contact_name: vendor.profiles?.full_name || 'N/A',
        email: 'N/A', // Email would need to be stored in vendors table or profiles
        phone: vendor.profiles?.phone || 'N/A',
        address: 'N/A', // Address would need to be added to database schema
        city: 'N/A', // City would need to be added to database schema
        status: vendor.status as 'pending' | 'approved' | 'suspended' | 'rejected',
        rating: vendor.rating || 0,
        total_sales: vendor.total_sales || 0,
        commission_rate: vendor.commission_rate || 0,
        documents: [], // Documents would need to be fetched separately
        created_at: vendor.created_at,
        updated_at: vendor.updated_at
      }));

      return data;
    } catch (error) {
      console.error('Error fetching vendors by status:', error);
      throw error;
    }
  }

  // Get vendor analytics
  static async getVendorAnalytics(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('status')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate analytics
      const total = data?.length || 0;
      const active = data?.filter(v => v.status === 'approved').length || 0;
      const pending = data?.filter(v => v.status === 'pending').length || 0;
      const suspended = data?.filter(v => v.status === 'suspended').length || 0;

      return {
        total,
        active,
        pending,
        suspended,
        growth_rate: 0 // Would need historical data to calculate
      };
    } catch (error) {
      console.error('Error fetching vendor analytics:', error);
      throw error;
    }
  }

  // Get vendor performance reports
  static async getVendorPerformanceReports(vendorId?: string): Promise<VendorPerformanceReport[]> {
    try {
      let query = supabase
        .from('vendor_performance_reports')
        .select('*')
        .order('report_date', { ascending: false });

      if (vendorId) {
        query = query.eq('vendor_id', vendorId);
      }

      const { data: rawData, error } = await query;

      if (error) {
        console.error('Error fetching performance reports:', error);
        throw error;
      }

      // Map database results to VendorPerformanceReport interface with fallbacks
      const data: VendorPerformanceReport[] = (rawData || []).map(report => ({
        id: report.id,
        vendor_id: report.vendor_id,
        report_date: report.report_date,
        period_start: report.period_start,
        period_end: report.period_end,
        performance_score: report.performance_score || 0,
        total_orders: report.total_orders || 0,
        successful_orders: report.successful_orders_count || 0,
        cancelled_orders: report.cancelled_orders_count || 0,
        average_rating: report.average_rating || 0,
        average_response_time_hours: report.response_time_hours || 0,
        revenue_generated: report.total_revenue || 0,
        commission_paid: report.commission_paid || 0,
        customer_complaints: report.customer_complaint_count || 0
      }));

      return data;
    } catch (error) {
      console.error('Error fetching vendor performance reports:', error);
      return [];
    }
  }

  // Get vendor commissions
  static async getVendorCommissions(vendorId: string, filters?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<VendorCommission[]> {
    try {
      let query = supabase
        .from('vendor_commissions')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('transaction_date', { ascending: false });

      if (filters?.startDate) {
        query = query.gte('transaction_date', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('transaction_date', filters.endDate);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching vendor commissions:', error);
      throw error;
    }
  }

  // Create commission for vendor
  static async createCommission(commissionData: {
    vendor_id: string;
    order_id: string;
    gross_amount: number;
    commission_amount: number;
    commission_rate: number;
    transaction_date: string;
    status?: string;
  }): Promise<VendorCommission> {
    try {
      const { data, error } = await supabase
        .from('vendor_commissions')
        .insert({
          vendor_id: commissionData.vendor_id,
          order_id: commissionData.order_id,
          gross_amount: commissionData.gross_amount,
          commission_amount: commissionData.commission_amount,
          commission_rate: commissionData.commission_rate,
          transaction_date: commissionData.transaction_date,
          status: commissionData.status || 'pending',
          net_commission: commissionData.commission_amount,
          platform_fee: 0,
          tax_amount: 0,
          commission_type: 'sales',
          category: 'general',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating commission:', error);
      throw error;
    }
  }

  // Update vendor rating
  static async updateVendorRating(vendorId: string, rating: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('vendors')
        .update({ rating, updated_at: new Date().toISOString() })
        .eq('id', vendorId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating vendor rating:', error);
      throw error;
    }
  }

  // Delete vendor
  static async deleteVendor(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting vendor:', error);
      throw error;
    }
  }
}
