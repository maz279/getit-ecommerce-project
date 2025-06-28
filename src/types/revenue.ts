
export interface RevenueModel {
  id: string;
  model_name: string;
  model_type: 'percentage' | 'tiered' | 'flat_fee' | 'hybrid';
  description?: string;
  base_rate: number;
  tier_structure: any[];
  minimum_threshold?: number;
  maximum_threshold?: number;
  category_rates: Record<string, any>;
  is_active: boolean;
  effective_from: string;
  effective_to?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionStructure {
  id: string;
  model_name: string;
  model_type: 'percentage' | 'tiered' | 'flat_fee' | 'hybrid';
  description?: string;
  base_rate: number;
  tier_structure: any[];
  minimum_threshold?: number;
  maximum_threshold?: number;
  category_rates: Record<string, any>;
  is_active: boolean;
  effective_from: string;
  effective_to?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface RevenueDispute {
  id: string;
  dispute_number: string;
  vendor_id: string;
  commission_id?: string;
  dispute_type: 'calculation_error' | 'payment_delay' | 'rate_disagreement' | 'other';
  dispute_amount: number;
  claimed_amount?: number;
  dispute_reason: string;
  dispute_description?: string;
  evidence_documents: any[];
  status: 'open' | 'under_review' | 'resolved' | 'rejected' | 'escalated';
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
  resolution_notes?: string;
  resolution_amount?: number;
  resolved_by?: string;
  resolved_at?: string;
  expected_resolution_date?: string;
  escalation_level: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentTermsConfig {
  id: string;
  term_name: string;
  payout_frequency: 'weekly' | 'biweekly' | 'monthly' | 'custom';
  minimum_payout_amount: number;
  processing_days: number;
  payment_methods: string[];
  processing_fee_rate?: number;
  late_payment_penalty_rate?: number;
  currency: string;
  terms_conditions?: string;
  compliance_requirements: any[];
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface IncentiveProgram {
  id: string;
  program_name: string;
  program_type: 'volume_bonus' | 'performance_bonus' | 'loyalty_reward' | 'milestone_reward';
  description?: string;
  eligibility_criteria: Record<string, any>;
  reward_structure: Record<string, any>;
  budget_allocation?: number;
  start_date: string;
  end_date?: string;
  target_metrics: Record<string, any>;
  participation_count: number;
  total_rewards_paid: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}
