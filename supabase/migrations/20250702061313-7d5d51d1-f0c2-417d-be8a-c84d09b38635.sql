-- Create missing Bangladesh infrastructure tables

-- Currency rates table for real-time exchange rates
CREATE TABLE IF NOT EXISTS public.bd_currency_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate NUMERIC(15,6) NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  source TEXT DEFAULT 'api',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

-- Festival configurations table
CREATE TABLE IF NOT EXISTS public.bd_festival_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  festival_name TEXT NOT NULL,
  festival_name_bn TEXT NOT NULL,
  festival_type TEXT NOT NULL, -- 'religious', 'national', 'cultural'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  banner_config JSONB DEFAULT '{}',
  discount_config JSONB DEFAULT '{}',
  cultural_elements JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- SMS service configurations for Bangladesh providers
CREATE TABLE IF NOT EXISTS public.bd_sms_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name TEXT NOT NULL,
  api_config JSONB NOT NULL,
  message_types JSONB DEFAULT '[]', -- ['otp', 'promotional', 'transactional']
  rate_limits JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Localization content table
CREATE TABLE IF NOT EXISTS public.bd_localization_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'text', 'image', 'video', 'audio'
  english_content TEXT,
  bengali_content TEXT,
  category TEXT NOT NULL,
  context_data JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(content_key, category)
);

-- Regional delivery zones for Bangladesh
CREATE TABLE IF NOT EXISTS public.bd_delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name TEXT NOT NULL,
  zone_name_bn TEXT,
  zone_type TEXT NOT NULL, -- 'urban', 'suburban', 'rural'
  postal_codes TEXT[],
  districts TEXT[],
  delivery_time_hours INTEGER DEFAULT 24,
  additional_charge NUMERIC(10,2) DEFAULT 0,
  courier_partners UUID[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Payment method configurations specific to Bangladesh
CREATE TABLE IF NOT EXISTS public.bd_payment_method_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method_name TEXT NOT NULL,
  method_type TEXT NOT NULL, -- 'mobile_banking', 'bank_transfer', 'card', 'wallet'
  provider_config JSONB NOT NULL,
  transaction_limits JSONB DEFAULT '{}',
  fees_structure JSONB DEFAULT '{}',
  supported_currencies TEXT[] DEFAULT '{"BDT"}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bd_currency_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bd_festival_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bd_sms_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bd_localization_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bd_delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bd_payment_method_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can read currency rates" ON public.bd_currency_rates FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage currency rates" ON public.bd_currency_rates FOR ALL USING (is_admin_user());

CREATE POLICY "Public can read active festivals" ON public.bd_festival_configs FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage festivals" ON public.bd_festival_configs FOR ALL USING (is_admin_user());

CREATE POLICY "Admin can manage SMS configs" ON public.bd_sms_configs FOR ALL USING (is_admin_user());

CREATE POLICY "Public can read localization content" ON public.bd_localization_content FOR SELECT USING (true);
CREATE POLICY "Admin can manage localization" ON public.bd_localization_content FOR ALL USING (is_admin_user());

CREATE POLICY "Public can read delivery zones" ON public.bd_delivery_zones FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage delivery zones" ON public.bd_delivery_zones FOR ALL USING (is_admin_user());

CREATE POLICY "Admin can manage payment configs" ON public.bd_payment_method_configs FOR ALL USING (is_admin_user());
CREATE POLICY "Public can read active payment configs" ON public.bd_payment_method_configs FOR SELECT USING (is_active = true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bd_currency_rates_active ON public.bd_currency_rates(is_active, from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_bd_festival_configs_dates ON public.bd_festival_configs(start_date, end_date, is_active);
CREATE INDEX IF NOT EXISTS idx_bd_localization_content_key ON public.bd_localization_content(content_key, category);
CREATE INDEX IF NOT EXISTS idx_bd_delivery_zones_active ON public.bd_delivery_zones(is_active, zone_type);
CREATE INDEX IF NOT EXISTS idx_bd_payment_configs_active ON public.bd_payment_method_configs(is_active, method_type);

-- Triggers for updated_at
CREATE TRIGGER update_bd_currency_rates_updated_at
  BEFORE UPDATE ON public.bd_currency_rates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bd_festival_configs_updated_at
  BEFORE UPDATE ON public.bd_festival_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bd_sms_configs_updated_at
  BEFORE UPDATE ON public.bd_sms_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bd_localization_content_updated_at
  BEFORE UPDATE ON public.bd_localization_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bd_delivery_zones_updated_at
  BEFORE UPDATE ON public.bd_delivery_zones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bd_payment_method_configs_updated_at
  BEFORE UPDATE ON public.bd_payment_method_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.bd_currency_rates (from_currency, to_currency, rate) VALUES
('USD', 'BDT', 110.50),
('EUR', 'BDT', 120.75),
('GBP', 'BDT', 138.90),
('INR', 'BDT', 1.32),
('SAR', 'BDT', 29.47),
('AED', 'BDT', 30.11),
('MYR', 'BDT', 24.85)
ON CONFLICT (from_currency, to_currency) DO NOTHING;

INSERT INTO public.bd_festival_configs (festival_name, festival_name_bn, festival_type, start_date, end_date, banner_config, discount_config, cultural_elements) VALUES
('Eid ul-Fitr', 'ঈদুল ফিতর', 'religious', '2024-04-10', '2024-04-12', 
 '{"primaryColor": "#10B981", "secondaryColor": "#065F46", "textColor": "#FFFFFF"}',
 '{"type": "percentage", "value": 25, "maxDiscount": 5000, "categories": ["fashion", "electronics"]}',
 '{"greeting": "Eid Mubarak!", "greetingBn": "ঈদ মুবারক!", "emoji": "🌙", "pattern": "/patterns/islamic.svg"}'),
('Durga Puja', 'দুর্গা পূজা', 'religious', '2024-10-09', '2024-10-13',
 '{"primaryColor": "#F59E0B", "secondaryColor": "#B45309", "textColor": "#FFFFFF"}',
 '{"type": "percentage", "value": 20, "maxDiscount": 3000, "categories": ["fashion", "home"]}',
 '{"greeting": "Sharodiya Shubhechha!", "greetingBn": "শারদীয় শুভেচ্ছা!", "emoji": "🏺", "pattern": "/patterns/hindu.svg"}'),
('Pohela Boishakh', 'পহেলা বৈশাখ', 'cultural', '2024-04-14', '2024-04-14',
 '{"primaryColor": "#DC2626", "secondaryColor": "#991B1B", "textColor": "#FFFFFF"}',
 '{"type": "percentage", "value": 15, "maxDiscount": 2000, "categories": ["traditional", "fashion"]}',
 '{"greeting": "Shubho Noboborsho!", "greetingBn": "শুভ নববর্ষ!", "emoji": "🎭", "pattern": "/patterns/bengali.svg"}')
ON CONFLICT DO NOTHING;