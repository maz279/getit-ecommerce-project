
-- Create vendor_commissions table to track all commission transactions
CREATE TABLE public.vendor_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL,
    order_id UUID,
    product_id UUID,
    transaction_id TEXT UNIQUE NOT NULL,
    
    -- Commission Details
    commission_type TEXT NOT NULL CHECK (commission_type IN ('product_sale', 'service_fee', 'advertising', 'subscription', 'penalty', 'bonus')),
    commission_rate NUMERIC(5,2) NOT NULL, -- percentage
    gross_amount NUMERIC(12,2) NOT NULL, -- original sale amount
    commission_amount NUMERIC(10,2) NOT NULL, -- calculated commission
    platform_fee NUMERIC(10,2) DEFAULT 0,
    net_commission NUMERIC(10,2) NOT NULL, -- after platform fees
    
    -- Status and Processing
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'calculated', 'approved', 'paid', 'disputed', 'refunded')),
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'processing', 'paid', 'failed', 'cancelled')),
    
    -- Timing
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    payment_due_date DATE,
    payment_date TIMESTAMP WITH TIME ZONE,
    
    -- Additional Information
    category TEXT,
    payment_method TEXT,
    currency TEXT DEFAULT 'BDT',
    exchange_rate NUMERIC(10,4) DEFAULT 1.0000,
    
    -- Metadata
    notes TEXT,
    created_by UUID,
    approved_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vendor_commission_rates table for different commission structures
CREATE TABLE public.vendor_commission_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL,
    category_id UUID,
    product_type TEXT,
    
    -- Rate Configuration
    rate_type TEXT NOT NULL CHECK (rate_type IN ('percentage', 'fixed_amount', 'tiered')),
    base_rate NUMERIC(5,2) NOT NULL,
    minimum_amount NUMERIC(10,2) DEFAULT 0,
    maximum_amount NUMERIC(10,2),
    
    -- Tiered Rates (JSON structure for multiple tiers)
    tier_rates JSONB DEFAULT '[]'::jsonb,
    
    -- Validity Period
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    is_active BOOLEAN DEFAULT true,
    
    -- Additional Fees
    platform_fee_rate NUMERIC(5,2) DEFAULT 0,
    processing_fee NUMERIC(8,2) DEFAULT 0,
    
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create commission_payouts table for tracking payments to vendors
CREATE TABLE public.commission_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL,
    payout_batch_id TEXT UNIQUE NOT NULL,
    
    -- Payout Details
    total_commission NUMERIC(12,2) NOT NULL,
    platform_fees NUMERIC(10,2) DEFAULT 0,
    tax_deductions NUMERIC(10,2) DEFAULT 0,
    other_deductions NUMERIC(10,2) DEFAULT 0,
    net_payout_amount NUMERIC(12,2) NOT NULL,
    
    -- Period Covered
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Payment Information
    payment_method TEXT NOT NULL CHECK (payment_method IN ('bank_transfer', 'mobile_banking', 'digital_wallet', 'check', 'cash')),
    payment_reference TEXT,
    bank_account_info JSONB,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    
    -- Timing
    scheduled_date DATE,
    processed_date TIMESTAMP WITH TIME ZONE,
    
    -- Commission IDs included in this payout
    commission_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    notes TEXT,
    processed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create commission_analytics table for performance tracking
