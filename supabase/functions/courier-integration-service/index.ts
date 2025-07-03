import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Bangladesh Courier API Clients
class PathaoClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: any) {
    this.apiKey = config.api_key;
    this.baseUrl = config.base_url || 'https://api.pathao.com/v1';
  }

  async createShipment(shipmentData: any) {
    const payload = {
      pickup_address: {
        name: shipmentData.pickup_address.name,
        phone: shipmentData.pickup_address.phone,
        address: shipmentData.pickup_address.full_address,
        area: shipmentData.pickup_address.area,
        city: shipmentData.pickup_address.city
      },
      delivery_address: {
        name: shipmentData.delivery_address.name,
        phone: shipmentData.delivery_address.phone,
        address: shipmentData.delivery_address.full_address,
        area: shipmentData.delivery_address.area,
        city: shipmentData.delivery_address.city
      },
      package: {
        weight: shipmentData.package_details.weight,
        description: shipmentData.package_details.description,
        value: shipmentData.package_details.value,
        cod_amount: shipmentData.package_details.cod_amount || 0
      },
      service_type: this.mapServiceType(shipmentData.service_type),
      delivery_instructions: shipmentData.delivery_instructions || ''
    };

    // Mock API response - replace with actual Pathao API call
    return {
      success: true,
      shipment_id: `PATHAO_${Date.now()}`,
      tracking_number: `PT${Date.now()}`,
      estimated_delivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      pickup_confirmation: 'Pickup scheduled within 2 hours',
      cost: this.calculateCost(payload)
    };
  }

  async trackShipment(tracking_number: string) {
    // Mock tracking response - replace with actual Pathao API call
    return {
      tracking_number,
      status: 'in_transit',
      current_location: {
        city: 'Dhaka',
        area: 'Dhanmondi',
        coordinates: { lat: 23.746466, lng: 90.376015 }
      },
      events: [
        {
          timestamp: new Date().toISOString(),
          status: 'picked_up',
          location: 'Pickup Location',
          description: 'Package picked up from sender'
        },
        {
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'in_transit',
          location: 'Dhaka Hub',
          description: 'Package in transit'
        }
      ],
      estimated_delivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
    };
  }

  async cancelShipment(tracking_number: string) {
    // Mock cancellation - replace with actual API call
    return {
      success: true,
      message: 'Shipment cancelled successfully',
      refund_amount: 0
    };
  }

  private mapServiceType(serviceType: string): string {
    const mapping = {
      'same_day': 'same_day',
      'express': 'next_day',
      'standard': 'regular'
    };
    return mapping[serviceType] || 'regular';
  }

  private calculateCost(payload: any): number {
    const baseCost = 80;
    const weightCost = Math.max(0, (payload.package.weight - 1) * 20);
    const codCost = payload.package.cod_amount > 0 ? 15 : 0;
    return baseCost + weightCost + codCost;
  }
}

class PaperflyClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: any) {
    this.apiKey = config.api_key;
    this.baseUrl = config.base_url || 'https://api.paperfly.com.bd/v1';
  }

  async createShipment(shipmentData: any) {
    const payload = {
      sender: {
        name: shipmentData.pickup_address.name,
        phone: shipmentData.pickup_address.phone,
        address: shipmentData.pickup_address.full_address,
        district: shipmentData.pickup_address.district,
        upazila: shipmentData.pickup_address.upazila
      },
      receiver: {
        name: shipmentData.delivery_address.name,
        phone: shipmentData.delivery_address.phone,
        address: shipmentData.delivery_address.full_address,
        district: shipmentData.delivery_address.district,
        upazila: shipmentData.delivery_address.upazila
      },
      parcel: {
        weight: shipmentData.package_details.weight,
        item_description: shipmentData.package_details.description,
        invoice_amount: shipmentData.package_details.value,
        cod_amount: shipmentData.package_details.cod_amount || 0
      },
      service_type: this.mapServiceType(shipmentData.service_type)
    };

    // Mock API response
    return {
      success: true,
      shipment_id: `PAPERFLY_${Date.now()}`,
      tracking_number: `PF${Date.now()}`,
      estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      pickup_confirmation: 'Pickup scheduled for tomorrow',
      cost: this.calculateCost(payload)
    };
  }

  async trackShipment(tracking_number: string) {
    return {
      tracking_number,
      status: 'delivered',
      current_location: {
        district: 'Chittagong',
        upazila: 'Double Mooring'
      },
      events: [
        {
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'picked_up',
          location: 'Dhaka Hub',
          description: 'Picked up from sender'
        },
        {
          timestamp: new Date().toISOString(),
          status: 'delivered',
          location: 'Chittagong',
          description: 'Successfully delivered to recipient'
        }
      ],
      delivered_at: new Date().toISOString()
    };
  }

  private mapServiceType(serviceType: string): string {
    const mapping = {
      'express': 'express',
      'standard': 'regular',
      'economy': 'regular'
    };
    return mapping[serviceType] || 'regular';
  }

  private calculateCost(payload: any): number {
    const baseCost = 60;
    const weightCost = Math.max(0, (payload.parcel.weight - 1) * 15);
    const codCost = payload.parcel.cod_amount > 0 ? 10 : 0;
    return baseCost + weightCost + codCost;
  }
}

class RedXClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: any) {
    this.apiKey = config.api_key;
    this.baseUrl = config.base_url || 'https://redx.com.bd/api/v1';
  }

  async createShipment(shipmentData: any) {
    const payload = {
      customer_name: shipmentData.delivery_address.name,
      customer_phone: shipmentData.delivery_address.phone,
      delivery_address: shipmentData.delivery_address.full_address,
      area: shipmentData.delivery_address.area,
      weight: shipmentData.package_details.weight,
      cash_collection_amount: shipmentData.package_details.cod_amount || 0,
      instruction: shipmentData.delivery_instructions || '',
      value: shipmentData.package_details.value
    };

    return {
      success: true,
      shipment_id: `REDX_${Date.now()}`,
      tracking_number: `RX${Date.now()}`,
      estimated_delivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      pickup_confirmation: 'Pickup within 4 hours',
      cost: this.calculateCost(payload)
    };
  }

  async trackShipment(tracking_number: string) {
    return {
      tracking_number,
      status: 'out_for_delivery',
      current_location: {
        area: 'Gulshan',
        city: 'Dhaka'
      },
      events: [
        {
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'picked_up',
          location: 'Origin Hub',
          description: 'Package collected'
        },
        {
          timestamp: new Date().toISOString(),
          status: 'out_for_delivery',
          location: 'Delivery Hub',
          description: 'Out for delivery'
        }
      ],
      estimated_delivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    };
  }

  private calculateCost(payload: any): number {
    const baseCost = 90;
    const weightCost = Math.max(0, (payload.weight - 1) * 25);
    const codCost = payload.cash_collection_amount > 0 ? 20 : 0;
    return baseCost + weightCost + codCost;
  }
}

class ECourierClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: any) {
    this.apiKey = config.api_key;
    this.baseUrl = config.base_url || 'https://api.ecourier.com.bd/v1';
  }

  async createShipment(shipmentData: any) {
    const payload = {
      recipient_name: shipmentData.delivery_address.name,
      recipient_mobile: shipmentData.delivery_address.phone,
      recipient_address: shipmentData.delivery_address.full_address,
      recipient_city: shipmentData.delivery_address.city,
      parcel_type: 'standard',
      product_price: shipmentData.package_details.value,
      payment_method: shipmentData.package_details.cod_amount > 0 ? 'COD' : 'PREPAID',
      actual_product_price: shipmentData.package_details.cod_amount || 0
    };

    return {
      success: true,
      shipment_id: `ECOURIER_${Date.now()}`,
      tracking_number: `EC${Date.now()}`,
      estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      pickup_confirmation: 'Pickup scheduled',
      cost: this.calculateCost(payload)
    };
  }

  async trackShipment(tracking_number: string) {
    return {
      tracking_number,
      status: 'processing',
      current_location: {
        city: 'Dhaka',
        facility: 'Processing Center'
      },
      events: [
        {
          timestamp: new Date().toISOString(),
          status: 'processing',
          location: 'Dhaka Hub',
          description: 'Package under processing'
        }
      ],
      estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private calculateCost(payload: any): number {
    const baseCost = 70;
    const codCost = payload.actual_product_price > 0 ? 12 : 0;
    return baseCost + codCost;
  }
}

class SundarbanClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: any) {
    this.apiKey = config.api_key;
    this.baseUrl = config.base_url || 'https://api.sundarban.com/v1';
  }

  async createShipment(shipmentData: any) {
    return {
      success: true,
      shipment_id: `SUNDARBAN_${Date.now()}`,
      tracking_number: `SB${Date.now()}`,
      estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      pickup_confirmation: 'Pickup in 2-3 days',
      cost: 50 + (shipmentData.package_details.cod_amount > 0 ? 8 : 0)
    };
  }

  async trackShipment(tracking_number: string) {
    return {
      tracking_number,
      status: 'picked_up',
      current_location: {
        district: 'Barishal',
        facility: 'Regional Hub'
      },
      events: [
        {
          timestamp: new Date().toISOString(),
          status: 'picked_up',
          location: 'Local Hub',
          description: 'Picked up for delivery'
        }
      ],
      estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
}

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

    const { action, courier, data } = await req.json();

    // Get courier configuration
    const { data: courierConfig, error } = await supabaseClient
      .from('bd_courier_partners')
      .select('*')
      .eq('courier_name', courier)
      .eq('is_active', true)
      .single();

    if (error || !courierConfig) {
      return new Response(JSON.stringify({ error: `Courier ${courier} not found or inactive` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Initialize courier client
    const courierClient = createCourierClient(courier, courierConfig.api_config);

    switch (action) {
      case 'create_shipment':
        return await handleCreateShipment(courierClient, data, supabaseClient);
      case 'track_shipment':
        return await handleTrackShipment(courierClient, data, supabaseClient);
      case 'cancel_shipment':
        return await handleCancelShipment(courierClient, data, supabaseClient);
      case 'get_rates':
        return await handleGetRates(courierClient, data);
      case 'schedule_pickup':
        return await handleSchedulePickup(courierClient, data, supabaseClient);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Courier integration error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function createCourierClient(courier: string, config: any) {
  switch (courier) {
    case 'pathao':
      return new PathaoClient(config);
    case 'paperfly':
      return new PaperflyClient(config);
    case 'redx':
      return new RedXClient(config);
    case 'ecourier':
      return new ECourierClient(config);
    case 'sundarban':
      return new SundarbanClient(config);
    default:
      throw new Error(`Unsupported courier: ${courier}`);
  }
}

async function handleCreateShipment(courierClient: any, data: any, supabaseClient: any) {
  const result = await courierClient.createShipment(data);

  // Store courier shipment record
  await supabaseClient
    .from('courier_shipments')
    .insert({
      order_id: data.order_id,
      courier_name: data.courier,
      tracking_id: result.tracking_number,
      pickup_address: data.pickup_address,
      delivery_address: data.delivery_address,
      package_details: data.package_details,
      status: 'created',
      estimated_delivery: result.estimated_delivery.split('T')[0],
      courier_response: result
    });

  return new Response(JSON.stringify({
    success: true,
    result
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleTrackShipment(courierClient: any, data: any, supabaseClient: any) {
  const result = await courierClient.trackShipment(data.tracking_number);

  // Update local tracking record
  await supabaseClient
    .from('courier_shipments')
    .update({
      status: result.status,
      courier_response: result,
      updated_at: new Date().toISOString()
    })
    .eq('tracking_id', data.tracking_number);

  return new Response(JSON.stringify({
    success: true,
    tracking: result
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleCancelShipment(courierClient: any, data: any, supabaseClient: any) {
  const result = await courierClient.cancelShipment(data.tracking_number);

  if (result.success) {
    await supabaseClient
      .from('courier_shipments')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('tracking_id', data.tracking_number);
  }

  return new Response(JSON.stringify({
    success: true,
    result
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleGetRates(courierClient: any, data: any) {
  // Mock rate calculation
  const mockShipment = {
    package_details: {
      weight: data.weight || 1,
      value: data.value || 1000,
      cod_amount: data.cod_amount || 0
    },
    service_type: data.service_type || 'standard'
  };

  const result = await courierClient.createShipment(mockShipment);

  return new Response(JSON.stringify({
    success: true,
    rate: {
      cost: result.cost,
      currency: 'BDT',
      estimated_delivery: result.estimated_delivery,
      service_type: data.service_type || 'standard'
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleSchedulePickup(courierClient: any, data: any, supabaseClient: any) {
  // Mock pickup scheduling
  const result = {
    success: true,
    pickup_id: `PU_${Date.now()}`,
    scheduled_date: data.preferred_date,
    scheduled_time: data.preferred_time_slot,
    message: 'Pickup scheduled successfully'
  };

  return new Response(JSON.stringify({
    success: true,
    pickup: result
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}