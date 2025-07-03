-- COMPREHENSIVE DATABASE AUDIT AND FIXES
-- Fix critical security, performance, and structural issues

-- 1. Fix missing primary key constraints and indexes
-- Add missing performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_vendors_created_at ON public.vendors(created_at);

-- 2. Fix RLS security issues - missing policies
-- Products table - missing vendor access
CREATE POLICY "Vendors can manage their products" ON public.products
  FOR ALL TO authenticated
  USING (vendor_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- Orders table - missing customer access
CREATE POLICY "Customers can view their orders" ON public.orders
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- Vendors table - missing user access
CREATE POLICY "Users can view vendor profiles" ON public.vendors
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Vendors can manage their profile" ON public.vendors
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- 3. Add missing core e-commerce tables that should exist
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_id uuid REFERENCES public.vendors(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  review_text text,
  verified_purchase boolean DEFAULT false,
  helpful_votes integer DEFAULT 0,
  total_votes integer DEFAULT 0,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS for reviews
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews" ON public.product_reviews
  FOR SELECT TO authenticated
  USING (is_approved = true);

CREATE POLICY "Users can create reviews" ON public.product_reviews
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their reviews" ON public.product_reviews
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- 4. Create shopping cart table
CREATE TABLE IF NOT EXISTS public.shopping_cart (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  vendor_id uuid REFERENCES public.vendors(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Add RLS for cart
ALTER TABLE public.shopping_cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their cart" ON public.shopping_cart
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- 5. Create order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  vendor_id uuid REFERENCES public.vendors(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  commission_rate numeric DEFAULT 5.0,
  commission_amount numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Add RLS for order items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their order items" ON public.order_items
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders WHERE id = order_items.order_id AND customer_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- 6. Add critical indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_approved ON public.product_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_shopping_cart_user_id ON public.shopping_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_vendor_id ON public.order_items(vendor_id);

-- 7. Fix data integrity with triggers
CREATE OR REPLACE FUNCTION update_order_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Update order total when order items change
  UPDATE public.orders 
  SET total_amount = (
    SELECT COALESCE(SUM(total_price), 0) 
    FROM public.order_items 
    WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
  ),
  updated_at = now()
  WHERE id = COALESCE(NEW.order_id, OLD.order_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for order totals
DROP TRIGGER IF EXISTS trigger_update_order_totals_insert ON public.order_items;
CREATE TRIGGER trigger_update_order_totals_insert
  AFTER INSERT ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION update_order_totals();

DROP TRIGGER IF EXISTS trigger_update_order_totals_update ON public.order_items;  
CREATE TRIGGER trigger_update_order_totals_update
  AFTER UPDATE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION update_order_totals();

DROP TRIGGER IF EXISTS trigger_update_order_totals_delete ON public.order_items;
CREATE TRIGGER trigger_update_order_totals_delete
  AFTER DELETE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION update_order_totals();