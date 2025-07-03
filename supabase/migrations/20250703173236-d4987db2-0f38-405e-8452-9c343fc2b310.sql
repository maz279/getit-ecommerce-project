-- Create comprehensive vendor microservice database schema

-- Vendor Categories for Bangladesh Market
CREATE TABLE public.vendor_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name TEXT NOT NULL,
    category_code TEXT UNIQUE NOT NULL,
    description TEXT,
    commission_rate NUMERIC(5,2) DEFAULT 10.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Vendor KYC Documents
CREATE TABLE public.vendor_kyc_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('trade_license', 'tin_certificate', 'bank_statement', 'national_id', 'business_address')),
    document_number TEXT,
    file_path TEXT,
    file_name TEXT,
    file_size INTEGER,
    mime_type TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')),
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    expiry_date DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Vendor Store Configuration
CREATE TABLE public.vendor_stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    store_name TEXT NOT NULL,
    store_slug TEXT UNIQUE NOT NULL,
    store_logo TEXT,
    store_banner TEXT,
    store_description TEXT,
    business_hours JSONB DEFAULT '{}',
    contact_phone TEXT,
    contact_email TEXT,
    physical_address TEXT,
    pickup_address TEXT,
    return_policy TEXT,
    shipping_policy TEXT,
    store_settings JSONB DEFAULT '{}',
    social_media_links JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Vendor Tier System
CREATE TABLE public.vendor_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_name TEXT NOT NULL,
    tier_level INTEGER NOT NULL,
    min_monthly_sales NUMERIC(15,2) DEFAULT 0,
    max_monthly_sales NUMERIC(15,2),
    commission_discount NUMERIC(5,2) DEFAULT 0,
    benefits JSONB DEFAULT '[]',
    requirements JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Vendor Performance Analytics
CREATE TABLE public.vendor_performance_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    analytics_date DATE DEFAULT CURRENT_DATE,
    total_orders INTEGER DEFAULT 0,
    total_revenue NUMERIC(15,2) DEFAULT 0,
    total_products INTEGER DEFAULT 0,
    active_products INTEGER DEFAULT 0,
    average_rating NUMERIC(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    response_time_hours NUMERIC(8,2) DEFAULT 0,
    fulfillment_rate NUMERIC(5,2) DEFAULT 0,
    return_rate NUMERIC(5,2) DEFAULT 0,
    customer_satisfaction NUMERIC(3,2) DEFAULT 0,
    performance_score NUMERIC(5,2) DEFAULT 0,
    tier_id UUID REFERENCES public.vendor_tiers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bangladesh Compliance Tracking
CREATE TABLE public.vendor_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    compliance_type TEXT NOT NULL CHECK (compliance_type IN ('vat_registration', 'trade_license', 'tin_certificate', 'bank_verification', 'aml_check')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'compliant', 'non_compliant', 'expired')),
    compliance_date DATE,
    expiry_date DATE,
    reference_number TEXT,
    verification_details JSONB DEFAULT '{}',
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT now(),
    next_check_due TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Vendor Document Templates
CREATE TABLE public.vendor_document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name TEXT NOT NULL,
    document_type TEXT NOT NULL,
    template_fields JSONB NOT NULL DEFAULT '[]',
    validation_rules JSONB NOT NULL DEFAULT '[]',
    is_bangladesh_specific BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Vendor Verification Workflow
CREATE TABLE public.vendor_verification_workflow (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    workflow_step TEXT NOT NULL,
    step_order INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
    assigned_to UUID REFERENCES auth.users(id),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    step_data JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);