import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useMetricsTracking } from '@/hooks/useMetricsTracking';

interface MetricsContextType {
  sessionId: string;
  trackPageView: (pageType: string, duration?: number) => void;
  trackUserAction: (action: string, feature?: string, value?: number) => void;
  trackConversion: (type: string, value?: number, searchQuery?: string) => void;
  trackPerformance: (loadTime: number, score: number) => void;
  startTimer: () => () => number; // Returns a function that returns elapsed time
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

interface MetricsProviderProps {
  children: ReactNode;
}

export const MetricsProvider: React.FC<MetricsProviderProps> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string>('');
  const [pageStartTime, setPageStartTime] = useState<number>(Date.now());
  const {
    generateSessionId,
    trackEngagement,
    trackConversion,
    trackPerformance: trackPerf,
    trackRealtimeFeature
  } = useMetricsTracking();

  useEffect(() => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setPageStartTime(Date.now());

    // Track initial page load performance
    const observer = new PerformanceObserver((list) => {
      const navigation = list.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        const score = calculatePerformanceScore(navigation);
        trackPerformance(loadTime, score);
      }
    });
    observer.observe({ entryTypes: ['navigation'] });

    return () => {
      observer.disconnect();
    };
  }, [generateSessionId]);

  const calculatePerformanceScore = (navigation: PerformanceNavigationTiming): number => {
    const fcp = navigation.responseStart - navigation.requestStart;
    const lcp = navigation.loadEventEnd - navigation.loadEventStart;
    const cls = 0; // Would need additional measurement for real CLS
    
    let score = 100;
    
    // First Contentful Paint scoring
    if (fcp > 3000) score -= 30;
    else if (fcp > 1800) score -= 20;
    else if (fcp > 1000) score -= 10;
    
    // Largest Contentful Paint scoring
    if (lcp > 4000) score -= 30;
    else if (lcp > 2500) score -= 20;
    else if (lcp > 1500) score -= 10;
    
    return Math.max(0, score);
  };

  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  const trackPageView = (pageType: string, duration?: number) => {
    trackEngagement({
      sessionId,
      pageType,
      actionType: 'page_view',
      engagementDuration: duration
    });
  };

  const trackUserAction = (action: string, feature?: string, value?: number) => {
    if (feature && (feature.includes('realtime') || feature.includes('live') || feature.includes('chat'))) {
      trackRealtimeFeature(feature, sessionId);
    } else {
      trackEngagement({
        sessionId,
        pageType: 'unknown',
        actionType: action,
        featureUsed: feature,
        conversionValue: value
      });
    }
  };

  const trackConversionAction = (type: string, value?: number, searchQuery?: string) => {
    trackConversion({
      sessionId,
      conversionType: type,
      conversionValue: value,
      searchQuery,
      timeToConversion: Date.now() - pageStartTime
    });
  };

  const trackPerformance = (loadTime: number, score: number) => {
    trackPerf({
      deviceType: getDeviceType(),
      pageLoadTime: loadTime,
      performanceScore: score,
      networkType: (navigator as any).connection?.effectiveType || 'unknown',
      pageUrl: window.location.pathname
    });
  };

  const startTimer = () => {
    const startTime = Date.now();
    return () => Date.now() - startTime;
  };

  const contextValue: MetricsContextType = {
    sessionId,
    trackPageView,
    trackUserAction,
    trackConversion: trackConversionAction,
    trackPerformance,
    startTimer
  };

  return (
    <MetricsContext.Provider value={contextValue}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetricsContext = (): MetricsContextType => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetricsContext must be used within a MetricsProvider');
  }
  return context;
};