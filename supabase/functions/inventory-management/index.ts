import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { action, data } = await req.json();

    console.log(`[INVENTORY] Processing action: ${action}`);

    switch (action) {
      case 'update_stock': {
        const { inventoryId, quantity, movementType, reason, performedBy } = data;

        // Get current inventory
        const { data: inventory } = await supabaseClient
          .from('inventory')
          .select('*')
          .eq('id', inventoryId)
          .single();

        if (!inventory) {
          throw new Error('Inventory record not found');
        }

        // Calculate new stock level
        const newStock = movementType === 'inbound' 
          ? inventory.current_stock + Math.abs(quantity)
          : inventory.current_stock - Math.abs(quantity);

        if (newStock < 0) {
          throw new Error('Insufficient stock for this operation');
        }

        // Update inventory
        const { data: updatedInventory } = await supabaseClient
          .from('inventory')
          .update({
            current_stock: newStock,
            last_restocked_at: movementType === 'inbound' ? new Date().toISOString() : inventory.last_restocked_at,
            updated_at: new Date().toISOString()
          })
          .eq('id', inventoryId)
          .select()
          .single();

        // Log movement
        await supabaseClient
          .from('inventory_movements')
          .insert({
            inventory_id: inventoryId,
            movement_type: movementType,
            quantity: movementType === 'inbound' ? Math.abs(quantity) : -Math.abs(quantity),
            reason,
            performed_by: performedBy
          });

        return new Response(JSON.stringify({ 
          success: true, 
          inventory: updatedInventory,
          message: `Stock ${movementType === 'inbound' ? 'increased' : 'decreased'} by ${Math.abs(quantity)}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'generate_forecast': {
        const { productId, vendorId, period = 'month' } = data;

        // Get historical sales data (simplified forecast)
        const { data: salesHistory } = await supabaseClient
          .from('order_items')
          .select(`
            quantity,
            created_at,
            orders!inner(status)
          `)
          .eq('product_id', productId)
          .eq('orders.status', 'delivered')
          .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()) // Last 90 days
          .order('created_at', { ascending: true });

        // Simple moving average forecast
        const totalSales = salesHistory?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        const avgDailySales = totalSales / 90;
        
        const forecastDays = period === 'week' ? 7 : period === 'month' ? 30 : 90;
        const predictedDemand = Math.ceil(avgDailySales * forecastDays);
        
        // Calculate confidence based on data consistency
        const dailySales = Array(90).fill(0);
        salesHistory?.forEach(sale => {
          const dayIndex = Math.floor((new Date().getTime() - new Date(sale.created_at).getTime()) / (24 * 60 * 60 * 1000));
          if (dayIndex >= 0 && dayIndex < 90) {
            dailySales[89 - dayIndex] += sale.quantity;
          }
        });

        const variance = dailySales.reduce((sum, daily) => sum + Math.pow(daily - avgDailySales, 2), 0) / 90;
        const confidenceScore = Math.max(0.1, Math.min(0.95, 1 - (Math.sqrt(variance) / (avgDailySales + 1))));

        // Store forecast
        const forecastData = {
          product_id: productId,
          vendor_id: vendorId,
          forecast_period: period,
          forecast_date: new Date().toISOString().split('T')[0],
          predicted_demand: predictedDemand,
          confidence_score: confidenceScore,
          historical_data: {
            total_sales_90_days: totalSales,
            avg_daily_sales: avgDailySales,
            variance: variance
          },
          factors_considered: {
            historical_period: '90 days',
            seasonal_adjustment: false,
            trend_analysis: false
          },
          algorithm_version: 'simple_moving_average_v1'
        };

        const { data: forecast } = await supabaseClient
          .from('demand_forecasts')
          .upsert(forecastData, {
            onConflict: 'product_id,vendor_id,forecast_period,forecast_date'
          })
          .select()
          .single();

        return new Response(JSON.stringify({ 
          success: true, 
          forecast,
          message: `Forecast generated for ${period} period`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'acknowledge_alert': {
        const { alertId, acknowledgedBy } = data;

        const { data: alert } = await supabaseClient
          .from('stock_alerts')
          .update({
            is_acknowledged: true,
            acknowledged_by: acknowledgedBy,
            acknowledged_at: new Date().toISOString()
          })
          .eq('id', alertId)
          .select()
          .single();

        return new Response(JSON.stringify({ 
          success: true, 
          alert,
          message: 'Alert acknowledged successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'resolve_alert': {
        const { alertId } = data;

        const { data: alert } = await supabaseClient
          .from('stock_alerts')
          .update({
            resolved_at: new Date().toISOString()
          })
          .eq('id', alertId)
          .select()
          .single();

        return new Response(JSON.stringify({ 
          success: true, 
          alert,
          message: 'Alert resolved successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'bulk_update_stock_levels': {
        const { updates } = data; // Array of {inventoryId, newMinLevel, newMaxLevel, newReorderPoint}

        const results = [];
        
        for (const update of updates) {
          const { data: inventory } = await supabaseClient
            .from('inventory')
            .update({
              minimum_stock_level: update.newMinLevel,
              maximum_stock_level: update.newMaxLevel,
              reorder_point: update.newReorderPoint,
              updated_at: new Date().toISOString()
            })
            .eq('id', update.inventoryId)
            .select()
            .single();

          results.push(inventory);
        }

        return new Response(JSON.stringify({ 
          success: true, 
          updated: results.length,
          message: `Updated ${results.length} inventory records`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'transfer_inventory': {
        const { sourceInventoryId, targetFulfillmentCenterId, quantity, reason, performedBy } = data;

        // Get source inventory
        const { data: sourceInventory } = await supabaseClient
          .from('inventory')
          .select('*')
          .eq('id', sourceInventoryId)
          .single();

        if (!sourceInventory || sourceInventory.available_stock < quantity) {
          throw new Error('Insufficient stock for transfer');
        }

        // Check if target inventory exists
        let { data: targetInventory } = await supabaseClient
          .from('inventory')
          .select('*')
          .eq('product_id', sourceInventory.product_id)
          .eq('vendor_id', sourceInventory.vendor_id)
          .eq('fulfillment_center_id', targetFulfillmentCenterId)
          .single();

        // Create target inventory if doesn't exist
        if (!targetInventory) {
          const { data: newInventory } = await supabaseClient
            .from('inventory')
            .insert({
              product_id: sourceInventory.product_id,
              vendor_id: sourceInventory.vendor_id,
              fulfillment_center_id: targetFulfillmentCenterId,
              sku: sourceInventory.sku,
              current_stock: quantity,
              minimum_stock_level: sourceInventory.minimum_stock_level,
              maximum_stock_level: sourceInventory.maximum_stock_level,
              reorder_point: sourceInventory.reorder_point,
              cost_per_unit: sourceInventory.cost_per_unit
            })
            .select()
            .single();
          
          targetInventory = newInventory;
        } else {
          // Update target inventory
          await supabaseClient
            .from('inventory')
            .update({
              current_stock: targetInventory.current_stock + quantity,
              updated_at: new Date().toISOString()
            })
            .eq('id', targetInventory.id);
        }

        // Update source inventory
        await supabaseClient
          .from('inventory')
          .update({
            current_stock: sourceInventory.current_stock - quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', sourceInventoryId);

        // Log movements
        await supabaseClient
          .from('inventory_movements')
          .insert([
            {
              inventory_id: sourceInventoryId,
              movement_type: 'transfer',
              quantity: -quantity,
              reference_type: 'transfer',
              reference_id: targetInventory.id,
              reason,
              performed_by: performedBy
            },
            {
              inventory_id: targetInventory.id,
              movement_type: 'transfer',
              quantity: quantity,
              reference_type: 'transfer',
              reference_id: sourceInventoryId,
              reason,
              performed_by: performedBy
            }
          ]);

        return new Response(JSON.stringify({ 
          success: true, 
          message: `Transferred ${quantity} units successfully`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('[INVENTORY] Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});