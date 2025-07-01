-- Create payments table for payment processing
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('bkash', 'nagad', 'rocket', 'bank_transfer', 'cod')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'pending_delivery', 'completed', 'failed', 'refunded')),
  customer_phone TEXT,
  customer_details JSONB DEFAULT '{}',
  transaction_reference TEXT NOT NULL UNIQUE,
  transaction_id TEXT,
  gateway_response JSONB DEFAULT '{}',
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payment_methods configuration table
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  logo_url TEXT,
  is_enabled BOOLEAN DEFAULT true,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default payment methods
INSERT INTO public.payment_methods (method_id, name, type, logo_url, configuration) VALUES
('bkash', 'bKash', 'mobile_banking', '/payment-logos/bkash.png', '{"merchant_number": "", "app_key": "", "app_secret": ""}'),
('nagad', 'Nagad', 'mobile_banking', '/payment-logos/nagad.png', '{"merchant_id": "", "public_key": "", "private_key": ""}'),
('rocket', 'Rocket', 'mobile_banking', '/payment-logos/rocket.png', '{"merchant_number": "", "app_key": ""}'),
('bank_transfer', 'Bank Transfer', 'bank', '/payment-logos/bank.png', '{"account_name": "E-Commerce Platform Ltd", "account_number": "1234567890", "bank_name": "Bangladesh Bank", "routing_number": "123456789"}'),
('cod', 'Cash on Delivery', 'cash', '/payment-logos/cod.png', '{"delivery_charge": 50}')
ON CONFLICT (method_id) DO NOTHING;

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Enable RLS on payment_methods
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
FOR SELECT USING (
  order_id IN (
    SELECT id FROM public.orders WHERE customer_id = auth.uid()
  )
);

CREATE POLICY "Users can create payments for their own orders" ON public.payments
FOR INSERT WITH CHECK (
  order_id IN (
    SELECT id FROM public.orders WHERE customer_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all payments" ON public.payments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create RLS policies for payment_methods
CREATE POLICY "Public can view enabled payment methods" ON public.payment_methods
FOR SELECT USING (is_enabled = true);

CREATE POLICY "Admins can manage payment methods" ON public.payment_methods
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create trigger for updating payment timestamps
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updating payment_methods timestamps
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_payment_method ON public.payments(payment_method);
CREATE INDEX idx_payments_transaction_reference ON public.payments(transaction_reference);
CREATE INDEX idx_payment_methods_method_id ON public.payment_methods(method_id);
CREATE INDEX idx_payment_methods_enabled ON public.payment_methods(is_enabled);