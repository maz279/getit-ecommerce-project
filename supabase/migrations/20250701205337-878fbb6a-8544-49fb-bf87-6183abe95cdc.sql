-- Multi-vendor marketplace logistics and fulfillment system

-- Fulfillment centers table
CREATE TABLE public.fulfillment_centers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address JSONB NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 0,
  current_utilization INTEGER NOT NULL DEFAULT 0,
  operational_hours JSONB DEFAULT '{"monday": "9:00-18:00", "tuesday": "9:00-18:00", "wednesday": "9:00-18:00", "thursday": "9:00-18:00", "friday": "9:00-18:00", "saturday": "9:00-16:00", "sunday": "closed"}',
  status TEXT NOT NULL DEFAULT 'active',
  contact_info JSONB DEFAULT '{}',
  capabilities JSONB DEFAULT '["storage", "picking", "packing", "shipping"]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inventory management table
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  fulfillment_center_id UUID REFERENCES public.fulfillment_centers(id),
  sku TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  reserved_stock INTEGER NOT NULL DEFAULT 0,
  available_stock INTEGER GENERATED ALWAYS AS (current_stock - reserved_stock) STORED,
  minimum_stock_level INTEGER NOT NULL DEFAULT 10,
  maximum_stock_level INTEGER NOT NULL DEFAULT 1000,
  reorder_point INTEGER NOT NULL DEFAULT 20,
  reorder_quantity INTEGER NOT NULL DEFAULT 100,
  cost_per_unit NUMERIC(10,2) NOT NULL DEFAULT 0,
  last_restocked_at TIMESTAMP WITH TIME ZONE,
  forecast_demand JSONB DEFAULT '{}',
  storage_location TEXT,
  batch_number TEXT,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, vendor_id, fulfillment_center_id)
);

-- Stock alerts table
CREATE TABLE public.stock_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_id UUID NOT NULL REFERENCES public.inventory(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'overstock', 'expiry_warning')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  threshold_value INTEGER,
  current_value INTEGER,
  is_acknowledged BOOLEAN NOT NULL DEFAULT false,
  acknowledged_by UUID,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inventory movements table
CREATE TABLE public.inventory_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_id UUID NOT NULL REFERENCES public.inventory(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('inbound', 'outbound', 'transfer', 'adjustment', 'return')),
  quantity INTEGER NOT NULL,
  reference_type TEXT, -- 'order', 'purchase', 'transfer', 'adjustment'
  reference_id UUID,
  cost_per_unit NUMERIC(10,2),
  total_cost NUMERIC(10,2),
  reason TEXT,
  performed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Order fulfillment pipeline
CREATE TABLE public.order_fulfillment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  fulfillment_center_id UUID NOT NULL REFERENCES public.fulfillment_centers(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'allocated', 'picking', 'picked', 'packing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned')),
  priority_level TEXT NOT NULL DEFAULT 'normal' CHECK (priority_level IN ('low', 'normal', 'high', 'urgent')),
  allocated_at TIMESTAMP WITH TIME ZONE,
  picking_started_at TIMESTAMP WITH TIME ZONE,
  picked_at TIMESTAMP WITH TIME ZONE,
  packing_started_at TIMESTAMP WITH TIME ZONE,
  packed_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  assigned_picker UUID,
  assigned_packer UUID,
  tracking_number TEXT,
  shipping_carrier TEXT,
  shipping_method TEXT,
  shipping_cost NUMERIC(10,2),
  notes JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fulfillment workflow steps
CREATE TABLE public.fulfillment_workflow_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_fulfillment_id UUID NOT NULL REFERENCES public.order_fulfillment(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  assigned_to UUID,
  instructions TEXT,
  result_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Pick lists for warehouse operations
CREATE TABLE public.pick_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fulfillment_center_id UUID NOT NULL REFERENCES public.fulfillment_centers(id),
  picker_id UUID,
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'assigned', 'in_progress', 'completed', 'cancelled')),
  priority_level TEXT NOT NULL DEFAULT 'normal' CHECK (priority_level IN ('low', 'normal', 'high', 'urgent')),
  estimated_completion_time TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  total_items INTEGER NOT NULL DEFAULT 0,
  picked_items INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Pick list items
