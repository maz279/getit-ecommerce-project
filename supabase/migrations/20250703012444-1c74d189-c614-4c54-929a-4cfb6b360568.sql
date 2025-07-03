-- ENTERPRISE FINANCIAL MANAGEMENT SYSTEM
-- Double-entry accounting tables
CREATE TABLE IF NOT EXISTS public.chart_of_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_code text NOT NULL UNIQUE,
  account_name text NOT NULL,
  account_type text NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  parent_account_id uuid REFERENCES public.chart_of_accounts(id),
  is_active boolean DEFAULT true,
  currency text DEFAULT 'BDT',
  normal_balance text CHECK (normal_balance IN ('debit', 'credit')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- General ledger for all transactions
CREATE TABLE IF NOT EXISTS public.general_ledger (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id uuid NOT NULL,
  account_id uuid NOT NULL REFERENCES public.chart_of_accounts(id),
  debit_amount numeric(15,2) DEFAULT 0 CHECK (debit_amount >= 0),
  credit_amount numeric(15,2) DEFAULT 0 CHECK (credit_amount >= 0),
  transaction_date date NOT NULL,
  description text,
  reference_number text,
  source_document text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT debit_or_credit_check CHECK (
    (debit_amount > 0 AND credit_amount = 0) OR 
    (debit_amount = 0 AND credit_amount > 0)
  )
);

-- Financial periods for accounting
CREATE TABLE IF NOT EXISTS public.financial_periods (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  period_name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed', 'locked')),
  fiscal_year integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  closed_at timestamp with time zone,
  UNIQUE(start_date, end_date)
);

-- Bangladesh tax configuration
CREATE TABLE IF NOT EXISTS public.bangladesh_tax_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tax_type text NOT NULL CHECK (tax_type IN ('vat', 'income_tax', 'customs_duty', 'withholding_tax', 'supplementary_duty')),
  tax_rate numeric(5,2) NOT NULL,
  effective_from date NOT NULL,
  effective_to date,
  product_category text,
  minimum_amount numeric(15,2),
  maximum_amount numeric(15,2),
  is_active boolean DEFAULT true,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- VAT management for Bangladesh
CREATE TABLE IF NOT EXISTS public.vat_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id uuid NOT NULL,
  order_id uuid REFERENCES public.orders(id),
  vendor_id uuid REFERENCES public.vendors(id),
  vat_rate numeric(5,2) NOT NULL DEFAULT 15.00,
  taxable_amount numeric(15,2) NOT NULL,
  vat_amount numeric(15,2) NOT NULL,
  input_vat_credit numeric(15,2) DEFAULT 0,
  vat_registration_number text,
  transaction_date date NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'exempt', 'reversed')),
  created_at timestamp with time zone DEFAULT now()
);

-- Income tax tracking
CREATE TABLE IF NOT EXISTS public.income_tax_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id uuid NOT NULL REFERENCES public.vendors(id),
  tax_year integer NOT NULL,
  gross_income numeric(15,2) NOT NULL,
  taxable_income numeric(15,2) NOT NULL,
  tax_rate numeric(5,2) NOT NULL,
  tax_amount numeric(15,2) NOT NULL,
  advance_tax_paid numeric(15,2) DEFAULT 0,
  withholding_tax numeric(15,2) DEFAULT 0,
  final_tax_liability numeric(15,2) NOT NULL,
  filing_status text DEFAULT 'pending' CHECK (filing_status IN ('pending', 'filed', 'assessed', 'paid')),
  due_date date NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Invoice management system
CREATE TABLE IF NOT EXISTS public.financial_invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number text NOT NULL UNIQUE,
  vendor_id uuid NOT NULL REFERENCES public.vendors(id),
  order_id uuid REFERENCES public.orders(id),
  invoice_type text NOT NULL CHECK (invoice_type IN ('sales', 'commission', 'tax', 'refund')),
  issue_date date NOT NULL,
  due_date date NOT NULL,
  subtotal numeric(15,2) NOT NULL,
  vat_amount numeric(15,2) DEFAULT 0,
  tax_amount numeric(15,2) DEFAULT 0,
  total_amount numeric(15,2) NOT NULL,
  currency text DEFAULT 'BDT',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  payment_terms text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  paid_at timestamp with time zone
);

