-- Comprehensive Database Population and System Fix
-- Phase 1: Core Categories and Products

-- Insert main categories
INSERT INTO public.categories (id, name, description, slug, parent_id, is_active, sort_order) VALUES
  (gen_random_uuid(), 'Fashion & Apparel', 'Clothing, footwear, and fashion accessories', 'fashion-apparel', NULL, true, 1),
  (gen_random_uuid(), 'Electronics & Technology', 'Smartphones, computers, and electronic devices', 'electronics-technology', NULL, true, 2),
  (gen_random_uuid(), 'Home & Garden', 'Furniture, decor, and home improvement', 'home-garden', NULL, true, 3),
  (gen_random_uuid(), 'Health & Beauty', 'Skincare, makeup, and wellness products', 'health-beauty', NULL, true, 4),
  (gen_random_uuid(), 'Food & Groceries', 'Fresh food, packaged goods, and beverages', 'food-groceries', NULL, true, 5),
  (gen_random_uuid(), 'Sports & Outdoor', 'Fitness equipment and outdoor gear', 'sports-outdoor', NULL, true, 6),
  (gen_random_uuid(), 'Books & Education', 'Academic books and educational materials', 'books-education', NULL, true, 7),
  (gen_random_uuid(), 'Baby & Kids', 'Children products and baby care', 'baby-kids', NULL, true, 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert verified vendors
INSERT INTO public.vendors (id, business_name, business_type, email, phone, status, verification_status, commission_rate, business_address, trade_license_number, tin_number, bank_account_verified, nid_verified, created_at) VALUES
  (gen_random_uuid(), 'Bangladesh Fashion Hub', 'retailer', 'contact@fashionhub.bd', '+8801712345678', 'active', 'verified', 12.5, 'Dhaka, Bangladesh', 'TL001234567', 'TIN001234567', true, true, now()),
  (gen_random_uuid(), 'Dhaka Electronics Store', 'retailer', 'info@dhakaelectronics.com', '+8801812345678', 'active', 'verified', 10.0, 'Gulshan, Dhaka', 'TL002345678', 'TIN002345678', true, true, now()),
  (gen_random_uuid(), 'Home Decor BD', 'manufacturer', 'sales@homedecorbd.com', '+8801912345678', 'active', 'verified', 15.0, 'Chittagong, Bangladesh', 'TL003456789', 'TIN003456789', true, true, now()),
  (gen_random_uuid(), 'Beauty Paradise', 'distributor', 'orders@beautyparadise.bd', '+8801612345678', 'active', 'verified', 11.0, 'Sylhet, Bangladesh', 'TL004567890', 'TIN004567890', true, true, now()),
  (gen_random_uuid(), 'Fresh Foods Ltd', 'supplier', 'business@freshfoods.bd', '+8801512345678', 'active', 'verified', 8.0, 'Rajshahi, Bangladesh', 'TL005678901', 'TIN005678901', true, true, now())
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
WITH vendor_ids AS (
  SELECT id, business_name FROM vendors LIMIT 5
),
category_ids AS (
  SELECT id, name FROM categories LIMIT 8
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
  'High-quality product from ' || v.business_name || ' with excellent features and durability.',
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

-- Insert inventory for products
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
FROM products p;

-- Insert flash sales
INSERT INTO public.flash_sales (id, title, description, start_time, end_time, discount_percentage, max_discount_amount, status, total_items, sold_items, created_at) VALUES
  (gen_random_uuid(), 'New Year Mega Sale', 'Up to 70% off on all categories', now(), now() + interval '7 days', 50.0, 5000.0, 'active', 100, 23, now()),
  (gen_random_uuid(), 'Electronics Flash Sale', '24-hour electronics sale', now() + interval '1 day', now() + interval '2 days', 30.0, 3000.0, 'scheduled', 50, 0, now()),
  (gen_random_uuid(), 'Fashion Weekend', 'Weekend fashion deals', now() + interval '3 days', now() + interval '5 days', 40.0, 2000.0, 'scheduled', 75, 0, now());

-- Link products to flash sales
INSERT INTO public.flash_sale_products (id, flash_sale_id, product_id, original_price, sale_price, quantity_available, quantity_sold, created_at)
SELECT 
  gen_random_uuid(),
  fs.id,
  p.id,
  p.price,
  p.price * (1 - fs.discount_percentage / 100),
  floor(random() * 20) + 5,
  floor(random() * 5),
  now()
FROM flash_sales fs
CROSS JOIN (SELECT id, price FROM products ORDER BY random() LIMIT 10) p;

-- Update searchable content for products
UPDATE products SET searchable_content = setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
                     setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
                     setweight(to_tsvector('english', COALESCE(array_to_string(tags, ' '), '')), 'C');