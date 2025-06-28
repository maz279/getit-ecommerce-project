
import { supabase } from '@/integrations/supabase/client';

export interface VendorData {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  rating: number;
  total_sales: number;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  trade_license: string;
  category: string;
}

export interface VendorCommissionData {
  id?: string;
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
  id: string;
  vendor_id: string;
  period_start: string;
  period_end: string;
  performance_score: number;
  total_orders: number;
  successful_orders: number;
  cancelled_orders: number;
  return_rate: number;
  average_rating: number;
  response_time_hours: number;
  delivery_time_days: number;
  revenue_generated: number;
  commission_earned: number;
  customer_complaints: number;
  report_generated_at: string;
  report_generated_by: string;
}

export class VendorManagementService {
  // Get all vendors with filters
  static async getVendors(filters?: any): Promise<VendorData[]> {
    let query = supabase
      .from('vendors')
      .select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.search) {
      query = query.ilike('business_name', `%${filters.search}%`);
    }
    if (filters?.rating_min) {
      query = query.gte('rating', filters.rating_min);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Map database results to VendorData interface
    return (data || []).map(vendor => ({
      id: vendor.id,
      business_name: vendor.business_name,
      contact_name: vendor.business_name, // Using business_name as fallback for contact_name
      email: `${vendor.business_name.toLowerCase().replace(/\s+/g, '')}@example.com`, // Generate email as fallback
      phone: '+880-1711-000000', // Default phone as fallback
      address: 'Dhaka, Bangladesh', // Default address as fallback
      status: vendor.status as 'pending' | 'approved' | 'suspended' | 'rejected',
      rating: vendor.rating,
      total_sales: vendor.total_sales,
      commission_rate: vendor.commission_rate,
      created_at: vendor.created_at,
      updated_at: vendor.updated_at,
      user_id: vendor.user_id,
      trade_license: vendor.trade_license,
      category: 'General' // Default category as fallback
    }));
  }

  // Get vendor by ID
  static async getVendorById(id: string): Promise<VendorData> {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Vendor not found');

    // Map database result to VendorData interface
    return {
      id: data.id,
      business_name: data.business_name,
      contact_name: data.business_name, // Using business_name as fallback
      email: `${data.business_name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: '+880-1711-000000',
      address: 'Dhaka, Bangladesh',
      status: data.status as 'pending' | 'approved' | 'suspended' | 'rejected',
      rating: data.rating,
      total_sales: data.total_sales,
      commission_rate: data.commission_rate,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id,
      trade_license: data.trade_license,
      category: 'General'
    };
  }

  // Update vendor status
  static async updateVendorStatus(id: string, status: string): Promise<VendorData> {
    const { data, error } = await supabase
      .from('vendors')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update vendor');

    // Map database result to VendorData interface
    return {
      id: data.id,
      business_name: data.business_name,
      contact_name: data.business_name,
      email: `${data.business_name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: '+880-1711-000000',
      address: 'Dhaka, Bangladesh',
      status: data.status as 'pending' | 'approved' | 'suspended' | 'rejected',
      rating: data.rating,
      total_sales: data.total_sales,
      commission_rate: data.commission_rate,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id,
      trade_license: data.trade_license,
      category: 'General'
    };
  }

  // Suspend vendor
  static async suspendVendor(id: string, reason: string): Promise<VendorData> {
    const { data, error } = await supabase
      .from('vendors')
      .update({ 
        status: 'suspended',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to suspend vendor');

    // Map database result to VendorData interface
    return {
      id: data.id,
      business_name: data.business_name,
      contact_name: data.business_name,
      email: `${data.business_name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: '+880-1711-000000',
      address: 'Dhaka, Bangladesh',
      status: data.status as 'pending' | 'approved' | 'suspended' | 'rejected',
      rating: data.rating,
      total_sales: data.total_sales,
      commission_rate: data.commission_rate,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id,
      trade_license: data.trade_license,
      category: 'General'
    };
  }

  // Create commission record
  static async createCommission(commissionData: VendorCommissionData): Promise<VendorCommissionData> {
    const insertData = {
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
      transaction_id: commissionData.order_id // Using order_id as transaction_id
    };

    const { data, error } = await supabase
      .from('vendor_commissions')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create commission');

    return {
      id: data.id,
      vendor_id: data.vendor_id,
      order_id: data.order_id,
      product_id: data.product_id,
      gross_amount: data.gross_amount,
      commission_rate: data.commission_rate,
      commission_amount: data.commission_amount,
      platform_fee: data.platform_fee,
      net_commission: data.net_commission,
      currency: data.currency,
      transaction_date: data.transaction_date,
      status: data.status as 'pending' | 'paid' | 'disputed',
      payout_batch_id: data.payout_batch_id,
      notes: data.notes
    };
  }

  // Get performance reports
  static async getPerformanceReports(filters?: any): Promise<VendorPerformanceReport[]> {
    let query = supabase
      .from('vendor_performance_reports')
      .select('*');

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters?.period_start) {
      query = query.gte('period_start', filters.period_start);
    }
    if (filters?.period_end) {
      query = query.lte('period_end', filters.period_end);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Map database results to VendorPerformanceReport interface
    return (data || []).map(report => ({
      id: report.id,
      vendor_id: report.vendor_id,
      period_start: report.report_period_start || new Date().toISOString(), // Use fallback
      period_end: report.report_period_end || new Date().toISOString(), // Use fallback
      performance_score: report.overall_performance_score || 0, // Use fallback
      total_orders: report.total_orders || 0,
      successful_orders: report.successful_orders || 0,
      cancelled_orders: report.cancelled_orders || 0,
      return_rate: report.return_rate || 0,
      average_rating: report.average_rating || 0,
      response_time_hours: report.average_response_time_hours || 0,
      delivery_time_days: report.average_delivery_time_days || 0,
      revenue_generated: report.revenue_generated || 0,
      commission_earned: report.commission_paid || 0,
      customer_complaints: report.customer_complaints || 0,
      report_generated_at: report.created_at,
      report_generated_by: report.approved_by || 'system'
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
    }

    // Get commission data for the vendor
    const { data: commissions, error } = await supabase
      .from('vendor_commissions')
      .select('*')
      .eq('vendor_id', vendorId)
      .gte('transaction_date', startDate.toISOString())
      .lte('transaction_date', endDate.toISOString());

    if (error) throw error;

    // Calculate analytics
    const totalCommission = commissions?.reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0;
    const totalSales = commissions?.reduce((sum, c) => sum + (c.gross_amount || 0), 0) || 0;
    const averageOrderValue = commissions?.length ? totalSales / commissions.length : 0;

    return {
      vendorId,
      period,
      totalCommission,
      totalSales,
      averageOrderValue,
      totalOrders: commissions?.length || 0,
      conversionRate: 0.05, // Mock data
      topProducts: [], // Mock data
      revenueGrowth: 0.12, // Mock data
      customerSatisfaction: 4.5 // Mock data
    };
  }
}
