import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { action, data } = await req.json();

    switch (action) {
      case 'track_by_number':
        return await trackByNumber(data, supabaseClient);
      case 'track_by_order':
        return await trackByOrder(data, supabaseClient);
      case 'bulk_track':
        return await bulkTrack(data, supabaseClient);
      case 'get_delivery_status':
        return await getDeliveryStatus(data, supabaseClient);
      case 'update_location':
        return await updateLocation(data, supabaseClient);
      case 'delivery_attempt':
        return await recordDeliveryAttempt(data, supabaseClient);
      case 'delivery_confirmation':
        return await confirmDelivery(data, supabaseClient);
      case 'webhook_update':
        return await processWebhookUpdate(data, supabaseClient);
      case 'real_time_tracking':
        return await getRealTimeTracking(data, supabaseClient);
      case 'tracking_analytics':
        return await getTrackingAnalytics(data, supabaseClient);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Tracking service error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function trackByNumber(data: any, supabaseClient: any) {
  const { tracking_number } = data;

  // Get shipment from shipping_service_shipments
  const { data: shipment, error } = await supabaseClient
    .from('shipping_service_shipments')
    .select(`
      *,
      shipping_service_partners(*)
    `)
    .eq('tracking_number', tracking_number)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: 'Tracking number not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Get latest tracking updates from courier
  const courierTracking = await fetchCourierTracking(
    shipment.shipping_service_partners.partner_code,
    tracking_number
  );

  // Merge with existing tracking events
  const allEvents = [...shipment.tracking_events, ...courierTracking.events];
  
  // Remove duplicates and sort by timestamp
  const uniqueEvents = allEvents.filter((event, index, self) => 
    index === self.findIndex(e => e.timestamp === event.timestamp && e.status === event.status)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Update shipment with latest tracking data
  if (courierTracking.events.length > 0) {
    await supabaseClient
      .from('shipping_service_shipments')
      .update({
        status: courierTracking.current_status || shipment.status,
        tracking_events: uniqueEvents,
        actual_delivery: courierTracking.delivered_at,
        updated_at: new Date().toISOString()
      })
      .eq('id', shipment.id);
  }

  // Calculate progress percentage
  const progress = calculateDeliveryProgress(uniqueEvents);

  // Get estimated delivery window
  const deliveryEstimate = calculateDeliveryEstimate(shipment, uniqueEvents);

  return new Response(JSON.stringify({
    success: true,
    tracking: {
      tracking_number,
      shipment_number: shipment.shipment_number,
      order_id: shipment.order_id,
      courier: shipment.shipping_service_partners.partner_name,
      current_status: courierTracking.current_status || shipment.status,
      current_location: courierTracking.current_location,
      progress_percentage: progress,
      estimated_delivery: deliveryEstimate,
      actual_delivery: courierTracking.delivered_at,
      events: uniqueEvents,
      delivery_attempts: await getDeliveryAttempts(shipment.id, supabaseClient),
      package_details: shipment.package_details,
      origin: shipment.origin_address,
      destination: shipment.destination_address,
      next_update_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // Next update in 30 mins
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function trackByOrder(data: any, supabaseClient: any) {
  const { order_id, user_id } = data;

  // Get all shipments for the order
  const { data: shipments, error } = await supabaseClient
    .from('shipping_service_shipments')
    .select(`
      *,
      shipping_service_partners(*)
    `)
    .eq('order_id', order_id);

  if (error || !shipments.length) {
    return new Response(JSON.stringify({ error: 'No shipments found for this order' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const trackingResults = [];

  for (const shipment of shipments) {
    const courierTracking = await fetchCourierTracking(
      shipment.shipping_service_partners.partner_code,
      shipment.tracking_number
    );

    trackingResults.push({
      shipment_id: shipment.id,
      tracking_number: shipment.tracking_number,
      courier: shipment.shipping_service_partners.partner_name,
      status: courierTracking.current_status || shipment.status,
      current_location: courierTracking.current_location,
      progress: calculateDeliveryProgress(shipment.tracking_events),
      estimated_delivery: shipment.estimated_delivery,
      events: shipment.tracking_events
    });
  }

  // Calculate overall order status
  const overallStatus = calculateOverallOrderStatus(trackingResults);

  return new Response(JSON.stringify({
    success: true,
    order_tracking: {
      order_id,
      overall_status: overallStatus,
      shipments: trackingResults,
      total_packages: shipments.length,
      delivered_packages: trackingResults.filter(s => s.status === 'delivered').length
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function bulkTrack(data: any, supabaseClient: any) {
  const { tracking_numbers } = data;
  const results = [];

  for (const tracking_number of tracking_numbers) {
    try {
      const trackingResult = await trackByNumber({ tracking_number }, supabaseClient);
      const trackingData = await trackingResult.json();
      results.push({
        tracking_number,
        success: true,
        data: trackingData.tracking
      });
    } catch (error) {
      results.push({
        tracking_number,
        success: false,
        error: error.message
      });
    }
  }

  return new Response(JSON.stringify({
    success: true,
    results,
    total_tracked: tracking_numbers.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getDeliveryStatus(data: any, supabaseClient: any) {
  const { area, date_range } = data;

  // Get delivery statistics for the area
  const { data: deliveries } = await supabaseClient
    .from('shipping_service_shipments')
    .select('status, created_at, estimated_delivery, actual_delivery')
    .like('destination_address->city', `%${area}%`)
    .gte('created_at', date_range.start)
    .lte('created_at', date_range.end);

  const stats = {
    total_deliveries: deliveries?.length || 0,
    delivered: deliveries?.filter(d => d.status === 'delivered').length || 0,
    in_transit: deliveries?.filter(d => ['picked_up', 'in_transit', 'out_for_delivery'].includes(d.status)).length || 0,
    pending: deliveries?.filter(d => d.status === 'created').length || 0,
    failed: deliveries?.filter(d => d.status === 'failed').length || 0
  };

  return new Response(JSON.stringify({
    success: true,
    area,
    date_range,
    statistics: stats,
    delivery_rate: stats.total_deliveries > 0 ? (stats.delivered / stats.total_deliveries * 100).toFixed(2) : 0
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function updateLocation(data: any, supabaseClient: any) {
  const { tracking_number, location, coordinates, timestamp, status } = data;

  // Find shipment
  const { data: shipment, error } = await supabaseClient
    .from('shipping_service_shipments')
    .select('*')
    .eq('tracking_number', tracking_number)
    .single();

  if (error) throw new Error('Shipment not found');

  // Add new tracking event
  const newEvent = {
    status: status || 'location_update',
    location,
    coordinates,
    timestamp: timestamp || new Date().toISOString(),
    description: `Location updated: ${location}`,
    source: 'gps_tracking'
  };

  const updatedEvents = [...shipment.tracking_events, newEvent];

  await supabaseClient
    .from('shipping_service_shipments')
    .update({
      tracking_events: updatedEvents,
      updated_at: new Date().toISOString()
    })
    .eq('tracking_number', tracking_number);

  // Broadcast real-time update
  await broadcastTrackingUpdate(tracking_number, newEvent, supabaseClient);

  return new Response(JSON.stringify({
    success: true,
    message: 'Location updated successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function recordDeliveryAttempt(data: any, supabaseClient: any) {
  const { 
    tracking_number, 
    attempt_number, 
    status, 
    failure_reason, 
    next_attempt_date,
    recipient_feedback,
    delivery_agent
  } = data;

  // Find shipment
  const { data: shipment, error } = await supabaseClient
    .from('shipping_service_shipments')
    .select('*')
    .eq('tracking_number', tracking_number)
    .single();

  if (error) throw new Error('Shipment not found');

  // Record delivery attempt
  const attemptData = {
    shipment_id: shipment.id,
    attempt_number,
    delivery_date: new Date().toISOString().split('T')[0],
    status,
    failure_reason,
    next_attempt_date,
    delivery_notes: recipient_feedback || '',
    location: shipment.destination_address,
    created_at: new Date().toISOString()
  };

  await supabaseClient
    .from('delivery_attempts')
    .insert(attemptData);

  // Update shipment tracking
  const newEvent = {
    status: status === 'successful' ? 'delivered' : 'delivery_attempted',
    timestamp: new Date().toISOString(),
    location: shipment.destination_address.city,
    description: status === 'successful' 
      ? 'Package delivered successfully' 
      : `Delivery attempt ${attempt_number} failed: ${failure_reason}`,
    attempt_number,
    delivery_agent
  };

  const updatedEvents = [...shipment.tracking_events, newEvent];

  await supabaseClient
    .from('shipping_service_shipments')
    .update({
      status: status === 'successful' ? 'delivered' : 'delivery_attempted',
      tracking_events: updatedEvents,
      actual_delivery: status === 'successful' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq('id', shipment.id);

  return new Response(JSON.stringify({
    success: true,
    delivery_attempt: attemptData,
    next_attempt_date: status !== 'successful' ? next_attempt_date : null
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function confirmDelivery(data: any, supabaseClient: any) {
  const { 
    tracking_number, 
    recipient_name, 
    signature, 
    delivery_photo, 
    delivery_time,
    otp_verified = false 
  } = data;

  // Find shipment
  const { data: shipment, error } = await supabaseClient
    .from('shipping_service_shipments')
    .select('*')
    .eq('tracking_number', tracking_number)
    .single();

  if (error) throw new Error('Shipment not found');

  // Record successful delivery
  const deliveryConfirmation = {
    shipment_id: shipment.id,
    attempt_number: 1, // Assuming this is the final successful attempt
    delivery_date: new Date().toISOString().split('T')[0],
    delivery_time_slot: delivery_time,
    status: 'delivered',
    recipient_name,
    signature_captured: signature,
    photo_proof: delivery_photo,
    location: shipment.destination_address,
    created_at: new Date().toISOString()
  };

  await supabaseClient
    .from('delivery_attempts')
    .insert(deliveryConfirmation);

  // Update shipment status
  const deliveryEvent = {
    status: 'delivered',
    timestamp: new Date().toISOString(),
    location: shipment.destination_address.city,
    description: `Package delivered to ${recipient_name}`,
    recipient_name,
    otp_verified,
    signature_captured: !!signature,
    photo_proof_captured: !!delivery_photo
  };

  const updatedEvents = [...shipment.tracking_events, deliveryEvent];

  await supabaseClient
    .from('shipping_service_shipments')
    .update({
      status: 'delivered',
      tracking_events: updatedEvents,
      actual_delivery: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', shipment.id);

  // Process COD if applicable
  if (shipment.package_details.cod_amount > 0) {
    await supabaseClient.functions.invoke('shipping-orchestrator', {
      body: {
        action: 'process_cod',
        shipment_id: shipment.id,
        collection_amount: shipment.package_details.cod_amount,
        collection_method: 'cash',
        order_id: shipment.order_id
      }
    });
  }

  // Send delivery notification
  await sendDeliveryNotification(shipment, recipient_name, supabaseClient);

  return new Response(JSON.stringify({
    success: true,
    message: 'Delivery confirmed successfully',
    delivery_confirmation: deliveryConfirmation
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function processWebhookUpdate(data: any, supabaseClient: any) {
  const { courier, webhook_data } = data;

  // Parse courier-specific webhook format
  const trackingUpdate = parseWebhookData(courier, webhook_data);

  if (!trackingUpdate.tracking_number) {
    throw new Error('Invalid webhook data: missing tracking number');
  }

  // Update shipment
  const { data: shipment, error } = await supabaseClient
    .from('shipping_service_shipments')
    .select('*')
    .eq('tracking_number', trackingUpdate.tracking_number)
    .single();

  if (error) {
    console.warn('Shipment not found for tracking number:', trackingUpdate.tracking_number);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Shipment not found' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Add webhook event to tracking
  const webhookEvent = {
    status: trackingUpdate.status,
    timestamp: trackingUpdate.timestamp || new Date().toISOString(),
    location: trackingUpdate.location,
    description: trackingUpdate.description,
    source: `${courier}_webhook`,
    webhook_data: webhook_data
  };

  const updatedEvents = [...shipment.tracking_events, webhookEvent];

  await supabaseClient
    .from('shipping_service_shipments')
    .update({
      status: trackingUpdate.status,
      tracking_events: updatedEvents,
      updated_at: new Date().toISOString()
    })
    .eq('tracking_number', trackingUpdate.tracking_number);

  return new Response(JSON.stringify({
    success: true,
    message: 'Webhook processed successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getRealTimeTracking(data: any, supabaseClient: any) {
  const { tracking_number } = data;

  // This would integrate with real-time tracking APIs
  // For now, return mock real-time data
  const realTimeData = {
    tracking_number,
    live_location: {
      latitude: 23.7461,
      longitude: 90.3760,
      accuracy: 10,
      timestamp: new Date().toISOString()
    },
    driver_info: {
      name: 'Mohammad Rahman',
      phone: '+8801712345678',
      vehicle: 'Motorcycle - Dhaka Metro Ka 12-3456'
    },
    eta_minutes: 25,
    current_address: 'Gulshan Avenue, Gulshan-1, Dhaka',
    next_checkpoint: 'Destination Address'
  };

  return new Response(JSON.stringify({
    success: true,
    real_time_tracking: realTimeData
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getTrackingAnalytics(data: any, supabaseClient: any) {
  const { date_range, courier_filter, region_filter } = data;

  // Get tracking analytics
  let query = supabaseClient
    .from('shipping_service_shipments')
    .select(`
      status,
      created_at,
      estimated_delivery,
      actual_delivery,
      shipping_service_partners(partner_name)
    `)
    .gte('created_at', date_range.start)
    .lte('created_at', date_range.end);

  if (courier_filter) {
    query = query.eq('shipping_service_partners.partner_name', courier_filter);
  }

  const { data: shipments } = await query;

  const analytics = {
    total_shipments: shipments?.length || 0,
    status_breakdown: calculateStatusBreakdown(shipments || []),
    courier_performance: calculateCourierPerformance(shipments || []),
    delivery_time_analysis: calculateDeliveryTimeAnalysis(shipments || []),
    regional_performance: calculateRegionalPerformance(shipments || [], region_filter)
  };

  return new Response(JSON.stringify({
    success: true,
    analytics,
    period: date_range
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Helper functions
async function fetchCourierTracking(courier: string, tracking_number: string) {
  // Mock courier API call - replace with actual courier integration
  return {
    current_status: 'in_transit',
    current_location: 'Dhaka Processing Center',
    events: [],
    delivered_at: null
  };
}

function calculateDeliveryProgress(events: any[]): number {
  const statusWeights = {
    'created': 10,
    'picked_up': 30,
    'in_transit': 60,
    'out_for_delivery': 85,
    'delivered': 100,
    'failed': 0
  };

  if (!events.length) return 0;

  const latestEvent = events[events.length - 1];
  return statusWeights[latestEvent.status] || 0;
}

function calculateDeliveryEstimate(shipment: any, events: any[]) {
  // Calculate updated delivery estimate based on current progress
  const originalEstimate = new Date(shipment.estimated_delivery);
  const now = new Date();

  if (events.some(e => e.status === 'delivered')) {
    return shipment.actual_delivery;
  }

  // Adjust estimate based on current progress and delays
  return originalEstimate.toISOString();
}

async function getDeliveryAttempts(shipment_id: string, supabaseClient: any) {
  const { data: attempts } = await supabaseClient
    .from('delivery_attempts')
    .select('*')
    .eq('shipment_id', shipment_id)
    .order('attempt_number', { ascending: true });

  return attempts || [];
}

function calculateOverallOrderStatus(shipments: any[]): string {
  if (shipments.every(s => s.status === 'delivered')) return 'delivered';
  if (shipments.some(s => s.status === 'failed')) return 'partially_failed';
  if (shipments.some(s => ['in_transit', 'out_for_delivery'].includes(s.status))) return 'in_transit';
  return 'processing';
}

async function broadcastTrackingUpdate(tracking_number: string, event: any, supabaseClient: any) {
  // Broadcast real-time update via Supabase realtime
  // This would be implemented using Supabase channels
  console.log('Broadcasting update for:', tracking_number, event);
}

function parseWebhookData(courier: string, webhook_data: any) {
  // Parse courier-specific webhook formats
  switch (courier) {
    case 'pathao':
      return {
        tracking_number: webhook_data.tracking_id,
        status: webhook_data.status,
        location: webhook_data.current_location,
        description: webhook_data.message,
        timestamp: webhook_data.timestamp
      };
    case 'paperfly':
      return {
        tracking_number: webhook_data.waybill,
        status: webhook_data.status_code,
        location: webhook_data.location,
        description: webhook_data.remarks,
        timestamp: webhook_data.updated_at
      };
    default:
      return {
        tracking_number: webhook_data.tracking_number || webhook_data.id,
        status: webhook_data.status,
        location: webhook_data.location,
        description: webhook_data.description || webhook_data.message,
        timestamp: webhook_data.timestamp || new Date().toISOString()
      };
  }
}

async function sendDeliveryNotification(shipment: any, recipient_name: string, supabaseClient: any) {
  // Send notification via notification service
  await supabaseClient.functions.invoke('notification-system', {
    body: {
      type: 'delivery_confirmation',
      recipient: shipment.destination_address.phone,
      data: {
        tracking_number: shipment.tracking_number,
        recipient_name,
        delivery_time: new Date().toISOString()
      }
    }
  });
}

function calculateStatusBreakdown(shipments: any[]) {
  const breakdown = {};
  shipments.forEach(shipment => {
    breakdown[shipment.status] = (breakdown[shipment.status] || 0) + 1;
  });
  return breakdown;
}

function calculateCourierPerformance(shipments: any[]) {
  const performance = {};
  shipments.forEach(shipment => {
    const courier = shipment.shipping_service_partners.partner_name;
    if (!performance[courier]) {
      performance[courier] = { total: 0, delivered: 0, on_time: 0 };
    }
    performance[courier].total++;
    if (shipment.status === 'delivered') {
      performance[courier].delivered++;
      if (new Date(shipment.actual_delivery) <= new Date(shipment.estimated_delivery)) {
        performance[courier].on_time++;
      }
    }
  });
  return performance;
}

function calculateDeliveryTimeAnalysis(shipments: any[]) {
  const deliveredShipments = shipments.filter(s => s.status === 'delivered' && s.actual_delivery);
  
  if (!deliveredShipments.length) return { average_hours: 0, on_time_percentage: 0 };

  const totalHours = deliveredShipments.reduce((sum, shipment) => {
    const created = new Date(shipment.created_at);
    const delivered = new Date(shipment.actual_delivery);
    return sum + (delivered.getTime() - created.getTime()) / (1000 * 60 * 60);
  }, 0);

  const onTimeCount = deliveredShipments.filter(shipment => 
    new Date(shipment.actual_delivery) <= new Date(shipment.estimated_delivery)
  ).length;

  return {
    average_hours: Math.round(totalHours / deliveredShipments.length),
    on_time_percentage: Math.round((onTimeCount / deliveredShipments.length) * 100)
  };
}

function calculateRegionalPerformance(shipments: any[], region_filter?: string) {
  // Mock regional performance calculation
  return {
    dhaka: { total: 150, delivered: 140, success_rate: 93.3 },
    chittagong: { total: 85, delivered: 80, success_rate: 94.1 },
    sylhet: { total: 45, delivered: 42, success_rate: 93.3 }
  };
}