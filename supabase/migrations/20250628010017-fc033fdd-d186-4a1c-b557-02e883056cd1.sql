
-- Create enhanced payout processing tables with proper indexing and constraints
CREATE TABLE IF NOT EXISTS public.payout_batch_processing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_number TEXT NOT NULL UNIQUE,
  processing_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_requests INTEGER NOT NULL DEFAULT 0,
  total_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  processed_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  failed_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  processor_id UUID REFERENCES profiles(id),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_log JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payout request items for batch processing
CREATE TABLE IF NOT EXISTS public.payout_request_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payout_request_id UUID NOT NULL REFERENCES payout_requests(id) ON DELETE CASCADE,
  commission_id UUID REFERENCES vendor_commissions(id),
  item_amount NUMERIC(15,2) NOT NULL,
  item_description TEXT,
  commission_period_start DATE,
  commission_period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payout processing logs
CREATE TABLE IF NOT EXISTS public.payout_processing_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payout_request_id UUID REFERENCES payout_requests(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES payout_batch_processing(id),
  log_level TEXT NOT NULL CHECK (log_level IN ('info', 'warning', 'error', 'critical')),
  log_message TEXT NOT NULL,
  log_data JSONB DEFAULT '{}'::jsonb,
  logged_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payout approval workflow
CREATE TABLE IF NOT EXISTS public.payout_approval_workflow (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payout_request_id UUID NOT NULL REFERENCES payout_requests(id) ON DELETE CASCADE,
  approval_level INTEGER NOT NULL DEFAULT 1,
  required_approvers INTEGER NOT NULL DEFAULT 1,
  current_approvers INTEGER NOT NULL DEFAULT 0,
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'escalated')),
  assigned_to UUID[] DEFAULT '{}',
  approved_by UUID[] DEFAULT '{}',
  rejected_by UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  escalated_to UUID REFERENCES profiles(id),
  escalation_reason TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payout notifications queue