CREATE TABLE public.pick_list_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pick_list_id UUID NOT NULL REFERENCES public.pick_lists(id) ON DELETE CASCADE,
  order_fulfillment_id UUID NOT NULL REFERENCES public.order_fulfillment(id),
  inventory_id UUID NOT NULL REFERENCES public.inventory(id),
  quantity_requested INTEGER NOT NULL,
  quantity_picked INTEGER NOT NULL DEFAULT 0,
  storage_location TEXT,
  pick_sequence INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'picked', 'not_found', 'damaged')),
  notes TEXT,
  picked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced payment processing
CREATE TABLE public.payment_gateways (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'stripe', 'bkash', 'nagad', 'rocket', 'bank_transfer'
  is_active BOOLEAN NOT NULL DEFAULT true,
  configuration JSONB NOT NULL DEFAULT '{}',
  supported_currencies JSONB DEFAULT '["BDT", "USD"]',
  transaction_fee_percentage NUMERIC(5,2) DEFAULT 0,
  transaction_fee_fixed NUMERIC(10,2) DEFAULT 0,
  minimum_amount NUMERIC(10,2) DEFAULT 0,
  maximum_amount NUMERIC(10,2),
  processing_time_hours INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payment transactions table
CREATE TABLE public.payment_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id),
  payment_gateway_id UUID NOT NULL REFERENCES public.payment_gateways(id),
  transaction_id TEXT NOT NULL UNIQUE,
  gateway_transaction_id TEXT,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BDT',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded')),
  payment_method TEXT NOT NULL,
  gateway_response JSONB DEFAULT '{}',
  customer_details JSONB DEFAULT '{}',
  billing_address JSONB,
  fee_amount NUMERIC(10,2) DEFAULT 0,
  net_amount NUMERIC(10,2),
  initiated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT,
  refunded_amount NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Demand forecasting data
CREATE TABLE public.demand_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id),
  forecast_period TEXT NOT NULL, -- 'week', 'month', 'quarter'
  forecast_date DATE NOT NULL,
  predicted_demand INTEGER NOT NULL,
  confidence_score NUMERIC(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  historical_data JSONB DEFAULT '{}',
  factors_considered JSONB DEFAULT '{}',
  algorithm_version TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, vendor_id, forecast_period, forecast_date)
);

-- Enable Row Level Security
ALTER TABLE public.fulfillment_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_fulfillment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fulfillment_workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pick_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pick_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_forecasts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin can manage fulfillment centers" ON public.fulfillment_centers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(ARRAY['admin'::user_role, 'super_admin'::user_role]))
);

CREATE POLICY "Vendors can view their inventory" ON public.inventory FOR SELECT USING (
  vendor_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(ARRAY['admin'::user_role, 'super_admin'::user_role]))
);

CREATE POLICY "Admin can manage inventory" ON public.inventory FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(ARRAY['admin'::user_role, 'super_admin'::user_role]))
);

CREATE POLICY "Vendors can view their stock alerts" ON public.stock_alerts FOR SELECT USING (
  inventory_id IN (SELECT id FROM inventory WHERE vendor_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(ARRAY['admin'::user_role, 'super_admin'::user_role]))
);

CREATE POLICY "Admin can manage stock alerts" ON public.stock_alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(ARRAY['admin'::user_role, 'super_admin'::user_role]))
);

CREATE POLICY "Admin can view inventory movements" ON public.inventory_movements FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(ARRAY['admin'::user_role, 'super_admin'::user_role]))
);

CREATE POLICY "Admin can manage order fulfillment" ON public.order_fulfillment FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(ARRAY['admin'::user_role, 'super_admin'::user_role]))
);

CREATE POLICY "Warehouse staff can view fulfillment workflow" ON public.fulfillment_workflow_steps FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(ARRAY['admin'::user_role, 'vendor'::user_role, 'super_admin'::user_role]))
);

CREATE POLICY "Admin can manage pick lists" ON public.pick_lists FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(ARRAY['admin'::user_role, 'super_admin'::user_role]))
);

CREATE POLICY "Pickers can view their pick lists" ON public.pick_lists FOR SELECT USING (
  picker_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(ARRAY['admin'::user_role, 'super_admin'::user_role]))
);

CREATE POLICY "Admin can view pick list items" ON public.pick_list_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(ARRAY['admin'::user_role, 'super_admin'::user_role]))
);

CREATE POLICY "Admin can manage payment gateways" ON public.payment_gateways FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(ARRAY['admin'::user_role, 'super_admin'::user_role]))
);

CREATE POLICY "Public can view active payment gateways" ON public.payment_gateways FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their payment transactions" ON public.payment_transactions FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(ARRAY['admin'::user_role, 'super_admin'::user_role]))
);

