-- Create missing enterprise tables for Amazon/Shopee level features

-- Live Shopping & Streaming Tables
CREATE TABLE IF NOT EXISTS public.live_shopping_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_start TIMESTAMP WITH TIME ZONE,
  actual_end TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
  viewer_count INTEGER DEFAULT 0,
  peak_viewers INTEGER DEFAULT 0,
  total_sales NUMERIC DEFAULT 0,
  featured_products JSONB DEFAULT '[]'::jsonb,
  chat_enabled BOOLEAN DEFAULT true,
  recording_enabled BOOLEAN DEFAULT true,
  recording_url TEXT,
  thumbnail_url TEXT,
  stream_key TEXT,
  rtmp_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.live_shopping_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.live_shopping_sessions(id) ON DELETE CASCADE,
  user_id UUID,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'like', 'share', 'comment', 'purchase', 'add_to_cart')),
  interaction_data JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Social Commerce Tables
CREATE TABLE IF NOT EXISTS public.social_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  campaign_type TEXT NOT NULL CHECK (campaign_type IN ('influencer', 'referral', 'group_buy', 'flash_mob', 'viral_challenge')),
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  budget NUMERIC,
  target_audience JSONB DEFAULT '{}'::jsonb,
  success_metrics JSONB DEFAULT '{}'::jsonb,
  current_metrics JSONB DEFAULT '{}'::jsonb,
  rewards_structure JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.social_engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.social_campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  engagement_type TEXT NOT NULL CHECK (engagement_type IN ('share', 'invite', 'review', 'photo_upload', 'video_upload', 'referral')),
  engagement_data JSONB DEFAULT '{}'::jsonb,
  points_earned INTEGER DEFAULT 0,
  commission_earned NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Advanced Inventory Management
CREATE TABLE IF NOT EXISTS public.warehouse_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_name TEXT NOT NULL,
  warehouse_code TEXT UNIQUE NOT NULL,
  address JSONB NOT NULL,
  coordinates POINT,
  capacity_cubic_meters NUMERIC,
  operating_hours JSONB DEFAULT '{}'::jsonb,
  contact_info JSONB DEFAULT '{}'::jsonb,
  facilities JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  warehouse_id UUID NOT NULL REFERENCES public.warehouse_locations(id),
  movement_type TEXT NOT NULL CHECK (movement_type IN ('inbound', 'outbound', 'transfer', 'adjustment', 'return')),
  quantity INTEGER NOT NULL,
  unit_cost NUMERIC,
  reference_id UUID,
  reference_type TEXT,
  reason TEXT,
  batch_number TEXT,
  expiry_date DATE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Real-time Messaging System
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type TEXT NOT NULL CHECK (room_type IN ('customer_support', 'vendor_customer', 'live_shopping', 'group_chat')),
  participants JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'product', 'system')),
  content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP WITH TIME ZONE,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE,
  read_by JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Dynamic Pricing Engine
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('competitor_based', 'demand_based', 'inventory_based', 'time_based', 'user_segment')),
  conditions JSONB NOT NULL,
  actions JSONB NOT NULL,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  old_price NUMERIC NOT NULL,
  new_price NUMERIC NOT NULL,
  change_reason TEXT,
  rule_applied_id UUID REFERENCES public.pricing_rules(id),
  effective_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Supply Chain Management
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_name TEXT NOT NULL,
  supplier_code TEXT UNIQUE NOT NULL,
  contact_info JSONB NOT NULL,
  address JSONB NOT NULL,
  business_details JSONB DEFAULT '{}'::jsonb,
  quality_rating NUMERIC DEFAULT 0 CHECK (quality_rating >= 0 AND quality_rating <= 5),
  delivery_rating NUMERIC DEFAULT 0 CHECK (delivery_rating >= 0 AND delivery_rating <= 5),
  payment_terms JSONB DEFAULT '{}'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blacklisted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT UNIQUE NOT NULL,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  vendor_id UUID NOT NULL,
  warehouse_id UUID NOT NULL REFERENCES public.warehouse_locations(id),
  order_items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  tax_amount NUMERIC DEFAULT 0,
  shipping_cost NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  expected_delivery DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'acknowledged', 'shipped', 'received', 'cancelled')),
  terms_conditions TEXT,
  notes TEXT,
  created_by UUID NOT NULL,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.live_shopping_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_shopping_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage live shopping sessions" ON public.live_shopping_sessions FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Hosts can manage their live shopping sessions" ON public.live_shopping_sessions FOR ALL TO authenticated USING (host_id = auth.uid());
CREATE POLICY "Users can view active live shopping sessions" ON public.live_shopping_sessions FOR SELECT TO authenticated USING (status = 'live');

CREATE POLICY "Users can view live shopping interactions" ON public.live_shopping_interactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create live shopping interactions" ON public.live_shopping_interactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage social campaigns" ON public.social_campaigns FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Users can view active social campaigns" ON public.social_campaigns FOR SELECT TO authenticated USING (status = 'active');

CREATE POLICY "Users can manage their social engagements" ON public.social_engagements FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins can manage warehouses" ON public.warehouse_locations FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Vendors can view warehouse locations" ON public.warehouse_locations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can view all inventory movements" ON public.inventory_movements FOR SELECT TO authenticated USING (is_admin_user());
CREATE POLICY "Vendors can view their inventory movements" ON public.inventory_movements FOR SELECT TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Authorized users can create inventory movements" ON public.inventory_movements FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can view their chat rooms" ON public.chat_rooms FOR SELECT TO authenticated USING (participants ? auth.uid()::text);
CREATE POLICY "Users can create chat rooms" ON public.chat_rooms FOR INSERT TO authenticated WITH CHECK (participants ? auth.uid()::text);

CREATE POLICY "Users can view messages in their chat rooms" ON public.chat_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.chat_rooms WHERE id = room_id AND participants ? auth.uid()::text));
CREATE POLICY "Users can send messages in their chat rooms" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.chat_rooms WHERE id = room_id AND participants ? auth.uid()::text));

CREATE POLICY "Admins can manage pricing rules" ON public.pricing_rules FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Vendors can view active pricing rules" ON public.pricing_rules FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Users can view price history" ON public.price_history FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage suppliers" ON public.suppliers FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Vendors can view active suppliers" ON public.suppliers FOR SELECT TO authenticated USING (status = 'active');

CREATE POLICY "Admins can view all purchase orders" ON public.purchase_orders FOR SELECT TO authenticated USING (is_admin_user());
CREATE POLICY "Vendors can manage their purchase orders" ON public.purchase_orders FOR ALL TO authenticated USING (vendor_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_live_shopping_sessions_status ON public.live_shopping_sessions(status);
CREATE INDEX IF NOT EXISTS idx_live_shopping_sessions_scheduled_start ON public.live_shopping_sessions(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_live_shopping_interactions_session_id ON public.live_shopping_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_social_campaigns_status ON public.social_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_social_engagements_campaign_id ON public.social_engagements(campaign_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_product_warehouse ON public.inventory_movements(product_id, warehouse_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON public.chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_active ON public.pricing_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON public.price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier_id ON public.purchase_orders(supplier_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_live_shopping_sessions_updated_at BEFORE UPDATE ON public.live_shopping_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_social_campaigns_updated_at BEFORE UPDATE ON public.social_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_social_engagements_updated_at BEFORE UPDATE ON public.social_engagements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_warehouse_locations_updated_at BEFORE UPDATE ON public.warehouse_locations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON public.chat_rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pricing_rules_updated_at BEFORE UPDATE ON public.pricing_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON public.purchase_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();