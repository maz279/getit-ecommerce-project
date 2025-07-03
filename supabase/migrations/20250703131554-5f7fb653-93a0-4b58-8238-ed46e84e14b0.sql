-- COMPREHENSIVE PAYMENT MICROSERVICE DATABASE FOUNDATION

-- 1. Payment Methods Configuration
CREATE TABLE public.payment_method_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method_name TEXT NOT NULL UNIQUE,
  gateway_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  country_code TEXT DEFAULT 'BD',
  currency TEXT DEFAULT 'BDT',
  min_amount NUMERIC DEFAULT 1,
  max_amount NUMERIC DEFAULT 500000,
  fees_config JSONB DEFAULT '{}',
  gateway_config JSONB DEFAULT '{}',
  compliance_rules JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bangladesh Mobile Banking Transactions
CREATE TABLE public.mobile_banking_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  order_id UUID,
  gateway_name TEXT NOT NULL, -- bkash, nagad, rocket
  mobile_number TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'BDT',
  transaction_type TEXT NOT NULL, -- payment, refund, payout
  gateway_reference TEXT,
  gateway_response JSONB DEFAULT '{}',
  verification_code TEXT,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed, cancelled
  failure_reason TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Vendor Payout Management
CREATE TABLE public.vendor_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  payout_period_start DATE NOT NULL,
  payout_period_end DATE NOT NULL,
  gross_sales NUMERIC NOT NULL DEFAULT 0,
  platform_commission NUMERIC NOT NULL DEFAULT 0,
  platform_fees NUMERIC NOT NULL DEFAULT 0,
  tax_deduction NUMERIC NOT NULL DEFAULT 0,
  adjustment_amount NUMERIC DEFAULT 0,
  net_payout_amount NUMERIC NOT NULL,
  payout_method TEXT NOT NULL, -- bank_transfer, mobile_banking, check
  payout_details JSONB DEFAULT '{}',
  payout_reference TEXT,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  processed_at TIMESTAMPTZ,
  processor_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COD Transaction Management
CREATE TABLE public.cod_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  customer_id UUID REFERENCES auth.users(id),
  vendor_id UUID NOT NULL,
  delivery_agent_id UUID,
  cod_amount NUMERIC NOT NULL,
  collection_fee NUMERIC DEFAULT 0,
  delivery_address JSONB NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_instructions TEXT,
  status TEXT DEFAULT 'pending', -- pending, collected, failed, returned
  collected_at TIMESTAMPTZ,
  deposited_at TIMESTAMPTZ,
  deposit_reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Payment Fraud Detection
CREATE TABLE public.payment_fraud_detection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL,
  user_id UUID,
  risk_score NUMERIC NOT NULL DEFAULT 0,
  risk_level TEXT NOT NULL, -- low, medium, high, critical
  fraud_indicators JSONB DEFAULT '[]',
  device_fingerprint JSONB DEFAULT '{}',
  behavioral_analysis JSONB DEFAULT '{}',
  geolocation_data JSONB DEFAULT '{}',
  ml_model_version TEXT DEFAULT '1.0',
  detection_algorithm TEXT NOT NULL,
  manual_review_required BOOLEAN DEFAULT false,
  reviewed_by UUID,
  review_notes TEXT,
  final_decision TEXT, -- approved, declined, needs_verification
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Payment Reconciliation
CREATE TABLE public.payment_reconciliation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reconciliation_date DATE NOT NULL,
  gateway_name TEXT NOT NULL,
  total_transactions INTEGER DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  platform_transactions INTEGER DEFAULT 0,
  platform_amount NUMERIC DEFAULT 0,
  gateway_transactions INTEGER DEFAULT 0,
  gateway_amount NUMERIC DEFAULT 0,
  discrepancy_count INTEGER DEFAULT 0,
  discrepancy_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, reconciled, discrepancies_found
  reconciled_by UUID,
  reconciliation_report JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Bangladesh Compliance Tracking
CREATE TABLE public.bangladesh_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compliance_type TEXT NOT NULL, -- aml, kyc, tax, bangladesh_bank
  entity_type TEXT NOT NULL, -- customer, vendor, transaction
  entity_id UUID NOT NULL,
  compliance_status TEXT DEFAULT 'pending', -- pending, compliant, non_compliant, under_review
  required_documents JSONB DEFAULT '[]',
  submitted_documents JSONB DEFAULT '[]',
  verification_details JSONB DEFAULT '{}',
  compliance_officer_id UUID,
  review_notes TEXT,
  compliance_deadline DATE,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Payment Webhook Logs
CREATE TABLE public.payment_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_name TEXT NOT NULL,
  webhook_type TEXT NOT NULL,
  webhook_payload JSONB NOT NULL,
  signature TEXT,
  signature_verified BOOLEAN DEFAULT false,
  processed BOOLEAN DEFAULT false,
  processing_result JSONB DEFAULT '{}',
  retry_count INTEGER DEFAULT 0,
  last_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.payment_method_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mobile_banking_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cod_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_fraud_detection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_reconciliation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bangladesh_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Payment Method Config (Admin only)
CREATE POLICY "Admin can manage payment methods" ON public.payment_method_config
FOR ALL USING (is_admin_user());

-- Mobile Banking Transactions
CREATE POLICY "Users can view their mobile banking transactions" ON public.mobile_banking_transactions
FOR SELECT USING (auth.uid() = user_id OR is_admin_user());

CREATE POLICY "System can insert mobile banking transactions" ON public.mobile_banking_transactions
FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update mobile banking transactions" ON public.mobile_banking_transactions
FOR UPDATE USING (true);

