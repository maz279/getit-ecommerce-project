
-- Create payout requests table
CREATE TABLE public.payout_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  request_amount NUMERIC(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BDT',
  request_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payout_period_start DATE NOT NULL,
  payout_period_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'paid', 'cancelled')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('bank_transfer', 'mobile_banking', 'check', 'digital_wallet')),
  bank_account_details JSONB,
  mobile_banking_details JSONB,
  processing_fee NUMERIC(10,2) DEFAULT 0,
  tax_deduction NUMERIC(10,2) DEFAULT 0,
  net_payout_amount NUMERIC(15,2) NOT NULL,
  processed_by UUID REFERENCES profiles(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  payment_reference TEXT,
  notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payout schedules table
CREATE TABLE public.payout_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('weekly', 'bi_weekly', 'monthly', 'quarterly')),
  payout_day INTEGER, -- Day of week (1-7) for weekly, day of month (1-31) for monthly
  minimum_payout_amount NUMERIC(10,2) DEFAULT 100,
  auto_payout_enabled BOOLEAN DEFAULT false,
  preferred_payment_method TEXT NOT NULL CHECK (preferred_payment_method IN ('bank_transfer', 'mobile_banking', 'check', 'digital_wallet')),
  bank_account_info JSONB,
  mobile_banking_info JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payout history table
CREATE TABLE public.payout_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payout_request_id UUID REFERENCES payout_requests(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('created', 'approved', 'rejected', 'processed', 'paid', 'cancelled')),
  performed_by UUID REFERENCES profiles(id),
  previous_status TEXT,
  new_status TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payout fees configuration table
CREATE TABLE public.payout_fees_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_method TEXT NOT NULL,
  fee_type TEXT NOT NULL CHECK (fee_type IN ('fixed', 'percentage')),
  fee_amount NUMERIC(10,2) NOT NULL,
  minimum_fee NUMERIC(10,2) DEFAULT 0,
  maximum_fee NUMERIC(10,2),
  currency TEXT NOT NULL DEFAULT 'BDT',
  is_active BOOLEAN DEFAULT true,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to DATE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_fees_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admin users can view all payout requests" ON public.payout_requests
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admin users can manage payout requests" ON public.payout_requests
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admin users can view all payout schedules" ON public.payout_schedules
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admin users can manage payout schedules" ON public.payout_schedules
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admin users can view payout history" ON public.payout_history
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admin users can manage payout history" ON public.payout_history
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admin users can view payout fees config" ON public.payout_fees_config
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admin users can manage payout fees config" ON public.payout_fees_config
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- Add indexes for performance
CREATE INDEX idx_payout_requests_vendor_id ON public.payout_requests(vendor_id);
CREATE INDEX idx_payout_requests_status ON public.payout_requests(status);
CREATE INDEX idx_payout_requests_request_date ON public.payout_requests(request_date);
CREATE INDEX idx_payout_schedules_vendor_id ON public.payout_schedules(vendor_id);
CREATE INDEX idx_payout_history_payout_request_id ON public.payout_history(payout_request_id);
CREATE INDEX idx_payout_history_vendor_id ON public.payout_history(vendor_id);

-- Add triggers for updated_at
CREATE TRIGGER update_payout_requests_updated_at
  BEFORE UPDATE ON public.payout_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payout_schedules_updated_at
  BEFORE UPDATE ON public.payout_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payout_fees_config_updated_at
  BEFORE UPDATE ON public.payout_fees_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
