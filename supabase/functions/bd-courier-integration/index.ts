import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShipmentRequest {
  courier: 'pathao' | 'paperfly' | 'redx' | 'ecourier' | 'sundarban';
  order_id: string;
  pickup_address: any;
  delivery_address: any;
  package_details: any;
  service_type?: string;
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
        if (action === 'create-shipment') {
          return await createShipment(req, supabaseClient);
        } else if (action === 'track-shipment') {
          return await trackShipment(req, supabaseClient);
        }
        break;
      
      case 'GET':
        if (action === 'pricing') {
          return await calculatePricing(req, supabaseClient);
        }
        break;
    }

    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Courier integration error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function createShipment(req: Request, supabaseClient: any) {
  const { courier, order_id, pickup_address, delivery_address, package_details, service_type }: ShipmentRequest = await req.json();

  console.log(`Creating shipment with ${courier} for order ${order_id}`);

  // Get courier configuration
  const { data: courierConfig, error: configError } = await supabaseClient
    .from('bd_courier_partners')
    .select('*')
    .eq('courier_name', courier)
    .eq('is_active', true)
    .single();

  if (configError || !courierConfig) {
    throw new Error(`Courier ${courier} not configured or inactive`);
  }

  let shipmentResponse;

  switch (courier) {
    case 'pathao':
      shipmentResponse = await createPathaoShipment(courierConfig, {
        order_id,
        pickup_address,
        delivery_address,
        package_details,
        service_type
      });
      break;
    
    case 'paperfly':
      shipmentResponse = await createPaperflyShipment(courierConfig, {
        order_id,
        pickup_address,
        delivery_address,
        package_details,
        service_type
      });
      break;
    
    case 'redx':
      shipmentResponse = await createRedXShipment(courierConfig, {
        order_id,
        pickup_address,
        delivery_address,
        package_details,
        service_type
      });
      break;
    
    case 'ecourier':
      shipmentResponse = await createECourierShipment(courierConfig, {
        order_id,
        pickup_address,
        delivery_address,
        package_details,
        service_type
      });
      break;
    
    case 'sundarban':
      shipmentResponse = await createSundarbanShipment(courierConfig, {
        order_id,
        pickup_address,
        delivery_address,
        package_details,
        service_type
      });
      break;
    
    default:
      throw new Error(`Unsupported courier: ${courier}`);
  }

  // Save shipment record
  const { data: shipment, error: insertError } = await supabaseClient
    .from('courier_shipments')
    .insert({
      order_id,
      courier_name: courier,
      tracking_id: shipmentResponse.tracking_id || '',
      pickup_address,
      delivery_address,
      package_details,
      status: shipmentResponse.success ? 'created' : 'failed',
      estimated_delivery: shipmentResponse.estimated_delivery,
      courier_response: shipmentResponse
    })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Failed to save shipment: ${insertError.message}`);
  }

  return new Response(JSON.stringify({
    success: shipmentResponse.success,
    shipment_id: shipment.id,
    tracking_id: shipmentResponse.tracking_id,
    estimated_delivery: shipmentResponse.estimated_delivery
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function trackShipment(req: Request, supabaseClient: any) {
  const { tracking_id } = await req.json();

  const { data: shipment, error } = await supabaseClient
    .from('courier_shipments')
    .select('*, bd_courier_partners(*)')
    .eq('tracking_id', tracking_id)
    .single();

  if (error || !shipment) {
    throw new Error('Shipment not found');
  }

  let trackingResponse;

  switch (shipment.courier_name) {
    case 'pathao':
      trackingResponse = await trackPathaoShipment(shipment.bd_courier_partners, tracking_id);
      break;
    case 'paperfly':
      trackingResponse = await trackPaperflyShipment(shipment.bd_courier_partners, tracking_id);
      break;
    case 'redx':
      trackingResponse = await trackRedXShipment(shipment.bd_courier_partners, tracking_id);
      break;
    case 'ecourier':
      trackingResponse = await trackECourierShipment(shipment.bd_courier_partners, tracking_id);
      break;
    case 'sundarban':
      trackingResponse = await trackSundarbanShipment(shipment.bd_courier_partners, tracking_id);
      break;
    default:
      throw new Error(`Unsupported courier: ${shipment.courier_name}`);
  }

  // Update shipment status
  await supabaseClient
    .from('courier_shipments')
    .update({
      status: trackingResponse.status,
      courier_response: trackingResponse,
      updated_at: new Date().toISOString()
    })
    .eq('id', shipment.id);

  return new Response(JSON.stringify(trackingResponse), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function calculatePricing(req: Request, supabaseClient: any) {
  const url = new URL(req.url);
  const courier = url.searchParams.get('courier');
  const pickup_zone = url.searchParams.get('pickup_zone');
  const delivery_zone = url.searchParams.get('delivery_zone');
  const weight = url.searchParams.get('weight');
  const service_type = url.searchParams.get('service_type');

  if (!courier || !pickup_zone || !delivery_zone || !weight) {
    return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data: courierConfig, error: configError } = await supabaseClient
    .from('bd_courier_partners')
    .select('*')
    .eq('courier_name', courier)
    .eq('is_active', true)
    .single();

  if (configError || !courierConfig) {
    throw new Error(`Courier ${courier} not configured or inactive`);
  }

  let pricingResponse;

  switch (courier) {
    case 'pathao':
      pricingResponse = await getPathaoPricing(courierConfig, { pickup_zone, delivery_zone, weight, service_type });
      break;
    case 'paperfly':
      pricingResponse = await getPaperflyPricing(courierConfig, { pickup_zone, delivery_zone, weight, service_type });
      break;
    case 'redx':
      pricingResponse = await getRedXPricing(courierConfig, { pickup_zone, delivery_zone, weight, service_type });
      break;
    case 'ecourier':
      pricingResponse = await getECourierPricing(courierConfig, { pickup_zone, delivery_zone, weight, service_type });
      break;
    case 'sundarban':
      pricingResponse = await getSundarbanPricing(courierConfig, { pickup_zone, delivery_zone, weight, service_type });
      break;
    default:
      throw new Error(`Unsupported courier: ${courier}`);
  }

  return new Response(JSON.stringify(pricingResponse), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Pathao Integration Functions
async function createPathaoShipment(config: any, shipmentData: any) {
  const { api_config } = config;
  
  try {
    const response = await fetch(`${api_config.base_url}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_config.access_token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        store_id: api_config.store_id,
        merchant_order_id: shipmentData.order_id,
        sender_name: shipmentData.pickup_address.name,
        sender_phone: shipmentData.pickup_address.phone,
        sender_address: shipmentData.pickup_address.address,
        recipient_name: shipmentData.delivery_address.name,
        recipient_phone: shipmentData.delivery_address.phone,
        recipient_address: shipmentData.delivery_address.address,
        recipient_city: shipmentData.delivery_address.city,
        recipient_zone: shipmentData.delivery_address.zone,
        recipient_area: shipmentData.delivery_address.area,
        delivery_type: shipmentData.service_type || 48,
        item_type: shipmentData.package_details.type || 2,
        special_instruction: shipmentData.package_details.instructions || '',
        item_quantity: shipmentData.package_details.quantity || 1,
        item_weight: shipmentData.package_details.weight || 0.5,
        amount_to_collect: shipmentData.package_details.cod_amount || 0,
        item_description: shipmentData.package_details.description || ''
      })
    });

    const result = await response.json();

    return {
      success: result.type === 'success',
      tracking_id: result.data?.consignment_id,
      estimated_delivery: result.data?.estimated_delivery_date,
      error: result.message
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function trackPathaoShipment(config: any, tracking_id: string) {
  const { api_config } = config;
  
  try {
    const response = await fetch(`${api_config.base_url}/orders/${tracking_id}`, {
      headers: {
        'Authorization': `Bearer ${api_config.access_token}`,
        'Accept': 'application/json'
      }
    });

    const result = await response.json();

    return {
      status: result.data?.order_status || 'unknown',
      location: result.data?.current_location || '',
      estimated_delivery: result.data?.estimated_delivery_date,
      tracking_history: result.data?.tracking_history || []
    };

  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
}

async function getPathaoPricing(config: any, pricingData: any) {
  const { api_config } = config;
  
  try {
    const response = await fetch(`${api_config.base_url}/merchant/price-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_config.access_token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        store_id: api_config.store_id,
        item_type: 2,
        delivery_type: pricingData.service_type || 48,
        item_weight: parseFloat(pricingData.weight),
        recipient_city: pricingData.delivery_zone,
        recipient_zone: pricingData.delivery_zone
      })
    });

    const result = await response.json();

    return {
      success: result.type === 'success',
      price: result.data?.price || 0,
      currency: 'BDT',
      estimated_delivery_time: result.data?.estimated_delivery_time || ''
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Similar implementation patterns for other couriers (Paperfly, RedX, eCourier, Sundarban)
// Each would have their own API endpoints and request/response formats

async function createPaperflyShipment(config: any, shipmentData: any) {
  // Paperfly-specific implementation
  return { success: true, tracking_id: 'PF' + Date.now() };
}

async function trackPaperflyShipment(config: any, tracking_id: string) {
  return { status: 'in_transit', location: 'Dhaka Hub' };
}

async function getPaperflyPricing(config: any, pricingData: any) {
  return { success: true, price: 60, currency: 'BDT' };
}

async function createRedXShipment(config: any, shipmentData: any) {
  return { success: true, tracking_id: 'RX' + Date.now() };
}

async function trackRedXShipment(config: any, tracking_id: string) {
  return { status: 'delivered', location: 'Customer Location' };
}

async function getRedXPricing(config: any, pricingData: any) {
  return { success: true, price: 70, currency: 'BDT' };
}

async function createECourierShipment(config: any, shipmentData: any) {
  return { success: true, tracking_id: 'EC' + Date.now() };
}

async function trackECourierShipment(config: any, tracking_id: string) {
  return { status: 'picked_up', location: 'Origin Hub' };
}

async function getECourierPricing(config: any, pricingData: any) {
  return { success: true, price: 65, currency: 'BDT' };
}

async function createSundarbanShipment(config: any, shipmentData: any) {
  return { success: true, tracking_id: 'SB' + Date.now() };
}

async function trackSundarbanShipment(config: any, tracking_id: string) {
  return { status: 'in_transit', location: 'Transit Hub' };
}

async function getSundarbanPricing(config: any, pricingData: any) {
  return { success: true, price: 55, currency: 'BDT' };
}