-- Vendor Payouts
CREATE POLICY "Vendors can view their payouts" ON public.vendor_payouts
FOR SELECT USING (auth.uid() = vendor_id OR is_admin_user());

CREATE POLICY "Admin can manage vendor payouts" ON public.vendor_payouts
FOR ALL USING (is_admin_user());

-- COD Transactions
CREATE POLICY "Users can view their COD transactions" ON public.cod_transactions
FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = vendor_id OR is_admin_user());

CREATE POLICY "System can manage COD transactions" ON public.cod_transactions
FOR ALL USING (true);

-- Payment Fraud Detection (Admin only)
CREATE POLICY "Admin can manage fraud detection" ON public.payment_fraud_detection
FOR ALL USING (is_admin_user());

-- Payment Reconciliation (Admin only)  
CREATE POLICY "Admin can manage reconciliation" ON public.payment_reconciliation
FOR ALL USING (is_admin_user());

-- Bangladesh Compliance
CREATE POLICY "Users can view their compliance status" ON public.bangladesh_compliance
FOR SELECT USING (auth.uid() = entity_id OR is_admin_user());

CREATE POLICY "Admin can manage compliance" ON public.bangladesh_compliance
FOR ALL USING (is_admin_user());

-- Payment Webhook Logs (Admin only)
CREATE POLICY "Admin can view webhook logs" ON public.payment_webhook_logs
FOR SELECT USING (is_admin_user());

CREATE POLICY "System can insert webhook logs" ON public.payment_webhook_logs
FOR INSERT WITH CHECK (true);

-- Create Indexes for Performance
CREATE INDEX idx_mobile_banking_transactions_user_id ON public.mobile_banking_transactions(user_id);
CREATE INDEX idx_mobile_banking_transactions_status ON public.mobile_banking_transactions(status);
CREATE INDEX idx_mobile_banking_transactions_gateway ON public.mobile_banking_transactions(gateway_name);
CREATE INDEX idx_vendor_payouts_vendor_id ON public.vendor_payouts(vendor_id);
CREATE INDEX idx_vendor_payouts_status ON public.vendor_payouts(status);
CREATE INDEX idx_cod_transactions_order_id ON public.cod_transactions(order_id);
CREATE INDEX idx_cod_transactions_status ON public.cod_transactions(status);
CREATE INDEX idx_payment_fraud_detection_transaction_id ON public.payment_fraud_detection(transaction_id);
CREATE INDEX idx_payment_fraud_detection_risk_level ON public.payment_fraud_detection(risk_level);
CREATE INDEX idx_bangladesh_compliance_entity_id ON public.bangladesh_compliance(entity_id);
CREATE INDEX idx_bangladesh_compliance_status ON public.bangladesh_compliance(compliance_status);

-- Insert Default Payment Method Configurations
INSERT INTO public.payment_method_config (method_name, gateway_name, country_code, currency, min_amount, max_amount, fees_config, gateway_config) VALUES
('bKash', 'bkash_api', 'BD', 'BDT', 1, 500000, '{"transaction_fee": 1.5, "percentage": true}', '{"api_version": "v1.2.0-beta", "environment": "sandbox"}'),
('Nagad', 'nagad_api', 'BD', 'BDT', 1, 200000, '{"transaction_fee": 1.8, "percentage": true}', '{"api_version": "v1.0", "environment": "sandbox"}'),
('Rocket', 'rocket_api', 'BD', 'BDT', 1, 100000, '{"transaction_fee": 2.0, "percentage": true}', '{"api_version": "v1.0", "environment": "sandbox"}'),
('Stripe', 'stripe_api', 'GLOBAL', 'USD', 0.5, 999999, '{"transaction_fee": 2.9, "percentage": true, "fixed_fee": 0.30}', '{"api_version": "2023-10-16", "environment": "test"}'),
('Bank Transfer', 'bd_bank', 'BD', 'BDT', 100, 10000000, '{"transaction_fee": 10, "percentage": false}', '{"processing_time": "1-3 business days"}');

-- Create Trigger Functions
CREATE OR REPLACE FUNCTION update_payment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Triggers for Updated At
CREATE TRIGGER update_payment_method_config_updated_at
    BEFORE UPDATE ON public.payment_method_config
    FOR EACH ROW EXECUTE FUNCTION update_payment_updated_at();

CREATE TRIGGER update_mobile_banking_transactions_updated_at
    BEFORE UPDATE ON public.mobile_banking_transactions
    FOR EACH ROW EXECUTE FUNCTION update_payment_updated_at();

CREATE TRIGGER update_vendor_payouts_updated_at
    BEFORE UPDATE ON public.vendor_payouts
    FOR EACH ROW EXECUTE FUNCTION update_payment_updated_at();

CREATE TRIGGER update_cod_transactions_updated_at
    BEFORE UPDATE ON public.cod_transactions
    FOR EACH ROW EXECUTE FUNCTION update_payment_updated_at();

CREATE TRIGGER update_payment_fraud_detection_updated_at
    BEFORE UPDATE ON public.payment_fraud_detection
    FOR EACH ROW EXECUTE FUNCTION update_payment_updated_at();

CREATE TRIGGER update_payment_reconciliation_updated_at
    BEFORE UPDATE ON public.payment_reconciliation
    FOR EACH ROW EXECUTE FUNCTION update_payment_updated_at();

CREATE TRIGGER update_bangladesh_compliance_updated_at
    BEFORE UPDATE ON public.bangladesh_compliance
    FOR EACH ROW EXECUTE FUNCTION update_payment_updated_at();