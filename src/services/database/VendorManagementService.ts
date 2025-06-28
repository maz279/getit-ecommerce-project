
import { supabase } from '@/integrations/supabase/client';

export interface VendorData {
  id?: string;
  user_id: string;
  business_name: string;
  trade_license?: string;
  status?: 'pending' | 'approved' | 'suspended' | 'rejected';
  commission_rate?: number;
  rating?: number;
  total_sales?: number;
  phone?: string;
  email?: string;
  address?: any;
  bank_details?: any;
  documents?: any[];
}

export interface VendorPerformanceData {
  vendor_id: string;
  report_period_start: string;
  report_period_end: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  total_revenue?: number;
  total_orders?: number;
  average_order_value?: number;
  conversion_rate?: number;
  customer_satisfaction_score?: number;
  response_time_hours?: number;
  resolution_rate?: number;
  on_time_delivery_rate?: number;
  return_rate?: number;
  product_quality_rating?: number;
  created_by: string;
}

export class VendorManagementService {
  // Vendor CRUD Operations
  static async createVendor(vendorData: VendorData): Promise<VendorData> {
    const { data, error } = await supabase
      .from('vendors')
      .insert(vendorData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getVendors(filters?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<VendorData[]> {
    let query = supabase
      .from('vendors')
      .select(`
        *,
        vendor_ratings (
          overall_rating,
          total_reviews,
          service_quality,
          delivery_speed,
          communication,
          product_quality
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.search) {
      query = query.or(`business_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getVendorById(id: string): Promise<VendorData | null> {
    const { data, error } = await supabase
      .from('vendors')
      .select(`
        *,
        vendor_ratings (
          overall_rating,
          total_reviews,
          service_quality,
          delivery_speed,
          communication,
          product_quality,
          rating_breakdown
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateVendor(id: string, updates: Partial<VendorData>): Promise<VendorData> {
    const { data, error } = await supabase
      .from('vendors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteVendor(id: string): Promise<void> {
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Vendor Performance Management
  static async createPerformanceReport(reportData: VendorPerformanceData): Promise<any> {
    const { data, error } = await supabase
      .from('vendor_performance_reports')
      .insert(reportData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getPerformanceReports(filters?: {
    vendor_id?: string;
    report_type?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<any[]> {
    let query = supabase
      .from('vendor_performance_reports')
      .select(`
        *,
        vendors (
          business_name,
          email,
          status
        )
      `)
      .order('report_period_end', { ascending: false });

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters?.report_type) {
      query = query.eq('report_type', filters.report_type);
    }
    if (filters?.date_from) {
      query = query.gte('report_period_start', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('report_period_end', filters.date_to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Vendor Ratings Management
  static async updateVendorRating(
    vendorId: string,
    ratingData: {
      overall_rating?: number;
      total_reviews?: number;
      service_quality?: number;
      delivery_speed?: number;
      communication?: number;
      product_quality?: number;
      rating_breakdown?: any;
    }
  ): Promise<any> {
    const { data, error } = await supabase
      .from('vendor_ratings')
      .upsert({
        vendor_id: vendorId,
        ...ratingData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getVendorRatings(vendorId?: string): Promise<any[]> {
    let query = supabase
      .from('vendor_ratings')
      .select(`
        *,
        vendors (
          business_name,
          email,
          status
        )
      `)
      .order('updated_at', { ascending: false });

    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Commission Management
  static async getVendorCommissions(filters?: {
    vendor_id?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<any[]> {
    let query = supabase
      .from('vendor_commissions')
      .select(`
        *,
        vendors (
          business_name,
          email
        ),
        orders (
          order_number,
          total_amount,
          status
        )
      `)
      .order('created_at', { ascending: false });

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
    return data || [];
  }

  static async updateCommissionStatus(
    id: string,
    status: 'pending' | 'approved' | 'paid' | 'disputed',
    notes?: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from('vendor_commissions')
      .update({
        status,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Vendor Analytics
  static async getVendorAnalytics(vendorId: string, period: string = '30d'): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();
    
    // Calculate start date based on period
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    // Get commission analytics
    const { data: commissions, error: commissionError } = await supabase
      .from('vendor_commissions')
      .select('*')
      .eq('vendor_id', vendorId)
      .gte('transaction_date', startDate.toISOString().split('T')[0])
      .lte('transaction_date', endDate.toISOString().split('T')[0]);

    if (commissionError) throw commissionError;

    // Get order analytics
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            vendor_id
          )
        )
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (orderError) throw orderError;

    // Filter orders for this vendor
    const vendorOrders = orders?.filter(order => 
      order.order_items?.some(item => item.products?.vendor_id === vendorId)
    ) || [];

    // Calculate analytics
    const totalCommission = commissions?.reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0;
    const totalRevenue = commissions?.reduce((sum, c) => sum + (c.gross_amount || 0), 0) || 0;
    const totalOrders = vendorOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalCommission,
      totalRevenue,
      totalOrders,
      averageOrderValue,
      commissionRate: totalRevenue > 0 ? (totalCommission / totalRevenue) * 100 : 0,
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  }
}
