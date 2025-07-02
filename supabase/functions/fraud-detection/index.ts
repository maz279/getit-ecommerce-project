import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

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
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    const { userId, transactionId, amount, deviceFingerprint, ipAddress } = await req.json();

    // Simple fraud detection logic
    let riskScore = 0;
    const indicators = [];

    // Check transaction amount
    if (amount > 50000) {
      riskScore += 30;
      indicators.push('High transaction amount');
    }

    // Check for suspicious patterns
    if (amount % 1000 === 0) {
      riskScore += 20;
      indicators.push('Round amount transaction');
    }

    // Determine action
    let actionTaken = 'allow';
    if (riskScore >= 50) actionTaken = 'review';
    if (riskScore >= 80) actionTaken = 'block';

    // Log detection
    await supabase.from('fraud_detection_logs').insert({
      user_id: userId,
      transaction_id: transactionId,
      risk_score: riskScore,
      fraud_indicators: { indicators },
      action_taken: actionTaken,
      device_fingerprint: deviceFingerprint,
      ip_address: ipAddress
    });

    return new Response(JSON.stringify({
      riskScore,
      actionTaken,
      isBlocked: actionTaken === 'block'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});