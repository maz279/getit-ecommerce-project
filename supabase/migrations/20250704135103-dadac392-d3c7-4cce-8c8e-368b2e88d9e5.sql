-- Fix critical database issues systematically (Part 2 - Security & Indexes corrected)

-- 1. Fix RLS policies for better security using DO blocks
DO $$
BEGIN
  -- Enable RLS on user_behaviors
  ALTER TABLE user_behaviors ENABLE ROW LEVEL SECURITY;
  
  -- Create policy if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_behaviors' AND policyname = 'Users can view their own behavior') THEN
    EXECUTE 'CREATE POLICY "Users can view their own behavior" ON user_behaviors FOR SELECT USING (user_id = auth.uid())';
  END IF;
  
  -- Enable RLS on user_sessions
  ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
  
  -- Create policy if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_sessions' AND policyname = 'Users can manage their own sessions') THEN
    EXECUTE 'CREATE POLICY "Users can manage their own sessions" ON user_sessions FOR ALL USING (user_id = auth.uid())';
  END IF;
END
$$;

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

-- 3. Add composite indexes for common queries (corrected)
CREATE INDEX IF NOT EXISTS idx_vendor_commissions_vendor_date 
  ON vendor_commissions(vendor_id, transaction_date);

CREATE INDEX IF NOT EXISTS idx_product_inventory_product_id 
  ON product_inventory(product_id, current_stock);

CREATE INDEX IF NOT EXISTS idx_order_items_order_product 
  ON order_items(order_id, product_id);