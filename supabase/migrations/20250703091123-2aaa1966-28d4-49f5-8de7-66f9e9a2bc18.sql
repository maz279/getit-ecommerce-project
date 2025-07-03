-- Final Database Population with Correct Table Structures

-- Insert main categories (using actual column structure)
INSERT INTO public.categories (id, name, name_bn, slug, parent_id, is_active, is_featured, commission_rate) VALUES
  (gen_random_uuid(), 'Fashion & Apparel', 'ফ্যাশন এবং পোশাক', 'fashion-apparel', NULL, true, true, 12.0),
  (gen_random_uuid(), 'Electronics & Technology', 'ইলেকট্রনিক্স এবং প্রযুক্তি', 'electronics-technology', NULL, true, true, 10.0),
  (gen_random_uuid(), 'Home & Garden', 'বাড়ি এবং বাগান', 'home-garden', NULL, true, true, 15.0),
  (gen_random_uuid(), 'Health & Beauty', 'স্বাস্থ্য এবং সৌন্দর্য', 'health-beauty', NULL, true, true, 11.0),
  (gen_random_uuid(), 'Food & Groceries', 'খাদ্য এবং মুদি', 'food-groceries', NULL, true, true, 8.0)
ON CONFLICT (slug) DO NOTHING;

-- Insert verified vendors (using actual vendor table structure)
INSERT INTO public.vendors (id, user_id, business_name, trade_license, status, commission_rate, total_sales, rating, is_active) VALUES
  (gen_random_uuid(), (SELECT id FROM profiles ORDER BY created_at LIMIT 1), 'Bangladesh Fashion Hub', 'TL001234567', 'active', 12.5, 0, 4.8, true),
  (gen_random_uuid(), (SELECT id FROM profiles ORDER BY created_at OFFSET 1 LIMIT 1), 'Dhaka Electronics Store', 'TL002345678', 'active', 10.0, 0, 4.6, true),
  (gen_random_uuid(), (SELECT id FROM profiles ORDER BY created_at OFFSET 2 LIMIT 1), 'Home Decor BD', 'TL003456789', 'active', 15.0, 0, 4.9, true),
  (gen_random_uuid(), (SELECT id FROM profiles ORDER BY created_at OFFSET 3 LIMIT 1), 'Beauty Paradise', 'TL004567890', 'active', 11.0, 0, 4.7, true),
  (gen_random_uuid(), (SELECT id FROM profiles ORDER BY created_at OFFSET 4 LIMIT 1), 'Fresh Foods Ltd', 'TL005678901', 'active', 8.0, 0, 4.5, true);

-- Insert sample products (40 products across categories)
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
    WHEN c.name = 'Fashion & Apparel' THEN 'Premium Cotton ' || (array['Shirt', 'Dress', 'Pants', 'Jacket'])[floor(random() * 4 + 1)]
    WHEN c.name = 'Electronics & Technology' THEN 'Smart ' || (array['Phone', 'Watch', 'Laptop', 'Tablet'])[floor(random() * 4 + 1)]
    WHEN c.name = 'Home & Garden' THEN 'Modern ' || (array['Sofa', 'Table', 'Chair', 'Lamp'])[floor(random() * 4 + 1)]
    WHEN c.name = 'Health & Beauty' THEN 'Natural ' || (array['Cream', 'Serum', 'Shampoo', 'Soap'])[floor(random() * 4 + 1)]
    ELSE 'Organic ' || (array['Rice', 'Oil', 'Spices', 'Tea'])[floor(random() * 4 + 1)]
  END,
  'High-quality product from ' || v.business_name || ' with excellent features and durability. Perfect for Bangladesh market.',
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

-- Create inventory records for all products
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

-- Create sample orders with proper user references
INSERT INTO public.orders (id, user_id, order_number, status, total_amount, payment_status, shipping_address, billing_address, payment_method, notes, created_at) VALUES
  (gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-000001', 'processing', 2500.00, 'paid', 'Dhaka, Bangladesh', 'Dhaka, Bangladesh', 'bkash', 'Rush delivery requested', now() - interval '2 days'),
  (gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-000002', 'shipped', 1800.00, 'paid', 'Chittagong, Bangladesh', 'Chittagong, Bangladesh', 'nagad', 'Gift packaging', now() - interval '1 day'),
  (gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-000003', 'pending', 3200.00, 'pending', 'Sylhet, Bangladesh', 'Sylhet, Bangladesh', 'rocket', 'Call before delivery', now());

-- Populate key analytics and metrics
INSERT INTO public.analytics_events (event_name, event_category, event_action, event_label, event_value, session_id, page_url, created_at) VALUES
  ('product_view', 'engagement', 'view', 'electronics', 1, 'sess_1001', '/products/electronics', now() - interval '1 hour'),
  ('add_to_cart', 'ecommerce', 'add', 'fashion', 1, 'sess_1002', '/products/fashion', now() - interval '30 minutes'),
  ('purchase', 'ecommerce', 'buy', 'completed', 2500, 'sess_1003', '/checkout', now() - interval '10 minutes');

-- Essential platform metrics
INSERT INTO public.platform_metrics (metric_name, metric_value, metric_type, measurement_time, additional_data) VALUES
  ('daily_active_users', 1247, 'engagement', now(), '{"source": "analytics_engine"}'),
  ('total_orders_today', 156, 'business', now(), '{"revenue": 125600}'),
  ('conversion_rate', 3.2, 'performance', now(), '{"visitors": 4500, "conversions": 144}'),
  ('avg_order_value', 1850, 'business', now(), '{"currency": "BDT"}');

-- Update search indexing for all products
UPDATE products SET searchable_content = setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
                     setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
                     setweight(to_tsvector('english', COALESCE(array_to_string(tags, ' '), '')), 'C')
WHERE searchable_content IS NULL;