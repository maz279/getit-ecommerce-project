import { supabase } from '@/integrations/supabase/client';

export interface ReviewModerationData {
  id?: string;
  review_id?: string;
  vendor_id: string;
  customer_name: string;
  product_name: string;
  rating: number;
  review_text: string;
  moderation_status: 'pending' | 'approved' | 'rejected' | 'flagged';
  risk_score: number;
  flags: string[];
  priority_level: 'low' | 'medium' | 'high';
  moderator_id?: string;
  moderation_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RatingDisputeData {
  id?: string;
  review_id: string;
  vendor_id: string;
  customer_id?: string;
  dispute_reason: string;
  dispute_description?: string;
  dispute_status: 'pending' | 'under-review' | 'resolved' | 'rejected';
  priority_level: 'low' | 'medium' | 'high';
  resolution_notes?: string;
  resolved_by?: string;
  created_at?: string;
  updated_at?: string;
  resolved_at?: string;
}

export interface RatingPolicyData {
  id?: string;
  policy_name: string;
  policy_type: 'review_guidelines' | 'moderation_rules' | 'dispute_resolution' | 'vendor_standards';
  policy_content: string;
  is_active: boolean;
  effective_date: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface AIDetectionSetting {
  id: string;
  setting_name: string;
  setting_type: 'detection_rule' | 'auto_moderation';
  is_enabled: boolean;
  configuration: Record<string, any>;
}

export class RatingService {
  // Review Moderation
  static async getReviewsForModeration() {
    const { data, error } = await supabase
      .from('review_moderation')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createModerationEntry(reviewData: ReviewModerationData) {
    const { data, error } = await supabase
      .from('review_moderation')
      .insert(reviewData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateModerationStatus(id: string, status: string, notes?: string, moderatorId?: string) {
    const { data, error } = await supabase
      .from('review_moderation')
      .update({
        moderation_status: status,
        moderation_notes: notes,
        moderator_id: moderatorId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Rating Disputes
  static async getDisputes() {
    const { data, error } = await supabase
      .from('rating_disputes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createDispute(disputeData: RatingDisputeData) {
    const { data, error } = await supabase
      .from('rating_disputes')
      .insert(disputeData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateDisputeStatus(id: string, status: string, resolutionNotes?: string, resolvedBy?: string) {
    const updateData: any = {
      dispute_status: status,
      updated_at: new Date().toISOString()
    };

    if (resolutionNotes) updateData.resolution_notes = resolutionNotes;
    if (resolvedBy) updateData.resolved_by = resolvedBy;
    if (status === 'resolved') updateData.resolved_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('rating_disputes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Rating Policies
  static async getPolicies() {
    const { data, error } = await supabase
      .from('rating_policies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createPolicy(policyData: RatingPolicyData) {
    const { data, error } = await supabase
      .from('rating_policies')
      .insert(policyData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePolicy(id: string, policyData: Partial<RatingPolicyData>) {
    const { data, error } = await supabase
      .from('rating_policies')
      .update({ ...policyData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deletePolicy(id: string) {
    const { data, error } = await supabase
      .from('rating_policies')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  }

  // AI Detection Settings
  static async getAIDetectionSettings() {
    const { data, error } = await supabase
      .from('ai_detection_settings')
      .select('*')
      .order('setting_name');

    if (error) throw error;
    return data;
  }

  static async updateAIDetectionSetting(settingName: string, isEnabled: boolean, configuration?: Record<string, any>) {
    const updateData: any = {
      is_enabled: isEnabled,
      updated_at: new Date().toISOString()
    };

    if (configuration) updateData.configuration = configuration;

    const { data, error } = await supabase
      .from('ai_detection_settings')
      .update(updateData)
      .eq('setting_name', settingName)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Vendor Ratings
  static async getVendorRatings() {
    const { data, error } = await supabase
      .from('vendor_ratings')
      .select('*')
      .order('overall_rating', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateVendorRating(vendorId: string, ratingData: any) {
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
}
