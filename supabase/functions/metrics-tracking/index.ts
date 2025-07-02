import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MetricData {
  metricName: string;
  metricCategory: 'phase1' | 'phase2' | 'phase3';
  metricValue: number;
  targetValue: number;
  metricUnit: 'percentage' | 'count' | 'score';
  vendorId?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

interface EngagementData {
  userId: string;
  sessionId: string;
  pageType: string;
  actionType: string;
  engagementDuration?: number;
  featureUsed?: string;
  conversionValue?: number;
}

interface RealtimeUsageData {
  userId?: string;
  featureName: string;
  usageDuration?: number;
  interactionCount?: number;
  sessionId?: string;
}

interface ConversionData {
  userId?: string;
  sessionId: string;
  conversionType: string;
  sourcePage?: string;
  targetAction?: string;
  conversionValue?: number;
  searchQuery?: string;
  productsViewed?: any[];
  timeToConversion?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { pathname } = new URL(req.url);
    const action = pathname.split('/').pop();

    switch (action) {
      case 'track-metric': {
        const metricData: MetricData = await req.json();
        
        const { error } = await supabaseClient
          .from('success_metrics')
          .insert({
            metric_name: metricData.metricName,
            metric_category: metricData.metricCategory,
            metric_value: metricData.metricValue,
            target_value: metricData.targetValue,
            metric_unit: metricData.metricUnit,
            vendor_id: metricData.vendorId,
            user_id: metricData.userId,
            additional_data: metricData.additionalData || {}
          });

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, message: 'Metric tracked successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'track-engagement': {
        const engagementData: EngagementData = await req.json();
        
        const { error } = await supabaseClient
          .from('user_engagement_metrics')
          .insert(engagementData);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, message: 'Engagement tracked successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'track-realtime-usage': {
        const realtimeData: RealtimeUsageData = await req.json();
        
        const { error } = await supabaseClient
          .from('realtime_feature_usage')
          .insert({
            user_id: realtimeData.userId,
            feature_name: realtimeData.featureName,
            usage_duration: realtimeData.usageDuration,
            interaction_count: realtimeData.interactionCount || 1,
            session_id: realtimeData.sessionId
          });

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, message: 'Realtime usage tracked successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'track-conversion': {
        const conversionData: ConversionData = await req.json();
        
        const { error } = await supabaseClient
          .from('conversion_tracking')
          .insert({
            user_id: conversionData.userId,
            session_id: conversionData.sessionId,
            conversion_type: conversionData.conversionType,
            source_page: conversionData.sourcePage,
            target_action: conversionData.targetAction,
            conversion_value: conversionData.conversionValue,
            search_query: conversionData.searchQuery,
            products_viewed: conversionData.productsViewed || [],
            time_to_conversion: conversionData.timeToConversion
          });

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, message: 'Conversion tracked successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'calculate-metrics': {
        // Calculate success metrics for all phases
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Phase 1 Metrics
        const vendorDashboardAdoption = await calculateVendorDashboardAdoption(supabaseClient, thirtyDaysAgo);
        const realtimeFeatureUsage = await calculateRealtimeUsage(supabaseClient, thirtyDaysAgo);
        const analyticsDashboardEngagement = await calculateAnalyticsEngagement(supabaseClient, thirtyDaysAgo);

        // Phase 2 Metrics
        const searchConversionRate = await calculateSearchConversionRate(supabaseClient, thirtyDaysAgo);
        const mobilePerformanceScore = await calculateMobilePerformanceScore(supabaseClient, thirtyDaysAgo);

        // Phase 3 Metrics
        const pwaInstallRate = await calculatePWAInstallRate(supabaseClient, thirtyDaysAgo);
        const offlineFunctionalityUsage = await calculateOfflineUsage(supabaseClient, thirtyDaysAgo);
        const mobileConversionRate = await calculateMobileConversionRate(supabaseClient, thirtyDaysAgo);

        const metrics = {
          phase1: {
            vendorDashboardAdoption,
            realtimeFeatureUsage,
            analyticsDashboardEngagement
          },
          phase2: {
            searchConversionRate,
            mobilePerformanceScore
          },
          phase3: {
            pwaInstallRate,
            offlineFunctionalityUsage,
            mobileConversionRate
          }
        };

        return new Response(
          JSON.stringify({ success: true, metrics }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in metrics tracking:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper functions for metric calculations
async function calculateVendorDashboardAdoption(supabase: any, since: Date) {
  const { data: totalVendors } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'vendor');

  const { data: activeVendors } = await supabase
    .from('user_engagement_metrics')
    .select('user_id')
    .eq('page_type', 'vendor_dashboard')
    .gte('created_at', since.toISOString());

  const uniqueActiveVendors = new Set(activeVendors?.map(v => v.user_id) || []);
  return (uniqueActiveVendors.size / (totalVendors?.length || 1)) * 100;
}

async function calculateRealtimeUsage(supabase: any, since: Date) {
  const { data: totalUsers } = await supabase
    .from('profiles')
    .select('id');

  const { data: realtimeUsers } = await supabase
    .from('realtime_feature_usage')
    .select('user_id')
    .gte('created_at', since.toISOString());

  const uniqueRealtimeUsers = new Set(realtimeUsers?.map(u => u.user_id) || []);
  return (uniqueRealtimeUsers.size / (totalUsers?.length || 1)) * 100;
}

async function calculateAnalyticsEngagement(supabase: any, since: Date) {
  const { data: totalUsers } = await supabase
    .from('profiles')
    .select('id');

  const { data: analyticsUsers } = await supabase
    .from('user_engagement_metrics')
    .select('user_id')
    .eq('page_type', 'analytics_dashboard')
    .gte('created_at', since.toISOString());

  const uniqueAnalyticsUsers = new Set(analyticsUsers?.map(u => u.user_id) || []);
  return (uniqueAnalyticsUsers.size / (totalUsers?.length || 1)) * 100;
}

async function calculateSearchConversionRate(supabase: any, since: Date) {
  const { data: searches } = await supabase
    .from('search_analytics')
    .select('*')
    .gte('timestamp', since.toISOString());

  const { data: conversions } = await supabase
    .from('conversion_tracking')
    .select('*')
    .eq('conversion_type', 'search_to_purchase')
    .gte('created_at', since.toISOString());

  return ((conversions?.length || 0) / (searches?.length || 1)) * 100;
}

async function calculateMobilePerformanceScore(supabase: any, since: Date) {
  const { data: mobileMetrics } = await supabase
    .from('mobile_performance_metrics')
    .select('performance_score')
    .eq('device_type', 'mobile')
    .gte('created_at', since.toISOString());

  if (!mobileMetrics?.length) return 0;

  const avgScore = mobileMetrics.reduce((sum, m) => sum + (m.performance_score || 0), 0) / mobileMetrics.length;
  return avgScore;
}

async function calculatePWAInstallRate(supabase: any, since: Date) {
  const { data: totalUsers } = await supabase
    .from('profiles')
    .select('id')
    .gte('created_at', since.toISOString());

  const { data: pwaInstalls } = await supabase
    .from('conversion_tracking')
    .select('user_id')
    .eq('conversion_type', 'pwa_install')
    .gte('created_at', since.toISOString());

  return ((pwaInstalls?.length || 0) / (totalUsers?.length || 1)) * 100;
}

async function calculateOfflineUsage(supabase: any, since: Date) {
  const { data: totalUsers } = await supabase
    .from('profiles')
    .select('id');

  const { data: offlineUsers } = await supabase
    .from('pwa_usage')
    .select('user_id')
    .neq('offline_actions', '[]')
    .gte('created_at', since.toISOString());

  const uniqueOfflineUsers = new Set(offlineUsers?.map(u => u.user_id) || []);
  return (uniqueOfflineUsers.size / (totalUsers?.length || 1)) * 100;
}

async function calculateMobileConversionRate(supabase: any, since: Date) {
  const { data: mobileVisits } = await supabase
    .from('mobile_performance_metrics')
    .select('user_id')
    .eq('device_type', 'mobile')
    .gte('created_at', since.toISOString());

  const { data: mobileConversions } = await supabase
    .from('conversion_tracking')
    .select('user_id')
    .eq('conversion_type', 'mobile_checkout')
    .gte('created_at', since.toISOString());

  return ((mobileConversions?.length || 0) / (mobileVisits?.length || 1)) * 100;
}