import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Bangladesh Courier Partners Configuration
const COURIER_CONFIGS = {
  pathao: {
    baseUrl: 'https://api.pathao.com/v1',
    apiKey: 'PATHAO_API_KEY',
    services: ['same_day', 'next_day', 'standard'],
    codSupported: true,
    coverage: ['dhaka', 'chittagong', 'sylhet', 'rajshahi']
  },
  paperfly: {
    baseUrl: 'https://api.paperfly.com.bd/v1',
    apiKey: 'PAPERFLY_API_KEY',
    services: ['express', 'standard', 'economy'],
    codSupported: true,
    coverage: ['nationwide']
  },
  redx: {
    baseUrl: 'https://redx.com.bd/api/v1',
    apiKey: 'REDX_API_KEY',
    services: ['express', 'standard'],
    codSupported: true,
    coverage: ['dhaka', 'chittagong', 'major_cities']
  },
  ecourier: {
    baseUrl: 'https://api.ecourier.com.bd/v1',
    apiKey: 'ECOURIER_API_KEY',
    services: ['express', 'standard', 'bulk'],
    codSupported: true,
    coverage: ['nationwide']
  },
  sundarban: {
    baseUrl: 'https://api.sundarban.com/v1',
    apiKey: 'SUNDARBAN_API_KEY',
    services: ['economy', 'standard'],
    codSupported: true,
    coverage: ['rural', 'remote_areas']
  }
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
      case 'create_shipment':
        return await createShipment(data, supabaseClient);
      case 'calculate_rates':
        return await calculateShippingRates(data, supabaseClient);
      case 'track_shipment':
        return await trackShipment(data, supabaseClient);
      case 'schedule_pickup':
        return await schedulePickup(data, supabaseClient);
      case 'process_cod':
        return await processCOD(data, supabaseClient);
      case 'get_delivery_options':
        return await getDeliveryOptions(data, supabaseClient);
      case 'bulk_ship':
        return await bulkShipment(data, supabaseClient);
      case 'update_tracking':
        return await updateTracking(data, supabaseClient);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Shipping orchestrator error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function createShipment(data: any, supabaseClient: any) {
  const { 
    order_id, 
    vendor_id, 
    pickup_address, 
    delivery_address, 
    package_details, 
    service_type = 'standard',
    preferred_courier,
    cod_amount = 0
  } = data;

  // Generate shipment number
  const shipment_number = `SH${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  // Find best courier if not specified
  let courier_partner = preferred_courier;
  if (!courier_partner) {
    courier_partner = await findBestCourier(pickup_address, delivery_address, package_details, service_type);
  }

  // Get courier configuration
  const { data: courierConfig, error: courierError } = await supabaseClient
    .from('bd_courier_partners')
    .select('*')
    .eq('courier_name', courier_partner)
    .eq('is_active', true)
    .single();

  if (courierError || !courierConfig) {
    throw new Error(`Courier ${courier_partner} not available`);
  }

  // Calculate shipping cost
  const shippingRate = await calculateCourierRate(courier_partner, pickup_address, delivery_address, package_details);

  // Create shipment in shipping_service_shipments table
  const { data: shipment, error: shipmentError } = await supabaseClient
    .from('shipping_service_shipments')
    .insert({
      shipment_number,
      order_id,
      partner_id: courierConfig.id,
      origin_address: pickup_address,
      destination_address: delivery_address,
      package_details: {
        ...package_details,
        service_type,
        cod_amount
      },
      shipping_cost: shippingRate.cost,
      estimated_delivery: shippingRate.estimated_delivery,
      status: 'created'
    })
    .select()
    .single();

  if (shipmentError) {
    throw new Error(`Failed to create shipment: ${shipmentError.message}`);
  }

  // Create courier shipment
  const courierShipment = await createCourierShipment(courier_partner, {
    order_id,
    pickup_address,
    delivery_address,
    package_details: {
      ...package_details,
      cod_amount
    },
    service_type
  });

  // Update with tracking number
  await supabaseClient
    .from('shipping_service_shipments')
    .update({
      tracking_number: courierShipment.tracking_id,
      tracking_events: [
        {
          status: 'created',
          timestamp: new Date().toISOString(),
          location: pickup_address.city,
          description: 'Shipment created and assigned to courier'
        }
      ]
    })
    .eq('id', shipment.id);

  // Log shipping event
  await supabaseClient
    .from('shipping_events')
    .insert({
      shipment_id: shipment.id,
      event_type: 'shipment_created',
      event_description: `Shipment created with ${courier_partner}`,
      source: 'shipping_orchestrator',
      data: {
        courier: courier_partner,
        tracking_id: courierShipment.tracking_id,
        service_type
      }
    });

  return new Response(JSON.stringify({
    success: true,
    shipment: {
      ...shipment,
      tracking_number: courierShipment.tracking_id,
      courier: courier_partner
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function calculateShippingRates(data: any, supabaseClient: any) {
  const { pickup_address, delivery_address, package_details, service_types = ['standard'] } = data;

  const rates = [];

  // Get all active couriers
  const { data: couriers } = await supabaseClient
    .from('bd_courier_partners')
    .select('*')
    .eq('is_active', true);

  for (const courier of couriers) {
    for (const service_type of service_types) {
      try {
        const rate = await calculateCourierRate(courier.courier_name, pickup_address, delivery_address, {
          ...package_details,
          service_type
        });
        
        rates.push({
          courier: courier.courier_name,
          service_type,
          cost: rate.cost,
          currency: 'BDT',
          estimated_delivery: rate.estimated_delivery,
          delivery_time_hours: rate.delivery_time_hours,
          cod_available: COURIER_CONFIGS[courier.courier_name]?.codSupported || false
        });
      } catch (error) {
        console.error(`Rate calculation failed for ${courier.courier_name}:`, error);
      }
    }
  }

  // Sort by cost
  rates.sort((a, b) => a.cost - b.cost);

  return new Response(JSON.stringify({
    success: true,
    rates,
    pickup_zones: await getAvailableZones(pickup_address),
    delivery_zones: await getAvailableZones(delivery_address)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function trackShipment(data: any, supabaseClient: any) {
  const { tracking_number, shipment_id } = data;

  let shipment;
  if (tracking_number) {
    const { data, error } = await supabaseClient
      .from('shipping_service_shipments')
      .select('*, shipping_service_partners(*)')
      .eq('tracking_number', tracking_number)
      .single();
    
    if (error) throw new Error('Shipment not found');
    shipment = data;
  } else if (shipment_id) {
    const { data, error } = await supabaseClient
      .from('shipping_service_shipments')
      .select('*, shipping_service_partners(*)')
      .eq('id', shipment_id)
      .single();
    
    if (error) throw new Error('Shipment not found');
    shipment = data;
  } else {
    throw new Error('Tracking number or shipment ID required');
  }

  // Get latest tracking from courier
  const courierTracking = await getCourierTracking(
    shipment.shipping_service_partners.partner_code,
    shipment.tracking_number
  );

  // Update tracking events if new information available
  if (courierTracking.events && courierTracking.events.length > 0) {
    const updatedEvents = [...shipment.tracking_events, ...courierTracking.events];
    
    await supabaseClient
      .from('shipping_service_shipments')
      .update({
        status: courierTracking.status,
        tracking_events: updatedEvents,
        actual_delivery: courierTracking.delivered_at
      })
      .eq('id', shipment.id);
  }

  return new Response(JSON.stringify({
    success: true,
    tracking: {
      tracking_number: shipment.tracking_number,
      status: courierTracking.status || shipment.status,
      current_location: courierTracking.current_location,
      events: courierTracking.events || shipment.tracking_events,
      estimated_delivery: shipment.estimated_delivery,
      actual_delivery: courierTracking.delivered_at
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function schedulePickup(data: any, supabaseClient: any) {
  const { shipment_id, preferred_date, preferred_time_slot, special_instructions } = data;

  // Get shipment details
  const { data: shipment, error } = await supabaseClient
    .from('shipping_service_shipments')
    .select('*, shipping_service_partners(*)')
    .eq('id', shipment_id)
    .single();

  if (error) throw new Error('Shipment not found');

  // Schedule with courier
  const pickupResponse = await scheduleCourierPickup(
    shipment.shipping_service_partners.partner_code,
    {
      tracking_number: shipment.tracking_number,
      pickup_address: shipment.origin_address,
      preferred_date,
      preferred_time_slot,
      special_instructions
    }
  );

  // Update shipment
  await supabaseClient
    .from('shipping_service_shipments')
    .update({
      tracking_events: [
        ...shipment.tracking_events,
        {
          status: 'pickup_scheduled',
          timestamp: new Date().toISOString(),
          description: `Pickup scheduled for ${preferred_date} ${preferred_time_slot}`,
          data: pickupResponse
        }
      ]
    })
    .eq('id', shipment_id);

  return new Response(JSON.stringify({
    success: true,
    pickup: pickupResponse
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function processCOD(data: any, supabaseClient: any) {
  const { shipment_id, collection_amount, collection_method, vendor_id } = data;

  // Record COD transaction
  const { data: codTransaction, error } = await supabaseClient
    .from('cod_transactions')
    .insert({
      shipment_id,
      order_id: data.order_id,
      vendor_id,
      amount: collection_amount,
      collection_status: 'collected',
      collection_date: new Date().toISOString().split('T')[0],
      settlement_status: 'pending',
      commission: collection_amount * 0.02, // 2% commission
      metadata: {
        collection_method,
        collected_at: new Date().toISOString()
      }
    })
    .select()
    .single();

  if (error) throw new Error(`COD processing failed: ${error.message}`);

  return new Response(JSON.stringify({
    success: true,
    cod_transaction: codTransaction
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getDeliveryOptions(data: any, supabaseClient: any) {
  const { pickup_address, delivery_address } = data;

  // Get delivery zones
  const { data: zones } = await supabaseClient
    .from('bangladesh_shipping_zones')
    .select('*')
    .ilike('zone_name', `%${delivery_address.city || delivery_address.district}%`);

  const deliveryOptions = [];

  // Same day delivery (if in metro areas)
  if (zones?.some(z => z.zone_type === 'metro' && z.is_same_day_available)) {
    deliveryOptions.push({
      type: 'same_day',
      name: 'Same Day Delivery',
      description: 'Delivery within 6-8 hours',
      time_slots: [
        '10:00 AM - 2:00 PM',
        '2:00 PM - 6:00 PM',
        '6:00 PM - 10:00 PM'
      ],
      additional_cost: 200
    });
  }

  // Next day delivery
  deliveryOptions.push({
    type: 'next_day',
    name: 'Next Day Delivery',
    description: 'Delivery by next business day',
    time_slots: [
      '9:00 AM - 1:00 PM',
      '1:00 PM - 6:00 PM'
    ],
    additional_cost: 100
  });

  // Standard delivery
  deliveryOptions.push({
    type: 'standard',
    name: 'Standard Delivery',
    description: '2-5 business days',
    time_slots: [
      'Morning (9:00 AM - 1:00 PM)',
      'Afternoon (1:00 PM - 6:00 PM)'
    ],
    additional_cost: 0
  });

  return new Response(JSON.stringify({
    success: true,
    delivery_options: deliveryOptions,
    pickup_points: await getNearbyPickupPoints(delivery_address)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function bulkShipment(data: any, supabaseClient: any) {
  const { shipments, vendor_id } = data;
  const results = [];

  for (const shipmentData of shipments) {
    try {
      const result = await createShipment({
        ...shipmentData,
        vendor_id
      }, supabaseClient);
      
      const resultData = await result.json();
      results.push({
        order_id: shipmentData.order_id,
        success: true,
        shipment: resultData.shipment
      });
    } catch (error) {
      results.push({
        order_id: shipmentData.order_id,
        success: false,
        error: error.message
      });
    }
  }

  return new Response(JSON.stringify({
    success: true,
    results,
    total_processed: shipments.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function updateTracking(data: any, supabaseClient: any) {
  const { tracking_number, status, location, timestamp, notes } = data;

  // Find shipment
  const { data: shipment, error } = await supabaseClient
    .from('shipping_service_shipments')
    .select('*')
    .eq('tracking_number', tracking_number)
    .single();

  if (error) throw new Error('Shipment not found');

  // Add tracking event
  const newEvent = {
    status,
    location,
    timestamp: timestamp || new Date().toISOString(),
    description: notes || `Status updated to ${status}`,
    source: 'courier_webhook'
  };

  await supabaseClient
    .from('shipping_service_shipments')
    .update({
      status,
      tracking_events: [...shipment.tracking_events, newEvent],
      updated_at: new Date().toISOString()
    })
    .eq('tracking_number', tracking_number);

  return new Response(JSON.stringify({
    success: true,
    message: 'Tracking updated successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Helper functions
async function findBestCourier(pickup_address: any, delivery_address: any, package_details: any, service_type: string) {
  // Logic to find best courier based on:
  // 1. Coverage area
  // 2. Service type availability
  // 3. Cost
  // 4. Delivery time
  // 5. Reliability score
  
  const pickupCity = pickup_address.city?.toLowerCase();
  const deliveryCity = delivery_address.city?.toLowerCase();
  
  // Pathao for Dhaka same-day
  if (pickupCity === 'dhaka' && deliveryCity === 'dhaka' && service_type === 'same_day') {
    return 'pathao';
  }
  
  // Paperfly for nationwide
  if (service_type === 'standard') {
    return 'paperfly';
  }
  
  // RedX for express in major cities
  if (service_type === 'express' && ['dhaka', 'chittagong', 'sylhet'].includes(deliveryCity)) {
    return 'redx';
  }
  
  // Default to eCourier
  return 'ecourier';
}

async function calculateCourierRate(courier: string, pickup_address: any, delivery_address: any, package_details: any) {
  // Mock rate calculation - in production, integrate with actual courier APIs
  const baseCosts = {
    pathao: 80,
    paperfly: 60,
    redx: 90,
    ecourier: 70,
    sundarban: 50
  };
  
  const serviceCosts = {
    same_day: 2.0,
    express: 1.5,
    standard: 1.0,
    economy: 0.8
  };
  
  const weight = package_details.weight || 1;
  const service_type = package_details.service_type || 'standard';
  
  const baseCost = baseCosts[courier] || 60;
  const serviceMultiplier = serviceCosts[service_type] || 1.0;
  const weightCost = weight > 1 ? (weight - 1) * 20 : 0;
  
  const totalCost = Math.round((baseCost + weightCost) * serviceMultiplier);
  
  // Calculate delivery time
  const deliveryHours = {
    same_day: 8,
    express: 24,
    standard: 72,
    economy: 120
  };
  
  const estimatedDelivery = new Date();
  estimatedDelivery.setHours(estimatedDelivery.getHours() + (deliveryHours[service_type] || 72));
  
  return {
    cost: totalCost,
    estimated_delivery: estimatedDelivery.toISOString(),
    delivery_time_hours: deliveryHours[service_type] || 72
  };
}

async function createCourierShipment(courier: string, shipmentData: any) {
  // Mock courier API integration
  const tracking_id = `${courier.toUpperCase()}${Date.now()}`;
  
  return {
    success: true,
    tracking_id,
    pickup_confirmation: `Pickup scheduled for ${courier}`,
    estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
  };
}

async function getCourierTracking(courier: string, tracking_number: string) {
  // Mock tracking API integration
  return {
    status: 'in_transit',
    current_location: 'Dhaka Hub',
    events: [],
    delivered_at: null
  };
}

async function scheduleCourierPickup(courier: string, pickupData: any) {
  // Mock pickup scheduling
  return {
    pickup_id: `PU${Date.now()}`,
    scheduled_date: pickupData.preferred_date,
    scheduled_time: pickupData.preferred_time_slot,
    status: 'scheduled'
  };
}

async function getAvailableZones(address: any) {
  // Mock zone detection
  return ['dhaka-metro', 'dhaka-suburban'];
}

async function getNearbyPickupPoints(address: any) {
  // Mock pickup points
  return [
    {
      id: 'pp1',
      name: 'Dhanmondi Pickup Point',
      address: 'House 45, Road 27, Dhanmondi, Dhaka',
      hours: '9:00 AM - 9:00 PM',
      distance_km: 2.5
    }
  ];
}