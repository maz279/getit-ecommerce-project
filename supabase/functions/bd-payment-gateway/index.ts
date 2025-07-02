import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  gateway: 'bkash' | 'nagad' | 'rocket';
  amount: number;
  order_id: string;
  customer_phone: string;
  merchant_reference: string;
}

interface PaymentResponse {
  success: boolean;
  transaction_id?: string;
  payment_url?: string;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { gateway, amount, order_id, customer_phone, merchant_reference }: PaymentRequest = await req.json();

    console.log(`Processing ${gateway} payment for order ${order_id}, amount: ${amount}`);

    // Get gateway configuration
    const { data: gatewayConfig, error: configError } = await supabaseClient
      .from('bd_payment_gateways')
      .select('*')
      .eq('gateway_name', gateway)
      .eq('is_active', true)
      .single();

    if (configError || !gatewayConfig) {
      throw new Error(`Gateway ${gateway} not configured or inactive`);
    }

    let paymentResponse: PaymentResponse;

    // Process payment based on gateway
    switch (gateway) {
      case 'bkash':
        paymentResponse = await processBkashPayment(gatewayConfig, {
          amount,
          order_id,
          customer_phone,
          merchant_reference
        });
        break;
      
      case 'nagad':
        paymentResponse = await processNagadPayment(gatewayConfig, {
          amount,
          order_id,
          customer_phone,
          merchant_reference
        });
        break;
      
      case 'rocket':
        paymentResponse = await processRocketPayment(gatewayConfig, {
          amount,
          order_id,
          customer_phone,
          merchant_reference
        });
        break;
      
      default:
        throw new Error(`Unsupported gateway: ${gateway}`);
    }

    // Save transaction record
    await supabaseClient
      .from('bd_payment_transactions')
      .insert({
        gateway_name: gateway,
        transaction_id: paymentResponse.transaction_id || '',
        merchant_transaction_id: merchant_reference,
        order_id,
        amount,
        currency: 'BDT',
        status: paymentResponse.success ? 'pending' : 'failed',
        gateway_response: paymentResponse,
        customer_phone
      });

    return new Response(JSON.stringify(paymentResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Payment gateway error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processBkashPayment(config: any, paymentData: any): Promise<PaymentResponse> {
  const { api_config } = config;
  
  try {
    // Get bKash access token
    const tokenResponse = await fetch(`${api_config.base_url}/token/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'username': api_config.username,
        'password': api_config.password
      },
      body: JSON.stringify({
        app_key: api_config.app_key,
        app_secret: api_config.app_secret
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.id_token) {
      throw new Error('Failed to get bKash access token');
    }

    // Create payment
    const paymentResponse = await fetch(`${api_config.base_url}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': tokenData.id_token,
        'x-app-key': api_config.app_key
      },
      body: JSON.stringify({
        mode: '0011',
        payerReference: paymentData.customer_phone,
        callbackURL: api_config.callback_url,
        amount: paymentData.amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: paymentData.merchant_reference
      })
    });

    const paymentResult = await paymentResponse.json();

    return {
      success: paymentResult.statusCode === '0000',
      transaction_id: paymentResult.paymentID,
      payment_url: paymentResult.bkashURL,
      error: paymentResult.statusMessage
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function processNagadPayment(config: any, paymentData: any): Promise<PaymentResponse> {
  const { api_config } = config;
  
  try {
    // Nagad payment initiation
    const paymentResponse = await fetch(`${api_config.base_url}/payment/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-KM-Api-Version': 'v-0.2.0',
        'X-KM-IP-V4': '127.0.0.1',
        'X-KM-Client-Type': 'PC_WEB'
      },
      body: JSON.stringify({
        merchantId: api_config.merchant_id,
        orderId: paymentData.merchant_reference,
        amount: paymentData.amount,
        currency: 'BDT',
        challenge: generateNagadSignature(paymentData, config)
      })
    });

    const result = await paymentResponse.json();

    return {
      success: result.status === 'Success',
      transaction_id: result.paymentReferenceId,
      payment_url: result.callBackUrl,
      error: result.message
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function processRocketPayment(config: any, paymentData: any): Promise<PaymentResponse> {
  const { api_config } = config;
  
  try {
    // Rocket payment initiation
    const paymentResponse = await fetch(`${api_config.base_url}/payment/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_config.access_token}`
      },
      body: JSON.stringify({
        StoreId: api_config.store_id,
        Amount: paymentData.amount,
        PaymentType: 'PayLater',
        OrderId: paymentData.merchant_reference,
        Currency: 'BDT'
      })
    });

    const result = await paymentResponse.json();

    return {
      success: result.IsSuccessful === true,
      transaction_id: result.TransactionId,
      payment_url: result.RedirectGatewayURL,
      error: result.Message
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

function generateNagadSignature(paymentData: any, config: any): string {
  // Implementation of Nagad signature generation
  // This would include proper cryptographic signing as per Nagad's documentation
  return 'signature_placeholder';
}