CREATE TABLE IF NOT EXISTS public.payout_notification_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID NOT NULL REFERENCES profiles(id),
  notification_type TEXT NOT NULL CHECK (notification_type IN ('approval_required', 'approved', 'rejected', 'processed', 'failed', 'reminder')),
  payout_request_id UUID REFERENCES payout_requests(id),
  template_id TEXT,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  delivery_method TEXT[] DEFAULT '{"email"}' CHECK (delivery_method <@ '{"email", "sms", "push", "in_app"}'),
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update existing payout_requests table with additional fields
ALTER TABLE public.payout_requests 
ADD COLUMN IF NOT EXISTS batch_id UUID REFERENCES payout_batch_processing(id),
ADD COLUMN IF NOT EXISTS approval_workflow_id UUID REFERENCES payout_approval_workflow(id),
ADD COLUMN IF NOT EXISTS priority_level TEXT DEFAULT 'normal' CHECK (priority_level IN ('low', 'normal', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS auto_processed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_manual_review BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS compliance_checked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fraud_check_status TEXT DEFAULT 'pending' CHECK (fraud_check_status IN ('pending', 'passed', 'failed', 'manual_review')),
ADD COLUMN IF NOT EXISTS external_reference TEXT,
ADD COLUMN IF NOT EXISTS reconciliation_status TEXT DEFAULT 'pending' CHECK (reconciliation_status IN ('pending', 'matched', 'unmatched', 'discrepancy'));

-- Create comprehensive indexes for performance
CREATE INDEX IF NOT EXISTS idx_payout_requests_vendor_status ON public.payout_requests(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_payout_requests_date_range ON public.payout_requests(request_date, payout_period_start, payout_period_end);
CREATE INDEX IF NOT EXISTS idx_payout_requests_amount_range ON public.payout_requests(request_amount, net_payout_amount);
CREATE INDEX IF NOT EXISTS idx_payout_requests_payment_method ON public.payout_requests(payment_method, status);
CREATE INDEX IF NOT EXISTS idx_payout_batch_processing_date_status ON public.payout_batch_processing(processing_date, status);
CREATE INDEX IF NOT EXISTS idx_payout_approval_workflow_status ON public.payout_approval_workflow(approval_status, approval_level);
CREATE INDEX IF NOT EXISTS idx_payout_notification_queue_scheduled ON public.payout_notification_queue(scheduled_at, delivery_status);
CREATE INDEX IF NOT EXISTS idx_payout_processing_logs_request_level ON public.payout_processing_logs(payout_request_id, log_level);

-- Enable RLS on new tables
ALTER TABLE public.payout_batch_processing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_approval_workflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_notification_queue ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin users can manage payout batch processing" ON public.payout_batch_processing
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admin users can manage payout request items" ON public.payout_request_items
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admin users can manage payout processing logs" ON public.payout_processing_logs
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admin users can manage payout approval workflow" ON public.payout_approval_workflow
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admin users can manage payout notification queue" ON public.payout_notification_queue
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- Create stored procedures for payout processing automation
CREATE OR REPLACE FUNCTION public.process_payout_batch(
  p_batch_id UUID,
  p_processor_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_batch_record RECORD;
  v_request_record RECORD;
  v_processed_count INTEGER := 0;
  v_failed_count INTEGER := 0;
  v_total_processed NUMERIC := 0;
  v_result JSONB;
BEGIN
  -- Get batch information
  SELECT * INTO v_batch_record FROM public.payout_batch_processing WHERE id = p_batch_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Batch not found');
  END IF;

  -- Update batch status to processing
  UPDATE public.payout_batch_processing 
  SET status = 'processing', processor_id = p_processor_id, started_at = now()
  WHERE id = p_batch_id;

  -- Process each payout request in the batch
  FOR v_request_record IN 
    SELECT pr.* FROM public.payout_requests pr 
    WHERE pr.batch_id = p_batch_id AND pr.status = 'approved'
  LOOP
    BEGIN
      -- Simulate payment processing logic here
      -- In production, this would integrate with payment gateways
      
      UPDATE public.payout_requests 
      SET status = 'paid', processed_at = now(), processed_by = p_processor_id
      WHERE id = v_request_record.id;
      
      v_processed_count := v_processed_count + 1;
      v_total_processed := v_total_processed + v_request_record.net_payout_amount;
      
      -- Log successful processing
      INSERT INTO public.payout_processing_logs (
        payout_request_id, batch_id, log_level, log_message, logged_by
      ) VALUES (
        v_request_record.id, p_batch_id, 'info', 
        'Payout processed successfully', p_processor_id
      );
      
    EXCEPTION WHEN OTHERS THEN
      v_failed_count := v_failed_count + 1;
      
      -- Log error
      INSERT INTO public.payout_processing_logs (
        payout_request_id, batch_id, log_level, log_message, log_data, logged_by
      ) VALUES (
        v_request_record.id, p_batch_id, 'error', 
        'Payout processing failed', 
        jsonb_build_object('error', SQLERRM), 
        p_processor_id
      );
    END;
  END LOOP;

  -- Update batch completion status
  UPDATE public.payout_batch_processing 
  SET 
    status = CASE WHEN v_failed_count = 0 THEN 'completed' ELSE 'failed' END,
    processed_amount = v_total_processed,
    completed_at = now()
  WHERE id = p_batch_id;

  v_result := jsonb_build_object(
    'success', true,
    'processed_count', v_processed_count,
    'failed_count', v_failed_count,
    'total_processed_amount', v_total_processed
  );

  RETURN v_result;
END;
$$;

-- Create function for automatic payout approval based on rules
CREATE OR REPLACE FUNCTION public.auto_approve_payout_request(
  p_request_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request RECORD;
  v_vendor RECORD;
  v_auto_approve BOOLEAN := false;
BEGIN
  -- Get request details
  SELECT * INTO v_request FROM public.payout_requests WHERE id = p_request_id;
  SELECT * INTO v_vendor FROM public.vendors WHERE id = v_request.vendor_id;
  
  -- Auto-approval rules (customize based on business logic)
  IF v_request.request_amount <= 10000 AND 
     v_vendor.rating >= 4.0 AND 
     v_request.fraud_check_status = 'passed' THEN
    v_auto_approve := true;
  END IF;
  
  IF v_auto_approve THEN
    UPDATE public.payout_requests 
    SET status = 'approved', processed_by = '00000000-0000-0000-0000-000000000000'::uuid, processed_at = now()
    WHERE id = p_request_id;
  END IF;
  
  RETURN v_auto_approve;
END;
$$;

-- Add triggers for updated_at columns
CREATE TRIGGER update_payout_batch_processing_updated_at
  BEFORE UPDATE ON public.payout_batch_processing
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payout_approval_workflow_updated_at
  BEFORE UPDATE ON public.payout_approval_workflow
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
