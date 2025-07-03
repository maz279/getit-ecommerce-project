-- Create remaining Amazon/Shopee-level Order Management tables and functions

-- Create vendor orders table for multi-vendor splitting
CREATE TABLE IF NOT EXISTS public.vendor_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL,
  vendor_order_number TEXT UNIQUE NOT NULL DEFAULT '',
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  fulfillment_status TEXT DEFAULT 'pending',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12,2) DEFAULT 0,
  shipping_amount NUMERIC(12,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  commission_amount NUMERIC(12,2) DEFAULT 0,
  vendor_payout_amount NUMERIC(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'BDT',
  shipping_address JSONB NOT NULL DEFAULT '{}',
  vendor_notes TEXT,
  customer_notes TEXT,
  estimated_delivery DATE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  tracking_number TEXT,
  carrier TEXT,
  packaging_type TEXT DEFAULT 'standard',
  weight_total NUMERIC(8,3),
  dimensions JSONB DEFAULT '{}',
  invoice_generated BOOLEAN DEFAULT false,
  invoice_url TEXT,
  payment_due_date DATE,
  payment_terms TEXT DEFAULT 'net_7',
  fulfillment_center_id UUID,
  priority_level TEXT DEFAULT 'normal',
  special_instructions TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create shipping zones table for Bangladesh
CREATE TABLE IF NOT EXISTS public.shipping_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name TEXT NOT NULL,
  zone_code TEXT UNIQUE NOT NULL,
  country TEXT NOT NULL DEFAULT 'Bangladesh',
  regions JSONB NOT NULL DEFAULT '[]',
  cities JSONB NOT NULL DEFAULT '[]',
  postal_codes JSONB DEFAULT '[]',
  delivery_time_min INTEGER NOT NULL DEFAULT 1,
  delivery_time_max INTEGER NOT NULL DEFAULT 7,
  base_shipping_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  per_kg_rate NUMERIC(8,2) DEFAULT 0,
  cod_available BOOLEAN DEFAULT true,
  cod_fee_rate NUMERIC(5,2) DEFAULT 0,
  same_day_available BOOLEAN DEFAULT false,
  same_day_fee NUMERIC(10,2) DEFAULT 0,
  express_available BOOLEAN DEFAULT false,
  express_fee NUMERIC(10,2) DEFAULT 0,
  free_shipping_threshold NUMERIC(10,2),
  restrictions JSONB DEFAULT '{}',
  carriers JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order state machine table
CREATE TABLE IF NOT EXISTS public.order_state_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  conditions JSONB DEFAULT '{}',
  automation_rules JSONB DEFAULT '{}',
  notification_rules JSONB DEFAULT '{}',
  is_reversible BOOLEAN DEFAULT false,
  requires_approval BOOLEAN DEFAULT false,
  approval_roles JSONB DEFAULT '[]',
  business_rules JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(from_status, to_status)
);

-- Create order calculations table for complex pricing
CREATE TABLE IF NOT EXISTS public.order_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  calculation_type TEXT NOT NULL,
  base_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  adjustments JSONB NOT NULL DEFAULT '[]',
  discounts JSONB NOT NULL DEFAULT '[]',
  taxes JSONB NOT NULL DEFAULT '[]',
  fees JSONB NOT NULL DEFAULT '[]',
  final_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  calculation_metadata JSONB DEFAULT '{}',
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  recalculation_reason TEXT,
  version INTEGER DEFAULT 1
);

-- Create order return requests table
CREATE TABLE IF NOT EXISTS public.order_return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  order_item_id UUID REFERENCES public.order_items(id),
  customer_id UUID NOT NULL,
  return_type TEXT NOT NULL DEFAULT 'return',
  return_reason TEXT NOT NULL,
  return_description TEXT,
  quantity_to_return INTEGER NOT NULL DEFAULT 1,
  refund_amount NUMERIC(10,2),
  replacement_item_id UUID,
  status TEXT DEFAULT 'requested',
  images JSONB DEFAULT '[]',
  video_url TEXT,
  quality_issues JSONB DEFAULT '{}',
  return_shipping_label_url TEXT,
  return_tracking_number TEXT,
  return_carrier TEXT,
  warehouse_received_at TIMESTAMP WITH TIME ZONE,
  quality_check_status TEXT DEFAULT 'pending',
  quality_check_notes TEXT,
  quality_check_images JSONB DEFAULT '[]',
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejected_by UUID,
  rejection_reason TEXT,
  refund_processed_at TIMESTAMP WITH TIME ZONE,
  refund_method TEXT,
  refund_reference TEXT,
  restocking_fee NUMERIC(8,2) DEFAULT 0,
  return_shipping_fee NUMERIC(8,2) DEFAULT 0,
  customer_rating INTEGER,
  customer_feedback TEXT,
  internal_notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order invoices table
