-- COMPLETE FIXED Database Population

-- First, let's populate essential data without foreign key dependencies

-- Insert main categories
INSERT INTO public.categories (id, name, name_bn, slug, parent_id, is_active, is_featured, commission_rate) VALUES
  (gen_random_uuid(), 'Fashion & Apparel', 'ফ্যাশন এবং পোশাক', 'fashion-apparel', NULL, true, true, 12.0),
  (gen_random_uuid(), 'Electronics & Technology', 'ইলেকট্রনিক্স এবং প্রযুক্তি', 'electronics-technology', NULL, true, true, 10.0),
  (gen_random_uuid(), 'Home & Garden', 'বাড়ি এবং বাগান', 'home-garden', NULL, true, true, 15.0),
  (gen_random_uuid(), 'Health & Beauty', 'স্বাস্থ্য এবং সৌন্দর্য', 'health-beauty', NULL, true, true, 11.0),
  (gen_random_uuid(), 'Food & Groceries', 'খাদ্য এবং মুদি', 'food-groceries', NULL, true, true, 8.0)
ON CONFLICT (slug) DO NOTHING;

-- Create temporary vendors without user_id (we'll link them later)
INSERT INTO public.vendors (id, business_name, trade_license, status, commission_rate, total_sales, rating, is_active) VALUES
  (gen_random_uuid(), 'Bangladesh Fashion Hub', 'TL001234567', 'approved', 12.5, 125000, 4.8, true),
  (gen_random_uuid(), 'Dhaka Electronics Store', 'TL002345678', 'approved', 10.0, 98000, 4.6, true),
  (gen_random_uuid(), 'Home Decor BD', 'TL003456789', 'approved', 15.0, 156000, 4.9, true),
  (gen_random_uuid(), 'Beauty Paradise', 'TL004567890', 'approved', 11.0, 89000, 4.7, true),
  (gen_random_uuid(), 'Fresh Foods Ltd', 'TL005678901', 'approved', 8.0, 67000, 4.5, true)
ON CONFLICT (business_name) DO NOTHING;

-- Insert 25 sample products across all categories
WITH vendor_data AS (
  SELECT id, business_name FROM vendors WHERE is_active = true LIMIT 5
),
category_data AS (
  SELECT id, name FROM categories WHERE is_active = true LIMIT 5
)
INSERT INTO public.products (id, vendor_id, category_id, name, description, price, sale_price, sku, status, stock_quantity, minimum_order_quantity, maximum_order_quantity, weight, dimensions, tags, created_at) 
SELECT 
  gen_random_uuid(),
  v.id,
  c.id,
  CASE 
    WHEN c.name = 'Fashion & Apparel' THEN 'Premium Cotton ' || (array['Shirt', 'Dress', 'Pants', 'Jacket', 'Saree'])[floor(random() * 5 + 1)]
    WHEN c.name = 'Electronics & Technology' THEN 'Smart ' || (array['Phone', 'Watch', 'Laptop', 'Tablet', 'Speaker'])[floor(random() * 5 + 1)]
    WHEN c.name = 'Home & Garden' THEN 'Modern ' || (array['Sofa', 'Table', 'Chair', 'Lamp', 'Bed'])[floor(random() * 5 + 1)]
    WHEN c.name = 'Health & Beauty' THEN 'Natural ' || (array['Cream', 'Serum', 'Shampoo', 'Soap', 'Perfume'])[floor(random() * 5 + 1)]
    ELSE 'Organic ' || (array['Rice', 'Oil', 'Spices', 'Tea', 'Honey'])[floor(random() * 5 + 1)]
  END || ' - BD' || floor(random() * 1000),
  'High-quality product from ' || v.business_name || ' with excellent features and durability. Perfect for Bangladesh market with competitive pricing and local preferences.',
  (floor(random() * 9000) + 1000)::numeric,
  (floor(random() * 8000) + 800)::numeric,
  'SKU' || floor(random() * 1000000)::text,
  'active',
  floor(random() * 100) + 10,
  1,
  50,
  (random() * 5 + 0.1)::numeric,
  jsonb_build_object('length', floor(random() * 50) + 10, 'width', floor(random() * 50) + 10, 'height', floor(random() * 50) + 10),
  array['popular', 'featured', 'bestseller'],
  now()
FROM vendor_data v
CROSS JOIN category_data c;

-- Create inventory for all products
INSERT INTO public.inventory (id, product_id, current_stock, reserved_stock, minimum_stock_level, maximum_stock_level, reorder_point, last_updated)
SELECT 
  gen_random_uuid(),
  p.id,
  p.stock_quantity,
  floor(random() * 10),
  10,
  200,
  20,
  now()
FROM products p
WHERE NOT EXISTS (SELECT 1 FROM inventory i WHERE i.product_id = p.id);

-- Populate essential analytics and platform metrics
INSERT INTO public.analytics_events (event_name, event_category, event_action, event_label, event_value, session_id, page_url, created_at) VALUES
  ('product_view', 'engagement', 'view', 'electronics', 1, 'sess_1001', '/products/electronics', now() - interval '1 hour'),
  ('add_to_cart', 'ecommerce', 'add', 'fashion', 1, 'sess_1002', '/products/fashion', now() - interval '30 minutes'),
  ('purchase', 'ecommerce', 'buy', 'completed', 2500, 'sess_1003', '/checkout', now() - interval '10 minutes'),
  ('search', 'engagement', 'search', 'smartphone', 1, 'sess_1004', '/search', now() - interval '45 minutes'),
  ('wishlist_add', 'engagement', 'add', 'fashion', 1, 'sess_1005', '/wishlist', now() - interval '20 minutes');

INSERT INTO public.platform_metrics (metric_name, metric_value, metric_type, measurement_time, additional_data) VALUES
  ('daily_active_users', 1247, 'engagement', now(), '{"source": "analytics_engine"}'),
  ('total_orders_today', 156, 'business', now(), '{"revenue": 125600}'),
  ('conversion_rate', 3.2, 'performance', now(), '{"visitors": 4500, "conversions": 144}'),
  ('avg_order_value', 1850, 'business', now(), '{"currency": "BDT"}'),
  ('total_vendors', 5, 'business', now(), '{"active": 5, "pending": 0}'),
  ('total_products', 25, 'inventory', now(), '{"active": 25, "out_of_stock": 0}'),
  ('platform_health', 95.5, 'system', now(), '{"uptime": "99.9%", "response_time": "120ms"}');

-- Update search indexing for all products
UPDATE products SET searchable_content = setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
                     setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
                     setweight(to_tsvector('english', COALESCE(array_to_string(tags, ' '), '')), 'C')
WHERE searchable_content IS NULL;

-- Initialize payment gateway configurations
INSERT INTO public.bd_payment_gateways (id, name, gateway_type, is_active, configuration, fees_config, created_at) VALUES
  (gen_random_uuid(), 'bKash', 'mobile_banking', true, '{"api_url": "https://api.bkash.com", "version": "v1.2.0"}', '{"transaction_fee": 1.5, "percentage_fee": 0.5}', now()),
  (gen_random_uuid(), 'Nagad', 'mobile_banking', true, '{"api_url": "https://api.nagad.com.bd", "version": "v2.0"}', '{"transaction_fee": 1.0, "percentage_fee": 0.3}', now()),
  (gen_random_uuid(), 'Rocket', 'mobile_banking', true, '{"api_url": "https://api.rocket.com.bd", "version": "v1.0"}', '{"transaction_fee": 2.0, "percentage_fee": 0.8}', now())
ON CONFLICT (name) DO NOTHING;

-- Initialize flash sales
INSERT INTO public.flash_sales (id, title, description, start_time, end_time, discount_percentage, max_discount_amount, status, total_items, sold_items, created_at) VALUES
  (gen_random_uuid(), 'New Year Mega Sale 2025', 'Up to 70% off on all categories - Limited time offer', now(), now() + interval '7 days', 50.0, 5000.0, 'active', 100, 23, now()),
  (gen_random_uuid(), 'Electronics Flash Sale', '24-hour electronics mega deals', now() + interval '1 day', now() + interval '2 days', 30.0, 3000.0, 'scheduled', 50, 0, now()),
  (gen_random_uuid(), 'Fashion Weekend Special', 'Weekend fashion deals and discounts', now() + interval '3 days', now() + interval '5 days', 40.0, 2000.0, 'scheduled', 75, 0, now())
ON CONFLICT (title) DO NOTHING;