-- Financial reconciliation
CREATE TABLE IF NOT EXISTS public.financial_reconciliation (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reconciliation_type text NOT NULL CHECK (reconciliation_type IN ('bank', 'payment_gateway', 'vendor', 'inventory')),
  reference_date date NOT NULL,
  system_balance numeric(15,2) NOT NULL,
  external_balance numeric(15,2) NOT NULL,
  variance numeric(15,2) GENERATED ALWAYS AS (system_balance - external_balance) STORED,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reconciled', 'discrepancy')),
  reconciled_by uuid REFERENCES auth.users(id),
  reconciliation_notes text,
  supporting_documents jsonb,
  created_at timestamp with time zone DEFAULT now(),
  reconciled_at timestamp with time zone
);

-- Currency exchange rates for multi-currency support
CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_currency text NOT NULL DEFAULT 'BDT',
  target_currency text NOT NULL,
  exchange_rate numeric(10,6) NOT NULL,
  rate_date date NOT NULL,
  rate_source text DEFAULT 'bangladesh_bank',
  is_official boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(base_currency, target_currency, rate_date)
);

-- Budget planning and forecasting
CREATE TABLE IF NOT EXISTS public.budget_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_name text NOT NULL,
  fiscal_year integer NOT NULL,
  period_type text CHECK (period_type IN ('annual', 'quarterly', 'monthly')),
  department text,
  account_id uuid REFERENCES public.chart_of_accounts(id),
  budgeted_amount numeric(15,2) NOT NULL,
  actual_amount numeric(15,2) DEFAULT 0,
  variance numeric(15,2) GENERATED ALWAYS AS (budgeted_amount - actual_amount) STORED,
  variance_percentage numeric(5,2) GENERATED ALWAYS AS (
    CASE WHEN budgeted_amount != 0 THEN ((budgeted_amount - actual_amount) / budgeted_amount) * 100 ELSE 0 END
  ) STORED,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'active', 'closed')),
  created_by uuid REFERENCES auth.users(id),
  approved_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all financial tables
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.general_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bangladesh_tax_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vat_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_tax_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_reconciliation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin full access chart_of_accounts" ON public.chart_of_accounts FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access general_ledger" ON public.general_ledger FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access financial_periods" ON public.financial_periods FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access bangladesh_tax_config" ON public.bangladesh_tax_config FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access vat_transactions" ON public.vat_transactions FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access income_tax_records" ON public.income_tax_records FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access financial_invoices" ON public.financial_invoices FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access financial_reconciliation" ON public.financial_reconciliation FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access exchange_rates" ON public.exchange_rates FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access budget_plans" ON public.budget_plans FOR ALL TO authenticated USING (is_admin_user());

-- Vendor access to their own financial data
CREATE POLICY "Vendors can view their invoices" ON public.financial_invoices FOR SELECT TO authenticated USING (vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "Vendors can view their income tax records" ON public.income_tax_records FOR SELECT TO authenticated USING (vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "Vendors can view their VAT transactions" ON public.vat_transactions FOR SELECT TO authenticated USING (vendor_id = auth.uid() OR is_admin_user());

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_general_ledger_transaction_id ON public.general_ledger(transaction_id);
CREATE INDEX IF NOT EXISTS idx_general_ledger_account_id ON public.general_ledger(account_id);
CREATE INDEX IF NOT EXISTS idx_general_ledger_transaction_date ON public.general_ledger(transaction_date);
CREATE INDEX IF NOT EXISTS idx_vat_transactions_vendor_id ON public.vat_transactions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vat_transactions_transaction_date ON public.vat_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_financial_invoices_vendor_id ON public.financial_invoices(vendor_id);
CREATE INDEX IF NOT EXISTS idx_financial_invoices_status ON public.financial_invoices(status);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_date ON public.exchange_rates(rate_date);
CREATE INDEX IF NOT EXISTS idx_income_tax_records_vendor_tax_year ON public.income_tax_records(vendor_id, tax_year);