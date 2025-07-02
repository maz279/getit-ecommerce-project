import React, { useEffect, useRef, ReactNode } from 'react';
import { useMetricsContext } from '@/components/analytics/MetricsProvider';

interface MetricsWrapperProps {
  children: ReactNode;
  pageType: string;
  trackScrollDepth?: boolean;
  trackTimeOnPage?: boolean;
  trackClicks?: boolean;
}

export const MetricsWrapper: React.FC<MetricsWrapperProps> = ({
  children,
  pageType,
  trackScrollDepth = true,
  trackTimeOnPage = true,
  trackClicks = true
}) => {
  const { trackPageView, trackUserAction, startTimer } = useMetricsContext();
  const timerRef = useRef<(() => number) | null>(null);
  const scrollDepthRef = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start tracking time on page
    if (trackTimeOnPage) {
      timerRef.current = startTimer();
    }

    // Track initial page view
    trackPageView(pageType);

    // Track scroll depth
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (!trackScrollDepth) return;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        if (scrollPercent > scrollDepthRef.current) {
          scrollDepthRef.current = scrollPercent;
          
          // Track milestones
          if (scrollPercent >= 25 && scrollDepthRef.current < 25) {
            trackUserAction('scroll_depth_25', pageType);
          } else if (scrollPercent >= 50 && scrollDepthRef.current < 50) {
            trackUserAction('scroll_depth_50', pageType);
          } else if (scrollPercent >= 75 && scrollDepthRef.current < 75) {
            trackUserAction('scroll_depth_75', pageType);
          } else if (scrollPercent >= 90 && scrollDepthRef.current < 90) {
            trackUserAction('scroll_depth_90', pageType);
          }
        }
      }, 100);
    };

    // Track clicks
    const handleClick = (event: MouseEvent) => {
      if (!trackClicks) return;
      
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const className = target.className;
      const id = target.id;
      
      let actionName = 'click';
      let feature = pageType;
      
      // Identify specific features based on element attributes
      if (tagName === 'button') {
        actionName = 'button_click';
        feature = `${pageType}_button`;
      } else if (tagName === 'a') {
        actionName = 'link_click';
        feature = `${pageType}_link`;
      } else if (className.includes('card')) {
        actionName = 'card_click';
        feature = `${pageType}_card`;
      } else if (className.includes('menu') || className.includes('nav')) {
        actionName = 'navigation_click';
        feature = `${pageType}_navigation`;
      }
      
      // Track real-time features
      if (className.includes('realtime') || className.includes('live') || id.includes('chat')) {
        feature = 'realtime_feature';
      }
      
      trackUserAction(actionName, feature);
    };

    // Add event listeners
    if (trackScrollDepth) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    if (trackClicks && wrapperRef.current) {
      wrapperRef.current.addEventListener('click', handleClick);
    }

    // Cleanup function
    return () => {
      // Track time on page when component unmounts
      if (trackTimeOnPage && timerRef.current) {
        const timeSpent = timerRef.current();
        trackPageView(pageType, Math.round(timeSpent / 1000)); // Convert to seconds
      }
      
      // Remove event listeners
      if (trackScrollDepth) {
        window.removeEventListener('scroll', handleScroll);
      }
      
      if (trackClicks && wrapperRef.current) {
        wrapperRef.current.removeEventListener('click', handleClick);
      }
      
      clearTimeout(scrollTimeout);
    };
  }, [pageType, trackPageView, trackUserAction, startTimer, trackScrollDepth, trackTimeOnPage, trackClicks]);

  return (
    <div ref={wrapperRef} className="metrics-wrapper">
      {children}
    </div>
  );
};