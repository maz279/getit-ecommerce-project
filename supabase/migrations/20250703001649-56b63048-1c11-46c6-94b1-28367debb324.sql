-- Complete remaining e-commerce database schema
-- Add missing core tables for Amazon/Shopee level functionality

-- Product Categories Enhancement
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS category_path text[];
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS commission_rate numeric DEFAULT 5.0;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Shipping and Logistics Tables
CREATE TABLE IF NOT EXISTS public.shipping_zones (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    zone_name text NOT NULL,
    countries jsonb DEFAULT '[]'::jsonb,
    states_provinces jsonb DEFAULT '[]'::jsonb,
    postal_codes jsonb DEFAULT '[]'::jsonb,
    shipping_methods jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shipping_rates (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    zone_id uuid REFERENCES public.shipping_zones(id),
    method_name text NOT NULL,
    base_rate numeric NOT NULL DEFAULT 0,
    weight_rate numeric DEFAULT 0,
    volume_rate numeric DEFAULT 0,
    min_delivery_days integer DEFAULT 1,
    max_delivery_days integer DEFAULT 7,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- Customer Service Tables
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_number text UNIQUE NOT NULL,
    customer_id uuid REFERENCES auth.users(id),
    vendor_id uuid,
    order_id uuid,
    category text NOT NULL,
    priority text DEFAULT 'medium',
    status text DEFAULT 'open',
    subject text NOT NULL,
    description text NOT NULL,
    assigned_to uuid,
    resolution_notes text,
    satisfaction_rating integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    resolved_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.support_messages (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id uuid REFERENCES public.support_tickets(id),
    sender_id uuid REFERENCES auth.users(id),
    message_text text NOT NULL,
    attachments jsonb DEFAULT '[]'::jsonb,
    is_internal boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- Advanced Analytics Tables
CREATE TABLE IF NOT EXISTS public.customer_segments (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    segment_name text NOT NULL,
    criteria jsonb NOT NULL,
    customer_count integer DEFAULT 0,
    avg_order_value numeric DEFAULT 0,
    lifetime_value numeric DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customer_segment_memberships (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id uuid REFERENCES auth.users(id),
    segment_id uuid REFERENCES public.customer_segments(id),
    joined_at timestamp with time zone DEFAULT now(),
    confidence_score numeric DEFAULT 1.0,
    UNIQUE(customer_id, segment_id)
);

-- Fraud Detection Tables
CREATE TABLE IF NOT EXISTS public.fraud_detection_rules (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_name text NOT NULL,
    rule_type text NOT NULL,
    conditions jsonb NOT NULL,
    action text NOT NULL,
    severity text DEFAULT 'medium',
    is_active boolean DEFAULT true,
    false_positive_rate numeric DEFAULT 0,
    detection_rate numeric DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fraud_alerts (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_id uuid REFERENCES public.fraud_detection_rules(id),
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    risk_score numeric NOT NULL,
    details jsonb DEFAULT '{}',
    status text DEFAULT 'pending',
    investigated_by uuid,
    investigated_at timestamp with time zone,
    resolution text,
    created_at timestamp with time zone DEFAULT now()
);

-- Loyalty Program Tables
CREATE TABLE IF NOT EXISTS public.loyalty_programs (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    program_name text NOT NULL,
    program_type text NOT NULL,
    rules jsonb NOT NULL,
    rewards jsonb DEFAULT '[]'::jsonb,
    tier_structure jsonb DEFAULT '{}',
    is_active boolean DEFAULT true,
    start_date date,
    end_date date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customer_loyalty_points (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id uuid REFERENCES auth.users(id),
    program_id uuid REFERENCES public.loyalty_programs(id),
    points_balance integer DEFAULT 0,
    lifetime_points integer DEFAULT 0,
    tier_level text DEFAULT 'bronze',
    tier_benefits jsonb DEFAULT '{}',
    last_activity_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(customer_id, program_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_segment_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_detection_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_loyalty_points ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin full access shipping_zones" ON public.shipping_zones FOR ALL USING (is_admin_user());
CREATE POLICY "Public can view active shipping zones" ON public.shipping_zones FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access shipping_rates" ON public.shipping_rates FOR ALL USING (is_admin_user());
CREATE POLICY "Public can view active shipping rates" ON public.shipping_rates FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their support tickets" ON public.support_tickets FOR SELECT USING (customer_id = auth.uid() OR is_admin_user());
CREATE POLICY "Users can create support tickets" ON public.support_tickets FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Admin can manage support tickets" ON public.support_tickets FOR ALL USING (is_admin_user());

CREATE POLICY "Users can view messages for their tickets" ON public.support_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.support_tickets WHERE id = ticket_id AND (customer_id = auth.uid() OR is_admin_user()))
);
CREATE POLICY "Users can create messages for their tickets" ON public.support_messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.support_tickets WHERE id = ticket_id AND customer_id = auth.uid()) OR is_admin_user()
);

CREATE POLICY "Admin can manage customer segments" ON public.customer_segments FOR ALL USING (is_admin_user());
CREATE POLICY "Admin can view segment memberships" ON public.customer_segment_memberships FOR SELECT USING (is_admin_user());
CREATE POLICY "Users can view their segment memberships" ON public.customer_segment_memberships FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Admin can manage fraud rules" ON public.fraud_detection_rules FOR ALL USING (is_admin_user());
CREATE POLICY "Admin can manage fraud alerts" ON public.fraud_alerts FOR ALL USING (is_admin_user());

CREATE POLICY "Admin can manage loyalty programs" ON public.loyalty_programs FOR ALL USING (is_admin_user());
CREATE POLICY "Public can view active loyalty programs" ON public.loyalty_programs FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their loyalty points" ON public.customer_loyalty_points FOR SELECT USING (customer_id = auth.uid() OR is_admin_user());
CREATE POLICY "Admin can manage loyalty points" ON public.customer_loyalty_points FOR ALL USING (is_admin_user());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_shipping_zones_active ON public.shipping_zones(is_active);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_zone ON public.shipping_rates(zone_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer ON public.support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket ON public.support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_customer_segments_active ON public.customer_segments(is_active);
CREATE INDEX IF NOT EXISTS idx_segment_memberships_customer ON public.customer_segment_memberships(customer_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_status ON public.fraud_alerts(status);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_customer ON public.customer_loyalty_points(customer_id);