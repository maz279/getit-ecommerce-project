import { supabase } from "@/integrations/supabase/client";

export interface ServiceEndpoint {
  id: string;
  name: string;
  url: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  version: string;
  healthCheckUrl?: string;
  lastChecked?: string;
  responseTime?: number;
  metadata?: Record<string, any>;
}

export interface ServiceRoute {
  path: string;
  method: string;
  serviceName: string;
  endpoint: string;
  rateLimit?: number;
  authRequired?: boolean;
}

export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, ServiceEndpoint> = new Map();
  private routes: ServiceRoute[] = [];

  private constructor() {
    this.initializeDefaultServices();
  }

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  private initializeDefaultServices() {
    const defaultServices: ServiceEndpoint[] = [
      {
        id: 'api-gateway',
        name: 'API Gateway Orchestrator',
        url: '/functions/v1/api-gateway-orchestrator',
        status: 'healthy',
        version: '1.0.0',
        healthCheckUrl: '/functions/v1/api-gateway-orchestrator/health'
      },
      {
        id: 'fraud-detection',
        name: 'Advanced Fraud Detection',
        url: '/functions/v1/advanced-fraud-detection',
        status: 'healthy',
        version: '1.0.0',
        healthCheckUrl: '/functions/v1/advanced-fraud-detection/health'
      },
      {
        id: 'ai-analytics',
        name: 'AI Analytics Engine',
        url: '/functions/v1/ai-analytics-engine',
        status: 'healthy',
        version: '1.0.0'
      },
      {
        id: 'realtime-hub',
        name: 'Realtime Hub',
        url: '/functions/v1/realtime-hub',
        status: 'healthy',
        version: '1.0.0'
      },
      {
        id: 'supply-chain',
        name: 'Supply Chain Optimizer',
        url: '/functions/v1/supply-chain-optimizer',
        status: 'healthy',
        version: '1.0.0'
      },
      {
        id: 'performance-monitor',
        name: 'Performance Monitor',
        url: '/functions/v1/performance-monitor',
        status: 'healthy',
        version: '1.0.0'
      }
    ];

    defaultServices.forEach(service => {
      this.services.set(service.id, service);
    });
  }

  async registerService(service: ServiceEndpoint): Promise<void> {
    this.services.set(service.id, service);
    
    // Log service registration
    await supabase.functions.invoke('api-gateway-orchestrator', {
      body: {
        action: 'register_service',
        service: service
      }
    });
  }

  async unregisterService(serviceId: string): Promise<void> {
    this.services.delete(serviceId);
    
    await supabase.functions.invoke('api-gateway-orchestrator', {
      body: {
        action: 'unregister_service',
        serviceId: serviceId
      }
    });
  }

  getService(serviceId: string): ServiceEndpoint | undefined {
    return this.services.get(serviceId);
  }

  getAllServices(): ServiceEndpoint[] {
    return Array.from(this.services.values());
  }

  getHealthyServices(): ServiceEndpoint[] {
    return this.getAllServices().filter(service => service.status === 'healthy');
  }

  async checkServiceHealth(serviceId: string): Promise<boolean> {
    const service = this.getService(serviceId);
    if (!service || !service.healthCheckUrl) {
      return false;
    }

    try {
      const startTime = Date.now();
      const { error } = await supabase.functions.invoke(service.healthCheckUrl);
      const responseTime = Date.now() - startTime;
      
      const isHealthy = !error;
      
      // Update service status
      this.services.set(serviceId, {
        ...service,
        status: isHealthy ? 'healthy' : 'unhealthy',
        lastChecked: new Date().toISOString(),
        responseTime: responseTime
      });

      return isHealthy;
    } catch (error) {
      console.error(`Health check failed for service ${serviceId}:`, error);
      
      this.services.set(serviceId, {
        ...service,
        status: 'unhealthy',
        lastChecked: new Date().toISOString()
      });
      
      return false;
    }
  }

  async checkAllServicesHealth(): Promise<Map<string, boolean>> {
    const healthResults = new Map<string, boolean>();
    
    const promises = this.getAllServices().map(async (service) => {
      const isHealthy = await this.checkServiceHealth(service.id);
      healthResults.set(service.id, isHealthy);
      return { serviceId: service.id, isHealthy };
    });

    await Promise.allSettled(promises);
    return healthResults;
  }

  async routeRequest(path: string, method: string = 'POST', body?: any): Promise<any> {
    const route = this.routes.find(r => r.path === path && r.method === method);
    
    if (!route) {
      throw new Error(`No route found for ${method} ${path}`);
    }

    const service = this.getService(route.serviceName);
    if (!service) {
      throw new Error(`Service ${route.serviceName} not found`);
    }

    if (service.status !== 'healthy') {
      throw new Error(`Service ${route.serviceName} is not healthy`);
    }

    try {
      const { data, error } = await supabase.functions.invoke(service.url, {
        body: body
      });

      if (error) {
        throw new Error(`Service call failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error(`Route request failed for ${path}:`, error);
      throw error;
    }
  }

  addRoute(route: ServiceRoute): void {
    this.routes.push(route);
  }

  getRoutes(): ServiceRoute[] {
    return [...this.routes];
  }

  getServiceMetrics(): Record<string, any> {
    const services = this.getAllServices();
    const totalServices = services.length;
    const healthyServices = services.filter(s => s.status === 'healthy').length;
    const unhealthyServices = services.filter(s => s.status === 'unhealthy').length;
    const degradedServices = services.filter(s => s.status === 'degraded').length;

    return {
      total: totalServices,
      healthy: healthyServices,
      unhealthy: unhealthyServices,
      degraded: degradedServices,
      healthPercentage: totalServices > 0 ? (healthyServices / totalServices) * 100 : 0,
      averageResponseTime: services
        .filter(s => s.responseTime)
        .reduce((sum, s) => sum + (s.responseTime || 0), 0) / services.filter(s => s.responseTime).length || 0
    };
  }
}

export const serviceRegistry = ServiceRegistry.getInstance();