-- Add RLS policies and triggers for shipping tables

-- Enable RLS
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cod_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bangladesh_shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Vendors can view their shipments" ON public.shipments FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "Admin can manage all shipments" ON public.shipments FOR ALL USING (is_admin_user());

CREATE POLICY "Public can view shipping rates" ON public.shipping_rates FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage shipping rates" ON public.shipping_rates FOR ALL USING (is_admin_user());

CREATE POLICY "Public can view active courier partners" ON public.courier_partners FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage courier partners" ON public.courier_partners FOR ALL USING (is_admin_user());

CREATE POLICY "Users can view tracking for their shipments" ON public.tracking_info FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.shipments s 
    WHERE s.id = tracking_info.shipment_id 
    AND (s.vendor_id = auth.uid() OR is_admin_user())
  )
);

CREATE POLICY "Vendors can view their COD transactions" ON public.cod_transactions FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "Admin can manage COD transactions" ON public.cod_transactions FOR ALL USING (is_admin_user());

CREATE POLICY "Users can manage their shipping addresses" ON public.shipping_addresses FOR ALL USING (user_id = auth.uid() OR is_admin_user());

CREATE POLICY "Public can view shipping zones" ON public.bangladesh_shipping_zones FOR SELECT USING (true);
CREATE POLICY "Admin can manage shipping zones" ON public.bangladesh_shipping_zones FOR ALL USING (is_admin_user());

CREATE POLICY "Admin can view delivery performance" ON public.delivery_performance FOR SELECT USING (is_admin_user());

CREATE POLICY "Users can view shipping events for their shipments" ON public.shipping_events FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.shipments s 
    WHERE s.id = shipping_events.shipment_id 
    AND (s.vendor_id = auth.uid() OR is_admin_user())
  )
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_shipping_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_shipments_updated_at BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.update_shipping_updated_at();
CREATE TRIGGER trg_shipping_rates_updated_at BEFORE UPDATE ON public.shipping_rates FOR EACH ROW EXECUTE FUNCTION public.update_shipping_updated_at();
CREATE TRIGGER trg_courier_partners_updated_at BEFORE UPDATE ON public.courier_partners FOR EACH ROW EXECUTE FUNCTION public.update_shipping_updated_at();
CREATE TRIGGER trg_cod_transactions_updated_at BEFORE UPDATE ON public.cod_transactions FOR EACH ROW EXECUTE FUNCTION public.update_shipping_updated_at();
CREATE TRIGGER trg_pickup_requests_updated_at BEFORE UPDATE ON public.pickup_requests FOR EACH ROW EXECUTE FUNCTION public.update_shipping_updated_at();
CREATE TRIGGER trg_shipping_addresses_updated_at BEFORE UPDATE ON public.shipping_addresses FOR EACH ROW EXECUTE FUNCTION public.update_shipping_updated_at();
CREATE TRIGGER trg_bangladesh_shipping_zones_updated_at BEFORE UPDATE ON public.bangladesh_shipping_zones FOR EACH ROW EXECUTE FUNCTION public.update_shipping_updated_at();