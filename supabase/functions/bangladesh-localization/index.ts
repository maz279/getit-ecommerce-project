import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, ...params } = await req.json()

    switch (action) {
      case 'get_currency_rate':
        return await handleCurrencyRate(supabase, params)
      case 'get_festival_info':
        return await handleFestivalInfo(supabase, params)
      case 'get_localization':
        return await handleLocalization(supabase, params)
      case 'get_delivery_zones':
        return await handleDeliveryZones(supabase, params)
      case 'translate_content':
        return await handleTranslation(supabase, params)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Bangladesh localization error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleCurrencyRate(supabase: any, params: any) {
  const { fromCurrency, toCurrency } = params

  // Try to get from database first
  const { data: dbRate, error: dbError } = await supabase
    .from('bd_currency_rates')
    .select('*')
    .eq('from_currency', fromCurrency)
    .eq('to_currency', toCurrency)
    .eq('is_active', true)
    .single()

  if (dbRate && !dbError) {
    // Check if rate is recent (less than 1 hour old)
    const lastUpdated = new Date(dbRate.last_updated)
    const now = new Date()
    const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60)

    if (hoursSinceUpdate < 1) {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            rate: dbRate.rate,
            last_updated: dbRate.last_updated,
            source: 'database'
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  // Fetch fresh rate from external API (mock implementation)
  const mockRates: Record<string, Record<string, number>> = {
    'USD': { 'BDT': 110.50, 'EUR': 0.85, 'GBP': 0.79 },
    'EUR': { 'BDT': 120.75, 'USD': 1.18 },
    'GBP': { 'BDT': 138.90, 'USD': 1.27 },
    'BDT': { 'USD': 0.0090, 'EUR': 0.0083, 'GBP': 0.0072 }
  }

  const rate = mockRates[fromCurrency]?.[toCurrency]
  if (!rate) {
    throw new Error('Currency pair not supported')
  }

  // Update database
  await supabase
    .from('bd_currency_rates')
    .upsert({
      from_currency: fromCurrency,
      to_currency: toCurrency,
      rate: rate,
      last_updated: new Date().toISOString(),
      source: 'api'
    })

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        rate: rate,
        last_updated: new Date().toISOString(),
        source: 'api'
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleFestivalInfo(supabase: any, params: any) {
  const today = new Date().toISOString().split('T')[0]

  const { data: festivals, error } = await supabase
    .from('bd_festival_configs')
    .select('*')
    .lte('start_date', today)
    .gte('end_date', today)
    .eq('is_active', true)
    .order('start_date', { ascending: true })

  if (error) throw error

  return new Response(
    JSON.stringify({
      success: true,
      data: festivals || []
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleLocalization(supabase: any, params: any) {
  const { category, language = 'en', keys } = params

  let query = supabase
    .from('bd_localization_content')
    .select('*')

  if (category) {
    query = query.eq('category', category)
  }

  if (keys && Array.isArray(keys)) {
    query = query.in('content_key', keys)
  }

  const { data: content, error } = await query

  if (error) throw error

  // Transform data based on language preference
  const localizedContent = content?.reduce((acc: any, item: any) => {
    const text = language === 'bn' ? item.bengali_content : item.english_content
    acc[item.content_key] = {
      text: text || item.english_content, // fallback to English
      context: item.context_data,
      verified: item.is_verified
    }
    return acc
  }, {})

  return new Response(
    JSON.stringify({
      success: true,
      data: localizedContent || {}
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleDeliveryZones(supabase: any, params: any) {
  const { postalCode, district, zoneType } = params

  let query = supabase
    .from('bd_delivery_zones')
    .select('*')
    .eq('is_active', true)

  if (postalCode) {
    query = query.contains('postal_codes', [postalCode])
  }

  if (district) {
    query = query.contains('districts', [district])
  }

  if (zoneType) {
    query = query.eq('zone_type', zoneType)
  }

  const { data: zones, error } = await query.order('delivery_time_hours', { ascending: true })

  if (error) throw error

  return new Response(
    JSON.stringify({
      success: true,
      data: zones || []
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleTranslation(supabase: any, params: any) {
  const { text, fromLanguage = 'en', toLanguage = 'bn', category = 'general' } = params

  // Simple mock translation service
  const translations: Record<string, string> = {
    'Hello': 'হ্যালো',
    'Welcome': 'স্বাগতম',
    'Thank you': 'ধন্যবাদ',
    'Please': 'দয়া করে',
    'Order': 'অর্ডার',
    'Product': 'পণ্য',
    'Price': 'দাম',
    'Cart': 'কার্ট',
    'Checkout': 'চেকআউট',
    'Payment': 'পেমেন্ট',
    'Delivery': 'ডেলিভারি',
    'Shop Now': 'এখনই কিনুন',
    'Add to Cart': 'কার্টে যোগ করুন',
    'Buy Now': 'এখনই কিনুন'
  }

  let translatedText = text
  if (fromLanguage === 'en' && toLanguage === 'bn') {
    translatedText = translations[text] || text
  }

  // Store translation for future use
  await supabase
    .from('bd_localization_content')
    .upsert({
      content_key: text.toLowerCase().replace(/\s+/g, '_'),
      content_type: 'text',
      english_content: fromLanguage === 'en' ? text : translatedText,
      bengali_content: toLanguage === 'bn' ? translatedText : text,
      category: category,
      is_verified: false
    })

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        original: text,
        translated: translatedText,
        fromLanguage,
        toLanguage
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}