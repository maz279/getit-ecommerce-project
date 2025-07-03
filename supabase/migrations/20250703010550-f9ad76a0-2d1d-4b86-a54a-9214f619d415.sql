-- STEP 2: Create missing core tables (simplified)
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
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

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

-- Create order items table
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