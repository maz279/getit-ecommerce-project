-- FINAL DATABASE AUDIT FIX - Part 1: Core Business Data
-- Populate essential business tables systematically

-- 1. PRODUCT INVENTORY
INSERT INTO product_inventory (product_id, vendor_id, current_stock, minimum_stock_level, maximum_stock_level, reorder_point, warehouse_location, unit_cost, last_restocked_at, stock_status)
SELECT 
    p.id,
    p.vendor_id,
    FLOOR(RANDOM() * 500 + 50)::INTEGER,
    20,
    1000,
    50,
    CASE WHEN RANDOM() < 0.5 THEN 'Dhaka Main Warehouse' ELSE 'Chittagong Distribution Center' END,
    p.price * 0.7,
    NOW() - (RANDOM() * INTERVAL '30 days'),
    CASE 
        WHEN RANDOM() < 0.8 THEN 'in_stock'::inventory_status
        WHEN RANDOM() < 0.95 THEN 'low_stock'::inventory_status
        ELSE 'out_of_stock'::inventory_status
    END
FROM products p
WHERE NOT EXISTS (SELECT 1 FROM product_inventory WHERE product_id = p.id);

-- 2. ORDERS
INSERT INTO orders (id, user_id, vendor_id, order_number, status, total_amount, shipping_address, payment_method, payment_status, created_at, estimated_delivery, actual_delivery)
SELECT 
    gen_random_uuid(),
    u.id,
    v.id,
    'ORD-' || TO_CHAR(NOW() - (gs.n * INTERVAL '1 day'), 'YYYYMMDD') || '-' || LPAD(gs.n::TEXT, 6, '0'),
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
    NOW() - (gs.n * INTERVAL '1 day'),
    NOW() - (gs.n * INTERVAL '1 day') + INTERVAL '3 days',
    CASE WHEN RANDOM() < 0.7 THEN NOW() - (gs.n * INTERVAL '1 day') + INTERVAL '2 days' ELSE NULL END
FROM (SELECT generate_series(1, 20) as n) gs
CROSS JOIN (SELECT id FROM users ORDER BY RANDOM() LIMIT 3) u
CROSS JOIN (SELECT id FROM vendors ORDER BY RANDOM() LIMIT 1) v;

-- 3. ORDER ITEMS
INSERT INTO order_items (order_id, product_id, vendor_id, quantity, unit_price, total_price, discount_applied)
SELECT 
    o.id,
    p.id,
    o.vendor_id,
    FLOOR(RANDOM() * 3 + 1)::INTEGER,
    p.price,
    p.price * FLOOR(RANDOM() * 3 + 1)::INTEGER,
    CASE WHEN RANDOM() < 0.3 THEN ROUND((RANDOM() * 100)::NUMERIC, 2) ELSE 0 END
FROM orders o
CROSS JOIN (SELECT * FROM products ORDER BY RANDOM() LIMIT 2) p;

-- 4. VENDOR COMMISSIONS
INSERT INTO vendor_commissions (vendor_id, order_id, gross_amount, commission_rate, commission_amount, platform_fee, net_commission, transaction_date, status)
SELECT 
    oi.vendor_id,
    oi.order_id,
    SUM(oi.total_price),
    12.5,
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

-- 5. FLASH SALES
INSERT INTO flash_sales (id, title, description, start_time, end_time, discount_percentage, max_discount_amount, is_active, featured_image, terms_conditions)
VALUES 
    (gen_random_uuid(), 'Mega Friday Flash Sale', 'Limited time offer with massive discounts!', NOW() + INTERVAL '1 day', NOW() + INTERVAL '2 days', 25, 500, true, 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800', '["Limited time offer", "While stocks last"]'::jsonb),
    (gen_random_uuid(), 'Weekend Special Deals', 'Weekend special offers on selected items', NOW() + INTERVAL '2 days', NOW() + INTERVAL '3 days', 20, 300, true, 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800', '["Weekend only", "Terms apply"]'::jsonb),
    (gen_random_uuid(), 'New Year Flash Sale', 'New year mega discounts', NOW() + INTERVAL '3 days', NOW() + INTERVAL '4 days', 30, 800, false, 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800', '["New year special"]'::jsonb);

-- 6. FLASH SALE PRODUCTS
INSERT INTO flash_sale_products (flash_sale_id, product_id, vendor_id, original_price, discounted_price, stock_allocated, stock_sold, max_quantity_per_customer)
SELECT 
    fs.id,
    p.id,
    p.vendor_id,
    p.price,
    ROUND((p.price * (1 - fs.discount_percentage / 100))::NUMERIC, 2),
    FLOOR(RANDOM() * 100 + 20)::INTEGER,
    FLOOR(RANDOM() * 30)::INTEGER,
    3
FROM flash_sales fs
CROSS JOIN (SELECT * FROM products ORDER BY RANDOM() LIMIT 3) p
WHERE fs.is_active = true;