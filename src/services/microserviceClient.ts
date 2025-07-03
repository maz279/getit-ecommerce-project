import { supabase } from '@/integrations/supabase/client';

export class MicroserviceClient {
  private static instance: MicroserviceClient;
  private serviceRegistry: Map<string, any> = new Map();

  private constructor() {
    this.loadServiceRegistry();
  }

  static getInstance(): MicroserviceClient {
    if (!MicroserviceClient.instance) {
      MicroserviceClient.instance = new MicroserviceClient();
    }
    return MicroserviceClient.instance;
  }

  private async loadServiceRegistry() {
    try {
      // Fallback to hardcoded service registry until migration is complete
      const defaultServices = [
        { service_name: 'user-management-api', service_type: 'user', base_url: '/functions/v1/user-management-api', health_endpoint: '/functions/v1/user-management-api/health', auth_required: true },
        { service_name: 'vendor-management-api', service_type: 'vendor', base_url: '/functions/v1/vendor-management-api', health_endpoint: '/functions/v1/vendor-management-api/health', auth_required: true },
        { service_name: 'product-service', service_type: 'product', base_url: '/functions/v1/product-service', health_endpoint: '/functions/v1/product-service/health', auth_required: true },
        { service_name: 'payment-processing', service_type: 'payment', base_url: '/functions/v1/payment-processing', health_endpoint: '/functions/v1/payment-processing/health', auth_required: true },
        { service_name: 'orders-api', service_type: 'order', base_url: '/functions/v1/orders-api', health_endpoint: '/functions/v1/orders-api/health', auth_required: true },
        { service_name: 'notification-system', service_type: 'notification', base_url: '/functions/v1/notification-system', health_endpoint: '/functions/v1/notification-system/health', auth_required: true },
        { service_name: 'ai-enhanced-search', service_type: 'search', base_url: '/functions/v1/ai-enhanced-search', health_endpoint: '/functions/v1/ai-enhanced-search/health', auth_required: false }
      ];
      
      defaultServices.forEach(service => {
        this.serviceRegistry.set(service.service_name, service);
      });
    } catch (error) {
      console.error('Failed to load service registry:', error);
    }
  }

  async callService(serviceName: string, endpoint: string, options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  } = {}) {
    const service = this.serviceRegistry.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found in registry`);
    }

    const { method = 'GET', body, headers = {} } = options;
    
    // Get user session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };

    if (session?.access_token && service.auth_required) {
      requestHeaders['Authorization'] = `Bearer ${session.access_token}`;
    }

    // Use API Gateway for all requests
    const response = await supabase.functions.invoke('api-gateway', {
      body: {
        service: serviceName,
        endpoint,
        method,
        body,
        headers: requestHeaders
      }
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }

  // Convenience methods for different services
  async userService(endpoint: string, options?: any) {
    return this.callService('user-management-api', endpoint, options);
  }

  async vendorService(endpoint: string, options?: any) {
    return this.callService('vendor-management-api', endpoint, options);
  }

  async productService(endpoint: string, options?: any) {
    return this.callService('product-service', endpoint, options);
  }

  async orderService(endpoint: string, options?: any) {
    return this.callService('orders-api', endpoint, options);
  }

  async paymentService(endpoint: string, options?: any) {
    return this.callService('payment-processing', endpoint, options);
  }

  async notificationService(endpoint: string, options?: any) {
    return this.callService('notification-system', endpoint, options);
  }

  async searchService(endpoint: string, options?: any) {
    return this.callService('ai-enhanced-search', endpoint, options);
  }

  // Health check for all services
  async healthCheck(): Promise<Record<string, any>> {
    const healthStatus: Record<string, any> = {};
    
    for (const [serviceName] of this.serviceRegistry) {
      try {
        const result = await this.callService(serviceName, 'health');
        healthStatus[serviceName] = { status: 'healthy', ...result };
      } catch (error) {
        healthStatus[serviceName] = { 
          status: 'unhealthy', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    }

    return healthStatus;
  }

  // Circuit breaker pattern implementation
  private circuitBreakers: Map<string, any> = new Map();

  private async executeWithCircuitBreaker(serviceName: string, operation: () => Promise<any>) {
    const circuitBreaker = this.circuitBreakers.get(serviceName) || {
      failures: 0,
      lastFailureTime: 0,
      state: 'CLOSED' // CLOSED, OPEN, HALF_OPEN
    };

    if (circuitBreaker.state === 'OPEN') {
      const now = Date.now();
      if (now - circuitBreaker.lastFailureTime > 60000) { // 1 minute timeout
        circuitBreaker.state = 'HALF_OPEN';
      } else {
        throw new Error(`Circuit breaker is OPEN for service ${serviceName}`);
      }
    }

    try {
      const result = await operation();
      if (circuitBreaker.state === 'HALF_OPEN') {
        circuitBreaker.state = 'CLOSED';
        circuitBreaker.failures = 0;
      }
      this.circuitBreakers.set(serviceName, circuitBreaker);
      return result;
    } catch (error) {
      circuitBreaker.failures++;
      circuitBreaker.lastFailureTime = Date.now();
      
      if (circuitBreaker.failures >= 5) { // Threshold
        circuitBreaker.state = 'OPEN';
      }
      
      this.circuitBreakers.set(serviceName, circuitBreaker);
      throw error;
    }
  }
}

// Export singleton instance
export const microserviceClient = MicroserviceClient.getInstance();

// Type definitions for better TypeScript support
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role: 'admin' | 'vendor' | 'customer' | 'moderator' | 'super_admin';
  is_verified?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  vendor_id: string;
  sku: string;
  name: string;
  description?: string;
  category_path: string;
  attributes?: any;
  variants?: any[];
  media?: any[];
  status: string;
  is_featured?: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  order_number: string;
  status: string;
  total_amount: number;
  shipping_address?: any;
  billing_address?: any;
  payment_method?: string;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  user_id: string;
  business_name: string;
  business_email?: string;
  business_phone?: string;
  business_address?: any;
  trade_license?: string;
  nid_number?: string;
  bank_details?: any;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  commission_rate?: number;
  rating?: number;
  total_sales?: number;
  created_at: string;
  updated_at: string;
}