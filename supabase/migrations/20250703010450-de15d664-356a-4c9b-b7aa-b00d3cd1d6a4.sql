-- STEP 1: Fix critical indexes and RLS policies first
-- Add missing performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_vendors_created_at ON public.vendors(created_at);

-- Fix RLS security issues - missing policies
-- Products table - missing vendor access
CREATE POLICY "Vendors can manage their products" ON public.products
  FOR ALL TO authenticated
  USING (vendor_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- Orders table - missing customer access  
CREATE POLICY "Customers can view their orders" ON public.orders
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- Vendors table - missing user access
CREATE POLICY "Users can view vendor profiles" ON public.vendors
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Vendors can manage their profile" ON public.vendors
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));