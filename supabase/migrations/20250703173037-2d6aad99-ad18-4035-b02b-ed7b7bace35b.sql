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

-- Insert Bangladesh vendor categories
INSERT INTO public.vendor_categories (category_name, category_code, description, commission_rate) VALUES
('Fashion & Clothing', 'FASHION', 'Traditional and modern clothing, accessories', 8.5),
('Electronics & Gadgets', 'ELECTRONICS', 'Consumer electronics, mobile devices, computers', 12.0),
('Home & Living', 'HOME', 'Furniture, home decor, appliances', 10.0),
('Health & Beauty', 'HEALTH', 'Personal care, cosmetics, healthcare products', 15.0),
('Food & Groceries', 'FOOD', 'Food items, beverages, groceries', 5.0),
('Books & Stationery', 'BOOKS', 'Educational materials, office supplies', 7.5),
('Sports & Outdoor', 'SPORTS', 'Sports equipment, outdoor gear', 10.0),
('Handicrafts & Traditional', 'HANDICRAFTS', 'Bengali handicrafts, traditional items', 6.0),
('Mobile & Accessories', 'MOBILE', 'Mobile phones, accessories, services', 12.0),
('Automotive Parts', 'AUTO', 'Vehicle parts, accessories, maintenance', 8.0);

-- Insert vendor tier system
INSERT INTO public.vendor_tiers (tier_name, tier_level, min_monthly_sales, max_monthly_sales, commission_discount, benefits, requirements) VALUES
('Bronze', 1, 0, 50000, 0, '["Basic support", "Standard listing"]', '["Complete KYC", "Active store"]'),
('Silver', 2, 50000, 200000, 1.0, '["Priority support", "Featured listings", "Analytics dashboard"]', '["6 months active", "4.0+ rating", "95%+ fulfillment"]'),
('Gold', 3, 200000, 500000, 2.5, '["Dedicated account manager", "Premium placement", "Marketing support"]', '["12 months active", "4.3+ rating", "98%+ fulfillment"]'),
('Platinum', 4, 500000, NULL, 5.0, '["White-glove service", "Custom integration", "Co-marketing opportunities"]', '["24 months active", "4.5+ rating", "99%+ fulfillment"]);

-- Insert document templates for Bangladesh
INSERT INTO public.vendor_document_templates (template_name, document_type, template_fields, validation_rules, is_bangladesh_specific) VALUES
('Trade License Template', 'trade_license', '[{"field": "license_number", "type": "text", "required": true}, {"field": "business_name", "type": "text", "required": true}, {"field": "issue_date", "type": "date", "required": true}, {"field": "expiry_date", "type": "date", "required": true}]', '[{"field": "license_number", "pattern": "^[A-Z0-9]{8,12}$"}, {"field": "expiry_date", "validation": "must_be_future"}]', true),
('TIN Certificate Template', 'tin_certificate', '[{"field": "tin_number", "type": "text", "required": true}, {"field": "taxpayer_name", "type": "text", "required": true}, {"field": "issue_date", "type": "date", "required": true}]', '[{"field": "tin_number", "pattern": "^[0-9]{9,12}$"}]', true),
('Bank Statement Template', 'bank_statement', '[{"field": "account_number", "type": "text", "required": true}, {"field": "bank_name", "type": "text", "required": true}, {"field": "account_holder_name", "type": "text", "required": true}, {"field": "statement_date", "type": "date", "required": true}]', '[{"field": "account_number", "pattern": "^[0-9]{10,20}$"}]', true),
('National ID Template', 'national_id', '[{"field": "nid_number", "type": "text", "required": true}, {"field": "full_name", "type": "text", "required": true}, {"field": "date_of_birth", "type": "date", "required": true}, {"field": "address", "type": "text", "required": true}]', '[{"field": "nid_number", "pattern": "^[0-9]{10,17}$"}]', true);

-- Enable RLS on new tables
ALTER TABLE public.vendor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_verification_workflow ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public can view vendor categories" ON public.vendor_categories FOR SELECT USING (true);
CREATE POLICY "Admin can manage vendor categories" ON public.vendor_categories FOR ALL USING (is_admin_user());

CREATE POLICY "Vendors can view their own KYC documents" ON public.vendor_kyc_documents FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "Vendors can manage their own KYC documents" ON public.vendor_kyc_documents FOR ALL USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Vendors can manage their own store" ON public.vendor_stores FOR ALL USING (vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "Public can view active stores" ON public.vendor_stores FOR SELECT USING (is_active = true OR vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Public can view vendor tiers" ON public.vendor_tiers FOR SELECT USING (true);
CREATE POLICY "Admin can manage vendor tiers" ON public.vendor_tiers FOR ALL USING (is_admin_user());

CREATE POLICY "Vendors can view their performance analytics" ON public.vendor_performance_analytics FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "System can manage vendor analytics" ON public.vendor_performance_analytics FOR ALL USING (is_admin_user());

CREATE POLICY "Vendors can view their compliance" ON public.vendor_compliance FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "Admin can manage vendor compliance" ON public.vendor_compliance FOR ALL USING (is_admin_user());

CREATE POLICY "Public can view document templates" ON public.vendor_document_templates FOR SELECT USING (true);
CREATE POLICY "Admin can manage document templates" ON public.vendor_document_templates FOR ALL USING (is_admin_user());

CREATE POLICY "Vendors can view their verification workflow" ON public.vendor_verification_workflow FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "Admin can manage verification workflow" ON public.vendor_verification_workflow FOR ALL USING (is_admin_user());

-- Create indexes for performance
CREATE INDEX idx_vendor_kyc_documents_vendor_id ON public.vendor_kyc_documents(vendor_id);
CREATE INDEX idx_vendor_kyc_documents_type_status ON public.vendor_kyc_documents(document_type, verification_status);
CREATE INDEX idx_vendor_stores_vendor_id ON public.vendor_stores(vendor_id);
CREATE INDEX idx_vendor_stores_slug ON public.vendor_stores(store_slug);
CREATE INDEX idx_vendor_performance_vendor_date ON public.vendor_performance_analytics(vendor_id, analytics_date);
CREATE INDEX idx_vendor_compliance_vendor_type ON public.vendor_compliance(vendor_id, compliance_type);
CREATE INDEX idx_vendor_verification_workflow_vendor ON public.vendor_verification_workflow(vendor_id, step_order);

-- Create triggers for updated_at
CREATE TRIGGER update_vendor_kyc_documents_updated_at BEFORE UPDATE ON public.vendor_kyc_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendor_stores_updated_at BEFORE UPDATE ON public.vendor_stores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendor_compliance_updated_at BEFORE UPDATE ON public.vendor_compliance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendor_document_templates_updated_at BEFORE UPDATE ON public.vendor_document_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendor_verification_workflow_updated_at BEFORE UPDATE ON public.vendor_verification_workflow FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();