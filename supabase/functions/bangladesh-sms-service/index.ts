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
      case 'send_otp':
        return await handleSendOTP(supabase, params)
      case 'verify_otp':
        return await handleVerifyOTP(supabase, params)
      case 'send_promotional':
        return await handlePromotionalSMS(supabase, params)
      case 'send_transactional':
        return await handleTransactionalSMS(supabase, params)
      case 'get_delivery_notification':
        return await handleDeliveryNotification(supabase, params)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Bangladesh SMS service error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleSendOTP(supabase: any, params: any) {
  const { phoneNumber, language = 'en', purpose = 'login' } = params
  
  // Validate Bangladesh phone number format
  const bdPhoneRegex = /^(\+88|0088|88)?01[3-9]\d{8}$/
  if (!bdPhoneRegex.test(phoneNumber)) {
    throw new Error('Invalid Bangladesh phone number format')
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiryTime = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

  // Store OTP in database
  await supabase
    .from('otp_verifications')
    .upsert({
      phone_number: phoneNumber,
      otp_code: otp,
      purpose: purpose,
      expires_at: expiryTime.toISOString(),
      is_verified: false,
      attempts: 0
    })

  // Get SMS configuration
  const { data: smsConfig } = await supabase
    .from('bd_sms_configs')
    .select('*')
    .eq('is_active', true)
    .contains('message_types', ['otp'])
    .limit(1)
    .single()

  // Prepare message
  const messages = {
    en: `Your GetIt verification code is: ${otp}. This code will expire in 5 minutes. Do not share this code with anyone.`,
    bn: `আপনার GetIt যাচাইকরণ কোড: ${otp}। এই কোডটি ৫ মিনিটে মেয়াদ শেষ হবে। এই কোড কারো সাথে শেয়ার করবেন না।`
  }

  const message = messages[language as keyof typeof messages] || messages.en

  // Mock SMS sending (replace with actual SMS provider integration)
  const smsResponse = await mockSendSMS(phoneNumber, message, smsConfig)

  console.log(`SMS sent to ${phoneNumber}: ${message}`)

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        reference_id: `OTP_${Date.now()}`,
        expires_at: expiryTime.toISOString(),
        message: 'OTP sent successfully'
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleVerifyOTP(supabase: any, params: any) {
  const { phoneNumber, otpCode, purpose = 'login' } = params

  // Get stored OTP
  const { data: otpRecord, error } = await supabase
    .from('otp_verifications')
    .select('*')
    .eq('phone_number', phoneNumber)
    .eq('purpose', purpose)
    .eq('is_verified', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !otpRecord) {
    throw new Error('No valid OTP found for this phone number')
  }

  // Check if OTP is expired
  if (new Date() > new Date(otpRecord.expires_at)) {
    throw new Error('OTP has expired')
  }

  // Check attempt limit
  if (otpRecord.attempts >= 3) {
    throw new Error('Maximum verification attempts exceeded')
  }

  // Verify OTP
  if (otpRecord.otp_code !== otpCode) {
    // Increment attempts
    await supabase
      .from('otp_verifications')
      .update({ attempts: otpRecord.attempts + 1 })
      .eq('id', otpRecord.id)

    throw new Error('Invalid OTP code')
  }

  // Mark as verified
  await supabase
    .from('otp_verifications')
    .update({ 
      is_verified: true,
      verified_at: new Date().toISOString()
    })
    .eq('id', otpRecord.id)

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        verified: true,
        message: 'OTP verified successfully'
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handlePromotionalSMS(supabase: any, params: any) {
  const { phoneNumbers, message, language = 'en', campaignId } = params

  // Check rate limits
  const rateLimit = await checkRateLimit(supabase, 'promotional')
  if (!rateLimit.allowed) {
    throw new Error('Rate limit exceeded for promotional SMS')
  }

  const results = []
  for (const phoneNumber of phoneNumbers) {
    try {
      const response = await mockSendSMS(phoneNumber, message)
      results.push({
        phoneNumber,
        status: 'sent',
        messageId: `PROMO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      })
    } catch (error) {
      results.push({
        phoneNumber,
        status: 'failed',
        error: error.message
      })
    }
  }

  // Log campaign results
  await supabase
    .from('sms_campaign_logs')
    .insert({
      campaign_id: campaignId,
      message_type: 'promotional',
      total_sent: results.filter(r => r.status === 'sent').length,
      total_failed: results.filter(r => r.status === 'failed').length,
      results: results
    })

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        totalSent: results.filter(r => r.status === 'sent').length,
        totalFailed: results.filter(r => r.status === 'failed').length,
        results
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleTransactionalSMS(supabase: any, params: any) {
  const { phoneNumber, messageType, orderData, language = 'en' } = params

  const templates = {
    order_confirmation: {
      en: `Order confirmed! Your order #${orderData.orderNumber} for ৳${orderData.amount} will be delivered by ${orderData.deliveryDate}. Track: ${orderData.trackingUrl}`,
      bn: `অর্ডার নিশ্চিত! আপনার অর্ডার #${orderData.orderNumber} ৳${orderData.amount} এর জন্য ${orderData.deliveryDate} এর মধ্যে ডেলিভার হবে। ট্র্যাক: ${orderData.trackingUrl}`
    },
    payment_success: {
      en: `Payment successful! ৳${orderData.amount} paid for order #${orderData.orderNumber}. Reference: ${orderData.transactionId}`,
      bn: `পেমেন্ট সফল! অর্ডার #${orderData.orderNumber} এর জন্য ৳${orderData.amount} পেমেন্ট করা হয়েছে। রেফারেন্স: ${orderData.transactionId}`
    },
    delivery_update: {
      en: `Delivery Update: Your order #${orderData.orderNumber} is ${orderData.status}. Expected delivery: ${orderData.deliveryDate}`,
      bn: `ডেলিভারি আপডেট: আপনার অর্ডার #${orderData.orderNumber} ${orderData.status}। প্রত্যাশিত ডেলিভারি: ${orderData.deliveryDate}`
    }
  }

  const template = templates[messageType as keyof typeof templates]
  if (!template) {
    throw new Error('Invalid message type')
  }

  const message = template[language as keyof typeof template] || template.en

  const response = await mockSendSMS(phoneNumber, message)

  // Log transactional SMS
  await supabase
    .from('sms_transaction_logs')
    .insert({
      phone_number: phoneNumber,
      message_type: messageType,
      order_id: orderData.orderNumber,
      message_content: message,
      status: 'sent'
    })

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        messageId: response.messageId,
        status: 'sent'
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleDeliveryNotification(supabase: any, params: any) {
  const { orderId, status, language = 'en' } = params

  // Get order details
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (!order) {
    throw new Error('Order not found')
  }

  const statusMessages = {
    processing: {
      en: `Your order #${order.order_number} is being processed. We'll notify you once it's ready for delivery.`,
      bn: `আপনার অর্ডার #${order.order_number} প্রক্রিয়াধীন। ডেলিভারির জন্য প্রস্তুত হলে আমরা আপনাকে জানাব।`
    },
    shipped: {
      en: `Great news! Your order #${order.order_number} has been shipped and will arrive by ${order.estimated_delivery}.`,
      bn: `সুখবর! আপনার অর্ডার #${order.order_number} পাঠানো হয়েছে এবং ${order.estimated_delivery} এর মধ্যে পৌঁছাবে।`
    },
    delivered: {
      en: `Your order #${order.order_number} has been delivered successfully. Thank you for shopping with GetIt!`,
      bn: `আপনার অর্ডার #${order.order_number} সফলভাবে ডেলিভার হয়েছে। GetIt এর সাথে কেনাকাটার জন্য ধন্যবাদ!`
    }
  }

  const message = statusMessages[status as keyof typeof statusMessages]?.[language as 'en' | 'bn']
  if (!message) {
    throw new Error('Invalid status or language')
  }

  await mockSendSMS(order.customer_phone, message)

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        message: 'Delivery notification sent successfully'
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function mockSendSMS(phoneNumber: string, message: string, config?: any) {
  // Mock SMS API integration
  console.log(`[SMS] To: ${phoneNumber}, Message: ${message}`)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return {
    messageId: `SMS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'sent',
    timestamp: new Date().toISOString()
  }
}

async function checkRateLimit(supabase: any, messageType: string) {
  // Check rate limits for SMS sending
  const now = new Date()
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)

  const { count } = await supabase
    .from('sms_rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('message_type', messageType)
    .gte('created_at', hourAgo.toISOString())

  const limit = messageType === 'promotional' ? 100 : 1000 // per hour
  
  return {
    allowed: (count || 0) < limit,
    remaining: limit - (count || 0),
    resetTime: new Date(Math.ceil(now.getTime() / (60 * 60 * 1000)) * (60 * 60 * 1000))
  }
}