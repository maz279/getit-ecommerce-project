-- Fix critical database issues systematically (Part 3 - Foreign Keys & Monitoring)

-- 1. Add cascading deletes for data consistency
DO $$
BEGIN
  -- Check if constraint exists before dropping and recreating
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_order_id_fkey') THEN
    ALTER TABLE order_items DROP CONSTRAINT order_items_order_id_fkey;
  END IF;
  
  ALTER TABLE order_items 
    ADD CONSTRAINT order_items_order_id_fkey 
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
END
$$;

-- 2. Add partial indexes for filtered queries
CREATE INDEX IF NOT EXISTS idx_products_active_featured 
  ON products(created_at DESC) WHERE status = 'active' AND is_featured = true;

CREATE INDEX IF NOT EXISTS idx_orders_pending_processing 
  ON orders(created_at) WHERE status IN ('pending', 'processing');

-- 3. Create function for database health monitoring
CREATE OR REPLACE FUNCTION get_database_health_metrics()
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  table_sizes jsonb;
  slow_queries integer;
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
  SELECT COALESCE(COUNT(*), 0) INTO slow_queries
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
EXCEPTION
  WHEN OTHERS THEN
    -- Return basic info if query_performance_logs doesn't exist
    result := jsonb_build_object(
      'timestamp', now(),
      'table_sizes', table_sizes,
      'database_size', pg_size_pretty(pg_database_size(current_database())),
      'active_connections', (SELECT count(*) FROM pg_stat_activity WHERE state = 'active'),
      'error', 'Some metrics unavailable'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Optimize statistics for better query planning
ANALYZE products;
ANALYZE orders;
ANALYZE order_items;
ANALYZE vendor_commissions;
ANALYZE analytics_events;