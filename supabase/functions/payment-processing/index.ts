import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://deno.land/x/supabase@1.0.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { endpoint, data } = await req.json();

    // Health check
    if (endpoint === 'health') {
      return new Response(JSON.stringify({ status: 'healthy', service: 'payment-processing' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Route payment operations
    switch (endpoint) {
      case 'payment/process':
        // Process payment based on method
        const paymentResult = await processPayment(data);
        
        // Log payment transaction
        const { data: transaction, error: logError } = await supabase
          .from('payment_transactions')
          .insert({
            order_id: data.orderId,
            payment_method: data.paymentMethod,
            amount: data.amount,
            status: paymentResult.success ? 'completed' : 'failed',
            transaction_id: paymentResult.transactionId,
            gateway_response: paymentResult
          })
          .select()
          .single();
        
        return new Response(JSON.stringify({ 
          data: { transaction, paymentResult }, 
          error: logError 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'payment/verify':
        const { data: payment, error: verifyError } = await supabase
          .from('payment_transactions')
          .select('*')
          .eq('transaction_id', data.transactionId)
          .single();
        
        return new Response(JSON.stringify({ data: payment, error: verifyError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'payment/refund':
        const refundResult = await processRefund(data);
        
        const { data: refund, error: refundError } = await supabase
          .from('payment_refunds')
          .insert({
            original_transaction_id: data.transactionId,
            refund_amount: data.amount,
            reason: data.reason,
            status: refundResult.success ? 'processed' : 'failed',
            refund_reference: refundResult.refundId
          })
          .select()
          .single();
        
        return new Response(JSON.stringify({ 
          data: { refund, refundResult }, 
          error: refundError 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'payment/methods':
        const { data: methods, error: methodsError } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('is_active', true);
        
        return new Response(JSON.stringify({ data: methods, error: methodsError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function processPayment(data: any) {
  // Mock payment processing - integrate with actual payment gateways
  const { paymentMethod, amount, orderId } = data;
  
  // Simulate payment processing based on method
  switch (paymentMethod) {
    case 'bkash':
      return {
        success: true,
        transactionId: `bkash_${Date.now()}`,
        amount: amount,
        method: 'bkash',
        status: 'completed'
      };
    
    case 'nagad':
      return {
        success: true,
        transactionId: `nagad_${Date.now()}`,
        amount: amount,
        method: 'nagad',
        status: 'completed'
      };
    
    case 'card':
      return {
        success: true,
        transactionId: `card_${Date.now()}`,
        amount: amount,
        method: 'card',
        status: 'completed'
      };
    
    default:
      return {
        success: false,
        error: 'Unsupported payment method',
        method: paymentMethod
      };
  }
}

async function processRefund(data: any) {
  // Mock refund processing
  return {
    success: true,
    refundId: `refund_${Date.now()}`,
    amount: data.amount,
    status: 'processed'
  };
}