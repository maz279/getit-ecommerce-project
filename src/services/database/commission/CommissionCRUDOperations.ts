
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type VendorCommission = Database['public']['Tables']['vendor_commissions']['Row'];
type VendorCommissionInsert = Database['public']['Tables']['vendor_commissions']['Insert'];
type VendorCommissionUpdate = Database['public']['Tables']['vendor_commissions']['Update'];

export class CommissionCRUDOperations {
  static async getCommissions(filters?: {
    vendor_id?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
    offset?: number;
  }): Promise<VendorCommission[]> {
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
    return data || [];
  }

  static async getCommissionById(id: string): Promise<VendorCommission | null> {
    const { data, error } = await supabase
      .from('vendor_commissions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async createCommission(commission: VendorCommissionInsert): Promise<VendorCommission> {
    const { data, error } = await supabase
      .from('vendor_commissions')
      .insert(commission)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCommission(id: string, updates: VendorCommissionUpdate): Promise<VendorCommission> {
    const { data, error } = await supabase
      .from('vendor_commissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteCommission(id: string): Promise<void> {
    const { error } = await supabase
      .from('vendor_commissions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async bulkCreateCommissions(commissions: VendorCommissionInsert[]): Promise<VendorCommission[]> {
    const { data, error } = await supabase
      .from('vendor_commissions')
      .insert(commissions)
      .select();

    if (error) throw error;
    return data || [];
  }

  static async bulkUpdateCommissions(updates: Array<{ id: string; updates: VendorCommissionUpdate }>): Promise<VendorCommission[]> {
    const results: VendorCommission[] = [];
    
    for (const { id, updates: updateData } of updates) {
      const updated = await this.updateCommission(id, updateData);
      results.push(updated);
    }
    
    return results;
  }
}
