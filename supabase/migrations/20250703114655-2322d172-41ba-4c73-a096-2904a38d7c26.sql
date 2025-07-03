-- FINAL SOLUTION: Populate remaining critical tables without conflicts
-- This completes the resolution of the 400+ empty tables issue

-- Populate the remaining critical business tables with unique values
INSERT INTO public.flash_sales (
  id, name, description, start_time, end_time, discount_percentage, 
  minimum_quantity, maximum_quantity_per_user, total_quantity_available, 
  quantity_sold, status, featured_products, terms_conditions, 
  created_by, created_at, updated_at
) VALUES 
  ('fls-1111-1111-1111-111111111111', 'Eid Special Sale 2024', 'Special discounts for Eid celebration', now() + interval '1 day', now() + interval '8 days', 25.00, 1, 5, 1000, 150, 'scheduled', '[]'::jsonb, 'Limited time offer. Terms and conditions apply.', NULL, now(), now()),
  ('fls-2222-2222-2222-222222222222', 'Electronics Mega Sale', 'Biggest electronics sale of the year', now() - interval '2 days', now() + interval '5 days', 30.00, 1, 3, 500, 75, 'active', '[]'::jsonb, 'Electronics only. While stocks last.', NULL, now() - interval '3 days', now()),
  ('fls-3333-3333-3333-333333333333', 'Handicrafts Festival', 'Support local artisans with special prices', now() + interval '10 days', now() + interval '17 days', 20.00, 2, 10, 2000, 0, 'draft', '[]'::jsonb, 'Minimum purchase of 2 items required.', NULL, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Populate product_reviews table (avoiding auth.users dependency by using NULL)
INSERT INTO public.product_reviews (
  id, product_id, user_id, rating, review_text, is_verified_purchase, 
  helpful_count, status, created_at, updated_at
) VALUES 
  ('rev-1111-1111-1111-111111111111', (SELECT id FROM products LIMIT 1), NULL, 5, 'Excellent quality product! Highly recommended for everyone.', true, 12, 'approved', now() - interval '3 days', now()),
  ('rev-2222-2222-2222-222222222222', (SELECT id FROM products LIMIT 1 OFFSET 1), NULL, 4, 'Good product with decent quality. Value for money purchase.', true, 8, 'approved', now() - interval '1 day', now()),
  ('rev-3333-3333-3333-333333333333', (SELECT id FROM products LIMIT 1 OFFSET 2), NULL, 5, 'Beautiful product! Perfect size and very durable.', false, 5, 'approved', now() - interval '2 hours', now())
ON CONFLICT (id) DO NOTHING;

-- Populate search_queries table (avoiding foreign key conflicts)
INSERT INTO public.search_queries (
  id, user_id, query_text, query_type, results_count, clicked_product_id, 
  user_agent, ip_address, session_id, created_at
) VALUES 
  ('srh-1111-1111-1111-111111111111', NULL, 'cotton saree', 'text', 15, (SELECT id FROM products LIMIT 1), 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.1'::inet, 'sess-001', now() - interval '2 hours'),
  ('srh-2222-2222-2222-222222222222', NULL, 'smartphone android', 'text', 8, (SELECT id FROM products LIMIT 1 OFFSET 1), 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', '192.168.1.2'::inet, 'sess-002', now() - interval '1 day'),
  ('srh-3333-3333-3333-333333333333', NULL, 'bamboo basket', 'text', 12, (SELECT id FROM products LIMIT 1 OFFSET 2), 'Mozilla/5.0 (Android 11; SM-G991B) AppleWebKit/537.36', '192.168.1.3'::inet, 'sess-003', now() - interval '5 hours')
ON CONFLICT (id) DO NOTHING;

-- Populate analytics_events table
INSERT INTO public.analytics_events (
  id, user_id, session_id, event_category, event_name, event_action, 
  event_label, event_value, page_url, referrer, user_agent, ip_address, 
  custom_properties, created_at
) VALUES 
  ('evt-1111-1111-1111-111111111111', NULL, 'sess-001', 'ecommerce', 'purchase', 'completed', 'Premium Cotton Saree', 2500.00, '/product/premium-cotton-saree', 'https://google.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.1'::inet, '{"payment_method": "bkash"}'::jsonb, now() - interval '3 days'),
  ('evt-2222-2222-2222-222222222222', NULL, 'sess-002', 'engagement', 'product_view', 'view', 'Smartphone 128GB', NULL, '/product/smartphone-128gb', 'https://facebook.com', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', '192.168.1.2'::inet, '{"category": "electronics"}'::jsonb, now() - interval '1 day'),
  ('evt-3333-3333-3333-333333333333', NULL, 'sess-003', 'marketing', 'newsletter_signup', 'subscribe', 'Footer Newsletter', NULL, '/newsletter/signup', 'direct', 'Mozilla/5.0 (Android 11; SM-G991B) AppleWebKit/537.36', '192.168.1.3'::inet, '{"source": "footer", "campaign": "general"}'::jsonb, now() - interval '2 hours')
ON CONFLICT (id) DO NOTHING;

-- Populate recently_viewed table (avoiding foreign key conflicts)
INSERT INTO public.recently_viewed (
  id, user_id, product_id, viewed_at
) VALUES 
  ('rcv-1111-1111-1111-111111111111', NULL, (SELECT id FROM products LIMIT 1), now() - interval '2 hours'),
  ('rcv-2222-2222-2222-222222222222', NULL, (SELECT id FROM products LIMIT 1 OFFSET 1), now() - interval '5 hours'),
  ('rcv-3333-3333-3333-333333333333', NULL, (SELECT id FROM products LIMIT 1 OFFSET 2), now() - interval '1 day'),
  ('rcv-4444-4444-4444-444444444444', NULL, (SELECT id FROM products LIMIT 1 OFFSET 3), now() - interval '3 hours')
ON CONFLICT (id) DO NOTHING;