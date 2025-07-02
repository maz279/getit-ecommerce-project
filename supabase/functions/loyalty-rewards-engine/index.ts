import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LoyaltyRequest {
  action: 'earn_points' | 'redeem_points' | 'get_balance' | 'get_tiers' | 'check_referral' | 'create_referral';
  userId: string;
  points?: number;
  referenceType?: string;
  referenceId?: string;
  description?: string;
  referralCode?: string;
  programId?: string;
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

    const { action, userId, points, referenceType, referenceId, description, referralCode, programId }: LoyaltyRequest = 
      await req.json();

    console.log('Loyalty Request:', { action, userId, points, referenceType });

    let result;

    switch (action) {
      case 'earn_points':
        result = await earnPoints(supabase, userId, points!, referenceType, referenceId, description);
        break;
      
      case 'redeem_points':
        result = await redeemPoints(supabase, userId, points!, referenceType, referenceId, description);
        break;
      
      case 'get_balance':
        result = await getUserBalance(supabase, userId);
        break;
      
      case 'get_tiers':
        result = await getLoyaltyTiers(supabase);
        break;
      
      case 'create_referral':
        result = await createReferral(supabase, userId);
        break;
      
      case 'check_referral':
        result = await checkReferral(supabase, referralCode!, userId);
        break;
      
      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Loyalty Engine Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Loyalty operation failed' 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function earnPoints(
  supabase: any, 
  userId: string, 
  points: number, 
  referenceType?: string, 
  referenceId?: string, 
  description?: string
) {
  // Get or create user loyalty account
  let { data: loyaltyAccount } = await supabase
    .from('user_loyalty_points')
    .select('*')
    .eq('user_id', userId)
    .limit(1);

  if (!loyaltyAccount || loyaltyAccount.length === 0) {
    // Create new loyalty account
    const { data: defaultProgram } = await supabase
      .from('loyalty_programs')
      .select('*')
      .eq('is_active', true)
      .limit(1);

    if (!defaultProgram || defaultProgram.length === 0) {
      throw new Error('No active loyalty program found');
    }

    const { data: newAccount, error: createError } = await supabase
      .from('user_loyalty_points')
      .insert({
        user_id: userId,
        program_id: defaultProgram[0].id,
        total_points: points,
        points_earned_lifetime: points,
        current_tier: 'bronze'
      })
      .select()
      .single();

    if (createError) throw createError;
    loyaltyAccount = [newAccount];
  } else {
    // Update existing account
    const { error: updateError } = await supabase
      .from('user_loyalty_points')
      .update({
        total_points: loyaltyAccount[0].total_points + points,
        points_earned_lifetime: loyaltyAccount[0].points_earned_lifetime + points,
        last_activity_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;
  }

  // Record transaction
  const { error: transactionError } = await supabase
    .from('loyalty_point_transactions')
    .insert({
      user_id: userId,
      program_id: loyaltyAccount[0].program_id,
      transaction_type: 'earned',
      points,
      reference_type: referenceType,
      reference_id: referenceId,
      description: description || `Earned ${points} points`,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year expiry
    });

  if (transactionError) throw transactionError;

  // Check for tier upgrade
  const updatedAccount = await checkTierUpgrade(supabase, userId, loyaltyAccount[0].total_points + points);

  return {
    pointsEarned: points,
    totalPoints: loyaltyAccount[0].total_points + points,
    currentTier: updatedAccount.current_tier,
    tierUpgrade: updatedAccount.tierUpgrade || false
  };
}

async function redeemPoints(
  supabase: any, 
  userId: string, 
  points: number, 
  referenceType?: string, 
  referenceId?: string, 
  description?: string
) {
  // Check user balance
  const { data: loyaltyAccount } = await supabase
    .from('user_loyalty_points')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!loyaltyAccount) {
    throw new Error('Loyalty account not found');
  }

  if (loyaltyAccount.total_points < points) {
    throw new Error('Insufficient points balance');
  }

  // Update balance
  const { error: updateError } = await supabase
    .from('user_loyalty_points')
    .update({
      total_points: loyaltyAccount.total_points - points,
      points_redeemed_lifetime: loyaltyAccount.points_redeemed_lifetime + points,
      last_activity_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (updateError) throw updateError;

  // Record transaction
  const { error: transactionError } = await supabase
    .from('loyalty_point_transactions')
    .insert({
      user_id: userId,
      program_id: loyaltyAccount.program_id,
      transaction_type: 'redeemed',
      points: -points,
      reference_type: referenceType,
      reference_id: referenceId,
      description: description || `Redeemed ${points} points`
    });

  if (transactionError) throw transactionError;

  return {
    pointsRedeemed: points,
    remainingPoints: loyaltyAccount.total_points - points
  };
}

async function getUserBalance(supabase: any, userId: string) {
  const { data: loyaltyAccount } = await supabase
    .from('user_loyalty_points')
    .select(`
      *,
      loyalty_programs (*)
    `)
    .eq('user_id', userId)
    .single();

  if (!loyaltyAccount) {
    return {
      totalPoints: 0,
      currentTier: 'bronze',
      pointsEarned: 0,
      pointsRedeemed: 0
    };
  }

  // Get recent transactions
  const { data: recentTransactions } = await supabase
    .from('loyalty_point_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  return {
    ...loyaltyAccount,
    recentTransactions: recentTransactions || []
  };
}

async function getLoyaltyTiers(supabase: any) {
  const { data: programs } = await supabase
    .from('loyalty_programs')
    .select('*')
    .eq('is_active', true);

  return programs || [];
}

async function createReferral(supabase: any, userId: string) {
  // Generate unique referral code
  const referralCode = `REF${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

  const { data: referral, error } = await supabase
    .from('referral_programs')
    .insert({
      referrer_id: userId,
      referral_code: referralCode,
      referrer_reward: { points: 100, description: 'Referral bonus' },
      referee_reward: { points: 50, description: 'Welcome bonus' },
      completion_criteria: { 
        type: 'first_purchase',
        minimum_amount: 500
      },
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    })
    .select()
    .single();

  if (error) throw error;

  return referral;
}

async function checkReferral(supabase: any, referralCode: string, refereeId: string) {
  const { data: referral } = await supabase
    .from('referral_programs')
    .select('*')
    .eq('referral_code', referralCode)
    .eq('status', 'active')
    .gte('expires_at', new Date().toISOString())
    .single();

  if (!referral) {
    throw new Error('Invalid or expired referral code');
  }

  if (referral.referrer_id === refereeId) {
    throw new Error('Cannot use your own referral code');
  }

  // Check if user already used a referral
  const { data: existingReferral } = await supabase
    .from('referral_programs')
    .select('*')
    .eq('referee_id', refereeId)
    .limit(1);

  if (existingReferral && existingReferral.length > 0) {
    throw new Error('User has already used a referral code');
  }

  // Update referral with referee
  const { error } = await supabase
    .from('referral_programs')
    .update({ referee_id: refereeId })
    .eq('id', referral.id);

  if (error) throw error;

  return {
    referralAccepted: true,
    referrerReward: referral.referrer_reward,
    refereeReward: referral.referee_reward
  };
}

async function checkTierUpgrade(supabase: any, userId: string, totalPoints: number) {
  // Simple tier logic - should be configurable from loyalty_programs
  let newTier = 'bronze';
  let tierUpgrade = false;

  if (totalPoints >= 10000) newTier = 'platinum';
  else if (totalPoints >= 5000) newTier = 'gold';
  else if (totalPoints >= 1000) newTier = 'silver';

  const { data: currentAccount } = await supabase
    .from('user_loyalty_points')
    .select('current_tier')
    .eq('user_id', userId)
    .single();

  if (currentAccount && currentAccount.current_tier !== newTier) {
    tierUpgrade = true;
    
    // Update tier
    await supabase
      .from('user_loyalty_points')
      .update({ current_tier: newTier })
      .eq('user_id', userId);
  }

  return { current_tier: newTier, tierUpgrade };
}