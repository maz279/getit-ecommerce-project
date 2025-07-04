-- Fix critical database issues systematically (Part 4 - Final Security & Optimization)

-- 1. Add missing RLS policies for critical tables
DO $$
BEGIN
  -- Products table RLS
  ALTER TABLE products ENABLE ROW LEVEL SECURITY;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Public can view active products') THEN
    EXECUTE 'CREATE POLICY "Public can view active products" ON products FOR SELECT USING (status = ''active'')';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Vendors can manage their products') THEN
    EXECUTE 'CREATE POLICY "Vendors can manage their products" ON products FOR ALL USING (vendor_id = auth.uid())';
  END IF;
  
  -- Orders table RLS  
  ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can view their orders') THEN
    EXECUTE 'CREATE POLICY "Users can view their orders" ON orders FOR SELECT USING (user_id = auth.uid())';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Vendors can view their orders') THEN
    EXECUTE 'CREATE POLICY "Vendors can view their orders" ON orders FOR SELECT USING (EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id = orders.id AND oi.vendor_id = auth.uid()))';
  END IF;
  
  -- Order items table RLS
  ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Users can view their order items') THEN
    EXECUTE 'CREATE POLICY "Users can view their order items" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()))';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Vendors can view their order items') THEN
    EXECUTE 'CREATE POLICY "Vendors can view their order items" ON order_items FOR SELECT USING (vendor_id = auth.uid())';
  END IF;
  
  -- Vendor commissions table RLS
  ALTER TABLE vendor_commissions ENABLE ROW LEVEL SECURITY;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vendor_commissions' AND policyname = 'Vendors can view their commissions') THEN
    EXECUTE 'CREATE POLICY "Vendors can view their commissions" ON vendor_commissions FOR SELECT USING (vendor_id = auth.uid())';
  END IF;
END
$$;

-- 2. Add missing indexes for search and analytics
CREATE INDEX IF NOT EXISTS idx_products_search_text 
  ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

CREATE INDEX IF NOT EXISTS idx_vendor_commissions_status 
  ON vendor_commissions(status, created_at);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name 
  ON analytics_events(event_name, created_at);

-- 3. Add proper cleanup trigger for expired data
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
  -- Clean expired user sessions
  DELETE FROM user_sessions WHERE expires_at < now();
  
  -- Clean expired AI recommendations
  DELETE FROM ai_product_recommendations WHERE expires_at < now();
  
  -- Clean old analytics events (older than 6 months)
  DELETE FROM analytics_events WHERE created_at < now() - INTERVAL '6 months';
  
  -- Clean old search queries (older than 3 months)
  DELETE FROM search_queries WHERE created_at < now() - INTERVAL '3 months';
  
  -- Log cleanup
  INSERT INTO system_logs (log_level, message, created_at)
  VALUES ('info', 'Automated cleanup completed', now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create automated cleanup schedule (for reference)
-- Note: This would typically be scheduled via pg_cron or external scheduler
-- SELECT cron.schedule('cleanup-expired-data', '0 2 * * *', 'SELECT cleanup_expired_data();');