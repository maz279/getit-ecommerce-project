import { supabase } from "@/integrations/supabase/client";

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  metadata?: {
    timestamp: string;
    requestId: string;
    serviceVersion: string;
  };
}

export interface ServiceEndpoint {
  name: string;
  url: string;
  healthCheck: string;
  version: string;
  status: 'healthy' | 'degraded' | 'down';
  lastChecked: string;
}

export class ApiGateway {
  private static instance: ApiGateway;
  private services: Map<string, ServiceEndpoint> = new Map();
  private loadBalancer: Map<string, number> = new Map();

  private constructor() {
    this.initializeServices();
    this.startHealthChecking();
  }

  public static getInstance(): ApiGateway {
    if (!ApiGateway.instance) {
      ApiGateway.instance = new ApiGateway();
    }
    return ApiGateway.instance;
  }

  private initializeServices() {
    const defaultServices = [
      'user-service',
      'product-service', 
      'order-service',
      'payment-service',
      'vendor-service',
      'notification-service',
      'search-service',
      'analytics-service',
      'inventory-service',
      'fraud-detection',
      'ml-recommendation',
      'real-time-analytics',
      'ai-search',
      'voice-search',
      'ar-vr-engine'
    ];

    defaultServices.forEach(service => {
      this.services.set(service, {
        name: service,
        url: `/api/v1/${service}`,
        healthCheck: `/health`,
        version: '1.0.0',
        status: 'healthy',
        lastChecked: new Date().toISOString()
      });
      this.loadBalancer.set(service, 0);
    });
  }

  private async startHealthChecking() {
    setInterval(async () => {
      for (const [serviceName, endpoint] of this.services) {
        try {
          const { data, error } = await supabase.functions.invoke(`${serviceName}/health`);
          
          this.services.set(serviceName, {
            ...endpoint,
            status: error ? 'down' : 'healthy',
            lastChecked: new Date().toISOString()
          });
        } catch {
          this.services.set(serviceName, {
            ...endpoint,
            status: 'down',
            lastChecked: new Date().toISOString()
          });
        }
      }
    }, 30000); // Check every 30 seconds
  }

  async callService<T>(
    serviceName: string, 
    endpoint: string, 
    data?: any, 
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const service = this.services.get(serviceName);
    
    if (!service || service.status === 'down') {
      return {
        success: false,
        error: `Service ${serviceName} is unavailable`,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
          serviceVersion: service?.version || 'unknown'
        }
      };
    }

    try {
      const { data: responseData, error } = await supabase.functions.invoke(
        serviceName, 
        { 
          body: { 
            endpoint, 
            data,
            metadata: {
              requestId: crypto.randomUUID(),
              timestamp: new Date().toISOString()
            }
          } 
        }
      );

      // Log request for analytics
      await this.logRequest(serviceName, endpoint, !error);

      return {
        success: !error,
        data: responseData,
        error: error?.message,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
          serviceVersion: service.version
        }
      };
    } catch (error) {
      await this.logRequest(serviceName, endpoint, false);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
          serviceVersion: service.version
        }
      };
    }
  }

  private async logRequest(serviceName: string, endpoint: string, success: boolean) {
    try {
      await supabase.from('api_gateway_logs').insert({
        type: 'request',
        data: {
          service: serviceName,
          endpoint,
          success,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.warn('Failed to log API request:', error);
    }
  }

  getServiceHealth(): Map<string, ServiceEndpoint> {
    return new Map(this.services);
  }

  getHealthyServices(): string[] {
    return Array.from(this.services.entries())
      .filter(([, service]) => service.status === 'healthy')
      .map(([name]) => name);
  }

  // Circuit breaker pattern
  private circuitBreakers: Map<string, { failures: number; lastFailure: number; isOpen: boolean }> = new Map();

  private shouldAllowRequest(serviceName: string): boolean {
    const breaker = this.circuitBreakers.get(serviceName);
    if (!breaker) return true;

    if (breaker.isOpen) {
      // Check if enough time has passed to try again
      if (Date.now() - breaker.lastFailure > 60000) { // 1 minute
        breaker.isOpen = false;
        breaker.failures = 0;
        return true;
      }
      return false;
    }

    return true;
  }

  private recordFailure(serviceName: string) {
    const breaker = this.circuitBreakers.get(serviceName) || { failures: 0, lastFailure: 0, isOpen: false };
    breaker.failures++;
    breaker.lastFailure = Date.now();
    
    if (breaker.failures >= 5) { // Open circuit after 5 failures
      breaker.isOpen = true;
    }
    
    this.circuitBreakers.set(serviceName, breaker);
  }

  private recordSuccess(serviceName: string) {
    this.circuitBreakers.delete(serviceName);
  }
}

export const apiGateway = ApiGateway.getInstance();