-- Create indexes without the problematic websocket index for now
CREATE INDEX IF NOT EXISTS idx_order_tracking_events_order_id ON public.order_tracking_events(order_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_events_vendor_order_id ON public.order_tracking_events(vendor_order_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_events_created_at ON public.order_tracking_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_analytics_cache_key ON public.order_analytics_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_order_analytics_vendor_id ON public.order_analytics_cache(vendor_id);
CREATE INDEX IF NOT EXISTS idx_order_communications_order_id ON public.order_communications(order_id);
CREATE INDEX IF NOT EXISTS idx_order_communications_recipient ON public.order_communications(recipient_id, recipient_type);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON public.ai_product_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_product_id ON public.ai_product_recommendations(product_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_expires_at ON public.ai_product_recommendations(expires_at);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type_service ON public.system_performance_metrics(metric_type, service_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_recorded_at ON public.system_performance_metrics(recorded_at DESC);

-- Enable Row Level Security
ALTER TABLE public.order_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_product_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Order Tracking Events
CREATE POLICY "Customers can view their order tracking events" ON public.order_tracking_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_tracking_events.order_id 
            AND orders.customer_id = auth.uid()
        ) OR is_admin_user()
    );

CREATE POLICY "Vendors can view their order tracking events" ON public.order_tracking_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.vendor_orders vo
            WHERE vo.id = order_tracking_events.vendor_order_id 
            AND vo.vendor_id = auth.uid()
        ) OR is_admin_user()
    );

CREATE POLICY "Delivery agents and admins can manage tracking events" ON public.order_tracking_events
    FOR ALL USING (is_admin_user());

-- Order Analytics Cache
CREATE POLICY "Vendors can view their analytics" ON public.order_analytics_cache
    FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Admins can manage analytics cache" ON public.order_analytics_cache
    FOR ALL USING (is_admin_user());

-- Order Communications
CREATE POLICY "Users can view their communications" ON public.order_communications
    FOR SELECT USING (recipient_id = auth.uid() OR is_admin_user());

CREATE POLICY "System can insert communications" ON public.order_communications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage communications" ON public.order_communications
    FOR ALL USING (is_admin_user());

-- AI Product Recommendations
CREATE POLICY "Users can view their recommendations" ON public.ai_product_recommendations
    FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can update their recommendation interactions" ON public.ai_product_recommendations
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can insert recommendations" ON public.ai_product_recommendations
    FOR INSERT WITH CHECK (true);

-- System Performance Metrics
CREATE POLICY "Admins can manage performance metrics" ON public.system_performance_metrics
    FOR ALL USING (is_admin_user());