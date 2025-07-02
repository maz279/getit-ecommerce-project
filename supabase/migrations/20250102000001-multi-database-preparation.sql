-- Enhanced Database Schema for Multi-Database Architecture Preparation
-- This migration prepares the database for future multi-database scaling

-- Create search optimization tables (preparing for Elasticsearch migration)
CREATE TABLE public.search_indexes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  index_name TEXT NOT NULL UNIQUE,
  index_type TEXT NOT NULL, -- 'product', 'vendor', 'category'
  mapping_config JSONB NOT NULL DEFAULT '{}',
  search_fields JSONB NOT NULL DEFAULT '[]',
  boost_fields JSONB NOT NULL DEFAULT '{}',
  facet_fields JSONB NOT NULL DEFAULT '[]',
  filter_fields JSONB NOT NULL DEFAULT '[]',
  sort_fields JSONB NOT NULL DEFAULT '[]',
  analyzer_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_reindex_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create data sync tracking (for future database replication)
CREATE TABLE public.data_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_table TEXT NOT NULL,
  source_id UUID NOT NULL,
  sync_type TEXT NOT NULL, -- 'insert', 'update', 'delete'
  target_systems JSONB NOT NULL DEFAULT '[]', -- ['redis', 'elasticsearch', 'mongodb']
  sync_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'synced', 'failed'
  sync_data JSONB NOT NULL DEFAULT '{}',
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  synced_at TIMESTAMP WITH TIME ZONE
);

-- Create session storage (preparing for Redis migration)
CREATE TABLE public.session_storage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key TEXT NOT NULL UNIQUE,
  session_data JSONB NOT NULL DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document storage (preparing for MongoDB migration)
CREATE TABLE public.document_storage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_name TEXT NOT NULL,
  document_id TEXT NOT NULL,
  document_data JSONB NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(collection_name, document_id)
);

-- Create indexes for performance
CREATE INDEX idx_search_indexes_type_active ON public.search_indexes(index_type, is_active);
CREATE INDEX idx_data_sync_logs_status_created ON public.data_sync_logs(sync_status, created_at);
CREATE INDEX idx_session_storage_expires ON public.session_storage(expires_at);
CREATE INDEX idx_document_storage_collection_id ON public.document_storage(collection_name, document_id);

-- Enable RLS
ALTER TABLE public.search_indexes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_storage ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin can manage search indexes" 
ON public.search_indexes FOR ALL 
USING (is_admin_user());

CREATE POLICY "Admin can manage data sync logs" 
ON public.data_sync_logs FOR ALL 
USING (is_admin_user());

CREATE POLICY "Users can manage their sessions" 
ON public.session_storage FOR ALL 
USING (session_key LIKE 'user_' || auth.uid()::text || '_%');

CREATE POLICY "Admin can manage document storage" 
ON public.document_storage FOR ALL 
USING (is_admin_user());

-- Create functions for multi-database operations
CREATE OR REPLACE FUNCTION public.sync_to_external_systems()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Log the change for external sync
  INSERT INTO public.data_sync_logs (
    source_table,
    source_id,
    sync_type,
    target_systems,
    sync_data
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    '["redis", "elasticsearch"]'::jsonb,
    CASE 
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      ELSE to_jsonb(NEW)
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add triggers for important tables
CREATE TRIGGER sync_products_to_external 
  AFTER INSERT OR UPDATE OR DELETE ON public.products 
  FOR EACH ROW EXECUTE FUNCTION public.sync_to_external_systems();

CREATE TRIGGER sync_vendors_to_external 
  AFTER INSERT OR UPDATE OR DELETE ON public.vendors 
  FOR EACH ROW EXECUTE FUNCTION public.sync_to_external_systems();

-- Create cleanup function for expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.session_storage 
  WHERE expires_at < now();
END;
$$;