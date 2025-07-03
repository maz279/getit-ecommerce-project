import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Bangladesh shipping zones and distances
const BANGLADESH_ZONES = {
  'dhaka': { type: 'metro', tier: 1 },
  'chittagong': { type: 'metro', tier: 1 },
  'sylhet': { type: 'city', tier: 2 },
  'rajshahi': { type: 'city', tier: 2 },
  'khulna': { type: 'city', tier: 2 },
  'barisal': { type: 'city', tier: 2 },
  'rangpur': { type: 'city', tier: 2 },
  'mymensingh': { type: 'city', tier: 2 },
  'comilla': { type: 'town', tier: 3 },
  'narayanganj': { type: 'town', tier: 3 },
  'gazipur': { type: 'town', tier: 3 }
};

const ZONE_DISTANCES = {
  'dhaka-chittagong': 244,
  'dhaka-sylhet': 247,
  'dhaka-rajshahi': 256,
  'dhaka-khulna': 334,
  'dhaka-barisal': 373,
  'dhaka-rangpur': 303,
  'dhaka-mymensingh': 120,
  'chittagong-sylhet': 168,
  'chittagong-rajshahi': 463
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
      case 'calculate_rates':
        return await calculateShippingRates(data, supabaseClient);
      case 'compare_couriers':
        return await compareCourierRates(data, supabaseClient);
      case 'get_zone_rates':
        return await getZoneBasedRates(data, supabaseClient);
      case 'bulk_rate_calculation':
        return await bulkRateCalculation(data, supabaseClient);
      case 'dynamic_pricing':
        return await calculateDynamicPricing(data, supabaseClient);
      case 'volume_discounts':
        return await calculateVolumeDiscounts(data, supabaseClient);
      case 'cod_charges':
        return await calculateCODCharges(data, supabaseClient);
      case 'fuel_surcharge':
        return await calculateFuelSurcharge(data, supabaseClient);
      case 'express_rates':
        return await calculateExpressRates(data, supabaseClient);
      case 'international_rates':
        return await calculateInternationalRates(data, supabaseClient);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Rate calculator error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function calculateShippingRates(data: any, supabaseClient: any) {
  const { 
    pickup_address, 
    delivery_address, 
    package_details, 
    service_types = ['standard'], 
    preferred_couriers = [] 
  } = data;

  const rates = [];

  // Get all active courier partners
  let courierQuery = supabaseClient
    .from('bd_courier_partners')
    .select('*')
    .eq('is_active', true);

  if (preferred_couriers.length > 0) {
    courierQuery = courierQuery.in('courier_name', preferred_couriers);
  }

  const { data: couriers, error } = await courierQuery;

  if (error) throw new Error('Failed to fetch courier partners');

  // Calculate rates for each courier and service type
  for (const courier of couriers) {
    for (const service_type of service_types) {
      try {
        const rate = await calculateCourierRate(
          courier,
          pickup_address,
          delivery_address,
          package_details,
          service_type,
          supabaseClient
        );

        if (rate) {
          rates.push({
            courier_id: courier.id,
            courier_name: courier.courier_name,
            service_type,
            base_rate: rate.base_rate,
            weight_charges: rate.weight_charges,
            distance_charges: rate.distance_charges,
            cod_charges: rate.cod_charges,
            fuel_surcharge: rate.fuel_surcharge,
            service_charges: rate.service_charges,
            total_cost: rate.total_cost,
            currency: 'BDT',
            estimated_delivery_hours: rate.estimated_delivery_hours,
            delivery_date: rate.delivery_date,
            pickup_time: rate.pickup_time,
            coverage_confirmed: rate.coverage_confirmed,
            special_features: rate.special_features || []
          });
        }
      } catch (error) {
        console.error(`Rate calculation failed for ${courier.courier_name}:`, error);
      }
    }
  }

  // Sort by total cost
  rates.sort((a, b) => a.total_cost - b.total_cost);

  // Get best rate for each service type
  const bestRates = {};
  service_types.forEach(service => {
    const serviceRates = rates.filter(r => r.service_type === service);
    if (serviceRates.length > 0) {
      bestRates[service] = serviceRates[0];
    }
  });

  return new Response(JSON.stringify({
    success: true,
    shipping_calculation: {
      pickup_zone: getZoneInfo(pickup_address),
      delivery_zone: getZoneInfo(delivery_address),
      distance_km: calculateDistance(pickup_address, delivery_address),
      package_summary: {
        weight_kg: package_details.weight,
        dimensions: package_details.dimensions,
        value: package_details.value,
        is_cod: package_details.cod_amount > 0
      },
      available_rates: rates,
      best_rates: bestRates,
      recommendations: generateRateRecommendations(rates),
      calculation_timestamp: new Date().toISOString()
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function calculateCourierRate(
  courier: any, 
  pickup_address: any, 
  delivery_address: any, 
  package_details: any, 
  service_type: string,
  supabaseClient: any
) {
  const pickupZone = getZoneFromAddress(pickup_address);
  const deliveryZone = getZoneFromAddress(delivery_address);
  
  // Check if courier covers the delivery area
  const coverageAreas = courier.coverage_areas || [];
  const deliveryCity = delivery_address.city?.toLowerCase();
  
  if (!checkCoverage(deliveryCity, coverageAreas, courier.courier_name)) {
    return null; // Courier doesn't cover this area
  }

  // Get rate configuration from database
  const { data: rateConfig } = await supabaseClient
    .from('shipping_rates')
    .select('*')
    .eq('courier_partner_id', courier.id)
    .eq('zone_from', pickupZone)
    .eq('zone_to', deliveryZone)
    .eq('service_type', service_type)
    .eq('is_active', true)
    .gte('weight_to', package_details.weight)
    .gte('weight_from', package_details.weight)
    .single();

  // If no specific rate found, use courier's pricing structure
  const pricing = rateConfig || getCourierDefaultPricing(courier, service_type);

  // Calculate base rate
  const base_rate = pricing.base_rate || getCourierBaseRate(courier.courier_name, service_type);

  // Calculate weight charges
  const weight = package_details.weight || 1;
  const weight_charges = weight > 1 ? (weight - 1) * (pricing.per_kg_rate || 20) : 0;

  // Calculate distance charges
  const distance = calculateDistance(pickup_address, delivery_address);
  const distance_charges = distance > 10 ? (distance - 10) * 2 : 0;

  // Calculate COD charges
  const cod_charges = package_details.cod_amount > 0 ? (pricing.cod_charge || getCODCharge(courier.courier_name)) : 0;

  // Calculate fuel surcharge (current rate: 3%)
  const fuel_surcharge = Math.round((base_rate + weight_charges + distance_charges) * 0.03);

  // Calculate service charges based on type
  const service_charges = getServiceCharges(service_type, courier.courier_name);

  // Calculate total
  const total_cost = base_rate + weight_charges + distance_charges + cod_charges + fuel_surcharge + service_charges;

  // Calculate delivery time
  const delivery_info = calculateDeliveryTime(
    pickup_address, 
    delivery_address, 
    service_type, 
    courier.courier_name
  );

  return {
    base_rate,
    weight_charges,
    distance_charges,
    cod_charges,
    fuel_surcharge,
    service_charges,
    total_cost: Math.round(total_cost),
    estimated_delivery_hours: delivery_info.hours,
    delivery_date: delivery_info.date,
    pickup_time: delivery_info.pickup_time,
    coverage_confirmed: true,
    special_features: getCourierFeatures(courier.courier_name, service_type)
  };
}

async function compareCourierRates(data: any, supabaseClient: any) {
  const { pickup_address, delivery_address, package_details, service_type = 'standard' } = data;

  const ratesResponse = await calculateShippingRates({
    pickup_address,
    delivery_address,
    package_details,
    service_types: [service_type]
  }, supabaseClient);

  const ratesData = await ratesResponse.json();
  const rates = ratesData.shipping_calculation.available_rates;

  // Enhanced comparison
  const comparison = {
    total_couriers: rates.length,
    service_type,
    price_range: {
      lowest: rates.length > 0 ? Math.min(...rates.map(r => r.total_cost)) : 0,
      highest: rates.length > 0 ? Math.max(...rates.map(r => r.total_cost)) : 0,
      average: rates.length > 0 ? Math.round(rates.reduce((sum, r) => sum + r.total_cost, 0) / rates.length) : 0
    },
    delivery_time_range: {
      fastest: rates.length > 0 ? Math.min(...rates.map(r => r.estimated_delivery_hours)) : 0,
      slowest: rates.length > 0 ? Math.max(...rates.map(r => r.estimated_delivery_hours)) : 0
    },
    detailed_comparison: rates.map((rate, index) => ({
      rank: index + 1,
      ...rate,
      value_score: calculateValueScore(rate, rates),
      speed_score: calculateSpeedScore(rate, rates),
      reliability_score: getCourierReliability(rate.courier_name)
    })),
    recommendations: {
      best_value: rates[0] || null,
      fastest_delivery: rates.reduce((fastest, rate) => 
        rate.estimated_delivery_hours < fastest.estimated_delivery_hours ? rate : fastest, rates[0]) || null,
      most_reliable: rates.reduce((reliable, rate) => 
        getCourierReliability(rate.courier_name) > getCourierReliability(reliable.courier_name) ? rate : reliable, rates[0]) || null
    }
  };

  return new Response(JSON.stringify({
    success: true,
    courier_comparison: comparison
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getZoneBasedRates(data: any, supabaseClient: any) {
  const { pickup_zone, delivery_zone, weight_kg = 1, service_type = 'standard' } = data;

  // Get all rates for the zone combination
  const { data: zoneRates, error } = await supabaseClient
    .from('shipping_rates')
    .select(`
      *,
      courier_partners(courier_name, name)
    `)
    .eq('zone_from', pickup_zone)
    .eq('zone_to', delivery_zone)
    .eq('service_type', service_type)
    .eq('is_active', true)
    .lte('weight_from', weight_kg)
    .gte('weight_to', weight_kg);

  if (error) throw new Error('Failed to fetch zone rates');

  const calculatedRates = zoneRates.map(rate => {
    const weight_charges = weight_kg > 1 ? (weight_kg - 1) * rate.per_kg_rate : 0;
    const total_cost = rate.base_rate + weight_charges + (rate.cod_charge || 0);

    return {
      courier: rate.courier_partners.courier_name,
      courier_display_name: rate.courier_partners.name,
      zone_from: rate.zone_from,
      zone_to: rate.zone_to,
      service_type: rate.service_type,
      base_rate: rate.base_rate,
      per_kg_rate: rate.per_kg_rate,
      weight_charges,
      cod_charge: rate.cod_charge || 0,
      total_cost,
      effective_period: {
        from: rate.effective_from,
        to: rate.effective_to
      }
    };
  });

  return new Response(JSON.stringify({
    success: true,
    zone_rates: {
      pickup_zone,
      delivery_zone,
      weight_kg,
      service_type,
      available_rates: calculatedRates,
      zone_info: {
        pickup: BANGLADESH_ZONES[pickup_zone] || { type: 'unknown', tier: 4 },
        delivery: BANGLADESH_ZONES[delivery_zone] || { type: 'unknown', tier: 4 }
      }
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function bulkRateCalculation(data: any, supabaseClient: any) {
  const { shipments } = data;
  const results = [];

  for (const shipment of shipments) {
    try {
      const rateResponse = await calculateShippingRates(shipment, supabaseClient);
      const rateData = await rateResponse.json();
      
      results.push({
        shipment_ref: shipment.reference || shipment.order_id,
        success: true,
        rates: rateData.shipping_calculation.available_rates,
        best_rate: rateData.shipping_calculation.best_rates.standard || null
      });
    } catch (error) {
      results.push({
        shipment_ref: shipment.reference || shipment.order_id,
        success: false,
        error: error.message
      });
    }
  }

  const summary = {
    total_shipments: shipments.length,
    successful_calculations: results.filter(r => r.success).length,
    failed_calculations: results.filter(r => !r.success).length,
    total_estimated_cost: results
      .filter(r => r.success && r.best_rate)
      .reduce((sum, r) => sum + r.best_rate.total_cost, 0)
  };

  return new Response(JSON.stringify({
    success: true,
    bulk_calculation: {
      summary,
      results
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function calculateDynamicPricing(data: any, supabaseClient: any) {
  const { 
    pickup_address, 
    delivery_address, 
    package_details, 
    service_type,
    time_of_day,
    demand_factor = 1.0,
    seasonal_factor = 1.0 
  } = data;

  // Get base rates
  const baseRatesResponse = await calculateShippingRates({
    pickup_address,
    delivery_address,
    package_details,
    service_types: [service_type]
  }, supabaseClient);

  const baseRatesData = await baseRatesResponse.json();
  const baseRates = baseRatesData.shipping_calculation.available_rates;

  // Apply dynamic pricing factors
  const dynamicRates = baseRates.map(rate => {
    let dynamic_multiplier = 1.0;

    // Time-based pricing
    if (time_of_day) {
      const hour = new Date(time_of_day).getHours();
      if (hour >= 18 || hour <= 6) {
        dynamic_multiplier *= 1.15; // 15% surcharge for night delivery
      } else if (hour >= 12 && hour <= 14) {
        dynamic_multiplier *= 1.05; // 5% surcharge for lunch hour
      }
    }

    // Apply demand and seasonal factors
    dynamic_multiplier *= demand_factor * seasonal_factor;

    // Special surge pricing for festivals
    if (isFestivalPeriod()) {
      dynamic_multiplier *= 1.25; // 25% festival surcharge
    }

    const surge_amount = Math.round((rate.total_cost * dynamic_multiplier) - rate.total_cost);

    return {
      ...rate,
      original_cost: rate.total_cost,
      dynamic_multiplier: parseFloat(dynamic_multiplier.toFixed(2)),
      surge_amount,
      final_cost: Math.round(rate.total_cost * dynamic_multiplier),
      pricing_factors: {
        base_rate: rate.total_cost,
        time_adjustment: time_of_day ? calculateTimeAdjustment(time_of_day) : 0,
        demand_adjustment: Math.round(rate.total_cost * (demand_factor - 1)),
        seasonal_adjustment: Math.round(rate.total_cost * (seasonal_factor - 1)),
        festival_surcharge: isFestivalPeriod() ? Math.round(rate.total_cost * 0.25) : 0
      }
    };
  });

  return new Response(JSON.stringify({
    success: true,
    dynamic_pricing: {
      base_calculation: baseRatesData.shipping_calculation,
      dynamic_rates: dynamicRates,
      pricing_context: {
        demand_factor,
        seasonal_factor,
        time_of_day,
        is_festival_period: isFestivalPeriod(),
        pricing_timestamp: new Date().toISOString()
      }
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function calculateVolumeDiscounts(data: any, supabaseClient: any) {
  const { vendor_id, monthly_volume, package_details, pickup_address, delivery_address } = data;

  // Get vendor's shipping volume for discount tier
  const discountTier = getVolumeDiscountTier(monthly_volume);

  // Calculate base rates
  const baseRatesResponse = await calculateShippingRates({
    pickup_address,
    delivery_address,
    package_details,
    service_types: ['standard', 'express']
  }, supabaseClient);

  const baseRatesData = await baseRatesResponse.json();
  const baseRates = baseRatesData.shipping_calculation.available_rates;

  // Apply volume discounts
  const discountedRates = baseRates.map(rate => {
    const discount_percentage = discountTier.discount_percentage;
    const discount_amount = Math.round(rate.total_cost * discount_percentage / 100);
    const discounted_cost = rate.total_cost - discount_amount;

    return {
      ...rate,
      original_cost: rate.total_cost,
      discount_tier: discountTier.tier,
      discount_percentage,
      discount_amount,
      discounted_cost,
      monthly_savings_estimate: Math.round(discount_amount * monthly_volume)
    };
  });

  return new Response(JSON.stringify({
    success: true,
    volume_discounts: {
      vendor_id,
      current_volume: monthly_volume,
      discount_tier: discountTier,
      discounted_rates,
      next_tier_info: getNextDiscountTier(monthly_volume),
      annual_savings_estimate: discountedRates.length > 0 
        ? Math.round(discountedRates[0].discount_amount * monthly_volume * 12) 
        : 0
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function calculateCODCharges(data: any, supabaseClient: any) {
  const { cod_amount, courier_name, delivery_zone } = data;

  // Get COD charge structure for different couriers
  const codCharges = {
    pathao: {
      percentage: 1.5,
      minimum: 15,
      maximum: 100
    },
    paperfly: {
      percentage: 1.2,
      minimum: 10,
      maximum: 80
    },
    redx: {
      percentage: 2.0,
      minimum: 20,
      maximum: 120
    },
    ecourier: {
      percentage: 1.8,
      minimum: 12,
      maximum: 90
    },
    sundarban: {
      percentage: 1.0,
      minimum: 8,
      maximum: 60
    }
  };

  const results = [];

  if (courier_name) {
    // Calculate for specific courier
    const charge = calculateCODCharge(cod_amount, codCharges[courier_name]);
    results.push({
      courier: courier_name,
      cod_amount,
      charge_percentage: codCharges[courier_name].percentage,
      calculated_charge: charge,
      total_collection: cod_amount + charge
    });
  } else {
    // Calculate for all couriers
    Object.keys(codCharges).forEach(courier => {
      const charge = calculateCODCharge(cod_amount, codCharges[courier]);
      results.push({
        courier,
        cod_amount,
        charge_percentage: codCharges[courier].percentage,
        calculated_charge: charge,
        total_collection: cod_amount + charge
      });
    });
  }

  return new Response(JSON.stringify({
    success: true,
    cod_charges: {
      original_amount: cod_amount,
      delivery_zone,
      courier_charges: results,
      best_rate: results.reduce((best, current) => 
        current.calculated_charge < best.calculated_charge ? current : best, results[0])
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function calculateFuelSurcharge(data: any, supabaseClient: any) {
  const { base_shipping_cost, distance_km, current_fuel_price } = data;

  // Current fuel surcharge calculation (3% of base cost + distance-based)
  const base_surcharge_percentage = 3;
  const distance_surcharge_per_km = 0.5;

  const base_surcharge = Math.round(base_shipping_cost * base_surcharge_percentage / 100);
  const distance_surcharge = Math.round(distance_km * distance_surcharge_per_km);
  const total_surcharge = base_surcharge + distance_surcharge;

  // Historical comparison
  const historical_rates = [
    { month: 'Previous', percentage: 2.5, amount: Math.round(base_shipping_cost * 2.5 / 100) },
    { month: 'Current', percentage: base_surcharge_percentage, amount: base_surcharge },
    { month: 'Projected', percentage: 3.5, amount: Math.round(base_shipping_cost * 3.5 / 100) }
  ];

  return new Response(JSON.stringify({
    success: true,
    fuel_surcharge: {
      base_shipping_cost,
      distance_km,
      calculation: {
        base_surcharge_percentage,
        base_surcharge,
        distance_surcharge_per_km,
        distance_surcharge,
        total_surcharge
      },
      historical_comparison: historical_rates,
      total_with_surcharge: base_shipping_cost + total_surcharge
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function calculateExpressRates(data: any, supabaseClient: any) {
  const { pickup_address, delivery_address, package_details, urgency_level = 'standard' } = data;

  // Express service multipliers
  const expressMultipliers = {
    'same_day': 2.5,
    'next_day': 1.8,
    'express': 1.5,
    'standard': 1.0
  };

  // Get standard rates first
  const standardRatesResponse = await calculateShippingRates({
    pickup_address,
    delivery_address,
    package_details,
    service_types: ['standard']
  }, supabaseClient);

  const standardData = await standardRatesResponse.json();
  const standardRates = standardData.shipping_calculation.available_rates;

  // Calculate express rates
  const expressRates = [];

  Object.keys(expressMultipliers).forEach(service_type => {
    standardRates.forEach(rate => {
      if (isCourierServiceAvailable(rate.courier_name, service_type, pickup_address, delivery_address)) {
        const multiplier = expressMultipliers[service_type];
        const express_cost = Math.round(rate.total_cost * multiplier);
        const delivery_hours = getExpressDeliveryTime(service_type);

        expressRates.push({
          ...rate,
          service_type,
          standard_cost: rate.total_cost,
          express_multiplier: multiplier,
          express_cost,
          additional_cost: express_cost - rate.total_cost,
          estimated_delivery_hours: delivery_hours,
          delivery_window: getDeliveryWindow(service_type),
          guarantees: getServiceGuarantees(service_type)
        });
      }
    });
  });

  return new Response(JSON.stringify({
    success: true,
    express_rates: {
      standard_baseline: standardRates,
      express_options: expressRates,
      urgency_recommendations: getUrgencyRecommendations(urgency_level, expressRates)
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function calculateInternationalRates(data: any, supabaseClient: any) {
  const { 
    pickup_address, 
    delivery_country, 
    package_details, 
    service_type = 'standard',
    customs_value,
    shipping_method = 'air' 
  } = data;

  // International shipping rates (mock data)
  const internationalRates = {
    'india': { base: 800, per_kg: 150, customs_fee: 100, transit_days: 7 },
    'china': { base: 1200, per_kg: 200, customs_fee: 150, transit_days: 10 },
    'usa': { base: 2500, per_kg: 400, customs_fee: 300, transit_days: 15 },
    'uk': { base: 2200, per_kg: 380, customs_fee: 280, transit_days: 12 },
    'uae': { base: 1500, per_kg: 250, customs_fee: 120, transit_days: 8 }
  };

  const countryRate = internationalRates[delivery_country.toLowerCase()];
  
  if (!countryRate) {
    return new Response(JSON.stringify({ 
      error: 'International shipping not available to this country' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const weight = package_details.weight || 1;
  const base_cost = countryRate.base;
  const weight_cost = weight > 0.5 ? (weight - 0.5) * countryRate.per_kg : 0;
  const customs_fee = countryRate.customs_fee;
  const insurance = customs_value > 1000 ? customs_value * 0.01 : 0;
  const handling_fee = 200;

  const total_cost = base_cost + weight_cost + customs_fee + insurance + handling_fee;

  return new Response(JSON.stringify({
    success: true,
    international_shipping: {
      destination_country: delivery_country,
      shipping_method,
      package_weight: weight,
      customs_value,
      cost_breakdown: {
        base_cost,
        weight_cost,
        customs_fee,
        insurance,
        handling_fee,
        total_cost: Math.round(total_cost)
      },
      transit_info: {
        estimated_transit_days: countryRate.transit_days,
        tracking_available: true,
        insurance_included: insurance > 0
      },
      documentation_required: [
        'Commercial Invoice',
        'Packing List',
        'Customs Declaration',
        'Export Permit (if applicable)'
      ]
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Helper functions
function getZoneFromAddress(address: any): string {
  const city = address.city?.toLowerCase() || '';
  
  if (BANGLADESH_ZONES[city]) {
    return city;
  }
  
  // Default zone mapping based on district
  const district = address.district?.toLowerCase() || '';
  if (district.includes('dhaka')) return 'dhaka';
  if (district.includes('chittagong')) return 'chittagong';
  if (district.includes('sylhet')) return 'sylhet';
  
  return 'other';
}

function getZoneInfo(address: any) {
  const zone = getZoneFromAddress(address);
  return {
    zone_code: zone,
    zone_info: BANGLADESH_ZONES[zone] || { type: 'other', tier: 4 }
  };
}

function calculateDistance(pickup: any, delivery: any): number {
  const pickupCity = pickup.city?.toLowerCase() || '';
  const deliveryCity = delivery.city?.toLowerCase() || '';
  
  const key = `${pickupCity}-${deliveryCity}`;
  const reverseKey = `${deliveryCity}-${pickupCity}`;
  
  return ZONE_DISTANCES[key] || ZONE_DISTANCES[reverseKey] || 100;
}

function checkCoverage(city: string, coverageAreas: any[], courierName: string): boolean {
  if (!coverageAreas.length) return true; // No restrictions
  
  return coverageAreas.some(area => 
    area.toLowerCase().includes(city) || 
    city.includes(area.toLowerCase()) ||
    area.toLowerCase() === 'nationwide'
  );
}

function getCourierBaseRate(courierName: string, serviceType: string): number {
  const baseRates = {
    pathao: { same_day: 100, express: 80, standard: 60 },
    paperfly: { express: 70, standard: 50, economy: 40 },
    redx: { express: 90, standard: 70 },
    ecourier: { express: 85, standard: 65, bulk: 45 },
    sundarban: { standard: 45, economy: 35 }
  };

  return baseRates[courierName]?.[serviceType] || 60;
}

function getCODCharge(courierName: string): number {
  const codCharges = {
    pathao: 15,
    paperfly: 10,
    redx: 20,
    ecourier: 12,
    sundarban: 8
  };

  return codCharges[courierName] || 15;
}

function getServiceCharges(serviceType: string, courierName: string): number {
  if (serviceType === 'same_day') return 50;
  if (serviceType === 'express') return 25;
  return 0;
}

function getCourierFeatures(courierName: string, serviceType: string): string[] {
  const features = {
    pathao: ['Real-time tracking', 'Same-day delivery', 'COD collection'],
    paperfly: ['Nationwide coverage', 'Rural delivery', 'Bulk shipping'],
    redx: ['GPS tracking', 'Mobile app', 'Digital payments'],
    ecourier: ['E-commerce focused', 'Return handling', 'Vendor dashboard'],
    sundarban: ['Economic pricing', 'Remote area coverage', 'Traditional service']
  };

  return features[courierName] || ['Standard delivery'];
}

function calculateDeliveryTime(pickup: any, delivery: any, serviceType: string, courierName: string) {
  const baseHours = {
    same_day: 8,
    express: 24,
    standard: 72,
    economy: 120
  };

  const hours = baseHours[serviceType] || 72;
  const deliveryDate = new Date();
  deliveryDate.setHours(deliveryDate.getHours() + hours);

  return {
    hours,
    date: deliveryDate.toISOString(),
    pickup_time: 'Within 2-4 hours'
  };
}

function getCourierDefaultPricing(courier: any, serviceType: string) {
  return {
    base_rate: getCourierBaseRate(courier.courier_name, serviceType),
    per_kg_rate: 20,
    cod_charge: getCODCharge(courier.courier_name)
  };
}

function generateRateRecommendations(rates: any[]) {
  if (!rates.length) return [];

  const recommendations = [];

  // Best value recommendation
  recommendations.push({
    type: 'best_value',
    courier: rates[0].courier_name,
    reason: 'Lowest total cost',
    savings: rates.length > 1 ? rates[1].total_cost - rates[0].total_cost : 0
  });

  // Fastest delivery
  const fastest = rates.reduce((fast, rate) => 
    rate.estimated_delivery_hours < fast.estimated_delivery_hours ? rate : fast, rates[0]);
  
  if (fastest.courier_name !== rates[0].courier_name) {
    recommendations.push({
      type: 'fastest_delivery',
      courier: fastest.courier_name,
      reason: `Fastest delivery in ${fastest.estimated_delivery_hours} hours`,
      extra_cost: fastest.total_cost - rates[0].total_cost
    });
  }

  return recommendations;
}

function calculateValueScore(rate: any, allRates: any[]): number {
  const maxCost = Math.max(...allRates.map(r => r.total_cost));
  const minCost = Math.min(...allRates.map(r => r.total_cost));
  
  if (maxCost === minCost) return 100;
  
  return Math.round(((maxCost - rate.total_cost) / (maxCost - minCost)) * 100);
}

function calculateSpeedScore(rate: any, allRates: any[]): number {
  const maxHours = Math.max(...allRates.map(r => r.estimated_delivery_hours));
  const minHours = Math.min(...allRates.map(r => r.estimated_delivery_hours));
  
  if (maxHours === minHours) return 100;
  
  return Math.round(((maxHours - rate.estimated_delivery_hours) / (maxHours - minHours)) * 100);
}

function getCourierReliability(courierName: string): number {
  const reliabilityScores = {
    pathao: 92,
    paperfly: 88,
    redx: 89,
    ecourier: 91,
    sundarban: 85
  };

  return reliabilityScores[courierName] || 85;
}

function getVolumeDiscountTier(monthlyVolume: number) {
  if (monthlyVolume >= 1000) return { tier: 'platinum', discount_percentage: 15 };
  if (monthlyVolume >= 500) return { tier: 'gold', discount_percentage: 10 };
  if (monthlyVolume >= 200) return { tier: 'silver', discount_percentage: 7 };
  if (monthlyVolume >= 50) return { tier: 'bronze', discount_percentage: 5 };
  return { tier: 'standard', discount_percentage: 0 };
}

function getNextDiscountTier(currentVolume: number) {
  if (currentVolume < 50) return { tier: 'bronze', required_volume: 50, discount_percentage: 5 };
  if (currentVolume < 200) return { tier: 'silver', required_volume: 200, discount_percentage: 7 };
  if (currentVolume < 500) return { tier: 'gold', required_volume: 500, discount_percentage: 10 };
  if (currentVolume < 1000) return { tier: 'platinum', required_volume: 1000, discount_percentage: 15 };
  return null;
}

function calculateCODCharge(amount: number, chargeStructure: any): number {
  const percentageCharge = Math.round(amount * chargeStructure.percentage / 100);
  return Math.max(chargeStructure.minimum, Math.min(percentageCharge, chargeStructure.maximum));
}

function isFestivalPeriod(): boolean {
  // Mock festival period detection
  const now = new Date();
  const month = now.getMonth() + 1;
  
  // Ramadan, Eid periods, Durga Puja, etc.
  return [4, 5, 9, 10, 12].includes(month);
}

function calculateTimeAdjustment(timeOfDay: string): number {
  const hour = new Date(timeOfDay).getHours();
  if (hour >= 18 || hour <= 6) return 15; // Night surcharge
  if (hour >= 12 && hour <= 14) return 5; // Lunch hour surcharge
  return 0;
}

function isCourierServiceAvailable(courierName: string, serviceType: string, pickup: any, delivery: any): boolean {
  const serviceAvailability = {
    pathao: ['same_day', 'next_day', 'express', 'standard'],
    paperfly: ['express', 'standard', 'economy'],
    redx: ['next_day', 'express', 'standard'],
    ecourier: ['express', 'standard'],
    sundarban: ['standard', 'economy']
  };

  return serviceAvailability[courierName]?.includes(serviceType) || false;
}

function getExpressDeliveryTime(serviceType: string): number {
  const times = {
    same_day: 8,
    next_day: 24,
    express: 48,
    standard: 72
  };

  return times[serviceType] || 72;
}

function getDeliveryWindow(serviceType: string): string {
  const windows = {
    same_day: '2-8 hours',
    next_day: '18-24 hours',
    express: '24-48 hours',
    standard: '48-72 hours'
  };

  return windows[serviceType] || '2-3 days';
}

function getServiceGuarantees(serviceType: string): string[] {
  const guarantees = {
    same_day: ['Money back if not delivered same day', 'Real-time tracking'],
    next_day: ['Next business day delivery', 'SMS notifications'],
    express: ['Priority handling', 'Tracking updates'],
    standard: ['Standard delivery guarantee']
  };

  return guarantees[serviceType] || ['Standard service'];
}

function getUrgencyRecommendations(urgencyLevel: string, expressRates: any[]) {
  switch (urgencyLevel) {
    case 'urgent':
      return expressRates.filter(r => r.service_type === 'same_day');
    case 'high':
      return expressRates.filter(r => ['same_day', 'next_day'].includes(r.service_type));
    case 'medium':
      return expressRates.filter(r => ['next_day', 'express'].includes(r.service_type));
    default:
      return expressRates.filter(r => ['express', 'standard'].includes(r.service_type));
  }
}