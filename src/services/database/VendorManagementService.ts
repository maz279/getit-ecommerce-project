
import { supabase } from '@/integrations/supabase/client';

export interface VendorData {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  rating: number;
  totalSales: number;
  commissionRate: number;
  joinDate: string;
  documents: Array<{
    type: string;
    url: string;
    verified: boolean;
  }>;
}

export interface VendorPerformanceReport {
  id: string;
  vendor_id: string;
  report_period_start: string;
  report_period_end: string;
  report_type: string;
  status?: string;
  total_revenue?: number;
  total_orders?: number;
  customer_satisfaction_score?: number;
  on_time_delivery_rate?: number;
  created_at?: string;
  notes?: string;
}

export class VendorManagementService {
  static async getVendors(filters?: any): Promise<{ data: VendorData[]; total: number }> {
    try {
      let query = supabase
        .from('vendors')
        .select(`
          *,
          profiles!inner(full_name, phone)
        `);

      if (filters?.status && filters.status !== 'all') {
        // Safely cast the status to the expected enum type
        const validStatuses = ['pending', 'approved', 'suspended', 'rejected'] as const;
        if (validStatuses.includes(filters.status as any)) {
          query = query.eq('status', filters.status);
        }
      }

      if (filters?.search) {
        query = query.or(`business_name.ilike.%${filters.search}%,trade_license.ilike.%${filters.search}%`);
      }

      const { data: vendors, error, count } = await query;

      if (error) {
        console.error('Error fetching vendors:', error);
        throw error;
      }

      const mappedVendors: VendorData[] = (vendors || []).map(vendor => {
        // Access the first profile if it exists
        const profile = Array.isArray(vendor.profiles) && vendor.profiles.length > 0 ? vendor.profiles[0] : null;
        
        return {
          id: vendor.id,
          businessName: vendor.business_name || '',
          contactPerson: profile?.full_name || 'N/A',
          email: 'contact@business.com', // Default fallback
          phone: profile?.phone || 'N/A',
          address: 'N/A', // Default fallback
          city: 'N/A', // Default fallback
          status: vendor.status as 'pending' | 'approved' | 'suspended' | 'rejected',
          rating: vendor.rating || 0,
          totalSales: vendor.total_sales || 0,
          commissionRate: vendor.commission_rate || 0,
          joinDate: vendor.created_at || '',
          documents: [] // Default fallback
        };
      });

      return {
        data: mappedVendors,
        total: count || mappedVendors.length
      };
    } catch (error) {
      console.error('Error in getVendors:', error);
      throw error;
    }
  }

  static async getActiveVendors(filters?: any): Promise<{ data: VendorData[]; total: number }> {
    try {
      let query = supabase
        .from('vendors')
        .select(`
          *,
          profiles!inner(full_name, phone)
        `)
        .eq('status', 'approved');

      if (filters?.search) {
        query = query.or(`business_name.ilike.%${filters.search}%,trade_license.ilike.%${filters.search}%`);
      }

      const { data: vendors, error, count } = await query;

      if (error) {
        console.error('Error fetching active vendors:', error);
        throw error;
      }

      const mappedVendors: VendorData[] = (vendors || []).map(vendor => {
        // Access the first profile if it exists
        const profile = Array.isArray(vendor.profiles) && vendor.profiles.length > 0 ? vendor.profiles[0] : null;
        
        return {
          id: vendor.id,
          businessName: vendor.business_name || '',
          contactPerson: profile?.full_name || 'N/A',
          email: 'contact@business.com', // Default fallback
          phone: profile?.phone || 'N/A',
          address: 'N/A', // Default fallback
          city: 'N/A', // Default fallback
          status: vendor.status as 'pending' | 'approved' | 'suspended' | 'rejected',
          rating: vendor.rating || 0,
          totalSales: vendor.total_sales || 0,
          commissionRate: vendor.commission_rate || 0,
          joinDate: vendor.created_at || '',
          documents: [] // Default fallback
        };
      });

      return {
        data: mappedVendors,
        total: count || mappedVendors.length
      };
    } catch (error) {
      console.error('Error in getActiveVendors:', error);
      throw error;
    }
  }