CREATE TABLE IF NOT EXISTS public.order_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  vendor_order_id UUID REFERENCES public.vendor_orders(id),
  invoice_number TEXT UNIQUE NOT NULL DEFAULT '',
  invoice_type TEXT NOT NULL DEFAULT 'sales',
  status TEXT DEFAULT 'draft',
  customer_details JSONB NOT NULL DEFAULT '{}',
  vendor_details JSONB NOT NULL DEFAULT '{}',
  billing_address JSONB NOT NULL DEFAULT '{}',
  shipping_address JSONB DEFAULT '{}',
  line_items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_details JSONB NOT NULL DEFAULT '{}',
  total_tax NUMERIC(12,2) DEFAULT 0,
  discount_details JSONB DEFAULT '{}',
  total_discount NUMERIC(12,2) DEFAULT 0,
  shipping_details JSONB DEFAULT '{}',
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'BDT',
  payment_terms TEXT DEFAULT 'immediate',
  due_date DATE,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  pdf_url TEXT,
  sent_to_customer BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  payment_received BOOLEAN DEFAULT false,
  payment_received_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  footer_text TEXT,
  template_used TEXT DEFAULT 'standard',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create COD management table for Bangladesh market
CREATE TABLE IF NOT EXISTS public.cod_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  customer_id UUID NOT NULL,
  cod_amount NUMERIC(12,2) NOT NULL,
  cod_fee NUMERIC(8,2) DEFAULT 0,
  total_collection_amount NUMERIC(12,2) NOT NULL,
  delivery_agent_id UUID,
  collection_status TEXT DEFAULT 'pending',
  attempted_collections INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  collection_date DATE,
  collection_time TIME,
  collection_method TEXT,
  collection_reference TEXT,
  customer_verification_method TEXT,
  verification_status TEXT DEFAULT 'pending',
  fraud_check_score NUMERIC(5,2) DEFAULT 0,
  fraud_indicators JSONB DEFAULT '[]',
  cash_denominations JSONB DEFAULT '{}',
  change_given NUMERIC(8,2) DEFAULT 0,
  collection_notes TEXT,
  customer_signature_url TEXT,
  photo_evidence_url TEXT,
  location_coordinates JSONB DEFAULT '{}',
  collection_address JSONB DEFAULT '{}',
  remittance_status TEXT DEFAULT 'pending',
  remitted_at TIMESTAMP WITH TIME ZONE,
  remitted_amount NUMERIC(12,2),
  bank_deposit_reference TEXT,
  reconciliation_status TEXT DEFAULT 'pending',
  reconciled_at TIMESTAMP WITH TIME ZONE,
  discrepancy_amount NUMERIC(8,2) DEFAULT 0,
  discrepancy_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order timeline/audit table for complete tracking
CREATE TABLE IF NOT EXISTS public.order_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  event_type TEXT NOT NULL,
  event_description TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  old_values JSONB DEFAULT '{}',
  new_values JSONB DEFAULT '{}',
  triggered_by UUID,
  triggered_by_type TEXT DEFAULT 'user',
  location_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  api_source TEXT,
  automated BOOLEAN DEFAULT false,
  notification_sent BOOLEAN DEFAULT false,
  customer_visible BOOLEAN DEFAULT true,
  vendor_visible BOOLEAN DEFAULT true,
  admin_visible BOOLEAN DEFAULT true,
  tags JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order promotions table for advanced promotions
CREATE TABLE IF NOT EXISTS public.order_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  promotion_code TEXT,
  promotion_type TEXT NOT NULL,
  promotion_name TEXT NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC(10,2) NOT NULL,
  discount_amount NUMERIC(10,2) NOT NULL,
  minimum_order_value NUMERIC(10,2),
  maximum_discount NUMERIC(10,2),
  applicable_products JSONB DEFAULT '[]',
  applicable_categories JSONB DEFAULT '[]',
  applicable_vendors JSONB DEFAULT '[]',
  cashback_amount NUMERIC(8,2) DEFAULT 0,
  loyalty_points_awarded INTEGER DEFAULT 0,
  free_shipping BOOLEAN DEFAULT false,
  gift_with_purchase JSONB DEFAULT '{}',
  promotion_metadata JSONB DEFAULT '{}',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default state transitions
