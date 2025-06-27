
-- Enhanced commission tracking database schema with additional tables and indexes

-- Create commission_tracking_settings table for system configuration
CREATE TABLE IF NOT EXISTS public.commission_tracking_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL DEFAULT '{}',
    setting_type TEXT NOT NULL CHECK (setting_type IN ('system', 'vendor', 'category', 'global')),
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create commission_rate_history table for tracking rate changes
CREATE TABLE IF NOT EXISTS public.commission_rate_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rate_id UUID NOT NULL REFERENCES public.vendor_commission_rates(id) ON DELETE CASCADE,
    old_rate NUMERIC(5,2) NOT NULL,
    new_rate NUMERIC(5,2) NOT NULL,
    change_reason TEXT,
    changed_by UUID NOT NULL,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create commission_adjustments table for manual adjustments
CREATE TABLE IF NOT EXISTS public.commission_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commission_id UUID NOT NULL REFERENCES public.vendor_commissions(id) ON DELETE CASCADE,
    adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('bonus', 'deduction', 'correction', 'penalty')),
    adjustment_amount NUMERIC(12,2) NOT NULL,
    adjustment_reason TEXT NOT NULL,
    reference_document TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create commission_reconciliation table for monthly reconciliations
CREATE TABLE IF NOT EXISTS public.commission_reconciliation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL,
    reconciliation_period TEXT NOT NULL, -- 'YYYY-MM'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    calculated_commission NUMERIC(12,2) NOT NULL,
    actual_commission NUMERIC(12,2) NOT NULL,
    variance NUMERIC(12,2) NOT NULL,
    variance_percentage NUMERIC(5,2) NOT NULL,
    reconciliation_status TEXT DEFAULT 'in_progress' CHECK (reconciliation_status IN ('in_progress', 'completed', 'disputed')),
    reconciled_by UUID,
    reconciled_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create commission_notifications table for automated notifications
CREATE TABLE IF NOT EXISTS public.commission_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_type TEXT NOT NULL CHECK (notification_type IN ('payout_ready', 'dispute_raised', 'rate_change', 'threshold_reached')),
    recipient_id UUID NOT NULL,
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('vendor', 'admin', 'finance')),
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_data JSONB DEFAULT '{}',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'read')),
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add missing columns to existing tables
ALTER TABLE public.vendor_commissions 
ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_commission NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS chargeback_amount NUMERIC(10,2) DEFAULT 0;

ALTER TABLE public.commission_payouts 
ADD COLUMN IF NOT EXISTS payout_frequency TEXT DEFAULT 'monthly' CHECK (payout_frequency IN ('weekly', 'monthly', 'quarterly')),
ADD COLUMN IF NOT EXISTS minimum_payout_threshold NUMERIC(10,2) DEFAULT 100,
ADD COLUMN IF NOT EXISTS payout_fees NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS exchange_rate NUMERIC(10,4) DEFAULT 1.0000,
ADD COLUMN IF NOT EXISTS payout_currency TEXT DEFAULT 'BDT';

ALTER TABLE public.commission_disputes 
ADD COLUMN IF NOT EXISTS dispute_category TEXT DEFAULT 'calculation' CHECK (dispute_category IN ('calculation', 'payment', 'rate', 'timing', 'other')),
ADD COLUMN IF NOT EXISTS expected_resolution_date DATE,
ADD COLUMN IF NOT EXISTS actual_resolution_date DATE,
ADD COLUMN IF NOT EXISTS resolution_time_hours INTEGER;

