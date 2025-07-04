-- Fix critical database issues systematically (Part 1 - Basic fixes without IF NOT EXISTS)

-- 1. Add missing NOT NULL constraints for critical foreign keys
ALTER TABLE ab_experiment_participants 
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN experiment_id SET NOT NULL;

ALTER TABLE ai_product_recommendations 
  ALTER COLUMN product_id SET NOT NULL;

-- 2. Add constraints for data integrity (without IF NOT EXISTS)
DO $$
BEGIN
  -- Check and add constraints if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_commission_amount_positive') THEN
    ALTER TABLE vendor_commissions 
      ADD CONSTRAINT check_commission_amount_positive 
      CHECK (commission_amount >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_total_amount_positive') THEN
    ALTER TABLE orders 
      ADD CONSTRAINT check_total_amount_positive 
      CHECK (total_amount >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_price_positive') THEN
    ALTER TABLE products 
      ADD CONSTRAINT check_price_positive 
      CHECK (price >= 0);
  END IF;
END
$$;