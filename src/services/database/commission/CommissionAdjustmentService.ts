
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type CommissionAdjustment = Database['public']['Tables']['commission_adjustments']['Row'];
type CommissionAdjustmentInsert = Database['public']['Tables']['commission_adjustments']['Insert'];

export class CommissionAdjustmentService {
  static async getAdjustments(filters?: {
    commission_id?: string;
    status?: string;
    adjustment_type?: string;
  }): Promise<CommissionAdjustment[]> {
    let query = supabase
      .from('commission_adjustments')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.commission_id) {
      query = query.eq('commission_id', filters.commission_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.adjustment_type) {
      query = query.eq('adjustment_type', filters.adjustment_type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createAdjustment(adjustment: CommissionAdjustmentInsert): Promise<CommissionAdjustment> {
    const { data, error } = await supabase
      .from('commission_adjustments')
      .insert(adjustment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async approveAdjustment(id: string, approvedBy: string): Promise<CommissionAdjustment> {
    const { data, error } = await supabase
      .from('commission_adjustments')
      .update({
        status: 'approved',
        approved_by: approvedBy,
        approved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async rejectAdjustment(id: string): Promise<CommissionAdjustment> {
    const { data, error } = await supabase
      .from('commission_adjustments')
      .update({ status: 'rejected' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
