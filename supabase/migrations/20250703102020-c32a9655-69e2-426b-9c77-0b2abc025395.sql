-- COMPREHENSIVE DATABASE AUDIT COMPLETION - All Critical Tables Population

-- 1. Create vendors
INSERT INTO vendors (id, business_name, trade_license, status, commission_rate, total_sales, rating, is_active)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'TechHub Bangladesh', 'TL-001-2024', 'approved'::vendor_status, 12.5, 150000, 4.5, true),
    ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Fashion Forward BD', 'TL-002-2024', 'approved'::vendor_status, 15.0, 200000, 4.2, true),
    ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Book World BD', 'TL-003-2024', 'approved'::vendor_status, 10.0, 80000, 4.8, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Update products to assign vendors
UPDATE products SET 
    vendor_id = CASE 
        WHEN name ILIKE '%laptop%' OR name ILIKE '%phone%' OR name ILIKE '%electronic%' THEN '550e8400-e29b-41d4-a716-446655440001'::uuid
        WHEN name ILIKE '%dress%' OR name ILIKE '%shirt%' OR name ILIKE '%fashion%' OR name ILIKE '%clothing%' THEN '550e8400-e29b-41d4-a716-446655440002'::uuid
        ELSE '550e8400-e29b-41d4-a716-446655440003'::uuid
    END
WHERE vendor_id IS NULL;

-- 3. Product inventory with correct structure
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
WHERE p.vendor_id IS NOT NULL;

-- 4. Orders with correct column names
INSERT INTO orders (customer_id, order_number, status, payment_method, payment_status, total_amount, shipping_address, subtotal, tax_amount, shipping_amount, estimated_delivery, created_at)
SELECT 
    (SELECT id FROM users ORDER BY RANDOM() LIMIT 1),
    'ORD-' || TO_CHAR(NOW() - (n * INTERVAL '1 day'), 'YYYYMMDD') || '-' || LPAD(n::TEXT, 6, '0'),
    CASE 
        WHEN RANDOM() < 0.6 THEN 'delivered'::order_status
        WHEN RANDOM() < 0.8 THEN 'shipped'::order_status
        WHEN RANDOM() < 0.9 THEN 'processing'::order_status
        ELSE 'pending'::order_status
    END,
    CASE 
        WHEN RANDOM() < 0.4 THEN 'bkash'::payment_method
        WHEN RANDOM() < 0.7 THEN 'nagad'::payment_method
        WHEN RANDOM() < 0.85 THEN 'rocket'::payment_method
        ELSE 'card'::payment_method
    END,
    CASE 
        WHEN RANDOM() < 0.8 THEN 'completed'
        ELSE 'pending'
    END,
    ROUND((RANDOM() * 3000 + 500)::NUMERIC, 2),
    jsonb_build_object('street', 'House ' || FLOOR(RANDOM() * 200 + 1)::TEXT, 'area', 'Dhanmondi', 'city', 'Dhaka', 'postal_code', '1205'),
    ROUND((RANDOM() * 2500 + 400)::NUMERIC, 2),
    ROUND((RANDOM() * 200 + 50)::NUMERIC, 2),
    ROUND((RANDOM() * 150 + 50)::NUMERIC, 2),
    CURRENT_DATE + (n % 7 + 1),
    NOW() - (n * INTERVAL '1 day')
FROM generate_series(1, 30) as n;

-- 5. Order items (linking orders to products)
INSERT INTO order_items (order_id, product_id, vendor_id, quantity, unit_price, total_price, discount_applied)
SELECT 
    o.id,
    p.id,
    p.vendor_id,
    FLOOR(RANDOM() * 3 + 1)::INTEGER,
    p.price,
    p.price * FLOOR(RANDOM() * 3 + 1)::INTEGER,
    CASE WHEN RANDOM() < 0.3 THEN ROUND((RANDOM() * 100)::NUMERIC, 2) ELSE 0 END
FROM orders o
CROSS JOIN LATERAL (
    SELECT * FROM products 
    ORDER BY RANDOM() 
    LIMIT 2
) p;

-- 6. Vendor commissions based on actual orders
INSERT INTO vendor_commissions (vendor_id, order_id, gross_amount, commission_rate, commission_amount, platform_fee, net_commission, transaction_date, status)
SELECT 
    oi.vendor_id,
    oi.order_id,
    SUM(oi.total_price),
    CASE 
        WHEN oi.vendor_id = '550e8400-e29b-41d4-a716-446655440001'::uuid THEN 12.5
        WHEN oi.vendor_id = '550e8400-e29b-41d4-a716-446655440002'::uuid THEN 15.0
        ELSE 10.0
    END,
    SUM(oi.total_price) * 0.125,
    SUM(oi.total_price) * 0.125 * 0.2,
    SUM(oi.total_price) * 0.125 * 0.8,
    o.created_at::DATE,
    CASE 
        WHEN o.status = 'delivered' THEN 'processed'::commission_status
        WHEN o.status IN ('shipped', 'processing') THEN 'pending'::commission_status
        ELSE 'on_hold'::commission_status
    END
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
GROUP BY oi.vendor_id, oi.order_id, o.created_at, o.status;