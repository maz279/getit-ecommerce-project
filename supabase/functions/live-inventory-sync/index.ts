/**
 * Live Inventory Sync Service
 * Handles real-time inventory updates, alerts, and synchronization
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InventoryUpdateRequest {
  action: 'update_stock' | 'check_alerts' | 'get_events' | 'create_alert';
  productId?: string;
  vendorId?: string;
  quantity?: number;
  reason?: string;
  source?: string;
  alertType?: string;
  threshold?: number;
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

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const {
      action,
      productId,
      vendorId,
      quantity,
      reason,
      source = 'manual',
      alertType,
      threshold
    }: InventoryUpdateRequest = await req.json();

    switch (action) {
      case 'update_stock':
        return await updateStock(supabaseClient, user.id, productId!, quantity!, reason, source);
      
      case 'check_alerts':
        return await checkInventoryAlerts(supabaseClient, vendorId || user.id);
      
      case 'get_events':
        return await getInventoryEvents(supabaseClient, vendorId || user.id, productId);
      
      case 'create_alert':
        return await createInventoryAlert(supabaseClient, productId!, vendorId || user.id, alertType!, threshold);
      
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Live Inventory Sync Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function updateStock(
  supabaseClient: any,
  userId: string,
  productId: string,
  newQuantity: number,
  reason?: string,
  source: string = 'manual'
) {
  // Get current inventory
  const { data: currentInventory } = await supabaseClient
    .from('product_inventory')
    .select('*')
    .eq('product_id', productId)
    .single();

  if (!currentInventory) {
    throw new Error('Product inventory not found');
  }

  const oldQuantity = currentInventory.current_stock;
  const vendorId = currentInventory.vendor_id || userId;

  // Update inventory
  const { error: updateError } = await supabaseClient
    .from('product_inventory')
    .update({ 
      current_stock: newQuantity,
      updated_at: new Date().toISOString()
    })
    .eq('product_id', productId);

  if (updateError) throw updateError;

  // Create inventory event
  const eventType = determineEventType(oldQuantity, newQuantity, currentInventory.minimum_stock_level);
  
  const { data: event, error: eventError } = await supabaseClient
    .from('live_inventory_events')
    .insert({
      product_id: productId,
      vendor_id: vendorId,
      event_type: eventType,
      old_quantity: oldQuantity,
      new_quantity: newQuantity,
      reason,
      source,
      metadata: {
        user_id: userId,
        timestamp: new Date().toISOString()
      }
    })
    .select()
    .single();

  if (eventError) throw eventError;

  // Check for alerts
  await checkAndCreateAlerts(supabaseClient, productId, vendorId, newQuantity, currentInventory.minimum_stock_level);

  // Broadcast inventory update
  await broadcastInventoryUpdate(productId, {
    productId,
    vendorId,
    newQuantity,
    oldQuantity,
    eventType,
    difference: newQuantity - oldQuantity,
    timestamp: new Date().toISOString()
  });

  // Send notifications for critical events
  if (['out_of_stock', 'low_stock'].includes(eventType)) {
    await sendInventoryNotification(supabaseClient, vendorId, eventType, productId, newQuantity);
  }

  return new Response(JSON.stringify({
    success: true,
    event,
    oldQuantity,
    newQuantity,
    difference: newQuantity - oldQuantity
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function checkInventoryAlerts(supabaseClient: any, vendorId: string) {
  const { data: alerts, error } = await supabaseClient
    .from('inventory_alerts')
    .select(`
      *,
      products:product_id (
        name,
        sku
      )
    `)
    .eq('vendor_id', vendorId)
    .eq('is_resolved', false)
    .order('severity', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;

  return new Response(JSON.stringify({
    success: true,
    alerts: alerts || []
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getInventoryEvents(supabaseClient: any, vendorId: string, productId?: string) {
  let query = supabaseClient
    .from('live_inventory_events')
    .select(`
      *,
      products:product_id (
        name,
        sku
      )
    `)
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (productId) {
    query = query.eq('product_id', productId);
  }

  const { data: events, error } = await query;
  if (error) throw error;

  return new Response(JSON.stringify({
    success: true,
    events: events || []
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function createInventoryAlert(
  supabaseClient: any,
  productId: string,
  vendorId: string,
  alertType: string,
  threshold?: number
) {
  // Get product info
  const { data: product } = await supabaseClient
    .from('products')
    .select('name')
    .eq('id', productId)
    .single();

  const { data: alert, error } = await supabaseClient
    .from('inventory_alerts')
    .insert({
      product_id: productId,
      vendor_id: vendorId,
      alert_type: alertType,
      threshold_value: threshold,
      message: generateAlertMessage(alertType, product?.name, threshold),
      severity: getAlertSeverity(alertType)
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(JSON.stringify({
    success: true,
    alert
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

function determineEventType(oldQuantity: number, newQuantity: number, minStockLevel: number): string {
  if (newQuantity === 0) return 'out_of_stock';
  if (newQuantity <= minStockLevel && oldQuantity > minStockLevel) return 'low_stock';
  if (newQuantity > minStockLevel && oldQuantity <= minStockLevel) return 'restock';
  return 'stock_update';
}

async function checkAndCreateAlerts(
  supabaseClient: any,
  productId: string,
  vendorId: string,
  currentStock: number,
  minStockLevel: number
) {
  const alerts = [];

  // Check for low stock
  if (currentStock <= minStockLevel && currentStock > 0) {
    const { data: product } = await supabaseClient
      .from('products')
      .select('name')
      .eq('id', productId)
      .single();

    alerts.push({
      product_id: productId,
      vendor_id: vendorId,
      alert_type: 'low_stock',
      threshold_value: minStockLevel,
      current_value: currentStock,
      severity: currentStock <= minStockLevel * 0.5 ? 'high' : 'medium',
      message: `Low stock alert: ${product?.name} has only ${currentStock} units remaining`
    });
  }

  // Check for out of stock
  if (currentStock === 0) {
    const { data: product } = await supabaseClient
      .from('products')
      .select('name')
      .eq('id', productId)
      .single();

    alerts.push({
      product_id: productId,
      vendor_id: vendorId,
      alert_type: 'out_of_stock',
      current_value: 0,
      severity: 'critical',
      message: `Out of stock: ${product?.name} is completely out of stock`
    });
  }

  // Insert alerts
  if (alerts.length > 0) {
    await supabaseClient
      .from('inventory_alerts')
      .insert(alerts);
  }
}

async function broadcastInventoryUpdate(productId: string, data: any) {
  try {
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/websocket-hub/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: `inventory_${productId}`,
        data: {
          type: 'inventory_update',
          ...data
        }
      })
    });
  } catch (error) {
    console.error('Error broadcasting inventory update:', error);
  }
}

async function sendInventoryNotification(
  supabaseClient: any,
  vendorId: string,
  eventType: string,
  productId: string,
  quantity: number
) {
  const { data: product } = await supabaseClient
    .from('products')
    .select('name')
    .eq('id', productId)
    .single();

  const title = eventType === 'out_of_stock' ? 'Product Out of Stock' : 'Low Stock Alert';
  const body = eventType === 'out_of_stock' 
    ? `${product?.name} is completely out of stock`
    : `${product?.name} has only ${quantity} units remaining`;

  try {
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/push-notification-service`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send',
        userId: vendorId,
        type: 'inventory',
        title,
        body,
        data: { productId, quantity, eventType },
        priority: eventType === 'out_of_stock' ? 'high' : 'normal'
      })
    });
  } catch (error) {
    console.error('Error sending inventory notification:', error);
  }
}

function generateAlertMessage(alertType: string, productName?: string, threshold?: number): string {
  switch (alertType) {
    case 'low_stock':
      return `Low stock alert for ${productName}. Threshold: ${threshold}`;
    case 'out_of_stock':
      return `${productName} is out of stock`;
    case 'high_demand':
      return `High demand detected for ${productName}`;
    case 'slow_moving':
      return `Slow moving inventory detected for ${productName}`;
    default:
      return `Inventory alert for ${productName}`;
  }
}

function getAlertSeverity(alertType: string): string {
  const severityMap: { [key: string]: string } = {
    out_of_stock: 'critical',
    low_stock: 'high',
    high_demand: 'medium',
    slow_moving: 'low'
  };
  return severityMap[alertType] || 'medium';
}