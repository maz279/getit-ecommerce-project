// API Gateway Client - Centralized service communication
import { supabase } from '@/integrations/supabase/client';

export interface ServiceResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  success: boolean;
}

export interface ServiceConfig {
  name: string;
  endpoint: string;
  authRequired: boolean;
  timeout?: number;
  retries?: number;
}

export class ApiGatewayClient {
  private static instance: ApiGatewayClient;
  private serviceRegistry: Map<string, ServiceConfig> = new Map();
  private baseUrl: string;

  private constructor() {
    this.baseUrl = 'https://bbgppsjmspmymrfowytf.supabase.co/functions/v1';
    this.initializeServiceRegistry();
  }

  public static getInstance(): ApiGatewayClient {
    if (!ApiGatewayClient.instance) {
      ApiGatewayClient.instance = new ApiGatewayClient();
    }
    return ApiGatewayClient.instance;
  }

  private initializeServiceRegistry() {
    // Core Services
    this.registerService('user-management-api', 'user-management-api', true);
    this.registerService('vendor-management-api', 'vendor-management-api', true);
    this.registerService('product-service', 'product-service', true);
    this.registerService('orders-api', 'orders-api', true);
    
    // Payment Services
    this.registerService('payment-processing', 'payment-processing', true);
    this.registerService('bangladesh-payment-gateway', 'bangladesh-payment-gateway', false);
    this.registerService('vendor-payout-service', 'vendor-payout-service', true);
    this.registerService('financial-management-service', 'financial-management-service', true);
    
    // AI/ML Services
    this.registerService('ai-enhanced-search', 'ai-enhanced-search', false);
    this.registerService('ai-recommendation-engine', 'ai-recommendation-engine', false);
    this.registerService('ai-analytics-dashboard', 'ai-analytics-dashboard', true);
    this.registerService('ml-analytics-dashboard', 'ml-analytics-dashboard', true);
    this.registerService('voice-search-engine', 'voice-search-engine', false);
    this.registerService('ar-vr-engine', 'ar-vr-engine', false);
    
    // Infrastructure Services
    this.registerService('platform-monitoring', 'platform-monitoring', true);
    this.registerService('performance-monitor', 'performance-monitor', true);
    this.registerService('infrastructure-manager', 'infrastructure-manager', true);
    this.registerService('microservices-manager', 'microservices-manager', true);
    this.registerService('api-gateway-orchestrator', 'api-gateway-orchestrator', true);
    
    // Business Intelligence
    this.registerService('business-analytics', 'business-analytics', true);
    this.registerService('enterprise-analytics-engine', 'enterprise-analytics-engine', true);
    this.registerService('realtime-analytics', 'realtime-analytics', true);
    this.registerService('automated-reporting-system', 'automated-reporting-system', true);
    
    // Specialized Services
    this.registerService('notification-system', 'notification-system', true);
    this.registerService('supply-chain-optimizer', 'supply-chain-optimizer', true);
    this.registerService('inventory-management-enhanced', 'inventory-management-enhanced', true);
    this.registerService('disaster-recovery', 'disaster-recovery', true);
  }

  private registerService(name: string, endpoint: string, authRequired: boolean, timeout = 30000, retries = 3) {
    this.serviceRegistry.set(name, {
      name,
      endpoint,
      authRequired,
      timeout,
      retries
    });
  }

  public async callService<T = any>(
    serviceName: string, 
    endpoint: string, 
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: any;
      headers?: Record<string, string>;
      timeout?: number;
    } = {}
  ): Promise<ServiceResponse<T>> {
    const service = this.serviceRegistry.get(serviceName);
    
    if (!service) {
      return {
        success: false,
        status: 404,
        error: `Service ${serviceName} not found in registry`
      };
    }

    try {
      const { data, error } = await supabase.functions.invoke(service.endpoint, {
        body: {
          endpoint,
          method: options.method || 'GET',
          data: options.data,
          headers: options.headers
        }
      });

      if (error) {
        return {
          success: false,
          status: 500,
          error: error.message || 'Service call failed'
        };
      }

      return {
        success: true,
        status: 200,
        data
      };
    } catch (error) {
      console.error(`Service call failed for ${serviceName}:`, error);
      return {
        success: false,
        status: 500,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Convenience methods for common operations
  public async getServiceHealth(serviceName: string): Promise<ServiceResponse> {
    return this.callService(serviceName, '/health');
  }

  public async getServiceMetrics(serviceName: string): Promise<ServiceResponse> {
    return this.callService(serviceName, '/metrics');
  }

  public async getServiceRegistry(): Promise<ServiceConfig[]> {
    return Array.from(this.serviceRegistry.values());
  }

  // AI/ML Service Methods
  public async getAIAnalytics(params?: any): Promise<ServiceResponse> {
    return this.callService('ai-analytics-dashboard', '/analytics', { data: params });
  }

  public async getMLModels(): Promise<ServiceResponse> {
    return this.callService('ml-analytics-dashboard', '/models');
  }

  public async voiceSearch(query: string): Promise<ServiceResponse> {
    return this.callService('voice-search-engine', '/search', { 
      method: 'POST', 
      data: { query } 
    });
  }

  public async visualSearch(imageData: string): Promise<ServiceResponse> {
    return this.callService('ar-vr-engine', '/visual-search', { 
      method: 'POST', 
      data: { image: imageData } 
    });
  }

  // Financial Service Methods
  public async getFinancialReport(params: any): Promise<ServiceResponse> {
    return this.callService('financial-management-service', '/reports', { data: params });
  }

  public async processPayment(paymentData: any): Promise<ServiceResponse> {
    return this.callService('payment-processing', '/process', { 
      method: 'POST', 
      data: paymentData 
    });
  }

  public async getVendorPayouts(vendorId: string): Promise<ServiceResponse> {
    return this.callService('vendor-payout-service', `/vendor/${vendorId}/payouts`);
  }

  // Infrastructure Service Methods
  public async getPlatformMetrics(): Promise<ServiceResponse> {
    return this.callService('platform-monitoring', '/platform/metrics');
  }

  public async getPerformanceData(): Promise<ServiceResponse> {
    return this.callService('performance-monitor', '/performance');
  }

  public async getInfrastructureStatus(): Promise<ServiceResponse> {
    return this.callService('infrastructure-manager', '/status');
  }

  // Business Intelligence Methods
  public async getBusinessAnalytics(params?: any): Promise<ServiceResponse> {
    return this.callService('business-analytics', '/analytics', { data: params });
  }

  public async getEnterpriseReports(): Promise<ServiceResponse> {
    return this.callService('enterprise-analytics-engine', '/reports');
  }

  public async getRealtimeAnalytics(): Promise<ServiceResponse> {
    return this.callService('realtime-analytics', '/live');
  }
}

export const apiGateway = ApiGatewayClient.getInstance();