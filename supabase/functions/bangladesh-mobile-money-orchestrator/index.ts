import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MobileMoneyRequest {
  action: 'transfer' | 'installment' | 'micro_aggregate' | 'cross_wallet' | 'balance_sync';
  user_id: string;
  data: any;
}

interface WalletProvider {
  name: string;
  api_endpoint: string;
  supported_operations: string[];
  transaction_limits: {
    daily: number;
    monthly: number;
    single_transaction: number;
  };
}

const BD_WALLET_PROVIDERS: Record<string, WalletProvider> = {
  bkash: {
    name: 'bKash',
    api_endpoint: 'https://api.bkash.com/v1',
    supported_operations: ['transfer', 'payment', 'installment', 'micro_payment'],
    transaction_limits: { daily: 25000, monthly: 200000, single_transaction: 25000 }
  },
  nagad: {
    name: 'Nagad',
    api_endpoint: 'https://api.nagad.com.bd/v1',
    supported_operations: ['transfer', 'payment', 'cross_wallet'],
    transaction_limits: { daily: 20000, monthly: 150000, single_transaction: 20000 }
  },
  rocket: {
    name: 'Rocket',
    api_endpoint: 'https://api.rocket.com.bd/v1',
    supported_operations: ['transfer', 'payment'],
    transaction_limits: { daily: 15000, monthly: 100000, single_transaction: 15000 }
  },
  upay: {
    name: 'Upay',
    api_endpoint: 'https://api.upay.com.bd/v1',
    supported_operations: ['transfer', 'payment', 'micro_payment'],
    transaction_limits: { daily: 10000, monthly: 75000, single_transaction: 10000 }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { action, user_id, data }: MobileMoneyRequest = await req.json();

    switch (action) {
      case 'transfer':
        return await handleCrossWalletTransfer(data, supabaseClient);
      
      case 'installment':
        return await handleInstallmentPayment(data, supabaseClient);
      
      case 'micro_aggregate':
        return await handleMicroPaymentAggregation(user_id, supabaseClient);
      
      case 'balance_sync':
        return await handleBalanceSync(user_id, supabaseClient);
      
      default:
        return new Response(JSON.stringify({
          error: 'Invalid action',
          supported_actions: ['transfer', 'installment', 'micro_aggregate', 'balance_sync']
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('Mobile money orchestrator error:', error);
    return new Response(JSON.stringify({
      error: 'Processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function handleCrossWalletTransfer(data: any, supabaseClient: any): Promise<Response> {
  const { from_wallet_id, to_wallet_id, amount, transfer_type = 'regular' } = data;

  // Get wallet details
  const { data: wallets } = await supabaseClient
    .from('mobile_money_wallets')
    .select('*')
    .in('id', [from_wallet_id, to_wallet_id]);

  if (!wallets || wallets.length !== 2) {
    return new Response(JSON.stringify({
      error: 'Invalid wallet IDs'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const fromWallet = wallets.find(w => w.id === from_wallet_id);
  const toWallet = wallets.find(w => w.id === to_wallet_id);

  // Validate transfer limits
  const fromProvider = BD_WALLET_PROVIDERS[fromWallet.wallet_provider];
  if (amount > fromProvider.transaction_limits.single_transaction) {
    return new Response(JSON.stringify({
      error: 'Amount exceeds single transaction limit',
      limit: fromProvider.transaction_limits.single_transaction
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Calculate transfer fee
  const transferFee = calculateTransferFee(amount, fromWallet.wallet_provider, toWallet.wallet_provider);

  // Create transfer record
  const { data: transfer, error } = await supabaseClient
    .from('cross_wallet_transfers')
    .insert({
      from_wallet_id,
      to_wallet_id,
      amount,
      transfer_fee: transferFee,
      transfer_type,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Process the transfer
  const result = await processWalletTransfer(transfer, fromWallet, toWallet, supabaseClient);

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleInstallmentPayment(data: any, supabaseClient: any): Promise<Response> {
  const { 
    order_id, 
    customer_id, 
    total_amount, 
    installment_count, 
    payment_frequency = 'monthly',
    down_payment = 0,
    wallet_id 
  } = data;

  // Calculate installment amount
  const remainingAmount = total_amount - down_payment;
  const installmentAmount = Math.ceil(remainingAmount / installment_count);

  // Calculate next payment date
  const nextPaymentDate = new Date();
  switch (payment_frequency) {
    case 'weekly':
      nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
      break;
    case 'monthly':
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);
      break;
  }

  // Create installment plan
  const { data: plan, error } = await supabaseClient
    .from('installment_payment_plans')
    .insert({
      order_id,
      customer_id,
      total_amount,
      installment_count,
      installment_amount,
      payment_frequency,
      down_payment,
      next_payment_date: nextPaymentDate.toISOString().split('T')[0],
      mobile_money_wallet_id: wallet_id
    })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Process down payment if any
  let downPaymentResult = null;
  if (down_payment > 0) {
    downPaymentResult = await processInstallmentPayment(plan.id, down_payment, supabaseClient);
  }

  return new Response(JSON.stringify({
    plan,
    down_payment_result: downPaymentResult,
    next_payment_date: nextPaymentDate.toISOString(),
    installment_schedule: generateInstallmentSchedule(plan)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleMicroPaymentAggregation(user_id: string, supabaseClient: any): Promise<Response> {
  // Get or create current aggregation
  const { data: aggregation } = await supabaseClient
    .from('micro_payment_aggregations')
    .select('*')
    .eq('user_id', user_id)
    .is('processed_at', null)
    .single();

  if (!aggregation) {
    // Create new aggregation
    const { data: newAggregation, error } = await supabaseClient
      .from('micro_payment_aggregations')
      .insert({
        user_id,
        aggregation_period: 'daily',
        total_micro_amount: 0,
        transaction_count: 0
      })
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      aggregation: newAggregation,
      status: 'created',
      ready_for_processing: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Check if ready for processing
  const result = await supabaseClient.rpc('process_micro_payment_aggregation', {
    p_user_id: user_id
  });

  return new Response(JSON.stringify({
    aggregation,
    processing_result: result.data,
    ready_for_processing: aggregation.total_micro_amount >= aggregation.min_amount_threshold
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleBalanceSync(user_id: string, supabaseClient: any): Promise<Response> {
  // Get all user wallets
  const { data: wallets } = await supabaseClient
    .from('mobile_money_wallets')
    .select('*')
    .eq('user_id', user_id)
    .eq('verification_status', 'verified');

  if (!wallets || wallets.length === 0) {
    return new Response(JSON.stringify({
      error: 'No verified wallets found'
    }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Sync balances from each provider
  const balanceResults = await Promise.all(
    wallets.map(wallet => syncWalletBalance(wallet))
  );

  // Update cached balances
  const updatePromises = wallets.map((wallet, index) => 
    supabaseClient
      .from('mobile_money_wallets')
      .update({
        balance_cache: balanceResults[index].balance,
        last_sync_at: new Date().toISOString()
      })
      .eq('id', wallet.id)
  );

  await Promise.all(updatePromises);

  return new Response(JSON.stringify({
    wallets: wallets.map((wallet, index) => ({
      ...wallet,
      balance_cache: balanceResults[index].balance,
      sync_status: balanceResults[index].success ? 'success' : 'failed',
      sync_timestamp: new Date().toISOString()
    }))
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function processWalletTransfer(
  transfer: any, 
  fromWallet: any, 
  toWallet: any, 
  supabaseClient: any
): Promise<any> {
  try {
    // Simulate API call to from wallet provider
    const debitResult = await callWalletAPI(
      fromWallet.wallet_provider,
      'debit',
      {
        wallet_number: fromWallet.wallet_number,
        amount: transfer.amount + transfer.transfer_fee
      }
    );

    if (!debitResult.success) {
      await supabaseClient
        .from('cross_wallet_transfers')
        .update({ status: 'failed', gateway_response: debitResult })
        .eq('id', transfer.id);

      return { success: false, error: debitResult.error };
    }

    // Credit to destination wallet
    const creditResult = await callWalletAPI(
      toWallet.wallet_provider,
      'credit',
      {
        wallet_number: toWallet.wallet_number,
        amount: transfer.amount
      }
    );

    if (!creditResult.success) {
      // Rollback debit if credit fails
      await callWalletAPI(fromWallet.wallet_provider, 'credit', {
        wallet_number: fromWallet.wallet_number,
        amount: transfer.amount + transfer.transfer_fee
      });

      await supabaseClient
        .from('cross_wallet_transfers')
        .update({ status: 'failed', gateway_response: creditResult })
        .eq('id', transfer.id);

      return { success: false, error: creditResult.error };
    }

    // Update transfer status
    await supabaseClient
      .from('cross_wallet_transfers')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString(),
        gateway_response: { debit: debitResult, credit: creditResult }
      })
      .eq('id', transfer.id);

    return {
      success: true,
      transaction_id: transfer.id,
      debit_reference: debitResult.reference,
      credit_reference: creditResult.reference
    };

  } catch (error) {
    await supabaseClient
      .from('cross_wallet_transfers')
      .update({ status: 'failed', gateway_response: { error: error.message } })
      .eq('id', transfer.id);

    return { success: false, error: error.message };
  }
}

async function callWalletAPI(provider: string, operation: string, data: any): Promise<any> {
  // Simulate API calls to Bangladesh mobile money providers
  // In production, would use actual provider APIs
  
  const providerConfig = BD_WALLET_PROVIDERS[provider];
  if (!providerConfig) {
    return { success: false, error: 'Unsupported provider' };
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

  // Simulate success/failure
  const successRate = 0.95; // 95% success rate
  const isSuccess = Math.random() < successRate;

  if (isSuccess) {
    return {
      success: true,
      reference: `${provider.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
  } else {
    return {
      success: false,
      error: 'Insufficient balance or network error',
      error_code: 'TRANSACTION_FAILED'
    };
  }
}

function calculateTransferFee(amount: number, fromProvider: string, toProvider: string): number {
  // Bangladesh mobile money transfer fee structure
  const baseFee = 5; // 5 BDT base fee
  const percentageFee = amount * 0.005; // 0.5% of amount
  
  // Cross-provider transfer has higher fees
  const crossProviderFee = fromProvider !== toProvider ? 10 : 0;
  
  return Math.min(baseFee + percentageFee + crossProviderFee, 50); // Max 50 BDT
}

async function syncWalletBalance(wallet: any): Promise<{ balance: number; success: boolean }> {
  try {
    const result = await callWalletAPI(wallet.wallet_provider, 'balance', {
      wallet_number: wallet.wallet_number
    });

    if (result.success) {
      // Mock balance - in production would come from API response
      const mockBalance = Math.floor(Math.random() * 10000) + 1000;
      return { balance: mockBalance, success: true };
    }

    return { balance: wallet.balance_cache || 0, success: false };
  } catch (error) {
    return { balance: wallet.balance_cache || 0, success: false };
  }
}

async function processInstallmentPayment(planId: string, amount: number, supabaseClient: any): Promise<any> {
  // Simulate installment payment processing
  return {
    success: true,
    payment_reference: `INST-${Date.now()}`,
    amount,
    timestamp: new Date().toISOString()
  };
}

function generateInstallmentSchedule(plan: any): any[] {
  const schedule = [];
  const startDate = new Date(plan.next_payment_date);
  
  for (let i = 0; i < plan.installment_count; i++) {
    const paymentDate = new Date(startDate);
    
    switch (plan.payment_frequency) {
      case 'weekly':
        paymentDate.setDate(paymentDate.getDate() + (i * 7));
        break;
      case 'monthly':
        paymentDate.setMonth(paymentDate.getMonth() + i);
        break;
      case 'quarterly':
        paymentDate.setMonth(paymentDate.getMonth() + (i * 3));
        break;
    }
    
    schedule.push({
      installment_number: i + 1,
      payment_date: paymentDate.toISOString().split('T')[0],
      amount: plan.installment_amount,
      status: 'pending'
    });
  }
  
  return schedule;
}