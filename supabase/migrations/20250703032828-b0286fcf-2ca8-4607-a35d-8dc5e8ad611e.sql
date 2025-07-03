-- Create comprehensive Amazon/Shopee-level Order Management System

-- Enhanced Orders table with comprehensive fields
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;

CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'processing', 'picked', 'packed', 'shipped', 
  'out_for_delivery', 'delivered', 'partially_delivered', 'cancelled', 
  'returned', 'refunded', 'disputed', 'on_hold'
);

CREATE TYPE payment_method AS ENUM (
  'cash_on_delivery', 'bkash', 'nagad', 'rocket', 'upay', 'tap', 
  'card', 'bank_transfer', 'wallet', 'installment', 'bnpl'
);

-- Update orders table to match Amazon/Shopee standards
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS parent_order_id UUID REFERENCES public.orders(id),
ADD COLUMN IF NOT EXISTS vendor_id UUID,
ADD COLUMN IF NOT EXISTS fulfillment_type TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS priority_level TEXT DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS gift_message TEXT,
ADD COLUMN IF NOT EXISTS special_instructions TEXT,
ADD COLUMN IF NOT EXISTS delivery_window JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cod_fee NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS insurance_fee NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS packaging_instructions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS order_source TEXT DEFAULT 'web',
ADD COLUMN IF NOT EXISTS referral_code TEXT,
ADD COLUMN IF NOT EXISTS promotion_codes JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS tax_breakdown JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS shipping_breakdown JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS weight_total NUMERIC(8,3),
ADD COLUMN IF NOT EXISTS dimensions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancelled_by UUID,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS refund_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS return_window_expires DATE,
ADD COLUMN IF NOT EXISTS invoice_number TEXT,
ADD COLUMN IF NOT EXISTS receipt_url TEXT,
ADD COLUMN IF NOT EXISTS customer_ip INET,
ADD COLUMN IF NOT EXISTS customer_user_agent TEXT,
ADD COLUMN IF NOT EXISTS risk_score NUMERIC(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS fraud_check_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS delivery_instructions TEXT,
ADD COLUMN IF NOT EXISTS preferred_delivery_time TEXT,
ADD COLUMN IF NOT EXISTS contact_person TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS alternate_phone TEXT,
ADD COLUMN IF NOT EXISTS landmark TEXT,
ADD COLUMN IF NOT EXISTS delivery_fee_breakdown JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS packaging_type TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS eco_friendly_packaging BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_adult_signature BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS express_delivery BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS same_day_delivery BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS scheduled_delivery_date DATE,
ADD COLUMN IF NOT EXISTS delivery_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_delivery_attempts INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS last_delivery_attempt TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS pickup_location_id UUID,
ADD COLUMN IF NOT EXISTS is_gift BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gift_wrap_type TEXT,
ADD COLUMN IF NOT EXISTS gift_receipt BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS loyalty_points_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS loyalty_points_earned INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS cashback_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS order_tags JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS customer_rating INTEGER,
ADD COLUMN IF NOT EXISTS customer_feedback TEXT,
ADD COLUMN IF NOT EXISTS delivery_rating INTEGER,
ADD COLUMN IF NOT EXISTS delivery_feedback TEXT,
ADD COLUMN IF NOT EXISTS exchange_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS return_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS warranty_period INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS installation_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS installation_scheduled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS customs_declaration JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS hs_code TEXT,
ADD COLUMN IF NOT EXISTS import_duties NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS export_documentation JSONB DEFAULT '{}';

-- Add constraints and indexes
ALTER TABLE public.orders ALTER COLUMN status TYPE order_status USING status::order_status;
ALTER TABLE public.orders ALTER COLUMN payment_method TYPE payment_method USING payment_method::payment_method;

CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON public.orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_parent_order_id ON public.orders(parent_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON public.orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON public.orders(scheduled_delivery_date);
CREATE INDEX IF NOT EXISTS idx_orders_fraud_score ON public.orders(fraud_check_status, risk_score);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment ON public.orders(fulfillment_type, priority_level);

-- Enhanced order items with vendor-specific data
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS barcode TEXT,
ADD COLUMN IF NOT EXISTS product_name TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS product_description TEXT,
ADD COLUMN IF NOT EXISTS product_images JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS variant_options JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS unit_weight NUMERIC(8,3),
ADD COLUMN IF NOT EXISTS unit_dimensions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_type TEXT,
ADD COLUMN IF NOT EXISTS discount_value NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_required BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS digital_delivery BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS download_url TEXT,
ADD COLUMN IF NOT EXISTS license_key TEXT,
ADD COLUMN IF NOT EXISTS activation_code TEXT,
ADD COLUMN IF NOT EXISTS personalization_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gift_wrap_fee NUMERIC(8,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS installation_fee NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS warranty_fee NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS insurance_fee NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS handling_fee NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS commission_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS vendor_payout_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS fulfillment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS return_reason TEXT,
ADD COLUMN IF NOT EXISTS return_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS exchange_item_id UUID,
ADD COLUMN IF NOT EXISTS quality_check_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS quality_check_notes TEXT,
ADD COLUMN IF NOT EXISTS packaging_notes TEXT,
ADD COLUMN IF NOT EXISTS special_handling JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS expiry_date DATE,
ADD COLUMN IF NOT EXISTS batch_number TEXT,
ADD COLUMN IF NOT EXISTS manufacturing_date DATE,
ADD COLUMN IF NOT EXISTS country_of_origin TEXT,
ADD COLUMN IF NOT EXISTS customs_value NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS restricted_shipping JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS dangerous_goods BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fragile_item BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS temperature_controlled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS storage_requirements JSONB DEFAULT '{}';

-- Create vendor orders table for multi-vendor splitting
CREATE TABLE IF NOT EXISTS public.vendor_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL,
  vendor_order_number TEXT UNIQUE NOT NULL,
  status order_status DEFAULT 'pending',
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

-- Create shipping zones table
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
  from_status order_status NOT NULL,
  to_status order_status NOT NULL,
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
  invoice_number TEXT UNIQUE NOT NULL,
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

-- Create COD management table
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

-- Create order timeline/audit table
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

-- Create order promotions table
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

-- Create indexes for performance
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

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Enable RLS and create policies
ALTER TABLE public.vendor_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_state_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cod_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_promotions ENABLE ROW LEVEL SECURITY;

-- Vendor orders policies
CREATE POLICY "Vendors can view their orders" ON public.vendor_orders FOR SELECT 
USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Vendors can update their orders" ON public.vendor_orders FOR UPDATE 
USING (vendor_id = auth.uid() OR is_admin_user());

-- Customers can view their orders through parent order
CREATE POLICY "Customers can view vendor orders" ON public.vendor_orders FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.orders WHERE id = parent_order_id AND customer_id = auth.uid()));

-- Admin policies for all tables
CREATE POLICY "Admin full access vendor_orders" ON public.vendor_orders FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access shipping_zones" ON public.shipping_zones FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access order_state_transitions" ON public.order_state_transitions FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access order_calculations" ON public.order_calculations FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access order_return_requests" ON public.order_return_requests FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access order_invoices" ON public.order_invoices FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access cod_management" ON public.cod_management FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access order_timeline" ON public.order_timeline FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access order_promotions" ON public.order_promotions FOR ALL USING (is_admin_user());

-- Public read access for shipping zones
CREATE POLICY "Public can view shipping zones" ON public.shipping_zones FOR SELECT USING (is_active = true);

-- Return requests policies
CREATE POLICY "Customers can manage their returns" ON public.order_return_requests FOR ALL 
USING (customer_id = auth.uid());

-- Order timeline visibility
CREATE POLICY "Customers can view order timeline" ON public.order_timeline FOR SELECT 
USING (customer_visible = true AND EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND customer_id = auth.uid()));

