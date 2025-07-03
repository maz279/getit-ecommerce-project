-- Fix trigger creation and complete notification service setup

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_notification_subscriptions_updated_at ON public.notification_subscriptions;
DROP TRIGGER IF EXISTS update_notification_channels_updated_at ON public.notification_channels;
DROP TRIGGER IF EXISTS update_notification_campaigns_updated_at ON public.notification_campaigns;

-- Create triggers with proper checks
CREATE TRIGGER update_notification_campaigns_updated_at 
    BEFORE UPDATE ON public.notification_campaigns 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_channels_updated_at 
    BEFORE UPDATE ON public.notification_channels 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_subscriptions_updated_at 
    BEFORE UPDATE ON public.notification_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add sample notification templates for Bangladesh market
INSERT INTO public.notification_templates (template_name, template_type, trigger_event, subject_en, subject_bn, content_en, content_bn, variables, channel_config, is_active) VALUES
('welcome_user', 'email', 'user_registered', 'Welcome to GetIt - Your Digital Marketplace!', 'গেটইট-এ স্বাগতম - আপনার ডিজিটাল মার্কেটপ্লেস!', 
 'Welcome {{name}}! Start shopping from 1000+ vendors across Bangladesh.', 'স্বাগতম {{name}}! বাংলাদেশের ১০০০+ বিক্রেতাদের কাছ থেকে কেনাকাটা শুরু করুন।',
 '{"name": "string", "email": "string"}', '{"sms": {"enabled": true}, "email": {"enabled": true}, "push": {"enabled": true}}', true),
 
('order_confirmation', 'sms', 'order_placed', 'Order Confirmed - GetIt', 'অর্ডার নিশ্চিত - গেটইট', 
 'Order #{{order_number}} confirmed! Total: ৳{{amount}}. Track: {{tracking_url}}', 'অর্ডার #{{order_number}} নিশ্চিত! মোট: ৳{{amount}}। ট্র্যাক: {{tracking_url}}',
 '{"order_number": "string", "amount": "number", "tracking_url": "string"}', '{"sms": {"enabled": true}, "whatsapp": {"enabled": true}}', true),
 
('flash_sale_alert', 'push', 'flash_sale_started', 'Flash Sale Started!', 'ফ্ল্যাশ সেল শুরু!', 
 '⚡ Flash Sale: Up to 70% off on {{category}}! Only {{hours}} hours left!', '⚡ ফ্ল্যাশ সেল: {{category}}-এ ৭০% পর্যন্ত ছাড়! মাত্র {{hours}} ঘন্টা বাকি!',
 '{"category": "string", "hours": "number"}', '{"push": {"enabled": true}, "in_app": {"enabled": true}}', true),
 
('delivery_update', 'whatsapp', 'order_shipped', 'Your Order is On The Way!', 'আপনার অর্ডার পথে!', 
 'Good news! Order #{{order_number}} is out for delivery. Expected: {{delivery_time}}', 'সুখবর! অর্ডার #{{order_number}} ডেলিভারির জন্য বের হয়েছে। প্রত্যাশিত: {{delivery_time}}',
 '{"order_number": "string", "delivery_time": "string"}', '{"whatsapp": {"enabled": true}, "sms": {"enabled": true}}', true),
 
('payment_reminder', 'email', 'payment_pending', 'Complete Your Payment - GetIt', 'আপনার পেমেন্ট সম্পূর্ণ করুন - গেটইট', 
 'Hi {{name}}, complete payment for order #{{order_number}} within 24 hours to avoid cancellation.', 'হাই {{name}}, বাতিল এড়াতে ২৪ ঘন্টার মধ্যে অর্ডার #{{order_number}}-এর পেমেন্ট সম্পূর্ণ করুন।',
 '{"name": "string", "order_number": "string"}', '{"email": {"enabled": true}, "sms": {"enabled": true}}', true),

('eid_special_offer', 'email', 'festival_promotion', 'Eid Mubarak! Special Offers Inside', 'ঈদ মুবারক! বিশেষ অফার ভিতরে', 
 'Eid Mubarak {{name}}! Celebrate with up to 50% off on fashion, electronics & more!', 'ঈদ মুবারক {{name}}! ফ্যাশন, ইলেকট্রনিক্স এবং আরও অনেক কিছুতে ৫০% পর্যন্ত ছাড় নিয়ে উদযাপন করুন!',
 '{"name": "string"}', '{"email": {"enabled": true}, "push": {"enabled": true}, "whatsapp": {"enabled": true}}', true)

ON CONFLICT (template_name) DO UPDATE SET
    subject_en = EXCLUDED.subject_en,
    subject_bn = EXCLUDED.subject_bn,
    content_en = EXCLUDED.content_en,
    content_bn = EXCLUDED.content_bn,
    updated_at = now();