-- Fix NULL vendor_id issue and populate core business data systematically

-- First, create vendors if they don't exist
INSERT INTO vendors (id, business_name, contact_person, email, phone, business_address, business_type, tax_id, trade_license, registration_status, commission_rate, created_at, updated_at)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'TechHub Bangladesh', 'Ahmed Hassan', 'ahmed@techhub.bd', '+8801712345678', jsonb_build_object('street', 'House 12, Road 5', 'area', 'Dhanmondi', 'city', 'Dhaka', 'postal_code', '1205'), 'electronics', 'TAX-001-2024', 'TL-001-2024', 'approved', 12.5, NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440002', 'Fashion Forward BD', 'Fatima Khan', 'fatima@fashionbd.com', '+8801812345678', jsonb_build_object('street', 'Shop 25, Level 3', 'area', 'Gulshan', 'city', 'Dhaka', 'postal_code', '1212'), 'fashion', 'TAX-002-2024', 'TL-002-2024', 'approved', 15.0, NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440003', 'Book World BD', 'Mohammad Rahman', 'rahman@bookworld.bd', '+8801912345678', jsonb_build_object('street', 'Plot 8, Road 10', 'area', 'Uttara', 'city', 'Dhaka', 'postal_code', '1230'), 'books_stationery', 'TAX-003-2024', 'TL-003-2024', 'approved', 10.0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Update products to assign them to vendors
UPDATE products SET 
    vendor_id = CASE 
        WHEN name ILIKE '%laptop%' OR name ILIKE '%phone%' OR name ILIKE '%electronic%' THEN '550e8400-e29b-41d4-a716-446655440001'
        WHEN name ILIKE '%dress%' OR name ILIKE '%shirt%' OR name ILIKE '%fashion%' OR name ILIKE '%clothing%' THEN '550e8400-e29b-41d4-a716-446655440002'
        ELSE '550e8400-e29b-41d4-a716-446655440003'
    END
WHERE vendor_id IS NULL;

-- Now populate core business tables with proper vendor relationships

-- 1. PRODUCT INVENTORY
INSERT INTO product_inventory (product_id, vendor_id, sku, current_stock, reserved_stock, minimum_stock_level, maximum_stock_level, reorder_point, unit_cost, selling_price, last_restocked_at)
SELECT 
    p.id,
    p.vendor_id,
    'SKU-' || SUBSTR(p.id::TEXT, 1, 8) || '-' || FLOOR(RANDOM() * 1000)::TEXT,
    FLOOR(RANDOM() * 500 + 50)::INTEGER,
    FLOOR(RANDOM() * 20)::INTEGER,
    20,
    1000,
    50,
    p.price * 0.7,
    p.price,
    NOW() - (RANDOM() * INTERVAL '30 days')
FROM products p
WHERE p.vendor_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM product_inventory WHERE product_id = p.id);

-- 2. ORDERS
INSERT INTO orders (id, user_id, vendor_id, order_number, status, total_amount, shipping_address, payment_method, payment_status, created_at, estimated_delivery, actual_delivery)
SELECT 
    gen_random_uuid(),
    u.id,
    v.id,
    'ORD-' || TO_CHAR(NOW() - (n * INTERVAL '1 day'), 'YYYYMMDD') || '-' || LPAD(n::TEXT, 6, '0'),
    CASE 
        WHEN RANDOM() < 0.6 THEN 'delivered'::order_status
        WHEN RANDOM() < 0.8 THEN 'shipped'::order_status
        WHEN RANDOM() < 0.9 THEN 'processing'::order_status
        ELSE 'pending'::order_status
    END,
    ROUND((RANDOM() * 3000 + 500)::NUMERIC, 2),
    jsonb_build_object(
        'street', 'House ' || FLOOR(RANDOM() * 200 + 1)::TEXT || ', Road ' || FLOOR(RANDOM() * 50 + 1)::TEXT,
        'area', CASE WHEN RANDOM() < 0.4 THEN 'Dhanmondi' WHEN RANDOM() < 0.7 THEN 'Gulshan' ELSE 'Banani' END,
        'city', 'Dhaka',
        'division', 'Dhaka',
        'postal_code', '1205',
        'country', 'Bangladesh'
    ),
    CASE 
        WHEN RANDOM() < 0.4 THEN 'bkash'
        WHEN RANDOM() < 0.7 THEN 'nagad'
        WHEN RANDOM() < 0.85 THEN 'rocket'
        ELSE 'card'
    END,
    CASE 
        WHEN RANDOM() < 0.8 THEN 'completed'::payment_status
        WHEN RANDOM() < 0.95 THEN 'pending'::payment_status
        ELSE 'failed'::payment_status
    END,
    NOW() - (n * INTERVAL '1 day'),
    NOW() - (n * INTERVAL '1 day') + INTERVAL '3 days',
    CASE WHEN RANDOM() < 0.7 THEN NOW() - (n * INTERVAL '1 day') + INTERVAL '2 days' ELSE NULL END
FROM generate_series(1, 15) as n
CROSS JOIN (SELECT id FROM users ORDER BY RANDOM() LIMIT 1) u
CROSS JOIN (SELECT id FROM vendors ORDER BY RANDOM() LIMIT 1) v;