-- Enhanced Search Infrastructure (only missing tables)
CREATE TABLE IF NOT EXISTS public.search_indexes (
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

CREATE TABLE IF NOT EXISTS public.ai_search_cache (
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
CREATE TABLE IF NOT EXISTS public.offline_sync_queue (
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

CREATE TABLE IF NOT EXISTS public.pwa_installations (
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
CREATE TABLE IF NOT EXISTS public.warehouses (
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

CREATE TABLE IF NOT EXISTS public.warehouse_zones (
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

CREATE TABLE IF NOT EXISTS public.inventory_movements (
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

CREATE TABLE IF NOT EXISTS public.supply_chain_events (
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

-- Enable RLS only for new tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'search_indexes') THEN
    ALTER TABLE public.search_indexes ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Admin can manage search indexes" ON public.search_indexes
      FOR ALL USING (is_admin_user());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_search_cache') THEN
    ALTER TABLE public.ai_search_cache ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Public can read AI search cache" ON public.ai_search_cache
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'offline_sync_queue') THEN
    ALTER TABLE public.offline_sync_queue ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can manage their sync queue" ON public.offline_sync_queue
      FOR ALL USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pwa_installations') THEN
    ALTER TABLE public.pwa_installations ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can manage their PWA installations" ON public.pwa_installations
      FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'warehouses') THEN
    ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Admin can manage warehouses" ON public.warehouses
      FOR ALL USING (is_admin_user());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'warehouse_zones') THEN
    ALTER TABLE public.warehouse_zones ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Admin can manage warehouse zones" ON public.warehouse_zones
      FOR ALL USING (is_admin_user());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'inventory_movements') THEN
    ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Admin can manage inventory movements" ON public.inventory_movements
      FOR ALL USING (is_admin_user());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supply_chain_events') THEN
    ALTER TABLE public.supply_chain_events ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Admin can manage supply chain events" ON public.supply_chain_events
      FOR ALL USING (is_admin_user());
  END IF;
END
$$;