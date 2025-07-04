-- Fix critical database issues systematically

-- 1. Add missing NOT NULL constraints for critical foreign keys
ALTER TABLE ab_experiment_participants 
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN experiment_id SET NOT NULL;

ALTER TABLE ai_product_recommendations 
  ALTER COLUMN product_id SET NOT NULL;

ALTER TABLE analytics_events 
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN session_id SET NOT NULL;

-- 2. Add missing indexes for performance optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_event_category 
  ON analytics_events(event_category, created_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_vendor_category 
  ON products(vendor_id, category_id) WHERE status = 'active';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status_created 
  ON orders(status, created_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_behaviors_user_timestamp 
  ON user_behaviors(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_transactions_status 
  ON payment_transactions(status, created_at);

-- 3. Add missing composite indexes for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vendor_commissions_vendor_date 
  ON vendor_commissions(vendor_id, transaction_date);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_inventory_product_warehouse 
  ON product_inventory(product_id, warehouse_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_order_product 
  ON order_items(order_id, product_id);

-- 4. Add partial indexes for filtered queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_active_featured 
  ON products(created_at DESC) WHERE status = 'active' AND is_featured = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_pending_processing 
  ON orders(created_at) WHERE status IN ('pending', 'processing');

-- 5. Fix RLS policies for better security
-- Ensure all user-related tables have proper RLS
ALTER TABLE user_behaviors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own behavior" ON user_behaviors
  FOR SELECT USING (user_id = auth.uid());

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own sessions" ON user_sessions
  FOR ALL USING (user_id = auth.uid());

-- 6. Add constraints for data integrity
ALTER TABLE vendor_commissions 
  ADD CONSTRAINT check_commission_amount_positive 
  CHECK (commission_amount >= 0);

ALTER TABLE orders 
  ADD CONSTRAINT check_total_amount_positive 
  CHECK (total_amount >= 0);

ALTER TABLE products 
  ADD CONSTRAINT check_price_positive 
  CHECK (price >= 0);

-- 7. Add cascading deletes for data consistency
ALTER TABLE order_items 
  DROP CONSTRAINT IF EXISTS order_items_order_id_fkey,
  ADD CONSTRAINT order_items_order_id_fkey 
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

-- 8. Create function for database health monitoring
CREATE OR REPLACE FUNCTION get_database_health_metrics()
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  table_sizes jsonb;
  slow_queries integer;
  index_usage jsonb;
BEGIN
  -- Get table sizes
  SELECT jsonb_object_agg(
    schemaname || '.' || tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
  ) INTO table_sizes
  FROM pg_tables 
  WHERE schemaname = 'public'
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
  LIMIT 10;
  
  -- Count slow queries (if query_performance_logs exists)
  SELECT COUNT(*) INTO slow_queries
  FROM query_performance_logs 
  WHERE execution_time_ms > 1000 
    AND created_at > now() - INTERVAL '1 hour';
  
  -- Build result
  result := jsonb_build_object(
    'timestamp', now(),
    'table_sizes', table_sizes,
    'slow_queries_last_hour', slow_queries,
    'database_size', pg_size_pretty(pg_database_size(current_database())),
    'active_connections', (SELECT count(*) FROM pg_stat_activity WHERE state = 'active')
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Optimize statistics for better query planning
ANALYZE products;
ANALYZE orders;
ANALYZE order_items;
ANALYZE vendor_commissions;
ANALYZE analytics_events;

-- 10. Add missing sequences for order numbers if not exists
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000000;
CREATE SEQUENCE IF NOT EXISTS vendor_order_number_seq START 2000000;