
-- Revenue Sharing Management Database Schema

-- Revenue Models Configuration Table
CREATE TABLE public.revenue_models (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    model_name TEXT NOT NULL,
    model_type TEXT NOT NULL CHECK (model_type IN ('percentage', 'tiered', 'flat_fee', 'hybrid')),
    description TEXT,
    base_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    tier_structure JSONB DEFAULT '[]'::jsonb,
    minimum_threshold NUMERIC(12,2) DEFAULT 0.00,
    maximum_threshold NUMERIC(12,2),
    category_rates JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Revenue Split Configuration Table
CREATE TABLE public.revenue_split_config (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    config_name TEXT NOT NULL,
    platform_fee_percentage NUMERIC(5,2) NOT NULL DEFAULT 15.00,
    vendor_share_percentage NUMERIC(5,2) NOT NULL DEFAULT 80.00,
    processing_fee_percentage NUMERIC(5,2) NOT NULL DEFAULT 3.00,
    insurance_fee_percentage NUMERIC(5,2) NOT NULL DEFAULT 1.00,
    tax_reserve_percentage NUMERIC(5,2) NOT NULL DEFAULT 1.00,
    category_overrides JSONB DEFAULT '{}'::jsonb,
    vendor_tier_adjustments JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Payment Terms Configuration Table
CREATE TABLE public.payment_terms_config (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    term_name TEXT NOT NULL,
    payout_frequency TEXT NOT NULL CHECK (payout_frequency IN ('weekly', 'biweekly', 'monthly', 'custom')),
    minimum_payout_amount NUMERIC(12,2) NOT NULL DEFAULT 100.00,
    processing_days INTEGER NOT NULL DEFAULT 2,
    payment_methods JSONB NOT NULL DEFAULT '["bank_transfer"]'::jsonb,
    processing_fee_rate NUMERIC(5,2) DEFAULT 2.50,
    late_payment_penalty_rate NUMERIC(5,2) DEFAULT 1.50,
    currency TEXT NOT NULL DEFAULT 'BDT',
    terms_conditions TEXT,
    compliance_requirements JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Revenue Forecasting Table
CREATE TABLE public.revenue_forecasts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    forecast_period TEXT NOT NULL,
    forecast_date DATE NOT NULL,
    vendor_id UUID,
    category_id UUID,
    predicted_revenue NUMERIC(15,2) NOT NULL,
    predicted_commission NUMERIC(15,2) NOT NULL,
    confidence_score NUMERIC(3,2) DEFAULT 0.75,
    forecast_factors JSONB DEFAULT '{}'::jsonb,
    actual_revenue NUMERIC(15,2),
    actual_commission NUMERIC(15,2),
    variance_percentage NUMERIC(5,2),
    model_version TEXT DEFAULT 'v1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Incentive Programs Table
CREATE TABLE public.incentive_programs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    program_name TEXT NOT NULL,
    program_type TEXT NOT NULL CHECK (program_type IN ('volume_bonus', 'performance_bonus', 'loyalty_reward', 'milestone_reward')),
    description TEXT,
    eligibility_criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
    reward_structure JSONB NOT NULL DEFAULT '{}'::jsonb,
    budget_allocation NUMERIC(15,2),
    start_date DATE NOT NULL,
    end_date DATE,
    target_metrics JSONB DEFAULT '{}'::jsonb,
    participation_count INTEGER DEFAULT 0,
    total_rewards_paid NUMERIC(15,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Revenue Disputes Table  
CREATE TABLE public.revenue_disputes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    dispute_number TEXT NOT NULL UNIQUE,
    vendor_id UUID NOT NULL,
    commission_id UUID,
    dispute_type TEXT NOT NULL CHECK (dispute_type IN ('calculation_error', 'payment_delay', 'rate_disagreement', 'other')),
    dispute_amount NUMERIC(12,2) NOT NULL,
    claimed_amount NUMERIC(12,2),
    dispute_reason TEXT NOT NULL,
    dispute_description TEXT,
    evidence_documents JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'rejected', 'escalated')),
    priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
    assigned_to UUID,
    resolution_notes TEXT,
    resolution_amount NUMERIC(12,2),
    resolved_by UUID,
    resolved_at TIMESTAMP WITH TIME ZONE,
    expected_resolution_date DATE,
    escalation_level INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Revenue Analytics Aggregated Table
CREATE TABLE public.revenue_analytics_summary (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    analytics_date DATE NOT NULL,
    analytics_period TEXT NOT NULL CHECK (analytics_period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    vendor_id UUID,
    category_id UUID,
    total_revenue NUMERIC(15,2) DEFAULT 0.00,
    total_commission NUMERIC(15,2) DEFAULT 0.00,
    platform_fees NUMERIC(15,2) DEFAULT 0.00,
    processing_fees NUMERIC(15,2) DEFAULT 0.00,
    net_revenue NUMERIC(15,2) DEFAULT 0.00,
    transaction_count INTEGER DEFAULT 0,
    average_order_value NUMERIC(12,2) DEFAULT 0.00,
    commission_rate_avg NUMERIC(5,2) DEFAULT 0.00,
    growth_rate NUMERIC(5,2) DEFAULT 0.00,
    market_share NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add search indexes
CREATE INDEX idx_revenue_models_type ON public.revenue_models(model_type);
CREATE INDEX idx_revenue_models_active ON public.revenue_models(is_active);
CREATE INDEX idx_revenue_split_active ON public.revenue_split_config(is_active);
CREATE INDEX idx_payment_terms_frequency ON public.payment_terms_config(payout_frequency);
CREATE INDEX idx_revenue_forecasts_date ON public.revenue_forecasts(forecast_date);
CREATE INDEX idx_revenue_forecasts_vendor ON public.revenue_forecasts(vendor_id);
CREATE INDEX idx_incentive_programs_active ON public.incentive_programs(is_active);
CREATE INDEX idx_incentive_programs_dates ON public.incentive_programs(start_date, end_date);
CREATE INDEX idx_revenue_disputes_status ON public.revenue_disputes(status);
CREATE INDEX idx_revenue_disputes_vendor ON public.revenue_disputes(vendor_id);
CREATE INDEX idx_revenue_analytics_date ON public.revenue_analytics_summary(analytics_date);
CREATE INDEX idx_revenue_analytics_vendor ON public.revenue_analytics_summary(vendor_id);

-- Add RLS policies
ALTER TABLE public.revenue_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_split_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_terms_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incentive_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_analytics_summary ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin access for revenue management)
CREATE POLICY "Admin full access revenue_models" ON public.revenue_models FOR ALL USING (true);
CREATE POLICY "Admin full access revenue_split_config" ON public.revenue_split_config FOR ALL USING (true);
CREATE POLICY "Admin full access payment_terms_config" ON public.payment_terms_config FOR ALL USING (true);
CREATE POLICY "Admin full access revenue_forecasts" ON public.revenue_forecasts FOR ALL USING (true);
CREATE POLICY "Admin full access incentive_programs" ON public.incentive_programs FOR ALL USING (true);
CREATE POLICY "Admin full access revenue_disputes" ON public.revenue_disputes FOR ALL USING (true);
CREATE POLICY "Admin full access revenue_analytics_summary" ON public.revenue_analytics_summary FOR ALL USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_revenue_models_updated_at BEFORE UPDATE ON public.revenue_models FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_revenue_split_config_updated_at BEFORE UPDATE ON public.revenue_split_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payment_terms_config_updated_at BEFORE UPDATE ON public.payment_terms_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_revenue_forecasts_updated_at BEFORE UPDATE ON public.revenue_forecasts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_incentive_programs_updated_at BEFORE UPDATE ON public.incentive_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_revenue_disputes_updated_at BEFORE UPDATE ON public.revenue_disputes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_revenue_analytics_summary_updated_at BEFORE UPDATE ON public.revenue_analytics_summary FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
