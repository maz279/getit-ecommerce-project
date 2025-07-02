-- Create vendor analytics table
CREATE TABLE public.vendor_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}',
  date_range TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create search analytics table  
CREATE TABLE public.search_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  query TEXT NOT NULL,
  results_count INTEGER NOT NULL DEFAULT 0,
  filters_used JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create PWA usage analytics
CREATE TABLE public.pwa_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  install_date DATE,
  usage_patterns JSONB DEFAULT '{}',
  offline_actions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pwa_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Vendors can view their analytics" ON public.vendor_analytics FOR SELECT USING (vendor_id = auth.uid());
CREATE POLICY "Users can view their search analytics" ON public.search_analytics FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage their PWA usage" ON public.pwa_usage FOR ALL USING (user_id = auth.uid());

-- Performance indexes
CREATE INDEX idx_products_search ON public.products USING GIN(to_tsvector('english', name || ' ' || description));
CREATE INDEX idx_vendor_analytics_date_vendor ON public.vendor_analytics(vendor_id, created_at);
CREATE INDEX idx_search_analytics_user_time ON public.search_analytics(user_id, timestamp);

-- Update triggers
CREATE TRIGGER update_vendor_analytics_updated_at BEFORE UPDATE ON public.vendor_analytics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();