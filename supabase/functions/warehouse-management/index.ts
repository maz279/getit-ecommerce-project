import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WarehouseRequest {
  action: 'inventory_movement' | 'supply_chain_update' | 'warehouse_status' | 'demand_forecast';
  data?: any;
  warehouse_id?: string;
  product_id?: string;
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

    const { action, data, warehouse_id, product_id }: WarehouseRequest = await req.json();

    switch (action) {
      case 'inventory_movement': {
        const {
          warehouse_id: whId,
          zone_id,
          movement_type,
          quantity,
          unit_cost,
          batch_number,
          expiry_date,
          reason,
          reference_document,
          processed_by
        } = data;

        // Record inventory movement
        const { data: movement, error: movementError } = await supabase
          .from('inventory_movements')
          .insert({
            product_id,
            warehouse_id: whId,
            zone_id,
            movement_type,
            quantity,
            unit_cost,
            batch_number,
            expiry_date,
            reason,
            reference_document,
            processed_by
          })
          .select()
          .single();

        if (movementError) throw movementError;

        // Update inventory levels
        const { data: currentInventory } = await supabase
          .from('inventories')
          .select('current_stock')
          .eq('product_id', product_id)
          .eq('warehouse_id', whId)
          .single();

        const currentStock = currentInventory?.current_stock || 0;
        const newStock = movement_type === 'inbound' 
          ? currentStock + quantity 
          : currentStock - quantity;

        await supabase
          .from('inventories')
          .upsert({
            product_id,
            warehouse_id: whId,
            current_stock: Math.max(0, newStock),
            updated_at: new Date().toISOString()
          });

        return new Response(JSON.stringify({
          success: true,
          movement,
          new_stock_level: Math.max(0, newStock)
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'supply_chain_update': {
        const {
          event_type,
          entity_type,
          entity_id,
          location,
          estimated_arrival,
          actual_arrival,
          carrier_info,
          tracking_number,
          status_details
        } = data;

        const { data: event, error } = await supabase
          .from('supply_chain_events')
          .insert({
            event_type,
            entity_type,
            entity_id,
            location,
            estimated_arrival,
            actual_arrival,
            carrier_info,
            tracking_number,
            status_details
          })
          .select()
          .single();

        if (error) throw error;

        // Send real-time notification for critical events
        if (['delivered', 'delayed', 'returned'].includes(event_type)) {
          await supabase.from('realtime_notifications').insert({
            notification_type: 'supply_chain_update',
            title: `Supply Chain Update: ${event_type}`,
            message: `${entity_type} ${entity_id} is ${event_type}`,
            data: { event_id: event.id, entity_type, entity_id }
          });
        }

        return new Response(JSON.stringify({
          success: true,
          event
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'warehouse_status': {
        const { data: warehouses, error } = await supabase
          .from('warehouses')
          .select(`
            *,
            warehouse_zones(
              id, zone_name, zone_type, capacity, current_utilization
            )
          `)
          .eq('status', 'active');

        if (error) throw error;

        const warehouseStatus = warehouses?.map(warehouse => ({
          ...warehouse,
          utilization_percentage: warehouse.warehouse_zones
            .reduce((total: number, zone: any) => total + (zone.current_utilization / zone.capacity) * 100, 0) / warehouse.warehouse_zones.length || 0
        }));

        return new Response(JSON.stringify({
          success: true,
          warehouses: warehouseStatus || []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'demand_forecast': {
        if (!product_id) {
          throw new Error('product_id required for demand forecast');
        }

        // Get historical sales data
        const { data: salesHistory } = await supabase
          .from('order_items')
          .select(`
            quantity,
            orders(created_at, status)
          `)
          .eq('product_id', product_id)
          .eq('orders.status', 'completed')
          .gte('orders.created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
          .order('orders.created_at', { ascending: false });

        // Simple moving average forecast (in production, use ML models)
        const dailySales = new Map();
        salesHistory?.forEach((item: any) => {
          const date = new Date(item.orders.created_at).toDateString();
          dailySales.set(date, (dailySales.get(date) || 0) + item.quantity);
        });

        const averageDailySales = Array.from(dailySales.values())
          .reduce((sum, sales) => sum + sales, 0) / Math.max(dailySales.size, 1);

        const forecastData = {
          product_id,
          forecast_period: '30_days',
          predicted_demand: Math.round(averageDailySales * 30),
          confidence_score: dailySales.size > 30 ? 0.8 : 0.6,
          historical_data: {
            days_analyzed: dailySales.size,
            average_daily_sales: averageDailySales
          }
        };

        // Save forecast
        await supabase.from('demand_forecasts').insert({
          ...forecastData,
          vendor_id: data.vendor_id,
          forecast_date: new Date().toISOString(),
          factors_considered: {
            historical_sales: true,
            seasonal_trends: false,
            market_conditions: false
          }
        });

        return new Response(JSON.stringify({
          success: true,
          forecast: forecastData
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('Warehouse management error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});