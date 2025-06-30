// utils/customer-router.utils.ts

/**
 * GetIt Bangladesh Multi-Vendor Ecommerce Platform
 * Customer Management Router Utilities and Configuration
 */

import { RouterConfig, RouteAnalytics, RouterError } from '../types/customer-management.types';

// Environment-specific configuration
export const ROUTER_CONFIG: Record<string, RouterConfig> = {
  development: {
    environment: 'development',
    enableAnalytics: true,
    enableErrorTracking: true,
    debugMode: true,
    defaultLanguage: 'en',
    supportedLanguages: ['bn', 'en'],
    maxRetries: 3,
    timeoutMs: 30000
  },
  staging: {
    environment: 'staging',
    enableAnalytics: true,
    enableErrorTracking: true,
    debugMode: false,
    defaultLanguage: 'bn',
    supportedLanguages: ['bn', 'en'],
    maxRetries: 2,
    timeoutMs: 20000
  },
  production: {
    environment: 'production',
    enableAnalytics: true,
    enableErrorTracking: true,
    debugMode: false,
    defaultLanguage: 'bn',
    supportedLanguages: ['bn', 'en'],
    maxRetries: 2,
    timeoutMs: 15000
  }
};

// Get current configuration based on environment
export const getCurrentConfig = (): RouterConfig => {
  const env = process.env.NODE_ENV || 'development';
  return ROUTER_CONFIG[env] || ROUTER_CONFIG.development;
};

// Performance monitoring utility
export class PerformanceMonitor {
  private static metrics: Map<string, RouteAnalytics> = new Map();
  
  static startTracking(route: string, component: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      this.recordMetric(route, component, loadTime);
    };
  }
  
  private static recordMetric(route: string, component: string, loadTime: number): void {
    const key = `${route}-${component}`;
    const existing = this.metrics.get(key);
    
    const analytics: RouteAnalytics = {
      route,
      component,
      loadTime,
      errorRate: existing?.errorRate || 0,
      usageCount: (existing?.usageCount || 0) + 1,
      lastAccessed: new Date(),
      userAgent: navigator.userAgent,
      location: window.location.pathname
    };
    
    this.metrics.set(key, analytics);
    
    // Send to analytics service in production
    if (getCurrentConfig().enableAnalytics && window.analytics) {
      window.analytics.track('route_performance', {
        route,
        component,
        loadTime,
        usageCount: analytics.usageCount,
        platform: 'getit-bangladesh'
      });
    }
  }
  
  static getMetrics(): RouteAnalytics[] {
    return Array.from(this.metrics.values());
  }
  
  static clearMetrics(): void {
    this.metrics.clear();
  }
}

// Error recovery utility
export class ErrorRecovery {
  private static retryCount: Map<string, number> = new Map();
  private static maxRetries = getCurrentConfig().maxRetries;
  
  static canRetry(route: string): boolean {
    const count = this.retryCount.get(route) || 0;
    return count < this.maxRetries;
  }
  
  static incrementRetry(route: string): void {
    const count = this.retryCount.get(route) || 0;
    this.retryCount.set(route, count + 1);
  }
  
  static resetRetry(route: string): void {
    this.retryCount.delete(route);
  }
  
  static handleError(error: Error, route: string, component: string): void {
    const routerError: RouterError = {
      id: generateErrorId(),
      route,
      component,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      userContext: {
        sessionId: getSessionId(),
        userAgent: navigator.userAgent,
        timestamp: new Date()
      },
      resolved: false
    };
    
    // Log to console in development
    if (getCurrentConfig().debugMode) {
      console.error('Router Error:', routerError);
    }
    
    // Send to error tracking service
    if (getCurrentConfig().enableErrorTracking && window.Sentry) {
      window.Sentry.captureException(error, {
        tags: {
          component: 'CustomerManagementRouter',
          route,
          errorId: routerError.id
        },
        extra: routerError
      });
    }
  }
}

// Route caching utility for performance
export class RouteCache {
  private static cache: Map<string, { component: React.ComponentType; timestamp: number }> = new Map();
  private static cacheTimeout = 5 * 60 * 1000; // 5 minutes
  
  static set(route: string, component: React.ComponentType): void {
    this.cache.set(route, {
      component,
      timestamp: Date.now()
    });
  }
  
