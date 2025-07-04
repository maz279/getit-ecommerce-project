import { supabase } from '@/integrations/supabase/client';

export interface ServiceConfig {
  baseUrl: string;
  apiKey?: string;
  timeout: number;
  retryAttempts: number;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

class ServiceIntegrationLayer {
  private services: Map<string, ServiceConfig> = new Map();
  private healthChecks: Map<string, boolean> = new Map();

  constructor() {
    this.initializeServices();
    this.startHealthMonitoring();
  }

  private initializeServices() {
    // Initialize core microservices
    this.services.set('user-service', {
      baseUrl: 'https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/user-management-api',
      timeout: 5000,
      retryAttempts: 3
    });

    this.services.set('vendor-service', {
      baseUrl: 'https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/vendor-management-api',
      timeout: 5000,
      retryAttempts: 3
    });

    this.services.set('product-service', {
      baseUrl: 'https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/products-api',
      timeout: 5000,
      retryAttempts: 3
    });

    this.services.set('order-service', {
      baseUrl: 'https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/orders-api',
      timeout: 5000,
      retryAttempts: 3
    });

    this.services.set('payment-service', {
      baseUrl: 'https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/payment-processing',
      timeout: 10000,
      retryAttempts: 2
    });

    this.services.set('search-service', {
      baseUrl: 'https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/search-api',
      timeout: 3000,
      retryAttempts: 2
    });

    this.services.set('analytics-service', {
      baseUrl: 'https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/analytics-engine',
      timeout: 8000,
      retryAttempts: 2
    });

    this.services.set('ml-service', {
      baseUrl: 'https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/ml-recommendation-engine',
      timeout: 8000,
      retryAttempts: 2
    });
  }

  async callService<T>(
    serviceName: string, 
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ServiceResponse<T>> {
    const config = this.services.get(serviceName);
    if (!config) {
      return {
        success: false,
        error: `Service ${serviceName} not configured`,
        timestamp: new Date().toISOString()
      };
    }

    try {
      const response = await supabase.functions.invoke(serviceName, {
        body: {
          endpoint,
          method: options.method || 'GET',
          data: options.body ? JSON.parse(options.body as string) : undefined,
          headers: options.headers
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getUserProfile(userId: string) {
    return this.callService('user-service', `/users/${userId}`);
  }

  async getVendorProfile(vendorId: string) {
    return this.callService('vendor-service', `/vendors/${vendorId}`);
  }

  async searchProducts(query: string, filters?: any) {
    return this.callService('search-service', '/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters })
    });
  }

  async getRecommendations(userId: string, type: string = 'product') {
    return this.callService('ml-service', `/recommendations/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ type })
    });
  }

  async processPayment(paymentData: any) {
    return this.callService('payment-service', '/process', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }

  async createOrder(orderData: any) {
    return this.callService('order-service', '/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getAnalytics(type: string, dateRange?: any) {
    return this.callService('analytics-service', `/analytics/${type}`, {
      method: 'POST',
      body: JSON.stringify({ dateRange })
    });
  }

  private async startHealthMonitoring() {
    setInterval(async () => {
      for (const [serviceName] of this.services) {
        try {
          const response = await this.callService(serviceName, '/health');
          this.healthChecks.set(serviceName, response.success);
        } catch {
          this.healthChecks.set(serviceName, false);
        }
      }
    }, 30000); // Check every 30 seconds
  }

  getServiceHealth(): Map<string, boolean> {
    return new Map(this.healthChecks);
  }

  getAvailableServices(): string[] {
    return Array.from(this.services.keys());
  }
}

export const serviceIntegration = new ServiceIntegrationLayer();