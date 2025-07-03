-- FINAL COMPREHENSIVE DATABASE POPULATION 
-- Creating complete business data ecosystem systematically

-- 1. ANALYTICS EVENTS (Critical for business intelligence)
INSERT INTO analytics_events (id, user_id, session_id, event_category, event_name, event_action, event_value, custom_properties, created_at) VALUES
-- E-commerce events
('550e8400-e29b-41d4-a716-446655445001', '550e8400-e29b-41d4-a716-446655440002', 'sess_001', 'ecommerce', 'purchase', 'order_completed', 7700.00, 
  jsonb_build_object('order_id', '550e8400-e29b-41d4-a716-446655442001', 'items_count', 2, 'payment_method', 'bkash'), now() - interval '15 days'),

('550e8400-e29b-41d4-a716-446655445002', '550e8400-e29b-41d4-a716-446655440003', 'sess_002', 'ecommerce', 'purchase', 'order_completed', 42000.00, 
  jsonb_build_object('order_id', '550e8400-e29b-41d4-a716-446655442002', 'items_count', 1, 'payment_method', 'nagad'), now() - interval '12 days'),

-- Product interaction events  
('550e8400-e29b-41d4-a716-446655445003', '550e8400-e29b-41d4-a716-446655440002', 'sess_003', 'product', 'view', 'product_viewed', NULL, 
  jsonb_build_object('product_id', '550e8400-e29b-41d4-a716-446655441007', 'category', 'Home & Kitchen'), now() - interval '3 days'),

-- Search events
('550e8400-e29b-41d4-a716-446655445004', '550e8400-e29b-41d4-a716-446655440003', 'sess_004', 'search', 'query', 'search_performed', NULL, 
  jsonb_build_object('query', 'smartphone', 'results_count', 5), now() - interval '5 days'),

-- General engagement
('550e8400-e29b-41d4-a716-446655445005', NULL, 'sess_005', 'page', 'view', 'homepage_viewed', NULL, 
  jsonb_build_object('referrer', 'google.com', 'device', 'mobile'), now() - interval '1 day');

-- 2. VENDOR COMMISSIONS (Financial tracking)
INSERT INTO vendor_commissions (id, vendor_id, order_id, product_id, transaction_id, commission_type, commission_rate, gross_amount, commission_amount, platform_fee, net_commission, status, payment_status, transaction_date, created_at, updated_at) VALUES
-- Commissions for delivered orders
('550e8400-e29b-41d4-a716-446655446001', 
  (SELECT id FROM vendors LIMIT 1 OFFSET 0), '550e8400-e29b-41d4-a716-446655442001', '550e8400-e29b-41d4-a716-446655441001', 
  'TXN-COMM-001', 'sales', 12.5, 5000.00, 625.00, 62.50, 562.50, 'confirmed', 'paid', now() - interval '15 days', now() - interval '15 days', now() - interval '15 days'),

('550e8400-e29b-41d4-a716-446655446002', 
  (SELECT id FROM vendors LIMIT 1 OFFSET 3), '550e8400-e29b-41d4-a716-446655442001', '550e8400-e29b-41d4-a716-446655441009', 
  'TXN-COMM-002', 'sales', 15.0, 2700.00, 405.00, 40.50, 364.50, 'confirmed', 'paid', now() - interval '15 days', now() - interval '15 days', now() - interval '15 days'),

('550e8400-e29b-41d4-a716-446655446003', 
  (SELECT id FROM vendors LIMIT 1 OFFSET 1), '550e8400-e29b-41d4-a716-446655442002', '550e8400-e29b-41d4-a716-446655441004', 
  'TXN-COMM-003', 'sales', 8.5, 42000.00, 3570.00, 357.00, 3213.00, 'confirmed', 'paid', now() - interval '12 days', now() - interval '12 days', now() - interval '12 days'),

