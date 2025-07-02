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

    const { action, data } = await req.json()

    switch (action) {
      case 'calculate_loyalty_points':
        return await calculateLoyaltyPoints(supabase, data)
      case 'redeem_rewards':
        return await redeemRewards(supabase, data)
      case 'get_user_tier':
        return await getUserTier(supabase, data)
      case 'create_personalized_offer':
        return await createPersonalizedOffer(supabase, data)
      case 'track_engagement':
        return await trackEngagement(supabase, data)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Loyalty Rewards Engine Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function calculateLoyaltyPoints(supabase: any, data: any) {
  const { user_id, transaction_amount, product_category } = data
  
  let points = Math.floor(transaction_amount * 0.01) // 1 point per $1
  
  // Category bonuses
  const categoryBonuses = {
    electronics: 0.5,
    fashion: 0.3,
    home: 0.2
  }
  
  const bonus = categoryBonuses[product_category as keyof typeof categoryBonuses] || 0
  points += Math.floor(transaction_amount * bonus)

  // Update user's points
  const { error } = await supabase
    .from('loyalty_points_balance')
    .upsert({
      user_id,
      total_points: points,
      updated_at: new Date().toISOString()
    })

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true, points_earned: points }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function redeemRewards(supabase: any, data: any) {
  const { user_id, reward_id, points_cost } = data

  const { data: balance, error: balanceError } = await supabase
    .from('loyalty_points_balance')
    .select('total_points')
    .eq('user_id', user_id)
    .single()

  if (balanceError) throw balanceError

  if (balance.total_points < points_cost) {
    return new Response(
      JSON.stringify({ error: 'Insufficient points' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Process redemption
  await supabase.from('loyalty_redemptions').insert({
    user_id,
    reward_id,
    points_redeemed: points_cost,
    status: 'pending'
  })

  await supabase
    .from('loyalty_points_balance')
    .update({ total_points: balance.total_points - points_cost })
    .eq('user_id', user_id)

  return new Response(
    JSON.stringify({ success: true, remaining_points: balance.total_points - points_cost }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getUserTier(supabase: any, data: any) {
  const { user_id } = data

  const { data: userTier, error } = await supabase
    .from('user_loyalty_tiers')
    .select('*')
    .eq('user_id', user_id)
    .single()

  if (error && error.code !== 'PGRST116') throw error

  return new Response(
    JSON.stringify({ success: true, tier: userTier }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createPersonalizedOffer(supabase: any, data: any) {
  const { user_id, occasion } = data

  const offer = {
    type: 'personalized_discount',
    discount: occasion === 'birthday' ? 20 : 10,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }

  const { data: createdOffer, error } = await supabase
    .from('personalized_offers')
    .insert({
      user_id,
      offer_type: offer.type,
      discount_percentage: offer.discount,
      valid_until: offer.expires_at,
      status: 'active'
    })
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true, offer: createdOffer }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function trackEngagement(supabase: any, data: any) {
  const { user_id, engagement_type } = data

  const engagementPoints = {
    app_open: 1,
    product_view: 2,
    review_written: 10,
    referral: 50
  }

  const points = engagementPoints[engagement_type as keyof typeof engagementPoints] || 0

  if (points > 0) {
    await supabase.from('loyalty_points_transactions').insert({
      user_id,
      transaction_type: 'engagement',
      points_earned: points,
      engagement_type
    })
  }

  return new Response(
    JSON.stringify({ success: true, points_earned: points }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}