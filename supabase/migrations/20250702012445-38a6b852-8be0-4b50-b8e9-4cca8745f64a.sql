-- Analytics Suite Enhancement Tables
CREATE TABLE IF NOT EXISTS public.vendor_dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  widget_type TEXT NOT NULL CHECK (widget_type IN ('sales_chart', 'inventory_alerts', 'order_summary', 'revenue_trend', 'customer_insights')),
  widget_config JSONB NOT NULL DEFAULT '{}',
  position_x INTEGER NOT NULL DEFAULT 0,
  position_y INTEGER NOT NULL DEFAULT 0,
  width INTEGER NOT NULL DEFAULT 1,
  height INTEGER NOT NULL DEFAULT 1,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Real-time Data Tables for Live Updates
CREATE TABLE IF NOT EXISTS public.real_time_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('sales', 'inventory', 'orders', 'customers')),
  metric_key TEXT NOT NULL,
  metric_value JSONB NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Advanced Order Workflow Tables
CREATE TABLE IF NOT EXISTS public.order_workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  step_name TEXT NOT NULL CHECK (step_name IN ('payment_confirmed', 'processing', 'picking', 'packing', 'shipped', 'out_for_delivery', 'delivered', 'returned')),
  step_status TEXT NOT NULL CHECK (step_status IN ('pending', 'in_progress', 'completed', 'failed')) DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  assigned_to UUID,
  notes TEXT,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced Inventory Management
CREATE TABLE IF NOT EXISTS public.inventory_forecasting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  forecast_period TEXT NOT NULL CHECK (forecast_period IN ('weekly', 'monthly', 'quarterly')),
  predicted_demand INTEGER NOT NULL,
  confidence_score NUMERIC(5,2) DEFAULT 0.5,
  factors_considered JSONB DEFAULT '{}',
  forecast_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  algorithm_version TEXT DEFAULT 'v1.0'
);

-- Product Bundle Management
CREATE TABLE IF NOT EXISTS public.product_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  bundle_name TEXT NOT NULL,
  bundle_description TEXT,
  bundle_price NUMERIC(12,2) NOT NULL,
  discount_percentage NUMERIC(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_bundle_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID NOT NULL REFERENCES public.product_bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Advanced Customer Analytics
CREATE TABLE IF NOT EXISTS public.customer_behavior_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  behavior_type TEXT NOT NULL CHECK (behavior_type IN ('page_view', 'product_view', 'cart_add', 'purchase', 'return', 'review')),
  product_id UUID,
  session_id TEXT,
  behavior_data JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notification System Enhancement
CREATE TABLE IF NOT EXISTS public.vendor_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('low_stock', 'new_order', 'payment_received', 'review_received', 'system_alert')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  is_read BOOLEAN DEFAULT false,
  action_required BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Advanced Reporting Tables
CREATE TABLE IF NOT EXISTS public.vendor_report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  template_name TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('sales', 'inventory', 'financial', 'customer', 'performance')),
  template_config JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.generated_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  template_id UUID REFERENCES public.vendor_report_templates(id),
  report_name TEXT NOT NULL,
  report_data JSONB NOT NULL,
  file_path TEXT,
  status TEXT NOT NULL CHECK (status IN ('generating', 'completed', 'failed')) DEFAULT 'generating',
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.vendor_dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_forecasting ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_behavior_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Vendors can manage their dashboard widgets"
ON public.vendor_dashboard_widgets
FOR ALL USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can view their real-time metrics"
ON public.real_time_metrics
FOR SELECT USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can view order workflow steps"
ON public.order_workflow_steps
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.order_items oi WHERE oi.order_id = order_id AND oi.vendor_id = auth.uid())
);

CREATE POLICY "Vendors can manage inventory forecasting"
ON public.inventory_forecasting
FOR ALL USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can manage product bundles"
ON public.product_bundles
FOR ALL USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can manage bundle items"
ON public.product_bundle_items
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.product_bundles pb WHERE pb.id = bundle_id AND pb.vendor_id = auth.uid())
);

CREATE POLICY "Vendors can view customer behavior analytics"
ON public.customer_behavior_analytics
FOR SELECT USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can manage their notifications"
ON public.vendor_notifications
FOR ALL USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can manage report templates"
ON public.vendor_report_templates
FOR ALL USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can view their generated reports"
ON public.generated_reports
FOR ALL USING (vendor_id = auth.uid());

-- Indexes for Performance
CREATE INDEX idx_vendor_dashboard_widgets_vendor_id ON public.vendor_dashboard_widgets(vendor_id);
CREATE INDEX idx_real_time_metrics_vendor_metric ON public.real_time_metrics(vendor_id, metric_type, recorded_at DESC);
CREATE INDEX idx_order_workflow_steps_order_id ON public.order_workflow_steps(order_id);
CREATE INDEX idx_inventory_forecasting_product_vendor ON public.inventory_forecasting(product_id, vendor_id);
CREATE INDEX idx_customer_behavior_vendor_customer ON public.customer_behavior_analytics(vendor_id, customer_id, recorded_at DESC);
CREATE INDEX idx_vendor_notifications_vendor_unread ON public.vendor_notifications(vendor_id, is_read, created_at DESC);

-- Triggers for Real-time Updates
CREATE OR REPLACE FUNCTION public.update_real_time_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update sales metrics on order item changes
  IF TG_TABLE_NAME = 'order_items' THEN
    INSERT INTO public.real_time_metrics (vendor_id, metric_type, metric_key, metric_value)
    VALUES (
      NEW.vendor_id,
      'sales',
      'daily_revenue',
      jsonb_build_object('amount', NEW.total_price, 'order_id', NEW.order_id)
    );
  END IF;
  
  -- Update inventory metrics on stock changes
  IF TG_TABLE_NAME = 'product_inventory' THEN
    INSERT INTO public.real_time_metrics (vendor_id, metric_type, metric_key, metric_value)
    VALUES (
      (SELECT vendor_id FROM public.products WHERE id = NEW.product_id),
      'inventory',
      'stock_level',
      jsonb_build_object('product_id', NEW.product_id, 'current_stock', NEW.current_stock)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_real_time_metrics_order_items
  AFTER INSERT OR UPDATE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.update_real_time_metrics();

CREATE TRIGGER trigger_update_real_time_metrics_inventory
  AFTER INSERT OR UPDATE ON public.product_inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_real_time_metrics();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.real_time_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendor_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_workflow_steps;

-- Update timestamp triggers
CREATE TRIGGER update_vendor_dashboard_widgets_updated_at
  BEFORE UPDATE ON public.vendor_dashboard_widgets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_bundles_updated_at
  BEFORE UPDATE ON public.product_bundles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_report_templates_updated_at
  BEFORE UPDATE ON public.vendor_report_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();