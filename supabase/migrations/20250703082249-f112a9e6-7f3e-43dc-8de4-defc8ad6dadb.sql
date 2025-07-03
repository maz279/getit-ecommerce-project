-- Create vendor_orders table first (referenced by foreign keys)
CREATE TABLE IF NOT EXISTS public.vendor_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES auth.users(id),
    order_number TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
    subtotal_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    shipping_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    commission_rate NUMERIC(5,4) NOT NULL DEFAULT 0.10,
    commission_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    vendor_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
    processing_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    shipping_tracking_number TEXT,
    shipping_carrier TEXT,
    vendor_notes TEXT,
    admin_notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendor_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendor_orders
CREATE POLICY "Vendors can view their orders" ON public.vendor_orders
    FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Vendors can update their orders" ON public.vendor_orders
    FOR UPDATE USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Customers can view orders for their purchases" ON public.vendor_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = vendor_orders.order_id 
            AND orders.customer_id = auth.uid()
        ) OR is_admin_user()
    );

CREATE POLICY "System can insert vendor orders" ON public.vendor_orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all vendor orders" ON public.vendor_orders
    FOR ALL USING (is_admin_user());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vendor_orders_order_id ON public.vendor_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_vendor_id ON public.vendor_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_status ON public.vendor_orders(status);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_created_at ON public.vendor_orders(created_at DESC);

-- Add updated_at trigger
CREATE TRIGGER update_vendor_orders_updated_at
    BEFORE UPDATE ON public.vendor_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Generate order number for vendor orders
CREATE OR REPLACE FUNCTION public.generate_vendor_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number = 'VO-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER generate_vendor_order_number_trigger
    BEFORE INSERT ON public.vendor_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_vendor_order_number();