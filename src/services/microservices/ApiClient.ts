/**
 * Microservice API Client - Handles all inter-service communication
 * Routes through API Gateway and maintains service mesh
 */

import { supabase } from "@/integrations/supabase/client";
import { serviceRegistry, ServiceInstance } from "./ServiceRegistry";

export interface ServiceRequest {
  service: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
  statusCode: number;
  responseTime: number;
  serviceInstance?: string;
}

export class MicroserviceApiClient {
  private static instance: MicroserviceApiClient;
  private readonly baseUrl = 'https://bbgppsjmspmprmfowyti.supabase.co/functions/v1';
  
  public static getInstance(): MicroserviceApiClient {
    if (!MicroserviceApiClient.instance) {
      MicroserviceApiClient.instance = new MicroserviceApiClient();
    }
    return MicroserviceApiClient.instance;
  }

  async callService<T = any>(request: ServiceRequest): Promise<ServiceResponse<T>> {
    const startTime = Date.now();
    
    try {
      // Get service instance from registry
      const serviceInstance = await serviceRegistry.getService(request.service);
      if (!serviceInstance) {
        throw new Error(`Service ${request.service} not found in registry`);
      }

      // Log the request
      await this.logRequest(request, serviceInstance);

      // Make the API call through Supabase edge functions
      const { data, error } = await supabase.functions.invoke(request.service, {
        body: {
          method: request.method,
          endpoint: request.endpoint,
          data: request.data,
          headers: request.headers
        }
      });

      const responseTime = Date.now() - startTime;

      if (error) {
        await this.logError(request, error, responseTime);
        return {
          success: false,
          data: null,
          error: error.message,
          statusCode: 500,
          responseTime,
          serviceInstance: serviceInstance.id
        };
      }

      // Log successful response
      await this.logResponse(request, data, responseTime);

      return {
        success: true,
        data,
        statusCode: 200,
        responseTime,
        serviceInstance: serviceInstance.id
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      await this.logError(request, error as Error, responseTime);
      
      return {
        success: false,
        data: null,
        error: (error as Error).message,
        statusCode: 500,
        responseTime
      };
    }
  }

  private async logRequest(request: ServiceRequest, serviceInstance: ServiceInstance): Promise<void> {
    try {
      await supabase.from('service_communication_logs').insert({
        source_service: 'frontend',
        target_service: request.service,
        operation: `${request.method} ${request.endpoint}`,
        request_data: request.data
      });
    } catch (error) {
      console.warn('Failed to log request:', error);
    }
  }

  private async logResponse(request: ServiceRequest, data: any, responseTime: number): Promise<void> {
    try {
      await supabase.from('service_communication_logs').insert({
        source_service: 'frontend',
        target_service: request.service,
        operation: `${request.method} ${request.endpoint}`,
        response_data: data,
        execution_time_ms: responseTime,
        status_code: 200
      });
    } catch (error) {
      console.warn('Failed to log response:', error);
    }
  }

  private async logError(request: ServiceRequest, error: Error, responseTime: number): Promise<void> {
    try {
      await supabase.from('service_communication_logs').insert({
        source_service: 'frontend',
        target_service: request.service,
        operation: `${request.method} ${request.endpoint}`,
        error_message: error.message,
        execution_time_ms: responseTime,
        status_code: 500
      });
    } catch (logError) {
      console.warn('Failed to log error:', logError);
    }
  }

  // Service-specific client methods
  async userService() {
    return new ServiceClient('user-service');
  }

  async productService() {
    return new ServiceClient('product-service');
  }

  async orderService() {
    return new ServiceClient('order-service');
  }

  async paymentService() {
    return new ServiceClient('payment-service');
  }

  async vendorService() {
    return new ServiceClient('vendor-service');
  }

  async analyticsService() {
    return new ServiceClient('analytics-service');
  }

  async notificationService() {
    return new ServiceClient('notification-service');
  }

  async searchService() {
    return new ServiceClient('search-service');
  }
}

export class ServiceClient {
  constructor(private serviceName: string) {}

  async get<T>(endpoint: string, params?: any): Promise<ServiceResponse<T>> {
    return MicroserviceApiClient.getInstance().callService({
      service: this.serviceName,
      endpoint: endpoint + (params ? `?${new URLSearchParams(params)}` : ''),
      method: 'GET'
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<ServiceResponse<T>> {
    return MicroserviceApiClient.getInstance().callService({
      service: this.serviceName,
      endpoint,
      method: 'POST',
      data
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ServiceResponse<T>> {
    return MicroserviceApiClient.getInstance().callService({
      service: this.serviceName,
      endpoint,
      method: 'PUT',
      data
    });
  }

  async delete<T>(endpoint: string): Promise<ServiceResponse<T>> {
    return MicroserviceApiClient.getInstance().callService({
      service: this.serviceName,
      endpoint,
      method: 'DELETE'
    });
  }
}

export const apiClient = MicroserviceApiClient.getInstance();