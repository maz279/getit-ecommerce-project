import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, ...params } = await req.json()

    switch (action) {
      case 'initiate_bkash_payment':
        return await handleBkashPayment(supabase, params)
      case 'initiate_nagad_payment':
        return await handleNagadPayment(supabase, params)
      case 'initiate_rocket_payment':
        return await handleRocketPayment(supabase, params)
      case 'verify_payment':
        return await handlePaymentVerification(supabase, params)
      case 'get_payment_methods':
        return await handleGetPaymentMethods(supabase, params)
      case 'process_refund':
        return await handleRefund(supabase, params)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Bangladesh payment gateway error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleBkashPayment(supabase: any, params: any) {
  const { amount, orderId, customerPhone, currency = 'BDT' } = params

  // Validate amount and phone number
  if (amount < 10 || amount > 25000) {
    throw new Error('bKash payment amount must be between ৳10 and ৳25,000')
  }

  const phoneRegex = /^01[3-9]\d{8}$/
  if (!phoneRegex.test(customerPhone)) {
    throw new Error('Invalid phone number format for bKash')
  }

  // Get bKash configuration
  const { data: bkashConfig } = await supabase
    .from('bd_payment_gateways')
    .select('*')
    .eq('gateway_name', 'bKash')
    .eq('is_active', true)
    .single()

  if (!bkashConfig) {
    throw new Error('bKash payment is currently unavailable')
  }

  // Create transaction record
  const transactionId = `BKASH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  await supabase
    .from('bd_payment_transactions')
    .insert({
      transaction_id: transactionId,
      gateway_name: 'bKash',
      order_id: orderId,
      amount: amount,
      currency: currency,
      customer_phone: customerPhone,
      status: 'initiated',
      merchant_transaction_id: `GETIT_${orderId}_${Date.now()}`
    })

  // Mock bKash API integration
  const bkashResponse = await mockBkashAPI({
    amount,
    currency,
    intent: 'sale',
    merchantTransactionId: transactionId,
    customerPhone
  })

  // Update transaction with gateway response
  await supabase
    .from('bd_payment_transactions')
    .update({
      gateway_response: bkashResponse,
      status: bkashResponse.statusCode === '0000' ? 'pending' : 'failed'
    })
    .eq('transaction_id', transactionId)

  return new Response(
    JSON.stringify({
      success: bkashResponse.statusCode === '0000',
      data: {
        transactionId,
        paymentUrl: bkashResponse.bkashURL,
        paymentToken: bkashResponse.paymentID,
        expiryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
        instructions: {
          en: 'Complete the payment using your bKash mobile app or USSD *247#',
          bn: 'আপনার bKash মোবাইল অ্যাপ বা USSD *247# ব্যবহার করে পেমেন্ট সম্পূর্ণ করুন'
        }
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleNagadPayment(supabase: any, params: any) {
  const { amount, orderId, customerPhone, currency = 'BDT' } = params

  // Validate amount
  if (amount < 5 || amount > 50000) {
    throw new Error('Nagad payment amount must be between ৳5 and ৳50,000')
  }

  // Get Nagad configuration
  const { data: nagadConfig } = await supabase
    .from('bd_payment_gateways')
    .select('*')
    .eq('gateway_name', 'Nagad')
    .eq('is_active', true)
    .single()

  if (!nagadConfig) {
    throw new Error('Nagad payment is currently unavailable')
  }

  const transactionId = `NAGAD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  await supabase
    .from('bd_payment_transactions')
    .insert({
      transaction_id: transactionId,
      gateway_name: 'Nagad',
      order_id: orderId,
      amount: amount,
      currency: currency,
      customer_phone: customerPhone,
      status: 'initiated',
      merchant_transaction_id: `GETIT_${orderId}_${Date.now()}`
    })

  // Mock Nagad API integration
  const nagadResponse = await mockNagadAPI({
    amount,
    orderId,
    customerPhone
  })

  await supabase
    .from('bd_payment_transactions')
    .update({
      gateway_response: nagadResponse,
      status: nagadResponse.status === 'Success' ? 'pending' : 'failed'
    })
    .eq('transaction_id', transactionId)

  return new Response(
    JSON.stringify({
      success: nagadResponse.status === 'Success',
      data: {
        transactionId,
        paymentUrl: nagadResponse.callBackUrl,
        sessionKey: nagadResponse.sessionKey,
        expiryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        instructions: {
          en: 'Complete the payment using your Nagad mobile app or USSD *167#',
          bn: 'আপনার Nagad মোবাইল অ্যাপ বা USSD *167# ব্যবহার করে পেমেন্ট সম্পূর্ণ করুন'
        }
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleRocketPayment(supabase: any, params: any) {
  const { amount, orderId, customerPhone, currency = 'BDT' } = params

  // Validate amount
  if (amount < 10 || amount > 30000) {
    throw new Error('Rocket payment amount must be between ৳10 and ৳30,000')
  }

  const transactionId = `ROCKET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  await supabase
    .from('bd_payment_transactions')
    .insert({
      transaction_id: transactionId,
      gateway_name: 'Rocket',
      order_id: orderId,
      amount: amount,
      currency: currency,
      customer_phone: customerPhone,
      status: 'initiated',
      merchant_transaction_id: `GETIT_${orderId}_${Date.now()}`
    })

  // Mock Rocket API integration
  const rocketResponse = await mockRocketAPI({
    amount,
    orderId,
    customerPhone
  })

  await supabase
    .from('bd_payment_transactions')
    .update({
      gateway_response: rocketResponse,
      status: rocketResponse.responseCode === '200' ? 'pending' : 'failed'
    })
    .eq('transaction_id', transactionId)

  return new Response(
    JSON.stringify({
      success: rocketResponse.responseCode === '200',
      data: {
        transactionId,
        paymentReference: rocketResponse.trxId,
        expiryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        instructions: {
          en: 'Complete the payment using your Rocket mobile app or USSD *322#',
          bn: 'আপনার Rocket মোবাইল অ্যাপ বা USSD *322# ব্যবহার করে পেমেন্ট সম্পূর্ণ করুন'
        }
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handlePaymentVerification(supabase: any, params: any) {
  const { transactionId, gatewayTransactionId } = params

  // Get transaction record
  const { data: transaction, error } = await supabase
    .from('bd_payment_transactions')
    .select('*')
    .eq('transaction_id', transactionId)
    .single()

  if (error || !transaction) {
    throw new Error('Transaction not found')
  }

  // Mock verification based on gateway
  let verificationResult
  switch (transaction.gateway_name) {
    case 'bKash':
      verificationResult = await mockBkashVerification(gatewayTransactionId)
      break
    case 'Nagad':
      verificationResult = await mockNagadVerification(gatewayTransactionId)
      break
    case 'Rocket':
      verificationResult = await mockRocketVerification(gatewayTransactionId)
      break
    default:
      throw new Error('Unsupported payment gateway')
  }

  // Update transaction status
  const newStatus = verificationResult.success ? 'completed' : 'failed'
  await supabase
    .from('bd_payment_transactions')
    .update({
      status: newStatus,
      processed_at: new Date().toISOString(),
      gateway_response: {
        ...transaction.gateway_response,
        verification: verificationResult
      }
    })
    .eq('transaction_id', transactionId)

  return new Response(
    JSON.stringify({
      success: verificationResult.success,
      data: {
        transactionId,
        status: newStatus,
        amount: transaction.amount,
        gatewayTransactionId,
        verificationResult
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetPaymentMethods(supabase: any, params: any) {
  const { amount, currency = 'BDT' } = params

  const { data: paymentMethods, error } = await supabase
    .from('bd_payment_gateways')
    .select('*')
    .eq('is_active', true)

  if (error) throw error

  // Filter based on amount limits
  const availableMethods = paymentMethods?.filter(method => {
    const limits = method.transaction_limits || {}
    const minAmount = limits.min_amount || 0
    const maxAmount = limits.max_amount || 999999

    return amount >= minAmount && amount <= maxAmount
  })

  return new Response(
    JSON.stringify({
      success: true,
      data: availableMethods?.map(method => ({
        name: method.gateway_name,
        displayName: method.gateway_name,
        type: 'mobile_banking',
        currency: currency,
        fees: method.fee_structure,
        limits: method.transaction_limits,
        icon: `/icons/${method.gateway_name.toLowerCase()}.svg`,
        instructions: {
          en: `Pay securely using ${method.gateway_name}`,
          bn: `${method.gateway_name} ব্যবহার করে নিরাপদে পেমেন্ট করুন`
        }
      })) || []
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleRefund(supabase: any, params: any) {
  const { transactionId, refundAmount, reason } = params

  const { data: transaction } = await supabase
    .from('bd_payment_transactions')
    .select('*')
    .eq('transaction_id', transactionId)
    .eq('status', 'completed')
    .single()

  if (!transaction) {
    throw new Error('Original transaction not found or not completed')
  }

  if (refundAmount > transaction.amount) {
    throw new Error('Refund amount cannot exceed original transaction amount')
  }

  const refundId = `REFUND_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Process refund based on gateway
  let refundResult
  switch (transaction.gateway_name) {
    case 'bKash':
      refundResult = await mockBkashRefund(transaction.gateway_response.paymentID, refundAmount)
      break
    case 'Nagad':
      refundResult = await mockNagadRefund(transaction.gateway_response.paymentRefId, refundAmount)
      break
    case 'Rocket':
      refundResult = await mockRocketRefund(transaction.gateway_response.trxId, refundAmount)
      break
    default:
      throw new Error('Refunds not supported for this payment method')
  }

  // Record refund
  await supabase
    .from('payment_refunds')
    .insert({
      refund_id: refundId,
      original_transaction_id: transactionId,
      refund_amount: refundAmount,
      reason: reason,
      status: refundResult.success ? 'completed' : 'failed',
      gateway_response: refundResult
    })

  return new Response(
    JSON.stringify({
      success: refundResult.success,
      data: {
        refundId,
        amount: refundAmount,
        status: refundResult.success ? 'completed' : 'failed',
        processingTime: '1-3 business days'
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Mock API functions
async function mockBkashAPI(params: any) {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    statusCode: '0000',
    statusMessage: 'Successful',
    paymentID: `TXN${Date.now()}`,
    bkashURL: `https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/TXN${Date.now()}`,
    successCallbackURL: 'https://getit.com/payment/success',
    failureCallbackURL: 'https://getit.com/payment/failure',
    cancelledCallbackURL: 'https://getit.com/payment/cancel'
  }
}

async function mockNagadAPI(params: any) {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    status: 'Success',
    sessionKey: `SESSION${Date.now()}`,
    callBackUrl: `https://api.mynagad.com/remote-payment-gateway-1.0/api/dfs/check-status?sessionKey=SESSION${Date.now()}`,
    paymentRefId: `PAY${Date.now()}`
  }
}

async function mockRocketAPI(params: any) {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    responseCode: '200',
    message: 'Payment initiated successfully',
    trxId: `ROCKET${Date.now()}`,
    paymentUrl: `https://rocket.com.bd/payment/ROCKET${Date.now()}`
  }
}

async function mockBkashVerification(trxId: string) {
  await new Promise(resolve => setTimeout(resolve, 300))
  return {
    success: true,
    transactionStatus: 'Completed',
    trxID: trxId,
    paymentID: `BKASH${Date.now()}`,
    amount: '100.00',
    currency: 'BDT'
  }
}

async function mockNagadVerification(trxId: string) {
  await new Promise(resolve => setTimeout(resolve, 300))
  return {
    success: true,
    status: 'Success',
    paymentRefId: trxId,
    amount: '100.00',
    currency: 'BDT'
  }
}

async function mockRocketVerification(trxId: string) {
  await new Promise(resolve => setTimeout(resolve, 300))
  return {
    success: true,
    responseCode: '200',
    trxId: trxId,
    amount: '100.00',
    currency: 'BDT'
  }
}

async function mockBkashRefund(paymentId: string, amount: number) {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    success: true,
    refundTrxID: `REFUND${Date.now()}`,
    originalTrxID: paymentId,
    amount: amount.toString(),
    currency: 'BDT',
    status: 'completed'
  }
}

async function mockNagadRefund(paymentRefId: string, amount: number) {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    success: true,
    refundRefId: `REFUND${Date.now()}`,
    originalRefId: paymentRefId,
    amount: amount.toString(),
    currency: 'BDT'
  }
}

async function mockRocketRefund(trxId: string, amount: number) {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    success: true,
    refundTrxId: `REFUND${Date.now()}`,
    originalTrxId: trxId,
    amount: amount.toString(),
    currency: 'BDT'
  }
}