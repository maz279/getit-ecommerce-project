-- Fixed Database Population - Using Correct Table Structures

-- Insert main categories
INSERT INTO public.categories (id, name, name_bn, slug, parent_id, is_active, is_featured, commission_rate) VALUES
  (gen_random_uuid(), 'Fashion & Apparel', 'ফ্যাশন এবং পোশাক', 'fashion-apparel', NULL, true, true, 12.0),
  (gen_random_uuid(), 'Electronics & Technology', 'ইলেকট্রনিক্স এবং প্রযুক্তি', 'electronics-technology', NULL, true, true, 10.0),
  (gen_random_uuid(), 'Home & Garden', 'বাড়ি এবং বাগান', 'home-garden', NULL, true, true, 15.0),
  (gen_random_uuid(), 'Health & Beauty', 'স্বাস্থ্য এবং সৌন্দর্য', 'health-beauty', NULL, true, true, 11.0),
  (gen_random_uuid(), 'Food & Groceries', 'খাদ্য এবং মুদি', 'food-groceries', NULL, true, true, 8.0),
  (gen_random_uuid(), 'Sports & Outdoor', 'খেলাধুলা এবং বহিরঙ্গন', 'sports-outdoor', NULL, true, false, 13.0),
  (gen_random_uuid(), 'Books & Education', 'বই এবং শিক্ষা', 'books-education', NULL, true, false, 9.0),
  (gen_random_uuid(), 'Baby & Kids', 'শিশু এবং বাচ্চাদের', 'baby-kids', NULL, true, false, 14.0)
ON CONFLICT (slug) DO NOTHING;

-- Insert verified vendors with proper structure
INSERT INTO public.vendors (id, business_name, business_type, email, phone, status, verification_status, commission_rate, business_address, trade_license_number, tin_number, created_at) VALUES
  (gen_random_uuid(), 'Bangladesh Fashion Hub', 'retailer', 'contact@fashionhub.bd', '+8801712345678', 'active', 'verified', 12.5, 'Dhaka, Bangladesh', 'TL001234567', 'TIN001234567', now()),
  (gen_random_uuid(), 'Dhaka Electronics Store', 'retailer', 'info@dhakaelectronics.com', '+8801812345678', 'active', 'verified', 10.0, 'Gulshan, Dhaka', 'TL002345678', 'TIN002345678', now()),
  (gen_random_uuid(), 'Home Decor BD', 'manufacturer', 'sales@homedecorbd.com', '+8801912345678', 'active', 'verified', 15.0, 'Chittagong, Bangladesh', 'TL003456789', 'TIN003456789', now()),
  (gen_random_uuid(), 'Beauty Paradise', 'distributor', 'orders@beautyparadise.bd', '+8801612345678', 'active', 'verified', 11.0, 'Sylhet, Bangladesh', 'TL004567890', 'TIN004567890', now()),
  (gen_random_uuid(), 'Fresh Foods Ltd', 'supplier', 'business@freshfoods.bd', '+8801512345678', 'active', 'verified', 8.0, 'Rajshahi, Bangladesh', 'TL005678901', 'TIN005678901', now())
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
WITH vendor_ids AS (
  SELECT id, business_name FROM vendors WHERE status = 'active' LIMIT 5
),
category_ids AS (
  SELECT id, name FROM categories WHERE is_active = true LIMIT 8
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
    WHEN c.name = 'Food & Groceries' THEN 'Organic ' || (array['Rice', 'Oil', 'Spices', 'Tea'])[floor(random() * 4 + 1)]
    WHEN c.name = 'Sports & Outdoor' THEN 'Professional ' || (array['Ball', 'Shoes', 'Gear', 'Equipment'])[floor(random() * 4 + 1)]
    WHEN c.name = 'Books & Education' THEN 'Educational ' || (array['Textbook', 'Novel', 'Guide', 'Manual'])[floor(random() * 4 + 1)]
    ELSE 'Kids ' || (array['Toy', 'Clothes', 'Book', 'Game'])[floor(random() * 4 + 1)]
  END,
  'High-quality product from ' || v.business_name || ' with excellent features and durability. Perfect for Bangladesh market with local preferences.',
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
FROM vendor_ids v
CROSS JOIN category_ids c
LIMIT 40;

-- Create sample orders
INSERT INTO public.orders (id, user_id, order_number, status, total_amount, payment_status, shipping_address, billing_address, payment_method, notes, created_at) VALUES
  (gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-000001', 'processing', 2500.00, 'paid', 'Dhaka, Bangladesh', 'Dhaka, Bangladesh', 'bkash', 'Rush delivery requested', now() - interval '2 days'),
  (gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-000002', 'shipped', 1800.00, 'paid', 'Chittagong, Bangladesh', 'Chittagong, Bangladesh', 'nagad', 'Gift packaging', now() - interval '1 day'),
  (gen_random_uuid(), (SELECT id FROM profiles LIMIT 1), 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-000003', 'pending', 3200.00, 'pending', 'Sylhet, Bangladesh', 'Sylhet, Bangladesh', 'rocket', 'Call before delivery', now());

-- Populate analytics and metrics
INSERT INTO public.analytics_events (event_name, event_category, event_action, event_label, event_value, user_id, session_id, page_url, created_at) VALUES
  ('product_view', 'engagement', 'view', 'electronics', 1, NULL, 'sess_' || floor(random() * 10000), '/products/electronics', now() - interval '1 hour'),
  ('add_to_cart', 'ecommerce', 'add', 'fashion', 1, NULL, 'sess_' || floor(random() * 10000), '/products/fashion', now() - interval '30 minutes'),
  ('purchase', 'ecommerce', 'buy', 'completed', 2500, NULL, 'sess_' || floor(random() * 10000), '/checkout', now() - interval '10 minutes');

-- Populate platform metrics
INSERT INTO public.platform_metrics (metric_name, metric_value, metric_type, measurement_time, additional_data) VALUES
  ('daily_active_users', 1247, 'engagement', now(), '{"source": "analytics_engine"}'),
  ('total_orders_today', 156, 'business', now(), '{"revenue": 125600}'),
  ('conversion_rate', 3.2, 'performance', now(), '{"visitors": 4500, "conversions": 144}'),
  ('avg_order_value', 1850, 'business', now(), '{"currency": "BDT"}');

-- Update search indexing
UPDATE products SET searchable_content = setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
                     setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
                     setweight(to_tsvector('english', COALESCE(array_to_string(tags, ' '), '')), 'C');