import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PayoutRequest {
  vendor_id: string;
  period_start?: string;
  period_end?: string;
  amount?: number;
  payout_method: 'bank_transfer' | 'mobile_banking' | 'check';
  payout_details: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { endpoint, data } = await req.json() as { endpoint: string; data: PayoutRequest };

    console.log(`[VENDOR-PAYOUT] Processing ${endpoint}`);

    switch (endpoint) {
      case 'calculate_payout':
        return await calculateVendorPayout(supabase, data);
      
      case 'generate_payout':
        return await generatePayout(supabase, data);
      
      case 'process_payout':
        return await processPayout(supabase, data);
      
      case 'get_payout_history':
        return await getPayoutHistory(supabase, data);
      
      case 'get_payout_summary':
        return await getPayoutSummary(supabase, data);

      case 'update_payout_method':
        return await updatePayoutMethod(supabase, data);

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('[VENDOR-PAYOUT] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function calculateVendorPayout(supabase: any, data: PayoutRequest) {
  const { vendor_id, period_start, period_end } = data;
  
  const startDate = period_start || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const endDate = period_end || new Date().toISOString();

  console.log(`[CALCULATE] Vendor ${vendor_id} from ${startDate} to ${endDate}`);

  // Get vendor commission rates
  const { data: commissionRates, error: rateError } = await supabase
    .from('vendor_commission_rates')
    .select('*')
    .eq('vendor_id', vendor_id)
    .eq('is_active', true)
    .single();

  if (rateError) {
    console.log('Using default commission rate');
  }

  // Calculate gross sales from vendor commissions
  const { data: commissions, error: commissionError } = await supabase
    .from('vendor_commissions')
    .select(`
      gross_amount,
      commission_amount,
      platform_fee,
      net_commission,
      transaction_date
    `)
    .eq('vendor_id', vendor_id)
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate);

  if (commissionError) {
    throw new Error(`Failed to fetch commission data: ${commissionError.message}`);
  }

  // Calculate totals
  const grossSales = commissions.reduce((sum, c) => sum + (c.gross_amount || 0), 0);
  const totalCommissions = commissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0);
  const platformFees = commissions.reduce((sum, c) => sum + (c.platform_fee || 0), 0);
  const netCommissions = commissions.reduce((sum, c) => sum + (c.net_commission || 0), 0);

  // Calculate tax deduction (5% withholding tax in Bangladesh)
  const taxRate = 0.05;
  const taxDeduction = netCommissions * taxRate;

  // Get any adjustments
  const { data: adjustments, error: adjError } = await supabase
    .from('vendor_payout_adjustments')
    .select('adjustment_amount, adjustment_reason')
    .eq('vendor_id', vendor_id)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  const totalAdjustments = adjustments?.reduce((sum, adj) => sum + (adj.adjustment_amount || 0), 0) || 0;

  // Calculate final payout amount
  const netPayoutAmount = netCommissions - taxDeduction + totalAdjustments;

  const payoutCalculation = {
    vendor_id,
    period_start: startDate,
    period_end: endDate,
    gross_sales: grossSales,
    total_orders: commissions.length,
    platform_commission: totalCommissions,
    platform_fees: platformFees,
    tax_deduction: taxDeduction,
    adjustments: totalAdjustments,
    net_payout_amount: Math.max(0, netPayoutAmount), // Ensure non-negative
    commission_breakdown: commissions.map(c => ({
      transaction_date: c.transaction_date,
      gross_amount: c.gross_amount,
      commission: c.commission_amount,
      platform_fee: c.platform_fee,
      net_commission: c.net_commission
    })),
    adjustment_details: adjustments || []
  };

  return new Response(JSON.stringify({
    success: true,
    data: payoutCalculation
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function generatePayout(supabase: any, data: PayoutRequest) {
  const { vendor_id, period_start, period_end, payout_method, payout_details } = data;
  
  console.log(`[GENERATE] Creating payout for vendor ${vendor_id}`);

  // First calculate the payout
  const calculationResponse = await calculateVendorPayout(supabase, data);
  const calculationData = await calculationResponse.json();
  
  if (!calculationData.success) {
    throw new Error('Failed to calculate payout');
  }

  const calculation = calculationData.data;

  // Check if payout already exists for this period
  const { data: existingPayout, error: existingError } = await supabase
    .from('vendor_payouts')
    .select('id, status')
    .eq('vendor_id', vendor_id)
    .eq('payout_period_start', calculation.period_start)
    .eq('payout_period_end', calculation.period_end)
    .single();

  if (existingPayout && existingPayout.status !== 'failed') {
    throw new Error('Payout already exists for this period');
  }

  // Create payout record
  const { data: payout, error: payoutError } = await supabase
    .from('vendor_payouts')
    .insert({
      vendor_id,
      payout_period_start: calculation.period_start,
      payout_period_end: calculation.period_end,
      gross_sales: calculation.gross_sales,
      platform_commission: calculation.platform_commission,
      platform_fees: calculation.platform_fees,
      tax_deduction: calculation.tax_deduction,
      adjustment_amount: calculation.adjustments,
      net_payout_amount: calculation.net_payout_amount,
      payout_method,
      payout_details,
      status: 'pending'
    })
    .select()
    .single();

  if (payoutError) {
    throw new Error(`Failed to create payout: ${payoutError.message}`);
  }

  // Log payout generation
  await supabase
    .from('vendor_payout_logs')
    .insert({
      payout_id: payout.id,
      action: 'generated',
      details: { calculation },
      performed_by: 'system'
    });

  return new Response(JSON.stringify({
    success: true,
    data: {
      payout_id: payout.id,
      ...calculation,
      payout_method,
      status: 'pending'
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function processPayout(supabase: any, data: any) {
  const { payout_id, processor_id } = data;
  
  console.log(`[PROCESS] Processing payout ${payout_id}`);

  // Get payout details
  const { data: payout, error: payoutError } = await supabase
    .from('vendor_payouts')
    .select('*')
    .eq('id', payout_id)
    .eq('status', 'pending')
    .single();

  if (payoutError || !payout) {
    throw new Error('Payout not found or already processed');
  }

  // Update payout status to processing
  await supabase
    .from('vendor_payouts')
    .update({ 
      status: 'processing',
      processor_id
    })
    .eq('id', payout_id);

  try {
    // Process based on payout method
    let processResult;
    switch (payout.payout_method) {
      case 'bank_transfer':
        processResult = await processBankTransfer(payout);
        break;
      case 'mobile_banking':
        processResult = await processMobileBankingPayout(payout);
        break;
      case 'check':
        processResult = await processCheckPayout(payout);
        break;
      default:
        throw new Error(`Unsupported payout method: ${payout.payout_method}`);
    }

    // Update payout with success
    const finalStatus = processResult.success ? 'completed' : 'failed';
    await supabase
      .from('vendor_payouts')
      .update({ 
        status: finalStatus,
        payout_reference: processResult.reference,
        processed_at: new Date().toISOString()
      })
      .eq('id', payout_id);

    // Log processing result
    await supabase
      .from('vendor_payout_logs')
      .insert({
        payout_id,
        action: finalStatus === 'completed' ? 'processed_successfully' : 'processing_failed',
        details: processResult,
        performed_by: processor_id
      });

    return new Response(JSON.stringify({
      success: processResult.success,
      data: {
        payout_id,
        status: finalStatus,
        reference: processResult.reference,
        amount: payout.net_payout_amount,
        processing_time: processResult.processing_time || 'Immediate'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // Update payout status to failed
    await supabase
      .from('vendor_payouts')
      .update({ 
        status: 'failed'
      })
      .eq('id', payout_id);

    throw error;
  }
}

async function getPayoutHistory(supabase: any, data: PayoutRequest) {
  const { vendor_id } = data;
  
  const { data: payouts, error } = await supabase
    .from('vendor_payouts')
    .select(`
      id,
      payout_period_start,
      payout_period_end,
      gross_sales,
      platform_commission,
      platform_fees,
      tax_deduction,
      net_payout_amount,
      payout_method,
      status,
      payout_reference,
      processed_at,
      created_at
    `)
    .eq('vendor_id', vendor_id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch payout history: ${error.message}`);
  }

  return new Response(JSON.stringify({
    success: true,
    data: payouts
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getPayoutSummary(supabase: any, data: PayoutRequest) {
  const { vendor_id } = data;
  
  // Get summary statistics
  const { data: summary, error } = await supabase
    .from('vendor_payouts')
    .select(`
      net_payout_amount,
      status,
      processed_at
    `)
    .eq('vendor_id', vendor_id);

  if (error) {
    throw new Error(`Failed to fetch payout summary: ${error.message}`);
  }

  const totalPaid = summary
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.net_payout_amount || 0), 0);

  const pendingAmount = summary
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + (p.net_payout_amount || 0), 0);

  const lastPayoutDate = summary
    .filter(p => p.status === 'completed' && p.processed_at)
    .sort((a, b) => new Date(b.processed_at!).getTime() - new Date(a.processed_at!).getTime())[0]?.processed_at;

  return new Response(JSON.stringify({
    success: true,
    data: {
      total_paid: totalPaid,
      pending_amount: pendingAmount,
      total_payouts: summary.length,
      completed_payouts: summary.filter(p => p.status === 'completed').length,
      pending_payouts: summary.filter(p => p.status === 'pending').length,
      last_payout_date: lastPayoutDate
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function updatePayoutMethod(supabase: any, data: PayoutRequest) {
  const { vendor_id, payout_method, payout_details } = data;
  
  // Update vendor's preferred payout method
  const { error } = await supabase
    .from('vendor_payment_preferences')
    .upsert({
      vendor_id,
      preferred_method: payout_method,
      payment_details: payout_details,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'vendor_id'
    });

  if (error) {
    throw new Error(`Failed to update payout method: ${error.message}`);
  }

  return new Response(JSON.stringify({
    success: true,
    data: {
      vendor_id,
      payout_method,
      updated_at: new Date().toISOString()
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Payout processing implementations
async function processBankTransfer(payout: any) {
  // Mock bank transfer processing
  const reference = `BT${Date.now()}`;
  
  // Simulate API call to bank
  console.log(`Processing bank transfer: ${payout.net_payout_amount} BDT`);
  
  return {
    success: true,
    reference,
    processing_time: '1-3 business days',
    bank_details: payout.payout_details
  };
}

async function processMobileBankingPayout(payout: any) {
  // Mock mobile banking payout (bKash, Nagad, Rocket)
  const gateway = payout.payout_details.gateway || 'bkash';
  const reference = `${gateway.toUpperCase()}${Date.now()}`;
  
  console.log(`Processing ${gateway} payout: ${payout.net_payout_amount} BDT`);
  
  return {
    success: true,
    reference,
    processing_time: 'Immediate',
    gateway,
    mobile_number: payout.payout_details.mobile_number
  };
}

async function processCheckPayout(payout: any) {
  // Mock check processing
  const reference = `CHK${Date.now()}`;
  
  console.log(`Processing check payout: ${payout.net_payout_amount} BDT`);
  
  return {
    success: true,
    reference,
    processing_time: '5-7 business days',
    delivery_address: payout.payout_details.address
  };
}