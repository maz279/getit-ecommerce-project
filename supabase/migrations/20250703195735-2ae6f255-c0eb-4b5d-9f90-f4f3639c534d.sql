-- Phase 1: Core Database Schema Alignment
-- Creating essential tables for GetIt multi-vendor platform

-- Users Schema
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT,
    profile_image_url TEXT,
    bio TEXT,
    preferred_language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'Asia/Dhaka',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    address_type TEXT NOT NULL, -- 'home', 'work', 'other'
    full_address TEXT NOT NULL,
    division TEXT,
    district TEXT,
    upazila TEXT,
    postal_code TEXT,
    is_default BOOLEAN DEFAULT false,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Vendors Schema
CREATE TABLE IF NOT EXISTS public.vendor_stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
    store_name TEXT NOT NULL,
    store_slug TEXT UNIQUE NOT NULL,
    store_description TEXT,
    store_logo_url TEXT,
    store_banner_url TEXT,
    store_address TEXT,
    business_hours JSONB DEFAULT '{}',
    contact_email TEXT,
    contact_phone TEXT,
    social_links JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vendor_kyc_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
    document_type TEXT NOT NULL, -- 'nid', 'trade_license', 'tin', 'bank_statement'
    document_number TEXT,
    document_url TEXT NOT NULL,
    verification_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vendor_bank_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
    bank_name TEXT NOT NULL,
    account_holder_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    routing_number TEXT,
    branch_name TEXT,
    account_type TEXT DEFAULT 'savings', -- 'savings', 'current'
    is_verified BOOLEAN DEFAULT false,
    is_primary BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Products Schema
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.product_categories(id),
    image_url TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    variant_name TEXT NOT NULL,
    attributes JSONB DEFAULT '{}', -- color, size, material etc
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    weight DECIMAL(8,3),
    dimensions JSONB DEFAULT '{}', -- length, width, height
    barcode TEXT,
    image_urls TEXT[] DEFAULT '{}',
    track_inventory BOOLEAN DEFAULT true,
    continue_selling_when_out_of_stock BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL, -- 'image', 'video', '360_view', 'ar_model'
    media_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Inventory Management
CREATE TABLE IF NOT EXISTS public.product_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    warehouse_id UUID, -- References to warehouse system
    current_stock INTEGER NOT NULL DEFAULT 0,
    reserved_stock INTEGER NOT NULL DEFAULT 0,
    incoming_stock INTEGER NOT NULL DEFAULT 0,
    minimum_stock_level INTEGER DEFAULT 0,
    maximum_stock_level INTEGER,
    reorder_point INTEGER DEFAULT 0,
    reorder_quantity INTEGER DEFAULT 0,
    last_stock_update TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(product_id, variant_id, warehouse_id)
);

-- Enhanced Orders Schema
CREATE TABLE IF NOT EXISTS public.vendor_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
    vendor_order_number TEXT UNIQUE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 0,
    commission_amount DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
    fulfillment_status TEXT DEFAULT 'unfulfilled', -- 'unfulfilled', 'partial', 'fulfilled'
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    tracking_number TEXT,
    courier_partner TEXT,
    estimated_delivery DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shopping_carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT, -- For guest users
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT user_or_session_required CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES public.shopping_carts(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(cart_id, product_id, variant_id)
);

-- Payment System Enhancement
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    payment_type TEXT NOT NULL, -- 'card', 'mobile_banking', 'bank_transfer', 'wallet'
    provider TEXT NOT NULL, -- 'bkash', 'nagad', 'rocket', 'visa', 'mastercard'
    account_details JSONB NOT NULL, -- Encrypted sensitive data
    is_verified BOOLEAN DEFAULT false,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transaction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL, -- 'payment', 'refund', 'payout', 'commission'
    gateway_transaction_id TEXT,
    gateway_response JSONB,
    status TEXT NOT NULL, -- 'pending', 'processing', 'completed', 'failed', 'cancelled'
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'BDT',
    fees DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bangladesh-Specific Location Data
