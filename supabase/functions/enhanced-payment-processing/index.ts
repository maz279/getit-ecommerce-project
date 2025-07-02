import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  amount: number;
  currency: string;
  vendorId: string;
  orderId: string;
  paymentMethod: string;
  customerData: any;
}

interface FraudCheckResult {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
  approved: boolean;
}

interface CommissionResult {
  commissionAmount: number;
  platformFee: number;
  netAmount: number;
  vendorPayout: number;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Fraud Detection Logic
async function performFraudCheck(paymentData: PaymentRequest): Promise<FraudCheckResult> {
  let riskScore = 0;
  const factors: string[] = [];
  
  // Amount-based risk
  if (paymentData.amount > 100000) {
    riskScore += 30;
    factors.push('High amount transaction');
  } else if (paymentData.amount > 50000) {
    riskScore += 15;
    factors.push('Medium amount transaction');
  }
  
  // Check customer history
  const { data: customerHistory } = await supabase
    .from('orders')
    .select('*')
    .eq('vendor_id', paymentData.vendorId)
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (!customerHistory || customerHistory.length === 0) {
    riskScore += 25;
    factors.push('New customer');
  }
  
  // Check vendor reputation
  const { data: vendorData } = await supabase
    .from('vendors')
    .select('rating, total_sales')
    .eq('id', paymentData.vendorId)
    .single();
    
  if (vendorData) {
    if (vendorData.rating < 3.0) {
      riskScore += 20;
      factors.push('Low vendor rating');
    }
    if (vendorData.total_sales < 10) {
      riskScore += 15;
      factors.push('New vendor');
    }
  }
  
  const riskLevel = riskScore > 50 ? 'high' : riskScore > 25 ? 'medium' : 'low';
  const approved = riskScore < 70;
  
  // Log fraud check
  await supabase.from('fraud_detection_logs').insert({
    order_id: paymentData.orderId,
    vendor_id: paymentData.vendorId,
    risk_score: riskScore,
    risk_level: riskLevel,
    risk_factors: factors,
    approved
  });
  
  return { riskScore, riskLevel, factors, approved };
}

// Commission Calculation
async function calculateCommission(paymentData: PaymentRequest): Promise<CommissionResult> {
  const { data: commissionData } = await supabase
    .rpc('calculate_vendor_commission', {
      p_vendor_id: paymentData.vendorId,
      p_gross_amount: paymentData.amount
    });
    
  if (commissionData && commissionData.length > 0) {
    const result = commissionData[0];
    return {
      commissionAmount: result.commission_amount,
      platformFee: result.platform_fee,
      netAmount: result.net_commission,
      vendorPayout: paymentData.amount - result.commission_amount
    };
  }
  
  // Default commission structure
  const commissionRate = 0.10; // 10%
  const commissionAmount = paymentData.amount * commissionRate;
  const platformFee = commissionAmount * 0.25; // 25% of commission
  const netAmount = commissionAmount - platformFee;
  const vendorPayout = paymentData.amount - commissionAmount;
  
  return { commissionAmount, platformFee, netAmount, vendorPayout };
}

// Payment Gateway Integration
async function processPayment(paymentData: PaymentRequest, fraudCheck: FraudCheckResult): Promise<any> {
  if (!fraudCheck.approved) {
    throw new Error('Payment rejected due to fraud risk');
  }
  
  // Mock payment processing - replace with actual gateway
  const paymentResult = {
    success: true,
    transactionId: `txn_${Date.now()}`,
    status: 'completed',
    gateway: paymentData.paymentMethod
  };
  
  // Store payment record
  await supabase.from('payments').insert({
    order_id: paymentData.orderId,
    vendor_id: paymentData.vendorId,
    amount: paymentData.amount,
    currency: paymentData.currency,
    payment_method: paymentData.paymentMethod,
    transaction_id: paymentResult.transactionId,
    status: paymentResult.status,
    risk_score: fraudCheck.riskScore
  });
  
  return paymentResult;
}

// Settlement Engine
async function processSettlement(paymentData: PaymentRequest, commission: CommissionResult): Promise<void> {
  // Create commission record
  await supabase.from('vendor_commissions').insert({
    vendor_id: paymentData.vendorId,
    order_id: paymentData.orderId,
    gross_amount: paymentData.amount,
    commission_amount: commission.commissionAmount,
    platform_fee: commission.platformFee,
    net_commission: commission.netAmount,
    transaction_date: new Date().toISOString()
  });
  
  // Check if settlement is due
  const { data: pendingCommissions } = await supabase
    .from('vendor_commissions')
    .select('*')
    .eq('vendor_id', paymentData.vendorId)
    .eq('payout_status', 'pending');
    
  const totalPending = pendingCommissions?.reduce((sum, c) => sum + c.net_commission, 0) || 0;
  
  // Auto-settle if threshold met (e.g., 10,000 BDT)
  if (totalPending >= 10000) {
    await supabase.from('payout_requests').insert({
      vendor_id: paymentData.vendorId,
      request_amount: totalPending,
      currency: 'BDT',
      status: 'pending',
      commission_ids: pendingCommissions?.map(c => c.id) || []
    });
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...data } = await req.json();
    
    switch (action) {
      case 'process_payment':
        const fraudCheck = await performFraudCheck(data);
        const commission = await calculateCommission(data);
        const paymentResult = await processPayment(data, fraudCheck);
        await processSettlement(data, commission);
        
        return new Response(JSON.stringify({
          success: true,
          payment: paymentResult,
          commission,
          fraudCheck,
          message: 'Payment processed successfully'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
        
      case 'fraud_check':
        const fraudResult = await performFraudCheck(data);
        return new Response(JSON.stringify(fraudResult), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
        
      case 'calculate_commission':
        const commissionResult = await calculateCommission(data);
        return new Response(JSON.stringify(commissionResult), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
        
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

serve(handler);