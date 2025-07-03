import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { endpoint, data } = await req.json();
    console.log(`Review Management Service - Endpoint: ${endpoint}`);

    switch (endpoint) {
      case 'health':
        return new Response(JSON.stringify({ 
          status: 'healthy', 
          service: 'review-management-service',
          capabilities: ['review-moderation', 'sentiment-analysis', 'review-analytics', 'automated-flagging']
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'moderate-review':
        const { review_id, product_id, review_content, moderation_type = 'automatic' } = data;
        
        // Perform automatic moderation
        const moderationResult = await moderateContent(review_content);
        
        // Add to moderation queue
        const { data: queueItem, error: queueError } = await supabase
          .from('review_management_queue')
          .insert({
            product_id,
            review_id,
            moderation_status: moderationResult.approved ? 'approved' : 'flagged',
            moderation_type,
            flagged_reasons: moderationResult.flags,
            processed_at: moderationResult.approved ? new Date().toISOString() : null
          })
          .select()
          .single();

        if (queueError) throw queueError;

        return new Response(JSON.stringify({ 
          moderation_result: moderationResult,
          queue_item: queueItem,
          auto_approved: moderationResult.approved
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'bulk-moderate':
        const { review_batch, moderation_criteria } = data;
        
        const moderationResults = [];
        for (const review of review_batch) {
          const result = await moderateContent(review.content, moderation_criteria);
          
          await supabase
            .from('review_management_queue')
            .insert({
              product_id: review.product_id,
              review_id: review.id,
              moderation_status: result.approved ? 'approved' : 'flagged',
              moderation_type: 'automatic',
              flagged_reasons: result.flags
            });

          moderationResults.push({
            review_id: review.id,
            ...result
          });
        }

        return new Response(JSON.stringify({ 
          moderation_results: moderationResults,
          processed_count: review_batch.length
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'sentiment-analysis':
        const { reviews, analysis_type = 'individual' } = data;
        
        if (analysis_type === 'individual') {
          const sentimentResults = reviews.map((review: any) => ({
            review_id: review.id,
            ...analyzeSentiment(review.content)
          }));

          return new Response(JSON.stringify({ sentiment_analysis: sentimentResults }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } else {
          // Aggregate sentiment analysis
          const aggregateResult = analyzeAggregateSentiment(reviews);
          
          return new Response(JSON.stringify({ aggregate_sentiment: aggregateResult }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

      case 'flag-review':
        const { review_id: flagReviewId, product_id: flagProductId, reasons, reporter_id } = data;
        
        const { data: flagged, error: flagError } = await supabase
          .from('review_management_queue')
          .insert({
            product_id: flagProductId,
            review_id: flagReviewId,
            moderation_status: 'flagged',
            moderation_type: 'community',
            flagged_reasons: reasons
          })
          .select()
          .single();

        return new Response(JSON.stringify({ flagged_review: flagged }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'approve-review':
        const { queue_id, moderator_id, moderator_notes } = data;
        
        const { data: approved, error: approveError } = await supabase
          .from('review_management_queue')
          .update({
            moderation_status: 'approved',
            processed_at: new Date().toISOString(),
            processed_by: moderator_id,
            moderator_notes
          })
          .eq('id', queue_id)
          .select()
          .single();

        return new Response(JSON.stringify({ approved_review: approved }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'reject-review':
        const { queue_id: rejectQueueId, moderator_id: rejectModeratorId, rejection_reason } = data;
        
        const { data: rejected, error: rejectError } = await supabase
          .from('review_management_queue')
          .update({
            moderation_status: 'rejected',
            processed_at: new Date().toISOString(),
            processed_by: rejectModeratorId,
            moderator_notes: rejection_reason
          })
          .eq('id', rejectQueueId)
          .select()
          .single();

        return new Response(JSON.stringify({ rejected_review: rejected }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'moderation-queue':
        const { status_filter = 'pending', limit = 50, offset = 0 } = data;
        
        let queueQuery = supabase
          .from('review_management_queue')
          .select(`
            *,
            products(name, vendor_id)
          `)
          .order('created_at', { ascending: false })
          .limit(limit)
          .range(offset, offset + limit - 1);

        if (status_filter !== 'all') {
          queueQuery = queueQuery.eq('moderation_status', status_filter);
        }

        const { data: queueItems, error: queueError } = await queueQuery;

        return new Response(JSON.stringify({ queue: queueItems, error: queueError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'review-analytics':
        const { product_id: analyticsProductId, vendor_id, time_period = 'last_30_days' } = data;
        
        const startDate = new Date();
        if (time_period === 'last_30_days') {
          startDate.setDate(startDate.getDate() - 30);
        } else if (time_period === 'last_7_days') {
          startDate.setDate(startDate.getDate() - 7);
        }

        let analyticsQuery = supabase
          .from('review_management_queue')
          .select(`
            *,
            products(name, vendor_id)
          `)
          .gte('created_at', startDate.toISOString());

        if (product_id) {
          analyticsQuery = analyticsQuery.eq('product_id', analyticsProductId);
        } else if (vendor_id) {
          analyticsQuery = analyticsQuery.eq('products.vendor_id', vendor_id);
        }

        const { data: analyticsData } = await analyticsQuery;

        const analytics = {
          total_reviews: analyticsData?.length || 0,
          approved_reviews: analyticsData?.filter(r => r.moderation_status === 'approved').length || 0,
          rejected_reviews: analyticsData?.filter(r => r.moderation_status === 'rejected').length || 0,
          flagged_reviews: analyticsData?.filter(r => r.moderation_status === 'flagged').length || 0,
          pending_reviews: analyticsData?.filter(r => r.moderation_status === 'pending').length || 0,
          approval_rate: 0,
          common_flags: {}
        };

        if (analytics.total_reviews > 0) {
          analytics.approval_rate = (analytics.approved_reviews / analytics.total_reviews) * 100;
        }

        // Calculate common flag reasons
        analyticsData?.forEach(item => {
          if (item.flagged_reasons && Array.isArray(item.flagged_reasons)) {
            item.flagged_reasons.forEach((flag: string) => {
              analytics.common_flags[flag] = (analytics.common_flags[flag] || 0) + 1;
            });
          }
        });

        return new Response(JSON.stringify({ analytics }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'auto-moderate-settings':
        const { vendor_id: settingsVendorId, settings } = data;
        
        // Store auto-moderation settings (would be in a settings table in production)
        const moderationSettings = {
          vendor_id: settingsVendorId,
          auto_approve_threshold: settings.auto_approve_threshold || 0.8,
          auto_reject_threshold: settings.auto_reject_threshold || 0.3,
          keywords_filter: settings.keywords_filter || [],
          sentiment_threshold: settings.sentiment_threshold || 0.5,
          language_check: settings.language_check || true
        };

        return new Response(JSON.stringify({ 
          message: 'Auto-moderation settings updated',
          settings: moderationSettings
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('Review Management Service error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      service: 'review-management-service'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Helper functions
function moderateContent(content: string, criteria: any = {}): any {
  const flags = [];
  let approved = true;
  
  // Basic content checks
  const inappropriateWords = ['spam', 'fake', 'scam', 'terrible', 'worst'];
  const containsInappropriate = inappropriateWords.some(word => 
    content.toLowerCase().includes(word)
  );
  
  if (containsInappropriate) {
    flags.push('inappropriate_language');
    approved = false;
  }
  
  // Length check
  if (content.length < 10) {
    flags.push('too_short');
    approved = false;
  }
  
  // Spam detection (simple)
  if (content.includes('http') || content.includes('www.')) {
    flags.push('contains_links');
    approved = false;
  }
  
  // Repetitive content
  if (/(.{3,})\1{3,}/.test(content)) {
    flags.push('repetitive_content');
    approved = false;
  }
  
  return {
    approved,
    flags,
    confidence_score: approved ? 0.9 : 0.3,
    processed_at: new Date().toISOString()
  };
}

function analyzeSentiment(content: string): any {
  // Simple sentiment analysis
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'recommend'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'useless', 'disappointed'];
  
  const words = content.toLowerCase().split(/\s+/);
  
  const positiveCount = words.filter(word => positiveWords.includes(word)).length;
  const negativeCount = words.filter(word => negativeWords.includes(word)).length;
  
  let sentiment = 'neutral';
  let score = 0.5;
  
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    score = Math.min(0.5 + (positiveCount - negativeCount) * 0.1, 1.0);
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    score = Math.max(0.5 - (negativeCount - positiveCount) * 0.1, 0.0);
  }
  
  return {
    sentiment,
    score,
    positive_indicators: positiveCount,
    negative_indicators: negativeCount
  };
}

function analyzeAggregateSentiment(reviews: any[]): any {
  const sentiments = reviews.map(review => analyzeSentiment(review.content));
  
  const avgScore = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;
  const distribution = {
    positive: sentiments.filter(s => s.sentiment === 'positive').length,
    neutral: sentiments.filter(s => s.sentiment === 'neutral').length,
    negative: sentiments.filter(s => s.sentiment === 'negative').length
  };
  
  return {
    average_sentiment_score: avgScore,
    overall_sentiment: avgScore > 0.6 ? 'positive' : avgScore < 0.4 ? 'negative' : 'neutral',
    sentiment_distribution: distribution,
    total_reviews: reviews.length
  };
}