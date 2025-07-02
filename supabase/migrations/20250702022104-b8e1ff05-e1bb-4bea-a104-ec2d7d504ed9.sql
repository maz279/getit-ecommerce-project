-- Critical Security and Performance Fixes (Part 1: Policies and Indexes)

-- 1. SECURITY CRITICAL: Add missing RLS policies for critical tables

-- Fix dashboard_metrics table (contains sensitive metrics)
CREATE POLICY "Admin can manage dashboard_metrics" ON public.dashboard_metrics
  FOR ALL USING (is_admin_user());

-- Fix users table (contains user data)
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can manage users" ON public.users
  FOR ALL USING (is_admin_user());

-- Fix orders table (contains financial data)
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Vendors can view orders for their products" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.order_items oi
      JOIN public.products p ON oi.product_id = p.id
      WHERE oi.order_id = orders.id AND p.vendor_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all orders" ON public.orders
  FOR ALL USING (is_admin_user());

-- Fix order_items table (contains financial data)  
CREATE POLICY "Users can view their order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.customer_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can view their product order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = order_items.product_id AND p.vendor_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all order items" ON public.order_items
  FOR ALL USING (is_admin_user());

-- 2. PERFORMANCE CRITICAL: Add missing indexes on frequently queried columns

-- User and session-based queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);

-- Order and product queries
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_vendor_id ON public.order_items(vendor_id);

-- Product and vendor queries
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

-- Commission and financial queries
CREATE INDEX IF NOT EXISTS idx_vendor_commissions_vendor_id ON public.vendor_commissions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_commissions_order_id ON public.vendor_commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_vendor_commissions_transaction_date ON public.vendor_commissions(transaction_date);

-- Real-time and analytics queries
CREATE INDEX IF NOT EXISTS idx_real_time_analytics_events_vendor_id ON public.real_time_analytics_events(vendor_id);
CREATE INDEX IF NOT EXISTS idx_live_sales_metrics_vendor_id_recorded_at ON public.live_sales_metrics(vendor_id, recorded_at);

-- User behavior and recommendations
CREATE INDEX IF NOT EXISTS idx_user_behaviors_user_id ON public.user_behaviors(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behaviors_created_at ON public.user_behaviors(created_at);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user_id ON public.recently_viewed(user_id);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_viewed_at ON public.recently_viewed(viewed_at);

-- Notification and communication queries (fixed column names)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON public.chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);