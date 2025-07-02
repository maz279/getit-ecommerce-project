-- Phase 1: Microservices Foundation - Database Schema
-- Service Registry for microservice discovery and health monitoring
CREATE TABLE public.microservices_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL UNIQUE,
  service_type TEXT NOT NULL, -- 'user', 'vendor', 'product', 'order', 'payment', 'shipping', 'notification', 'search', 'analytics', 'localization'
  version TEXT NOT NULL DEFAULT '1.0.0',
  endpoint_url TEXT NOT NULL,
  health_check_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'maintenance', 'degraded'
  last_health_check TIMESTAMPTZ,
  configuration JSONB NOT NULL DEFAULT '{}',
  dependencies JSONB NOT NULL DEFAULT '[]',
  resource_limits JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Configuration Management System
CREATE TABLE public.microservice_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  environment TEXT NOT NULL, -- 'development', 'staging', 'production', 'testing', 'disaster-recovery'
  config_type TEXT NOT NULL, -- 'database', 'api', 'security', 'performance', 'business'
  config_key TEXT NOT NULL,
  config_value JSONB NOT NULL,
  is_encrypted BOOLEAN NOT NULL DEFAULT false,
  is_sensitive BOOLEAN NOT NULL DEFAULT false,
  version INTEGER NOT NULL DEFAULT 1,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(service_name, environment, config_type, config_key)
);

-- Service Communication Logs for microservices interaction tracking
CREATE TABLE public.service_communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_service TEXT NOT NULL,
  target_service TEXT NOT NULL,
  operation TEXT NOT NULL,
  request_data JSONB,
  response_data JSONB,
  status_code INTEGER,
  execution_time_ms INTEGER,
  error_message TEXT,
  correlation_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Service Tables
CREATE TABLE public.user_service_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  preferences JSONB NOT NULL DEFAULT '{}',
  notification_settings JSONB NOT NULL DEFAULT '{}',
  privacy_settings JSONB NOT NULL DEFAULT '{}',
  kyc_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  account_status TEXT DEFAULT 'active', -- 'active', 'suspended', 'deleted'
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product Service Tables
CREATE TABLE public.product_service_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_path TEXT NOT NULL, -- hierarchical category path
  attributes JSONB NOT NULL DEFAULT '{}',
  variants JSONB NOT NULL DEFAULT '[]',
  media JSONB NOT NULL DEFAULT '[]',
  seo_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'inactive', 'archived'
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, sku)
);

CREATE TABLE public.product_service_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.product_service_catalog(id) ON DELETE CASCADE,
  variant_sku TEXT,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  minimum_stock_level INTEGER NOT NULL DEFAULT 0,
  reorder_point INTEGER NOT NULL DEFAULT 0,
  warehouse_location TEXT,
  cost_price NUMERIC(12,2),
  selling_price NUMERIC(12,2) NOT NULL,
  discount_price NUMERIC(12,2),
  price_history JSONB NOT NULL DEFAULT '[]',
  last_restocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order Service Tables
CREATE TABLE public.order_service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  order_type TEXT NOT NULL DEFAULT 'regular', -- 'regular', 'subscription', 'bulk', 'flash_sale'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded', 'partial'
  fulfillment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'failed'
  subtotal NUMERIC(12,2) NOT NULL,
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BDT',
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  customer_notes TEXT,
  vendor_notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.order_service_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.order_service_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  variant_sku TEXT,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  total_price NUMERIC(12,2) NOT NULL,
  vendor_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payment Service Tables
CREATE TABLE public.payment_service_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL UNIQUE,
  order_id UUID,
  customer_id UUID NOT NULL,
  vendor_id UUID,
  payment_method TEXT NOT NULL, -- 'bkash', 'nagad', 'rocket', 'stripe', 'paypal', 'bank_transfer', 'cod'
  gateway_name TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BDT',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'
  gateway_transaction_id TEXT,
  gateway_response JSONB,
  fees NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_amount NUMERIC(12,2) NOT NULL,
  processing_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  platform_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  vendor_payout NUMERIC(12,2) NOT NULL DEFAULT 0,
  failure_reason TEXT,
  refund_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  refund_status TEXT DEFAULT 'none', -- 'none', 'partial', 'full', 'pending'
  metadata JSONB NOT NULL DEFAULT '{}',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Shipping Service Tables
CREATE TABLE public.shipping_service_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name TEXT NOT NULL,
  partner_code TEXT NOT NULL UNIQUE,
  partner_type TEXT NOT NULL, -- 'local', 'international', 'express', 'standard'
  api_config JSONB NOT NULL DEFAULT '{}',
  service_areas JSONB NOT NULL DEFAULT '[]',
  pricing_structure JSONB NOT NULL DEFAULT '{}',
  capabilities JSONB NOT NULL DEFAULT '{}', -- tracking, insurance, cod, etc.
  sla_metrics JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.shipping_service_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_number TEXT NOT NULL UNIQUE,
  order_id UUID NOT NULL,
  partner_id UUID NOT NULL REFERENCES public.shipping_service_partners(id),
  tracking_number TEXT,
  status TEXT NOT NULL DEFAULT 'created', -- 'created', 'picked_up', 'in_transit', 'delivered', 'failed', 'returned'
  origin_address JSONB NOT NULL,
  destination_address JSONB NOT NULL,
  package_details JSONB NOT NULL DEFAULT '{}',
  shipping_cost NUMERIC(12,2) NOT NULL,
  estimated_delivery TIMESTAMPTZ,
  actual_delivery TIMESTAMPTZ,
  tracking_events JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notification Service Tables
