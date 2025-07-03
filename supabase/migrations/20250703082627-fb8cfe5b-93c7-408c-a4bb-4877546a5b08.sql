-- Real-time Order Tracking Enhancement
CREATE TABLE IF NOT EXISTS public.order_tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    vendor_order_id UUID REFERENCES public.vendor_orders(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('location_update', 'status_change', 'delay_notification', 'delivery_attempt', 'customer_update')),
    event_data JSONB NOT NULL DEFAULT '{}',
    location_data JSONB DEFAULT '{}',
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