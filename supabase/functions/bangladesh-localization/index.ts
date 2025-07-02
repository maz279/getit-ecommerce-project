import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LocalizationRequest {
  action: 'get_translations' | 'get_currency_rate' | 'get_prayer_times' | 'get_festival_info';
  language?: 'en' | 'bn';
  category?: string;
  fromCurrency?: string;
  toCurrency?: string;
  city?: string;
  date?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, language = 'en', category, fromCurrency, toCurrency, city, date }: LocalizationRequest = 
      await req.json();

    let result;

    switch (action) {
      case 'get_translations':
        const translationsQuery = supabase
          .from('bengali_translations')
          .select('key, english_text, bengali_text');
        
        if (category) {
          translationsQuery.eq('category', category);
        }

        const { data: translations, error: translationsError } = await translationsQuery;
        
        if (translationsError) throw translationsError;

        // Convert to key-value format
        result = translations?.reduce((acc, item) => {
          acc[item.key] = language === 'bn' ? item.bengali_text : item.english_text;
          return acc;
        }, {} as Record<string, string>) || {};
        break;

      case 'get_currency_rate':
        if (!fromCurrency || !toCurrency) {
          throw new Error('fromCurrency and toCurrency are required');
        }

        const { data: currencyData, error: currencyError } = await supabase
          .from('currency_rates')
          .select('rate, updated_at')
          .eq('from_currency', fromCurrency)
          .eq('to_currency', toCurrency)
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (currencyError) throw currencyError;

        if (!currencyData || currencyData.length === 0) {
          // If rate not found, try to fetch from external API (fallback)
          try {
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
            const data = await response.json();
            const rate = data.rates[toCurrency];
            
            if (rate) {
              // Store the rate for future use
              await supabase
                .from('currency_rates')
                .insert({
                  from_currency: fromCurrency,
                  to_currency: toCurrency,
                  rate: rate,
                  provider: 'exchange_rate_api'
                });
              
              result = { rate, last_updated: new Date().toISOString() };
            } else {
              throw new Error('Currency rate not available');
            }
          } catch {
            result = { rate: 1, last_updated: new Date().toISOString() }; // Default fallback
          }
        } else {
          result = {
            rate: currencyData[0].rate,
            last_updated: currencyData[0].updated_at
          };
        }
        break;

      case 'get_prayer_times':
        if (!city || !date) {
          throw new Error('city and date are required');
        }

        const { data: prayerData, error: prayerError } = await supabase
          .from('prayer_times')
          .select('*')
          .eq('city', city)
          .eq('date', date)
          .limit(1);

        if (prayerError) throw prayerError;

        if (!prayerData || prayerData.length === 0) {
          // If prayer times not found, calculate or fetch from external API
          // For now, return default times (this should be replaced with actual calculation)
          result = {
            fajr: '05:30',
            sunrise: '06:00',
            dhuhr: '12:15',
            asr: '15:45',
            maghrib: '18:30',
            isha: '19:45'
          };
        } else {
          result = prayerData[0];
        }
        break;

      case 'get_festival_info':
        const currentDate = new Date().toISOString().split('T')[0];
        
        const { data: festivalData, error: festivalError } = await supabase
          .from('festival_configurations')
          .select('*')
          .eq('is_active', true)
          .gte('end_date', currentDate)
          .lte('start_date', currentDate);

        if (festivalError) throw festivalError;

        result = festivalData || [];
        break;

      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Bangladesh Localization Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});