CREATE POLICY "Admin can manage payment transactions" ON public.payment_transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(ARRAY['admin'::user_role, 'super_admin'::user_role]))
);

CREATE POLICY "Admin can view demand forecasts" ON public.demand_forecasts FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(ARRAY['admin'::user_role, 'super_admin'::user_role]))
);

-- Indexes for performance
CREATE INDEX idx_inventory_product_vendor ON public.inventory(product_id, vendor_id);
CREATE INDEX idx_inventory_stock_levels ON public.inventory(current_stock, minimum_stock_level) WHERE current_stock <= minimum_stock_level;
CREATE INDEX idx_inventory_fulfillment_center ON public.inventory(fulfillment_center_id);
CREATE INDEX idx_stock_alerts_unresolved ON public.stock_alerts(inventory_id, created_at) WHERE resolved_at IS NULL;
CREATE INDEX idx_order_fulfillment_status ON public.order_fulfillment(status, created_at);
CREATE INDEX idx_pick_lists_status_center ON public.pick_lists(fulfillment_center_id, status);
CREATE INDEX idx_payment_transactions_order ON public.payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status, created_at);

-- Triggers for automatic updates
CREATE TRIGGER update_fulfillment_centers_updated_at
  BEFORE UPDATE ON public.fulfillment_centers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_order_fulfillment_updated_at
  BEFORE UPDATE ON public.order_fulfillment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pick_lists_updated_at
  BEFORE UPDATE ON public.pick_lists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_gateways_updated_at
  BEFORE UPDATE ON public.payment_gateways
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create stock alerts automatically
CREATE OR REPLACE FUNCTION check_stock_levels()
RETURNS TRIGGER AS $$
BEGIN
  -- Check for low stock
  IF NEW.current_stock <= NEW.minimum_stock_level AND (OLD.current_stock IS NULL OR OLD.current_stock > NEW.minimum_stock_level) THEN
    INSERT INTO public.stock_alerts (inventory_id, alert_type, severity, message, threshold_value, current_value)
    VALUES (
      NEW.id,
      'low_stock',
      CASE WHEN NEW.current_stock <= NEW.minimum_stock_level * 0.5 THEN 'high' ELSE 'medium' END,
      'Stock level is below minimum threshold for ' || (SELECT name FROM products WHERE id = NEW.product_id),
      NEW.minimum_stock_level,
      NEW.current_stock
    );
  END IF;

  -- Check for out of stock
  IF NEW.current_stock = 0 AND (OLD.current_stock IS NULL OR OLD.current_stock > 0) THEN
    INSERT INTO public.stock_alerts (inventory_id, alert_type, severity, message, current_value)
    VALUES (
      NEW.id,
      'out_of_stock',
      'critical',
      'Product is out of stock: ' || (SELECT name FROM products WHERE id = NEW.product_id),
      NEW.current_stock
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_stock_levels
  AFTER UPDATE OF current_stock ON public.inventory
  FOR EACH ROW
  EXECUTE FUNCTION check_stock_levels();

-- Insert default payment gateways
INSERT INTO public.payment_gateways (name, provider, configuration, supported_currencies, transaction_fee_percentage, transaction_fee_fixed, minimum_amount) VALUES
('Stripe', 'stripe', '{"webhook_secret": "", "public_key": ""}', '["USD", "BDT"]', 2.9, 0.30, 0.50),
('bKash', 'bkash', '{"app_key": "", "app_secret": "", "username": "", "password": ""}', '["BDT"]', 1.85, 0, 10),
('Nagad', 'nagad', '{"merchant_id": "", "merchant_key": ""}', '["BDT"]', 1.99, 0, 10),
('Rocket', 'rocket', '{"merchant_id": "", "secret_key": ""}', '["BDT"]', 1.8, 0, 10),
('Bank Transfer', 'bank_transfer', '{"account_number": "", "routing_number": ""}', '["BDT", "USD"]', 0, 0, 100);

-- Insert sample fulfillment center
INSERT INTO public.fulfillment_centers (name, address, capacity, contact_info, capabilities) VALUES
('Dhaka Central Fulfillment Center', 
 '{"street": "123 Commerce Street", "city": "Dhaka", "district": "Dhaka", "postal_code": "1000", "country": "Bangladesh"}',
 10000,
 '{"phone": "+8801700000000", "email": "dhaka@fulfillment.com", "manager": "John Doe"}',
 '["storage", "picking", "packing", "shipping", "returns_processing"]');