-- Create comprehensive indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendor_commissions_vendor_date ON public.vendor_commissions(vendor_id, transaction_date);
CREATE INDEX IF NOT EXISTS idx_vendor_commissions_status_payment ON public.vendor_commissions(status, payment_status);
CREATE INDEX IF NOT EXISTS idx_vendor_commissions_created_at ON public.vendor_commissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_commission_payouts_vendor_period ON public.commission_payouts(vendor_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_commission_disputes_status_priority ON public.commission_disputes(status, priority_level);
CREATE INDEX IF NOT EXISTS idx_commission_analytics_vendor_date ON public.commission_analytics(vendor_id, analytics_date);
CREATE INDEX IF NOT EXISTS idx_commission_rate_history_rate_date ON public.commission_rate_history(rate_id, effective_date);
CREATE INDEX IF NOT EXISTS idx_commission_reconciliation_vendor_period ON public.commission_reconciliation(vendor_id, reconciliation_period);

-- Create composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_vendor_commissions_complex ON public.vendor_commissions(vendor_id, status, payment_status, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_commission_payouts_complex ON public.commission_payouts(vendor_id, status, scheduled_date);

-- Create search indexes for full-text search
CREATE INDEX IF NOT EXISTS idx_commission_disputes_search ON public.commission_disputes USING GIN(to_tsvector('english', dispute_description || ' ' || COALESCE(resolution_notes, '')));
CREATE INDEX IF NOT EXISTS idx_commission_adjustments_search ON public.commission_adjustments USING GIN(to_tsvector('english', adjustment_reason || ' ' || COALESCE(reference_document, '')));

-- Enable Row Level Security on new tables
ALTER TABLE public.commission_tracking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_rate_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_reconciliation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Admin can manage commission tracking settings" ON public.commission_tracking_settings FOR ALL USING (true);
CREATE POLICY "Admin can manage commission rate history" ON public.commission_rate_history FOR ALL USING (true);
CREATE POLICY "Admin can manage commission adjustments" ON public.commission_adjustments FOR ALL USING (true);
CREATE POLICY "Admin can manage commission reconciliation" ON public.commission_reconciliation FOR ALL USING (true);
CREATE POLICY "Admin can manage commission notifications" ON public.commission_notifications FOR ALL USING (true);

-- Create stored procedures for common operations
CREATE OR REPLACE FUNCTION public.calculate_vendor_commission(
    p_vendor_id UUID,
    p_gross_amount NUMERIC,
    p_product_category TEXT DEFAULT NULL,
    p_transaction_date DATE DEFAULT CURRENT_DATE
) RETURNS TABLE(
    commission_amount NUMERIC,
    commission_rate NUMERIC,
    platform_fee NUMERIC,
    net_commission NUMERIC
) AS $$
DECLARE
    v_rate_record RECORD;
    v_commission NUMERIC;
    v_platform_fee NUMERIC;
BEGIN
    -- Get applicable commission rate
    SELECT INTO v_rate_record *
    FROM public.vendor_commission_rates vcr
    WHERE vcr.vendor_id = p_vendor_id
    AND vcr.is_active = true
    AND vcr.effective_from <= p_transaction_date
    AND (vcr.effective_to IS NULL OR vcr.effective_to >= p_transaction_date)
    AND (vcr.product_type = p_product_category OR vcr.product_type IS NULL)
    ORDER BY vcr.effective_from DESC, vcr.created_at DESC
    LIMIT 1;
    
    IF v_rate_record IS NULL THEN
        -- Use default rate if no specific rate found
        v_rate_record.base_rate := 10.00;
        v_rate_record.platform_fee_rate := 2.5;
        v_rate_record.rate_type := 'percentage';
    END IF;
    
    -- Calculate commission based on rate type
    IF v_rate_record.rate_type = 'percentage' THEN
        v_commission := (p_gross_amount * v_rate_record.base_rate / 100);
    ELSE
        v_commission := v_rate_record.base_rate;
    END IF;
    
    -- Apply min/max limits
    IF v_rate_record.minimum_amount IS NOT NULL AND v_commission < v_rate_record.minimum_amount THEN
        v_commission := v_rate_record.minimum_amount;
    END IF;
    
    IF v_rate_record.maximum_amount IS NOT NULL AND v_commission > v_rate_record.maximum_amount THEN
        v_commission := v_rate_record.maximum_amount;
    END IF;
    
    -- Calculate platform fee
    v_platform_fee := (v_commission * COALESCE(v_rate_record.platform_fee_rate, 0) / 100);
    
    RETURN QUERY SELECT 
        v_commission,
        v_rate_record.base_rate,
        v_platform_fee,
        (v_commission - v_platform_fee);
END;
$$ LANGUAGE plpgsql;

-- Create function to update commission analytics
CREATE OR REPLACE FUNCTION public.update_commission_analytics(
    p_vendor_id UUID DEFAULT NULL,
    p_analytics_date DATE DEFAULT CURRENT_DATE
) RETURNS VOID AS $$
DECLARE
    v_vendor_id UUID;
    v_analytics RECORD;
BEGIN
    -- If vendor_id is provided, update for that vendor only, otherwise update for all vendors
    FOR v_vendor_id IN 
        SELECT DISTINCT vendor_id 
        FROM public.vendor_commissions 
        WHERE (p_vendor_id IS NULL OR vendor_id = p_vendor_id)
    LOOP
        -- Calculate analytics for the vendor
        SELECT INTO v_analytics
            COUNT(*) as total_orders,
            SUM(gross_amount) as total_gross_sales,
            SUM(commission_amount) as total_commission_earned,
            SUM(platform_fee) as total_platform_fees,
            SUM(net_commission) as net_commission,
            AVG(commission_amount) as average_commission_per_order,
            (SUM(commission_amount) / NULLIF(SUM(gross_amount), 0) * 100) as commission_rate_percentage
        FROM public.vendor_commissions
        WHERE vendor_id = v_vendor_id
        AND DATE(transaction_date) = p_analytics_date;
        
        -- Insert or update analytics
        INSERT INTO public.commission_analytics (
            vendor_id, analytics_date, analytics_period,
            total_orders, total_gross_sales, total_commission_earned,
            total_platform_fees, net_commission, average_commission_per_order,
            commission_rate_percentage
        ) VALUES (
            v_vendor_id, p_analytics_date, 'daily',
            COALESCE(v_analytics.total_orders, 0),
            COALESCE(v_analytics.total_gross_sales, 0),
            COALESCE(v_analytics.total_commission_earned, 0),
            COALESCE(v_analytics.total_platform_fees, 0),
            COALESCE(v_analytics.net_commission, 0),
            COALESCE(v_analytics.average_commission_per_order, 0),
            COALESCE(v_analytics.commission_rate_percentage, 0)
        )
        ON CONFLICT (vendor_id, analytics_date, analytics_period)
        DO UPDATE SET
            total_orders = EXCLUDED.total_orders,
            total_gross_sales = EXCLUDED.total_gross_sales,
            total_commission_earned = EXCLUDED.total_commission_earned,
            total_platform_fees = EXCLUDED.total_platform_fees,
            net_commission = EXCLUDED.net_commission,
            average_commission_per_order = EXCLUDED.average_commission_per_order,
            commission_rate_percentage = EXCLUDED.commission_rate_percentage,
            updated_at = now();
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic analytics updates
CREATE OR REPLACE FUNCTION public.trigger_update_commission_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update analytics for the affected vendor
    PERFORM public.update_commission_analytics(
        COALESCE(NEW.vendor_id, OLD.vendor_id),
        COALESCE(DATE(NEW.transaction_date), DATE(OLD.transaction_date))
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger on vendor_commissions table
DROP TRIGGER IF EXISTS trg_update_commission_analytics ON public.vendor_commissions;
CREATE TRIGGER trg_update_commission_analytics
    AFTER INSERT OR UPDATE OR DELETE ON public.vendor_commissions
    FOR EACH ROW EXECUTE FUNCTION public.trigger_update_commission_analytics();

-- Add updated_at trigger to new tables
CREATE TRIGGER trg_commission_tracking_settings_updated_at
    BEFORE UPDATE ON public.commission_tracking_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_commission_adjustments_updated_at
    BEFORE UPDATE ON public.commission_adjustments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_commission_reconciliation_updated_at
    BEFORE UPDATE ON public.commission_reconciliation
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
