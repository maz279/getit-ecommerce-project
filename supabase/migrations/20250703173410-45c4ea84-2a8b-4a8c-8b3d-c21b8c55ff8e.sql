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