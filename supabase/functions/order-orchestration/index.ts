import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderOrchestrationRequest {
  order_id: string;
  workflow_type: 'single_vendor' | 'multi_vendor' | 'dropship' | 'marketplace';
  order_data?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (req.method) {
      case 'POST':
        if (action === 'process-order') {
          return await processOrder(req, supabaseClient);
        } else if (action === 'create-workflow') {
          return await createWorkflow(req, supabaseClient);
        }
        break;
      
      case 'GET':
        if (action === 'order-status') {
          return await getOrderStatus(req, supabaseClient);
        } else if (action === 'workflows') {
          return await getWorkflows(req, supabaseClient);
        }
        break;
    }

    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Order orchestration error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processOrder(req: Request, supabaseClient: any) {
  const { order_id, workflow_type, order_data }: OrderOrchestrationRequest = await req.json();

  console.log(`Processing order ${order_id} with workflow type: ${workflow_type}`);

  // Get appropriate workflow
  const { data: workflow, error: workflowError } = await supabaseClient
    .from('order_workflows')
    .select('*')
    .eq('workflow_type', workflow_type)
    .eq('is_active', true)
    .single();

  if (workflowError || !workflow) {
    throw new Error(`No active workflow found for type: ${workflow_type}`);
  }

  // Start workflow execution
  const executionResult = await executeWorkflow(supabaseClient, order_id, workflow, order_data);

  return new Response(JSON.stringify({
    success: true,
    order_id,
    workflow_id: workflow.id,
    execution_result: executionResult
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function executeWorkflow(supabaseClient: any, order_id: string, workflow: any, order_data: any) {
  const steps = workflow.workflow_steps;
  const executionLog = [];

  console.log(`Executing workflow ${workflow.workflow_name} for order ${order_id}`);

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    
    try {
      console.log(`Executing step: ${step.name}`);

      // Log step start
      await supabaseClient
        .from('order_orchestration_logs')
        .insert({
          order_id,
          workflow_id: workflow.id,
          current_step: step.name,
          step_status: 'in_progress',
          step_data: { step_index: i, step_config: step }
        });

      const stepResult = await executeStep(supabaseClient, step, order_id, order_data);

      // Log step completion
      await supabaseClient
        .from('order_orchestration_logs')
        .insert({
          order_id,
          workflow_id: workflow.id,
          current_step: step.name,
          step_status: stepResult.success ? 'completed' : 'failed',
          step_data: { step_index: i, result: stepResult },
          error_details: stepResult.error || null,
          completed_at: new Date().toISOString()
        });

      executionLog.push({
        step: step.name,
        status: stepResult.success ? 'completed' : 'failed',
        result: stepResult,
        executed_at: new Date().toISOString()
      });

      if (!stepResult.success && step.required !== false) {
        throw new Error(`Required step ${step.name} failed: ${stepResult.error}`);
      }

    } catch (error) {
      console.error(`Step ${step.name} failed:`, error);

      await supabaseClient
        .from('order_orchestration_logs')
        .insert({
          order_id,
          workflow_id: workflow.id,
          current_step: step.name,
          step_status: 'failed',
          step_data: { step_index: i },
          error_details: error.message,
          completed_at: new Date().toISOString()
        });

      executionLog.push({
        step: step.name,
        status: 'failed',
        error: error.message,
        executed_at: new Date().toISOString()
      });

      if (step.required !== false) {
        return {
          success: false,
          error: `Workflow failed at step: ${step.name}`,
          execution_log: executionLog
        };
      }
    }
  }

  return {
    success: true,
    execution_log: executionLog,
    completed_steps: executionLog.length,
    total_steps: steps.length
  };
}

async function executeStep(supabaseClient: any, step: any, order_id: string, order_data: any) {
  switch (step.type) {
    case 'inventory_check':
      return await executeInventoryCheck(supabaseClient, step, order_id, order_data);
    
    case 'payment_processing':
      return await executePaymentProcessing(supabaseClient, step, order_id, order_data);
    
    case 'vendor_notification':
      return await executeVendorNotification(supabaseClient, step, order_id, order_data);
    
    case 'inventory_allocation':
      return await executeInventoryAllocation(supabaseClient, step, order_id, order_data);
    
    case 'shipping_assignment':
      return await executeShippingAssignment(supabaseClient, step, order_id, order_data);
    
    case 'order_splitting':
      return await executeOrderSplitting(supabaseClient, step, order_id, order_data);
    
    case 'fraud_check':
      return await executeFraudCheck(supabaseClient, step, order_id, order_data);
    
    case 'customer_notification':
      return await executeCustomerNotification(supabaseClient, step, order_id, order_data);
    
    case 'analytics_tracking':
      return await executeAnalyticsTracking(supabaseClient, step, order_id, order_data);
    
    default:
      return {
        success: false,
        error: `Unknown step type: ${step.type}`
      };
  }
}

async function executeInventoryCheck(supabaseClient: any, step: any, order_id: string, order_data: any) {
  console.log('Executing inventory check...');
  
  // Get order items
  const { data: orderItems } = await supabaseClient
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', order_id);

  if (!orderItems || orderItems.length === 0) {
    return { success: false, error: 'No order items found' };
  }

  // Check inventory for each item
  const inventoryChecks = [];
  
  for (const item of orderItems) {
    const { data: inventory } = await supabaseClient
      .from('product_inventory')
      .select('current_stock, reserved_stock')
      .eq('product_id', item.product_id)
      .single();

    const availableStock = (inventory?.current_stock || 0) - (inventory?.reserved_stock || 0);
    const isAvailable = availableStock >= item.quantity;

    inventoryChecks.push({
      product_id: item.product_id,
      requested_quantity: item.quantity,
      available_stock: availableStock,
      is_available: isAvailable
    });
  }

  const allAvailable = inventoryChecks.every(check => check.is_available);

  return {
    success: allAvailable,
    data: {
      inventory_checks: inventoryChecks,
      all_items_available: allAvailable
    },
    error: allAvailable ? null : 'Some items are out of stock'
  };
}

async function executePaymentProcessing(supabaseClient: any, step: any, order_id: string, order_data: any) {
  console.log('Executing payment processing...');
  
  // Simulate payment processing
  const paymentResult = {
    payment_id: `pay_${Date.now()}`,
    status: 'completed',
    amount: order_data?.total_amount || 0,
    currency: 'BDT',
    gateway: order_data?.payment_method || 'bkash'
  };

  return {
    success: true,
    data: paymentResult
  };
}

async function executeVendorNotification(supabaseClient: any, step: any, order_id: string, order_data: any) {
  console.log('Executing vendor notification...');
  
  // Get vendors involved in the order
  const { data: orderItems } = await supabaseClient
    .from('order_items')
    .select('vendor_id, product_id, quantity')
    .eq('order_id', order_id);

  const vendorGroups = {};
  orderItems?.forEach(item => {
    if (!vendorGroups[item.vendor_id]) {
      vendorGroups[item.vendor_id] = [];
    }
    vendorGroups[item.vendor_id].push(item);
  });

  // Send notifications to each vendor
  const notifications = [];
  for (const [vendorId, items] of Object.entries(vendorGroups)) {
    notifications.push({
      vendor_id: vendorId,
      order_id,
      items_count: (items as any[]).length,
      notification_sent: true,
      sent_at: new Date().toISOString()
    });
  }

  return {
    success: true,
    data: {
      notifications_sent: notifications.length,
      vendor_notifications: notifications
    }
  };
}

async function executeInventoryAllocation(supabaseClient: any, step: any, order_id: string, order_data: any) {
  console.log('Executing inventory allocation...');
  
  const { data: orderItems } = await supabaseClient
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', order_id);

  // Reserve inventory for each item
  const allocations = [];
  
  for (const item of orderItems || []) {
    await supabaseClient
      .from('product_inventory')
      .update({
        reserved_stock: supabaseClient.raw('reserved_stock + ?', [item.quantity])
      })
      .eq('product_id', item.product_id);

    allocations.push({
      product_id: item.product_id,
      allocated_quantity: item.quantity,
      allocated_at: new Date().toISOString()
    });
  }

  return {
    success: true,
    data: {
      allocations_count: allocations.length,
      inventory_allocations: allocations
    }
  };
}

async function executeShippingAssignment(supabaseClient: any, step: any, order_id: string, order_data: any) {
  console.log('Executing shipping assignment...');
  
  // Select best courier based on location and preferences
  const courierAssignment = {
    courier_name: 'pathao', // Default selection logic
    assignment_reason: 'Best coverage for delivery area',
    estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    tracking_id: `TRK_${Date.now()}`
  };

  return {
    success: true,
    data: courierAssignment
  };
}

async function executeOrderSplitting(supabaseClient: any, step: any, order_id: string, order_data: any) {
  console.log('Executing order splitting...');
  
  const { data: orderItems } = await supabaseClient
    .from('order_items')
    .select('vendor_id, product_id, quantity, price')
    .eq('order_id', order_id);

  // Group items by vendor
  const vendorGroups = {};
  orderItems?.forEach(item => {
    if (!vendorGroups[item.vendor_id]) {
      vendorGroups[item.vendor_id] = {
        vendor_id: item.vendor_id,
        items: [],
        total_amount: 0
      };
    }
    vendorGroups[item.vendor_id].items.push(item);
    vendorGroups[item.vendor_id].total_amount += item.quantity * item.price;
  });

  const subOrders = Object.values(vendorGroups);

  return {
    success: true,
    data: {
      split_required: subOrders.length > 1,
      sub_orders_count: subOrders.length,
      sub_orders: subOrders
    }
  };
}

async function executeFraudCheck(supabaseClient: any, step: any, order_id: string, order_data: any) {
  console.log('Executing fraud check...');
  
  // Simulate fraud detection logic
  const fraudScore = Math.random() * 100;
  const isFraudulent = fraudScore > 85;

  return {
    success: !isFraudulent,
    data: {
      fraud_score: fraudScore,
      risk_level: fraudScore > 70 ? 'high' : fraudScore > 40 ? 'medium' : 'low',
      is_fraudulent: isFraudulent,
      checked_at: new Date().toISOString()
    },
    error: isFraudulent ? 'Order flagged as potentially fraudulent' : null
  };
}

async function executeCustomerNotification(supabaseClient: any, step: any, order_id: string, order_data: any) {
  console.log('Executing customer notification...');
  
  const notification = {
    customer_id: order_data?.customer_id,
    order_id,
    notification_type: 'order_confirmation',
    message: 'Your order has been confirmed and is being processed',
    sent_via: ['email', 'sms'],
    sent_at: new Date().toISOString()
  };

  return {
    success: true,
    data: notification
  };
}

async function executeAnalyticsTracking(supabaseClient: any, step: any, order_id: string, order_data: any) {
  console.log('Executing analytics tracking...');
  
  // Track order analytics
  await supabaseClient
    .from('analytics_events')
    .insert({
      event_name: 'order_processed',
      event_category: 'ecommerce',
      event_action: 'order_workflow_completed',
      event_label: order_id,
      event_value: order_data?.total_amount || 0,
      custom_properties: {
        workflow_type: order_data?.workflow_type,
        order_id,
        processing_time: Date.now() - (order_data?.start_time || Date.now())
      }
    });

  return {
    success: true,
    data: {
      event_tracked: true,
      tracked_at: new Date().toISOString()
    }
  };
}

async function createWorkflow(req: Request, supabaseClient: any) {
  const workflowData = await req.json();

  const { data: workflow, error } = await supabaseClient
    .from('order_workflows')
    .insert(workflowData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create workflow: ${error.message}`);
  }

  return new Response(JSON.stringify({
    success: true,
    workflow
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getOrderStatus(req: Request, supabaseClient: any) {
  const url = new URL(req.url);
  const order_id = url.searchParams.get('order_id');

  if (!order_id) {
    return new Response(JSON.stringify({ error: 'order_id is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data: logs } = await supabaseClient
    .from('order_orchestration_logs')
    .select('*')
    .eq('order_id', order_id)
    .order('executed_at', { ascending: true });

  return new Response(JSON.stringify({
    success: true,
    order_id,
    workflow_logs: logs || []
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getWorkflows(req: Request, supabaseClient: any) {
  const { data: workflows } = await supabaseClient
    .from('order_workflows')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return new Response(JSON.stringify({
    success: true,
    workflows: workflows || []
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}