-- Fix critical database issues systematically (Part 1 - Basic fixes)

-- 1. Add missing NOT NULL constraints for critical foreign keys
ALTER TABLE ab_experiment_participants 
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN experiment_id SET NOT NULL;

ALTER TABLE ai_product_recommendations 
  ALTER COLUMN product_id SET NOT NULL;

-- 2. Add constraints for data integrity
ALTER TABLE vendor_commissions 
  ADD CONSTRAINT IF NOT EXISTS check_commission_amount_positive 
  CHECK (commission_amount >= 0);

ALTER TABLE orders 
  ADD CONSTRAINT IF NOT EXISTS check_total_amount_positive 
  CHECK (total_amount >= 0);

ALTER TABLE products 
  ADD CONSTRAINT IF NOT EXISTS check_price_positive 
  CHECK (price >= 0);

-- 3. Fix RLS policies for better security
ALTER TABLE user_behaviors ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can view their own behavior" ON user_behaviors
  FOR SELECT USING (user_id = auth.uid());

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can manage their own sessions" ON user_sessions
  FOR ALL USING (user_id = auth.uid());

-- 4. Add missing sequences for order numbers if not exists
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000000;
CREATE SEQUENCE IF NOT EXISTS vendor_order_number_seq START 2000000;