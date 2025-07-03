import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

interface SMSRequest {
  action: 'send' | 'send_otp' | 'verify_otp' | 'send_bulk';
  phone: string;
  message?: string;
  otp_code?: string;
  provider?: 'ssl_wireless' | 'banglalink' | 'robi' | 'grameenphone' | 'auto';
  bulk_messages?: Array<{
    phone: string;
    message: string;
    variables?: Record<string, any>;
  }>;
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

    const { action, phone, message, otp_code, provider = 'auto', bulk_messages }: SMSRequest = await req.json();

    switch (action) {
      case 'send':
        return await handleSendSMS(supabase, phone, message!, provider);
      case 'send_otp':
        return await handleSendOTP(supabase, phone, provider);
      case 'verify_otp':
        return await handleVerifyOTP(supabase, phone, otp_code!);
      case 'send_bulk':
        return await handleBulkSMS(supabase, bulk_messages!, provider);
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Bangladesh SMS service error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleSendSMS(supabase: any, phone: string, message: string, provider: string) {
  console.log('Sending SMS:', { phone, provider });

  // Validate Bangladesh phone number
  if (!isValidBangladeshPhone(phone)) {
    throw new Error('Invalid Bangladesh phone number format');
  }

  // Get SMS provider configuration
  const smsProvider = await getSMSProvider(supabase, provider, phone);
  
  // Send SMS
  const result = await sendSMSViaProvider(smsProvider, phone, message);

  // Log SMS history
  await logSMSHistory(supabase, {
    phone,
    message,
    provider: smsProvider.name,
    status: result.success ? 'sent' : 'failed',
    response: result.response,
    error: result.error
  });

  return new Response(
    JSON.stringify({ 
      success: result.success,
      message_id: result.message_id,
      provider: smsProvider.name,
      cost: result.cost || 0.02, // Typical SMS cost in BDT
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleSendOTP(supabase: any, phone: string, provider: string) {
  console.log('Sending OTP to:', phone);

  if (!isValidBangladeshPhone(phone)) {
    throw new Error('Invalid Bangladesh phone number format');
  }

  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Store OTP in database
  const { error: otpError } = await supabase
    .from('otp_verifications')
    .upsert([{
      phone,
      otp_code: otpCode,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
      verified: false,
      created_at: new Date().toISOString()
    }], { onConflict: 'phone' });

  if (otpError) {
    throw new Error(`Failed to store OTP: ${otpError.message}`);
  }

  // Prepare OTP message in both languages
  const message = `Your GetIt verification code is: ${otpCode}. Do not share this with anyone. Valid for 5 minutes.\n\nআপনার গেটইট ভেরিফিকেশন কোড: ${otpCode}। এটি কারো সাথে শেয়ার করবেন না। ৫ মিনিটের জন্য বৈধ।`;

  // Send OTP SMS
  const smsProvider = await getSMSProvider(supabase, provider, phone);
  const result = await sendSMSViaProvider(smsProvider, phone, message);

  await logSMSHistory(supabase, {
    phone,
    message: 'OTP verification code',
    provider: smsProvider.name,
    status: result.success ? 'sent' : 'failed',
    response: result.response,
    error: result.error,
    message_type: 'otp'
  });

  return new Response(
    JSON.stringify({ 
      success: result.success,
      message_id: result.message_id,
      expires_at: expiresAt.toISOString(),
      provider: smsProvider.name,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleVerifyOTP(supabase: any, phone: string, otpCode: string) {
  console.log('Verifying OTP for:', phone);

  const { data: otpRecord, error } = await supabase
    .from('otp_verifications')
    .select('*')
    .eq('phone', phone)
    .eq('verified', false)
    .single();

  if (error || !otpRecord) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'No pending OTP verification found',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Check if OTP has expired
  if (new Date() > new Date(otpRecord.expires_at)) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'OTP has expired',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Check if too many attempts
  if (otpRecord.attempts >= 3) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Too many attempts. Please request a new OTP',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Verify OTP code
  if (otpRecord.otp_code !== otpCode) {
    // Increment attempts
    await supabase
      .from('otp_verifications')
      .update({ attempts: otpRecord.attempts + 1 })
      .eq('phone', phone);

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Invalid OTP code',
        remaining_attempts: 3 - (otpRecord.attempts + 1),
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Mark as verified
  await supabase
    .from('otp_verifications')
    .update({ 
      verified: true, 
      verified_at: new Date().toISOString() 
    })
    .eq('phone', phone);

  return new Response(
    JSON.stringify({ 
      success: true,
      message: 'Phone number verified successfully',
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleBulkSMS(supabase: any, messages: any[], provider: string) {
  console.log('Sending bulk SMS:', messages.length);

  const results = [];
  const batchSize = 50; // Process in batches to avoid rate limits

  for (let i = 0; i < messages.length; i += batchSize) {
    const batch = messages.slice(i, i + batchSize);
    const batchPromises = batch.map(async (msg) => {
      try {
        if (!isValidBangladeshPhone(msg.phone)) {
          throw new Error('Invalid phone number format');
        }

        const smsProvider = await getSMSProvider(supabase, provider, msg.phone);
        const result = await sendSMSViaProvider(smsProvider, msg.phone, msg.message);
        
        await logSMSHistory(supabase, {
          phone: msg.phone,
          message: msg.message,
          provider: smsProvider.name,
          status: result.success ? 'sent' : 'failed',
          response: result.response,
          error: result.error,
          message_type: 'bulk'
        });

        return { 
          phone: msg.phone, 
          success: result.success, 
          message_id: result.message_id,
          provider: smsProvider.name
        };
      } catch (error) {
        return { 
          phone: msg.phone, 
          success: false, 
          error: error.message 
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add delay between batches to respect rate limits
    if (i + batchSize < messages.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return new Response(
    JSON.stringify({ 
      success: true,
      total_messages: messages.length,
      successful,
      failed,
      results,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function isValidBangladeshPhone(phone: string): boolean {
  // Bangladesh phone number formats:
  // +8801XXXXXXXXX, 8801XXXXXXXXX, 01XXXXXXXXX
  const phoneRegex = /^(\+88|88)?01[3-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

function normalizePhoneNumber(phone: string): string {
  // Convert to international format
  phone = phone.replace(/\s+/g, '');
  if (phone.startsWith('01')) {
    return '+88' + phone;
  }
  if (phone.startsWith('88')) {
    return '+' + phone;
  }
  return phone;
}

async function getSMSProvider(supabase: any, provider: string, phone: string) {
  if (provider === 'auto') {
    // Auto-select provider based on phone number carrier
    const carrier = detectCarrier(phone);
    provider = getOptimalProvider(carrier);
  }

  const { data: providerConfig, error } = await supabase
    .from('notification_channels')
    .select('*')
    .eq('type', 'sms')
    .eq('name', provider)
    .eq('is_active', true)
    .single();

  if (error || !providerConfig) {
    // Fallback to SSL Wireless as default
    const { data: fallbackProvider } = await supabase
      .from('notification_channels')
      .select('*')
      .eq('type', 'sms')
      .eq('is_active', true)
      .order('priority')
      .limit(1)
      .single();

    return fallbackProvider || {
      name: 'ssl_wireless',
      provider: 'ssl_wireless',
      configuration: { api_url: 'https://sms.sslwireless.com/pushapi/dynamic/server.php' }
    };
  }

  return providerConfig;
}

function detectCarrier(phone: string): string {
  const normalizedPhone = normalizePhoneNumber(phone);
  const number = normalizedPhone.slice(-11); // Get last 11 digits

  // Bangladesh mobile operator prefixes
  if (number.match(/^017/)) return 'grameenphone';
  if (number.match(/^013|014/)) return 'grameenphone';
  if (number.match(/^019/)) return 'banglalink';
  if (number.match(/^018/)) return 'robi';
  if (number.match(/^016/)) return 'robi';
  if (number.match(/^015/)) return 'teletalk';

  return 'grameenphone'; // Default
}

function getOptimalProvider(carrier: string): string {
  // Map carriers to optimal SMS providers
  const providerMap: Record<string, string> = {
    'grameenphone': 'ssl_wireless',
    'banglalink': 'banglalink',
    'robi': 'robi',
    'teletalk': 'ssl_wireless'
  };

  return providerMap[carrier] || 'ssl_wireless';
}

async function sendSMSViaProvider(provider: any, phone: string, message: string) {
  const normalizedPhone = normalizePhoneNumber(phone);
  
  try {
    // Simulate different provider APIs
    switch (provider.provider) {
      case 'ssl_wireless':
        return await sendViaSSLWireless(provider.configuration, normalizedPhone, message);
      case 'banglalink':
        return await sendViaBanglalink(provider.configuration, normalizedPhone, message);
      case 'robi':
        return await sendViaRobi(provider.configuration, normalizedPhone, message);
      case 'grameenphone':
        return await sendViaGrameenphone(provider.configuration, normalizedPhone, message);
      default:
        throw new Error(`Unsupported SMS provider: ${provider.provider}`);
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message_id: null
    };
  }
}

async function sendViaSSLWireless(config: any, phone: string, message: string) {
  // SSL Wireless API simulation
  console.log('Sending via SSL Wireless:', { phone, message: message.substring(0, 50) + '...' });
  
  // In production, integrate with actual SSL Wireless API
  return {
    success: true,
    message_id: 'ssl_' + crypto.randomUUID(),
    cost: 0.02,
    response: { status: 'sent', provider: 'ssl_wireless' }
  };
}

async function sendViaBanglalink(config: any, phone: string, message: string) {
  console.log('Sending via Banglalink:', { phone, message: message.substring(0, 50) + '...' });
  
  return {
    success: true,
    message_id: 'bl_' + crypto.randomUUID(),
    cost: 0.015,
    response: { status: 'sent', provider: 'banglalink' }
  };
}

async function sendViaRobi(config: any, phone: string, message: string) {
  console.log('Sending via Robi:', { phone, message: message.substring(0, 50) + '...' });
  
  return {
    success: true,
    message_id: 'robi_' + crypto.randomUUID(),
    cost: 0.018,
    response: { status: 'sent', provider: 'robi' }
  };
}

async function sendViaGrameenphone(config: any, phone: string, message: string) {
  console.log('Sending via Grameenphone:', { phone, message: message.substring(0, 50) + '...' });
  
  return {
    success: true,
    message_id: 'gp_' + crypto.randomUUID(),
    cost: 0.02,
    response: { status: 'sent', provider: 'grameenphone' }
  };
}

async function logSMSHistory(supabase: any, logData: any) {
  await supabase
    .from('notification_history')
    .insert([{
      channel: 'sms',
      recipient: logData.phone,
      content: logData.message,
      status: logData.status,
      provider_response: logData.response,
      error_details: logData.error ? { error: logData.error } : null,
      sent_at: new Date().toISOString(),
      metadata: {
        provider: logData.provider,
        message_type: logData.message_type || 'transactional',
        cost: logData.cost || 0.02
      }
    }]);
}