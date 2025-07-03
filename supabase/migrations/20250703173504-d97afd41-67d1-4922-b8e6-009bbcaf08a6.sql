-- Insert Bangladesh vendor categories
INSERT INTO public.vendor_categories (category_name, category_code, description, commission_rate) VALUES
('Fashion & Clothing', 'FASHION', 'Traditional and modern clothing, accessories', 8.5),
('Electronics & Gadgets', 'ELECTRONICS', 'Consumer electronics, mobile devices, computers', 12.0),
('Home & Living', 'HOME', 'Furniture, home decor, appliances', 10.0),
('Health & Beauty', 'HEALTH', 'Personal care, cosmetics, healthcare products', 15.0),
('Food & Groceries', 'FOOD', 'Food items, beverages, groceries', 5.0),
('Books & Stationery', 'BOOKS', 'Educational materials, office supplies', 7.5),
('Sports & Outdoor', 'SPORTS', 'Sports equipment, outdoor gear', 10.0),
('Handicrafts & Traditional', 'HANDICRAFTS', 'Bengali handicrafts, traditional items', 6.0),
('Mobile & Accessories', 'MOBILE', 'Mobile phones, accessories, services', 12.0),
('Automotive Parts', 'AUTO', 'Vehicle parts, accessories, maintenance', 8.0);

-- Insert vendor tier system
INSERT INTO public.vendor_tiers (tier_name, tier_level, min_monthly_sales, max_monthly_sales, commission_discount, benefits, requirements) VALUES
('Bronze', 1, 0, 50000, 0, '["Basic support", "Standard listing"]', '["Complete KYC", "Active store"]'),
('Silver', 2, 50000, 200000, 1.0, '["Priority support", "Featured listings", "Analytics dashboard"]', '["6 months active", "4.0+ rating", "95%+ fulfillment"]'),
('Gold', 3, 200000, 500000, 2.5, '["Dedicated account manager", "Premium placement", "Marketing support"]', '["12 months active", "4.3+ rating", "98%+ fulfillment"]'),
('Platinum', 4, 500000, NULL, 5.0, '["White-glove service", "Custom integration", "Co-marketing opportunities"]', '["24 months active", "4.5+ rating", "99%+ fulfillment"]);

-- Enable RLS on new tables
ALTER TABLE public.vendor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_verification_workflow ENABLE ROW LEVEL SECURITY;