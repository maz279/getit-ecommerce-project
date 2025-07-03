-- PHASE 2: Orders, Inventory, Payments & Analytics Data

-- 1. PRODUCT INVENTORY 
INSERT INTO product_inventory (product_id, current_stock, minimum_stock_level, maximum_stock_level, reserved_stock, vendor_id, warehouse_location, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655441001', 45, 10, 100, 5, (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), 'Dhaka-Central-WH', now(), now()),
('550e8400-e29b-41d4-a716-446655441002', 32, 8, 80, 3, (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), 'Dhaka-Central-WH', now(), now()),
('550e8400-e29b-41d4-a716-446655441003', 28, 5, 60, 2, (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), 'Dhaka-Central-WH', now(), now()),
('550e8400-e29b-41d4-a716-446655441004', 15, 5, 50, 2, (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), 'Chittagong-Tech-WH', now(), now()),
('550e8400-e29b-41d4-a716-446655441005', 22, 10, 100, 3, (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), 'Chittagong-Tech-WH', now(), now()),
('550e8400-e29b-41d4-a716-446655441006', 8, 3, 25, 1, (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), 'Chittagong-Tech-WH', now(), now()),
('550e8400-e29b-41d4-a716-446655441007', 18, 5, 50, 2, (SELECT id FROM vendors WHERE business_name = 'Home Essentials BD' LIMIT 1), 'Sylhet-Home-WH', now(), now()),
('550e8400-e29b-41d4-a716-446655441008', 35, 15, 100, 5, (SELECT id FROM vendors WHERE business_name = 'Home Essentials BD' LIMIT 1), 'Sylhet-Home-WH', now(), now()),
('550e8400-e29b-41d4-a716-446655441009', 120, 50, 500, 20, (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 'Dhaka-Beauty-WH', now(), now()),
('550e8400-e29b-41d4-a716-446655441010', 85, 25, 200, 10, (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 'Dhaka-Beauty-WH', now(), now()),
('550e8400-e29b-41d4-a716-446655441011', 200, 50, 1000, 25, (SELECT id FROM vendors WHERE business_name = 'Fresh Foods BD' LIMIT 1), 'Dhaka-Food-WH', now(), now()),
('550e8400-e29b-41d4-a716-446655441012', 150, 30, 500, 15, (SELECT id FROM vendors WHERE business_name = 'Fresh Foods BD' LIMIT 1), 'Dhaka-Food-WH', now(), now());

-- 2. ORDERS (E-commerce transactions)
INSERT INTO orders (id, customer_id, order_number, total_amount, shipping_address, payment_method, status, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655442001', '550e8400-e29b-41d4-a716-446655440002', 'ORD-20250703-000001', 7700.00, 
  jsonb_build_object('street', 'House 15, Road 5', 'area', 'Dhanmondi', 'city', 'Dhaka', 'postal_code', '1205', 'country', 'Bangladesh'), 
  'bkash'::payment_method, 'delivered'::order_status, now() - interval '15 days', now() - interval '10 days'),

('550e8400-e29b-41d4-a716-446655442002', '550e8400-e29b-41d4-a716-446655440003', 'ORD-20250703-000002', 42000.00, 
  jsonb_build_object('street', 'Flat 3A, Block C', 'area', 'Gulshan', 'city', 'Dhaka', 'postal_code', '1212', 'country', 'Bangladesh'), 
  'nagad'::payment_method, 'delivered'::order_status, now() - interval '12 days', now() - interval '8 days'),

('550e8400-e29b-41d4-a716-446655442003', '550e8400-e29b-41d4-a716-446655440002', 'ORD-20250703-000003', 4500.00, 
  jsonb_build_object('street', 'House 25, Lane 3', 'area', 'Uttara', 'city', 'Dhaka', 'postal_code', '1230', 'country', 'Bangladesh'), 
  'rocket'::payment_method, 'processing'::order_status, now() - interval '3 days', now() - interval '2 days'),

('550e8400-e29b-41d4-a716-446655442004', '550e8400-e29b-41d4-a716-446655440003', 'ORD-20250703-000004', 1030.00, 
  jsonb_build_object('street', 'House 8, Road 12', 'area', 'Mirpur', 'city', 'Dhaka', 'postal_code', '1216', 'country', 'Bangladesh'), 
  'card'::payment_method, 'shipped'::order_status, now() - interval '5 days', now() - interval '1 day');

-- 3. ORDER ITEMS (Product details for each order)
INSERT INTO order_items (id, order_id, product_id, vendor_id, quantity, unit_price, total_price, created_at) VALUES
-- Order 1 items (Saree + Face wash bulk)
('550e8400-e29b-41d4-a716-446655443001', '550e8400-e29b-41d4-a716-446655442001', '550e8400-e29b-41d4-a716-446655441001', 
  (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), 2, 2500.00, 5000.00, now() - interval '15 days'),
('550e8400-e29b-41d4-a716-446655443002', '550e8400-e29b-41d4-a716-446655442001', '550e8400-e29b-41d4-a716-446655441009', 
  (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 15, 180.00, 2700.00, now() - interval '15 days'),

-- Order 2 items (Smartphone)
('550e8400-e29b-41d4-a716-446655443003', '550e8400-e29b-41d4-a716-446655442002', '550e8400-e29b-41d4-a716-446655441004', 
  (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), 1, 42000.00, 42000.00, now() - interval '12 days'),

-- Order 3 items (Dinner set)
('550e8400-e29b-41d4-a716-446655443004', '550e8400-e29b-41d4-a716-446655442003', '550e8400-e29b-41d4-a716-446655441007', 
  (SELECT id FROM vendors WHERE business_name = 'Home Essentials BD' LIMIT 1), 1, 4500.00, 4500.00, now() - interval '3 days'),

-- Order 4 items (Health products)
('550e8400-e29b-41d4-a716-446655443005', '550e8400-e29b-41d4-a716-446655442004', '550e8400-e29b-41d4-a716-446655441010', 
  (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 1, 850.00, 850.00, now() - interval '5 days'),
('550e8400-e29b-41d4-a716-446655443006', '550e8400-e29b-41d4-a716-446655442004', '550e8400-e29b-41d4-a716-446655441009', 
  (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 1, 180.00, 180.00, now() - interval '5 days');

-- 4. PAYMENT TRANSACTIONS (Financial records)  
INSERT INTO payment_transactions (id, order_id, payment_gateway_id, transaction_id, amount, currency, status, payment_method, initiated_at, processed_at, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655444001', '550e8400-e29b-41d4-a716-446655442001', 
  (SELECT id FROM payment_gateways WHERE name = 'bKash Bangladesh' LIMIT 1), 'TXN-001-' || extract(epoch from now())::text, 
  7700.00, 'BDT', 'completed', 'bkash', now() - interval '15 days', now() - interval '15 days', now() - interval '15 days', now() - interval '15 days'),

('550e8400-e29b-41d4-a716-446655444002', '550e8400-e29b-41d4-a716-446655442002', 
  (SELECT id FROM payment_gateways WHERE name = 'Nagad Bangladesh' LIMIT 1), 'TXN-002-' || extract(epoch from now())::text, 
  42000.00, 'BDT', 'completed', 'nagad', now() - interval '12 days', now() - interval '12 days', now() - interval '12 days', now() - interval '12 days'),

('550e8400-e29b-41d4-a716-446655444003', '550e8400-e29b-41d4-a716-446655442003', 
  (SELECT id FROM payment_gateways WHERE name = 'Rocket (Dutch Bangla)' LIMIT 1), 'TXN-003-' || extract(epoch from now())::text, 
  4500.00, 'BDT', 'pending', 'rocket', now() - interval '3 days', NULL, now() - interval '3 days', now() - interval '3 days'),

('550e8400-e29b-41d4-a716-446655444004', '550e8400-e29b-41d4-a716-446655442004', 
  (SELECT id FROM payment_gateways WHERE name = 'SSLCOMMERZ' LIMIT 1), 'TXN-004-' || extract(epoch from now())::text, 
  1030.00, 'BDT', 'completed', 'card', now() - interval '5 days', now() - interval '5 days', now() - interval '5 days', now() - interval '5 days');

-- Continue with next phase...