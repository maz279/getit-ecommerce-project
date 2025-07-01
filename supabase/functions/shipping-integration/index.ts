import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ShippingRequest {
  courier: 'pathao' | 'redx' | 'ecourier' | 'sundarban' | 'paperfly'
  pickup_address: AddressInfo
  delivery_address: AddressInfo
  package_info: PackageInfo
  order_id: string
  vendor_id?: string
}

interface AddressInfo {
  name: string
  phone: string
  address: string
  area: string
  city: string
  zone: string
  landmark?: string
}

interface PackageInfo {
  weight: number
  length: number
  width: number
  height: number
  value: number
  description: string
  fragile?: boolean
}

interface RateRequest {
  pickup_zone: string
  delivery_zone: string
  weight: number
  package_value: number
  service_type?: 'regular' | 'express' | 'overnight'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    switch (action) {
      case 'calculate-rates':
        return await calculateShippingRates(req, supabaseClient)
      case 'create-shipment':
        return await createShipment(req, supabaseClient)
      case 'track-shipment':
        return await trackShipment(req, supabaseClient)
      case 'schedule-pickup':
        return await schedulePickup(req, supabaseClient)
      case 'cancel-shipment':
        return await cancelShipment(req, supabaseClient)
      case 'get-zones':
        return await getShippingZones(req, supabaseClient)
      case 'bulk-create':
        return await bulkCreateShipments(req, supabaseClient)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Shipping integration error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function calculateShippingRates(req: Request, supabaseClient: any) {
  const rateRequest: RateRequest = await req.json()
  
  const rates = []
  
  // Calculate rates for all available couriers
  const couriers = ['pathao', 'redx', 'ecourier', 'sundarban', 'paperfly']
  
  for (const courier of couriers) {
    try {
      const rate = await calculateCourierRate(courier, rateRequest)
      rates.push({
        courier,
        ...rate,
        estimated_delivery: getEstimatedDeliveryTime(courier, rateRequest.pickup_zone, rateRequest.delivery_zone)
      })
    } catch (error) {
      console.error(`Error calculating rate for ${courier}:`, error)
      rates.push({
        courier,
        error: error.message,
        available: false
      })
    }
  }
  
  // Sort by price
  rates.sort((a, b) => (a.price || Infinity) - (b.price || Infinity))
  
  return new Response(JSON.stringify({
    success: true,
    rates,
    cheapest: rates.find(r => r.available !== false),
    fastest: rates.reduce((fastest, current) => 
      (!fastest || (current.delivery_time_hours && current.delivery_time_hours < fastest.delivery_time_hours)) 
        ? current : fastest, null)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function calculateCourierRate(courier: string, rateRequest: RateRequest) {
  const baseRates = {
    pathao: { base: 60, per_kg: 10, express_multiplier: 1.5 },
    redx: { base: 55, per_kg: 12, express_multiplier: 1.4 },
    ecourier: { base: 65, per_kg: 8, express_multiplier: 1.6 },
    sundarban: { base: 50, per_kg: 15, express_multiplier: 1.3 },
    paperfly: { base: 70, per_kg: 9, express_multiplier: 1.7 }
  }
  
  const courierRates = baseRates[courier as keyof typeof baseRates]
  if (!courierRates) {
    throw new Error(`Unsupported courier: ${courier}`)
  }
  
  let price = courierRates.base
  
  // Add weight-based pricing
  if (rateRequest.weight > 1) {
    price += (rateRequest.weight - 1) * courierRates.per_kg
  }
  
  // Add distance-based pricing
  const distance = calculateZoneDistance(rateRequest.pickup_zone, rateRequest.delivery_zone)
  if (distance > 10) {
    price += (distance - 10) * 2
  }
  
  // Apply service type multiplier
  if (rateRequest.service_type === 'express') {
    price *= courierRates.express_multiplier
  } else if (rateRequest.service_type === 'overnight') {
    price *= 2
  }
  
  // Add insurance for high-value packages
  if (rateRequest.package_value > 10000) {
    price += rateRequest.package_value * 0.001 // 0.1% insurance
  }
  
  return {
    price: Math.round(price),
    currency: 'BDT',
    service_type: rateRequest.service_type || 'regular',
    available: true,
    delivery_time_hours: getDeliveryTimeHours(courier, rateRequest.service_type, distance)
  }
}

function calculateZoneDistance(pickupZone: string, deliveryZone: string): number {
  // Mock distance calculation between zones
  // In production, use actual geographic data
  const zoneDistances: { [key: string]: number } = {
    'dhaka-dhaka': 5,
    'dhaka-chittagong': 250,
    'dhaka-sylhet': 180,
    'dhaka-rajshahi': 200,
    'chittagong-sylhet': 150,
    // Add more zone combinations
  }
  
  const key = `${pickupZone.toLowerCase()}-${deliveryZone.toLowerCase()}`
  const reverseKey = `${deliveryZone.toLowerCase()}-${pickupZone.toLowerCase()}`
  
  return zoneDistances[key] || zoneDistances[reverseKey] || 100 // Default distance
}

function getDeliveryTimeHours(courier: string, serviceType?: string, distance?: number): number {
  const baseTimes = {
    pathao: 24,
    redx: 48,
    ecourier: 24,
    sundarban: 72,
    paperfly: 24
  }
  
  let baseTime = baseTimes[courier as keyof typeof baseTimes] || 48
  
  if (serviceType === 'express') {
    baseTime *= 0.5
  } else if (serviceType === 'overnight') {
    baseTime = 12
  }
  
  // Add time based on distance
  if (distance && distance > 50) {
    baseTime += Math.floor(distance / 50) * 24
  }
  
  return baseTime
}

function getEstimatedDeliveryTime(courier: string, pickupZone: string, deliveryZone: string): string {
  const hours = getDeliveryTimeHours(courier, 'regular', calculateZoneDistance(pickupZone, deliveryZone))
  const deliveryDate = new Date(Date.now() + hours * 60 * 60 * 1000)
  
  return deliveryDate.toISOString().split('T')[0] // Return date only
}

async function createShipment(req: Request, supabaseClient: any) {
  const shippingRequest: ShippingRequest = await req.json()
  
  try {
    // Create shipment with chosen courier
    const shipmentResult = await createCourierShipment(shippingRequest)
    
    // Record shipment in database
    const { data: shipment } = await supabaseClient.from('shipments').insert({
      order_id: shippingRequest.order_id,
      vendor_id: shippingRequest.vendor_id,
      courier: shippingRequest.courier,
      tracking_number: shipmentResult.tracking_number,
      pickup_address: shippingRequest.pickup_address,
      delivery_address: shippingRequest.delivery_address,
      package_info: shippingRequest.package_info,
      status: 'created',
      created_at: new Date().toISOString(),
      estimated_delivery: shipmentResult.estimated_delivery,
      shipping_cost: shipmentResult.cost
    }).select().single()
    
    // Schedule pickup if requested
    if (shipmentResult.pickup_required) {
      await schedulePickupInternal(shipment.id, shippingRequest.courier, shippingRequest.pickup_address)
    }
    
    return new Response(JSON.stringify({
      success: true,
      shipment_id: shipment.id,
      tracking_number: shipmentResult.tracking_number,
      estimated_delivery: shipmentResult.estimated_delivery,
      cost: shipmentResult.cost,
      pickup_scheduled: shipmentResult.pickup_required
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Shipment creation error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function createCourierShipment(shippingRequest: ShippingRequest) {
  const courier = shippingRequest.courier
  
  // Mock courier API integration
  // In production, integrate with actual courier APIs
  
  const trackingNumber = `${courier.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  const mockResults = {
    pathao: {
      tracking_number: trackingNumber,
      estimated_delivery: getEstimatedDeliveryTime(courier, 'dhaka', 'dhaka'),
      cost: 65,
      pickup_required: true,
      status: 'created'
    },
    redx: {
      tracking_number: trackingNumber,
      estimated_delivery: getEstimatedDeliveryTime(courier, 'dhaka', 'dhaka'),
      cost: 60,
      pickup_required: true,
      status: 'created'
    },
    ecourier: {
      tracking_number: trackingNumber,
      estimated_delivery: getEstimatedDeliveryTime(courier, 'dhaka', 'dhaka'),
      cost: 70,
      pickup_required: false,
      status: 'created'
    },
    sundarban: {
      tracking_number: trackingNumber,
      estimated_delivery: getEstimatedDeliveryTime(courier, 'dhaka', 'dhaka'),
      cost: 55,
      pickup_required: true,
      status: 'created'
    },
    paperfly: {
      tracking_number: trackingNumber,
      estimated_delivery: getEstimatedDeliveryTime(courier, 'dhaka', 'dhaka'),
      cost: 75,
      pickup_required: false,
      status: 'created'
    }
  }
  
  return mockResults[courier] || mockResults.pathao
}

async function trackShipment(req: Request, supabaseClient: any) {
  const { tracking_number, courier } = await req.json()
  
  try {
    // Get tracking info from courier
    const trackingInfo = await getCourierTracking(courier, tracking_number)
    
    // Update shipment status in database
    await supabaseClient
      .from('shipments')
      .update({
        status: trackingInfo.status,
        current_location: trackingInfo.current_location,
        tracking_events: trackingInfo.events,
        updated_at: new Date().toISOString()
      })
      .eq('tracking_number', tracking_number)
    
    return new Response(JSON.stringify({
      success: true,
      tracking_info: trackingInfo
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function getCourierTracking(courier: string, trackingNumber: string) {
  // Mock tracking implementation
  // In production, integrate with actual courier tracking APIs
  
  const mockStatuses = ['created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered']
  const currentStatusIndex = Math.floor(Math.random() * mockStatuses.length)
  const status = mockStatuses[currentStatusIndex]
  
  const events = []
  for (let i = 0; i <= currentStatusIndex; i++) {
    events.push({
      status: mockStatuses[i],
      timestamp: new Date(Date.now() - (currentStatusIndex - i) * 24 * 60 * 60 * 1000).toISOString(),
      location: i === 0 ? 'Dhaka Hub' : i === currentStatusIndex ? 'Destination' : 'Transit Hub',
      description: `Package ${mockStatuses[i].replace('_', ' ')}`
    })
  }
  
  return {
    tracking_number: trackingNumber,
    status,
    current_location: events[events.length - 1]?.location || 'Unknown',
    estimated_delivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    events
  }
}

async function schedulePickup(req: Request, supabaseClient: any) {
  const { shipment_id, pickup_date, pickup_time_slot } = await req.json()
  
  const { data: shipment } = await supabaseClient
    .from('shipments')
    .select('*')
    .eq('id', shipment_id)
    .single()
  
  if (!shipment) {
    return new Response(JSON.stringify({ error: 'Shipment not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
  
  const pickupResult = await schedulePickupInternal(shipment_id, shipment.courier, shipment.pickup_address, pickup_date, pickup_time_slot)
  
  return new Response(JSON.stringify({
    success: true,
    pickup_scheduled: true,
    pickup_reference: pickupResult.reference,
    pickup_date: pickup_date,
    pickup_time_slot: pickup_time_slot
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function schedulePickupInternal(shipmentId: string, courier: string, pickupAddress: AddressInfo, pickupDate?: string, timeSlot?: string) {
  // Mock pickup scheduling
  const reference = `PU-${courier.toUpperCase()}-${Date.now()}`
  
  return {
    reference,
    scheduled_date: pickupDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time_slot: timeSlot || '10:00-14:00',
    status: 'scheduled'
  }
}

async function cancelShipment(req: Request, supabaseClient: any) {
  const { tracking_number, reason } = await req.json()
  
  // Update shipment status
  await supabaseClient
    .from('shipments')
    .update({
      status: 'cancelled',
      cancellation_reason: reason,
      cancelled_at: new Date().toISOString()
    })
    .eq('tracking_number', tracking_number)
  
  return new Response(JSON.stringify({
    success: true,
    message: 'Shipment cancelled successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getShippingZones(req: Request, supabaseClient: any) {
  // Mock shipping zones for Bangladesh
  const zones = {
    dhaka: {
      name: 'Dhaka Division',
      areas: ['Dhaka', 'Gazipur', 'Narayanganj', 'Manikganj', 'Munshiganj', 'Narsingdi', 'Tangail'],
      base_cost: 60
    },
    chittagong: {
      name: 'Chittagong Division',
      areas: ['Chittagong', 'Coxs Bazar', 'Comilla', 'Brahmanbaria', 'Noakhali', 'Feni', 'Lakshmipur'],
      base_cost: 80
    },
    sylhet: {
      name: 'Sylhet Division',
      areas: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
      base_cost: 90
    },
    rajshahi: {
      name: 'Rajshahi Division',
      areas: ['Rajshahi', 'Rangpur', 'Bogra', 'Pabna', 'Sirajganj', 'Natore', 'Naogaon'],
      base_cost: 85
    },
    khulna: {
      name: 'Khulna Division',
      areas: ['Khulna', 'Jessore', 'Satkhira', 'Bagerhat', 'Narail', 'Magura', 'Meherpur'],
      base_cost: 85
    },
    barisal: {
      name: 'Barisal Division',
      areas: ['Barisal', 'Patuakhali', 'Pirojpur', 'Jhalokati', 'Barguna', 'Bhola'],
      base_cost: 95
    }
  }
  
  return new Response(JSON.stringify({
    success: true,
    zones
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function bulkCreateShipments(req: Request, supabaseClient: any) {
  const { shipments } = await req.json()
  
  const results = []
  
  for (const shipmentData of shipments) {
    try {
      const result = await createShipment(
        new Request(req.url, {
          method: 'POST',
          body: JSON.stringify(shipmentData),
          headers: req.headers
        }),
        supabaseClient
      )
      
      results.push({ success: true, result: await result.json() })
    } catch (error) {
      results.push({ success: false, error: error.message, order_id: shipmentData.order_id })
    }
  }
  
  return new Response(JSON.stringify({
    success: true,
    results,
    total_processed: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}