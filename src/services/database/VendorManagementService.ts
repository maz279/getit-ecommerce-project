
import { supabase } from '@/integrations/supabase/client';

export interface VendorData {
  id: string;
  user_id: string;
  business_name: string;
  trade_license?: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  commission_rate: number;
  rating: number;
  total_sales: number;
  created_at: string;
  updated_at: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  documents: any[];
}

export interface VendorCommissionData {
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
  status: 'pending' | 'paid' | 'disputed';
  payout_batch_id: string;
  notes: string;
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
  commission_earned: number;
  customer_complaints: number;
}

export class VendorManagementService {
  // Get all vendors with optional filtering
  static async getVendors(filters?: any): Promise<VendorData[]> {
    let query = supabase
      .from('vendors')
      .select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.business_name) {
      query = query.ilike('business_name', `%${filters.business_name}%`);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Map database results to VendorData interface
    return (data || []).map(vendor => ({
      id: vendor.id,
      user_id: vendor.user_id,
      business_name: vendor.business_name,
      trade_license: vendor.trade_license,
      status: vendor.status as 'pending' | 'approved' | 'suspended' | 'rejected',
      commission_rate: vendor.commission_rate,
      rating: vendor.rating,
      total_sales: vendor.total_sales,
      created_at: vendor.created_at,
      updated_at: vendor.updated_at,
      contact_name: vendor.contact_name || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      address: vendor.address || '',
      city: vendor.city || '',
      documents: vendor.documents || []
    }));
  }

  // Get single vendor by ID
  static async getVendorById(id: string): Promise<VendorData | null> {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      user_id: data.user_id,
      business_name: data.business_name,
      trade_license: data.trade_license,
      status: data.status as 'pending' | 'approved' | 'suspended' | 'rejected',
      commission_rate: data.commission_rate,
      rating: data.rating,
      total_sales: data.total_sales,
      created_at: data.created_at,
      updated_at: data.updated_at,
      contact_name: data.contact_name || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || '',
      documents: data.documents || []
    };
  }

  // Update vendor status
  static async updateVendorStatus(id: string, status: string): Promise<VendorData> {
    const { data, error } = await supabase
      .from('vendors')
      .update({ 
        status: status as 'pending' | 'approved' | 'suspended' | 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      user_id: data.user_id,
      business_name: data.business_name,
      trade_license: data.trade_license,
      status: data.status as 'pending' | 'approved' | 'suspended' | 'rejected',
      commission_rate: data.commission_rate,
      rating: data.rating,
      total_sales: data.total_sales,
      created_at: data.created_at,
      updated_at: data.updated_at,
      contact_name: data.contact_name || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || '',
      documents: data.documents || []
    };
  }

  // Create vendor commission record
  static async createCommission(commissionData: VendorCommissionData): Promise<any> {
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
        commission_type: 'sale',
        transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get vendor performance reports
  static async getPerformanceReports(filters?: any): Promise<VendorPerformanceReport[]> {
    let query = supabase
      .from('vendor_performance_reports')
      .select(`
        *,
        total_orders:total_orders_count,
        successful_orders:successful_orders_count,
        cancelled_orders:cancelled_orders_count,
        revenue_generated:total_revenue,
        customer_complaints:complaints_count,
        payout_batch_id
      `);

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters?.period_start) {
      query = query.gte('report_date', filters.period_start);
    }
    if (filters?.period_end) {
      query = query.lte('report_date', filters.period_end);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Map database results to VendorPerformanceReport interface
    return (data || []).map(report => ({
      vendor_id: report.vendor_id,
      period_start: report.report_date || new Date().toISOString().split('T')[0],
      period_end: report.report_date || new Date().toISOString().split('T')[0],
      performance_score: report.performance_score || 0,
      total_orders: report.total_orders || report.total_orders_count || 0,
      successful_orders: report.successful_orders || report.successful_orders_count || 0,
      cancelled_orders: report.cancelled_orders || report.cancelled_orders_count || 0,
      average_rating: report.average_rating || 0,
      response_time_hours: report.response_time_hours || 0,
      revenue_generated: report.revenue_generated || report.total_revenue || 0,
      commission_earned: report.commission_paid || 0,
      customer_complaints: report.customer_complaints || report.complaints_count || 0
    }));
  }

  // Get vendor analytics
  static async getVendorAnalytics(vendorId: string, period: string = '30d'): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();

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

    // Get commission data
    const { data: commissions, error: commissionError } = await supabase
      .from('vendor_commissions')
      .select('*')
      .eq('vendor_id', vendorId)
      .gte('transaction_date', startDate.toISOString())
      .lte('transaction_date', endDate.toISOString());

    if (commissionError) throw commissionError;

    // Get order data
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (vendor_id)
        )
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (orderError) throw orderError;

    // Filter orders for this vendor
    const vendorOrders = orders?.filter(order => 
      order.order_items?.some((item: any) => item.products?.vendor_id === vendorId)
    ) || [];

    const totalCommission = commissions?.reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0;
    const totalRevenue = vendorOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const totalOrders = vendorOrders.length;

    return {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalCommission,
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      commissionRate: totalRevenue > 0 ? (totalCommission / totalRevenue) * 100 : 0,
      ordersData: vendorOrders,
      commissionsData: commissions || []
    };
  }

  // Additional utility methods can be added here
  static async getVendorStats(): Promise<any> {
    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('status');

    if (error) throw error;

    const stats = {
      total: vendors?.length || 0,
      pending: vendors?.filter(v => v.status === 'pending').length || 0,
      approved: vendors?.filter(v => v.status === 'approved').length || 0,
      suspended: vendors?.filter(v => v.status === 'suspended').length || 0,
      rejected: vendors?.filter(v => v.status === 'rejected').length || 0
    };

    return stats;
  }
}
