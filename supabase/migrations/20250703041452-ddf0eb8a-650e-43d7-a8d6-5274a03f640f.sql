-- Real-time Order Tracking Enhancement
CREATE TABLE IF NOT EXISTS public.order_tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    vendor_order_id UUID REFERENCES public.vendor_orders(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('location_update', 'status_change', 'delay_notification', 'delivery_attempt', 'customer_update')),
    event_data JSONB NOT NULL DEFAULT '{}',
    location_data JSONB DEFAULT '{}', -- lat, lng, address, landmark
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    delivery_agent_id UUID,
    delivery_agent_name TEXT,
    delivery_agent_phone TEXT,
    tracking_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Advanced Analytics Tables
CREATE TABLE IF NOT EXISTS public.order_analytics_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key TEXT NOT NULL UNIQUE,
    analytics_type TEXT NOT NULL CHECK (analytics_type IN ('daily', 'weekly', 'monthly', 'yearly', 'vendor', 'category', 'real_time')),
    data JSONB NOT NULL DEFAULT '{}',
    date_range JSONB NOT NULL DEFAULT '{}',
    vendor_id UUID,
    category_id UUID,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Customer Communication System
CREATE TABLE IF NOT EXISTS public.order_communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    communication_type TEXT NOT NULL CHECK (communication_type IN ('sms', 'email', 'push', 'whatsapp', 'in_app')),
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('customer', 'vendor', 'delivery_agent', 'admin')),
    recipient_id UUID NOT NULL,
    subject TEXT,
    message_content TEXT NOT NULL,
    template_id TEXT,
    delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed', 'read')),
    delivery_time TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Recommendation Engine Tables
CREATE TABLE IF NOT EXISTS public.ai_product_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    product_id UUID NOT NULL,
    recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('frequently_bought_together', 'customers_also_viewed', 'based_on_history', 'trending', 'seasonal', 'cross_sell', 'up_sell')),
    confidence_score NUMERIC(5,4) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    recommendation_data JSONB NOT NULL DEFAULT '{}',
    conversion_tracked BOOLEAN DEFAULT false,
    clicked BOOLEAN DEFAULT false,
    purchased BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Performance Monitoring Tables
CREATE TABLE IF NOT EXISTS public.system_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL CHECK (metric_type IN ('api_response_time', 'database_query_time', 'cache_hit_rate', 'error_rate', 'throughput', 'concurrent_users')),
    service_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Real-time WebSocket Sessions
CREATE TABLE IF NOT EXISTS public.websocket_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    session_id TEXT NOT NULL UNIQUE,
    connection_type TEXT NOT NULL CHECK (connection_type IN ('order_tracking', 'live_chat', 'notifications', 'analytics')),
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true
);

