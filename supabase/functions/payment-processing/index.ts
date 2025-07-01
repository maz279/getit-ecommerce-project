import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  order_id: string
  amount: number
  currency: string
  payment_method: string
  vendor_id?: string
  customer_data?: any
}

interface FraudCheckResult {
  risk_score: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  flags: string[]
  approved: boolean
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: { user } } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    switch (action) {
      case 'process-payment':
        return await processPayment(req, supabaseClient, user.id)
      case 'fraud-check':
        return await performFraudCheck(req, supabaseClient)
      case 'calculate-commission':
        return await calculateCommission(req, supabaseClient)
      case 'process-settlement':
        return await processSettlement(req, supabaseClient)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Payment processing error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function processPayment(req: Request, supabaseClient: any, userId: string) {
  const paymentData: PaymentRequest = await req.json()
  
  // Perform fraud check first
  const fraudCheck = await performFraudAnalysis(paymentData, supabaseClient, userId)
  
  if (!fraudCheck.approved) {
    // Create fraud alert
    await supabaseClient.from('fraud_alerts').insert({
      user_id: userId,
      order_id: paymentData.order_id,
      alert_type: 'payment_fraud',
      risk_score: fraudCheck.risk_score,
      risk_factors: fraudCheck.flags,
      status: 'pending'
    })

    return new Response(JSON.stringify({
      success: false,
      error: 'Payment blocked due to fraud risk',
      fraud_check: fraudCheck
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Process payment based on method
  let paymentResult
  switch (paymentData.payment_method.toLowerCase()) {
    case 'bkash':
      paymentResult = await processBkashPayment(paymentData)
      break
    case 'nagad':
      paymentResult = await processNagadPayment(paymentData)
      break
    case 'rocket':
      paymentResult = await processRocketPayment(paymentData)
      break
    case 'stripe':
      paymentResult = await processStripePayment(paymentData)
      break
    default:
      return new Response(JSON.stringify({ error: 'Unsupported payment method' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
  }

  // Record payment transaction
  const { data: transaction } = await supabaseClient.from('payment_transactions').insert({
    order_id: paymentData.order_id,
    user_id: userId,
    amount: paymentData.amount,
    currency: paymentData.currency,
    payment_method: paymentData.payment_method,
    status: paymentResult.status,
    gateway_response: paymentResult.gateway_response,
    fraud_score: fraudCheck.risk_score
  }).select().single()

  // Calculate and record commission if vendor payment
  if (paymentData.vendor_id && paymentResult.status === 'completed') {
    await calculateAndRecordCommission(paymentData, supabaseClient)
  }

  return new Response(JSON.stringify({
    success: true,
    transaction_id: transaction.id,
    payment_result: paymentResult,
    fraud_check: fraudCheck
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function performFraudAnalysis(paymentData: PaymentRequest, supabaseClient: any, userId: string): Promise<FraudCheckResult> {
  let riskScore = 0
  const flags: string[] = []

  // Check user payment history
  const { data: recentPayments } = await supabaseClient
    .from('payment_transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

  if (recentPayments && recentPayments.length > 5) {
    riskScore += 30
    flags.push('high_frequency_payments')
  }

  // Check amount anomaly
  const { data: avgAmount } = await supabaseClient
    .rpc('get_user_avg_payment_amount', { user_id: userId })

  if (avgAmount && paymentData.amount > avgAmount * 3) {
    riskScore += 25
    flags.push('unusual_amount')
  }

  // Check for round amounts (potential fraud)
  if (paymentData.amount % 1000 === 0 && paymentData.amount > 10000) {
    riskScore += 15
    flags.push('round_amount')
  }

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical'
  if (riskScore >= 70) riskLevel = 'critical'
  else if (riskScore >= 50) riskLevel = 'high'
  else if (riskScore >= 30) riskLevel = 'medium'
  else riskLevel = 'low'

  return {
    risk_score: riskScore,
    risk_level: riskLevel,
    flags,
    approved: riskScore < 50
  }
}

async function processBkashPayment(paymentData: PaymentRequest) {
  // Mock bKash payment processing
  // In production, integrate with actual bKash API
  return {
    status: 'completed',
    gateway_response: {
      transaction_id: `bkash_${Date.now()}`,
      gateway: 'bkash',
      amount: paymentData.amount,
      currency: paymentData.currency
    }
  }
}

async function processNagadPayment(paymentData: PaymentRequest) {
  // Mock Nagad payment processing
  return {
    status: 'completed',
    gateway_response: {
      transaction_id: `nagad_${Date.now()}`,
      gateway: 'nagad',
      amount: paymentData.amount,
      currency: paymentData.currency
    }
  }
}

async function processRocketPayment(paymentData: PaymentRequest) {
  // Mock Rocket payment processing
  return {
    status: 'completed',
    gateway_response: {
      transaction_id: `rocket_${Date.now()}`,
      gateway: 'rocket',
      amount: paymentData.amount,
      currency: paymentData.currency
    }
  }
}

async function processStripePayment(paymentData: PaymentRequest) {
  // Mock Stripe payment processing
  return {
    status: 'completed',
    gateway_response: {
      transaction_id: `stripe_${Date.now()}`,
      gateway: 'stripe',
      amount: paymentData.amount,
      currency: paymentData.currency
    }
  }
}

async function calculateAndRecordCommission(paymentData: PaymentRequest, supabaseClient: any) {
  const commissionRate = 0.05 // 5% default commission
  const commissionAmount = paymentData.amount * commissionRate
  const platformFee = commissionAmount * 0.1 // 10% platform fee
  const netCommission = commissionAmount - platformFee

  await supabaseClient.from('vendor_commissions').insert({
    vendor_id: paymentData.vendor_id,
    order_id: paymentData.order_id,
    gross_amount: paymentData.amount,
    commission_amount: commissionAmount,
    platform_fee: platformFee,
    net_commission: netCommission,
    commission_rate: commissionRate,
    status: 'pending'
  })
}

async function performFraudCheck(req: Request, supabaseClient: any) {
  const { payment_data } = await req.json()
  const fraudResult = await performFraudAnalysis(payment_data, supabaseClient, payment_data.user_id)
  
  return new Response(JSON.stringify(fraudResult), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function calculateCommission(req: Request, supabaseClient: any) {
  const { vendor_id, amount, product_category } = await req.json()
  
  // Get commission rate for vendor
  const { data: commissionRate } = await supabaseClient
    .from('vendor_commission_rates')
    .select('*')
    .eq('vendor_id', vendor_id)
    .eq('is_active', true)
    .single()

  const rate = commissionRate?.base_rate || 5.0
  const commissionAmount = (amount * rate) / 100
  const platformFee = commissionAmount * 0.1
  const netCommission = commissionAmount - platformFee

  return new Response(JSON.stringify({
    commission_amount: commissionAmount,
    platform_fee: platformFee,
    net_commission: netCommission,
    rate: rate
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function processSettlement(req: Request, supabaseClient: any) {
  const { vendor_id, period_start, period_end } = await req.json()
  
  // Get pending commissions for vendor
  const { data: commissions } = await supabaseClient
    .from('vendor_commissions')
    .select('*')
    .eq('vendor_id', vendor_id)
    .eq('status', 'pending')
    .gte('created_at', period_start)
    .lte('created_at', period_end)

  if (!commissions || commissions.length === 0) {
    return new Response(JSON.stringify({ message: 'No pending commissions found' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const totalAmount = commissions.reduce((sum, comm) => sum + comm.net_commission, 0)
  
  // Create payout request
  const { data: payout } = await supabaseClient.from('commission_payouts').insert({
    vendor_id,
    total_commission: totalAmount,
    commission_ids: commissions.map(c => c.id),
    period_start,
    period_end,
    status: 'pending',
    payout_batch_id: `batch_${Date.now()}`
  }).select().single()

  // Update commissions status
  await supabaseClient
    .from('vendor_commissions')
    .update({ status: 'processed' })
    .in('id', commissions.map(c => c.id))

  return new Response(JSON.stringify({
    payout_id: payout.id,
    total_amount: totalAmount,
    commission_count: commissions.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}