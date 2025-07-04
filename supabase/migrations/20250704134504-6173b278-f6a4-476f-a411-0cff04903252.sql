-- Fix critical database issues systematically (Part 2 - Security & Indexes)

-- 1. Fix RLS policies for better security
ALTER TABLE user_behaviors ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can view their own behavior" ON user_behaviors
  FOR SELECT USING (user_id = auth.uid());

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can manage their own sessions" ON user_sessions
  FOR ALL USING (user_id = auth.uid());

-- 2. Add missing performance indexes (without CONCURRENTLY)
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_category 
  ON analytics_events(event_category, created_at);

CREATE INDEX IF NOT EXISTS idx_products_vendor_category 
  ON products(vendor_id, category_id) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_orders_status_created 
  ON orders(status, created_at);

CREATE INDEX IF NOT EXISTS idx_user_behaviors_user_timestamp 
  ON user_behaviors(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_status 
  ON payment_transactions(status, created_at);

-- 3. Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_vendor_commissions_vendor_date 
  ON vendor_commissions(vendor_id, transaction_date);

CREATE INDEX IF NOT EXISTS idx_product_inventory_product_warehouse 
  ON product_inventory(product_id, warehouse_id);

CREATE INDEX IF NOT EXISTS idx_order_items_order_product 
  ON order_items(order_id, product_id);

-- 4. Add sequences for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000000;
CREATE SEQUENCE IF NOT EXISTS vendor_order_number_seq START 2000000;