CREATE TABLE IF NOT EXISTS public.bangladesh_divisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    name_bn TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bangladesh_districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    division_id UUID REFERENCES public.bangladesh_divisions(id) NOT NULL,
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bangladesh_upazilas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id UUID REFERENCES public.bangladesh_districts(id) NOT NULL,
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Shipping & Logistics
CREATE TABLE IF NOT EXISTS public.courier_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT UNIQUE NOT NULL,
    api_endpoint TEXT,
    api_credentials JSONB,
    supported_services JSONB DEFAULT '[]',
    coverage_areas JSONB DEFAULT '[]',
    pricing_structure JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_cod_supported BOOLEAN DEFAULT false,
    is_same_day_supported BOOLEAN DEFAULT false,
    tracking_url_template TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    vendor_order_id UUID REFERENCES public.vendor_orders(id) ON DELETE CASCADE NOT NULL,
    courier_partner_id UUID REFERENCES public.courier_partners(id) NOT NULL,
    tracking_number TEXT UNIQUE NOT NULL,
    shipment_status TEXT DEFAULT 'pending', -- 'pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'returned'
    shipping_method TEXT NOT NULL, -- 'standard', 'express', 'same_day'
    pickup_address JSONB NOT NULL,
    delivery_address JSONB NOT NULL,
    package_details JSONB NOT NULL, -- weight, dimensions, value
    shipping_cost DECIMAL(10,2) NOT NULL,
    cod_amount DECIMAL(10,2) DEFAULT 0,
    estimated_delivery_date DATE,
    actual_delivery_date TIMESTAMP WITH TIME ZONE,
    delivery_attempts INTEGER DEFAULT 0,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bangladesh_divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bangladesh_districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bangladesh_upazilas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- User profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own profile" ON public.user_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- User addresses
CREATE POLICY "Users can manage their own addresses" ON public.user_addresses FOR ALL USING (user_id = auth.uid());

-- Vendor stores
CREATE POLICY "Vendors can manage their stores" ON public.vendor_stores FOR ALL USING (vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "Public can view active stores" ON public.vendor_stores FOR SELECT USING (is_active = true);

-- Shopping carts
CREATE POLICY "Users can manage their carts" ON public.shopping_carts FOR ALL USING (user_id = auth.uid());

-- Cart items
CREATE POLICY "Users can manage their cart items" ON public.cart_items 
FOR ALL USING (cart_id IN (SELECT id FROM public.shopping_carts WHERE user_id = auth.uid()));

-- Public read access for location data
CREATE POLICY "Public can read divisions" ON public.bangladesh_divisions FOR SELECT USING (true);
CREATE POLICY "Public can read districts" ON public.bangladesh_districts FOR SELECT USING (true);
CREATE POLICY "Public can read upazilas" ON public.bangladesh_upazilas FOR SELECT USING (true);

-- Admin policies for system tables
CREATE POLICY "Admin full access product_categories" ON public.product_categories FOR ALL USING (is_admin_user());
CREATE POLICY "Public can read categories" ON public.product_categories FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage courier partners" ON public.courier_partners FOR ALL USING (is_admin_user());
CREATE POLICY "Public can read active couriers" ON public.courier_partners FOR SELECT USING (is_active = true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_user_addresses_updated_at BEFORE UPDATE ON public.user_addresses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_vendor_stores_updated_at BEFORE UPDATE ON public.vendor_stores FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_vendor_kyc_updated_at BEFORE UPDATE ON public.vendor_kyc_documents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_vendor_bank_updated_at BEFORE UPDATE ON public.vendor_bank_details FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_product_categories_updated_at BEFORE UPDATE ON public.product_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_product_inventory_updated_at BEFORE UPDATE ON public.product_inventory FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_vendor_orders_updated_at BEFORE UPDATE ON public.vendor_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_shopping_carts_updated_at BEFORE UPDATE ON public.shopping_carts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_payment_methods_updated_at BEFORE UPDATE ON public.payment_methods FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_courier_partners_updated_at BEFORE UPDATE ON public.courier_partners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_shipments_updated_at BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();