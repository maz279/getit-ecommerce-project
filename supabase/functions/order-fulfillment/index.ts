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

    console.log(`[FULFILLMENT] Processing action: ${action}`);

    switch (action) {
      case 'process_order': {
        const { orderId } = data;

        // Check if order exists and is paid
        const { data: order } = await supabaseClient
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .eq('payment_status', 'paid')
          .single();

        if (!order) {
          throw new Error('Order not found or payment not completed');
        }

        // Call logistics allocation
        const allocationResponse = await supabaseClient.functions.invoke('logistics-management', {
          body: { action: 'allocate_order', data: { orderId } }
        });

        if (!allocationResponse.data?.success) {
          throw new Error('Failed to allocate order to fulfillment center');
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Order processing initiated',
          fulfillment: allocationResponse.data.fulfillment
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'auto_pick_allocation': {
        const { fulfillmentCenterId } = data;

        // Get pending fulfillments for auto-picking
        const { data: pendingFulfillments } = await supabaseClient
          .from('order_fulfillment')
          .select('order_id')
          .eq('fulfillment_center_id', fulfillmentCenterId)
          .eq('status', 'allocated')
          .limit(20); // Process in batches

        if (!pendingFulfillments?.length) {
          return new Response(JSON.stringify({
            success: true,
            message: 'No orders pending for picking'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          });
        }

        // Create pick list
        const pickResponse = await supabaseClient.functions.invoke('logistics-management', {
          body: { 
            action: 'create_pick_list', 
            data: { 
              fulfillmentCenterId,
              orderIds: pendingFulfillments.map(f => f.order_id)
            }
          }
        });

        return new Response(JSON.stringify({
          success: true,
          message: 'Pick list created for auto-allocation',
          pickList: pickResponse.data?.pickList
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'complete_picking': {
        const { pickListId, pickerId } = data;

        // Get pick list items
        const { data: pickItems } = await supabaseClient
          .from('pick_list_items')
          .select(`
            *,
            order_fulfillment (id, order_id)
          `)
          .eq('pick_list_id', pickListId);

        // Update all items as picked
        for (const item of pickItems || []) {
          await supabaseClient
            .from('pick_list_items')
            .update({
              status: 'picked',
              quantity_picked: item.quantity_requested,
              picked_at: new Date().toISOString()
            })
            .eq('id', item.id);

          // Update fulfillment status
          await supabaseClient.functions.invoke('logistics-management', {
            body: {
              action: 'update_fulfillment_status',
              data: {
                fulfillmentId: item.order_fulfillment.id,
                status: 'picked'
              }
            }
          });
        }

        // Update pick list
        await supabaseClient
          .from('pick_lists')
          .update({
            status: 'completed',
            picker_id: pickerId,
            completed_at: new Date().toISOString(),
            picked_items: pickItems?.length || 0
          })
          .eq('id', pickListId);

        return new Response(JSON.stringify({
          success: true,
          message: 'Picking completed successfully',
          itemsPicked: pickItems?.length || 0
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'auto_pack_orders': {
        const { fulfillmentCenterId, packerId } = data;

        // Get picked orders ready for packing
        const { data: readyToPack } = await supabaseClient
          .from('order_fulfillment')
          .select(`
            *,
            orders (total_amount, shipping_address)
          `)
          .eq('fulfillment_center_id', fulfillmentCenterId)
          .eq('status', 'picked')
          .limit(10);

        if (!readyToPack?.length) {
          return new Response(JSON.stringify({
            success: true,
            message: 'No orders ready for packing'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          });
        }

        // Auto-pack orders
        const packingResults = [];
        for (const fulfillment of readyToPack) {
          // Update to packing status
          await supabaseClient.functions.invoke('logistics-management', {
            body: {
              action: 'update_fulfillment_status',
              data: {
                fulfillmentId: fulfillment.id,
                status: 'packing'
              }
            }
          });

          // Simulate packing time
          await new Promise(resolve => setTimeout(resolve, 100));

          // Complete packing
          await supabaseClient.functions.invoke('logistics-management', {
            body: {
              action: 'update_fulfillment_status',
              data: {
                fulfillmentId: fulfillment.id,
                status: 'packed',
                notes: { packed_by: packerId, packed_at: new Date().toISOString() }
              }
            }
          });

          packingResults.push({
            orderId: fulfillment.order_id,
            fulfillmentId: fulfillment.id,
            status: 'packed'
          });
        }

        return new Response(JSON.stringify({
          success: true,
          message: `${packingResults.length} orders packed successfully`,
          results: packingResults
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'auto_ship_orders': {
        const { fulfillmentCenterId, shippingCarrier = 'Pathao' } = data;

        // Get packed orders ready for shipping
        const { data: readyToShip } = await supabaseClient
          .from('order_fulfillment')
          .select(`
            *,
            orders (
              total_amount, 
              shipping_address,
              customer_id
            )
          `)
          .eq('fulfillment_center_id', fulfillmentCenterId)
          .eq('status', 'packed')
          .limit(20);

        if (!readyToShip?.length) {
          return new Response(JSON.stringify({
            success: true,
            message: 'No orders ready for shipping'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          });
        }

        // Process shipments
        const shippingResults = [];
        for (const fulfillment of readyToShip) {
          // Generate tracking number
          const trackingNumber = `TRK${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

          // Update fulfillment with shipping info
          await supabaseClient
            .from('order_fulfillment')
            .update({
              status: 'shipped',
              tracking_number: trackingNumber,
              shipping_carrier: shippingCarrier,
              shipping_method: 'standard',
              shipping_cost: calculateShippingCost(fulfillment.orders.total_amount),
              shipped_at: new Date().toISOString(),
              notes: {
                ...fulfillment.notes,
                shipped_via: shippingCarrier,
                tracking_number: trackingNumber
              }
            })
            .eq('id', fulfillment.id);

          // Update order status
          await supabaseClient
            .from('orders')
            .update({
              status: 'shipped',
              tracking_number: trackingNumber,
              updated_at: new Date().toISOString()
            })
            .eq('id', fulfillment.order_id);

          shippingResults.push({
            orderId: fulfillment.order_id,
            trackingNumber,
            carrier: shippingCarrier,
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          });
        }

        return new Response(JSON.stringify({
          success: true,
          message: `${shippingResults.length} orders shipped successfully`,
          shipments: shippingResults
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'update_delivery_status': {
        const { trackingNumber, status, deliveredAt } = data;

        const { data: fulfillment } = await supabaseClient
          .from('order_fulfillment')
          .select('*')
          .eq('tracking_number', trackingNumber)
          .single();

        if (!fulfillment) {
          throw new Error('Shipment not found');
        }

        await supabaseClient
          .from('order_fulfillment')
          .update({
            status: status,
            delivered_at: status === 'delivered' ? deliveredAt || new Date().toISOString() : null
          })
          .eq('id', fulfillment.id);

        // Update order status
        await supabaseClient
          .from('orders')
          .update({
            status: status,
            delivered_at: status === 'delivered' ? deliveredAt || new Date().toISOString() : null
          })
          .eq('id', fulfillment.order_id);

        return new Response(JSON.stringify({
          success: true,
          message: `Delivery status updated to ${status}`,
          orderId: fulfillment.order_id
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'get_fulfillment_dashboard': {
        const { fulfillmentCenterId } = data;

        // Get dashboard stats
        const { data: stats } = await supabaseClient
          .from('order_fulfillment')
          .select('status')
          .eq('fulfillment_center_id', fulfillmentCenterId);

        const statusCounts = stats?.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {}) || {};

        // Get active pick lists
        const { data: pickLists } = await supabaseClient
          .from('pick_lists')
          .select('*')
          .eq('fulfillment_center_id', fulfillmentCenterId)
          .in('status', ['created', 'assigned', 'in_progress'])
          .order('created_at', { ascending: false });

        return new Response(JSON.stringify({
          success: true,
          dashboard: {
            fulfillmentCenterId,
            statusCounts,
            activePicks: pickLists?.length || 0,
            pickLists: pickLists || []
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('[FULFILLMENT] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

// Helper function to calculate shipping cost
function calculateShippingCost(orderAmount: number): number {
  if (orderAmount >= 1000) return 0; // Free shipping over 1000 BDT
  if (orderAmount >= 500) return 60;  // 60 BDT for orders 500-999
  return 100; // 100 BDT for orders under 500
}