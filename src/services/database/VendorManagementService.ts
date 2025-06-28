import { supabase } from '@/integrations/supabase/client';

export interface VendorData {
  id?: string;
  user_id: string;
  business_name: string;
  trade_license?: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  commission_rate?: number;
  rating?: number;
  total_sales?: number;
  phone?: string;
  email?: string;
  address?: any;
  bank_details?: any;
  documents?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface VendorCommissionData {
  id?: string;
  vendor_id: string;
  order_id?: string;
  product_id?: string;
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

export interface VendorRatingData {
  id?: string;
  vendor_id: string;
  overall_rating?: number;
  total_reviews?: number;
  service_quality?: number;
  delivery_speed?: number;
  communication?: number;
  product_quality?: number;
  rating_breakdown?: any;
  updated_at?: string;
  created_at?: string;
}

export class VendorManagementService {
  // Vendor Management
  static async getVendors(filters?: {
    status?: string;
    rating_min?: number;
    date_from?: string;
    date_to?: string;
    limit?: number;
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
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'pending' | 'approved' | 'suspended' | 'rejected'
    })) as VendorData[];
  }

  static async createVendor(vendor: VendorData): Promise<VendorData> {
    const { data, error } = await supabase
      .from('vendors')
      .insert(vendor)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as 'pending' | 'approved' | 'suspended' | 'rejected'
    } as VendorData;
  }

  static async updateVendor(id: string, updates: Partial<VendorData>): Promise<VendorData> {
    const { data, error } = await supabase
      .from('vendors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as 'pending' | 'approved' | 'suspended' | 'rejected'
    } as VendorData;
  }

  // Commission Management
  static async getCommissions(filters?: {
    vendor_id?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }): Promise<VendorCommissionData[]> {
    let query = supabase
      .from('vendor_commissions')
      .select('*')
      .order('transaction_date', { ascending: false });

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

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'pending' | 'approved' | 'paid' | 'disputed'
    })) as VendorCommissionData[];
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
      notes: commission.notes
    };

    const { data, error } = await supabase
      .from('vendor_commissions')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as 'pending' | 'approved' | 'paid' | 'disputed'
    } as VendorCommissionData;
  }

  // Performance Reports
  static async getPerformanceReports(filters?: {
    vendor_id?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }): Promise<any[]> {
    let query = supabase
      .from('commission_analytics')
      .select('*')
      .order('analytics_date', { ascending: false });

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters?.date_from) {
      query = query.gte('analytics_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('analytics_date', filters.date_to);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Vendor Analytics
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

    const { data: commissions, error } = await supabase
      .from('vendor_commissions')
      .select('*')
      .eq('vendor_id', vendorId)
      .gte('transaction_date', startDate.toISOString().split('T')[0])
      .lte('transaction_date', endDate.toISOString().split('T')[0]);

    if (error) throw error;

    const totalCommissions = commissions?.reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0;
    const totalSales = commissions?.reduce((sum, c) => sum + (c.gross_amount || 0), 0) || 0;
    const totalOrders = commissions?.length || 0;

    return {
      totalCommissions,
      totalSales,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  }

  // Vendor Ratings
  static async getVendorRatings(filters?: {
    vendor_id?: string;
    rating_min?: number;
    limit?: number;
  }): Promise<VendorRatingData[]> {
    let query = supabase
      .from('vendor_ratings')
      .select('*')
      .order('updated_at', { ascending: false });

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters?.rating_min) {
      query = query.gte('overall_rating', filters.rating_min);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as VendorRatingData[];
  }

  static async updateVendorRating(vendorId: string, ratingData: Partial<VendorRatingData>): Promise<VendorRatingData> {
    const { data, error } = await supabase
      .from('vendor_ratings')
      .upsert({ vendor_id: vendorId, ...ratingData })
      .select()
      .single();

    if (error) throw error;
    return data as VendorRatingData;
  }
}
