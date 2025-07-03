-- FINAL DATABASE AUDIT - Complete Business Data Population (Fixed UUID casting)

-- 1. Create vendors
INSERT INTO vendors (id, business_name, trade_license, status, commission_rate, total_sales, rating, is_active)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'TechHub Bangladesh', 'TL-001-2024', 'approved'::vendor_status, 12.5, 0, 4.5, true),
    ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Fashion Forward BD', 'TL-002-2024', 'approved'::vendor_status, 15.0, 0, 4.2, true),
    ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Book World BD', 'TL-003-2024', 'approved'::vendor_status, 10.0, 0, 4.8, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Update products to assign them to vendors
UPDATE products SET 
    vendor_id = CASE 
        WHEN name ILIKE '%laptop%' OR name ILIKE '%phone%' OR name ILIKE '%electronic%' THEN '550e8400-e29b-41d4-a716-446655440001'::uuid
        WHEN name ILIKE '%dress%' OR name ILIKE '%shirt%' OR name ILIKE '%fashion%' OR name ILIKE '%clothing%' THEN '550e8400-e29b-41d4-a716-446655440002'::uuid
        ELSE '550e8400-e29b-41d4-a716-446655440003'::uuid
    END
WHERE vendor_id IS NULL;

-- 3. Product inventory
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

-- 4. Simple orders (25 orders)
WITH order_inserts AS (
  INSERT INTO orders (user_id, vendor_id, order_number, status, total_amount, shipping_address, payment_method, payment_status, created_at, estimated_delivery)
  SELECT 
      (SELECT id FROM users ORDER BY RANDOM() LIMIT 1),
      (SELECT id FROM vendors ORDER BY RANDOM() LIMIT 1),
      'ORD-' || TO_CHAR(NOW() - (n * INTERVAL '1 day'), 'YYYYMMDD') || '-' || LPAD(n::TEXT, 6, '0'),
      CASE 
          WHEN RANDOM() < 0.6 THEN 'delivered'::order_status
          WHEN RANDOM() < 0.8 THEN 'shipped'::order_status
          WHEN RANDOM() < 0.9 THEN 'processing'::order_status
          ELSE 'pending'::order_status
      END,
      ROUND((RANDOM() * 3000 + 500)::NUMERIC, 2),
      jsonb_build_object('street', 'House ' || FLOOR(RANDOM() * 200 + 1)::TEXT, 'area', 'Dhanmondi', 'city', 'Dhaka'),
      CASE 
          WHEN RANDOM() < 0.4 THEN 'bkash'
          WHEN RANDOM() < 0.7 THEN 'nagad'
          ELSE 'card'
      END,
      CASE 
          WHEN RANDOM() < 0.8 THEN 'completed'::payment_status
          ELSE 'pending'::payment_status
      END,
      NOW() - (n * INTERVAL '1 day'),
      NOW() - (n * INTERVAL '1 day') + INTERVAL '3 days'
  FROM generate_series(1, 25) as n
  RETURNING id, vendor_id
)
-- 5. Order items
INSERT INTO order_items (order_id, product_id, vendor_id, quantity, unit_price, total_price, discount_applied)
SELECT 
    oi.id,
    p.id,
    oi.vendor_id,
    FLOOR(RANDOM() * 3 + 1)::INTEGER,
    p.price,
    p.price * FLOOR(RANDOM() * 3 + 1)::INTEGER,
    CASE WHEN RANDOM() < 0.3 THEN ROUND((RANDOM() * 100)::NUMERIC, 2) ELSE 0 END
FROM order_inserts oi,
     (SELECT * FROM products ORDER BY RANDOM() LIMIT 2) p;

-- 6. Vendor commissions
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