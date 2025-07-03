-- Enhanced Amazon/Shopee-level Order Management System (Fixed Migration)

-- First check if the enum already exists and recreate with new values
DO $$ 
BEGIN
    -- Drop existing constraints if they exist
    ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
    
    -- Check if enum exists and drop/recreate
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        -- Create new enum with all values
        CREATE TYPE order_status_new AS ENUM (
            'pending', 'confirmed', 'processing', 'picked', 'packed', 'shipped', 
            'out_for_delivery', 'delivered', 'partially_delivered', 'cancelled', 
            'returned', 'refunded', 'disputed', 'on_hold'
        );
        
        -- Update the column to use the new enum
        ALTER TABLE public.orders ALTER COLUMN status TYPE order_status_new USING status::text::order_status_new;
        
        -- Drop old enum and rename new one
        DROP TYPE order_status;
        ALTER TYPE order_status_new RENAME TO order_status;
    ELSE
        -- Create the enum if it doesn't exist
        CREATE TYPE order_status AS ENUM (
            'pending', 'confirmed', 'processing', 'picked', 'packed', 'shipped', 
            'out_for_delivery', 'delivered', 'partially_delivered', 'cancelled', 
            'returned', 'refunded', 'disputed', 'on_hold'
        );
        ALTER TABLE public.orders ALTER COLUMN status TYPE order_status USING status::text::order_status;
    END IF;
    
    -- Handle payment_method enum
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
        CREATE TYPE payment_method_new AS ENUM (
            'cash_on_delivery', 'bkash', 'nagad', 'rocket', 'upay', 'tap', 
            'card', 'bank_transfer', 'wallet', 'installment', 'bnpl'
        );
        
        ALTER TABLE public.orders ALTER COLUMN payment_method TYPE payment_method_new USING 
            CASE 
                WHEN payment_method::text = 'cod' THEN 'cash_on_delivery'::payment_method_new
                ELSE payment_method::text::payment_method_new
            END;
        
        DROP TYPE payment_method;
        ALTER TYPE payment_method_new RENAME TO payment_method;
    ELSE
        CREATE TYPE payment_method AS ENUM (
            'cash_on_delivery', 'bkash', 'nagad', 'rocket', 'upay', 'tap', 
            'card', 'bank_transfer', 'wallet', 'installment', 'bnpl'
        );
        ALTER TABLE public.orders ALTER COLUMN payment_method TYPE payment_method USING payment_method::text::payment_method;
    END IF;
END $$;

-- Enhanced Orders table with comprehensive Amazon/Shopee-level fields
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS parent_order_id UUID REFERENCES public.orders(id),
ADD COLUMN IF NOT EXISTS vendor_id UUID,
ADD COLUMN IF NOT EXISTS fulfillment_type TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS priority_level TEXT DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS gift_message TEXT,
ADD COLUMN IF NOT EXISTS special_instructions TEXT,
ADD COLUMN IF NOT EXISTS delivery_window JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cod_fee NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS insurance_fee NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS packaging_instructions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS order_source TEXT DEFAULT 'web',
ADD COLUMN IF NOT EXISTS referral_code TEXT,
ADD COLUMN IF NOT EXISTS promotion_codes JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS tax_breakdown JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS shipping_breakdown JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS weight_total NUMERIC(8,3),
ADD COLUMN IF NOT EXISTS dimensions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancelled_by UUID,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS refund_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS return_window_expires DATE,
ADD COLUMN IF NOT EXISTS invoice_number TEXT,
ADD COLUMN IF NOT EXISTS receipt_url TEXT,
ADD COLUMN IF NOT EXISTS customer_ip INET,
ADD COLUMN IF NOT EXISTS customer_user_agent TEXT,
ADD COLUMN IF NOT EXISTS risk_score NUMERIC(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS fraud_check_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS delivery_instructions TEXT,
ADD COLUMN IF NOT EXISTS preferred_delivery_time TEXT,
ADD COLUMN IF NOT EXISTS contact_person TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS alternate_phone TEXT,
ADD COLUMN IF NOT EXISTS landmark TEXT,
ADD COLUMN IF NOT EXISTS delivery_fee_breakdown JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS packaging_type TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS eco_friendly_packaging BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_adult_signature BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS express_delivery BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS same_day_delivery BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS scheduled_delivery_date DATE,
ADD COLUMN IF NOT EXISTS delivery_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_delivery_attempts INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS last_delivery_attempt TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS pickup_location_id UUID,
ADD COLUMN IF NOT EXISTS is_gift BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gift_wrap_type TEXT,
ADD COLUMN IF NOT EXISTS gift_receipt BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS loyalty_points_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS loyalty_points_earned INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS cashback_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS order_tags JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS customer_rating INTEGER,
ADD COLUMN IF NOT EXISTS customer_feedback TEXT,
ADD COLUMN IF NOT EXISTS delivery_rating INTEGER,
ADD COLUMN IF NOT EXISTS delivery_feedback TEXT,
ADD COLUMN IF NOT EXISTS exchange_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS return_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS warranty_period INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS installation_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS installation_scheduled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS customs_declaration JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS hs_code TEXT,
ADD COLUMN IF NOT EXISTS import_duties NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS export_documentation JSONB DEFAULT '{}';

-- Enhanced order items with comprehensive vendor-specific data
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS barcode TEXT,
ADD COLUMN IF NOT EXISTS product_name TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS product_description TEXT,
ADD COLUMN IF NOT EXISTS product_images JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS variant_options JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS unit_weight NUMERIC(8,3),
ADD COLUMN IF NOT EXISTS unit_dimensions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_type TEXT,
ADD COLUMN IF NOT EXISTS discount_value NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_required BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS digital_delivery BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS download_url TEXT,
ADD COLUMN IF NOT EXISTS license_key TEXT,
ADD COLUMN IF NOT EXISTS activation_code TEXT,
ADD COLUMN IF NOT EXISTS personalization_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gift_wrap_fee NUMERIC(8,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS installation_fee NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS warranty_fee NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS insurance_fee NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS handling_fee NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS commission_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS vendor_payout_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS fulfillment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS return_reason TEXT,
ADD COLUMN IF NOT EXISTS return_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS exchange_item_id UUID,
ADD COLUMN IF NOT EXISTS quality_check_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS quality_check_notes TEXT,
ADD COLUMN IF NOT EXISTS packaging_notes TEXT,
ADD COLUMN IF NOT EXISTS special_handling JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS expiry_date DATE,
ADD COLUMN IF NOT EXISTS batch_number TEXT,
ADD COLUMN IF NOT EXISTS manufacturing_date DATE,
ADD COLUMN IF NOT EXISTS country_of_origin TEXT,
ADD COLUMN IF NOT EXISTS customs_value NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS restricted_shipping JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS dangerous_goods BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fragile_item BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS temperature_controlled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS storage_requirements JSONB DEFAULT '{}';

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON public.orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_parent_order_id ON public.orders(parent_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON public.orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON public.orders(scheduled_delivery_date);
CREATE INDEX IF NOT EXISTS idx_orders_fraud_score ON public.orders(fraud_check_status, risk_score);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment ON public.orders(fulfillment_type, priority_level);
CREATE INDEX IF NOT EXISTS idx_orders_customer_status ON public.orders(customer_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status, created_at);

-- Update product_name to be non-null with default where it's empty
UPDATE public.order_items SET product_name = 'Product' WHERE product_name IS NULL OR product_name = '';
ALTER TABLE public.order_items ALTER COLUMN product_name SET NOT NULL;