  static get(route: string): React.ComponentType | null {
    const cached = this.cache.get(route);
    
    if (!cached) return null;
    
    // Check if cache is still valid
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(route);
      return null;
    }
    
    return cached.component;
  }
  
  static clear(): void {
    this.cache.clear();
  }
  
  static cleanup(): void {
    const now = Date.now();
    for (const [route, data] of this.cache.entries()) {
      if (now - data.timestamp > this.cacheTimeout) {
        this.cache.delete(route);
      }
    }
  }
}

// Bangladesh-specific utilities
export class BangladeshUtils {
  // Validate Bangladesh mobile number
  static validateMobileNumber(mobile: string): boolean {
    const bdMobileRegex = /^(\+8801|01)[3-9]\d{8}$/;
    return bdMobileRegex.test(mobile);
  }
  
  // Get Bangladesh districts
  static getBangladeshDistricts(): string[] {
    return [
      'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh',
      'Comilla', 'Narayanganj', 'Gazipur', 'Tangail', 'Jamalpur', 'Sherpur', 'Netrokona',
      'Kishoreganj', 'Manikganj', 'Munshiganj', 'Faridpur', 'Rajbari', 'Madaripur', 'Gopalganj',
      'Shariatpur', 'Narsingdi', 'Brahmanbaria', 'Chandpur', 'Lakshmipur', 'Feni', 'Noakhali',
      'Coxs Bazar', 'Khagrachhari', 'Rangamati', 'Bandarban', 'Pabna', 'Bogra', 'Sirajganj',
      'Natore', 'Chapainawabganj', 'Naogaon', 'Joypurhat', 'Satkhira', 'Jessore', 'Narail',
      'Chuadanga', 'Kushtia', 'Meherpur', 'Magura', 'Bagerhat', 'Jhalokati', 'Patuakhali',
      'Pirojpur', 'Barguna', 'Bhola', 'Habiganj', 'Moulvibazar', 'Sunamganj', 'Panchagarh',
      'Thakurgaon', 'Dinajpur', 'Lalmonirhat', 'Nilphamari', 'Gaibandha', 'Kurigram'
    ];
  }
  
  // Format Bengali text for display
  static formatBengaliText(text: string): string {
    // Remove extra whitespace and normalize Bengali text
    return text.trim().replace(/\s+/g, ' ').replace(/[\u200B-\u200D\uFEFF]/g, '');
  }
  
  // Check if text contains Bengali characters
  static containsBengali(text: string): boolean {
    const bengaliRegex = /[\u0980-\u09FF]/;
    return bengaliRegex.test(text);
  }
  
  // Get festival dates for current year
  static getFestivalDates(year: number): Record<string, Date> {
    return {
      eidUlFitr: new Date(year, 3, 21), // Approximate - should be calculated based on lunar calendar
      eidUlAdha: new Date(year, 6, 28), // Approximate
      durgaPuja: new Date(year, 9, 15), // Approximate
      pohelaBoishakh: new Date(year, 3, 14), // April 14
      victoryDay: new Date(year, 11, 16), // December 16
      independenceDay: new Date(year, 2, 26) // March 26
    };
  }
}

// Accessibility utilities
export class AccessibilityUtils {
  // Check if user prefers reduced motion
  static prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  // Announce to screen readers
  static announceToScreenReader(message: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  // Set focus for keyboard navigation
  static setFocus(element: HTMLElement): void {
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Helper functions
function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('getit_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('getit_session_id', sessionId);
  }
  return sessionId;
}

// React hook for router utilities
export const useRouterUtils = () => {
  const config = getCurrentConfig();
  
  return {
    config,
    performance: PerformanceMonitor,
    errorRecovery: ErrorRecovery,
    cache: RouteCache,
    bangladesh: BangladeshUtils,
    accessibility: AccessibilityUtils
  };
};

// Export all utilities
export {
  PerformanceMonitor,
  ErrorRecovery,
  RouteCache,
  BangladeshUtils,
  AccessibilityUtils
};

// Default export with all utilities
export default {
  config: getCurrentConfig(),
  performance: PerformanceMonitor,
  errorRecovery: ErrorRecovery,
  cache: RouteCache,
  bangladesh: BangladeshUtils,
  accessibility: AccessibilityUtils
};