
-- Create vendor_ratings table to store overall vendor ratings
CREATE TABLE public.vendor_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  overall_rating NUMERIC(3,2) CHECK (overall_rating >= 0 AND overall_rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  product_quality_rating NUMERIC(3,2) DEFAULT 0,
  delivery_speed_rating NUMERIC(3,2) DEFAULT 0,
  customer_service_rating NUMERIC(3,2) DEFAULT 0,
  communication_rating NUMERIC(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create review_moderation table to handle review moderation
CREATE TABLE public.review_moderation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.product_reviews(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL,
  customer_name TEXT,
  product_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  flags JSONB DEFAULT '[]',
  priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high')),
  moderator_id UUID,
  moderation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rating_disputes table to handle disputes
CREATE TABLE public.rating_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.product_reviews(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL,
  customer_id UUID,
  dispute_reason TEXT NOT NULL,
  dispute_description TEXT,
  dispute_status TEXT DEFAULT 'pending' CHECK (dispute_status IN ('pending', 'under-review', 'resolved', 'rejected')),
  priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high')),
  resolution_notes TEXT,
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rating_policies table to store rating policies
CREATE TABLE public.rating_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name TEXT NOT NULL,
  policy_type TEXT NOT NULL CHECK (policy_type IN ('review_guidelines', 'moderation_rules', 'dispute_resolution', 'vendor_standards')),
  policy_content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  effective_date DATE DEFAULT CURRENT_DATE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create AI detection settings table
CREATE TABLE public.ai_detection_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_name TEXT NOT NULL UNIQUE,
  setting_type TEXT NOT NULL CHECK (setting_type IN ('detection_rule', 'auto_moderation')),
  is_enabled BOOLEAN DEFAULT true,
  configuration JSONB DEFAULT '{}',
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default AI detection settings
INSERT INTO public.ai_detection_settings (setting_name, setting_type, is_enabled, configuration) VALUES
('fake_review_detection', 'detection_rule', true, '{"sensitivity": "high", "threshold": 0.8}'),
('duplicate_content_check', 'detection_rule', true, '{"similarity_threshold": 0.9}'),
('sentiment_analysis', 'detection_rule', true, '{"enable_profanity_filter": true}'),
('language_pattern_detection', 'detection_rule', false, '{"patterns": ["promotional", "incentivized"]}'),
('auto_approve_verified', 'auto_moderation', true, '{"risk_threshold": 30}'),
('auto_flag_high_risk', 'auto_moderation', true, '{"risk_threshold": 70}'),
('require_manual_disputes', 'auto_moderation', true, '{}');

-- Enable Row Level Security
ALTER TABLE public.vendor_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rating_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rating_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_detection_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing admin access)
CREATE POLICY "Admin can manage vendor ratings" ON public.vendor_ratings FOR ALL USING (true);
CREATE POLICY "Admin can manage review moderation" ON public.review_moderation FOR ALL USING (true);
CREATE POLICY "Admin can manage rating disputes" ON public.rating_disputes FOR ALL USING (true);
CREATE POLICY "Admin can manage rating policies" ON public.rating_policies FOR ALL USING (true);
CREATE POLICY "Admin can manage AI detection settings" ON public.ai_detection_settings FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_vendor_ratings_vendor_id ON public.vendor_ratings(vendor_id);
CREATE INDEX idx_review_moderation_status ON public.review_moderation(moderation_status);
CREATE INDEX idx_review_moderation_priority ON public.review_moderation(priority_level);
CREATE INDEX idx_rating_disputes_status ON public.rating_disputes(dispute_status);
CREATE INDEX idx_rating_disputes_vendor ON public.rating_disputes(vendor_id);
CREATE INDEX idx_rating_policies_active ON public.rating_policies(is_active);
CREATE INDEX idx_ai_detection_settings_enabled ON public.ai_detection_settings(is_enabled);

-- Create function to update ratings when reviews change
CREATE OR REPLACE FUNCTION update_vendor_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update vendor overall rating based on product reviews
  INSERT INTO public.vendor_ratings (vendor_id, overall_rating, total_reviews)
  SELECT 
    p.vendor_id,
    AVG(pr.rating)::NUMERIC(3,2),
    COUNT(pr.id)::INTEGER
  FROM public.products p
  JOIN public.product_reviews pr ON p.id = pr.product_id
  WHERE p.vendor_id = (SELECT vendor_id FROM public.products WHERE id = COALESCE(NEW.product_id, OLD.product_id))
  GROUP BY p.vendor_id
  ON CONFLICT (vendor_id) 
  DO UPDATE SET 
    overall_rating = EXCLUDED.overall_rating,
    total_reviews = EXCLUDED.total_reviews,
    updated_at = now();
    
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update vendor ratings
CREATE TRIGGER update_vendor_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_vendor_rating();
