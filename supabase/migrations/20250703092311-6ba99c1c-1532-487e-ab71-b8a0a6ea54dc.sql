-- CRITICAL DATABASE AUDIT & COMPREHENSIVE DATA POPULATION
-- Phase 1: Core Business Data Population

-- 1. USERS & PROFILES (Critical Foundation)
INSERT INTO users (id, email, full_name, phone, created_at, last_login) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@getit.com.bd', 'System Administrator', '+8801711000001', now(), now()),
('550e8400-e29b-41d4-a716-446655440002', 'customer1@gmail.com', 'Ahmed Rahman', '+8801711000002', now(), now()),
('550e8400-e29b-41d4-a716-446655440003', 'customer2@gmail.com', 'Fatima Khatun', '+8801711000003', now(), now()),
('550e8400-e29b-41d4-a716-446655440004', 'vendor1@shop.com', 'Karim Textiles Owner', '+8801711000004', now(), now()),
('550e8400-e29b-41d4-a716-446655440005', 'vendor2@store.com', 'Rahman Electronics', '+8801711000005', now(), now());

-- Update existing profiles with more complete data
UPDATE profiles SET 
    full_name = CASE 
        WHEN id = '550e8400-e29b-41d4-a716-446655440001' THEN 'System Administrator'
        WHEN id = '550e8400-e29b-41d4-a716-446655440002' THEN 'Ahmed Rahman'
        WHEN id = '550e8400-e29b-41d4-a716-446655440003' THEN 'Fatima Khatun'
        ELSE full_name
    END,
    avatar_url = CASE
        WHEN id = '550e8400-e29b-41d4-a716-446655440001' THEN 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
        WHEN id = '550e8400-e29b-41d4-a716-446655440002' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
        WHEN id = '550e8400-e29b-41d4-a716-446655440003' THEN 'https://images.unsplash.com/photo-1494790108755-2616b88db8b3?w=100'
        ELSE avatar_url
    END,
    preferences = jsonb_build_object(
        'language', 'bn',
        'currency', 'BDT',
        'notifications', jsonb_build_object(
            'email', true,
            'sms', true,
            'push', true
        ),
        'theme', 'light'
    )
WHERE id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003');

-- 2. PRODUCTS CORE DATA (Missing critical product data)
INSERT INTO products (id, name, description, price, vendor_id, category_id, sku, status, created_at) VALUES
-- Fashion Products
('prod-001', 'Premium Cotton Saree', 'Beautiful handwoven cotton saree with traditional Bengali designs', 2500.00, (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), (SELECT id FROM categories WHERE name = 'Fashion & Clothing' LIMIT 1), 'SAR-001', 'active', now()),
('prod-002', 'Designer Punjabi for Men', 'Elegant cotton punjabi perfect for festivals', 1800.00, (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), (SELECT id FROM categories WHERE name = 'Fashion & Clothing' LIMIT 1), 'PUN-001', 'active', now()),
('prod-003', 'Embroidered Salwar Kameez', 'Traditional three-piece dress with intricate embroidery', 3200.00, (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), (SELECT id FROM categories WHERE name = 'Fashion & Clothing' LIMIT 1), 'SAL-001', 'active', now()),

-- Electronics Products
('prod-004', 'Samsung Galaxy A54 5G', 'Latest Android smartphone with 128GB storage', 42000.00, (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), (SELECT id FROM categories WHERE name = 'Electronics & Gadgets' LIMIT 1), 'PHN-001', 'active', now()),
('prod-005', 'Sony Bluetooth Headphones', 'Wireless noise-canceling headphones', 8500.00, (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), (SELECT id FROM categories WHERE name = 'Electronics & Gadgets' LIMIT 1), 'HDP-001', 'active', now()),
('prod-006', 'Xiaomi Smart TV 43"', 'Full HD Smart Android TV with Netflix', 35000.00, (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), (SELECT id FROM categories WHERE name = 'Electronics & Gadgets' LIMIT 1), 'TV-001', 'active', now()),

-- Home & Kitchen Products  
('prod-007', 'Steel Dinner Set 24 Pieces', 'Premium stainless steel dinner set for family', 4500.00, (SELECT id FROM vendors WHERE business_name = 'Home Essentials BD' LIMIT 1), (SELECT id FROM categories WHERE name = 'Home & Kitchen' LIMIT 1), 'KIT-001', 'active', now()),
('prod-008', 'Bed Sheet Set King Size', 'Cotton bed sheet set with pillow covers', 2200.00, (SELECT id FROM vendors WHERE business_name = 'Home Essentials BD' LIMIT 1), (SELECT id FROM categories WHERE name = 'Home & Kitchen' LIMIT 1), 'BED-001', 'active', now()),

