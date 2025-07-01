import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  order_id: string;
  amount: number;
  payment_method: 'bkash' | 'nagad' | 'rocket' | 'bank_transfer' | 'cod';
  customer_phone?: string;
  customer_details: {
    name: string;
    email: string;
    address: object;
  };
}

interface PaymentVerification {
  payment_id: string;
  transaction_id: string;
  payment_method: string;
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

    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').pop();
    const method = req.method;

    console.log(`Payment API - ${method} ${endpoint}`);

    // POST /payment-processing/initiate - Initiate payment
    if (method === 'POST' && endpoint === 'initiate') {
      const paymentData: PaymentRequest = await req.json();

      if (!paymentData.order_id || !paymentData.amount || !paymentData.payment_method) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Verify order exists and is pending
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', paymentData.order_id)
        .eq('payment_status', 'pending')
        .single();

      if (orderError || !order) {
        return new Response(JSON.stringify({ error: 'Order not found or already processed' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Verify amount matches order total
      if (order.total_amount !== paymentData.amount) {
        return new Response(JSON.stringify({ error: 'Amount mismatch' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create payment record
      const paymentRecord = {
        id: crypto.randomUUID(),
        order_id: paymentData.order_id,
        amount: paymentData.amount,
        payment_method: paymentData.payment_method,
        status: paymentData.payment_method === 'cod' ? 'pending_delivery' : 'pending',
        customer_phone: paymentData.customer_phone,
        customer_details: paymentData.customer_details,
        created_at: new Date().toISOString(),
        transaction_reference: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert(paymentRecord)
        .select()
        .single();

      if (paymentError) {
        console.error('Payment creation error:', paymentError);
        return new Response(JSON.stringify({ error: 'Failed to create payment record' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Handle different payment methods
      let paymentResponse;
      
      switch (paymentData.payment_method) {
        case 'bkash':
          paymentResponse = await processBkashPayment(payment, paymentData);
          break;
        case 'nagad':
          paymentResponse = await processNagadPayment(payment, paymentData);
          break;
        case 'rocket':
          paymentResponse = await processRocketPayment(payment, paymentData);
          break;
        case 'bank_transfer':
          paymentResponse = await processBankTransfer(payment);
          break;
        case 'cod':
          paymentResponse = await processCOD(payment);
          break;
        default:
          return new Response(JSON.stringify({ error: 'Unsupported payment method' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
      }

      console.log('Payment initiated successfully:', payment.id);
      return new Response(JSON.stringify(paymentResponse), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /payment-processing/verify - Verify payment
    if (method === 'POST' && endpoint === 'verify') {
      const verificationData: PaymentVerification = await req.json();

      if (!verificationData.payment_id || !verificationData.transaction_id) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', verificationData.payment_id)
        .single();

      if (paymentError || !payment) {
        return new Response(JSON.stringify({ error: 'Payment not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Verify with payment gateway based on method
      let verificationResult;
      
      switch (payment.payment_method) {
        case 'bkash':
          verificationResult = await verifyBkashPayment(verificationData);
          break;
        case 'nagad':
          verificationResult = await verifyNagadPayment(verificationData);
          break;
        case 'rocket':
          verificationResult = await verifyRocketPayment(verificationData);
          break;
        default:
          return new Response(JSON.stringify({ error: 'Payment method does not support verification' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
      }

      if (verificationResult.success) {
        // Update payment status
        const { error: updateError } = await supabase
          .from('payments')
          .update({
            status: 'completed',
            transaction_id: verificationData.transaction_id,
            verified_at: new Date().toISOString(),
            gateway_response: verificationResult.data,
          })
          .eq('id', verificationData.payment_id);

        if (updateError) {
          console.error('Payment update error:', updateError);
          return new Response(JSON.stringify({ error: 'Failed to update payment' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Update order status
        await supabase
          .from('orders')
          .update({ payment_status: 'completed' })
          .eq('id', payment.order_id);

        console.log('Payment verified successfully:', verificationData.payment_id);
        return new Response(JSON.stringify({ success: true, payment_status: 'completed' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        // Update payment as failed
        await supabase
          .from('payments')
          .update({
            status: 'failed',
            gateway_response: verificationResult.error,
          })
          .eq('id', verificationData.payment_id);

        return new Response(JSON.stringify({ success: false, error: verificationResult.error }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // GET /payment-processing/status/{payment_id} - Get payment status
    if (method === 'GET' && url.pathname.includes('/status/')) {
      const paymentId = url.pathname.split('/').pop();

      const { data: payment, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (error || !payment) {
        return new Response(JSON.stringify({ error: 'Payment not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(payment), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /payment-processing/methods - Get available payment methods
    if (method === 'GET' && endpoint === 'methods') {
      const paymentMethods = [
        {
          id: 'bkash',
          name: 'bKash',
          type: 'mobile_banking',
          logo: '/payment-logos/bkash.png',
          enabled: true,
        },
        {
          id: 'nagad',
          name: 'Nagad',
          type: 'mobile_banking',
          logo: '/payment-logos/nagad.png',
          enabled: true,
        },
        {
          id: 'rocket',
          name: 'Rocket',
          type: 'mobile_banking',
          logo: '/payment-logos/rocket.png',
          enabled: true,
        },
        {
          id: 'bank_transfer',
          name: 'Bank Transfer',
          type: 'bank',
          logo: '/payment-logos/bank.png',
          enabled: true,
        },
        {
          id: 'cod',
          name: 'Cash on Delivery',
          type: 'cash',
          logo: '/payment-logos/cod.png',
          enabled: true,
        },
      ];

      return new Response(JSON.stringify(paymentMethods), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Payment method handlers
async function processBkashPayment(payment: any, paymentData: PaymentRequest) {
  // In production, integrate with bKash API
  console.log('Processing bKash payment:', payment.id);
  
  return {
    success: true,
    payment_id: payment.id,
    payment_url: `bkash://payment?amount=${payment.amount}&reference=${payment.transaction_reference}`,
    instructions: 'Complete the payment using bKash app with the provided reference number',
    transaction_reference: payment.transaction_reference,
  };
}

async function processNagadPayment(payment: any, paymentData: PaymentRequest) {
  // In production, integrate with Nagad API
  console.log('Processing Nagad payment:', payment.id);
  
  return {
    success: true,
    payment_id: payment.id,
    payment_url: `nagad://payment?amount=${payment.amount}&reference=${payment.transaction_reference}`,
    instructions: 'Complete the payment using Nagad app with the provided reference number',
    transaction_reference: payment.transaction_reference,
  };
}

async function processRocketPayment(payment: any, paymentData: PaymentRequest) {
  // In production, integrate with Rocket API
  console.log('Processing Rocket payment:', payment.id);
  
  return {
    success: true,
    payment_id: payment.id,
    payment_url: `rocket://payment?amount=${payment.amount}&reference=${payment.transaction_reference}`,
    instructions: 'Complete the payment using Rocket app with the provided reference number',
    transaction_reference: payment.transaction_reference,
  };
}

async function processBankTransfer(payment: any) {
  console.log('Processing bank transfer:', payment.id);
  
  return {
    success: true,
    payment_id: payment.id,
    instructions: 'Transfer the amount to our bank account and provide the transaction reference',
    bank_details: {
      account_name: 'E-Commerce Platform Ltd',
      account_number: '1234567890',
      bank_name: 'Bangladesh Bank',
      routing_number: '123456789',
    },
    transaction_reference: payment.transaction_reference,
  };
}

async function processCOD(payment: any) {
  console.log('Processing cash on delivery:', payment.id);
  
  return {
    success: true,
    payment_id: payment.id,
    instructions: 'Payment will be collected upon delivery',
    delivery_note: 'Please keep the exact amount ready for the delivery person',
  };
}

// Payment verification functions
async function verifyBkashPayment(verificationData: PaymentVerification) {
  // In production, verify with bKash API
  console.log('Verifying bKash payment:', verificationData.payment_id);
  
  // Simulate API call
  return {
    success: true,
    data: {
      verified: true,
      amount: 1000,
      transaction_id: verificationData.transaction_id,
    },
  };
}

async function verifyNagadPayment(verificationData: PaymentVerification) {
  // In production, verify with Nagad API
  console.log('Verifying Nagad payment:', verificationData.payment_id);
  
  return {
    success: true,
    data: {
      verified: true,
      amount: 1000,
      transaction_id: verificationData.transaction_id,
    },
  };
}

async function verifyRocketPayment(verificationData: PaymentVerification) {
  // In production, verify with Rocket API
  console.log('Verifying Rocket payment:', verificationData.payment_id);
  
  return {
    success: true,
    data: {
      verified: true,
      amount: 1000,
      transaction_id: verificationData.transaction_id,
    },
  };
}