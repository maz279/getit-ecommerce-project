-- FIXED PHASE 2: Orders, Inventory, Payments & Analytics Data
-- Using correct table schemas

-- 1. PRODUCT INVENTORY (Fixed column names)
INSERT INTO product_inventory (product_id, vendor_id, sku, current_stock, reserved_stock, minimum_stock_level, maximum_stock_level, reorder_point, unit_cost, selling_price, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655441001', (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), 'SAR-001', 45, 5, 10, 100, 15, 1800.00, 2500.00, now(), now()),
('550e8400-e29b-41d4-a716-446655441002', (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), 'PUN-001', 32, 3, 8, 80, 12, 1200.00, 1800.00, now(), now()),
('550e8400-e29b-41d4-a716-446655441003', (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), 'SAL-001', 28, 2, 5, 60, 8, 2400.00, 3200.00, now(), now()),
('550e8400-e29b-41d4-a716-446655441004', (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), 'PHN-001', 15, 2, 5, 50, 10, 38000.00, 42000.00, now(), now()),
('550e8400-e29b-41d4-a716-446655441005', (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), 'HDP-001', 22, 3, 10, 100, 15, 7200.00, 8500.00, now(), now()),
('550e8400-e29b-41d4-a716-446655441006', (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), 'TV-001', 8, 1, 3, 25, 5, 32000.00, 35000.00, now(), now()),
('550e8400-e29b-41d4-a716-446655441007', (SELECT id FROM vendors WHERE business_name = 'Home Essentials BD' LIMIT 1), 'KIT-001', 18, 2, 5, 50, 10, 3800.00, 4500.00, now(), now()),
('550e8400-e29b-41d4-a716-446655441008', (SELECT id FROM vendors WHERE business_name = 'Home Essentials BD' LIMIT 1), 'BED-001', 35, 5, 15, 100, 20, 1800.00, 2200.00, now(), now()),
('550e8400-e29b-41d4-a716-446655441009', (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 'COS-001', 120, 20, 50, 500, 75, 140.00, 180.00, now(), now()),
('550e8400-e29b-41d4-a716-446655441010', (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 'SUP-001', 85, 10, 25, 200, 40, 680.00, 850.00, now(), now()),
('550e8400-e29b-41d4-a716-446655441011', (SELECT id FROM vendors WHERE business_name = 'Fresh Foods BD' LIMIT 1), 'GRC-001', 200, 25, 50, 1000, 75, 280.00, 320.00, now(), now()),
('550e8400-e29b-41d4-a716-446655441012', (SELECT id FROM vendors WHERE business_name = 'Fresh Foods BD' LIMIT 1), 'SPC-001', 150, 15, 30, 500, 50, 75.00, 95.00, now(), now());

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

-- Continue with analytics and business intelligence data...