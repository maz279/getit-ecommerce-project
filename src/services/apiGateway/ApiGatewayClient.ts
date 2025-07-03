/**
 * Centralized API Gateway Client
 * Handles all communication with microservices through API Gateway
 */

import { supabase } from '@/integrations/supabase/client';

export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastCheck: string;
  responseTime: number;
  errorRate: number;
}

export interface ApiGatewayResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  service?: string;
  timestamp: string;
}

class ApiGatewayClient {
  private baseUrl = 'https://bbgppsjmspmymrfowytf.supabase.co/functions/v1';
  
  /**
   * Get service health status
   */
  async getServiceHealth(): Promise<ServiceHealth[]> {
    try {
      const { data, error } = await supabase.functions.invoke('api-gateway-orchestrator', {
        body: { action: 'health' }
      });
      
      if (error) throw error;
      return data.services || [];
    } catch (error) {
      console.error('Failed to fetch service health:', error);
      return [];
    }
  }

  /**
   * Get service registry
   */
  async getServiceRegistry() {
    try {
      const { data, error } = await supabase.functions.invoke('api-gateway-orchestrator', {
        body: { action: 'discovery' }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch service registry:', error);
      return null;
    }
  }

  /**
   * Call any microservice through API Gateway
   */
  async callService<T = any>(
    serviceName: string, 
    endpoint: string, 
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ApiGatewayResponse<T>> {
    try {
      const { data, error } = await supabase.functions.invoke(serviceName, {
        body: {
          endpoint,
          method: options.method || 'GET',
          payload: options.body,
          headers: options.headers
        }
      });

      if (error) {
        return {
          success: false,
          error: error.message,
          service: serviceName,
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        data,
        service: serviceName,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        service: serviceName,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Fraud Detection Service
   */
  async getFraudAlerts() {
    return this.callService('advanced-fraud-detection', '/alerts');
  }

  async analyzeFraudRisk(transactionData: any) {
    return this.callService('advanced-fraud-detection', '/analyze', {
      method: 'POST',
      body: transactionData
    });
  }

  /**
   * Analytics Engine
   */
  async getAnalytics(timeRange: string = '24h') {
    return this.callService('advanced-analytics-engine', `/analytics?range=${timeRange}`);
  }

  async getRealtimeMetrics() {
    return this.callService('advanced-analytics-engine', '/realtime');
  }

  /**
   * AI Recommendation Engine
   */
  async getUserRecommendations(userId: string) {
    return this.callService('ai-recommendation-engine', `/recommendations/${userId}`);
  }

  async getProductRecommendations(productId: string) {
    return this.callService('ai-recommendation-engine', `/products/${productId}/related`);
  }

  /**
   * Supply Chain Optimizer
   */
  async getSupplyChainStatus() {
    return this.callService('supply-chain-optimizer', '/status');
  }

  async optimizeInventory(vendorId: string) {
    return this.callService('supply-chain-optimizer', '/optimize', {
      method: 'POST',
      body: { vendorId }
    });
  }

  /**
   * Real-time Order Tracking
   */
  async trackOrder(orderId: string) {
    return this.callService('real-time-order-tracking', `/track/${orderId}`);
  }

  async getOrderUpdates(orderId: string) {
    return this.callService('real-time-order-tracking', `/updates/${orderId}`);
  }

  /**
   * Performance Monitoring
   */
  async getPerformanceMetrics() {
    return this.callService('performance-monitor', '/metrics');
  }

  async getSystemHealth() {
    return this.callService('performance-monitor', '/health');
  }

  /**
   * Container Orchestration
   */
  async getContainerStatus() {
    return this.callService('container-orchestration-manager', '/status');
  }

  async scaleService(serviceName: string, replicas: number) {
    return this.callService('container-orchestration-manager', '/scale', {
      method: 'POST',
      body: { serviceName, replicas }
    });
  }

  /**
   * Service Mesh Controller
   */
  async getServiceMeshStatus() {
    return this.callService('service-mesh-controller', '/mesh/status');
  }

  async getTrafficMetrics() {
    return this.callService('service-mesh-controller', '/mesh/metrics');
  }
}

export const apiGatewayClient = new ApiGatewayClient();