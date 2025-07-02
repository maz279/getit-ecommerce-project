import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RegionConfig {
  regionCode: string;
  currency: string;
  timezone: string;
  language: string;
  taxRate: number;
  vatRate: number;
  shippingZones: string[];
}

interface LocalizationRequest {
  contentType: string;
  contentId: string;
  regionId: string;
  targetLanguage: string;
  content: any;
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
    const action = url.searchParams.get('action') || 'get_config';

    switch (action) {
      case 'get_config':
        return await getRegionalConfig(supabaseClient, req);
      
      case 'localize_content':
        return await localizeContent(supabaseClient, req);
      
      case 'get_inventory':
        return await getRegionalInventory(supabaseClient, req);
      
      case 'sync_inventory':
        return await syncRegionalInventory(supabaseClient, req);
      
      case 'calculate_pricing':
        return await calculateRegionalPricing(supabaseClient, req);
      
      case 'get_shipping':
        return await getShippingOptions(supabaseClient, req);
      
      case 'compliance_check':
        return await performComplianceCheck(supabaseClient, req);
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in multi-region-orchestrator:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getRegionalConfig(supabaseClient: any, req: Request): Promise<Response> {
  const url = new URL(req.url);
  const regionCode = url.searchParams.get('region') || 'BD-DH';
  
  const { data: region } = await supabaseClient
    .from('geo_regions')
    .select('*')
    .eq('region_code', regionCode)
    .eq('is_active', true)
    .single();

  if (!region) {
    return new Response(JSON.stringify({ error: 'Region not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Get region-specific configurations
  const config: RegionConfig = {
    regionCode: region.region_code,
    currency: region.currency_code,
    timezone: region.timezone,
    language: region.primary_language,
    taxRate: region.regulatory_requirements?.tax_rate || 15,
    vatRate: region.regulatory_requirements?.vat_rate || 7.5,
    shippingZones: region.shipping_zones || []
  };

  // Add localized content availability
  const { data: localizedContent } = await supabaseClient
    .from('content_localization')
    .select('content_type, content_id')
    .eq('region_id', region.id)
    .eq('translation_status', 'approved');

  const availableLocalizations = localizedContent?.reduce((acc: any, item: any) => {
    if (!acc[item.content_type]) acc[item.content_type] = [];
    acc[item.content_type].push(item.content_id);
    return acc;
  }, {}) || {};

  return new Response(JSON.stringify({ 
    config, 
    availableLocalizations,
    features: {
      dataLocalization: region.regulatory_requirements?.data_localization || false,
      kycRequired: region.regulatory_requirements?.kyc_required || false,
      multiCurrency: region.supported_languages?.length > 1,
      regionalShipping: region.shipping_zones?.length > 0
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function localizeContent(supabaseClient: any, req: Request): Promise<Response> {
  const localizationRequest: LocalizationRequest = await req.json();
  
  // Check if localization already exists
  const { data: existingLocalization } = await supabaseClient
    .from('content_localization')
    .select('*')
    .eq('content_type', localizationRequest.contentType)
    .eq('content_id', localizationRequest.contentId)
    .eq('region_id', localizationRequest.regionId)
    .eq('language_code', localizationRequest.targetLanguage)
    .single();

  if (existingLocalization) {
    return new Response(JSON.stringify({ 
      localization: existingLocalization,
      cached: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Generate new localization
  const localizedContent = await generateLocalizedContent(
    localizationRequest.content,
    localizationRequest.targetLanguage
  );

  // Save localization
  const { data: newLocalization } = await supabaseClient
    .from('content_localization')
    .insert({
      content_type: localizationRequest.contentType,
      content_id: localizationRequest.contentId,
      region_id: localizationRequest.regionId,
      language_code: localizationRequest.targetLanguage,
      original_content: localizationRequest.content,
      localized_content: localizedContent,
      translation_confidence: 0.8
    })
    .select()
    .single();

  return new Response(JSON.stringify({ 
    localization: newLocalization,
    cached: false 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getRegionalInventory(supabaseClient: any, req: Request): Promise<Response> {
  const url = new URL(req.url);
  const regionCode = url.searchParams.get('region');
  const productId = url.searchParams.get('productId');
  
  if (!regionCode) {
    return new Response(JSON.stringify({ error: 'Region required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data: region } = await supabaseClient
    .from('geo_regions')
    .select('id')
    .eq('region_code', regionCode)
    .single();

  if (!region) {
    return new Response(JSON.stringify({ error: 'Region not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let query = supabaseClient
    .from('regional_inventory')
    .select(`
      *,
      products(name, price, images),
      geo_regions(region_name, currency_code)
    `)
    .eq('region_id', region.id);

  if (productId) {
    query = query.eq('product_id', productId);
  }

  const { data: inventory } = await query;

  // Calculate availability and pricing
  const enhancedInventory = inventory?.map((item: any) => ({
    ...item,
    availability: {
      status: item.available_stock > 0 ? 'in_stock' : 'out_of_stock',
      quantity: item.available_stock,
      estimatedRestockDate: item.available_stock === 0 ? 
        new Date(Date.now() + (item.lead_time_days || 7) * 24 * 60 * 60 * 1000) : null
    },
    pricing: {
      basePrice: item.products?.price || 0,
      regionalPrice: item.regional_pricing?.price || item.products?.price || 0,
      currency: item.geo_regions?.currency_code || 'BDT',
      priceAdjustmentReason: item.regional_pricing?.adjustment_reason
    }
  })) || [];

  return new Response(JSON.stringify({ inventory: enhancedInventory }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function syncRegionalInventory(supabaseClient: any, req: Request): Promise<Response> {
  const { productId, updates } = await req.json();
  
  if (!productId || !updates) {
    return new Response(JSON.stringify({ error: 'Product ID and updates required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const syncResults = [];

  for (const update of updates) {
    try {
      const { data: result } = await supabaseClient
        .from('regional_inventory')
        .upsert({
          product_id: productId,
          region_id: update.regionId,
          current_stock: update.stock,
          regional_pricing: update.pricing || {},
          shipping_options: update.shippingOptions || [],
          last_restocked: new Date().toISOString()
        }, {
          onConflict: 'product_id,region_id'
        })
        .select()
        .single();

      syncResults.push({
        regionId: update.regionId,
        status: 'success',
        result
      });
    } catch (error) {
      syncResults.push({
        regionId: update.regionId,
        status: 'error',
        error: error.message
      });
    }
  }

  return new Response(JSON.stringify({ syncResults }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function calculateRegionalPricing(supabaseClient: any, req: Request): Promise<Response> {
  const { productId, regionCode, basePrice } = await req.json();
  
  const { data: region } = await supabaseClient
    .from('geo_regions')
    .select('*')
    .eq('region_code', regionCode)
    .single();

  if (!region) {
    return new Response(JSON.stringify({ error: 'Region not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Calculate regional pricing adjustments
  const taxRate = region.regulatory_requirements?.tax_rate || 15;
  const vatRate = region.regulatory_requirements?.vat_rate || 7.5;
  const shippingCost = calculateShippingCost(region.region_code);
  
  const pricingBreakdown = {
    basePrice: basePrice,
    tax: (basePrice * taxRate) / 100,
    vat: (basePrice * vatRate) / 100,
    shippingCost: shippingCost,
    totalPrice: basePrice + (basePrice * taxRate) / 100 + (basePrice * vatRate) / 100 + shippingCost,
    currency: region.currency_code,
    breakdown: {
      subtotal: basePrice,
      taxAmount: (basePrice * taxRate) / 100,
      vatAmount: (basePrice * vatRate) / 100,
      shippingAmount: shippingCost,
      adjustments: []
    }
  };

  // Apply regional adjustments
  const regionalAdjustments = await applyRegionalAdjustments(
    supabaseClient, 
    productId, 
    region.id, 
    pricingBreakdown
  );

  return new Response(JSON.stringify({ pricing: regionalAdjustments }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getShippingOptions(supabaseClient: any, req: Request): Promise<Response> {
  const url = new URL(req.url);
  const regionCode = url.searchParams.get('region');
  const weight = parseFloat(url.searchParams.get('weight') || '1');
  const value = parseFloat(url.searchParams.get('value') || '100');
  
  const { data: region } = await supabaseClient
    .from('geo_regions')
    .select('*')
    .eq('region_code', regionCode)
    .single();

  if (!region) {
    return new Response(JSON.stringify({ error: 'Region not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Calculate shipping options based on region
  const shippingOptions = calculateShippingOptions(region, weight, value);

  return new Response(JSON.stringify({ shippingOptions }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function performComplianceCheck(supabaseClient: any, req: Request): Promise<Response> {
  const { regionCode, orderData } = await req.json();
  
  const { data: region } = await supabaseClient
    .from('geo_regions')
    .select('*')
    .eq('region_code', regionCode)
    .single();

  if (!region) {
    return new Response(JSON.stringify({ error: 'Region not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const complianceChecks = [];
  const requirements = region.regulatory_requirements || {};

  // Data localization check
  if (requirements.data_localization) {
    complianceChecks.push({
      type: 'data_localization',
      status: 'required',
      description: 'Order data must be stored locally in Bangladesh',
      compliant: true // Assume compliant for now
    });
  }

  // KYC verification check
  if (requirements.kyc_required && orderData.value > 50000) {
    complianceChecks.push({
      type: 'kyc_verification',
      status: 'required',
      description: 'KYC verification required for orders over ৳50,000',
      compliant: orderData.kycVerified || false
    });
  }

  // Tax compliance
  complianceChecks.push({
    type: 'tax_compliance',
    status: 'required',
    description: `Tax calculation at ${requirements.tax_rate || 15}%`,
    compliant: orderData.taxCalculated || false
  });

  const overallCompliance = complianceChecks.every(check => check.compliant);

  return new Response(JSON.stringify({ 
    compliance: {
      overall: overallCompliance,
      checks: complianceChecks,
      requiresAction: !overallCompliance
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Helper functions
async function generateLocalizedContent(content: any, targetLanguage: string): Promise<any> {
  if (targetLanguage === 'en') return content;
  
  // Simple localization - in production, integrate with translation services
  const localizedContent = { ...content };
  
  if (targetLanguage === 'bn') {
    // Example Bengali localizations
    const translations: { [key: string]: string } = {
      'Add to Cart': 'কার্টে যোগ করুন',
      'Buy Now': 'এখনই কিনুন',
      'Out of Stock': 'স্টক শেষ',
      'Free Shipping': 'বিনামূল্যে ডেলিভারি',
      'Product Details': 'পণ্যের বিবরণ'
    };
    
    for (const [key, value] of Object.entries(translations)) {
      if (typeof localizedContent === 'object') {
        Object.keys(localizedContent).forEach(field => {
          if (typeof localizedContent[field] === 'string' && localizedContent[field].includes(key)) {
            localizedContent[field] = localizedContent[field].replace(key, value);
          }
        });
      }
    }
  }
  
  return localizedContent;
}

function calculateShippingCost(regionCode: string): number {
  const baseCosts: { [key: string]: number } = {
    'BD-DH': 60,  // Dhaka
    'BD-CH': 80,  // Chittagong
    'BD-SY': 100, // Sylhet
    'BD-RJ': 90,  // Rajshahi
    'BD-KH': 85,  // Khulna
    'BD-BA': 95,  // Barisal
    'BD-RA': 110, // Rangpur
    'BD-MY': 95   // Mymensingh
  };
  
  return baseCosts[regionCode] || 100;
}

function calculateShippingOptions(region: any, weight: number, value: number) {
  const baseShippingCost = calculateShippingCost(region.region_code);
  
  return [
    {
      id: 'standard',
      name: 'Standard Delivery',
      cost: baseShippingCost,
      estimatedDays: 3,
      description: 'Regular delivery service'
    },
    {
      id: 'express',
      name: 'Express Delivery',
      cost: baseShippingCost * 1.5,
      estimatedDays: 1,
      description: 'Next day delivery service'
    },
    {
      id: 'free',
      name: 'Free Delivery',
      cost: 0,
      estimatedDays: 5,
      description: 'Free delivery for orders over ৳500',
      condition: value >= 500
    }
  ].filter(option => !option.condition || option.condition);
}

async function applyRegionalAdjustments(
  supabaseClient: any, 
  productId: string, 
  regionId: string, 
  pricing: any
): Promise<any> {
  // Get existing regional pricing
  const { data: regionalPricing } = await supabaseClient
    .from('regional_inventory')
    .select('regional_pricing')
    .eq('product_id', productId)
    .eq('region_id', regionId)
    .single();

  if (regionalPricing?.regional_pricing?.adjustments) {
    pricing.breakdown.adjustments = regionalPricing.regional_pricing.adjustments;
    
    // Apply adjustments to total
    const adjustmentTotal = regionalPricing.regional_pricing.adjustments
      .reduce((sum: number, adj: any) => sum + adj.amount, 0);
    
    pricing.totalPrice += adjustmentTotal;
    pricing.breakdown.adjustmentTotal = adjustmentTotal;
  }

  return pricing;
}