CREATE POLICY "Vendors can view order timeline" ON public.order_timeline FOR SELECT 
USING (vendor_visible = true AND EXISTS (SELECT 1 FROM public.vendor_orders WHERE parent_order_id = order_id AND vendor_id = auth.uid()));

-- COD management policies
CREATE POLICY "Customers can view their COD details" ON public.cod_management FOR SELECT 
USING (customer_id = auth.uid());

-- Order invoices policies  
CREATE POLICY "Customers can view their invoices" ON public.order_invoices FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND customer_id = auth.uid()));

CREATE POLICY "Vendors can view their invoices" ON public.order_invoices FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.vendor_orders WHERE id = vendor_order_id AND vendor_id = auth.uid()));

-- Order promotions policies
CREATE POLICY "Customers can view order promotions" ON public.order_promotions FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND customer_id = auth.uid()));

-- Create order number generation function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create vendor order number generation function  
CREATE OR REPLACE FUNCTION public.generate_vendor_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.vendor_order_number IS NULL THEN
        NEW.vendor_order_number = 'VND-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create invoice number generation function
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL THEN
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

-- Create order timeline trigger
CREATE OR REPLACE FUNCTION public.log_order_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Log status changes
    IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO public.order_timeline (
            order_id, event_type, event_description, old_values, new_values, triggered_by, automated
        ) VALUES (
            NEW.id, 'status_change', 
            'Order status changed from ' || OLD.status || ' to ' || NEW.status,
            jsonb_build_object('status', OLD.status),
            jsonb_build_object('status', NEW.status),
            auth.uid(), false
        );
    END IF;
    
    -- Log payment status changes
    IF (TG_OP = 'UPDATE' AND OLD.payment_status IS DISTINCT FROM NEW.payment_status) THEN
        INSERT INTO public.order_timeline (
            order_id, event_type, event_description, old_values, new_values, triggered_by, automated
        ) VALUES (
            NEW.id, 'payment_status_change',
            'Payment status changed from ' || OLD.payment_status || ' to ' || NEW.payment_status,
            jsonb_build_object('payment_status', OLD.payment_status),
            jsonb_build_object('payment_status', NEW.payment_status),
            auth.uid(), false
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_order_changes_trigger AFTER UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.log_order_changes();