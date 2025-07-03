-- Create media processing and price management tables
CREATE TABLE public.media_processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  processed_urls JSONB DEFAULT '{}',
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  processing_config JSONB DEFAULT '{}',
  optimization_metrics JSONB DEFAULT '{}',
  error_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.price_management_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('dynamic', 'seasonal', 'promotional', 'competitive')),
  rule_config JSONB NOT NULL DEFAULT '{}',
  pricing_algorithm TEXT NOT NULL DEFAULT 'fixed',
  minimum_price DECIMAL(10,2),
  maximum_price DECIMAL(10,2),
  current_price DECIMAL(10,2),
  effective_dates JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.review_management_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  review_id UUID,
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
  moderation_type TEXT NOT NULL CHECK (moderation_type IN ('automatic', 'manual', 'community')),
  flagged_reasons JSONB DEFAULT '[]',
  moderator_notes TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_media_processing_jobs_product_id ON public.media_processing_jobs(product_id);
CREATE INDEX idx_media_processing_jobs_status ON public.media_processing_jobs(processing_status);
CREATE INDEX idx_price_management_rules_product_id ON public.price_management_rules(product_id);
CREATE INDEX idx_price_management_rules_vendor_id ON public.price_management_rules(vendor_id);
CREATE INDEX idx_price_management_rules_active ON public.price_management_rules(is_active);
CREATE INDEX idx_review_management_queue_product_id ON public.review_management_queue(product_id);
CREATE INDEX idx_review_management_queue_status ON public.review_management_queue(moderation_status);

-- Enable RLS
ALTER TABLE public.media_processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_management_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_management_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Vendors can manage their product media processing" ON public.media_processing_jobs
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.products WHERE id = media_processing_jobs.product_id AND vendor_id = auth.uid()
  ) OR is_admin_user());

CREATE POLICY "Vendors can manage their price rules" ON public.price_management_rules
  FOR ALL USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Admins can manage review queue" ON public.review_management_queue
  FOR ALL USING (is_admin_user());

-- Add triggers for updated_at
CREATE TRIGGER update_media_processing_jobs_updated_at
  BEFORE UPDATE ON public.media_processing_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_price_management_rules_updated_at
  BEFORE UPDATE ON public.price_management_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();