-- STEP 3: Add RLS policies for existing tables with correct column names
-- Enable RLS on existing tables
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_cart ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for product reviews (using correct column names)
CREATE POLICY "Anyone can view reviews" ON public.product_reviews
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews" ON public.product_reviews
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their reviews" ON public.product_reviews
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- RLS policies for shopping cart
CREATE POLICY "Users can manage their cart" ON public.shopping_cart
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- RLS policies for order items
CREATE POLICY "Users can view their order items" ON public.order_items
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders WHERE id = order_items.order_id AND customer_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_cart_user_id ON public.shopping_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_vendor_id ON public.order_items(vendor_id);