CREATE TABLE public.commission_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID,
    analytics_date DATE NOT NULL DEFAULT CURRENT_DATE,
    analytics_period TEXT NOT NULL CHECK (analytics_period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    
    -- Commission Metrics
    total_gross_sales NUMERIC(12,2) DEFAULT 0,
    total_commission_earned NUMERIC(12,2) DEFAULT 0,
    total_platform_fees NUMERIC(10,2) DEFAULT 0,
    net_commission NUMERIC(12,2) DEFAULT 0,
    
    -- Performance Metrics
    total_orders INTEGER DEFAULT 0,
    average_commission_per_order NUMERIC(8,2) DEFAULT 0,
    commission_rate_percentage NUMERIC(5,2) DEFAULT 0,
    
    -- Category Breakdown
    category_breakdown JSONB DEFAULT '{}'::jsonb,
    
    -- Comparison Data
    previous_period_commission NUMERIC(12,2) DEFAULT 0,
    growth_percentage NUMERIC(5,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create commission_disputes table for handling disputes
CREATE TABLE public.commission_disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commission_id UUID NOT NULL,
    vendor_id UUID NOT NULL,
    
    -- Dispute Details
    dispute_type TEXT NOT NULL CHECK (dispute_type IN ('calculation_error', 'rate_discrepancy', 'missing_commission', 'overpayment', 'refund_issue', 'other')),
    dispute_reason TEXT NOT NULL,
    dispute_description TEXT,
    evidence_files JSONB DEFAULT '[]'::jsonb,
    
    -- Financial Impact
    disputed_amount NUMERIC(10,2) NOT NULL,
    claimed_amount NUMERIC(10,2),
    
    -- Status and Resolution
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'rejected', 'escalated')),
    priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
    
    -- Resolution Details
    resolution_notes TEXT,
    adjustment_amount NUMERIC(10,2) DEFAULT 0,
    resolved_by UUID,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vendor_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_commission_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_disputes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing admin access)
CREATE POLICY "Admin can manage vendor commissions" ON public.vendor_commissions FOR ALL USING (true);
CREATE POLICY "Admin can manage commission rates" ON public.vendor_commission_rates FOR ALL USING (true);
CREATE POLICY "Admin can manage commission payouts" ON public.commission_payouts FOR ALL USING (true);
CREATE POLICY "Admin can manage commission analytics" ON public.commission_analytics FOR ALL USING (true);
CREATE POLICY "Admin can manage commission disputes" ON public.commission_disputes FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_vendor_commissions_vendor_id ON public.vendor_commissions(vendor_id);
CREATE INDEX idx_vendor_commissions_status ON public.vendor_commissions(status);
CREATE INDEX idx_vendor_commissions_transaction_date ON public.vendor_commissions(transaction_date);
CREATE INDEX idx_vendor_commission_rates_vendor_id ON public.vendor_commission_rates(vendor_id);
CREATE INDEX idx_commission_payouts_vendor_id ON public.commission_payouts(vendor_id);
CREATE INDEX idx_commission_payouts_status ON public.commission_payouts(status);
CREATE INDEX idx_commission_analytics_vendor_date ON public.commission_analytics(vendor_id, analytics_date);
CREATE INDEX idx_commission_disputes_vendor_id ON public.commission_disputes(vendor_id);
CREATE INDEX idx_commission_disputes_status ON public.commission_disputes(status);

-- Insert sample commission rates for different categories
INSERT INTO public.vendor_commission_rates (vendor_id, category_id, product_type, rate_type, base_rate, effective_from, created_by) VALUES
-- Sample data - replace with actual vendor and category IDs
(gen_random_uuid(), gen_random_uuid(), 'Electronics', 'percentage', 8.0, '2024-01-01', gen_random_uuid()),
(gen_random_uuid(), gen_random_uuid(), 'Fashion', 'percentage', 12.0, '2024-01-01', gen_random_uuid()),
(gen_random_uuid(), gen_random_uuid(), 'Home & Garden', 'percentage', 10.0, '2024-01-01', gen_random_uuid()),
(gen_random_uuid(), gen_random_uuid(), 'Books', 'percentage', 15.0, '2024-01-01', gen_random_uuid()),
(gen_random_uuid(), gen_random_uuid(), 'Sports', 'percentage', 9.0, '2024-01-01', gen_random_uuid());

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_commission_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_vendor_commissions_updated_at
    BEFORE UPDATE ON public.vendor_commissions
    FOR EACH ROW EXECUTE FUNCTION update_commission_updated_at();

CREATE TRIGGER trigger_commission_rates_updated_at
    BEFORE UPDATE ON public.vendor_commission_rates
    FOR EACH ROW EXECUTE FUNCTION update_commission_updated_at();

CREATE TRIGGER trigger_commission_payouts_updated_at
    BEFORE UPDATE ON public.commission_payouts
    FOR EACH ROW EXECUTE FUNCTION update_commission_updated_at();

CREATE TRIGGER trigger_commission_disputes_updated_at
    BEFORE UPDATE ON public.commission_disputes
    FOR EACH ROW EXECUTE FUNCTION update_commission_updated_at();
