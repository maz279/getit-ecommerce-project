-- Step 1: Create systematic solution for populating critical business tables
-- This migration addresses constraint conflicts and populates core business data

-- First, let's create valid test users for foreign key references
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'vendor1@example.com', 'encrypted_password', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Vendor One"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'vendor2@example.com', 'encrypted_password', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Vendor Two"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'customer1@example.com', 'encrypted_password', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Customer One"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'customer2@example.com', 'encrypted_password', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Customer Two"}', now(), now(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- Step 2: Populate vendors table
INSERT INTO public.vendors (
  id, user_id, business_name, trade_license, status, commission_rate, 
  total_sales, rating, is_active, created_at, updated_at
) VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Dhaka Fashion Store', 'TL-001-2024', 'approved', 12.00, 250000.00, 4.5, true, now(), now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Chittagong Electronics Hub', 'TL-002-2024', 'approved', 15.00, 180000.00, 4.2, true, now(), now()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', NULL, 'Sylhet Handicrafts', 'TL-003-2024', 'pending', 18.00, 95000.00, 4.0, true, now(), now()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', NULL, 'Rajshahi Agriculture Co', 'TL-004-2024', 'approved', 10.00, 320000.00, 4.7, true, now(), now()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NULL, 'Khulna Textile Mills', 'TL-005-2024', 'approved', 14.00, 410000.00, 4.3, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Step 3: Populate products table with proper enum values
INSERT INTO public.products (
  id, vendor_id, category_id, name, name_bn, description, description_bn, 
  sku, price, stock_quantity, images, is_active, status, compare_price, 
  cost_price, weight, low_stock_threshold, is_featured, is_digital, 
  meta_title, meta_description, tags, created_at, updated_at
) VALUES 
  ('11111111-aaaa-bbbb-cccc-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM categories LIMIT 1), 'Premium Cotton Saree', 'প্রিমিয়াম কটন শাড়ি', 'Beautiful handwoven cotton saree from Bangladesh', 'বাংলাদেশের সুন্দর হাতে বোনা কটন শাড়ি', 'SAR-001', 2500.00, 50, '["saree1.jpg", "saree2.jpg"]'::jsonb, true, 'published', 3000.00, 1800.00, 0.8, 5, true, false, 'Premium Cotton Saree - Traditional Bangladeshi', 'Authentic handwoven cotton saree perfect for special occasions', '{saree,cotton,traditional,bangladesh}'::text[], now(), now()),
  ('22222222-aaaa-bbbb-cccc-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM categories LIMIT 1), 'Smartphone 128GB', 'স্মার্টফোন ১২৮জিবি', 'Latest Android smartphone with 128GB storage', 'নতুন অ্যান্ড্রয়েড স্মার্টফোন ১২৮জিবি স্টোরেজ সহ', 'PHN-001', 25000.00, 30, '["phone1.jpg", "phone2.jpg"]'::jsonb, true, 'published', 28000.00, 20000.00, 0.2, 3, true, false, 'Android Smartphone 128GB Storage', 'High-performance smartphone with excellent camera and battery life', '{smartphone,android,electronics,mobile}'::text[], now(), now()),
  ('33333333-aaaa-bbbb-cccc-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT id FROM categories LIMIT 1), 'Handmade Bamboo Basket', 'হাতে তৈরি বাঁশের ঝুড়ি', 'Traditional bamboo basket made by local artisans', 'স্থানীয় কারিগরদের তৈরি ঐতিহ্যবাহী বাঁশের ঝুড়ি', 'BSK-001', 450.00, 100, '["basket1.jpg", "basket2.jpg"]'::jsonb, true, 'published', 550.00, 300.00, 0.5, 10, false, false, 'Traditional Handmade Bamboo Basket', 'Eco-friendly bamboo basket perfect for storage and decoration', '{handicrafts,bamboo,traditional,eco-friendly}'::text[], now(), now()),
  ('44444444-aaaa-bbbb-cccc-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', (SELECT id FROM categories LIMIT 1), 'Organic Rice 5KG', 'জৈব চাল ৫কেজি', 'Premium organic rice from Rajshahi farms', 'রাজশাহীর খামার থেকে প্রিমিয়াম জৈব চাল', 'RIC-001', 650.00, 200, '["rice1.jpg", "rice2.jpg"]'::jsonb, true, 'published', 750.00, 500.00, 5.0, 20, false, false, 'Organic Rice 5KG Premium Quality', 'Pesticide-free organic rice grown in Rajshahi fertile lands', '{organic,rice,food,agriculture,pesticide-free}'::text[], now(), now()),
  ('55555555-aaaa-bbbb-cccc-555555555555', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', (SELECT id FROM categories LIMIT 1), 'Cotton T-Shirt', 'কটন টি-শার্ট', 'Comfortable cotton t-shirt for daily wear', 'দৈনন্দিন পরিধানের জন্য আরামদায়ক কটন টি-শার্ট', 'TSH-001', 890.00, 75, '["tshirt1.jpg", "tshirt2.jpg"]'::jsonb, true, 'published', 1200.00, 600.00, 0.3, 8, false, false, 'Premium Cotton T-Shirt Comfortable Wear', 'High-quality cotton t-shirt perfect for casual and formal occasions', '{clothing,cotton,tshirt,comfortable,casual}'::text[], now(), now())
ON CONFLICT (id) DO NOTHING;

-- Step 4: Populate product_inventory table
INSERT INTO public.product_inventory (
  id, product_id, vendor_id, sku, current_stock, reserved_stock, 
  minimum_stock_level, maximum_stock_level, reorder_point, 
  unit_cost, selling_price, last_restocked_at, created_at, updated_at
) VALUES 
  ('inv-1111-1111-1111-111111111111', '11111111-aaaa-bbbb-cccc-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SAR-001-INV', 50, 5, 10, 200, 20, 1800.00, 2500.00, now() - interval '7 days', now(), now()),
  ('inv-2222-2222-2222-222222222222', '22222222-aaaa-bbbb-cccc-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'PHN-001-INV', 30, 2, 5, 100, 15, 20000.00, 25000.00, now() - interval '3 days', now(), now()),
  ('inv-3333-3333-3333-333333333333', '33333333-aaaa-bbbb-cccc-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'BSK-001-INV', 100, 0, 20, 500, 40, 300.00, 450.00, now() - interval '10 days', now(), now()),
  ('inv-4444-4444-4444-444444444444', '44444444-aaaa-bbbb-cccc-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'RIC-001-INV', 200, 15, 50, 1000, 100, 500.00, 650.00, now() - interval '2 days', now(), now()),
  ('inv-5555-5555-5555-555555555555', '55555555-aaaa-bbbb-cccc-555555555555', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'TSH-001-INV', 75, 3, 10, 300, 25, 600.00, 890.00, now() - interval '5 days', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Step 5: Populate orders table with valid enum values
INSERT INTO public.orders (
  id, customer_id, order_number, status, payment_method, payment_status, 
  total_amount, subtotal, tax_amount, shipping_amount, discount_amount, 
  currency, shipping_address, billing_address, notes, tracking_number, 
  estimated_delivery, created_at, updated_at
) VALUES 
  ('ord-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'ORD-20240703-000001', 'delivered', 'bkash', 'paid', 2580.00, 2500.00, 50.00, 80.00, 50.00, 'BDT', '{"address": "House 123, Road 456, Dhaka 1000", "phone": "01712345678", "name": "Customer One"}'::jsonb, '{"address": "House 123, Road 456, Dhaka 1000", "phone": "01712345678", "name": "Customer One"}'::jsonb, 'Please handle with care', 'TRK-001-2024', current_date + interval '2 days', now() - interval '5 days', now()),
  ('ord-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'ORD-20240703-000002', 'shipped', 'nagad', 'paid', 25080.00, 25000.00, 1250.00, 100.00, 270.00, 'BDT', '{"address": "House 789, Road 012, Chittagong 4000", "phone": "01812345679", "name": "Customer Two"}'::jsonb, '{"address": "House 789, Road 012, Chittagong 4000", "phone": "01812345679", "name": "Customer Two"}'::jsonb, 'Express delivery requested', 'TRK-002-2024', current_date + interval '1 day', now() - interval '3 days', now()),
  ('ord-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'ORD-20240703-000003', 'processing', 'rocket', 'pending', 1350.00, 1350.00, 67.50, 60.00, 127.50, 'BDT', '{"address": "House 345, Road 678, Sylhet 3100", "phone": "01912345680", "name": "Customer One"}'::jsonb, '{"address": "House 345, Road 678, Sylhet 3100", "phone": "01912345680", "name": "Customer One"}'::jsonb, 'Gift wrapping required', 'TRK-003-2024', current_date + interval '3 days', now() - interval '1 day', now())
ON CONFLICT (id) DO NOTHING;

-- Step 6: Populate order_items table
INSERT INTO public.order_items (
  id, order_id, product_id, vendor_id, quantity, unit_price, total_price, 
  product_snapshot, created_at
) VALUES 
  ('itm-1111-1111-1111-111111111111', 'ord-1111-1111-1111-111111111111', '11111111-aaaa-bbbb-cccc-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 2500.00, 2500.00, '{"name": "Premium Cotton Saree", "sku": "SAR-001", "price": 2500.00}'::jsonb, now() - interval '5 days'),
  ('itm-2222-2222-2222-222222222222', 'ord-2222-2222-2222-222222222222', '22222222-aaaa-bbbb-cccc-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 25000.00, 25000.00, '{"name": "Smartphone 128GB", "sku": "PHN-001", "price": 25000.00}'::jsonb, now() - interval '3 days'),
  ('itm-3333-3333-3333-333333333333', 'ord-3333-3333-3333-333333333333', '33333333-aaaa-bbbb-cccc-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 3, 450.00, 1350.00, '{"name": "Handmade Bamboo Basket", "sku": "BSK-001", "price": 450.00}'::jsonb, now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- Step 7: Populate vendor_commissions table with correct enum values
INSERT INTO public.vendor_commissions (
  id, vendor_id, order_id, product_id, transaction_id, commission_type, 
  commission_rate, gross_amount, commission_amount, platform_fee, 
  net_commission, status, payment_status, transaction_date, 
  calculation_date, payment_due_date, category, currency, 
  exchange_rate, created_at, updated_at
) VALUES 
  ('com-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ord-1111-1111-1111-111111111111', '11111111-aaaa-bbbb-cccc-111111111111', 'TXN-001-2024', 'percentage', 12.00, 2500.00, 300.00, 15.00, 285.00, 'confirmed', 'paid', now() - interval '5 days', now() - interval '4 days', current_date + interval '30 days', 'fashion', 'BDT', 1.0000, now() - interval '5 days', now()),
  ('com-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ord-2222-2222-2222-222222222222', '22222222-aaaa-bbbb-cccc-222222222222', 'TXN-002-2024', 'percentage', 15.00, 25000.00, 3750.00, 187.50, 3562.50, 'confirmed', 'pending', now() - interval '3 days', now() - interval '2 days', current_date + interval '30 days', 'electronics', 'BDT', 1.0000, now() - interval '3 days', now()),
  ('com-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'ord-3333-3333-3333-333333333333', '33333333-aaaa-bbbb-cccc-333333333333', 'TXN-003-2024', 'percentage', 18.00, 1350.00, 243.00, 12.15, 230.85, 'pending', 'unpaid', now() - interval '1 day', now(), current_date + interval '30 days', 'handicrafts', 'BDT', 1.0000, now() - interval '1 day', now())
ON CONFLICT (id) DO NOTHING;

-- Step 8: Populate flash_sales table with correct enum values
INSERT INTO public.flash_sales (
  id, name, description, start_time, end_time, discount_percentage, 
  minimum_quantity, maximum_quantity_per_user, total_quantity_available, 
  quantity_sold, status, featured_products, terms_conditions, 
  created_by, created_at, updated_at
) VALUES 
  ('fls-1111-1111-1111-111111111111', 'Eid Special Sale 2024', 'Special discounts for Eid celebration', now() + interval '1 day', now() + interval '8 days', 25.00, 1, 5, 1000, 150, 'scheduled', '["11111111-aaaa-bbbb-cccc-111111111111", "22222222-aaaa-bbbb-cccc-222222222222"]'::jsonb, 'Limited time offer. Terms and conditions apply.', '11111111-1111-1111-1111-111111111111', now(), now()),
  ('fls-2222-2222-2222-222222222222', 'Electronics Mega Sale', 'Biggest electronics sale of the year', now() - interval '2 days', now() + interval '5 days', 30.00, 1, 3, 500, 75, 'active', '["22222222-aaaa-bbbb-cccc-222222222222"]'::jsonb, 'Electronics only. While stocks last.', '22222222-2222-2222-2222-222222222222', now() - interval '3 days', now()),
  ('fls-3333-3333-3333-333333333333', 'Handicrafts Festival', 'Support local artisans with special prices', now() + interval '10 days', now() + interval '17 days', 20.00, 2, 10, 2000, 0, 'draft', '["33333333-aaaa-bbbb-cccc-333333333333"]'::jsonb, 'Minimum purchase of 2 items required.', '11111111-1111-1111-1111-111111111111', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Step 9: Populate product_reviews table
INSERT INTO public.product_reviews (
  id, product_id, user_id, rating, review_text, is_verified_purchase, 
  helpful_count, status, created_at, updated_at
) VALUES 
  ('rev-1111-1111-1111-111111111111', '11111111-aaaa-bbbb-cccc-111111111111', '33333333-3333-3333-3333-333333333333', 5, 'Excellent quality saree! The fabric is soft and the design is beautiful. Highly recommended!', true, 12, 'approved', now() - interval '3 days', now()),
  ('rev-2222-2222-2222-222222222222', '22222222-aaaa-bbbb-cccc-222222222222', '44444444-4444-4444-4444-444444444444', 4, 'Good smartphone with decent camera quality. Battery life could be better but overall satisfied with the purchase.', true, 8, 'approved', now() - interval '1 day', now()),
  ('rev-3333-3333-3333-333333333333', '33333333-aaaa-bbbb-cccc-333333333333', '33333333-3333-3333-3333-333333333333', 5, 'Beautiful handmade basket! Perfect size and very sturdy. Great for home decoration and storage.', false, 5, 'approved', now() - interval '2 hours', now())
ON CONFLICT (id) DO NOTHING;

-- Step 10: Populate search_queries table
INSERT INTO public.search_queries (
  id, user_id, query_text, query_type, results_count, clicked_product_id, 
  user_agent, ip_address, session_id, created_at
) VALUES 
  ('srh-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'cotton saree', 'text', 15, '11111111-aaaa-bbbb-cccc-111111111111', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.1'::inet, 'sess-001', now() - interval '2 hours'),
  ('srh-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'smartphone android', 'text', 8, '22222222-aaaa-bbbb-cccc-222222222222', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', '192.168.1.2'::inet, 'sess-002', now() - interval '1 day'),
  ('srh-3333-3333-3333-333333333333', NULL, 'bamboo basket', 'text', 12, '33333333-aaaa-bbbb-cccc-333333333333', 'Mozilla/5.0 (Android 11; SM-G991B) AppleWebKit/537.36', '192.168.1.3'::inet, 'sess-003', now() - interval '5 hours')
ON CONFLICT (id) DO NOTHING;

-- Step 11: Populate analytics_events table
INSERT INTO public.analytics_events (
  id, user_id, session_id, event_category, event_name, event_action, 
  event_label, event_value, page_url, referrer, user_agent, ip_address, 
  custom_properties, created_at
) VALUES 
  ('evt-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'sess-001', 'ecommerce', 'purchase', 'completed', 'Premium Cotton Saree', 2500.00, '/product/premium-cotton-saree', 'https://google.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.1'::inet, '{"payment_method": "bkash", "order_id": "ord-1111-1111-1111-111111111111"}'::jsonb, now() - interval '3 days'),
  ('evt-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'sess-002', 'engagement', 'product_view', 'view', 'Smartphone 128GB', NULL, '/product/smartphone-128gb', 'https://facebook.com', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', '192.168.1.2'::inet, '{"category": "electronics", "vendor": "Chittagong Electronics Hub"}'::jsonb, now() - interval '1 day'),
  ('evt-3333-3333-3333-333333333333', NULL, 'sess-003', 'marketing', 'newsletter_signup', 'subscribe', 'Footer Newsletter', NULL, '/newsletter/signup', 'direct', 'Mozilla/5.0 (Android 11; SM-G991B) AppleWebKit/537.36', '192.168.1.3'::inet, '{"source": "footer", "campaign": "general"}'::jsonb, now() - interval '2 hours')
ON CONFLICT (id) DO NOTHING;

-- Step 12: Populate recently_viewed table
INSERT INTO public.recently_viewed (
  id, user_id, product_id, viewed_at
) VALUES 
  ('rcv-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '11111111-aaaa-bbbb-cccc-111111111111', now() - interval '2 hours'),
  ('rcv-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '33333333-aaaa-bbbb-cccc-333333333333', now() - interval '5 hours'),
  ('rcv-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '22222222-aaaa-bbbb-cccc-222222222222', now() - interval '1 day'),
  ('rcv-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '44444444-aaaa-bbbb-cccc-444444444444', now() - interval '3 hours')
ON CONFLICT (id) DO NOTHING;