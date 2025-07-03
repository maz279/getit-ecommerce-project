import { supabase } from "@/integrations/supabase/client";

export interface MicroserviceInfo {
  name: string;
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

  getAllServices(): MicroserviceInfo[] {
    return Array.from(this.services.values());
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