-- Pending commissions
('550e8400-e29b-41d4-a716-446655446004', 
  (SELECT id FROM vendors LIMIT 1 OFFSET 2), '550e8400-e29b-41d4-a716-446655442003', '550e8400-e29b-41d4-a716-446655441007', 
  'TXN-COMM-004', 'sales', 10.0, 4500.00, 450.00, 45.00, 405.00, 'pending', 'pending', now() - interval '3 days', now() - interval '3 days', now() - interval '3 days');

-- 3. SEARCH QUERIES (Search analytics)
INSERT INTO search_queries (id, user_id, query_text, search_type, results_count, selected_result_id, metadata, created_at) VALUES
('550e8400-e29b-41d4-a716-446655447001', '550e8400-e29b-41d4-a716-446655440002', 'samsung phone', 'product', 5, '550e8400-e29b-41d4-a716-446655441004', 
  jsonb_build_object('search_time_ms', 150, 'filters_applied', jsonb_build_array('electronics', 'mobile')), now() - interval '5 days'),

('550e8400-e29b-41d4-a716-446655447002', '550e8400-e29b-41d4-a716-446655440003', 'cotton saree', 'product', 8, '550e8400-e29b-41d4-a716-446655441001', 
  jsonb_build_object('search_time_ms', 95, 'filters_applied', jsonb_build_array('fashion', 'women')), now() - interval '8 days'),

('550e8400-e29b-41d4-a716-446655447003', NULL, 'dinner set', 'product', 12, '550e8400-e29b-41d4-a716-446655441007', 
  jsonb_build_object('search_time_ms', 78, 'filters_applied', jsonb_build_array('home', 'kitchen')), now() - interval '2 days');

-- 4. RECENTLY VIEWED (User behavior tracking)
INSERT INTO recently_viewed (id, user_id, product_id, viewed_at) VALUES
('550e8400-e29b-41d4-a716-446655448001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655441004', now() - interval '2 hours'),
('550e8400-e29b-41d4-a716-446655448002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655441005', now() - interval '4 hours'),
('550e8400-e29b-41d4-a716-446655448003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655441001', now() - interval '1 day'),
('550e8400-e29b-41d4-a716-446655448004', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655441003', now() - interval '1 day');

-- 5. FLASH SALES (Promotional campaigns)
INSERT INTO flash_sales (id, title, description, start_time, end_time, discount_percentage, max_discount_amount, minimum_order_amount, is_active, created_at) VALUES
('550e8400-e29b-41d4-a716-446655449001', 'Weekend Electronics Sale', 'Up to 15% off on all electronics', 
  now() + interval '1 day', now() + interval '3 days', 15.0, 5000.00, 1000.00, true, now()),

('550e8400-e29b-41d4-a716-446655449002', 'Fashion Festival', 'Special discounts on traditional wear', 
  now() + interval '5 days', now() + interval '7 days', 20.0, 1000.00, 500.00, true, now());

-- 6. PLATFORM METRICS (System health tracking)
INSERT INTO platform_metrics (id, metric_name, metric_value, metric_type, recorded_at, metadata) VALUES
('550e8400-e29b-41d4-a716-446655450001', 'daily_active_users', 1250, 'gauge', now(), jsonb_build_object('source', 'analytics_service')),
('550e8400-e29b-41d4-a716-446655450002', 'total_orders_today', 25, 'counter', now(), jsonb_build_object('status', 'all')),
('550e8400-e29b-41d4-a716-446655450003', 'average_order_value', 8200.00, 'gauge', now(), jsonb_build_object('currency', 'BDT')),
('550e8400-e29b-41d4-a716-446655450004', 'conversion_rate', 3.8, 'percentage', now(), jsonb_build_object('period', 'daily')),
('550e8400-e29b-41d4-a716-446655450005', 'total_revenue_today', 98500.00, 'counter', now(), jsonb_build_object('currency', 'BDT'));

-- Continue with more business data...