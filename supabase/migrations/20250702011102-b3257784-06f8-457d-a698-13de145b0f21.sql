-- Product Inventory Tracking Tables
CREATE TABLE IF NOT EXISTS public.product_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  current_stock INTEGER NOT NULL DEFAULT 0,
  reserved_stock INTEGER NOT NULL DEFAULT 0,
  minimum_stock_level INTEGER NOT NULL DEFAULT 10,
  maximum_stock_level INTEGER NOT NULL DEFAULT 1000,
  reorder_point INTEGER NOT NULL DEFAULT 20,
  unit_cost NUMERIC(10,2),
  selling_price NUMERIC(10,2),
  last_restocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Order Fulfillment Workflow Tables
CREATE TABLE IF NOT EXISTS public.order_fulfillment_workflow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  workflow_stage TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'
  assigned_to UUID,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  actual_completion TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Invoice Generation System Tables
CREATE TABLE IF NOT EXISTS public.vendor_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  invoice_type TEXT NOT NULL DEFAULT 'sales', -- 'sales', 'commission', 'refund'
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'sent', 'paid', 'overdue', 'cancelled'
  total_amount NUMERIC(10,2) NOT NULL,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  net_amount NUMERIC(10,2) NOT NULL,
  due_date DATE,
  paid_date TIMESTAMP WITH TIME ZONE,
  billing_address JSONB,
  line_items JSONB NOT NULL DEFAULT '[]',
  payment_terms TEXT DEFAULT '30 days',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Customer Analytics Aggregation Tables
CREATE TABLE IF NOT EXISTS public.customer_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  vendor_id UUID,
  analytics_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_orders INTEGER DEFAULT 0,
  total_spent NUMERIC(10,2) DEFAULT 0,
  average_order_value NUMERIC(10,2) DEFAULT 0,
  last_purchase_date DATE,
  purchase_frequency NUMERIC(5,2) DEFAULT 0, -- purchases per month
  favorite_categories JSONB DEFAULT '[]',
  preferred_payment_methods JSONB DEFAULT '[]',
  customer_lifetime_value NUMERIC(10,2) DEFAULT 0,
  churn_risk_score NUMERIC(3,2) DEFAULT 0, -- 0-1 scale
  engagement_score NUMERIC(3,2) DEFAULT 0, -- 0-1 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product Performance Analytics Tables
CREATE TABLE IF NOT EXISTS public.product_performance_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  analytics_date DATE NOT NULL DEFAULT CURRENT_DATE,
  views_count INTEGER DEFAULT 0,
  cart_additions INTEGER DEFAULT 0,
  purchases_count INTEGER DEFAULT 0,
  revenue NUMERIC(10,2) DEFAULT 0,
  conversion_rate NUMERIC(5,4) DEFAULT 0, -- cart to purchase rate
  return_rate NUMERIC(5,4) DEFAULT 0,
  average_rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  search_ranking INTEGER,
  category_ranking INTEGER,
  profit_margin NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sales Analytics Aggregation Tables
CREATE TABLE IF NOT EXISTS public.sales_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  analytics_date DATE NOT NULL DEFAULT CURRENT_DATE,
  analytics_period TEXT NOT NULL DEFAULT 'daily', -- 'daily', 'weekly', 'monthly', 'yearly'
  total_orders INTEGER DEFAULT 0,
  total_revenue NUMERIC(10,2) DEFAULT 0,
  total_profit NUMERIC(10,2) DEFAULT 0,
  average_order_value NUMERIC(10,2) DEFAULT 0,
  conversion_rate NUMERIC(5,4) DEFAULT 0,
  return_rate NUMERIC(5,4) DEFAULT 0,
  new_customers INTEGER DEFAULT 0,
  returning_customers INTEGER DEFAULT 0,
  top_selling_products JSONB DEFAULT '[]',
  revenue_by_category JSONB DEFAULT '{}',
  peak_hours JSONB DEFAULT '{}',
  growth_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Stock Movement Tracking
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  movement_type TEXT NOT NULL, -- 'in', 'out', 'adjustment', 'reserved', 'released'
  quantity INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reference_id UUID, -- order_id, purchase_id, etc.
  reference_type TEXT, -- 'order', 'purchase', 'adjustment', 'return'
  reason TEXT,
  performed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.product_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_fulfillment_workflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Vendors can manage their inventory" ON public.product_inventory
  FOR ALL USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Vendors can manage their fulfillment workflow" ON public.order_fulfillment_workflow
  FOR ALL USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Vendors can manage their invoices" ON public.vendor_invoices
  FOR ALL USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Vendors can view customer analytics" ON public.customer_analytics
  FOR SELECT USING (vendor_id = auth.uid() OR vendor_id IS NULL OR is_admin_user());

CREATE POLICY "Vendors can view their product analytics" ON public.product_performance_analytics
  FOR ALL USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Vendors can view their sales analytics" ON public.sales_analytics
  FOR ALL USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Vendors can view their stock movements" ON public.stock_movements
  FOR ALL USING (vendor_id = auth.uid() OR is_admin_user());

-- Indexes for performance
CREATE INDEX idx_product_inventory_vendor ON public.product_inventory(vendor_id);
CREATE INDEX idx_product_inventory_product ON public.product_inventory(product_id);
CREATE INDEX idx_order_fulfillment_vendor ON public.order_fulfillment_workflow(vendor_id);
CREATE INDEX idx_order_fulfillment_order ON public.order_fulfillment_workflow(order_id);
CREATE INDEX idx_vendor_invoices_vendor ON public.vendor_invoices(vendor_id);
CREATE INDEX idx_customer_analytics_vendor ON public.customer_analytics(vendor_id);
CREATE INDEX idx_customer_analytics_date ON public.customer_analytics(analytics_date);
CREATE INDEX idx_product_performance_vendor ON public.product_performance_analytics(vendor_id);
CREATE INDEX idx_product_performance_date ON public.product_performance_analytics(analytics_date);
CREATE INDEX idx_sales_analytics_vendor ON public.sales_analytics(vendor_id);
CREATE INDEX idx_sales_analytics_date ON public.sales_analytics(analytics_date);
CREATE INDEX idx_stock_movements_product ON public.stock_movements(product_id);
CREATE INDEX idx_stock_movements_vendor ON public.stock_movements(vendor_id);

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_product_inventory_updated_at
  BEFORE UPDATE ON public.product_inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_order_fulfillment_updated_at
  BEFORE UPDATE ON public.order_fulfillment_workflow
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_invoices_updated_at
  BEFORE UPDATE ON public.vendor_invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_analytics_updated_at
  BEFORE UPDATE ON public.customer_analytics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_performance_updated_at
  BEFORE UPDATE ON public.product_performance_analytics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_analytics_updated_at
  BEFORE UPDATE ON public.sales_analytics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();