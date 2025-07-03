-- STEP 2: Create missing core e-commerce tables
-- Create product reviews table
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
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS for reviews
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews" ON public.product_reviews
  FOR SELECT TO authenticated
  USING (status = 'approved');

CREATE POLICY "Users can create reviews" ON public.product_reviews
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their reviews" ON public.product_reviews
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Create shopping cart table
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