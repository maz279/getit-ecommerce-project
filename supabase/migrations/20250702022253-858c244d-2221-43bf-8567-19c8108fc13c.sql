-- Critical Security and Performance Fixes (Part 2: Final Fixes)

-- Add remaining critical indexes
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_product_id ON public.inventory_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_inventory_id ON public.stock_alerts(inventory_id);

-- Security and audit queries
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_order_id ON public.fraud_alerts(order_id);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_products_vendor_category ON public.products(vendor_id, category_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_product ON public.order_items(order_id, product_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_created ON public.analytics_events(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_vendor_commissions_vendor_date ON public.vendor_commissions(vendor_id, transaction_date);

-- Partial indexes for better performance on filtered queries
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(vendor_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(parent_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, created_at) WHERE read = false;

-- Additional critical indexes for real-time features
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_product ON public.price_alerts(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_price_change_history_product_date ON public.price_change_history(product_id, effective_from);
CREATE INDEX IF NOT EXISTS idx_flash_sales_status_time ON public.flash_sales(status, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_websocket_connections_user ON public.websocket_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_live_order_tracking_order ON public.live_order_tracking(order_id);

-- Audit trail indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_tracking_created_at ON public.error_tracking(created_at);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON public.system_logs(created_at);

-- Search and filtering indexes
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING gin(searchable_content);
CREATE INDEX IF NOT EXISTS idx_search_queries_created_at ON public.search_queries(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON public.payment_transactions(created_at);

-- Security monitoring indexes
CREATE INDEX IF NOT EXISTS idx_real_time_fraud_alerts_severity ON public.real_time_fraud_alerts(severity, created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);

-- CRITICAL: Update table statistics for better query planning
ANALYZE public.products;
ANALYZE public.orders;
ANALYZE public.order_items;
ANALYZE public.vendor_commissions;
ANALYZE public.analytics_events;
ANALYZE public.user_behaviors;
ANALYZE public.notifications;
ANALYZE public.chat_messages;
ANALYZE public.inventory;
ANALYZE public.security_events;