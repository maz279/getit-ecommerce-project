import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, data } = await req.json();

    switch (action) {
      case 'calculate_vat':
        return await calculateVAT(supabaseClient, data);
      case 'calculate_income_tax':
        return await calculateIncomeTax(supabaseClient, data);
      case 'generate_invoice':
        return await generateInvoice(supabaseClient, data);
      case 'reconcile_accounts':
        return await reconcileAccounts(supabaseClient, data);
      case 'create_journal_entry':
        return await createJournalEntry(supabaseClient, data);
      case 'get_financial_statements':
        return await getFinancialStatements(supabaseClient, data);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Financial service error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Bangladesh VAT calculation (15% standard rate)
async function calculateVAT(supabase: any, data: any) {
  const { vendor_id, order_id, taxable_amount, product_category } = data;
  
  // Get VAT configuration for Bangladesh
  const { data: vatConfig } = await supabase
    .from('bangladesh_tax_config')
    .select('*')
    .eq('tax_type', 'vat')
    .eq('is_active', true)
    .or(`product_category.is.null,product_category.eq.${product_category}`)
    .order('effective_from', { ascending: false })
    .limit(1)
    .single();

  const vatRate = vatConfig?.tax_rate || 15.00;
  const vatAmount = (taxable_amount * vatRate) / 100;

  // Create VAT transaction record
  const { data: vatRecord, error } = await supabase
    .from('vat_transactions')
    .insert([{
      transaction_id: crypto.randomUUID(),
      order_id,
      vendor_id,
      vat_rate: vatRate,
      taxable_amount,
      vat_amount: vatAmount,
      transaction_date: new Date().toISOString().split('T')[0]
    }])
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({
      vat_amount: vatAmount,
      vat_rate: vatRate,
      taxable_amount,
      vat_record: vatRecord
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Bangladesh Income Tax calculation
async function calculateIncomeTax(supabase: any, data: any) {
  const { vendor_id, tax_year, gross_income } = data;

  // Get income tax slabs for Bangladesh
  const taxSlabs = [
    { min: 0, max: 300000, rate: 0 },      // Tax-free threshold
    { min: 300001, max: 400000, rate: 5 },  // 5% on next 1 lakh
    { min: 400001, max: 700000, rate: 10 }, // 10% on next 3 lakh
    { min: 700001, max: 1100000, rate: 15 }, // 15% on next 4 lakh
    { min: 1100001, max: 1600000, rate: 20 }, // 20% on next 5 lakh
    { min: 1600001, max: Infinity, rate: 25 } // 25% on remaining
  ];

  let taxAmount = 0;
  let remainingIncome = gross_income;

  for (const slab of taxSlabs) {
    if (remainingIncome <= 0) break;
    
    const slabAmount = Math.min(remainingIncome, slab.max - slab.min + 1);
    if (slabAmount > 0 && gross_income > slab.min) {
      taxAmount += (slabAmount * slab.rate) / 100;
      remainingIncome -= slabAmount;
    }
  }

  // Create income tax record
  const { data: taxRecord, error } = await supabase
    .from('income_tax_records')
    .insert([{
      vendor_id,
      tax_year,
      gross_income,
      taxable_income: gross_income,
      tax_rate: 25, // Average rate for reporting
      tax_amount: taxAmount,
      final_tax_liability: taxAmount,
      due_date: new Date(`${tax_year + 1}-11-30`).toISOString().split('T')[0]
    }])
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({
      tax_amount: taxAmount,
      gross_income,
      taxable_income: gross_income,
      tax_record: taxRecord
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Invoice generation
async function generateInvoice(supabase: any, data: any) {
  const { vendor_id, order_id, invoice_type, items } = data;

  // Calculate totals
  const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0);
  const vatAmount = (subtotal * 15) / 100; // 15% VAT
  const totalAmount = subtotal + vatAmount;

  // Generate invoice number
  const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const { data: invoice, error } = await supabase
    .from('financial_invoices')
    .insert([{
      invoice_number: invoiceNumber,
      vendor_id,
      order_id,
      invoice_type,
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      subtotal,
      vat_amount: vatAmount,
      total_amount: totalAmount,
      status: 'sent'
    }])
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({
      invoice,
      invoice_number: invoiceNumber,
      subtotal,
      vat_amount: vatAmount,
      total_amount: totalAmount
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Account reconciliation
async function reconcileAccounts(supabase: any, data: any) {
  const { reconciliation_type, reference_date, external_balance } = data;

  // Get system balance from general ledger
  const { data: ledgerSum } = await supabase
    .from('general_ledger')
    .select('debit_amount, credit_amount')
    .lte('transaction_date', reference_date);

  const systemBalance = ledgerSum?.reduce((sum: number, entry: any) => 
    sum + (entry.debit_amount || 0) - (entry.credit_amount || 0), 0) || 0;

  const variance = systemBalance - external_balance;

  const { data: reconciliation, error } = await supabase
    .from('financial_reconciliation')
    .insert([{
      reconciliation_type,
      reference_date,
      system_balance: systemBalance,
      external_balance,
      status: Math.abs(variance) < 0.01 ? 'reconciled' : 'discrepancy'
    }])
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({
      reconciliation,
      system_balance: systemBalance,
      external_balance,
      variance,
      status: Math.abs(variance) < 0.01 ? 'reconciled' : 'discrepancy'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Create journal entry (double-entry bookkeeping)
async function createJournalEntry(supabase: any, data: any) {
  const { entries, description, reference_number } = data;
  const transactionId = crypto.randomUUID();
  
  // Validate double-entry (debits = credits)
  const totalDebits = entries.reduce((sum: number, entry: any) => sum + (entry.debit_amount || 0), 0);
  const totalCredits = entries.reduce((sum: number, entry: any) => sum + (entry.credit_amount || 0), 0);
  
  if (Math.abs(totalDebits - totalCredits) > 0.01) {
    throw new Error('Journal entry is not balanced: debits must equal credits');
  }

  // Insert all journal entries
  const journalEntries = entries.map((entry: any) => ({
    transaction_id: transactionId,
    account_id: entry.account_id,
    debit_amount: entry.debit_amount || 0,
    credit_amount: entry.credit_amount || 0,
    transaction_date: new Date().toISOString().split('T')[0],
    description,
    reference_number
  }));

  const { data: ledgerEntries, error } = await supabase
    .from('general_ledger')
    .insert(journalEntries)
    .select();

  if (error) throw error;

  return new Response(
    JSON.stringify({
      transaction_id: transactionId,
      entries: ledgerEntries,
      total_debits: totalDebits,
      total_credits: totalCredits,
      balanced: true
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Generate financial statements
async function getFinancialStatements(supabase: any, data: any) {
  const { statement_type, start_date, end_date } = data;

  if (statement_type === 'profit_loss') {
    // Get revenue accounts
    const { data: revenueAccounts } = await supabase
      .from('chart_of_accounts')
      .select('id, account_name')
      .eq('account_type', 'revenue');

    // Get expense accounts
    const { data: expenseAccounts } = await supabase
      .from('chart_of_accounts')
      .select('id, account_name')
      .eq('account_type', 'expense');

    // Calculate totals
    const revenue = await calculateAccountBalance(supabase, revenueAccounts, start_date, end_date, 'credit');
    const expenses = await calculateAccountBalance(supabase, expenseAccounts, start_date, end_date, 'debit');
    
    const netIncome = revenue - expenses;

    return new Response(
      JSON.stringify({
        statement_type: 'Profit & Loss Statement',
        period: `${start_date} to ${end_date}`,
        revenue,
        expenses,
        net_income: netIncome,
        currency: 'BDT'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Add balance sheet and cash flow statements as needed
  return new Response(
    JSON.stringify({ error: 'Statement type not implemented yet' }),
    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Helper function to calculate account balances
async function calculateAccountBalance(supabase: any, accounts: any[], startDate: string, endDate: string, balanceType: 'debit' | 'credit') {
  if (!accounts?.length) return 0;
  
  const accountIds = accounts.map(acc => acc.id);
  
  const { data: ledgerEntries } = await supabase
    .from('general_ledger')
    .select('debit_amount, credit_amount')
    .in('account_id', accountIds)
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate);

  if (!ledgerEntries?.length) return 0;

  return ledgerEntries.reduce((sum: number, entry: any) => {
    if (balanceType === 'debit') {
      return sum + (entry.debit_amount || 0) - (entry.credit_amount || 0);
    } else {
      return sum + (entry.credit_amount || 0) - (entry.debit_amount || 0);
    }
  }, 0);
}