  static async getPendingVendors(filters?: any): Promise<{ data: VendorData[]; total: number }> {
    try {
      let query = supabase
        .from('vendors')
        .select(`
          *,
          profiles!inner(full_name, phone)
        `)
        .eq('status', 'pending');

      if (filters?.search) {
        query = query.or(`business_name.ilike.%${filters.search}%,trade_license.ilike.%${filters.search}%`);
      }

      const { data: vendors, error, count } = await query;

      if (error) {
        console.error('Error fetching pending vendors:', error);
        throw error;
      }

      const mappedVendors: VendorData[] = (vendors || []).map(vendor => {
        // Access the first profile if it exists
        const profile = Array.isArray(vendor.profiles) && vendor.profiles.length > 0 ? vendor.profiles[0] : null;
        
        return {
          id: vendor.id,
          businessName: vendor.business_name || '',
          contactPerson: profile?.full_name || 'N/A',
          email: 'contact@business.com', // Default fallback
          phone: profile?.phone || 'N/A',
          address: 'N/A', // Default fallback
          city: 'N/A', // Default fallback
          status: vendor.status as 'pending' | 'approved' | 'suspended' | 'rejected',
          rating: vendor.rating || 0,
          totalSales: vendor.total_sales || 0,
          commissionRate: vendor.commission_rate || 0,
          joinDate: vendor.created_at || '',
          documents: [] // Default fallback
        };
      });

      return {
        data: mappedVendors,
        total: count || mappedVendors.length
      };
    } catch (error) {
      console.error('Error in getPendingVendors:', error);
      throw error;
    }
  }

  static async getVendorPerformanceReports(filters?: any): Promise<VendorPerformanceReport[]> {
    try {
      // Since the actual table doesn't exist, return mock data that matches the interface
      const mockReports: VendorPerformanceReport[] = [
        {
          id: '1',
          vendor_id: 'vendor-1',
          report_period_start: '2024-01-01',
          report_period_end: '2024-01-31',
          report_type: 'monthly',
          status: 'published',
          total_revenue: 25000,
          total_orders: 150,
          customer_satisfaction_score: 4.5,
          on_time_delivery_rate: 95,
          created_at: '2024-02-01T00:00:00Z',
          notes: 'Strong performance this month'
        },
        {
          id: '2',
          vendor_id: 'vendor-2',
          report_period_start: '2024-01-01',
          report_period_end: '2024-01-31',
          report_type: 'monthly',
          status: 'draft',
          total_revenue: 18000,
          total_orders: 120,
          customer_satisfaction_score: 4.2,
          on_time_delivery_rate: 88,
          created_at: '2024-02-01T00:00:00Z',
          notes: 'Need to improve delivery times'
        }
      ];

      return mockReports;
    } catch (error) {
      console.error('Error fetching vendor performance reports:', error);
      throw error;
    }
  }

  static async getVendorAnalytics(vendorId: string): Promise<any> {
    try {
      // Return mock analytics data
      return {
        totalRevenue: 50000,
        totalOrders: 300,
        averageRating: 4.3,
        performanceScore: 85
      };
    } catch (error) {
      console.error('Error fetching vendor analytics:', error);
      throw error;
    }
  }

  static async createCommission(data: any): Promise<any> {
    try {
      const commissionData = {
        vendor_id: data.vendor_id,
        order_id: data.order_id,
        transaction_id: data.transaction_id || `txn_${Date.now()}`, // Generate if missing
        gross_amount: data.gross_amount,
        commission_amount: data.commission_amount,
        commission_rate: data.commission_rate,
        transaction_date: data.transaction_date,
        status: data.status,
        net_commission: data.net_commission,
        platform_fee: data.platform_fee,
        tax_amount: data.tax_amount,
        commission_type: data.commission_type,
        category: data.category,
        payment_status: data.payment_status
      };

      const { data: result, error } = await supabase
        .from('vendor_commissions')
        .insert(commissionData)
        .select()
        .single();

      if (error) {
        console.error('Error creating commission:', error);
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Error in createCommission:', error);
      throw error;
    }
  }
}
