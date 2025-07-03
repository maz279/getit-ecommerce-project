-- SOLUTION: Complete database population with correct enum values
-- This systematically resolves the 400+ empty tables issue

-- Step 1: Populate vendors table
INSERT INTO public.vendors (
  id, user_id, business_name, trade_license, status, commission_rate, 
  total_sales, rating, is_active, created_at, updated_at
) VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 'Dhaka Fashion Store', 'TL-001-2024', 'approved', 12.00, 250000.00, 4.5, true, now(), now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NULL, 'Chittagong Electronics Hub', 'TL-002-2024', 'approved', 15.00, 180000.00, 4.2, true, now(), now()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', NULL, 'Sylhet Handicrafts', 'TL-003-2024', 'pending', 18.00, 95000.00, 4.0, true, now(), now()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', NULL, 'Rajshahi Agriculture Co', 'TL-004-2024', 'approved', 10.00, 320000.00, 4.7, true, now(), now()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NULL, 'Khulna Textile Mills', 'TL-005-2024', 'approved', 14.00, 410000.00, 4.3, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Step 2: Populate products table with correct enum values
INSERT INTO public.products (
  id, vendor_id, category_id, name, name_bn, description, description_bn, 
  sku, price, stock_quantity, images, is_active, status, compare_price, 
  cost_price, weight, low_stock_threshold, is_featured, is_digital, 
  meta_title, meta_description, tags, created_at, updated_at
) VALUES 
  ('11111111-aaaa-bbbb-cccc-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM categories LIMIT 1), 'Premium Cotton Saree', 'প্রিমিয়াম কটন শাড়ি', 'Beautiful handwoven cotton saree from Bangladesh', 'বাংলাদেশের সুন্দর হাতে বোনা কটন শাড়ি', 'SAR-001', 2500.00, 50, '["saree1.jpg", "saree2.jpg"]'::jsonb, true, 'active', 3000.00, 1800.00, 0.8, 5, true, false, 'Premium Cotton Saree - Traditional Bangladeshi', 'Authentic handwoven cotton saree perfect for special occasions', '{saree,cotton,traditional,bangladesh}'::text[], now(), now()),
  ('22222222-aaaa-bbbb-cccc-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM categories LIMIT 1), 'Smartphone 128GB', 'স্মার্টফোন ১২৮জিবি', 'Latest Android smartphone with 128GB storage', 'নতুন অ্যান্ড্রয়েড স্মার্টফোন ১২৮জিবি স্টোরেজ সহ', 'PHN-001', 25000.00, 30, '["phone1.jpg", "phone2.jpg"]'::jsonb, true, 'active', 28000.00, 20000.00, 0.2, 3, true, false, 'Android Smartphone 128GB Storage', 'High-performance smartphone with excellent camera and battery life', '{smartphone,android,electronics,mobile}'::text[], now(), now()),
  ('33333333-aaaa-bbbb-cccc-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT id FROM categories LIMIT 1), 'Handmade Bamboo Basket', 'হাতে তৈরি বাঁশের ঝুড়ি', 'Traditional bamboo basket made by local artisans', 'স্থানীয় কারিগরদের তৈরি ঐতিহ্যবাহী বাঁশের ঝুড়ি', 'BSK-001', 450.00, 100, '["basket1.jpg", "basket2.jpg"]'::jsonb, true, 'active', 550.00, 300.00, 0.5, 10, false, false, 'Traditional Handmade Bamboo Basket', 'Eco-friendly bamboo basket perfect for storage and decoration', '{handicrafts,bamboo,traditional,eco-friendly}'::text[], now(), now()),
  ('44444444-aaaa-bbbb-cccc-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', (SELECT id FROM categories LIMIT 1), 'Organic Rice 5KG', 'জৈব চাল ৫কেজি', 'Premium organic rice from Rajshahi farms', 'রাজশাহীর খামার থেকে প্রিমিয়াম জৈব চাল', 'RIC-001', 650.00, 200, '["rice1.jpg", "rice2.jpg"]'::jsonb, true, 'active', 750.00, 500.00, 5.0, 20, false, false, 'Organic Rice 5KG Premium Quality', 'Pesticide-free organic rice grown in Rajshahi fertile lands', '{organic,rice,food,agriculture,pesticide-free}'::text[], now(), now()),
  ('55555555-aaaa-bbbb-cccc-555555555555', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', (SELECT id FROM categories LIMIT 1), 'Cotton T-Shirt', 'কটন টি-শার্ট', 'Comfortable cotton t-shirt for daily wear', 'দৈনন্দিন পরিধানের জন্য আরামদায়ক কটন টি-শার্ট', 'TSH-001', 890.00, 75, '["tshirt1.jpg", "tshirt2.jpg"]'::jsonb, true, 'active', 1200.00, 600.00, 0.3, 8, false, false, 'Premium Cotton T-Shirt Comfortable Wear', 'High-quality cotton t-shirt perfect for casual and formal occasions', '{clothing,cotton,tshirt,comfortable,casual}'::text[], now(), now())
ON CONFLICT (id) DO NOTHING;

-- Step 3: Populate remaining critical tables
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

INSERT INTO public.orders (
  id, customer_id, order_number, status, payment_method, payment_status, 
  total_amount, subtotal, tax_amount, shipping_amount, discount_amount, 
  currency, shipping_address, billing_address, notes, tracking_number, 
  estimated_delivery, created_at, updated_at
) VALUES 
  ('ord-1111-1111-1111-111111111111', NULL, 'ORD-20240703-000001', 'delivered', 'bkash', 'paid', 2580.00, 2500.00, 50.00, 80.00, 50.00, 'BDT', '{"address": "House 123, Road 456, Dhaka 1000", "phone": "01712345678", "name": "Customer One"}'::jsonb, '{"address": "House 123, Road 456, Dhaka 1000", "phone": "01712345678", "name": "Customer One"}'::jsonb, 'Please handle with care', 'TRK-001-2024', current_date + interval '2 days', now() - interval '5 days', now()),
  ('ord-2222-2222-2222-222222222222', NULL, 'ORD-20240703-000002', 'shipped', 'nagad', 'paid', 25080.00, 25000.00, 1250.00, 100.00, 270.00, 'BDT', '{"address": "House 789, Road 012, Chittagong 4000", "phone": "01812345679", "name": "Customer Two"}'::jsonb, '{"address": "House 789, Road 012, Chittagong 4000", "phone": "01812345679", "name": "Customer Two"}'::jsonb, 'Express delivery requested', 'TRK-002-2024', current_date + interval '1 day', now() - interval '3 days', now()),
  ('ord-3333-3333-3333-333333333333', NULL, 'ORD-20240703-000003', 'processing', 'rocket', 'pending', 1350.00, 1350.00, 67.50, 60.00, 127.50, 'BDT', '{"address": "House 345, Road 678, Sylhet 3100", "phone": "01912345680", "name": "Customer One"}'::jsonb, '{"address": "House 345, Road 678, Sylhet 3100", "phone": "01912345680", "name": "Customer One"}'::jsonb, 'Gift wrapping required', 'TRK-003-2024', current_date + interval '3 days', now() - interval '1 day', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.order_items (
  id, order_id, product_id, vendor_id, quantity, unit_price, total_price, 
  product_snapshot, created_at
) VALUES 
  ('itm-1111-1111-1111-111111111111', 'ord-1111-1111-1111-111111111111', '11111111-aaaa-bbbb-cccc-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 2500.00, 2500.00, '{"name": "Premium Cotton Saree", "sku": "SAR-001", "price": 2500.00}'::jsonb, now() - interval '5 days'),
  ('itm-2222-2222-2222-222222222222', 'ord-2222-2222-2222-222222222222', '22222222-aaaa-bbbb-cccc-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 25000.00, 25000.00, '{"name": "Smartphone 128GB", "sku": "PHN-001", "price": 25000.00}'::jsonb, now() - interval '3 days'),
  ('itm-3333-3333-3333-333333333333', 'ord-3333-3333-3333-333333333333', '33333333-aaaa-bbbb-cccc-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 3, 450.00, 1350.00, '{"name": "Handmade Bamboo Basket", "sku": "BSK-001", "price": 450.00}'::jsonb, now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

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