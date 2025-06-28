
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type definitions
type RevenueModel = Database['public']['Tables']['revenue_models']['Row'];
type RevenueModelInsert = Database['public']['Tables']['revenue_models']['Insert'];
type RevenueModelUpdate = Database['public']['Tables']['revenue_models']['Update'];

type RevenueSplitConfig = Database['public']['Tables']['revenue_split_config']['Row'];
type RevenueSplitConfigInsert = Database['public']['Tables']['revenue_split_config']['Insert'];
type RevenueSplitConfigUpdate = Database['public']['Tables']['revenue_split_config']['Update'];

type PaymentTermsConfig = Database['public']['Tables']['payment_terms_config']['Row'];
type PaymentTermsConfigInsert = Database['public']['Tables']['payment_terms_config']['Insert'];
type PaymentTermsConfigUpdate = Database['public']['Tables']['payment_terms_config']['Update'];

type RevenueForecast = Database['public']['Tables']['revenue_forecasts']['Row'];
type RevenueForecastInsert = Database['public']['Tables']['revenue_forecasts']['Insert'];

type IncentiveProgram = Database['public']['Tables']['incentive_programs']['Row'];
type IncentiveProgramInsert = Database['public']['Tables']['incentive_programs']['Insert'];
type IncentiveProgramUpdate = Database['public']['Tables']['incentive_programs']['Update'];

type RevenueDispute = Database['public']['Tables']['revenue_disputes']['Row'];
type RevenueDisputeInsert = Database['public']['Tables']['revenue_disputes']['Insert'];
type RevenueDisputeUpdate = Database['public']['Tables']['revenue_disputes']['Update'];

type RevenueAnalyticsSummary = Database['public']['Tables']['revenue_analytics_summary']['Row'];

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface RevenueSharingFilters {
  model_type?: string;
  is_active?: boolean;
  date_from?: string;
  date_to?: string;
  vendor_id?: string;
  category_id?: string;
}

export class RevenueSharingService {
  
  // Revenue Models
  static async getRevenueModels(filters?: RevenueSharingFilters, pagination?: PaginationParams): Promise<RevenueModel[]> {
    let query = supabase
      .from('revenue_models')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.model_type) {
      query = query.eq('model_type', filters.model_type);
    }
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    if (pagination?.limit) {
      query = query.limit(pagination.limit);
    }
    if (pagination?.offset) {
      query = query.range(pagination.offset, (pagination.offset + (pagination.limit || 50)) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createRevenueModel(model: RevenueModelInsert): Promise<RevenueModel> {
    const { data, error } = await supabase
      .from('revenue_models')
      .insert(model)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateRevenueModel(id: string, updates: RevenueModelUpdate): Promise<RevenueModel> {
    const { data, error } = await supabase
      .from('revenue_models')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteRevenueModel(id: string): Promise<void> {
    const { error } = await supabase
      .from('revenue_models')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Revenue Split Configuration
  static async getRevenueSplitConfigs(filters?: RevenueSharingFilters): Promise<RevenueSplitConfig[]> {
    let query = supabase
      .from('revenue_split_config')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createRevenueSplitConfig(config: RevenueSplitConfigInsert): Promise<RevenueSplitConfig> {
    const { data, error } = await supabase
      .from('revenue_split_config')
      .insert(config)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateRevenueSplitConfig(id: string, updates: RevenueSplitConfigUpdate): Promise<RevenueSplitConfig> {
    const { data, error } = await supabase
      .from('revenue_split_config')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Payment Terms Configuration
  static async getPaymentTermsConfigs(filters?: RevenueSharingFilters): Promise<PaymentTermsConfig[]> {
    let query = supabase
      .from('payment_terms_config')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createPaymentTermsConfig(config: PaymentTermsConfigInsert): Promise<PaymentTermsConfig> {
    const { data, error } = await supabase
      .from('payment_terms_config')
      .insert(config)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePaymentTermsConfig(id: string, updates: PaymentTermsConfigUpdate): Promise<PaymentTermsConfig> {
    const { data, error } = await supabase
      .from('payment_terms_config')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Revenue Forecasts
  static async getRevenueForecasts(filters?: RevenueSharingFilters, pagination?: PaginationParams): Promise<RevenueForecast[]> {
    let query = supabase
      .from('revenue_forecasts')
      .select('*')
      .order('forecast_date', { ascending: false });

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters?.date_from) {
      query = query.gte('forecast_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('forecast_date', filters.date_to);
    }

    if (pagination?.limit) {
      query = query.limit(pagination.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createRevenueForecast(forecast: RevenueForecastInsert): Promise<RevenueForecast> {
    const { data, error } = await supabase
      .from('revenue_forecasts')
      .insert(forecast)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Incentive Programs
  static async getIncentivePrograms(filters?: RevenueSharingFilters): Promise<IncentiveProgram[]> {
    let query = supabase
      .from('incentive_programs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }
    if (filters?.date_from) {
      query = query.gte('start_date', filters.date_from);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createIncentiveProgram(program: IncentiveProgramInsert): Promise<IncentiveProgram> {
    const { data, error } = await supabase
      .from('incentive_programs')
      .insert(program)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateIncentiveProgram(id: string, updates: IncentiveProgramUpdate): Promise<IncentiveProgram> {
    const { data, error } = await supabase
      .from('incentive_programs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Revenue Disputes
  static async getRevenueDisputes(filters?: RevenueSharingFilters, pagination?: PaginationParams): Promise<RevenueDispute[]> {
    let query = supabase
      .from('revenue_disputes')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }

    if (pagination?.limit) {
      query = query.limit(pagination.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createRevenueDispute(dispute: RevenueDisputeInsert): Promise<RevenueDispute> {
    const { data, error } = await supabase
      .from('revenue_disputes')
      .insert(dispute)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateRevenueDispute(id: string, updates: RevenueDisputeUpdate): Promise<RevenueDispute> {
    const { data, error } = await supabase
      .from('revenue_disputes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Revenue Analytics
  static async getRevenueAnalytics(filters?: RevenueSharingFilters, pagination?: PaginationParams): Promise<RevenueAnalyticsSummary[]> {
    let query = supabase
      .from('revenue_analytics_summary')
      .select('*')
      .order('analytics_date', { ascending: false });

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters?.date_from) {
      query = query.gte('analytics_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('analytics_date', filters.date_to);
    }

    if (pagination?.limit) {
      query = query.limit(pagination.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Utility methods
  static async getTotalRevenueStats(): Promise<{
    totalRevenue: number;
    totalCommission: number;
    activeModels: number;
    totalDisputes: number;
  }> {
    const [revenueData, modelsData, disputesData] = await Promise.all([
      supabase
        .from('revenue_analytics_summary')
        .select('total_revenue, total_commission')
        .eq('analytics_period', 'monthly'),
      supabase
        .from('revenue_models')
        .select('id')
        .eq('is_active', true),
      supabase
        .from('revenue_disputes')
        .select('id')
        .in('status', ['open', 'under_review'])
    ]);

    const totalRevenue = revenueData.data?.reduce((sum, row) => sum + (Number(row.total_revenue) || 0), 0) || 0;
    const totalCommission = revenueData.data?.reduce((sum, row) => sum + (Number(row.total_commission) || 0), 0) || 0;
    const activeModels = modelsData.data?.length || 0;
    const totalDisputes = disputesData.data?.length || 0;

    return {
      totalRevenue,
      totalCommission,
      activeModels,
      totalDisputes
    };
  }
}
