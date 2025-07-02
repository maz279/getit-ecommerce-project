import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PriceMonitorRequest {
  action: 'create_alert' | 'update_price' | 'check_alerts' | 'get_price_history';
  productId?: string;
  targetPrice?: number;
  alertType?: 'below' | 'above' | 'exact';
  newPrice?: number;
  oldPrice?: number;
  changeReason?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { action, productId, targetPrice, alertType, newPrice, oldPrice, changeReason }: PriceMonitorRequest = await req.json();

    switch (action) {
      case 'create_alert':
        return await createPriceAlert(supabaseClient, productId!, targetPrice!, alertType!);
      
      case 'update_price':
        return await updateProductPrice(supabaseClient, productId!, newPrice!, oldPrice, changeReason);
      
      case 'check_alerts':
        return await checkPriceAlerts(supabaseClient, productId!, newPrice!);
      
      case 'get_price_history':
        return await getPriceHistory(supabaseClient, productId!);
      
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Price Monitor Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function createPriceAlert(supabaseClient: any, productId: string, targetPrice: number, alertType: string) {
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    throw new Error('Unauthorized');
  }

  // Get current product price
  const { data: product, error: productError } = await supabaseClient
    .from('products')
    .select('price')
    .eq('id', productId)
    .single();

  if (productError) throw productError;

  // Create price alert
  const { data: alert, error: alertError } = await supabaseClient
    .from('price_alerts')
    .insert({
      user_id: user.id,
      product_id: productId,
      target_price: targetPrice,
      current_price: product.price,
      alert_type: alertType,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    })
    .select()
    .single();

  if (alertError) throw alertError;

  return new Response(
    JSON.stringify({ success: true, alert }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function updateProductPrice(supabaseClient: any, productId: string, newPrice: number, oldPrice?: number, changeReason?: string) {
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    throw new Error('Unauthorized');
  }

  // Get current price if not provided
  if (!oldPrice) {
    const { data: product, error: productError } = await supabaseClient
      .from('products')
      .select('price, vendor_id')
      .eq('id', productId)
      .single();

    if (productError) throw productError;
    oldPrice = product.price;
  }

  // Update product price
  const { error: updateError } = await supabaseClient
    .from('products')
    .update({ price: newPrice })
    .eq('id', productId);

  if (updateError) throw updateError;

  // Record price change history
  const changePercentage = oldPrice ? ((newPrice - oldPrice) / oldPrice) * 100 : 0;
  
  const { error: historyError } = await supabaseClient
    .from('price_change_history')
    .insert({
      product_id: productId,
      vendor_id: user.id,
      old_price: oldPrice,
      new_price: newPrice,
      change_percentage: changePercentage,
      change_reason: changeReason,
      created_by: user.id
    });

  if (historyError) throw historyError;

  // Check and trigger price alerts
  await checkPriceAlerts(supabaseClient, productId, newPrice);

  return new Response(
    JSON.stringify({ 
      success: true, 
      oldPrice, 
      newPrice, 
      changePercentage: changePercentage.toFixed(2) 
    }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function checkPriceAlerts(supabaseClient: any, productId: string, currentPrice: number) {
  // Get active alerts for this product
  const { data: alerts, error: alertsError } = await supabaseClient
    .from('price_alerts')
    .select('*')
    .eq('product_id', productId)
    .eq('is_active', true)
    .is('triggered_at', null);

  if (alertsError) throw alertsError;

  const triggeredAlerts = [];

  for (const alert of alerts) {
    let shouldTrigger = false;

    switch (alert.alert_type) {
      case 'below':
        shouldTrigger = currentPrice <= alert.target_price;
        break;
      case 'above':
        shouldTrigger = currentPrice >= alert.target_price;
        break;
      case 'exact':
        shouldTrigger = Math.abs(currentPrice - alert.target_price) < 0.01;
        break;
    }

    if (shouldTrigger) {
      // Update alert as triggered
      await supabaseClient
        .from('price_alerts')
        .update({ 
          triggered_at: new Date().toISOString(),
          notification_sent: false
        })
        .eq('id', alert.id);

      // Create push notification
      await supabaseClient
        .from('push_notifications')
        .insert({
          user_id: alert.user_id,
          title: '💰 Price Alert Triggered!',
          body: `The price you're watching has ${alert.alert_type === 'below' ? 'dropped to' : 'reached'} ৳${currentPrice}`,
          type: 'price_alert',
          data: {
            product_id: productId,
            alert_id: alert.id,
            new_price: currentPrice,
            target_price: alert.target_price
          }
        });

      triggeredAlerts.push(alert);
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      triggeredAlerts: triggeredAlerts.length,
      alerts: triggeredAlerts 
    }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function getPriceHistory(supabaseClient: any, productId: string) {
  const { data: history, error } = await supabaseClient
    .from('price_change_history')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  // Calculate price trends
  const pricePoints = history.map(h => ({
    price: h.new_price,
    date: h.created_at
  }));

  const trends = analyzePriceTrends(pricePoints);

  return new Response(
    JSON.stringify({ 
      success: true, 
      history,
      trends
    }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

function analyzePriceTrends(pricePoints: any[]) {
  if (pricePoints.length < 2) {
    return { trend: 'stable', volatility: 'low', recommendation: 'monitor' };
  }

  const prices = pricePoints.map(p => p.price);
  const latest = prices[0];
  const oldest = prices[prices.length - 1];
  
  const overallChange = ((latest - oldest) / oldest) * 100;
  
  // Calculate volatility (standard deviation)
  const mean = prices.reduce((a, b) => a + b) / prices.length;
  const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / prices.length;
  const volatility = Math.sqrt(variance) / mean * 100;

  let trend = 'stable';
  if (overallChange > 5) trend = 'increasing';
  else if (overallChange < -5) trend = 'decreasing';

  let volatilityLevel = 'low';
  if (volatility > 15) volatilityLevel = 'high';
  else if (volatility > 7) volatilityLevel = 'medium';

  let recommendation = 'monitor';
  if (trend === 'decreasing' && volatilityLevel === 'low') recommendation = 'buy_opportunity';
  else if (trend === 'increasing' && volatilityLevel === 'high') recommendation = 'wait';

  return {
    trend,
    volatility: volatilityLevel,
    recommendation,
    overallChange: overallChange.toFixed(2),
    volatilityScore: volatility.toFixed(2)
  };
}