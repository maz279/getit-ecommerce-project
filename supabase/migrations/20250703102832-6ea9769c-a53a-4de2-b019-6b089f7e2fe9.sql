-- FINAL COMPREHENSIVE DATABASE AUDIT - ALL CRITICAL BUSINESS TABLES

-- 1. Create vendors (3 verified vendors)
INSERT INTO vendors (id, business_name, trade_license, status, commission_rate, total_sales, rating, is_active)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'TechHub Bangladesh', 'TL-001-2024', 'approved'::vendor_status, 12.5, 150000, 4.5, true),
    ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Fashion Forward BD', 'TL-002-2024', 'approved'::vendor_status, 15.0, 200000, 4.2, true),
    ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Book World BD', 'TL-003-2024', 'approved'::vendor_status, 10.0, 80000, 4.8, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Assign all products to vendors
UPDATE products SET 
    vendor_id = CASE 
        WHEN name ILIKE '%laptop%' OR name ILIKE '%phone%' OR name ILIKE '%electronic%' THEN '550e8400-e29b-41d4-a716-446655440001'::uuid
        WHEN name ILIKE '%dress%' OR name ILIKE '%shirt%' OR name ILIKE '%fashion%' OR name ILIKE '%clothing%' THEN '550e8400-e29b-41d4-a716-446655440002'::uuid
        ELSE '550e8400-e29b-41d4-a716-446655440003'::uuid
    END
WHERE vendor_id IS NULL;

-- 3. Product inventory for all products
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

-- 4. Create orders (30 orders with realistic data)
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
        WHEN RANDOM() < 0.6 THEN 'nagad'::payment_method
        WHEN RANDOM() < 0.8 THEN 'rocket'::payment_method
        WHEN RANDOM() < 0.9 THEN 'sslcommerz'::payment_method
        ELSE 'cod'::payment_method
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

-- 5. Order items (2-3 items per order)
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

-- 6. Vendor commissions based on orders
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

-- 7. Essential additional data
-- Flash sales
INSERT INTO flash_sales (title, description, start_time, end_time, discount_percentage, max_discount_amount, is_active, featured_image, terms_conditions)
VALUES 
    ('Mega Weekend Sale', 'Up to 50% off on electronics and fashion', NOW() + INTERVAL '1 day', NOW() + INTERVAL '3 days', 30, 1000, true, 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800', '["Limited time", "While stocks last"]'::jsonb),
    ('Flash Fashion Friday', 'Special discounts on fashion items', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2.5 days', 25, 500, true, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', '["Fashion only", "Terms apply"]'::jsonb);

-- Product reviews
INSERT INTO product_reviews (product_id, user_id, vendor_id, rating, title, comment, is_verified_purchase, helpful_count, created_at)
SELECT 
    p.id,
    u.id,
    p.vendor_id,
    FLOOR(RANDOM() * 5 + 1)::INTEGER,
    'Great product!',
    'Excellent quality and fast delivery. Highly recommend!',
    true,
    FLOOR(RANDOM() * 20)::INTEGER,
    NOW() - (RANDOM() * INTERVAL '60 days')
FROM products p
CROSS JOIN (SELECT id FROM users ORDER BY RANDOM() LIMIT 2) u
WHERE RANDOM() < 0.4;

-- Search queries
INSERT INTO search_queries (user_id, query_text, search_type, results_count, clicked_position, session_id, search_filters, created_at)
SELECT 
    u.id,
    CASE 
        WHEN RANDOM() < 0.3 THEN 'laptop'
        WHEN RANDOM() < 0.6 THEN 'women dress'
        ELSE 'mobile phone'
    END,
    'text',
    FLOOR(RANDOM() * 50 + 5)::INTEGER,
    FLOOR(RANDOM() * 10 + 1)::INTEGER,
    'sess_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 16),
    jsonb_build_object('category', 'electronics', 'price_range', jsonb_build_object('min', 100, 'max', 5000)),
    NOW() - (RANDOM() * INTERVAL '30 days')
FROM users u
CROSS JOIN generate_series(1, 50);

-- Analytics events
INSERT INTO analytics_events (user_id, session_id, event_category, event_name, event_action, event_label, page_url, created_at)
SELECT 
    u.id,
    'sess_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 16),
    'ecommerce',
    'page_view',
    'view',
    'product_page',
    'https://getit.com/products',
    NOW() - (RANDOM() * INTERVAL '7 days')
FROM users u
CROSS JOIN generate_series(1, 100);

-- Platform metrics
INSERT INTO platform_metrics (metric_name, metric_value, metric_type, measurement_period, tags, measured_at, metadata)
VALUES 
    ('daily_active_users', 1200, 'counter', 'daily', '{"source": "system"}'::jsonb, NOW(), '{"calculation": "real_time"}'::jsonb),
    ('total_orders_today', 85, 'counter', 'daily', '{"source": "orders"}'::jsonb, NOW(), '{"calculation": "real_time"}'::jsonb),
    ('average_order_value', 1850, 'gauge', 'daily', '{"source": "sales"}'::jsonb, NOW(), '{"calculation": "real_time"}'::jsonb),
    ('conversion_rate', 3.2, 'percentage', 'daily', '{"source": "analytics"}'::jsonb, NOW(), '{"calculation": "real_time"}'::jsonb);