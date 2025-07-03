-- PHASE 1: Support Service Database Infrastructure
-- Creating comprehensive support system tables for GetIt platform

-- Knowledge Base Tables
CREATE TABLE IF NOT EXISTS public.knowledge_base_articles (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    content text NOT NULL,
    summary text,
    category text NOT NULL,
    subcategory text,
    language text NOT NULL DEFAULT 'en',
    author_id uuid REFERENCES auth.users(id),
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    view_count integer DEFAULT 0,
    helpful_count integer DEFAULT 0,
    not_helpful_count integer DEFAULT 0,
    tags text[],
    meta_keywords text[],
    meta_description text,
    featured boolean DEFAULT false,
    priority integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    published_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.faqs (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question text NOT NULL,
    answer text NOT NULL,
    category text NOT NULL,
    language text NOT NULL DEFAULT 'en',
    priority integer DEFAULT 0,
    view_count integer DEFAULT 0,
    helpful_count integer DEFAULT 0,
    not_helpful_count integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    tags text[],
    related_articles uuid[],
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Feedback and Survey Tables
CREATE TABLE IF NOT EXISTS public.customer_feedback (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id uuid REFERENCES auth.users(id),
    feedback_type text NOT NULL CHECK (feedback_type IN ('general', 'support_interaction', 'product', 'service', 'suggestion')),
    subject text,
    message text NOT NULL,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    order_id uuid,
    vendor_id uuid,
    ticket_id uuid,
    session_id text,
    sentiment_score numeric,
    sentiment_label text,
    tags text[],
    status text DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'responded', 'closed')),
    response_message text,
    responded_by uuid REFERENCES auth.users(id),
    responded_at timestamp with time zone,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.satisfaction_surveys (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id uuid REFERENCES auth.users(id),
    survey_type text NOT NULL CHECK (survey_type IN ('post_chat', 'post_ticket', 'post_order', 'general')),
    reference_id uuid, -- ticket_id, order_id, session_id etc
    overall_satisfaction integer CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 5),
    agent_rating integer CHECK (agent_rating >= 1 AND agent_rating <= 5),
    response_time_rating integer CHECK (response_time_rating >= 1 AND response_time_rating <= 5),
    resolution_quality_rating integer CHECK (resolution_quality_rating >= 1 AND resolution_quality_rating <= 5),
    likelihood_to_recommend integer CHECK (likelihood_to_recommend >= 1 AND likelihood_to_recommend <= 10),
    comments text,
    areas_for_improvement text[],
    positive_feedback text[],
    language text DEFAULT 'en',
    completed_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Enhanced Agent Management
CREATE TABLE IF NOT EXISTS public.support_agents (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) UNIQUE,
    agent_code text NOT NULL UNIQUE,
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    avatar_url text,
    department text NOT NULL DEFAULT 'general',
    specializations text[],
    languages text[] NOT NULL DEFAULT ARRAY['en'],
    shift_schedule jsonb DEFAULT '{}',
    max_concurrent_tickets integer DEFAULT 10,
    max_concurrent_chats integer DEFAULT 3,
    is_available boolean DEFAULT true,
    is_online boolean DEFAULT false,
    current_status text DEFAULT 'offline' CHECK (current_status IN ('online', 'busy', 'away', 'offline')),
    total_tickets_handled integer DEFAULT 0,
    total_chats_handled integer DEFAULT 0,
    avg_resolution_time interval,
    avg_response_time interval,
    customer_satisfaction_score numeric DEFAULT 0,
    performance_score numeric DEFAULT 0,
    hire_date date NOT NULL,
    last_active_at timestamp with time zone,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Ticket Categories and Escalation
CREATE TABLE IF NOT EXISTS public.ticket_categories (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    parent_category_id uuid REFERENCES public.ticket_categories(id),
    department text NOT NULL,
    default_priority text DEFAULT 'medium' CHECK (default_priority IN ('low', 'medium', 'high', 'urgent')),
    auto_assignment_rules jsonb DEFAULT '{}',
    sla_response_hours integer DEFAULT 24,
    sla_resolution_hours integer DEFAULT 72,
    escalation_rules jsonb DEFAULT '{}',
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.support_escalations (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id uuid REFERENCES public.support_tickets(id),
    escalated_from uuid REFERENCES auth.users(id),
    escalated_to uuid REFERENCES auth.users(id),
    escalation_level integer NOT NULL DEFAULT 1,
    escalation_reason text NOT NULL,
    escalation_type text NOT NULL CHECK (escalation_type IN ('manual', 'automatic', 'sla_breach')),
    previous_agent_id uuid REFERENCES public.support_agents(id),
    new_agent_id uuid REFERENCES public.support_agents(id),
    escalation_notes text,
    resolved_at timestamp with time zone,
    resolution_notes text,
    created_at timestamp with time zone DEFAULT now()
);

-- SLA Configuration
CREATE TABLE IF NOT EXISTS public.sla_configurations (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    category_id uuid REFERENCES public.ticket_categories(id),
    priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    first_response_hours integer NOT NULL,
    resolution_hours integer NOT NULL,
    escalation_hours integer,
    business_hours_only boolean DEFAULT true,
    exclude_weekends boolean DEFAULT true,
    exclude_holidays boolean DEFAULT true,
    auto_escalate boolean DEFAULT true,
    escalation_chain jsonb DEFAULT '[]',
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Support Analytics and Metrics
CREATE TABLE IF NOT EXISTS public.support_analytics (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_type text NOT NULL,
    metric_name text NOT NULL,
    metric_value numeric NOT NULL,
    agent_id uuid REFERENCES public.support_agents(id),
    department text,
    category text,
    time_period text NOT NULL, -- 'hourly', 'daily', 'weekly', 'monthly'
    period_start timestamp with time zone NOT NULL,
    period_end timestamp with time zone NOT NULL,
    additional_data jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now()
);

-- Enhanced Chat Management
CREATE TABLE IF NOT EXISTS public.chat_sessions_enhanced (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id text NOT NULL UNIQUE,
    customer_id uuid REFERENCES auth.users(id),
    agent_id uuid REFERENCES public.support_agents(id),
    department text DEFAULT 'general',
    initial_message text,
    session_type text DEFAULT 'support' CHECK (session_type IN ('support', 'sales', 'technical', 'general')),
    language text DEFAULT 'en',
    status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'transferred', 'ended', 'abandoned')),
    priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    queue_position integer,
    wait_time interval,
    chat_duration interval,
    message_count integer DEFAULT 0,
    customer_satisfaction_rating integer CHECK (customer_satisfaction_rating >= 1 AND customer_satisfaction_rating <= 5),
    customer_feedback text,
    agent_notes text,
    tags text[],
    metadata jsonb DEFAULT '{}',
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    last_activity_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Bangladesh-Specific Support Features
CREATE TABLE IF NOT EXISTS public.bangladesh_support_config (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    config_type text NOT NULL,
    config_name text NOT NULL,
    config_value jsonb NOT NULL,
    is_active boolean DEFAULT true,
    effective_from timestamp with time zone DEFAULT now(),
    effective_to timestamp with time zone,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Chatbot Training Data
CREATE TABLE IF NOT EXISTS public.chatbot_training_data (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    intent text NOT NULL,
    entity_type text,
    training_phrase text NOT NULL,
    response_template text NOT NULL,
    language text NOT NULL DEFAULT 'en',
    confidence_score numeric,
    context_data jsonb DEFAULT '{}',
    usage_count integer DEFAULT 0,
    success_rate numeric DEFAULT 0,
    is_active boolean DEFAULT true,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Multi-Channel Integration
CREATE TABLE IF NOT EXISTS public.multichannel_conversations (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id uuid REFERENCES auth.users(id),
    channel_type text NOT NULL CHECK (channel_type IN ('whatsapp', 'facebook', 'viber', 'telegram', 'email', 'sms')),
    channel_identifier text NOT NULL, -- phone number, messenger id, etc
    conversation_id text NOT NULL,
    agent_id uuid REFERENCES public.support_agents(id),
    status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'transferred')),
    last_message_at timestamp with time zone,
    message_count integer DEFAULT 0,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.knowledge_base_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.satisfaction_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bangladesh_support_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multichannel_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Knowledge Base - Public read, Admin write
CREATE POLICY "Public can view published articles" ON public.knowledge_base_articles FOR SELECT USING (status = 'published');
CREATE POLICY "Admin can manage articles" ON public.knowledge_base_articles FOR ALL USING (is_admin_user());

CREATE POLICY "Public can view FAQs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Admin can manage FAQs" ON public.faqs FOR ALL USING (is_admin_user());

-- Feedback - Users can create, Admin can view all
CREATE POLICY "Users can create feedback" ON public.customer_feedback FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Users can view their feedback" ON public.customer_feedback FOR SELECT USING (customer_id = auth.uid() OR is_admin_user());
CREATE POLICY "Admin can manage feedback" ON public.customer_feedback FOR ALL USING (is_admin_user());

CREATE POLICY "Users can create surveys" ON public.satisfaction_surveys FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Users can view their surveys" ON public.satisfaction_surveys FOR SELECT USING (customer_id = auth.uid() OR is_admin_user());
CREATE POLICY "Admin can view surveys" ON public.satisfaction_surveys FOR SELECT USING (is_admin_user());

-- Admin-only tables
CREATE POLICY "Admin full access support_agents" ON public.support_agents FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access ticket_categories" ON public.ticket_categories FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access support_escalations" ON public.support_escalations FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access sla_configurations" ON public.sla_configurations FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access support_analytics" ON public.support_analytics FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access bangladesh_support_config" ON public.bangladesh_support_config FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access chatbot_training_data" ON public.chatbot_training_data FOR ALL USING (is_admin_user());

-- Chat sessions - Users can view their sessions, agents can view assigned sessions
CREATE POLICY "Users can view their chat sessions" ON public.chat_sessions_enhanced FOR SELECT USING (customer_id = auth.uid() OR is_admin_user());
CREATE POLICY "Admin can manage chat sessions" ON public.chat_sessions_enhanced FOR ALL USING (is_admin_user());

CREATE POLICY "Users can view their multichannel conversations" ON public.multichannel_conversations FOR SELECT USING (customer_id = auth.uid() OR is_admin_user());
CREATE POLICY "Admin can manage multichannel conversations" ON public.multichannel_conversations FOR ALL USING (is_admin_user());

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_knowledge_base_articles_category ON public.knowledge_base_articles(category, status);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_articles_language ON public.knowledge_base_articles(language);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_articles_tags ON public.knowledge_base_articles USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category, language);
CREATE INDEX IF NOT EXISTS idx_faqs_priority ON public.faqs(priority DESC);

CREATE INDEX IF NOT EXISTS idx_customer_feedback_customer ON public.customer_feedback(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_feedback_type ON public.customer_feedback(feedback_type, status);
CREATE INDEX IF NOT EXISTS idx_customer_feedback_created ON public.customer_feedback(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_agents_status ON public.support_agents(current_status, is_available);
CREATE INDEX IF NOT EXISTS idx_support_agents_department ON public.support_agents(department);
CREATE INDEX IF NOT EXISTS idx_support_agents_languages ON public.support_agents USING GIN(languages);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_enhanced_status ON public.chat_sessions_enhanced(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_enhanced_agent ON public.chat_sessions_enhanced(agent_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_enhanced_customer ON public.chat_sessions_enhanced(customer_id);

CREATE INDEX IF NOT EXISTS idx_support_analytics_metric ON public.support_analytics(metric_type, metric_name);
CREATE INDEX IF NOT EXISTS idx_support_analytics_period ON public.support_analytics(time_period, period_start);

-- Triggers for updated_at
CREATE TRIGGER update_knowledge_base_articles_updated_at BEFORE UPDATE ON public.knowledge_base_articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customer_feedback_updated_at BEFORE UPDATE ON public.customer_feedback FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_support_agents_updated_at BEFORE UPDATE ON public.support_agents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ticket_categories_updated_at BEFORE UPDATE ON public.ticket_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sla_configurations_updated_at BEFORE UPDATE ON public.sla_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bangladesh_support_config_updated_at BEFORE UPDATE ON public.bangladesh_support_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chatbot_training_data_updated_at BEFORE UPDATE ON public.chatbot_training_data FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_multichannel_conversations_updated_at BEFORE UPDATE ON public.multichannel_conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();