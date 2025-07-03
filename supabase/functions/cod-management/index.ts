import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CODRequest {
  order_id?: string;
  customer_id?: string;
  vendor_id?: string;
  delivery_agent_id?: string;
  cod_amount?: number;
  delivery_address?: any;
  customer_phone?: string;
  collection_status?: string;
  deposit_reference?: string;
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

    const { endpoint, data } = await req.json() as { endpoint: string; data: CODRequest };

    console.log(`[COD-MANAGEMENT] Processing ${endpoint}`);

    switch (endpoint) {
      case 'create_cod_order':
        return await createCODOrder(supabase, data);
      
      case 'verify_cod_eligibility':
        return await verifyCODEligibility(supabase, data);
      
      case 'collect_cod_payment':
        return await collectCODPayment(supabase, data);
      
      case 'deposit_cod_collection':
        return await depositCODCollection(supabase, data);
      
      case 'get_cod_analytics':
        return await getCODAnalytics(supabase, data);
      
      case 'get_delivery_agent_collections':
        return await getDeliveryAgentCollections(supabase, data);

      case 'reconcile_cod_collections':
        return await reconcileCODCollections(supabase, data);

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('[COD-MANAGEMENT] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function createCODOrder(supabase: any, data: CODRequest) {
  const { order_id, customer_id, vendor_id, cod_amount, delivery_address, customer_phone, delivery_instructions } = data;
  
  console.log(`[CREATE-COD] Order ${order_id} - Amount: ${cod_amount} BDT`);

  // Verify COD eligibility first
  const eligibilityResponse = await verifyCODEligibility(supabase, { customer_id, cod_amount });
  const eligibilityData = await eligibilityResponse.json();
  
  if (!eligibilityData.success || !eligibilityData.data.eligible) {
    throw new Error(`COD not eligible: ${eligibilityData.data.reason}`);
  }

  // Calculate COD collection fee (typically 1-2% of order value)
  const collectionFeeRate = 0.015; // 1.5%
  const collectionFee = cod_amount! * collectionFeeRate;

  // Create COD transaction record
  const { data: codTransaction, error: codError } = await supabase
    .from('cod_transactions')
    .insert({
      order_id,
      customer_id,
      vendor_id,
      cod_amount,
      collection_fee: collectionFee,
      delivery_address,
      customer_phone,
      delivery_instructions,
      status: 'pending'
    })
    .select()
    .single();

  if (codError) {
    throw new Error(`Failed to create COD transaction: ${codError.message}`);
  }

  // Update customer COD usage count
  await supabase
    .from('customer_cod_metrics')
    .upsert({
      customer_id,
      total_cod_orders: 1,
      total_cod_amount: cod_amount,
      last_cod_order: new Date().toISOString()
    }, {
      onConflict: 'customer_id',
      update: {
        total_cod_orders: 'customer_cod_metrics.total_cod_orders + 1',
        total_cod_amount: `customer_cod_metrics.total_cod_amount + ${cod_amount}`,
        last_cod_order: new Date().toISOString()
      }
    });

  return new Response(JSON.stringify({
    success: true,
    data: {
      cod_transaction_id: codTransaction.id,
      order_id,
      cod_amount,
      collection_fee: collectionFee,
      total_amount: cod_amount + collectionFee,
      status: 'pending',
      delivery_instructions: 'Customer will pay cash on delivery. Please collect exact amount and provide receipt.'
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function verifyCODEligibility(supabase: any, data: CODRequest) {
  const { customer_id, cod_amount } = data;
  
  console.log(`[VERIFY-COD] Customer ${customer_id} - Amount: ${cod_amount}`);

  // Get customer COD history
  const { data: codMetrics, error: metricsError } = await supabase
    .from('customer_cod_metrics')
    .select('*')
    .eq('customer_id', customer_id)
    .single();

  // Get customer profile and order history
  const { data: customer, error: customerError } = await supabase
    .from('profiles')
    .select('created_at, phone_verified, email_verified')
    .eq('id', customer_id)
    .single();

  const eligibilityChecks = {
    account_age_check: true,
    amount_limit_check: true,
    frequency_check: true,
    verification_check: true,
    blacklist_check: true
  };

  let eligible = true;
  const reasons = [];

  // 1. Account age check (minimum 30 days)
  if (customer) {
    const accountAge = (new Date().getTime() - new Date(customer.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (accountAge < 30) {
      eligible = false;
      eligibilityChecks.account_age_check = false;
      reasons.push('Account must be at least 30 days old');
    }
  }

  // 2. Amount limit check (max 10,000 BDT for new customers, 50,000 for verified)
  const maxAmount = customer?.phone_verified && customer?.email_verified ? 50000 : 10000;
  if (cod_amount! > maxAmount) {
    eligible = false;
    eligibilityChecks.amount_limit_check = false;
    reasons.push(`COD amount exceeds limit of ${maxAmount} BDT`);
  }

  // 3. Frequency check (max 3 pending COD orders)
  const { data: pendingCODs, error: pendingError } = await supabase
    .from('cod_transactions')
    .select('id')
    .eq('customer_id', customer_id)
    .eq('status', 'pending');

  if (pendingCODs && pendingCODs.length >= 3) {
    eligible = false;
    eligibilityChecks.frequency_check = false;
    reasons.push('Maximum 3 pending COD orders allowed');
  }

  // 4. Verification check
  if (!customer?.phone_verified) {
    eligible = false;
    eligibilityChecks.verification_check = false;
    reasons.push('Phone number must be verified for COD');
  }

  // 5. Blacklist check (customers with failed COD attempts)
  const { data: blacklist, error: blacklistError } = await supabase
    .from('cod_blacklist')
    .select('reason, blacklisted_until')
    .eq('customer_id', customer_id)
    .single();

  if (blacklist && (!blacklist.blacklisted_until || new Date(blacklist.blacklisted_until) > new Date())) {
    eligible = false;
    eligibilityChecks.blacklist_check = false;
    reasons.push(`Blacklisted for COD: ${blacklist.reason}`);
  }

  return new Response(JSON.stringify({
    success: true,
    data: {
      eligible,
      eligibility_checks: eligibilityChecks,
      max_cod_amount: maxAmount,
      current_pending_orders: pendingCODs?.length || 0,
      cod_history: codMetrics || { total_cod_orders: 0, total_cod_amount: 0 },
      reasons: reasons.length > 0 ? reasons : ['All eligibility checks passed']
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function collectCODPayment(supabase: any, data: CODRequest) {
  const { order_id, delivery_agent_id, collection_status } = data;
  
  console.log(`[COLLECT-COD] Order ${order_id} by agent ${delivery_agent_id}`);

  // Get COD transaction
  const { data: codTransaction, error: codError } = await supabase
    .from('cod_transactions')
    .select('*')
    .eq('order_id', order_id)
    .eq('status', 'pending')
    .single();

  if (codError || !codTransaction) {
    throw new Error('COD transaction not found or already processed');
  }

  const isSuccessful = collection_status === 'collected';
  const newStatus = isSuccessful ? 'collected' : 'failed';

  // Update COD transaction
  const { error: updateError } = await supabase
    .from('cod_transactions')
    .update({
      delivery_agent_id,
      status: newStatus,
      collected_at: isSuccessful ? new Date().toISOString() : null,
      notes: isSuccessful ? 'Payment collected successfully' : 'Customer refused to pay or unavailable'
    })
    .eq('id', codTransaction.id);

  if (updateError) {
    throw new Error(`Failed to update COD transaction: ${updateError.message}`);
  }

  // If collection failed, create/update blacklist entry
  if (!isSuccessful) {
    await handleFailedCODCollection(supabase, codTransaction.customer_id);
  } else {
    // Create delivery agent collection record
    await supabase
      .from('delivery_agent_collections')
      .insert({
        agent_id: delivery_agent_id,
        cod_transaction_id: codTransaction.id,
        collected_amount: codTransaction.cod_amount + codTransaction.collection_fee,
        commission_rate: 0.02, // 2% commission for delivery agents
        agent_commission: (codTransaction.cod_amount + codTransaction.collection_fee) * 0.02,
        collection_date: new Date().toISOString(),
        status: 'collected'
      });
  }

  return new Response(JSON.stringify({
    success: true,
    data: {
      cod_transaction_id: codTransaction.id,
      order_id,
      status: newStatus,
      collected_amount: isSuccessful ? codTransaction.cod_amount + codTransaction.collection_fee : 0,
      collection_fee: codTransaction.collection_fee,
      agent_commission: isSuccessful ? (codTransaction.cod_amount + codTransaction.collection_fee) * 0.02 : 0,
      collected_at: isSuccessful ? new Date().toISOString() : null
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function depositCODCollection(supabase: any, data: CODRequest) {
  const { delivery_agent_id, deposit_reference } = data;
  
  console.log(`[DEPOSIT-COD] Agent ${delivery_agent_id} depositing collections`);

  // Get all collected COD amounts for this agent that haven't been deposited
  const { data: collections, error: collectionsError } = await supabase
    .from('delivery_agent_collections')
    .select(`
      id,
      collected_amount,
      agent_commission,
      cod_transaction_id,
      cod_transactions (
        order_id,
        vendor_id
      )
    `)
    .eq('agent_id', delivery_agent_id)
    .eq('status', 'collected');

  if (collectionsError || !collections || collections.length === 0) {
    throw new Error('No collections found for deposit');
  }

  const totalCollected = collections.reduce((sum, c) => sum + c.collected_amount, 0);
  const totalCommission = collections.reduce((sum, c) => sum + c.agent_commission, 0);
  const netDeposit = totalCollected - totalCommission;

  // Update collections as deposited
  const collectionIds = collections.map(c => c.id);
  const { error: updateError } = await supabase
    .from('delivery_agent_collections')
    .update({
      status: 'deposited',
      deposit_reference,
      deposited_at: new Date().toISOString()
    })
    .in('id', collectionIds);

  if (updateError) {
    throw new Error(`Failed to update collections: ${updateError.message}`);
  }

  // Update COD transactions as deposited
  const codTransactionIds = collections.map(c => c.cod_transaction_id);
  await supabase
    .from('cod_transactions')
    .update({
      deposited_at: new Date().toISOString(),
      deposit_reference
    })
    .in('id', codTransactionIds);

  // Create deposit record
  const { data: deposit, error: depositError } = await supabase
    .from('cod_deposits')
    .insert({
      agent_id: delivery_agent_id,
      total_collected: totalCollected,
      agent_commission: totalCommission,
      net_deposit: netDeposit,
      collection_count: collections.length,
      deposit_reference,
      deposit_date: new Date().toISOString(),
      status: 'completed'
    })
    .select()
    .single();

  return new Response(JSON.stringify({
    success: true,
    data: {
      deposit_id: deposit.id,
      agent_id: delivery_agent_id,
      total_collected: totalCollected,
      agent_commission: totalCommission,
      net_deposit: netDeposit,
      collection_count: collections.length,
      deposit_reference,
      collections: collections.map(c => ({
        order_id: c.cod_transactions.order_id,
        amount: c.collected_amount,
        commission: c.agent_commission
      }))
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getCODAnalytics(supabase: any, data: CODRequest) {
  const { vendor_id } = data;
  
  // Get COD analytics for vendor or overall
  const vendorFilter = vendor_id ? `vendor_id.eq.${vendor_id}` : '';
  
  const { data: codStats, error: statsError } = await supabase
    .from('cod_transactions')
    .select(`
      status,
      cod_amount,
      collection_fee,
      created_at,
      collected_at,
      vendor_id
    `)
    .filter(vendorFilter);

  if (statsError) {
    throw new Error(`Failed to fetch COD analytics: ${statsError.message}`);
  }

  // Calculate metrics
  const totalOrders = codStats.length;
  const collectedOrders = codStats.filter(s => s.status === 'collected').length;
  const failedOrders = codStats.filter(s => s.status === 'failed').length;
  const pendingOrders = codStats.filter(s => s.status === 'pending').length;

  const collectionRate = totalOrders > 0 ? (collectedOrders / totalOrders) * 100 : 0;
  const totalCODAmount = codStats.reduce((sum, s) => sum + (s.cod_amount || 0), 0);
  const totalCollectionFees = codStats.reduce((sum, s) => sum + (s.collection_fee || 0), 0);
  const collectedAmount = codStats
    .filter(s => s.status === 'collected')
    .reduce((sum, s) => sum + (s.cod_amount || 0), 0);

  // Monthly trends
  const monthlyStats = {};
  codStats.forEach(stat => {
    const month = new Date(stat.created_at).toISOString().substring(0, 7);
    if (!monthlyStats[month]) {
      monthlyStats[month] = { orders: 0, amount: 0, collected: 0 };
    }
    monthlyStats[month].orders++;
    monthlyStats[month].amount += stat.cod_amount || 0;
    if (stat.status === 'collected') {
      monthlyStats[month].collected += stat.cod_amount || 0;
    }
  });

  return new Response(JSON.stringify({
    success: true,
    data: {
      overview: {
        total_orders: totalOrders,
        collected_orders: collectedOrders,
        failed_orders: failedOrders,
        pending_orders: pendingOrders,
        collection_rate: Math.round(collectionRate * 100) / 100,
        total_cod_amount: totalCODAmount,
        collected_amount: collectedAmount,
        total_collection_fees: totalCollectionFees
      },
      monthly_trends: Object.entries(monthlyStats).map(([month, stats]) => ({
        month,
        ...stats
      })),
      status_breakdown: {
        collected: collectedOrders,
        failed: failedOrders,
        pending: pendingOrders
      }
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getDeliveryAgentCollections(supabase: any, data: CODRequest) {
  const { delivery_agent_id } = data;
  
  const { data: collections, error } = await supabase
    .from('delivery_agent_collections')
    .select(`
      id,
      collected_amount,
      agent_commission,
      collection_date,
      status,
      deposited_at,
      deposit_reference,
      cod_transactions (
        order_id,
        customer_phone,
        delivery_address
      )
    `)
    .eq('agent_id', delivery_agent_id)
    .order('collection_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch agent collections: ${error.message}`);
  }

  const totalCollected = collections.reduce((sum, c) => sum + c.collected_amount, 0);
  const totalCommission = collections.reduce((sum, c) => sum + c.agent_commission, 0);
  const pendingDeposit = collections
    .filter(c => c.status === 'collected')
    .reduce((sum, c) => sum + (c.collected_amount - c.agent_commission), 0);

  return new Response(JSON.stringify({
    success: true,
    data: {
      agent_id: delivery_agent_id,
      summary: {
        total_collections: collections.length,
        total_collected: totalCollected,
        total_commission: totalCommission,
        pending_deposit: pendingDeposit,
        deposited_collections: collections.filter(c => c.status === 'deposited').length
      },
      collections: collections.map(c => ({
        id: c.id,
        order_id: c.cod_transactions.order_id,
        collected_amount: c.collected_amount,
        agent_commission: c.agent_commission,
        net_amount: c.collected_amount - c.agent_commission,
        collection_date: c.collection_date,
        status: c.status,
        deposited_at: c.deposited_at,
        deposit_reference: c.deposit_reference
      }))
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function reconcileCODCollections(supabase: any, data: any) {
  const { date } = data;
  const reconcileDate = date || new Date().toISOString().split('T')[0];
  
  console.log(`[RECONCILE-COD] Reconciling collections for ${reconcileDate}`);

  // Get all collections for the date
  const { data: collections, error } = await supabase
    .from('delivery_agent_collections')
    .select(`
      *,
      cod_transactions (*)
    `)
    .gte('collection_date', `${reconcileDate}T00:00:00`)
    .lt('collection_date', `${reconcileDate}T23:59:59`);

  if (error) {
    throw new Error(`Failed to fetch collections for reconciliation: ${error.message}`);
  }

  const reconciliationSummary = {
    date: reconcileDate,
    total_collections: collections.length,
    total_collected_amount: collections.reduce((sum, c) => sum + c.collected_amount, 0),
    total_agent_commission: collections.reduce((sum, c) => sum + c.agent_commission, 0),
    total_net_deposit: collections.reduce((sum, c) => sum + (c.collected_amount - c.agent_commission), 0),
    deposited_collections: collections.filter(c => c.status === 'deposited').length,
    pending_collections: collections.filter(c => c.status === 'collected').length,
    agent_breakdown: {}
  };

  // Break down by agent
  collections.forEach(collection => {
    const agentId = collection.agent_id;
    if (!reconciliationSummary.agent_breakdown[agentId]) {
      reconciliationSummary.agent_breakdown[agentId] = {
        collections: 0,
        total_amount: 0,
        commission: 0,
        net_deposit: 0
      };
    }
    
    reconciliationSummary.agent_breakdown[agentId].collections++;
    reconciliationSummary.agent_breakdown[agentId].total_amount += collection.collected_amount;
    reconciliationSummary.agent_breakdown[agentId].commission += collection.agent_commission;
    reconciliationSummary.agent_breakdown[agentId].net_deposit += (collection.collected_amount - collection.agent_commission);
  });

  return new Response(JSON.stringify({
    success: true,
    data: reconciliationSummary
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleFailedCODCollection(supabase: any, customer_id: string) {
  // Get customer's failed COD count
  const { data: failedCount } = await supabase
    .from('cod_transactions')
    .select('id')
    .eq('customer_id', customer_id)
    .eq('status', 'failed');

  // If more than 2 failed attempts, blacklist for 30 days
  if (failedCount && failedCount.length >= 2) {
    const blacklistUntil = new Date();
    blacklistUntil.setDate(blacklistUntil.getDate() + 30);

    await supabase
      .from('cod_blacklist')
      .upsert({
        customer_id,
        reason: `Multiple failed COD attempts (${failedCount.length + 1})`,
        blacklisted_until: blacklistUntil.toISOString(),
        created_at: new Date().toISOString()
      }, {
        onConflict: 'customer_id'
      });
  }
}