INSERT INTO public.order_state_transitions (from_status, to_status, conditions, automation_rules, notification_rules, is_reversible) VALUES
('pending', 'confirmed', '{"payment_verified": true}', '{"auto_confirm": true}', '{"customer": true, "vendor": true}', false),
('confirmed', 'processing', '{"inventory_available": true}', '{"auto_process": true}', '{"customer": true, "vendor": true}', false),
('processing', 'picked', '{"all_items_picked": true}', '{"auto_pick": false}', '{"vendor": true}', false),
('picked', 'packed', '{"all_items_packed": true}', '{"auto_pack": false}', '{"vendor": true}', false),
('packed', 'shipped', '{"shipping_label_created": true}', '{"auto_ship": false}', '{"customer": true, "vendor": true}', false),
('shipped', 'out_for_delivery', '{"with_delivery_partner": true}', '{"auto_update": true}', '{"customer": true}', false),
('out_for_delivery', 'delivered', '{"delivery_confirmed": true}', '{"auto_complete": false}', '{"customer": true, "vendor": true}', false),
('pending', 'cancelled', '{"cancellable": true}', '{"auto_cancel": false}', '{"customer": true, "vendor": true}', false),
('confirmed', 'cancelled', '{"cancellable": true}', '{"auto_cancel": false}', '{"customer": true, "vendor": true}', false),
('delivered', 'returned', '{"return_eligible": true}', '{"auto_return": false}', '{"customer": true, "vendor": true}', false)
ON CONFLICT (from_status, to_status) DO NOTHING;

-- Insert Bangladesh shipping zones
INSERT INTO public.shipping_zones (zone_name, zone_code, regions, cities, delivery_time_min, delivery_time_max, base_shipping_rate, cod_available, same_day_available, express_available) VALUES
('Dhaka Metro', 'DHA', '["Dhaka"]', '["Dhaka", "Gazipur", "Narayanganj", "Savar", "Tongi"]', 1, 2, 60.00, true, true, true),
('Chittagong Metro', 'CTG', '["Chittagong"]', '["Chittagong", "Cox''s Bazar", "Comilla"]', 2, 3, 80.00, true, false, true),
('Sylhet Division', 'SYL', '["Sylhet"]', '["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"]', 3, 5, 100.00, true, false, false),
('Rajshahi Division', 'RAJ', '["Rajshahi"]', '["Rajshahi", "Rangpur", "Bogra", "Pabna"]', 3, 5, 100.00, true, false, false),
('Khulna Division', 'KHU', '["Khulna"]', '["Khulna", "Jessore", "Kushtia", "Satkhira"]', 3, 5, 100.00, true, false, false),
('Barisal Division', 'BAR', '["Barisal"]', '["Barisal", "Patuakhali", "Pirojpur", "Jhalokati"]', 4, 7, 120.00, true, false, false),
('Mymensingh Division', 'MYM', '["Mymensingh"]', '["Mymensingh", "Jamalpur", "Sherpur", "Netrokona"]', 3, 5, 100.00, true, false, false)
ON CONFLICT (zone_code) DO NOTHING;

-- Create performance indexes for all tables
CREATE INDEX IF NOT EXISTS idx_vendor_orders_parent_order ON public.vendor_orders(parent_order_id);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_vendor ON public.vendor_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_status ON public.vendor_orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_order_timeline_order ON public.order_timeline(order_id, created_at);
CREATE INDEX IF NOT EXISTS idx_order_timeline_event ON public.order_timeline(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_cod_management_order ON public.cod_management(order_id);
CREATE INDEX IF NOT EXISTS idx_cod_management_status ON public.cod_management(collection_status, collection_date);
CREATE INDEX IF NOT EXISTS idx_return_requests_order ON public.order_return_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_customer ON public.order_return_requests(customer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_order_invoices_order ON public.order_invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_order_invoices_number ON public.order_invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_order_promotions_order ON public.order_promotions(order_id);
CREATE INDEX IF NOT EXISTS idx_shipping_zones_regions ON public.shipping_zones USING GIN(regions);
CREATE INDEX IF NOT EXISTS idx_shipping_zones_cities ON public.shipping_zones USING GIN(cities);

-- Create sequence for order numbering if not exists
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Create vendor order number generation function
CREATE OR REPLACE FUNCTION public.generate_vendor_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.vendor_order_number IS NULL OR NEW.vendor_order_number = '' THEN
        NEW.vendor_order_number = 'VND-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create invoice number generation function
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number = 'INV-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for number generation
CREATE TRIGGER generate_vendor_order_number_trigger BEFORE INSERT ON public.vendor_orders
    FOR EACH ROW EXECUTE FUNCTION public.generate_vendor_order_number();

CREATE TRIGGER generate_invoice_number_trigger BEFORE INSERT ON public.order_invoices
    FOR EACH ROW EXECUTE FUNCTION public.generate_invoice_number();

-- Create triggers for updated_at columns
CREATE TRIGGER update_vendor_orders_updated_at BEFORE UPDATE ON public.vendor_orders 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shipping_zones_updated_at BEFORE UPDATE ON public.shipping_zones 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_return_requests_updated_at BEFORE UPDATE ON public.order_return_requests 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_order_invoices_updated_at BEFORE UPDATE ON public.order_invoices 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cod_management_updated_at BEFORE UPDATE ON public.cod_management 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();