-- Health & Beauty Products
('prod-009', 'Himalaya Face Wash', 'Neem and turmeric face wash for all skin types', 180.00, (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), (SELECT id FROM categories WHERE name = 'Health & Beauty' LIMIT 1), 'COS-001', 'active', now()),
('prod-010', 'Vitamin D3 Supplements', 'High-quality vitamin D3 tablets - 60 capsules', 850.00, (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), (SELECT id FROM categories WHERE name = 'Health & Beauty' LIMIT 1), 'SUP-001', 'active', now()),

-- Food & Groceries Products
('prod-011', 'Bashundhara Rice 5KG', 'Premium quality miniket rice from Bangladesh', 320.00, (SELECT id FROM vendors WHERE business_name = 'Fresh Foods BD' LIMIT 1), (SELECT id FROM categories WHERE name = 'Food & Groceries' LIMIT 1), 'GRC-001', 'active', now()),
('prod-012', 'Pran Mixed Spice Powder', 'Authentic Bengali spice mix for cooking', 95.00, (SELECT id FROM vendors WHERE business_name = 'Fresh Foods BD' LIMIT 1), (SELECT id FROM categories WHERE name = 'Food & Groceries' LIMIT 1), 'SPC-001', 'active', now());

-- 3. PRODUCT INVENTORY (Critical for order processing)
INSERT INTO product_inventory (product_id, current_stock, minimum_stock_level, maximum_stock_level, reserved_stock, vendor_id, warehouse_location, created_at, updated_at) VALUES
('prod-001', 45, 10, 100, 5, (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), 'Dhaka-Central-WH', now(), now()),
('prod-002', 32, 8, 80, 3, (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), 'Dhaka-Central-WH', now(), now()),
('prod-003', 28, 5, 60, 2, (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), 'Dhaka-Central-WH', now(), now()),
('prod-004', 15, 5, 50, 2, (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), 'Chittagong-Tech-WH', now(), now()),
('prod-005', 22, 10, 100, 3, (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), 'Chittagong-Tech-WH', now(), now()),
('prod-006', 8, 3, 25, 1, (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), 'Chittagong-Tech-WH', now(), now()),
('prod-007', 18, 5, 50, 2, (SELECT id FROM vendors WHERE business_name = 'Home Essentials BD' LIMIT 1), 'Sylhet-Home-WH', now(), now()),
('prod-008', 35, 15, 100, 5, (SELECT id FROM vendors WHERE business_name = 'Home Essentials BD' LIMIT 1), 'Sylhet-Home-WH', now(), now()),
('prod-009', 120, 50, 500, 20, (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 'Dhaka-Beauty-WH', now(), now()),
('prod-010', 85, 25, 200, 10, (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 'Dhaka-Beauty-WH', now(), now()),
('prod-011', 200, 50, 1000, 25, (SELECT id FROM vendors WHERE business_name = 'Fresh Foods BD' LIMIT 1), 'Dhaka-Food-WH', now(), now()),
('prod-012', 150, 30, 500, 15, (SELECT id FROM vendors WHERE business_name = 'Fresh Foods BD' LIMIT 1), 'Dhaka-Food-WH', now(), now());

-- 4. ORDERS & ORDER ITEMS (Critical for sales data)
INSERT INTO orders (id, user_id, total_amount, shipping_address, payment_method, order_status, created_at, updated_at) VALUES
('order-001', '550e8400-e29b-41d4-a716-446655440002', 7700.00, jsonb_build_object('street', 'House 15, Road 5', 'area', 'Dhanmondi', 'city', 'Dhaka', 'postal_code', '1205', 'country', 'Bangladesh'), 'bkash', 'delivered', now() - interval '15 days', now() - interval '10 days'),
('order-002', '550e8400-e29b-41d4-a716-446655440003', 42000.00, jsonb_build_object('street', 'Flat 3A, Block C', 'area', 'Gulshan', 'city', 'Dhaka', 'postal_code', '1212', 'country', 'Bangladesh'), 'nagad', 'delivered', now() - interval '12 days', now() - interval '8 days'),
('order-003', '550e8400-e29b-41d4-a716-446655440002', 4500.00, jsonb_build_object('street', 'House 25, Lane 3', 'area', 'Uttara', 'city', 'Dhaka', 'postal_code', '1230', 'country', 'Bangladesh'), 'rocket', 'processing', now() - interval '3 days', now() - interval '2 days'),
('order-004', '550e8400-e29b-41d4-a716-446655440003', 1030.00, jsonb_build_object('street', 'House 8, Road 12', 'area', 'Mirpur', 'city', 'Dhaka', 'postal_code', '1216', 'country', 'Bangladesh'), 'card', 'shipped', now() - interval '5 days', now() - interval '1 day');

INSERT INTO order_items (id, order_id, product_id, vendor_id, quantity, unit_price, total_price, commission_rate, created_at) VALUES
-- Order 1 items
('oi-001', 'order-001', 'prod-001', (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), 2, 2500.00, 5000.00, 12.5, now() - interval '15 days'),
('oi-002', 'order-001', 'prod-009', (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 15, 180.00, 2700.00, 15.0, now() - interval '15 days'),

-- Order 2 items  
('oi-003', 'order-002', 'prod-004', (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), 1, 42000.00, 42000.00, 8.5, now() - interval '12 days'),

-- Order 3 items
('oi-004', 'order-003', 'prod-007', (SELECT id FROM vendors WHERE business_name = 'Home Essentials BD' LIMIT 1), 1, 4500.00, 4500.00, 10.0, now() - interval '3 days'),

-- Order 4 items
('oi-005', 'order-004', 'prod-010', (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 1, 850.00, 850.00, 15.0, now() - interval '5 days'),
('oi-006', 'order-004', 'prod-009', (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 1, 180.00, 180.00, 15.0, now() - interval '5 days');

-- 5. VENDOR COMMISSIONS (Critical for financial tracking)
INSERT INTO vendor_commissions (id, vendor_id, order_item_id, gross_amount, commission_amount, commission_rate, platform_fee, net_commission, transaction_date, status, created_at) VALUES
('vc-001', (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), 'oi-001', 5000.00, 625.00, 12.5, 62.50, 562.50, now() - interval '15 days', 'paid', now() - interval '15 days'),
('vc-002', (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 'oi-002', 2700.00, 405.00, 15.0, 40.50, 364.50, now() - interval '15 days', 'paid', now() - interval '15 days'),
('vc-003', (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), 'oi-003', 42000.00, 3570.00, 8.5, 357.00, 3213.00, now() - interval '12 days', 'paid', now() - interval '12 days'),
('vc-004', (SELECT id FROM vendors WHERE business_name = 'Home Essentials BD' LIMIT 1), 'oi-004', 4500.00, 450.00, 10.0, 45.00, 405.00, now() - interval '3 days', 'pending', now() - interval '3 days'),
('vc-005', (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 'oi-005', 850.00, 127.50, 15.0, 12.75, 114.75, now() - interval '5 days', 'pending', now() - interval '5 days'),
('vc-006', (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 'oi-006', 180.00, 27.00, 15.0, 2.70, 24.30, now() - interval '5 days', 'pending', now() - interval '5 days');

-- 6. PAYMENT TRANSACTIONS (Critical for payment processing)
INSERT INTO payment_transactions (id, order_id, user_id, amount, payment_method, gateway_transaction_id, status, created_at, updated_at) VALUES
('pt-001', 'order-001', '550e8400-e29b-41d4-a716-446655440002', 7700.00, 'bkash', 'BKS' || to_char(now(), 'YYYYMMDDHH24MISS') || '001', 'completed', now() - interval '15 days', now() - interval '15 days'),
('pt-002', 'order-002', '550e8400-e29b-41d4-a716-446655440003', 42000.00, 'nagad', 'NGD' || to_char(now(), 'YYYYMMDDHH24MISS') || '002', 'completed', now() - interval '12 days', now() - interval '12 days'),
('pt-003', 'order-003', '550e8400-e29b-41d4-a716-446655440002', 4500.00, 'rocket', 'RKT' || to_char(now(), 'YYYYMMDDHH24MISS') || '003', 'pending', now() - interval '3 days', now() - interval '3 days'),
('pt-004', 'order-004', '550e8400-e29b-41d4-a716-446655440003', 1030.00, 'card', 'CRD' || to_char(now(), 'YYYYMMDDHH24MISS') || '004', 'completed', now() - interval '5 days', now() - interval '5 days');

-- 7. ANALYTICS EVENTS (Critical for business intelligence)
INSERT INTO analytics_events (id, user_id, session_id, event_category, event_name, event_action, event_value, custom_properties, created_at) VALUES
('ae-001', '550e8400-e29b-41d4-a716-446655440002', 'sess_001', 'ecommerce', 'purchase', 'order_completed', 7700.00, jsonb_build_object('order_id', 'order-001', 'items_count', 2, 'payment_method', 'bkash'), now() - interval '15 days'),
('ae-002', '550e8400-e29b-41d4-a716-446655440003', 'sess_002', 'ecommerce', 'purchase', 'order_completed', 42000.00, jsonb_build_object('order_id', 'order-002', 'items_count', 1, 'payment_method', 'nagad'), now() - interval '12 days'),
('ae-003', '550e8400-e29b-41d4-a716-446655440002', 'sess_003', 'product', 'view', 'product_viewed', NULL, jsonb_build_object('product_id', 'prod-007', 'category', 'Home & Kitchen'), now() - interval '3 days'),
('ae-004', '550e8400-e29b-41d4-a716-446655440003', 'sess_004', 'search', 'query', 'search_performed', NULL, jsonb_build_object('query', 'smartphone', 'results_count', 5), now() - interval '5 days'),
('ae-005', NULL, 'sess_005', 'page', 'view', 'homepage_viewed', NULL, jsonb_build_object('referrer', 'google.com', 'device', 'mobile'), now() - interval '1 day');

-- Continue in next part...