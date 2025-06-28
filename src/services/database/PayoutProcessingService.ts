
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type PayoutRequest = Database['public']['Tables']['payout_requests']['Row'];
export type PayoutRequestInsert = Database['public']['Tables']['payout_requests']['Insert'];
export type PayoutRequestUpdate = Database['public']['Tables']['payout_requests']['Update'];

export type PayoutBatchProcessing = Database['public']['Tables']['payout_batch_processing']['Row'];
export type PayoutApprovalWorkflow = Database['public']['Tables']['payout_approval_workflow']['Row'];
export type PayoutProcessingLog = Database['public']['Tables']['payout_processing_logs']['Row'];

export interface PayoutFilters {
  vendor_id?: string;
  status?: string;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  priority_level?: string;
  search_query?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  total_pages: number;
  current_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export class PayoutProcessingService {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private static getCacheKey(method: string, params: any): string {
    return `${method}_${JSON.stringify(params)}`;
  }

  private static getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private static setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  static async getPayoutRequests(
    filters: PayoutFilters = {},
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<PayoutRequest & { vendor_name?: string }>> {
    const cacheKey = this.getCacheKey('getPayoutRequests', { filters, pagination });
    const cached = this.getFromCache<PaginatedResponse<PayoutRequest & { vendor_name?: string }>>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { page = 1, limit = 20, sort_by = 'created_at', sort_order = 'desc' } = pagination;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('payout_requests')
      .select(`
        *,
        vendors!inner(business_name)
      `, { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order(sort_by, { ascending: sort_order === 'asc' });

    // Apply filters
    if (filters.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.payment_method) {
      query = query.eq('payment_method', filters.payment_method);
    }
    if (filters.date_from) {
      query = query.gte('request_date', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('request_date', filters.date_to);
    }
    if (filters.amount_min) {
      query = query.gte('request_amount', filters.amount_min);
    }
    if (filters.amount_max) {
      query = query.lte('request_amount', filters.amount_max);
    }
    if (filters.priority_level) {
      query = query.eq('priority_level', filters.priority_level);
    }
    if (filters.search_query) {
      query = query.or(`external_reference.ilike.%${filters.search_query}%,notes.ilike.%${filters.search_query}%`);
    }

    const { data, error, count } = await query;
    
    if (error) throw error;

    const total = count || 0;
    const total_pages = Math.ceil(total / limit);

    const result = {
      data: data?.map(item => ({
        ...item,
        vendor_name: (item.vendors as any)?.business_name || 'Unknown Vendor'
      })) || [],
      total,
      total_pages,
      current_page: page,
      has_next: page < total_pages,
      has_prev: page > 1
    };

    this.setCache(cacheKey, result);
    return result;
  }

  static async createPayoutRequest(request: PayoutRequestInsert): Promise<PayoutRequest> {
    // Validate required fields
    if (!request.vendor_id || !request.request_amount || !request.payment_method) {
      throw new Error('Missing required fields: vendor_id, request_amount, payment_method');
    }

    // Auto-populate net_payout_amount if not provided
    if (!request.net_payout_amount) {
      const processingFee = request.processing_fee || 0;
      const taxDeduction = request.tax_deduction || 0;
      request.net_payout_amount = request.request_amount - processingFee - taxDeduction;
    }

    const { data, error } = await supabase
      .from('payout_requests')
      .insert(request)
      .select()
      .single();

    if (error) throw error;

    // Clear relevant cache
    this.cache.clear();

    // Auto-approve if eligible
    if (data.id) {
      await this.checkAutoApproval(data.id);
    }

    return data;
  }

  static async updatePayoutRequest(id: string, updates: PayoutRequestUpdate): Promise<PayoutRequest> {
    const { data, error } = await supabase
      .from('payout_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Clear cache
    this.cache.clear();

    return data;
  }

  static async deletePayoutRequest(id: string): Promise<void> {
    const { error } = await supabase
      .from('payout_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Clear cache
    this.cache.clear();
  }

  static async processBatch(batchId: string, processorId: string): Promise<any> {
    const { data, error } = await supabase.rpc('process_payout_batch', {
      p_batch_id: batchId,
      p_processor_id: processorId
    });

    if (error) throw error;

    // Clear cache
    this.cache.clear();

    return data;
  }

  static async checkAutoApproval(requestId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('auto_approve_payout_request', {
      p_request_id: requestId
    });

    if (error) throw error;

    return data;
  }

  static async getBatchProcessing(filters: any = {}): Promise<PayoutBatchProcessing[]> {
    let query = supabase
      .from('payout_batch_processing')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  }

  static async getApprovalWorkflows(filters: any = {}): Promise<PayoutApprovalWorkflow[]> {
    let query = supabase
      .from('payout_approval_workflow')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.approval_status) {
      query = query.eq('approval_status', filters.approval_status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  }

  static async getProcessingLogs(requestId?: string): Promise<PayoutProcessingLog[]> {
    let query = supabase
      .from('payout_processing_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (requestId) {
      query = query.eq('payout_request_id', requestId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  }

  static async getAnalytics(): Promise<any> {
    const cacheKey = this.getCacheKey('getAnalytics', {});
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { data, error } = await supabase
      .from('payout_requests')
      .select('status, request_amount, payment_method, created_at');

    if (error) throw error;

    const analytics = {
      total_requests: data?.length || 0,
      total_amount: data?.reduce((sum, item) => sum + (item.request_amount || 0), 0) || 0,
      pending_requests: data?.filter(item => item.status === 'pending').length || 0,
      processed_requests: data?.filter(item => ['approved', 'paid'].includes(item.status || '')).length || 0,
      by_payment_method: data?.reduce((acc: any, item) => {
        acc[item.payment_method || 'unknown'] = (acc[item.payment_method || 'unknown'] || 0) + 1;
        return acc;
      }, {}) || {},
      by_status: data?.reduce((acc: any, item) => {
        acc[item.status || 'unknown'] = (acc[item.status || 'unknown'] || 0) + 1;
        return acc;
      }, {}) || {}
    };

    this.setCache(cacheKey, analytics);
    return analytics;
  }
}
