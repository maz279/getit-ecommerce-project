-- FIXED DATABASE POPULATION - Phase 1: Core Business Data
-- Using proper UUID format and matching actual schemas

-- 1. USERS (Basic user data)
INSERT INTO users (id, email, full_name, phone, is_verified, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@getit.com.bd', 'System Administrator', '+8801711000001', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440002', 'customer1@gmail.com', 'Ahmed Rahman', '+8801711000002', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440003', 'customer2@gmail.com', 'Fatima Khatun', '+8801711000003', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440004', 'vendor1@shop.com', 'Karim Textiles Owner', '+8801711000004', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440005', 'vendor2@store.com', 'Rahman Electronics', '+8801711000005', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- 2. PRODUCTS (12 diverse products across all categories with proper UUIDs)
INSERT INTO products (id, name, name_bn, description, description_bn, price, vendor_id, category_id, sku, status, stock_quantity, is_active, is_featured, tags, created_at, updated_at) VALUES
-- Fashion Products
('550e8400-e29b-41d4-a716-446655441001', 'Premium Cotton Saree', 'প্রিমিয়াম কটন শাড়ি', 'Beautiful handwoven cotton saree with traditional Bengali designs', 'ঐতিহ্যবাহী বাঙালি ডিজাইনের সাথে সুন্দর হাতে বোনা কটন শাড়ি', 2500.00, 
  (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), 
  (SELECT id FROM categories WHERE name = 'Fashion & Clothing' LIMIT 1), 
  'SAR-001', 'active'::product_status, 45, true, true, ARRAY['saree', 'cotton', 'traditional', 'bengali'], now(), now()),

('550e8400-e29b-41d4-a716-446655441002', 'Designer Punjabi for Men', 'পুরুষদের ডিজাইনার পাঞ্জাবি', 'Elegant cotton punjabi perfect for festivals', 'উৎসবের জন্য উপযুক্ত কমনীয় কটন পাঞ্জাবি', 1800.00, 
  (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), 
  (SELECT id FROM categories WHERE name = 'Fashion & Clothing' LIMIT 1), 
  'PUN-001', 'active'::product_status, 32, true, false, ARRAY['punjabi', 'men', 'festival', 'cotton'], now(), now()),

('550e8400-e29b-41d4-a716-446655441003', 'Embroidered Salwar Kameez', 'সূচিকর্ম সালওয়ার কামিজ', 'Traditional three-piece dress with intricate embroidery', 'জটিল সূচিকর্মসহ ঐতিহ্যবাহী তিন-পিস পোশাক', 3200.00, 
  (SELECT id FROM vendors WHERE business_name = 'Karim Textiles' LIMIT 1), 
  (SELECT id FROM categories WHERE name = 'Fashion & Clothing' LIMIT 1), 
  'SAL-001', 'active'::product_status, 28, true, true, ARRAY['salwar', 'kameez', 'embroidered', 'traditional'], now(), now()),

-- Electronics Products
('550e8400-e29b-41d4-a716-446655441004', 'Samsung Galaxy A54 5G', 'স্যামসাং গ্যালাক্সি এ৫৪ ৫জি', 'Latest Android smartphone with 128GB storage', 'সর্বশেষ অ্যান্ড্রয়েড স্মার্টফোন ১২৮জিবি স্টোরেজসহ', 42000.00, 
  (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), 
  (SELECT id FROM categories WHERE name = 'Electronics & Gadgets' LIMIT 1), 
  'PHN-001', 'active'::product_status, 15, true, true, ARRAY['smartphone', 'samsung', '5g', 'android'], now(), now()),

('550e8400-e29b-41d4-a716-446655441005', 'Sony Bluetooth Headphones', 'সোনি ব্লুটুথ হেডফোন', 'Wireless noise-canceling headphones', 'বেতার নয়েজ-ক্যান্সেলিং হেডফোন', 8500.00, 
  (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), 
  (SELECT id FROM categories WHERE name = 'Electronics & Gadgets' LIMIT 1), 
  'HDP-001', 'active'::product_status, 22, true, false, ARRAY['headphones', 'sony', 'bluetooth', 'wireless'], now(), now()),

('550e8400-e29b-41d4-a716-446655441006', 'Xiaomi Smart TV 43"', 'শাওমি স্মার্ট টিভি ৪ৃ"', 'Full HD Smart Android TV with Netflix', 'নেটফ্লিক্সসহ ফুল এইচডি স্মার্ট অ্যান্ড্রয়েড টিভি', 35000.00, 
  (SELECT id FROM vendors WHERE business_name = 'Rahman Electronics' LIMIT 1), 
  (SELECT id FROM categories WHERE name = 'Electronics & Gadgets' LIMIT 1), 
  'TV-001', 'active'::product_status, 8, true, true, ARRAY['tv', 'xiaomi', 'smart', 'android'], now(), now()),

-- Home & Kitchen Products  
('550e8400-e29b-41d4-a716-446655441007', 'Steel Dinner Set 24 Pieces', '২৪ পিস স্টিল ডিনার সেট', 'Premium stainless steel dinner set for family', 'পরিবারের জন্য প্রিমিয়াম স্টেইনলেস স্টিল ডিনার সেট', 4500.00, 
  (SELECT id FROM vendors WHERE business_name = 'Home Essentials BD' LIMIT 1), 
  (SELECT id FROM categories WHERE name = 'Home & Kitchen' LIMIT 1), 
  'KIT-001', 'active'::product_status, 18, true, false, ARRAY['dinner set', 'steel', 'kitchen', 'family'], now(), now()),

('550e8400-e29b-41d4-a716-446655441008', 'Bed Sheet Set King Size', 'কিং সাইজ বেড শিট সেট', 'Cotton bed sheet set with pillow covers', 'বালিশের কভারসহ কটন বেড শিট সেট', 2200.00, 
  (SELECT id FROM vendors WHERE business_name = 'Home Essentials BD' LIMIT 1), 
  (SELECT id FROM categories WHERE name = 'Home & Kitchen' LIMIT 1), 
  'BED-001', 'active'::product_status, 35, true, false, ARRAY['bed sheet', 'cotton', 'king size', 'pillow'], now(), now()),

-- Health & Beauty Products
('550e8400-e29b-41d4-a716-446655441009', 'Himalaya Face Wash', 'হিমালয় ফেস ওয়াশ', 'Neem and turmeric face wash for all skin types', 'সব ধরনের ত্বকের জন্য নিম ও হলুদের ফেস ওয়াশ', 180.00, 
  (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 
  (SELECT id FROM categories WHERE name = 'Health & Beauty' LIMIT 1), 
  'COS-001', 'active'::product_status, 120, true, false, ARRAY['face wash', 'himalaya', 'neem', 'turmeric'], now(), now()),

('550e8400-e29b-41d4-a716-446655441010', 'Vitamin D3 Supplements', 'ভিটামিন ডিৃ সাপ্লিমেন্ট', 'High-quality vitamin D3 tablets - 60 capsules', 'উচ্চ মানের ভিটামিন ডি৩ ট্যাবলেট - ৬০টি ক্যাপসুল', 850.00, 
  (SELECT id FROM vendors WHERE business_name = 'Beauty Plus BD' LIMIT 1), 
  (SELECT id FROM categories WHERE name = 'Health & Beauty' LIMIT 1), 
  'SUP-001', 'active'::product_status, 85, true, false, ARRAY['vitamin', 'supplement', 'health', 'tablets'], now(), now()),

-- Food & Groceries Products
('550e8400-e29b-41d4-a716-446655441011', 'Bashundhara Rice 5KG', 'বসুন্ধরা চাল ৫কেজি', 'Premium quality miniket rice from Bangladesh', 'বাংলাদেশের প্রিমিয়াম মানের মিনিকেট চাল', 320.00, 
  (SELECT id FROM vendors WHERE business_name = 'Fresh Foods BD' LIMIT 1), 
  (SELECT id FROM categories WHERE name = 'Food & Groceries' LIMIT 1), 
  'GRC-001', 'active'::product_status, 200, true, false, ARRAY['rice', 'bashundhara', 'miniket', '5kg'], now(), now()),

('550e8400-e29b-41d4-a716-446655441012', 'Pran Mixed Spice Powder', 'প্রাণ মিশ্র মসলা গুঁড়া', 'Authentic Bengali spice mix for cooking', 'রান্নার জন্য খাঁটি বাঙালি মসলার মিশ্রণ', 95.00, 
  (SELECT id FROM vendors WHERE business_name = 'Fresh Foods BD' LIMIT 1), 
  (SELECT id FROM categories WHERE name = 'Food & Groceries' LIMIT 1), 
  'SPC-001', 'active'::product_status, 150, true, false, ARRAY['spice', 'pran', 'bengali', 'cooking'], now(), now());

-- Continue with inventory and orders...