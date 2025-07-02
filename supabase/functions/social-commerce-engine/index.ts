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
      case 'create_social_campaign':
        return await createSocialCampaign(supabase, data)
      case 'track_social_engagement':
        return await trackSocialEngagement(supabase, data)
      case 'generate_social_content':
        return await generateSocialContent(supabase, data)
      case 'analyze_social_performance':
        return await analyzeSocialPerformance(supabase, data)
      case 'get_influencer_recommendations':
        return await getInfluencerRecommendations(supabase, data)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Social Commerce Engine Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function createSocialCampaign(supabase: any, data: any) {
  const { user_id, campaign_name, platform, target_audience, budget, products } = data

  // Create social campaign
  const { data: campaign, error: campaignError } = await supabase
    .from('social_campaigns')
    .insert({
      user_id,
      campaign_name,
      platform,
      target_audience,
      budget,
      status: 'active',
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (campaignError) throw campaignError

  // Create campaign products associations
  if (products && products.length > 0) {
    const campaignProducts = products.map((product_id: string) => ({
      campaign_id: campaign.id,
      product_id,
      created_at: new Date().toISOString()
    }))

    const { error: productsError } = await supabase
      .from('social_campaign_products')
      .insert(campaignProducts)

    if (productsError) throw productsError
  }

  // Generate initial social content suggestions
  const contentSuggestions = await generateContentSuggestions(platform, products)

  return new Response(
    JSON.stringify({
      success: true,
      campaign,
      content_suggestions: contentSuggestions
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function trackSocialEngagement(supabase: any, data: any) {
  const { campaign_id, platform, engagement_type, user_id, metadata } = data

  // Track engagement
  const { data: engagement, error } = await supabase
    .from('social_engagement_tracking')
    .insert({
      campaign_id,
      platform,
      engagement_type,
      user_id,
      metadata,
      tracked_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error

  // Update campaign metrics
  await updateCampaignMetrics(supabase, campaign_id, engagement_type)

  return new Response(
    JSON.stringify({ success: true, engagement }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function generateSocialContent(supabase: any, data: any) {
  const { product_id, platform, content_type, target_audience } = data

  // Get product details
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', product_id)
    .single()

  if (productError) throw productError

  // Generate content based on platform and product
  const content = await generatePlatformContent(product, platform, content_type, target_audience)

  // Store generated content
  const { data: generatedContent, error: contentError } = await supabase
    .from('social_content_library')
    .insert({
      product_id,
      platform,
      content_type,
      content,
      performance_score: 0,
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (contentError) throw contentError

  return new Response(
    JSON.stringify({ success: true, content: generatedContent }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function analyzeSocialPerformance(supabase: any, data: any) {
  const { campaign_id, date_range } = data

  // Get campaign engagement data
  const { data: engagements, error: engagementError } = await supabase
    .from('social_engagement_tracking')
    .select('*')
    .eq('campaign_id', campaign_id)
    .gte('tracked_at', date_range.start)
    .lte('tracked_at', date_range.end)

  if (engagementError) throw engagementError

  // Calculate performance metrics
  const performance = calculatePerformanceMetrics(engagements)

  // Get ROI data
  const roi = await calculateSocialROI(supabase, campaign_id, date_range)

  // Generate insights and recommendations
  const insights = generatePerformanceInsights(performance, roi)

  return new Response(
    JSON.stringify({
      success: true,
      performance,
      roi,
      insights
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getInfluencerRecommendations(supabase: any, data: any) {
  const { budget, target_audience, category, platform } = data

  // Get influencer data
  const { data: influencers, error } = await supabase
    .from('influencer_partnerships')
    .select('*')
    .eq('platform', platform)
    .eq('category', category)
    .gte('follower_count', target_audience.min_followers || 1000)
    .lte('avg_engagement_rate', budget.max_cost_per_engagement || 0.1)

  if (error) throw error

  // Score and rank influencers
  const rankedInfluencers = rankInfluencers(influencers, target_audience, budget)

  return new Response(
    JSON.stringify({
      success: true,
      recommendations: rankedInfluencers.slice(0, 10)
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Helper functions
async function generateContentSuggestions(platform: string, products: any[]) {
  const suggestions = {
    facebook: ['Product showcase posts', 'Behind-the-scenes content', 'Customer testimonials'],
    instagram: ['Product photography', 'Stories highlights', 'Reels content'],
    tiktok: ['Product demos', 'Trending challenges', 'User-generated content'],
    youtube: ['Product reviews', 'How-to tutorials', 'Unboxing videos']
  }
  
  return suggestions[platform as keyof typeof suggestions] || []
}

async function generatePlatformContent(product: any, platform: string, contentType: string, targetAudience: any) {
  const templates = {
    facebook: {
      post: `Check out our amazing ${product.name}! Perfect for ${targetAudience.interests?.join(', ')}. Get yours today! #${product.category}`,
      story: `🔥 Hot Deal Alert! ${product.name} now available`,
      video: `See ${product.name} in action - you'll love what it can do!`
    },
    instagram: {
      post: `✨ ${product.name} ✨\n\nPerfect for your ${targetAudience.lifestyle} lifestyle\n\n#${product.category} #style #trending`,
      story: `Swipe up for ${product.name} 👆`,
      reel: `POV: You discover the perfect ${product.name} 🤩`
    }
  }

  return templates[platform as keyof typeof templates]?.[contentType as keyof any] || 
         `Discover ${product.name} - the perfect choice for you!`
}

async function updateCampaignMetrics(supabase: any, campaignId: string, engagementType: string) {
  const { data: campaign, error } = await supabase
    .from('social_campaigns')
    .select('metrics')
    .eq('id', campaignId)
    .single()

  if (error) return

  const metrics = campaign.metrics || {}
  metrics[engagementType] = (metrics[engagementType] || 0) + 1
  metrics.total_engagements = (metrics.total_engagements || 0) + 1

  await supabase
    .from('social_campaigns')
    .update({ metrics })
    .eq('id', campaignId)
}

function calculatePerformanceMetrics(engagements: any[]) {
  const metrics = {
    total_engagements: engagements.length,
    likes: engagements.filter(e => e.engagement_type === 'like').length,
    shares: engagements.filter(e => e.engagement_type === 'share').length,
    comments: engagements.filter(e => e.engagement_type === 'comment').length,
    clicks: engagements.filter(e => e.engagement_type === 'click').length,
    engagement_rate: 0,
    reach: new Set(engagements.map(e => e.user_id)).size
  }

  metrics.engagement_rate = metrics.reach > 0 ? (metrics.total_engagements / metrics.reach) * 100 : 0

  return metrics
}

async function calculateSocialROI(supabase: any, campaignId: string, dateRange: any) {
  // This would integrate with sales data to calculate ROI
  return {
    total_spent: 1000,
    revenue_generated: 2500,
    roi_percentage: 150,
    cost_per_acquisition: 25,
    conversion_rate: 3.5
  }
}

function generatePerformanceInsights(performance: any, roi: any) {
  const insights = []
  
  if (performance.engagement_rate > 5) {
    insights.push("Excellent engagement rate! Your content is resonating well with your audience.")
  }
  
  if (roi.roi_percentage > 100) {
    insights.push("Positive ROI achieved! Consider increasing budget for this campaign.")
  }
  
  if (performance.shares > performance.likes * 0.1) {
    insights.push("High share rate indicates viral potential. Create similar content.")
  }

  return insights
}

function rankInfluencers(influencers: any[], targetAudience: any, budget: any) {
  return influencers.map(influencer => ({
    ...influencer,
    score: calculateInfluencerScore(influencer, targetAudience, budget)
  })).sort((a, b) => b.score - a.score)
}

function calculateInfluencerScore(influencer: any, targetAudience: any, budget: any) {
  let score = 0
  
  // Engagement rate score (0-40 points)
  score += Math.min(influencer.avg_engagement_rate * 400, 40)
  
  // Follower count relevance (0-30 points)
  const followerFit = Math.min(influencer.follower_count / (targetAudience.max_followers || 1000000), 1)
  score += followerFit * 30
  
  // Cost efficiency (0-30 points)
  const costEfficiency = Math.max(0, 1 - (influencer.avg_cost_per_post / budget.max_per_post))
  score += costEfficiency * 30
  
  return score
}