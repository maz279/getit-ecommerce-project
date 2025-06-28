
import { supabase } from '@/integrations/supabase/client';

export interface VendorData {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: any;
  business_type: string;
  registration_number?: string;
  tax_id?: string;
  bank_details: any;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  rating?: number;
  total_sales?: number;
  commission_rate?: number;
  documents?: any[];
  verification_status?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorCommissionData {
  id?: string;
  vendor_id: string;
  order_id: string;
  product_id: string;
  gross_amount: number;
  commission_rate: number;
  commission_amount: number;
  platform_fee?: number;
  net_commission: number;
  currency?: string;
  transaction_date?: string;
  status?: 'pending' | 'approved' | 'paid' | 'disputed';
  payout_batch_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VendorPerformanceReport {
  vendor_id: string;
  period_start: string;
  period_end: string;
  total_orders: number;
  total_revenue: number;
  average_rating: number;
  return_rate: number;
  performance_score: number;
}

export class VendorManagementService {
  // Vendor CRUD Operations
  static async getVendors(filters?: {
    status?: string;
    rating_min?: number;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<VendorData[]> {
    let query = supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status as 'pending' | 'approved' | 'suspended' | 'rejected');
    }
    if (filters?.rating_min) {
      query = query.gte('rating', filters.rating_min);
    }
    if (filters?.search) {
      query = query.or(`business_name.ilike.%${filters.search}%,contact_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as VendorData[];
  }

  static async getVendorById(id: string): Promise<VendorData | null> {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as VendorData | null;
  }

  static async createVendor(vendor: Omit<VendorData, 'id' | 'created_at' | 'updated_at'>): Promise<VendorData> {
    const { data, error } = await supabase
      .from('vendors')
      .insert(vendor)
      .select()
      .single();

    if (error) throw error;
    return data as VendorData;
  }

  static async updateVendor(id: string, updates: Partial<VendorData>): Promise<VendorData> {
    const { data, error } = await supabase
      .from('vendors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as VendorData;
  }

  static async deleteVendor(id: string): Promise<void> {
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Commission Management
  static async getCommissions(filters?: {
    vendor_id?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
    offset?: number;
  }): Promise<VendorCommissionData[]> {
    let query = supabase
      .from('vendor_commissions')
      .select('*')
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
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as VendorCommissionData[];
  }

  static async createCommission(commission: VendorCommissionData): Promise<VendorCommissionData> {
    // Map the commission data to match the database schema
    const insertData = {
      vendor_id: commission.vendor_id,
      order_id: commission.order_id,
      product_id: commission.product_id,
      gross_amount: commission.gross_amount,
      commission_rate: commission.commission_rate,
      commission_amount: commission.commission_amount,
      platform_fee: commission.platform_fee || 0,
      net_commission: commission.net_commission,
      currency: commission.currency || 'BDT',
      transaction_date: commission.transaction_date || new Date().toISOString().split('T')[0],
      status: commission.status || 'pending',
      payout_batch_id: commission.payout_batch_id,
      notes: commission.notes,
      // Add required fields that are missing
      commission_type: 'percentage', // Default commission type
      transaction_id: commission.order_id // Use order_id as transaction_id
    };

    const { data, error } = await supabase
      .from('vendor_commissions')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data as VendorCommissionData;
  }

  // Performance Analytics
  static async getPerformanceReports(filters?: {
    vendor_id?: string;
    period_start?: string;
    period_end?: string;
  }): Promise<VendorPerformanceReport[]> {
    let query = supabase
      .from('vendor_performance_reports')
      .select('*')
      .order('period_start', { ascending: false });

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
    return (data || []) as VendorPerformanceReport[];
  }

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

    // Get commission data for the period
    const { data: commissions, error: commissionError } = await supabase
      .from('vendor_commissions')
      .select('*')
      .eq('vendor_id', vendorId)
      .gte('transaction_date', startDate.toISOString().split('T')[0])
      .lte('transaction_date', endDate.toISOString().split('T')[0]);

    if (commissionError) throw commissionError;

    // Calculate analytics
    const totalCommissions = commissions?.reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0;
    const totalRevenue = commissions?.reduce((sum, c) => sum + (c.gross_amount || 0), 0) || 0;
    const averageCommission = commissions?.length ? totalCommissions / commissions.length : 0;

    return {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalCommissions,
      totalRevenue,
      averageCommission,
      transactionCount: commissions?.length || 0,
      commissionRate: totalRevenue > 0 ? (totalCommissions / totalRevenue) * 100 : 0
    };
  }

  // Vendor Status Management
  static async approveVendor(vendorId: string, approvedBy: string): Promise<VendorData> {
    return await this.updateVendor(vendorId, {
      status: 'approved',
      updated_at: new Date().toISOString()
    });
  }

  static async suspendVendor(vendorId: string, reason: string): Promise<VendorData> {
    return await this.updateVendor(vendorId, {
      status: 'suspended',
      updated_at: new Date().toISOString()
    });
  }

  static async rejectVendor(vendorId: string, reason: string): Promise<VendorData> {
    return await this.updateVendor(vendorId, {
      status: 'rejected',
      updated_at: new Date().toISOString()
    });
  }
}
