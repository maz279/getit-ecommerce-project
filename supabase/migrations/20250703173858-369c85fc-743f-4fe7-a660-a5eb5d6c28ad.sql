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