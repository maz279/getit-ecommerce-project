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

    console.log(`[LOGISTICS] Processing action: ${action}`);

    switch (action) {
      case 'allocate_order': {
        const { orderId } = data;
        
        // Find optimal fulfillment center based on inventory and capacity
        const { data: orderItems } = await supabaseClient
          .from('order_items')
          .select('product_id, quantity')
          .eq('order_id', orderId);

        if (!orderItems?.length) {
          throw new Error('Order items not found');
        }

        // Check inventory availability across fulfillment centers
        const { data: inventoryData } = await supabaseClient
          .from('inventory')
          .select(`
            *,
            fulfillment_centers (
              id,
              name,
              current_utilization,
              capacity
            )
          `)
          .in('product_id', orderItems.map(item => item.product_id));

        // Find best fulfillment center (simple algorithm - can be enhanced)
        const fulfillmentCenterScore = {};
        
        inventoryData?.forEach(inv => {
          const centerId = inv.fulfillment_center_id;
          if (!fulfillmentCenterScore[centerId]) {
            fulfillmentCenterScore[centerId] = {
              center: inv.fulfillment_centers,
              availableItems: 0,
              totalItems: orderItems.length,
              utilizationScore: (inv.fulfillment_centers.capacity - inv.fulfillment_centers.current_utilization) / inv.fulfillment_centers.capacity
            };
          }
          
          const orderItem = orderItems.find(oi => oi.product_id === inv.product_id);
          if (orderItem && inv.available_stock >= orderItem.quantity) {
            fulfillmentCenterScore[centerId].availableItems++;
          }
        });

        // Select best center (highest availability + capacity)
        const bestCenter = Object.values(fulfillmentCenterScore)
          .sort((a: any, b: any) => {
            const aScore = (a.availableItems / a.totalItems) * 0.7 + a.utilizationScore * 0.3;
            const bScore = (b.availableItems / b.totalItems) * 0.7 + b.utilizationScore * 0.3;
            return bScore - aScore;
          })[0] as any;

        if (!bestCenter || bestCenter.availableItems < bestCenter.totalItems) {
          throw new Error('Insufficient inventory to fulfill order');
        }

        // Create order fulfillment record
        const { data: fulfillment } = await supabaseClient
          .from('order_fulfillment')
          .insert({
            order_id: orderId,
            fulfillment_center_id: bestCenter.center.id,
            status: 'allocated',
            priority_level: 'normal',
            allocated_at: new Date().toISOString()
          })
          .select()
          .single();

        // Reserve inventory
        for (const orderItem of orderItems) {
          await supabaseClient
            .from('inventory')
            .update({
              reserved_stock: supabaseClient.raw('reserved_stock + ?', [orderItem.quantity])
            })
            .eq('product_id', orderItem.product_id)
            .eq('fulfillment_center_id', bestCenter.center.id);

          // Log inventory movement
          await supabaseClient
            .from('inventory_movements')
            .insert({
              inventory_id: inventoryData.find(inv => 
                inv.product_id === orderItem.product_id && 
                inv.fulfillment_center_id === bestCenter.center.id
              )?.id,
              movement_type: 'outbound',
              quantity: -orderItem.quantity,
              reference_type: 'order',
              reference_id: orderId,
              reason: 'Order allocation'
            });
        }

        // Create workflow steps
        const workflowSteps = [
          { step_name: 'picking', step_order: 1, instructions: 'Pick items from storage locations' },
          { step_name: 'packing', step_order: 2, instructions: 'Pack items securely for shipping' },
          { step_name: 'shipping', step_order: 3, instructions: 'Generate shipping label and dispatch' }
        ];

        for (const step of workflowSteps) {
          await supabaseClient
            .from('fulfillment_workflow_steps')
            .insert({
              order_fulfillment_id: fulfillment.id,
              ...step
            });
        }

        return new Response(JSON.stringify({ 
          success: true, 
          fulfillment,
          message: `Order allocated to ${bestCenter.center.name}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'create_pick_list': {
        const { fulfillmentCenterId, orderIds } = data;

        // Create pick list
        const { data: pickList } = await supabaseClient
          .from('pick_lists')
          .insert({
            fulfillment_center_id: fulfillmentCenterId,
            status: 'created',
            total_items: 0
          })
          .select()
          .single();

        // Get order fulfillments for pick list
        const { data: fulfillments } = await supabaseClient
          .from('order_fulfillment')
          .select(`
            *,
            order_items (
              product_id,
              quantity,
              inventory (
                id,
                storage_location,
                sku
              )
            )
          `)
          .in('order_id', orderIds)
          .eq('fulfillment_center_id', fulfillmentCenterId)
          .eq('status', 'allocated');

        let totalItems = 0;
        let pickSequence = 1;

        // Create pick list items
        for (const fulfillment of fulfillments || []) {
          for (const item of fulfillment.order_items) {
            await supabaseClient
              .from('pick_list_items')
              .insert({
                pick_list_id: pickList.id,
                order_fulfillment_id: fulfillment.id,
                inventory_id: item.inventory.id,
                quantity_requested: item.quantity,
                storage_location: item.inventory.storage_location,
                pick_sequence: pickSequence++
              });
            totalItems++;
          }

          // Update fulfillment status
          await supabaseClient
            .from('order_fulfillment')
            .update({ status: 'picking' })
            .eq('id', fulfillment.id);
        }

        // Update pick list total
        await supabaseClient
          .from('pick_lists')
          .update({ total_items: totalItems })
          .eq('id', pickList.id);

        return new Response(JSON.stringify({ 
          success: true, 
          pickList,
          totalItems,
          message: 'Pick list created successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'update_fulfillment_status': {
        const { fulfillmentId, status, notes } = data;

        const updateData: any = { 
          status,
          updated_at: new Date().toISOString()
        };

        // Set timestamp based on status
        switch (status) {
          case 'picking':
            updateData.picking_started_at = new Date().toISOString();
            break;
          case 'picked':
            updateData.picked_at = new Date().toISOString();
            break;
          case 'packing':
            updateData.packing_started_at = new Date().toISOString();
            break;
          case 'packed':
            updateData.packed_at = new Date().toISOString();
            break;
          case 'shipped':
            updateData.shipped_at = new Date().toISOString();
            break;
          case 'delivered':
            updateData.delivered_at = new Date().toISOString();
            break;
        }

        if (notes) {
          updateData.notes = notes;
        }

        const { data: fulfillment } = await supabaseClient
          .from('order_fulfillment')
          .update(updateData)
          .eq('id', fulfillmentId)
          .select()
          .single();

        // Update corresponding workflow step
        await supabaseClient
          .from('fulfillment_workflow_steps')
          .update({
            status: status === 'picked' ? 'completed' : 
                   status === 'packed' ? 'completed' : 
                   status === 'shipped' ? 'completed' : 'in_progress',
            completed_at: ['picked', 'packed', 'shipped', 'delivered'].includes(status) 
              ? new Date().toISOString() : null
          })
          .eq('order_fulfillment_id', fulfillmentId)
          .eq('step_name', status.replace('ed', 'ing').replace('ped', 'ping'));

        return new Response(JSON.stringify({ 
          success: true, 
          fulfillment,
          message: `Fulfillment status updated to ${status}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('[LOGISTICS] Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});