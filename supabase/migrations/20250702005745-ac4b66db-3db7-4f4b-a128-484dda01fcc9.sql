-- Enhanced Search Infrastructure with Elasticsearch Integration
CREATE TABLE public.search_indexes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  index_name TEXT NOT NULL UNIQUE,
  index_type TEXT NOT NULL, -- 'products', 'vendors', 'categories'
  elasticsearch_index TEXT NOT NULL,
  mapping_config JSONB NOT NULL DEFAULT '{}',
  settings_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.search_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT NOT NULL,
  search_query TEXT NOT NULL,
  search_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'voice', 'image', 'ai'
  filters_applied JSONB DEFAULT '{}',
  results_count INTEGER DEFAULT 0,
  clicked_result_id UUID,
  click_position INTEGER,
  search_duration_ms INTEGER,
  ai_enhancement_used BOOLEAN DEFAULT false,
  ai_suggestions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.ai_search_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash TEXT NOT NULL UNIQUE,
  original_query TEXT NOT NULL,
  enhanced_query TEXT NOT NULL,
  ai_suggestions JSONB NOT NULL DEFAULT '[]',
  semantic_tokens JSONB DEFAULT '[]',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  usage_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- PWA Offline Infrastructure
CREATE TABLE public.offline_sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL, -- 'create', 'update', 'delete'
  resource_type TEXT NOT NULL, -- 'cart', 'wishlist', 'order'
  resource_id UUID,
  data JSONB NOT NULL,
  sync_status TEXT DEFAULT 'pending', -- 'pending', 'syncing', 'completed', 'failed'
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  synced_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.pwa_installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  device_type TEXT NOT NULL, -- 'mobile', 'desktop', 'tablet'
  platform TEXT NOT NULL, -- 'android', 'ios', 'windows', 'macos'
  browser TEXT NOT NULL,
  installation_source TEXT, -- 'banner', 'menu', 'manual'
  is_active BOOLEAN DEFAULT true,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Supply Chain & Warehouse Management
CREATE TABLE public.warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  address JSONB NOT NULL,
  contact_info JSONB DEFAULT '{}',
  capacity_cubic_meters NUMERIC,
  manager_id UUID,
  operational_hours JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'maintenance'
  warehouse_type TEXT DEFAULT 'standard', -- 'standard', 'cold_storage', 'hazardous'
  automation_level TEXT DEFAULT 'manual', -- 'manual', 'semi_automated', 'fully_automated'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.warehouse_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  zone_name TEXT NOT NULL,
  zone_type TEXT NOT NULL, -- 'receiving', 'storage', 'picking', 'packing', 'shipping'
  capacity INTEGER DEFAULT 0,
  current_utilization INTEGER DEFAULT 0,
  temperature_controlled BOOLEAN DEFAULT false,
  security_level TEXT DEFAULT 'standard', -- 'standard', 'high', 'restricted'
  coordinates JSONB, -- x, y, z coordinates within warehouse
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id),
  zone_id UUID REFERENCES public.warehouse_zones(id),
  movement_type TEXT NOT NULL, -- 'inbound', 'outbound', 'transfer', 'adjustment'
  quantity INTEGER NOT NULL,
  unit_cost NUMERIC,
  batch_number TEXT,
  expiry_date DATE,
  reason TEXT,
  reference_document TEXT, -- order_id, transfer_id, etc.
  processed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.supply_chain_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'shipment_created', 'in_transit', 'delivered', 'returned'
  entity_type TEXT NOT NULL, -- 'order', 'transfer', 'purchase'
  entity_id UUID NOT NULL,
  location JSONB, -- current location data
  estimated_arrival TIMESTAMP WITH TIME ZONE,
  actual_arrival TIMESTAMP WITH TIME ZONE,
  carrier_info JSONB DEFAULT '{}',
  tracking_number TEXT,
  status_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.search_indexes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_search_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offline_sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pwa_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_chain_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Search
CREATE POLICY "Admin can manage search indexes" ON public.search_indexes
  FOR ALL USING (is_admin_user());

CREATE POLICY "Public can insert search analytics" ON public.search_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view search analytics" ON public.search_analytics
  FOR SELECT USING (is_admin_user());

CREATE POLICY "Public can read AI search cache" ON public.ai_search_cache
  FOR SELECT USING (true);

-- RLS Policies for PWA
CREATE POLICY "Users can manage their sync queue" ON public.offline_sync_queue
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their PWA installations" ON public.pwa_installations
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for Supply Chain
CREATE POLICY "Admin can manage warehouses" ON public.warehouses
  FOR ALL USING (is_admin_user());

CREATE POLICY "Admin can manage warehouse zones" ON public.warehouse_zones
  FOR ALL USING (is_admin_user());

CREATE POLICY "Admin can manage inventory movements" ON public.inventory_movements
  FOR ALL USING (is_admin_user());

CREATE POLICY "Admin can manage supply chain events" ON public.supply_chain_events
  FOR ALL USING (is_admin_user());

-- Indexes for performance
CREATE INDEX idx_search_analytics_user_id ON public.search_analytics(user_id);
CREATE INDEX idx_search_analytics_created_at ON public.search_analytics(created_at);
CREATE INDEX idx_ai_search_cache_query_hash ON public.ai_search_cache(query_hash);
CREATE INDEX idx_offline_sync_queue_user_status ON public.offline_sync_queue(user_id, sync_status);
CREATE INDEX idx_inventory_movements_product_warehouse ON public.inventory_movements(product_id, warehouse_id);
CREATE INDEX idx_supply_chain_events_entity ON public.supply_chain_events(entity_type, entity_id);

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_search_indexes_updated_at
  BEFORE UPDATE ON public.search_indexes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_warehouses_updated_at
  BEFORE UPDATE ON public.warehouses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_warehouse_zones_updated_at
  BEFORE UPDATE ON public.warehouse_zones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();