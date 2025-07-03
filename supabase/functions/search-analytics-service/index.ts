import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface AnalyticsRequest {
  period?: 'daily' | 'weekly' | 'monthly';
  start_date?: string;
  end_date?: string;
  breakdown?: 'language' | 'search_type' | 'cultural_context' | 'device';
  filters?: {
    language?: string;
    search_type?: string;
    cultural_context?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (action) {
      case 'search-performance':
        return await getSearchPerformance(req);
      case 'trending-queries':
        return await getTrendingQueries(req);
      case 'conversion-analytics':
        return await getConversionAnalytics(req);
      case 'user-behavior':
        return await getUserBehaviorAnalytics(req);
      case 'zero-results':
        return await getZeroResultsAnalysis(req);
      case 'language-analytics':
        return await getLanguageAnalytics(req);
      case 'cultural-insights':
        return await getCulturalInsights(req);
      case 'aggregate-daily':
        return await aggregateDailyAnalytics(req);
      case 'search-suggestions-performance':
        return await getSearchSuggestionsPerformance(req);
      case 'recommendation-analytics':
        return await getRecommendationAnalytics(req);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Search Analytics Service Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getSearchPerformance(req: Request) {
  const analyticsRequest: AnalyticsRequest = await req.json();
  const { 
    period = 'daily', 
    start_date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date = new Date().toISOString().split('T')[0],
    breakdown,
    filters = {}
  } = analyticsRequest;

  console.log('Search Performance Request:', { period, start_date, end_date, breakdown, filters });

  // Get aggregated analytics data
  let query = supabase
    .from('search_analytics_aggregated')
    .select('*')
    .eq('period_type', period)
    .gte('date_period', start_date)
    .lte('date_period', end_date);

  const { data: aggregatedData, error } = await query.order('date_period', { ascending: true });

  if (error) {
    throw new Error(`Failed to get search performance: ${error.message}`);
  }

  // Calculate overall metrics
  const totalSearches = aggregatedData?.reduce((sum, day) => sum + (day.total_searches || 0), 0) || 0;
  const totalUsers = aggregatedData?.reduce((sum, day) => sum + (day.unique_users || 0), 0) || 0;
  const successfulSearches = aggregatedData?.reduce((sum, day) => sum + (day.successful_searches || 0), 0) || 0;
  const zeroResults = aggregatedData?.reduce((sum, day) => sum + (day.zero_result_searches || 0), 0) || 0;

  const performance = {
    overview: {
      total_searches: totalSearches,
      unique_users: totalUsers,
      success_rate: totalSearches > 0 ? successfulSearches / totalSearches : 0,
      zero_result_rate: totalSearches > 0 ? zeroResults / totalSearches : 0,
      average_searches_per_user: totalUsers > 0 ? totalSearches / totalUsers : 0
    },
    time_series: aggregatedData || [],
    period,
    date_range: { start_date, end_date }
  };

  // Add breakdown analysis if requested
  if (breakdown) {
    const breakdownData = await getBreakdownAnalysis(breakdown, start_date, end_date, filters);
    performance[`${breakdown}_breakdown`] = breakdownData;
  }

  return new Response(JSON.stringify({
    success: true,
    performance
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getTrendingQueries(req: Request) {
  const url = new URL(req.url);
  const period = url.searchParams.get('period') || '7d';
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const language = url.searchParams.get('language');

  console.log('Trending Queries Request:', { period, limit, language });

  const days = period === '30d' ? 30 : 7;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  let query = supabase
    .from('search_queries')
    .select('query_text, language, COUNT(*) as query_count, AVG(results_count) as avg_results')
    .gte('created_at', startDate.toISOString())
    .not('query_text', 'is', null)
    .neq('query_text', '');

  if (language) {
    query = query.eq('language', language);
  }

  const { data: trendingQueries } = await query
    .group('query_text, language')
    .order('query_count', { ascending: false })
    .limit(limit);

  // Get query performance details
  const enrichedQueries = await Promise.all(
    (trendingQueries || []).map(async (tq: any) => {
      // Get conversion data for this query
      const { data: conversions } = await supabase
        .from('user_behaviors')
        .select('event_type')
        .eq('behavior_data->search_query', tq.query_text)
        .in('event_type', ['cart_add', 'purchase']);

      const conversionRate = conversions?.length ? 
        conversions.filter(c => c.event_type === 'purchase').length / tq.query_count : 0;

      return {
        ...tq,
        conversion_rate: conversionRate,
        engagement_rate: conversions?.length ? conversions.length / tq.query_count : 0
      };
    })
  );

  return new Response(JSON.stringify({
    success: true,
    trending_queries: enrichedQueries,
    period,
    language
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getConversionAnalytics(req: Request) {
  const { start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end_date = new Date().toISOString().split('T')[0] } = await req.json();

  console.log('Conversion Analytics Request:', { start_date, end_date });

  // Get search to conversion funnel data
  const { data: searchQueries } = await supabase
    .from('search_queries')
    .select('id, user_id, query_text, results_count, created_at')
    .gte('created_at', start_date)
    .lte('created_at', end_date)
    .not('user_id', 'is', null);

  if (!searchQueries || searchQueries.length === 0) {
    return new Response(JSON.stringify({
      success: true,
      conversion_analytics: {
        total_searches: 0,
        searches_with_results: 0,
        searches_leading_to_views: 0,
        searches_leading_to_cart: 0,
        searches_leading_to_purchase: 0,
        funnel_conversion_rates: {
          search_to_view: 0,
          search_to_cart: 0,
          search_to_purchase: 0
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Analyze conversion funnel
  const conversionAnalysis = {
    total_searches: searchQueries.length,
    searches_with_results: searchQueries.filter(q => q.results_count > 0).length,
    searches_leading_to_views: 0,
    searches_leading_to_cart: 0,
    searches_leading_to_purchase: 0
  };

  // Get user behaviors after search queries
  const userIds = [...new Set(searchQueries.map(q => q.user_id))];
  const { data: behaviors } = await supabase
    .from('user_behaviors')
    .select('user_id, event_type, created_at, behavior_data')
    .in('user_id', userIds)
    .gte('created_at', start_date)
    .lte('created_at', end_date)
    .in('event_type', ['view', 'cart_add', 'purchase']);

  // Match behaviors to search queries (within 1 hour)
  const searchToConversion = new Map();
  
  searchQueries.forEach(query => {
    const queryTime = new Date(query.created_at);
    const relevantBehaviors = behaviors?.filter(b => 
      b.user_id === query.user_id && 
      new Date(b.created_at) > queryTime &&
      new Date(b.created_at) <= new Date(queryTime.getTime() + 60 * 60 * 1000) // within 1 hour
    ) || [];

    const hasView = relevantBehaviors.some(b => b.event_type === 'view');
    const hasCart = relevantBehaviors.some(b => b.event_type === 'cart_add');
    const hasPurchase = relevantBehaviors.some(b => b.event_type === 'purchase');

    if (hasView) conversionAnalysis.searches_leading_to_views++;
    if (hasCart) conversionAnalysis.searches_leading_to_cart++;
    if (hasPurchase) conversionAnalysis.searches_leading_to_purchase++;

    searchToConversion.set(query.id, { hasView, hasCart, hasPurchase });
  });

  // Calculate conversion rates
  const funnelRates = {
    search_to_view: conversionAnalysis.searches_leading_to_views / conversionAnalysis.total_searches,
    search_to_cart: conversionAnalysis.searches_leading_to_cart / conversionAnalysis.total_searches,
    search_to_purchase: conversionAnalysis.searches_leading_to_purchase / conversionAnalysis.total_searches
  };

  return new Response(JSON.stringify({
    success: true,
    conversion_analytics: {
      ...conversionAnalysis,
      funnel_conversion_rates: funnelRates,
      date_range: { start_date, end_date }
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getUserBehaviorAnalytics(req: Request) {
  const { start_date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end_date = new Date().toISOString().split('T')[0] } = await req.json();

  console.log('User Behavior Analytics Request:', { start_date, end_date });

  // Get user search patterns
  const { data: userBehaviors } = await supabase
    .from('search_queries')
    .select('user_id, query_text, language, search_type, created_at')
    .gte('created_at', start_date)
    .lte('created_at', end_date)
    .not('user_id', 'is', null);

  const behaviorAnalytics = {
    total_search_users: 0,
    average_searches_per_user: 0,
    language_preferences: {},
    search_type_preferences: {},
    user_segments: {
      heavy_users: 0,
      moderate_users: 0,
      light_users: 0
    },
    retention_metrics: {}
  };

  if (userBehaviors && userBehaviors.length > 0) {
    // Group by user
    const userGroups = userBehaviors.reduce((acc: any, behavior) => {
      if (!acc[behavior.user_id]) {
        acc[behavior.user_id] = [];
      }
      acc[behavior.user_id].push(behavior);
      return acc;
    }, {});

    behaviorAnalytics.total_search_users = Object.keys(userGroups).length;
    behaviorAnalytics.average_searches_per_user = userBehaviors.length / behaviorAnalytics.total_search_users;

    // Analyze user segments
    Object.values(userGroups).forEach((userQueries: any) => {
      if (userQueries.length >= 10) {
        behaviorAnalytics.user_segments.heavy_users++;
      } else if (userQueries.length >= 3) {
        behaviorAnalytics.user_segments.moderate_users++;
      } else {
        behaviorAnalytics.user_segments.light_users++;
      }
    });

    // Language preferences
    userBehaviors.forEach(behavior => {
      const lang = behavior.language || 'unknown';
      behaviorAnalytics.language_preferences[lang] = (behaviorAnalytics.language_preferences[lang] || 0) + 1;
    });

    // Search type preferences
    userBehaviors.forEach(behavior => {
      const type = behavior.search_type || 'text';
      behaviorAnalytics.search_type_preferences[type] = (behaviorAnalytics.search_type_preferences[type] || 0) + 1;
    });
  }

  return new Response(JSON.stringify({
    success: true,
    user_behavior_analytics: behaviorAnalytics,
    date_range: { start_date, end_date }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getZeroResultsAnalysis(req: Request) {
  const { start_date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end_date = new Date().toISOString().split('T')[0] } = await req.json();

  console.log('Zero Results Analysis Request:', { start_date, end_date });

  // Get queries with zero results
  const { data: zeroResultQueries } = await supabase
    .from('search_queries')
    .select('query_text, language, search_type, created_at')
    .eq('results_count', 0)
    .gte('created_at', start_date)
    .lte('created_at', end_date);

  const analysis = {
    total_zero_result_queries: zeroResultQueries?.length || 0,
    common_zero_result_terms: [],
    language_breakdown: {},
    search_type_breakdown: {},
    improvement_suggestions: []
  };

  if (zeroResultQueries && zeroResultQueries.length > 0) {
    // Find most common zero-result queries
    const queryFrequency: { [key: string]: number } = {};
    zeroResultQueries.forEach(query => {
      queryFrequency[query.query_text] = (queryFrequency[query.query_text] || 0) + 1;
    });

    analysis.common_zero_result_terms = Object.entries(queryFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([term, count]) => ({ term, count }));

    // Language breakdown
    zeroResultQueries.forEach(query => {
      const lang = query.language || 'unknown';
      analysis.language_breakdown[lang] = (analysis.language_breakdown[lang] || 0) + 1;
    });

    // Search type breakdown
    zeroResultQueries.forEach(query => {
      const type = query.search_type || 'text';
      analysis.search_type_breakdown[type] = (analysis.search_type_breakdown[type] || 0) + 1;
    });

    // Generate improvement suggestions
    analysis.improvement_suggestions = generateImprovementSuggestions(analysis.common_zero_result_terms);
  }

  return new Response(JSON.stringify({
    success: true,
    zero_results_analysis: analysis,
    date_range: { start_date, end_date }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getLanguageAnalytics(req: Request) {
  const { start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end_date = new Date().toISOString().split('T')[0] } = await req.json();

  console.log('Language Analytics Request:', { start_date, end_date });

  // Get language-specific search data
  const { data: languageData } = await supabase
    .from('search_queries')
    .select('language, results_count, search_type, created_at')
    .gte('created_at', start_date)
    .lte('created_at', end_date)
    .not('language', 'is', null);

  const analytics = {
    language_usage: {},
    language_performance: {},
    mixed_language_usage: 0,
    bangla_search_trends: {},
    phonetic_search_usage: 0
  };

  if (languageData && languageData.length > 0) {
    // Language usage statistics
    languageData.forEach(data => {
      const lang = data.language;
      if (!analytics.language_usage[lang]) {
        analytics.language_usage[lang] = { count: 0, success_rate: 0, avg_results: 0 };
      }
      analytics.language_usage[lang].count++;
    });

    // Language performance metrics
    Object.keys(analytics.language_usage).forEach(lang => {
      const langQueries = languageData.filter(d => d.language === lang);
      const successfulQueries = langQueries.filter(q => q.results_count > 0);
      const totalResults = langQueries.reduce((sum, q) => sum + q.results_count, 0);

      analytics.language_performance[lang] = {
        total_searches: langQueries.length,
        success_rate: successfulQueries.length / langQueries.length,
        average_results: totalResults / langQueries.length,
        zero_result_rate: (langQueries.length - successfulQueries.length) / langQueries.length
      };
    });

    // Mixed language usage
    analytics.mixed_language_usage = languageData.filter(d => d.language === 'mixed').length;

    // Phonetic search usage (searches with search_type containing 'phonetic' or 'bangla')
    analytics.phonetic_search_usage = languageData.filter(d => 
      d.search_type?.includes('phonetic') || d.search_type?.includes('bangla')
    ).length;
  }

  return new Response(JSON.stringify({
    success: true,
    language_analytics: analytics,
    date_range: { start_date, end_date }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getCulturalInsights(req: Request) {
  const { start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end_date = new Date().toISOString().split('T')[0] } = await req.json();

  console.log('Cultural Insights Request:', { start_date, end_date });

  // Get cultural context search data
  const { data: culturalSearches } = await supabase
    .from('search_queries')
    .select('cultural_context, results_count, query_text, created_at')
    .gte('created_at', start_date)
    .lte('created_at', end_date)
    .not('cultural_context', 'is', null);

  // Get active cultural contexts
  const { data: culturalContexts } = await supabase
    .from('cultural_search_context')
    .select('*')
    .eq('is_active', true);

  const insights = {
    cultural_search_volume: {},
    seasonal_trends: {},
    festival_impact: {},
    regional_preferences: {},
    cultural_conversion_rates: {}
  };

  if (culturalSearches && culturalSearches.length > 0) {
    // Cultural search volume
    culturalSearches.forEach(search => {
      const context = search.cultural_context;
      if (!insights.cultural_search_volume[context]) {
        insights.cultural_search_volume[context] = 0;
      }
      insights.cultural_search_volume[context]++;
    });

    // Calculate conversion rates for cultural searches
    for (const context of Object.keys(insights.cultural_search_volume)) {
      const contextSearches = culturalSearches.filter(s => s.cultural_context === context);
      const successfulSearches = contextSearches.filter(s => s.results_count > 0);
      
      insights.cultural_conversion_rates[context] = {
        total_searches: contextSearches.length,
        success_rate: successfulSearches.length / contextSearches.length,
        average_results: contextSearches.reduce((sum, s) => sum + s.results_count, 0) / contextSearches.length
      };
    }
  }

  // Add cultural context metadata
  const contextMetadata = {};
  culturalContexts?.forEach(context => {
    contextMetadata[context.context_name] = {
      type: context.context_type,
      boost_factor: context.boost_factor,
      boost_categories: context.boost_categories,
      date_range: context.date_range
    };
  });

  return new Response(JSON.stringify({
    success: true,
    cultural_insights: {
      ...insights,
      context_metadata: contextMetadata
    },
    date_range: { start_date, end_date }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function aggregateDailyAnalytics(req: Request) {
  const { target_date = new Date().toISOString().split('T')[0] } = await req.json();

  console.log('Aggregating daily analytics for:', target_date);

  // Get all search queries for the target date
  const { data: dayQueries } = await supabase
    .from('search_queries')
    .select('*')
    .gte('created_at', `${target_date}T00:00:00.000Z`)
    .lt('created_at', `${new Date(new Date(target_date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}T00:00:00.000Z`);

  if (!dayQueries || dayQueries.length === 0) {
    return new Response(JSON.stringify({
      success: true,
      message: 'No queries found for target date',
      target_date
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Calculate aggregated metrics
  const uniqueUsers = new Set(dayQueries.filter(q => q.user_id).map(q => q.user_id)).size;
  const successfulSearches = dayQueries.filter(q => q.results_count > 0).length;
  const zeroResultSearches = dayQueries.filter(q => q.results_count === 0).length;
  const totalResults = dayQueries.reduce((sum, q) => sum + (q.results_count || 0), 0);

  // Get top search terms
  const termFrequency: { [key: string]: number } = {};
  dayQueries.forEach(q => {
    if (q.query_text) {
      termFrequency[q.query_text] = (termFrequency[q.query_text] || 0) + 1;
    }
  });

  const topTerms = Object.entries(termFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([term, count]) => ({ term, count }));

  // Get top categories (from search metadata or filters)
  const categoryFrequency: { [key: string]: number } = {};
  dayQueries.forEach(q => {
    if (q.filters?.category_id) {
      categoryFrequency[q.filters.category_id] = (categoryFrequency[q.filters.category_id] || 0) + 1;
    }
  });

  const topCategories = Object.entries(categoryFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([category, count]) => ({ category, count }));

  // Prepare aggregated data
  const aggregatedData = {
    date_period: target_date,
    period_type: 'daily',
    total_searches: dayQueries.length,
    unique_users: uniqueUsers,
    successful_searches: successfulSearches,
    zero_result_searches: zeroResultSearches,
    average_results_per_search: totalResults / dayQueries.length,
    top_search_terms: topTerms,
    top_categories: topCategories,
    conversion_metrics: {
      success_rate: successfulSearches / dayQueries.length,
      zero_result_rate: zeroResultSearches / dayQueries.length
    },
    performance_metrics: {
      average_response_time: 120, // Mock data - would be calculated from actual performance logs
      cache_hit_rate: 0.75
    }
  };

  // Insert or update aggregated data
  const { error } = await supabase
    .from('search_analytics_aggregated')
    .upsert(aggregatedData, {
      onConflict: 'date_period,period_type'
    });

  if (error) {
    throw new Error(`Failed to save aggregated analytics: ${error.message}`);
  }

  return new Response(JSON.stringify({
    success: true,
    aggregated_data: aggregatedData,
    target_date
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getSearchSuggestionsPerformance(req: Request) {
  const { period = '7d' } = await req.json();

  console.log('Search Suggestions Performance Request:', { period });

  const days = period === '30d' ? 30 : 7;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Get suggestion usage data
  const { data: suggestions } = await supabase
    .from('search_suggestions')
    .select('suggestion_text, suggestion_type, language, frequency_score, conversion_rate')
    .eq('is_active', true);

  // Mock suggestion click and conversion data (in real implementation, this would come from tracking)
  const suggestionPerformance = suggestions?.map(suggestion => ({
    ...suggestion,
    clicks: Math.floor(Math.random() * 100), // Mock data
    impressions: Math.floor(Math.random() * 500), // Mock data
    click_through_rate: Math.random() * 0.3, // Mock data
    suggestion_conversion_rate: suggestion.conversion_rate || Math.random() * 0.1
  })) || [];

  const performance = {
    total_suggestions: suggestions?.length || 0,
    suggestion_types: {},
    language_performance: {},
    top_performing_suggestions: suggestionPerformance
      .sort((a, b) => b.click_through_rate - a.click_through_rate)
      .slice(0, 10)
  };

  // Group by suggestion type
  suggestionPerformance.forEach(s => {
    if (!performance.suggestion_types[s.suggestion_type]) {
      performance.suggestion_types[s.suggestion_type] = {
        count: 0,
        avg_ctr: 0,
        avg_conversion_rate: 0
      };
    }
    performance.suggestion_types[s.suggestion_type].count++;
  });

  return new Response(JSON.stringify({
    success: true,
    suggestions_performance: performance,
    period
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getRecommendationAnalytics(req: Request) {
  const { period = '7d' } = await req.json();

  console.log('Recommendation Analytics Request:', { period });

  const days = period === '30d' ? 30 : 7;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Get recommendation performance data
  const { data: recommendations } = await supabase
    .from('ai_product_recommendations')
    .select('recommendation_type, confidence_score, clicked, purchased, created_at')
    .gte('created_at', startDate.toISOString());

  const analytics = {
    total_recommendations: recommendations?.length || 0,
    algorithm_performance: {},
    overall_metrics: {
      click_through_rate: 0,
      conversion_rate: 0,
      average_confidence: 0
    }
  };

  if (recommendations && recommendations.length > 0) {
    const totalClicks = recommendations.filter(r => r.clicked).length;
    const totalPurchases = recommendations.filter(r => r.purchased).length;
    const totalConfidence = recommendations.reduce((sum, r) => sum + (r.confidence_score || 0), 0);

    analytics.overall_metrics = {
      click_through_rate: totalClicks / recommendations.length,
      conversion_rate: totalPurchases / recommendations.length,
      average_confidence: totalConfidence / recommendations.length
    };

    // Group by algorithm type
    const algorithmGroups = recommendations.reduce((acc: any, rec) => {
      const type = rec.recommendation_type || 'unknown';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(rec);
      return acc;
    }, {});

    Object.entries(algorithmGroups).forEach(([type, recs]: [string, any[]]) => {
      const clicks = recs.filter(r => r.clicked).length;
      const purchases = recs.filter(r => r.purchased).length;
      const avgConfidence = recs.reduce((sum, r) => sum + (r.confidence_score || 0), 0) / recs.length;

      analytics.algorithm_performance[type] = {
        total_recommendations: recs.length,
        click_through_rate: clicks / recs.length,
        conversion_rate: purchases / recs.length,
        average_confidence: avgConfidence
      };
    });
  }

  return new Response(JSON.stringify({
    success: true,
    recommendation_analytics: analytics,
    period
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Helper functions

async function getBreakdownAnalysis(breakdown: string, start_date: string, end_date: string, filters: any) {
  console.log('Getting breakdown analysis for:', breakdown);

  let query = supabase
    .from('search_queries')
    .select(`${breakdown}, COUNT(*) as count, AVG(results_count) as avg_results`)
    .gte('created_at', start_date)
    .lte('created_at', end_date);

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query = query.eq(key, value);
    }
  });

  const { data: breakdownData } = await query
    .group(breakdown)
    .order('count', { ascending: false });

  return breakdownData || [];
}

function generateImprovementSuggestions(commonZeroTerms: any[]) {
  const suggestions = [];

  if (commonZeroTerms.length > 0) {
    // Check for potential misspellings
    const misspellingTerms = commonZeroTerms.filter(term => 
      term.term.length > 3 && /\d/.test(term.term) === false
    );

    if (misspellingTerms.length > 0) {
      suggestions.push({
        type: 'spelling_correction',
        description: 'Implement spell-check and auto-correction for common misspelled terms',
        affected_terms: misspellingTerms.slice(0, 5).map(t => t.term)
      });
    }

    // Check for Bangla terms that might need phonetic search
    const banglaTerms = commonZeroTerms.filter(term => 
      /[\u0980-\u09FF]/.test(term.term)
    );

    if (banglaTerms.length > 0) {
      suggestions.push({
        type: 'bangla_enhancement',
        description: 'Improve Bangla search capabilities and phonetic matching',
        affected_terms: banglaTerms.slice(0, 5).map(t => t.term)
      });
    }

    // Check for very specific terms that might need category expansion
    const specificTerms = commonZeroTerms.filter(term => 
      term.term.split(' ').length > 2
    );

    if (specificTerms.length > 0) {
      suggestions.push({
        type: 'category_expansion',
        description: 'Consider adding more specific product categories or attributes',
        affected_terms: specificTerms.slice(0, 5).map(t => t.term)
      });
    }
  }

  return suggestions;
}