import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecommendationRequest {
  userId?: string;
  productId?: string;
  type: 'frequently_bought_together' | 'customers_also_viewed' | 'based_on_history' | 'trending' | 'seasonal' | 'cross_sell' | 'up_sell';
  limit?: number;
  categories?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    switch (req.method) {
      case 'POST':
        if (path === 'generate-recommendations') {
          const request: RecommendationRequest = await req.json();
          
          // Check for existing valid recommendations
          const { data: existingRecs } = await supabaseClient
            .from('ai_product_recommendations')
            .select('*')
            .eq('user_id', request.userId || null)
            .eq('recommendation_type', request.type)
            .gt('expires_at', new Date().toISOString())
            .limit(request.limit || 10);

          if (existingRecs && existingRecs.length > 0) {
            return new Response(
              JSON.stringify({ 
                recommendations: existingRecs,
                cached: true,
                generatedAt: new Date().toISOString()
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Generate new recommendations using AI/ML algorithms
          const recommendations = await generateRecommendations(supabaseClient, request);
          
          return new Response(
            JSON.stringify({ 
              recommendations,
              cached: false,
              generatedAt: new Date().toISOString()
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (path === 'track-interaction') {
          const { recommendationId, action } = await req.json();
          
          // Update recommendation interaction
          const updateData: any = { clicked: false, purchased: false };
          updateData[action] = true;
          
          if (action === 'purchased') {
            updateData.conversion_tracked = true;
          }

          const { error } = await supabaseClient
            .from('ai_product_recommendations')
            .update(updateData)
            .eq('id', recommendationId);

          if (error) {
            return new Response(
              JSON.stringify({ error: 'Failed to track interaction' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;

      case 'GET':
        if (path === 'user-recommendations') {
          const userId = url.searchParams.get('userId') || user?.id;
          const type = url.searchParams.get('type') || 'based_on_history';
          const limit = parseInt(url.searchParams.get('limit') || '10');

          const { data: recommendations } = await supabaseClient
            .from('ai_product_recommendations')
            .select(`
              *,
              products!inner(
                id, name, description, price, images, category, vendor_id, rating
              )
            `)
            .eq('user_id', userId)
            .eq('recommendation_type', type)
            .gt('expires_at', new Date().toISOString())
            .order('confidence_score', { ascending: false })
            .limit(limit);

          return new Response(
            JSON.stringify({ recommendations: recommendations || [] }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (path === 'trending') {
          const category = url.searchParams.get('category');
          const limit = parseInt(url.searchParams.get('limit') || '20');

          const trending = await getTrendingProducts(supabaseClient, category, limit);

          return new Response(
            JSON.stringify({ trending }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('AI recommendation engine error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateRecommendations(supabaseClient: any, request: RecommendationRequest) {
  switch (request.type) {
    case 'frequently_bought_together':
      return await generateFrequentlyBoughtTogether(supabaseClient, request);
    case 'trending':
      return await generateTrending(supabaseClient, request);
    case 'seasonal':
      return await generateSeasonal(supabaseClient, request);
    default:
      return [];
  }
}

async function generateFrequentlyBoughtTogether(supabaseClient: any, request: RecommendationRequest) {
  if (!request.productId) return [];

  const { data: relatedProducts } = await supabaseClient
    .from('products')
    .select('*')
    .neq('id', request.productId)
    .eq('is_active', true)
    .limit(request.limit || 5);

  return relatedProducts?.map((product: any) => ({
    user_id: request.userId || null,
    product_id: product.id,
    recommendation_type: 'frequently_bought_together',
    confidence_score: 0.8,
    recommendation_data: {
      base_product_id: request.productId,
      reason: 'Customers who bought this item also bought'
    },
    product: product
  })) || [];
}

async function generateTrending(supabaseClient: any, request: RecommendationRequest) {
  const { data: trendingProducts } = await supabaseClient
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(request.limit || 20);

  return trendingProducts?.map((product: any) => ({
    user_id: request.userId || null,
    product_id: product.id,
    recommendation_type: 'trending',
    confidence_score: 0.9,
    recommendation_data: {
      reason: 'Trending now',
      popularity_score: product.rating || 0
    },
    product: product
  })) || [];
}

async function generateSeasonal(supabaseClient: any, request: RecommendationRequest) {
  const currentMonth = new Date().getMonth() + 1;
  const seasonalCategories = getSeasonalCategories(currentMonth);

  const { data: seasonalProducts } = await supabaseClient
    .from('products')
    .select('*')
    .in('category', seasonalCategories)
    .eq('is_active', true)
    .limit(request.limit || 15);

  return seasonalProducts?.map((product: any) => ({
    user_id: request.userId || null,
    product_id: product.id,
    recommendation_type: 'seasonal',
    confidence_score: 0.75,
    recommendation_data: {
      reason: 'Perfect for this season',
      season: getCurrentSeason(currentMonth)
    },
    product: product
  })) || [];
}

async function getTrendingProducts(supabaseClient: any, category?: string, limit = 20) {
  let query = supabaseClient
    .from('products')
    .select('*')
    .eq('is_active', true);

  if (category) {
    query = query.eq('category', category);
  }

  const { data: trending } = await query
    .order('rating', { ascending: false })
    .limit(limit);

  return trending || [];
}

function getSeasonalCategories(month: number): string[] {
  const seasons = {
    winter: [12, 1, 2],
    spring: [3, 4, 5],
    summer: [6, 7, 8],
    autumn: [9, 10, 11]
  };

  if (seasons.winter.includes(month)) return ['winter_clothing', 'warm_accessories'];
  if (seasons.spring.includes(month)) return ['spring_fashion', 'garden_supplies'];
  if (seasons.summer.includes(month)) return ['summer_clothing', 'outdoor_equipment'];
  if (seasons.autumn.includes(month)) return ['autumn_fashion', 'back_to_school'];
  
  return [];
}

function getCurrentSeason(month: number): string {
  if ([12, 1, 2].includes(month)) return 'winter';
  if ([3, 4, 5].includes(month)) return 'spring';
  if ([6, 7, 8].includes(month)) return 'summer';
  if ([9, 10, 11].includes(month)) return 'autumn';
  return 'unknown';
}