CREATE TABLE public.notification_service_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_name TEXT NOT NULL UNIQUE,
  channel_type TEXT NOT NULL, -- 'email', 'sms', 'push', 'in_app', 'whatsapp'
  provider_name TEXT NOT NULL,
  configuration JSONB NOT NULL DEFAULT '{}',
  rate_limits JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.notification_service_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  variables JSONB NOT NULL DEFAULT '[]',
  language TEXT NOT NULL DEFAULT 'en',
  channel_type TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(template_name, language, channel_type)
);

-- Enable RLS on all tables
ALTER TABLE public.microservices_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.microservice_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_service_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_service_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_service_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_service_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_service_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_service_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_service_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_service_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_service_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin full access microservices_registry" ON public.microservices_registry FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access microservice_configs" ON public.microservice_configs FOR ALL USING (is_admin_user());
CREATE POLICY "Admin can view service_communication_logs" ON public.service_communication_logs FOR SELECT USING (is_admin_user());

CREATE POLICY "Users can manage their profiles" ON public.user_service_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view active products" ON public.product_service_catalog FOR SELECT USING (status = 'active');
CREATE POLICY "Vendors can manage their products" ON public.product_service_catalog FOR ALL USING (vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "Vendors can manage their inventory" ON public.product_service_inventory FOR ALL USING (
  EXISTS (SELECT 1 FROM public.product_service_catalog WHERE id = product_id AND (vendor_id = auth.uid() OR is_admin_user()))
);

CREATE POLICY "Users can view their orders" ON public.order_service_orders FOR SELECT USING (customer_id = auth.uid() OR vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "Users can create orders" ON public.order_service_orders FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Vendors can update their orders" ON public.order_service_orders FOR UPDATE USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Users can view their transactions" ON public.payment_service_transactions FOR SELECT USING (customer_id = auth.uid() OR vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "System can manage transactions" ON public.payment_service_transactions FOR ALL USING (is_admin_user());

CREATE POLICY "Admin can manage shipping partners" ON public.shipping_service_partners FOR ALL USING (is_admin_user());
CREATE POLICY "Public can view active shipping partners" ON public.shipping_service_partners FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view their shipments" ON public.shipping_service_shipments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.order_service_orders WHERE id = order_id AND (customer_id = auth.uid() OR vendor_id = auth.uid())) OR is_admin_user()
);

CREATE POLICY "Admin can manage notification channels" ON public.notification_service_channels FOR ALL USING (is_admin_user());
CREATE POLICY "Admin can manage notification templates" ON public.notification_service_templates FOR ALL USING (is_admin_user());

-- Create triggers for updated_at
CREATE TRIGGER update_microservices_registry_updated_at BEFORE UPDATE ON public.microservices_registry FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_microservice_configs_updated_at BEFORE UPDATE ON public.microservice_configs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_service_profiles_updated_at BEFORE UPDATE ON public.user_service_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_service_catalog_updated_at BEFORE UPDATE ON public.product_service_catalog FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_service_inventory_updated_at BEFORE UPDATE ON public.product_service_inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_order_service_orders_updated_at BEFORE UPDATE ON public.order_service_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payment_service_transactions_updated_at BEFORE UPDATE ON public.payment_service_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shipping_service_partners_updated_at BEFORE UPDATE ON public.shipping_service_partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shipping_service_shipments_updated_at BEFORE UPDATE ON public.shipping_service_shipments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notification_service_channels_updated_at BEFORE UPDATE ON public.notification_service_channels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notification_service_templates_updated_at BEFORE UPDATE ON public.notification_service_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial microservices registry
INSERT INTO public.microservices_registry (service_name, service_type, endpoint_url, health_check_url, configuration) VALUES
('user-service', 'user', '/functions/v1/user-service', '/functions/v1/user-service/health', '{"max_connections": 100, "timeout": 30}'),
('product-service', 'product', '/functions/v1/product-service', '/functions/v1/product-service/health', '{"cache_ttl": 300, "max_results": 100}'),
('order-service', 'order', '/functions/v1/order-service', '/functions/v1/order-service/health', '{"max_items_per_order": 50, "timeout": 60}'),
('payment-service', 'payment', '/functions/v1/payment-service', '/functions/v1/payment-service/health', '{"timeout": 120, "retry_attempts": 3}'),
('shipping-service', 'shipping', '/functions/v1/shipping-service', '/functions/v1/shipping-service/health', '{"tracking_update_interval": 300}'),
('notification-service', 'notification', '/functions/v1/notification-service', '/functions/v1/notification-service/health', '{"batch_size": 100, "retry_attempts": 3}');

-- Insert initial configuration data
INSERT INTO public.microservice_configs (service_name, environment, config_type, config_key, config_value) VALUES
('user-service', 'production', 'security', 'jwt_expiry', '"24h"'),
('user-service', 'production', 'performance', 'cache_duration', '300'),
('product-service', 'production', 'business', 'max_variants_per_product', '20'),
('product-service', 'production', 'performance', 'search_cache_ttl', '600'),
('order-service', 'production', 'business', 'max_order_value', '1000000'),
('order-service', 'production', 'business', 'order_timeout_hours', '24'),
('payment-service', 'production', 'business', 'min_payment_amount', '10'),
('payment-service', 'production', 'security', 'encryption_enabled', 'true'),
('shipping-service', 'production', 'business', 'max_package_weight', '30'),
('notification-service', 'production', 'performance', 'queue_batch_size', '50');