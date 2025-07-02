import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MetricTrackingData {
  metricName: string;
  metricCategory: 'phase1' | 'phase2' | 'phase3';
  metricValue: number;
  targetValue: number;
  metricUnit: 'percentage' | 'count' | 'score';
  vendorId?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

interface EngagementTrackingData {
  sessionId: string;
  pageType: string;
  actionType: string;
  engagementDuration?: number;
  featureUsed?: string;
  conversionValue?: number;
}

interface RealtimeUsageData {
  featureName: string;
  usageDuration?: number;
  interactionCount?: number;
  sessionId?: string;
}

interface ConversionTrackingData {
  sessionId: string;
  conversionType: string;
  sourcePage?: string;
  targetAction?: string;
  conversionValue?: number;
  searchQuery?: string;
  productsViewed?: any[];
  timeToConversion?: number;
}

interface PerformanceData {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  pageLoadTime: number;
  performanceScore: number;
  networkType?: string;
  pageUrl: string;
}

export const useMetricsTracking = () => {
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const trackMetric = useCallback(async (data: MetricTrackingData) => {
    try {
      const { error } = await supabase.functions.invoke('metrics-tracking/track-metric', {
        body: data
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error tracking metric:', error);
      return { success: false, error };
    }
  }, []);

  const trackEngagement = useCallback(async (data: EngagementTrackingData) => {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      if (!userId) return { success: false, error: 'User not authenticated' };

      const { error } = await supabase.functions.invoke('metrics-tracking/track-engagement', {
        body: {
          userId,
          ...data
        }
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error tracking engagement:', error);
      return { success: false, error };
    }
  }, []);

  const trackRealtimeUsage = useCallback(async (data: RealtimeUsageData) => {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      const { error } = await supabase.functions.invoke('metrics-tracking/track-realtime-usage', {
        body: {
          userId,
          ...data
        }
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error tracking realtime usage:', error);
      return { success: false, error };
    }
  }, []);

  const trackConversion = useCallback(async (data: ConversionTrackingData) => {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      const { error } = await supabase.functions.invoke('metrics-tracking/track-conversion', {
        body: {
          userId,
          ...data
        }
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error tracking conversion:', error);
      return { success: false, error };
    }
  }, []);

  const trackPerformance = useCallback(async (data: PerformanceData) => {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      const { error } = await supabase
        .from('mobile_performance_metrics')
        .insert({
          user_id: userId,
          device_type: data.deviceType,
          page_load_time: data.pageLoadTime,
          performance_score: data.performanceScore,
          network_type: data.networkType,
          user_agent: navigator.userAgent,
          page_url: data.pageUrl
        });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error tracking performance:', error);
      return { success: false, error };
    }
  }, []);

  // Specific tracking methods for common use cases
  const trackVendorDashboardVisit = useCallback((sessionId: string, duration?: number) => {
    return trackEngagement({
      sessionId,
      pageType: 'vendor_dashboard',
      actionType: 'page_view',
      engagementDuration: duration
    });
  }, [trackEngagement]);

  const trackAnalyticsDashboardVisit = useCallback((sessionId: string, duration?: number) => {
    return trackEngagement({
      sessionId,
      pageType: 'analytics_dashboard',
      actionType: 'page_view',
      engagementDuration: duration
    });
  }, [trackEngagement]);

  const trackSearchToPurchase = useCallback((sessionId: string, searchQuery: string, conversionValue: number, timeToConversion: number) => {
    return trackConversion({
      sessionId,
      conversionType: 'search_to_purchase',
      searchQuery,
      conversionValue,
      timeToConversion
    });
  }, [trackConversion]);

  const trackPWAInstall = useCallback((sessionId: string) => {
    return trackConversion({
      sessionId,
      conversionType: 'pwa_install',
      targetAction: 'install_pwa'
    });
  }, [trackConversion]);

  const trackMobileCheckout = useCallback((sessionId: string, conversionValue: number) => {
    return trackConversion({
      sessionId,
      conversionType: 'mobile_checkout',
      conversionValue
    });
  }, [trackConversion]);

  const trackRealtimeFeature = useCallback((featureName: string, sessionId: string, duration?: number) => {
    return trackRealtimeUsage({
      featureName,
      sessionId,
      usageDuration: duration
    });
  }, [trackRealtimeUsage]);

  return {
    generateSessionId,
    trackMetric,
    trackEngagement,
    trackRealtimeUsage,
    trackConversion,
    trackPerformance,
    // Convenience methods
    trackVendorDashboardVisit,
    trackAnalyticsDashboardVisit,
    trackSearchToPurchase,
    trackPWAInstall,
    trackMobileCheckout,
    trackRealtimeFeature
  };
};