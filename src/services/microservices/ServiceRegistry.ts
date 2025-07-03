import { supabase } from "@/integrations/supabase/client";

export interface MicroserviceInfo {
  name: string;
  service_name: string; // Add service_name for compatibility
  version: string;
  status: 'healthy' | 'degraded' | 'down' | 'maintenance';
  endpoint: string;
  healthCheckUrl: string;
  description: string;
  dependencies: string[];
  metrics: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    requestCount: number;
    lastChecked: string;
  };
}

export interface ServiceInstance {
  id: string;
  service_name: string;
  endpoint: string;
  endpoint_url?: string; // For compatibility
  version: string;
  status: 'healthy' | 'degraded' | 'down' | 'maintenance';
  created_at: string;
  updated_at: string;
  last_health_check: string;
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'down';
  response_time_ms: number;
  error_rate: number;
  last_check: string;
  cpu_usage?: number;
  memory_usage?: number;
}

export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, MicroserviceInfo> = new Map();

  private constructor() {
    this.initializeServices();
  }

  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  private initializeServices() {
    const services: MicroserviceInfo[] = [
      {
        name: 'user-service',
        service_name: 'user-service',
        version: '1.2.0',
        status: 'healthy',
        endpoint: '/api/v1/users',
        healthCheckUrl: '/health',
        description: 'User management and authentication service',
        dependencies: ['auth-service'],
        metrics: {
          uptime: 99.9,
          responseTime: 45,
          errorRate: 0.1,
          requestCount: 12540,
          lastChecked: new Date().toISOString()
        }
      }
    ];

    services.forEach(service => {
      this.services.set(service.name, service);
    });
  }

  getAllServices(): ServiceInstance[] {
    return Array.from(this.services.values()).map(service => ({
      id: `${service.name}-${Date.now()}`,
      service_name: service.service_name,
      endpoint: service.endpoint,
      endpoint_url: service.endpoint,
      version: service.version,
      status: service.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_health_check: service.metrics.lastChecked
    }));
  }

  async getService(serviceName: string): Promise<ServiceInstance | null> {
    const service = this.services.get(serviceName);
    if (!service) return null;

    return {
      id: `${serviceName}-${Date.now()}`,
      service_name: service.service_name,
      endpoint: service.endpoint,
      endpoint_url: service.endpoint,
      version: service.version,
      status: service.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_health_check: service.metrics.lastChecked
    };
  }

  async getServiceHealth(serviceName: string): Promise<ServiceHealth | null> {
    const service = this.services.get(serviceName);
    if (!service) return null;

    return {
      status: service.status as 'healthy' | 'degraded' | 'down',
      response_time_ms: service.metrics.responseTime,
      error_rate: service.metrics.errorRate,
      last_check: service.metrics.lastChecked,
      cpu_usage: 45.2,
      memory_usage: 67.8
    };
  }

  async registerService(serviceData: Omit<ServiceInstance, 'id' | 'created_at' | 'updated_at' | 'last_health_check'>): Promise<ServiceInstance> {
    const newService: ServiceInstance = {
      id: `${serviceData.service_name}-${Date.now()}`,
      ...serviceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_health_check: new Date().toISOString()
    };

    // Add to local registry
    const microserviceInfo: MicroserviceInfo = {
      name: serviceData.service_name,
      service_name: serviceData.service_name,
      version: serviceData.version,
      status: serviceData.status,
      endpoint: serviceData.endpoint,
      healthCheckUrl: '/health',
      description: `${serviceData.service_name} microservice`,
      dependencies: [],
      metrics: {
        uptime: 99.9,
        responseTime: 50,
        errorRate: 0.1,
        requestCount: 0,
        lastChecked: new Date().toISOString()
      }
    };

    this.services.set(serviceData.service_name, microserviceInfo);
    return newService;
  }

  async updateServiceHealth(serviceName: string, health: Partial<ServiceHealth>): Promise<void> {
    const service = this.services.get(serviceName);
    if (!service) return;

    // Update the service metrics
    if (health.status) service.status = health.status;
    if (health.response_time_ms) service.metrics.responseTime = health.response_time_ms;
    if (health.error_rate !== undefined) service.metrics.errorRate = health.error_rate;
    if (health.last_check) service.metrics.lastChecked = health.last_check;

    this.services.set(serviceName, service);
  }

  startServiceDiscovery(): void {
    // Start periodic service discovery
    setInterval(() => {
      // In a real implementation, this would discover services
      console.log('Service discovery running...');
    }, 60000); // Every minute
  }

  getSystemOverview() {
    const services = Array.from(this.services.values());
    const totalServices = services.length;
    const healthyServices = services.filter(s => s.status === 'healthy').length;
    
    return {
      totalServices,
      healthyServices,
      healthPercentage: Math.round((healthyServices / totalServices) * 100),
      avgResponseTime: 45,
      totalRequests: 50000
    };
  }
}

export const serviceRegistry = ServiceRegistry.getInstance();