-- Indexes for Performance
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
CREATE INDEX IF NOT EXISTS idx_websocket_sessions_user_id ON public.websocket_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_websocket_sessions_active ON public.websocket_sessions(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.order_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_product_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websocket_sessions ENABLE ROW LEVEL SECURITY;

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

-- WebSocket Sessions
CREATE POLICY "Users can manage their websocket sessions" ON public.websocket_sessions
    FOR ALL USING (user_id = auth.uid() OR is_admin_user());

-- Functions for Real-time Tracking
CREATE OR REPLACE FUNCTION public.update_order_location(
    p_order_id UUID,
    p_latitude NUMERIC,
    p_longitude NUMERIC,
    p_address TEXT,
    p_agent_id UUID DEFAULT NULL,
    p_agent_name TEXT DEFAULT NULL,
    p_estimated_delivery TIMESTAMP WITH TIME ZONE DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_tracking_id UUID;
BEGIN
    INSERT INTO public.order_tracking_events (
        order_id,
        event_type,
        event_data,
        location_data,
        estimated_delivery,
        delivery_agent_id,
        delivery_agent_name,
        created_by
    ) VALUES (
        p_order_id,
        'location_update',
        jsonb_build_object(
            'status', 'in_transit',
            'message', 'Package location updated'
        ),
        jsonb_build_object(
            'latitude', p_latitude,
            'longitude', p_longitude,
            'address', p_address,
            'timestamp', now()
        ),
        p_estimated_delivery,
        p_agent_id,
        p_agent_name,
        auth.uid()
    ) RETURNING id INTO v_tracking_id;
    
    RETURN v_tracking_id;
END;
$$;

-- Function to Generate AI Recommendations
CREATE OR REPLACE FUNCTION public.generate_ai_recommendations(
    p_user_id UUID,
    p_product_id UUID DEFAULT NULL,
    p_recommendation_type TEXT DEFAULT 'based_on_history'
) RETURNS SETOF public.ai_product_recommendations
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Clear expired recommendations
    DELETE FROM public.ai_product_recommendations 
    WHERE expires_at < now();
    
    -- Generate new recommendations based on type
    IF p_recommendation_type = 'frequently_bought_together' AND p_product_id IS NOT NULL THEN
        RETURN QUERY
        INSERT INTO public.ai_product_recommendations (
            user_id, product_id, recommendation_type, confidence_score, recommendation_data
        )
        SELECT 
            p_user_id,
            p.id,
            'frequently_bought_together',
            0.85,
            jsonb_build_object(
                'base_product_id', p_product_id,
                'reason', 'Customers who bought this item also bought',
                'category', p.category
            )
        FROM public.products p
        WHERE p.id != p_product_id 
        AND p.is_active = true
        LIMIT 5
        RETURNING *;
    END IF;
    
    RETURN;
END;
$$;

-- Function to Cache Analytics Data
CREATE OR REPLACE FUNCTION public.cache_order_analytics(
    p_analytics_type TEXT,
    p_vendor_id UUID DEFAULT NULL,
    p_date_range JSONB DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_cache_key TEXT;
    v_cache_id UUID;
    v_analytics_data JSONB;
BEGIN
    -- Generate cache key
    v_cache_key := p_analytics_type || '_' || 
                   COALESCE(p_vendor_id::text, 'all') || '_' ||
                   COALESCE(p_date_range::text, date_trunc('day', now())::text);
    
    -- Calculate analytics based on type
    IF p_analytics_type = 'daily' THEN
        SELECT jsonb_build_object(
            'total_orders', COUNT(*),
            'total_revenue', COALESCE(SUM(total_amount), 0),
            'average_order_value', COALESCE(AVG(total_amount), 0),
            'order_statuses', jsonb_object_agg(status, status_count)
        ) INTO v_analytics_data
        FROM (
            SELECT 
                status,
                COUNT(*) as status_count,
                total_amount
            FROM public.orders
            WHERE date_trunc('day', created_at) = date_trunc('day', now())
            AND (p_vendor_id IS NULL OR EXISTS (
                SELECT 1 FROM public.vendor_orders vo 
                WHERE vo.order_id = orders.id AND vo.vendor_id = p_vendor_id
            ))
            GROUP BY status, total_amount
        ) analytics;
    END IF;
    
    -- Insert or update cache
    INSERT INTO public.order_analytics_cache (
        cache_key, analytics_type, data, date_range, vendor_id, expires_at
    ) VALUES (
        v_cache_key, p_analytics_type, v_analytics_data, p_date_range, p_vendor_id,
        now() + INTERVAL '1 hour'
    )
    ON CONFLICT (cache_key) DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = now(),
        expires_at = EXCLUDED.expires_at
    RETURNING id INTO v_cache_id;
    
    RETURN v_cache_id;
END;
$$;

-- Triggers
CREATE OR REPLACE FUNCTION public.trigger_real_time_order_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert tracking event for status changes
    IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO public.order_tracking_events (
            order_id,
            event_type,
            event_data,
            created_by
        ) VALUES (
            NEW.id,
            'status_change',
            jsonb_build_object(
                'old_status', OLD.status,
                'new_status', NEW.status,
                'change_reason', 'System update'
            ),
            auth.uid()
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Apply trigger to orders table
DROP TRIGGER IF EXISTS trigger_order_status_tracking ON public.orders;
CREATE TRIGGER trigger_order_status_tracking
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_real_time_order_update();

-- Add updated_at triggers
CREATE TRIGGER update_order_analytics_cache_updated_at
    BEFORE UPDATE ON public.order_analytics_cache
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Real-time subscriptions setup
ALTER TABLE public.order_tracking_events REPLICA IDENTITY FULL;
ALTER TABLE public.order_communications REPLICA IDENTITY FULL;
ALTER TABLE public.websocket_sessions REPLICA IDENTITY FULL;