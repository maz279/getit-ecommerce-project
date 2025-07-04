-- Fix critical database issues systematically (Part 4 - Final Security & Optimization - Corrected)

-- 1. Add missing indexes for search and analytics  
CREATE INDEX IF NOT EXISTS idx_products_search_text 
  ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

CREATE INDEX IF NOT EXISTS idx_vendor_commissions_status 
  ON vendor_commissions(status, created_at);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name 
  ON analytics_events(event_name, created_at);

-- 2. Add proper cleanup function for expired data
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
  
  -- Log cleanup (if system_logs table exists)
  INSERT INTO system_logs (log_level, message, created_at)
  VALUES ('info', 'Automated cleanup completed', now());
EXCEPTION
  WHEN OTHERS THEN
    -- Continue even if logging fails
    NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Add basic RLS policies for existing tables (without user_id assumptions)
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
  
  -- Order items table RLS (basic policy)
  ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
  
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