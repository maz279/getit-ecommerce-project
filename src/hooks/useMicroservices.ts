/**
 * React hook for microservice management and monitoring
 */

import { useState, useEffect } from 'react';
import { serviceRegistry, ServiceInstance, ServiceHealth } from '@/services/microservices/ServiceRegistry';
import { apiClient, ServiceClient } from '@/services/microservices/ApiClient';

export interface MicroserviceStatus {
  service_name: string;
  status: 'healthy' | 'degraded' | 'down';
  response_time: number;
  error_rate: number;
  instances: number;
  last_check: string;
}

export const useMicroservices = () => {
  const [services, setServices] = useState<ServiceInstance[]>([]);
  const [healthStatus, setHealthStatus] = useState<Record<string, ServiceHealth>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all services
  const loadServices = async () => {
    setLoading(true);
    try {
      const serviceList = await serviceRegistry.getAllServices();
      setServices(serviceList);
      
      // Load health status for each service
      const healthPromises = serviceList.map(async (service) => {
        const health = await serviceRegistry.getServiceHealth(service.service_name);
        return { serviceName: service.service_name, health };
      });

      const healthResults = await Promise.all(healthPromises);
      const healthMap: Record<string, ServiceHealth> = {};
      
      healthResults.forEach(({ serviceName, health }) => {
        if (health) {
          healthMap[serviceName] = health;
        }
      });
      
      setHealthStatus(healthMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  // Register a new service
  const registerService = async (serviceData: Omit<ServiceInstance, 'id' | 'created_at' | 'updated_at' | 'last_health_check'>) => {
    try {
      const newService = await serviceRegistry.registerService(serviceData);
      setServices(prev => [...prev, newService]);
      return newService;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to register service');
    }
  };

  // Update service health
  const updateHealth = async (serviceName: string, health: Partial<ServiceHealth>) => {
    try {
      await serviceRegistry.updateServiceHealth(serviceName, health);
      setHealthStatus(prev => ({
        ...prev,
        [serviceName]: { ...prev[serviceName], ...health } as ServiceHealth
      }));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update health');
    }
  };

  // Get service client
  const getServiceClient = async (serviceName: string): Promise<ServiceClient> => {
    switch (serviceName) {
      case 'user-service':
        return await apiClient.userService();
      case 'product-service':
        return await apiClient.productService();
      case 'order-service':
        return await apiClient.orderService();
      case 'payment-service':
        return await apiClient.paymentService();
      case 'vendor-service':
        return await apiClient.vendorService();
      case 'analytics-service':
        return await apiClient.analyticsService();
      case 'notification-service':
        return await apiClient.notificationService();
      case 'search-service':
        return await apiClient.searchService();
      default:
        throw new Error(`Unknown service: ${serviceName}`);
    }
  };

  // Real-time monitoring
  useEffect(() => {
    loadServices();
    
    // Start real-time service discovery
    serviceRegistry.startServiceDiscovery();

    // Set up periodic health checks
    const healthCheckInterval = setInterval(async () => {
      for (const service of services) {
        try {
          const client = await getServiceClient(service.service_name);
          const startTime = Date.now();
          const response = await client.get('/health');
          const responseTime = Date.now() - startTime;

          await updateHealth(service.service_name, {
            status: response.success ? 'healthy' : 'degraded',
            response_time_ms: responseTime,
            error_rate: response.success ? 0 : 1,
            last_check: new Date().toISOString()
          });
        } catch (err) {
          await updateHealth(service.service_name, {
            status: 'down',
            error_rate: 1,
            last_check: new Date().toISOString()
          });
        }
      }
    }, 30000); // Every 30 seconds

    return () => {
      clearInterval(healthCheckInterval);
    };
  }, []);

  // Calculate overall system health
  const systemHealth = {
    totalServices: services.length,
    healthyServices: Object.values(healthStatus).filter(h => h.status === 'healthy').length,
    degradedServices: Object.values(healthStatus).filter(h => h.status === 'degraded').length,
    downServices: Object.values(healthStatus).filter(h => h.status === 'down').length,
    averageResponseTime: Object.values(healthStatus).reduce((sum, h) => sum + h.response_time_ms, 0) / Object.values(healthStatus).length || 0,
    totalErrorRate: Object.values(healthStatus).reduce((sum, h) => sum + h.error_rate, 0) / Object.values(healthStatus).length || 0
  };

  return {
    services,
    healthStatus,
    systemHealth,
    loading,
    error,
    loadServices,
    registerService,
    updateHealth,
    getServiceClient
  };
};

export default useMicroservices;