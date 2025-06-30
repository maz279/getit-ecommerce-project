
/**
 * GetIt Bangladesh Multi-Vendor Ecommerce Platform
 * Customer Management Router Utilities
 */

import { 
  RouterConfig, 
  RouteAnalytics, 
  RouterError 
} from './customer-router-types';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static metrics: Map<string, number> = new Map();

  static startTimer(routeName: string): void {
    this.metrics.set(`${routeName}_start`, performance.now());
  }

  static endTimer(routeName: string): number {
    const startTime = this.metrics.get(`${routeName}_start`);
    if (!startTime) return 0;
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    this.metrics.set(`${routeName}_duration`, duration);
    return duration;
  }

  static getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
}

// Error recovery utilities
export class ErrorRecovery {
  private static errorLog: RouterError[] = [];

  static logError(error: RouterError): void {
    this.errorLog.push(error);
    console.error('Router Error:', error);
    
    // Send to analytics if available
    if (window.analytics) {
      window.analytics.track('router_error', {
        route: error.route,
        component: error.component,
        errorName: error.error.name,
        timestamp: error.userContext.timestamp
      });
    }
  }

  static getErrorLog(): RouterError[] {
    return this.errorLog;
  }

  static clearErrorLog(): void {
    this.errorLog = [];
  }
}

// Route caching utilities
export class RouteCache {
  private static cache: Map<string, any> = new Map();
  private static ttl: Map<string, number> = new Map();

  static set(key: string, value: any, ttlMs: number = 300000): void {
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttlMs);
  }

  static get(key: string): any | null {
    const expiry = this.ttl.get(key);
    if (!expiry || Date.now() > expiry) {
      this.cache.delete(key);
      this.ttl.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  static clear(): void {
    this.cache.clear();
    this.ttl.clear();
  }
}

// Bangladesh-specific utilities
export class BangladeshUtils {
  static formatMobile(mobile: string): string {
    // Format to +880XXXXXXXXX
    let cleaned = mobile.replace(/\D/g, '');
    if (cleaned.startsWith('880')) {
      return `+${cleaned}`;
    }
    if (cleaned.startsWith('0')) {
      return `+880${cleaned.substring(1)}`;
    }
    return `+880${cleaned}`;
  }

  static validateMobile(mobile: string): boolean {
    const pattern = /^\+880[1-9]\d{8}$/;
    return pattern.test(mobile);
  }

  static getDivisions(): string[] {
    return [
      'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 
      'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
    ];
  }

  static getPaymentMethods(): string[] {
    return ['cod', 'bkash', 'nagad', 'rocket', 'card'];
  }
}

// Accessibility utilities
export class AccessibilityUtils {
  static announceRouteChange(routeName: string): void {
    const announcement = `Navigated to ${routeName.replace('-', ' ')} section`;
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = announcement;
    
    document.body.appendChild(announcer);
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }

  static focusFirstElement(container: HTMLElement): void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  }

  static setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        // Handle escape key for modal/drawer closing
        const activeModal = document.querySelector('[role="dialog"]');
        if (activeModal) {
          const closeButton = activeModal.querySelector('[aria-label="Close"]');
          if (closeButton) {
            (closeButton as HTMLElement).click();
          }
        }
      }
    });
  }
}

// Route validation utilities
export const validateRouteInput = (input: string): boolean => {
  if (!input || typeof input !== 'string') {
    return false;
  }
  
  // Sanitize input to prevent XSS
  const sanitized = input.replace(/[<>"\/]/g, '');
  return sanitized === input && sanitized.length <= 100;
};

// Configuration management
export const getRouterConfig = (): RouterConfig => {
  return {
    environment: process.env.NODE_ENV as 'development' | 'staging' | 'production' || 'development',
    enableAnalytics: process.env.NODE_ENV === 'production',
    enableErrorTracking: true,
    debugMode: process.env.NODE_ENV === 'development',
    defaultLanguage: 'en',
    supportedLanguages: ['bn', 'en'],
    maxRetries: 3,
    timeoutMs: 30000
  };
};

// Route analytics utilities
export const trackRouteAnalytics = (routeData: Partial<RouteAnalytics>): void => {
  const analytics: RouteAnalytics = {
    route: routeData.route || 'unknown',
    component: routeData.component || 'unknown',
    loadTime: routeData.loadTime || 0,
    errorRate: routeData.errorRate || 0,
    usageCount: routeData.usageCount || 1,
    lastAccessed: new Date(),
    userAgent: navigator.userAgent,
    location: window.location.pathname
  };

  // Send to analytics service
  if (window.analytics) {
    window.analytics.track('route_access', analytics);
  }

  console.log('Route Analytics:', analytics);
};
