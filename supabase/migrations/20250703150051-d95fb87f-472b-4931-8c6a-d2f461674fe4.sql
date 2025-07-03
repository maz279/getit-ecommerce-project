-- Comprehensive Shipping Service Database Schema
-- This migration creates all necessary tables for a full-featured shipping service

-- Main shipments table
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_number TEXT NOT NULL UNIQUE,
  order_id UUID NOT NULL,
  vendor_id UUID,
  courier_partner_id UUID,
  service_type TEXT NOT NULL DEFAULT 'standard',
  status TEXT NOT NULL DEFAULT 'pending',
  tracking_number TEXT UNIQUE,
  pickup_address JSONB NOT NULL,
  delivery_address JSONB NOT NULL,
  package_details JSONB NOT NULL,
  weight_kg DECIMAL(10,2) NOT NULL,
  dimensions JSONB,
  declared_value DECIMAL(10,2),
  shipping_cost DECIMAL(10,2),
  cod_amount DECIMAL(10,2),
  pickup_date DATE,
  delivery_date DATE,
  estimated_delivery DATE,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Shipping rates configuration
CREATE TABLE IF NOT EXISTS public.shipping_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  courier_partner_id UUID,
  zone_from TEXT NOT NULL,
  zone_to TEXT NOT NULL,
  service_type TEXT NOT NULL,
  weight_from DECIMAL(10,2) NOT NULL DEFAULT 0,
  weight_to DECIMAL(10,2) NOT NULL,
  base_rate DECIMAL(10,2) NOT NULL,
  per_kg_rate DECIMAL(10,2) DEFAULT 0,
  cod_charge DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_to DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Courier partners table
CREATE TABLE IF NOT EXISTS public.courier_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('local', 'international', 'express')),
  country TEXT DEFAULT 'Bangladesh',
  api_config JSONB DEFAULT '{}',
  webhook_config JSONB DEFAULT '{}',
  coverage_areas JSONB DEFAULT '[]',
  services JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  api_credentials_encrypted TEXT,
  rate_card JSONB DEFAULT '{}',
  sla_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tracking information table
CREATE TABLE IF NOT EXISTS public.tracking_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id),
  tracking_number TEXT NOT NULL,
  status TEXT NOT NULL,
  status_description TEXT,
  location TEXT,
  coordinates JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  courier_status TEXT,
  delivery_attempt INTEGER DEFAULT 0,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- COD transactions table
CREATE TABLE IF NOT EXISTS public.cod_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id),
  order_id UUID NOT NULL,
  vendor_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  collection_status TEXT NOT NULL DEFAULT 'pending',
  collection_date DATE,
  settlement_status TEXT NOT NULL DEFAULT 'pending',
  settlement_date DATE,
  settlement_amount DECIMAL(10,2),
  commission DECIMAL(10,2),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Pickup requests table
CREATE TABLE IF NOT EXISTS public.pickup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id),
  vendor_id UUID,
  pickup_address JSONB NOT NULL,
  preferred_time_slot TEXT,
  pickup_date DATE,
  status TEXT NOT NULL DEFAULT 'requested',
  assigned_courier TEXT,
  pickup_instructions TEXT,
  actual_pickup_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Delivery attempts table
CREATE TABLE IF NOT EXISTS public.delivery_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id),
  attempt_number INTEGER NOT NULL DEFAULT 1,
  delivery_date DATE,
  delivery_time_slot TEXT,
  status TEXT NOT NULL,
  failure_reason TEXT,
  recipient_name TEXT,
  recipient_phone TEXT,
  delivery_notes TEXT,
  signature_required BOOLEAN DEFAULT false,
  signature_captured TEXT,
  photo_proof TEXT,
  location JSONB,
  next_attempt_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Shipping addresses table
CREATE TABLE IF NOT EXISTS public.shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  address_type TEXT NOT NULL CHECK (address_type IN ('pickup', 'delivery')),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  division TEXT NOT NULL,
  postal_code TEXT,
  country TEXT DEFAULT 'Bangladesh',
  landmark TEXT,
  coordinates JSONB,
  is_default BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bangladesh shipping zones
CREATE TABLE IF NOT EXISTS public.bangladesh_shipping_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_code TEXT NOT NULL UNIQUE,
  zone_name TEXT NOT NULL,
  zone_type TEXT NOT NULL CHECK (zone_type IN ('metro', 'city', 'town', 'rural')),
  division TEXT NOT NULL,
  districts JSONB DEFAULT '[]',
  upazilas JSONB DEFAULT '[]',
  delivery_time_hours INTEGER DEFAULT 48,
  is_cod_available BOOLEAN DEFAULT true,
  is_same_day_available BOOLEAN DEFAULT false,
  coverage_percentage DECIMAL(5,2) DEFAULT 100.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Delivery performance metrics
CREATE TABLE IF NOT EXISTS public.delivery_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  courier_partner_id UUID REFERENCES public.courier_partners(id),
  zone_code TEXT,
  service_type TEXT,
  date DATE DEFAULT CURRENT_DATE,
  total_shipments INTEGER DEFAULT 0,
  on_time_deliveries INTEGER DEFAULT 0,
  failed_deliveries INTEGER DEFAULT 0,
  average_delivery_time_hours DECIMAL(10,2),
  customer_satisfaction_score DECIMAL(3,2),
  cod_collection_rate DECIMAL(5,2),
  return_rate DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Shipping service events for audit and tracking
CREATE TABLE IF NOT EXISTS public.shipping_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES public.shipments(id),
  event_type TEXT NOT NULL,
  event_description TEXT,
  source TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON public.shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON public.shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_vendor_id ON public.shipments(vendor_id);
CREATE INDEX IF NOT EXISTS idx_tracking_info_shipment_id ON public.tracking_info(shipment_id);
CREATE INDEX IF NOT EXISTS idx_tracking_info_tracking_number ON public.tracking_info(tracking_number);
CREATE INDEX IF NOT EXISTS idx_cod_transactions_shipment_id ON public.cod_transactions(shipment_id);
CREATE INDEX IF NOT EXISTS idx_delivery_attempts_shipment_id ON public.delivery_attempts(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user_id ON public.shipping_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_performance_date ON public.delivery_performance(date);

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