import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  order_id?: string;
  amount: number;
  currency?: string;
  payment_method: string;
  gateway_name: string;
  vendor_id?: string;
  metadata?: any;
}

interface PaymentGatewayConfig {
  bkash: { api_key: string; secret_key: string; sandbox: boolean };
  nagad: { merchant_id: string; api_key: string; sandbox: boolean };
  rocket: { merchant_id: string; api_key: string; sandbox: boolean };
  stripe: { secret_key: string; publishable_key: string };
  paypal: { client_id: string; client_secret: string; sandbox: boolean };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const path = url.pathname.split("/").filter(Boolean).slice(-1)[0];
    const method = req.method;

    // Health Check
    if (path === "health") {
      return new Response(
        JSON.stringify({ 
          status: "healthy", 
          service: "payment-service", 
          timestamp: new Date().toISOString(),
          version: "1.0.0"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header required");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    const correlationId = crypto.randomUUID();
    console.log(`Payment Service Request: ${method} ${path} - Correlation: ${correlationId}`);

    if (path === "gateways") {
      if (method === "GET") {
        // Get available payment gateways
        const { data: gateways, error } = await supabase
          .from("bd_payment_gateways")
          .select("gateway_name, fee_structure, transaction_limits, is_active")
          .eq("is_active", true);

        if (error) throw error;

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: gateways,
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (path === "process") {
      if (method === "POST") {
        const paymentData: PaymentRequest = await req.json();
        
        if (!paymentData.amount || !paymentData.payment_method || !paymentData.gateway_name) {
          throw new Error("Missing required fields: amount, payment_method, gateway_name");
        }

        // Generate transaction ID
        const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Calculate fees based on gateway
        const feeRate = 0.025; // 2.5% default fee
        const fees = paymentData.amount * feeRate;
        const netAmount = paymentData.amount - fees;
        const platformFee = fees * 0.3; // 30% of fees to platform
        const vendorPayout = netAmount - platformFee;

        // Create payment transaction record
        const { data: transaction, error: transactionError } = await supabase
          .from("payment_service_transactions")
          .insert({
            transaction_id: transactionId,
            order_id: paymentData.order_id,
            customer_id: user.id,
            vendor_id: paymentData.vendor_id,
            payment_method: paymentData.payment_method,
            gateway_name: paymentData.gateway_name,
            amount: paymentData.amount,
            currency: paymentData.currency || "BDT",
            fees,
            net_amount: netAmount,
            platform_fee: platformFee,
            vendor_payout: vendorPayout,
            metadata: paymentData.metadata || {}
          })
          .select()
          .single();

        if (transactionError) throw transactionError;

        // Process payment based on gateway
        let gatewayResponse = {};
        let status = "pending";

        try {
          switch (paymentData.gateway_name.toLowerCase()) {
            case "bkash":
              gatewayResponse = await processBkashPayment(paymentData, transactionId);
              break;
            case "nagad":
              gatewayResponse = await processNagadPayment(paymentData, transactionId);
              break;
            case "rocket":
              gatewayResponse = await processRocketPayment(paymentData, transactionId);
              break;
            case "stripe":
              gatewayResponse = await processStripePayment(paymentData, transactionId);
              break;
            case "cod":
              gatewayResponse = { success: true, message: "Cash on Delivery order created" };
              status = "pending";
              break;
            default:
              throw new Error(`Unsupported payment gateway: ${paymentData.gateway_name}`);
          }

          if (gatewayResponse.success) {
            status = paymentData.gateway_name === "cod" ? "pending" : "processing";
          } else {
            status = "failed";
          }
        } catch (gatewayError) {
          console.error(`Gateway error for ${paymentData.gateway_name}:`, gatewayError);
          gatewayResponse = { 
            success: false, 
            error: gatewayError.message 
          };
          status = "failed";
        }

        // Update transaction with gateway response
        const { data: updatedTransaction, error: updateError } = await supabase
          .from("payment_service_transactions")
          .update({
            status,
            gateway_response: gatewayResponse,
            gateway_transaction_id: gatewayResponse.transaction_id || null,
            failure_reason: !gatewayResponse.success ? gatewayResponse.error : null,
            processed_at: status !== "pending" ? new Date().toISOString() : null
          })
          .eq("id", transaction.id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Update order payment status if order_id provided
        if (paymentData.order_id) {
          await supabase
            .from("order_service_orders")
            .update({ 
              payment_status: status === "processing" ? "paid" : status 
            })
            .eq("id", paymentData.order_id);
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: {
              transaction_id: transactionId,
              status,
              gateway_response: gatewayResponse,
              amount: paymentData.amount,
              currency: paymentData.currency || "BDT"
            },
            correlation_id: correlationId 
          }),
          { 
            status: 201,
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    }

    if (path === "transactions") {
      if (method === "GET") {
        const searchParams = url.searchParams;
        const status = searchParams.get("status");
        const order_id = searchParams.get("order_id");

        let query = supabase
          .from("payment_service_transactions")
          .select("*")
          .eq("customer_id", user.id);

        if (status) {
          query = query.eq("status", status);
        }

        if (order_id) {
          query = query.eq("order_id", order_id);
        }

        const { data: transactions, error } = await query
          .order("created_at", { ascending: false });

        if (error) throw error;

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: transactions,
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (path === "refund") {
      if (method === "POST") {
        const { transaction_id, amount, reason } = await req.json();
        
        if (!transaction_id) {
          throw new Error("Missing required field: transaction_id");
        }

        // Get transaction
        const { data: transaction, error: txError } = await supabase
          .from("payment_service_transactions")
          .select("*")
          .eq("transaction_id", transaction_id)
          .eq("customer_id", user.id)
          .single();

        if (txError || !transaction) {
          throw new Error("Transaction not found or access denied");
        }

        if (transaction.status !== "completed") {
          throw new Error("Can only refund completed transactions");
        }

        const refundAmount = amount || transaction.amount;
        if (refundAmount > transaction.amount) {
          throw new Error("Refund amount cannot exceed transaction amount");
        }

        // Process refund (simplified - would integrate with actual gateway APIs)
        const refundStatus = "pending"; // Would be determined by gateway response

        const { data: updatedTransaction, error: updateError } = await supabase
          .from("payment_service_transactions")
          .update({
            refund_amount: refundAmount,
            refund_status: refundAmount === transaction.amount ? "full" : "partial",
            status: refundStatus,
            metadata: {
              ...transaction.metadata,
              refund_reason: reason,
              refund_requested_at: new Date().toISOString()
            }
          })
          .eq("id", transaction.id)
          .select()
          .single();

        if (updateError) throw updateError;

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: updatedTransaction,
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { 
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Payment Service Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        service: "payment-service" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Mock gateway processing functions (would integrate with real APIs)
async function processBkashPayment(paymentData: PaymentRequest, transactionId: string) {
  // Simulate bKash API call
  return {
    success: true,
    transaction_id: `bkash_${transactionId}`,
    message: "Payment initiated successfully",
    payment_url: `https://checkout.pay.bka.sh/v1.2.0-beta/checkout/payment/${transactionId}`
  };
}

async function processNagadPayment(paymentData: PaymentRequest, transactionId: string) {
  // Simulate Nagad API call
  return {
    success: true,
    transaction_id: `nagad_${transactionId}`,
    message: "Payment initiated successfully",
    payment_url: `https://api.mynagad.com/api/dfs/check-out/initialize/${transactionId}`
  };
}

async function processRocketPayment(paymentData: PaymentRequest, transactionId: string) {
  // Simulate Rocket API call
  return {
    success: true,
    transaction_id: `rocket_${transactionId}`,
    message: "Payment initiated successfully"
  };
}

async function processStripePayment(paymentData: PaymentRequest, transactionId: string) {
  // Simulate Stripe API call
  return {
    success: true,
    transaction_id: `stripe_${transactionId}`,
    message: "Payment processed successfully"
  };
}