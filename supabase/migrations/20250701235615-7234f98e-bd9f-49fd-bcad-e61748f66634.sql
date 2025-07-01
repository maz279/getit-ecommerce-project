-- Fix critical missing policies and constraints

-- Ensure all commission tables have proper admin access
CREATE POLICY "Admin can insert commission_tracking_settings" ON public.commission_tracking_settings
  FOR INSERT WITH CHECK (public.is_admin_user());

CREATE POLICY "Public can insert commission_payouts" ON public.commission_payouts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert commission_disputes" ON public.commission_disputes  
  FOR INSERT WITH CHECK (true);

-- Fix vendor_commissions table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vendor_commissions' AND table_schema = 'public') THEN
    -- Enable RLS if not already enabled
    EXECUTE 'ALTER TABLE public.vendor_commissions ENABLE ROW LEVEL SECURITY';
    
    -- Add admin policy
    EXECUTE 'CREATE POLICY "Admin can manage vendor_commissions" ON public.vendor_commissions FOR ALL USING (public.is_admin_user())';
    
    -- Allow public insert for commission processing
    EXECUTE 'CREATE POLICY "Public can insert vendor_commissions" ON public.vendor_commissions FOR INSERT WITH CHECK (true)';
  END IF;
END $$;

-- Ensure profiles table has proper policies for role checking
DROP POLICY IF EXISTS "Public can view profiles for role checking" ON public.profiles;
CREATE POLICY "Public can view profiles for role checking" ON public.profiles
  FOR SELECT USING (true);

-- Clean up any potential infinite recursion by ensuring function works properly
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role IN ('admin', 'super_admin') 
     FROM public.profiles 
     WHERE id = auth.uid() 
     LIMIT 1), 
    false
  );
$$;

-- Add cleanup function for rate limits
CREATE OR REPLACE FUNCTION public.cleanup_expired_rate_limits()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.api_rate_limits 
  WHERE expires_at < now();
END;
$$;