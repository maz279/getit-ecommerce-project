import { useState, useEffect, useCallback } from 'react';
import { 
  userService, 
  productService, 
  orderService, 
  paymentService, 
  configManager,
  ServiceResponse 
} from '@/services/microservices/ServiceClient';

export interface MicroserviceStatus {
  service_name: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  response_time?: number;
  last_checked: Date;
  error?: string;
}

export const useMicroservices = () => {
  const [serviceStatuses, setServiceStatuses] = useState<Record<string, MicroserviceStatus>>({});
  const [loading, setLoading] = useState(false);

  const checkServiceHealth = useCallback(async (serviceName: string) => {
    const startTime = Date.now();
    
    try {
      let client;
      switch (serviceName) {
        case 'user-service':
          client = userService;
          break;
        case 'product-service':
          client = productService;
          break;
        case 'order-service':
          client = orderService;
          break;
        case 'payment-service':
          client = paymentService;
          break;
        default:
          client = configManager;
      }

      const response = await client.healthCheck();
      const responseTime = Date.now() - startTime;

      return {
        service_name: serviceName,
        status: response.success ? 'healthy' as const : 'unhealthy' as const,
        response_time: responseTime,
        last_checked: new Date(),
        error: response.error
      };
    } catch (error) {
      return {
        service_name: serviceName,
        status: 'unhealthy' as const,
        response_time: Date.now() - startTime,
        last_checked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, []);

  const checkAllServices = useCallback(async () => {
    setLoading(true);
    
    const services = [
      'user-service',
      'product-service',
      'order-service',
      'payment-service',
      'config-manager'
    ];

    try {
      const healthChecks = await Promise.allSettled(
        services.map(service => checkServiceHealth(service))
      );

      const statuses: Record<string, MicroserviceStatus> = {};
      healthChecks.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          statuses[services[index]] = result.value;
        } else {
          statuses[services[index]] = {
            service_name: services[index],
            status: 'unhealthy',
            last_checked: new Date(),
            error: 'Health check failed'
          };
        }
      });

      setServiceStatuses(statuses);
    } catch (error) {
      console.error('Failed to check service health:', error);
    } finally {
      setLoading(false);
    }
  }, [checkServiceHealth]);

  useEffect(() => {
    checkAllServices();
    
    // Set up periodic health checks every 5 minutes
    const interval = setInterval(checkAllServices, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkAllServices]);

  const getSystemHealth = useCallback(() => {
    const statuses = Object.values(serviceStatuses);
    if (statuses.length === 0) return { percentage: 0, healthy: 0, total: 0 };
    
    const healthy = statuses.filter(s => s.status === 'healthy').length;
    const total = statuses.length;
    const percentage = Math.round((healthy / total) * 100);
    
    return { percentage, healthy, total };
  }, [serviceStatuses]);

  const getAverageResponseTime = useCallback(() => {
    const statuses = Object.values(serviceStatuses);
    const responseTimes = statuses
      .filter(s => s.response_time !== undefined)
      .map(s => s.response_time!);
    
    if (responseTimes.length === 0) return 0;
    
    return Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length);
  }, [serviceStatuses]);

  return {
    serviceStatuses,
    loading,
    checkAllServices,
    checkServiceHealth,
    getSystemHealth,
    getAverageResponseTime
  };
};

// Hook for user service operations
export const useUserService = () => {
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getProfile();
      if (response.success) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: any) => {
    try {
      const response = await userService.updateProfile(data);
      if (response.success) {
        setProfile(response.data);
        return response;
      }
      return response;
    } catch (error) {
      console.error('Failed to update profile:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  }, []);

  const loadPreferences = useCallback(async () => {
    try {
      const response = await userService.getPreferences();
      if (response.success) {
        setPreferences(response.data);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    loadPreferences();
  }, [loadProfile, loadPreferences]);

  return {
    profile,
    preferences,
    loading,
    updateProfile,
    loadProfile,
    loadPreferences
  };
};

// Hook for product service operations
export const useProductService = () => {
  const getCatalog = useCallback(async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    vendor_id?: string;
    featured?: boolean;
  }) => {
    return await productService.getCatalog(params);
  }, []);

  const getFeaturedProducts = useCallback(async (limit = 10) => {
    return await productService.getFeaturedProducts(limit);
  }, []);

  const getVendorProducts = useCallback(async () => {
    return await productService.getVendorProducts();
  }, []);

  const createProduct = useCallback(async (productData: any) => {
    return await productService.createProduct(productData);
  }, []);

  const updateInventory = useCallback(async (productId: string, inventoryData: any) => {
    return await productService.updateInventory(productId, inventoryData);
  }, []);

  return {
    getCatalog,
    getFeaturedProducts,
    getVendorProducts,
    createProduct,
    updateInventory
  };
};

// Hook for order service operations
export const useOrderService = () => {
  const getOrders = useCallback(async (params?: {
    status?: string;
    vendor_id?: string;
    page?: number;
    limit?: number;
  }) => {
    return await orderService.getOrders(params);
  }, []);

  const createOrder = useCallback(async (orderData: any) => {
    return await orderService.createOrder(orderData);
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: string, vendorNotes?: string) => {
    return await orderService.updateOrderStatus(orderId, status, vendorNotes);
  }, []);

  const getAnalytics = useCallback(async () => {
    return await orderService.getAnalytics();
  }, []);

  return {
    getOrders,
    createOrder,
    updateOrderStatus,
    getAnalytics
  };
};

// Hook for payment service operations
export const usePaymentService = () => {
  const getAvailableGateways = useCallback(async () => {
    return await paymentService.getAvailableGateways();
  }, []);

  const processPayment = useCallback(async (paymentData: {
    order_id?: string;
    amount: number;
    currency?: string;
    payment_method: string;
    gateway_name: string;
    vendor_id?: string;
    metadata?: any;
  }) => {
    return await paymentService.processPayment(paymentData);
  }, []);

  const getTransactions = useCallback(async (params?: {
    status?: string;
    order_id?: string;
  }) => {
    return await paymentService.getTransactions(params);
  }, []);

  const requestRefund = useCallback(async (transactionId: string, amount?: number, reason?: string) => {
    return await paymentService.requestRefund(transactionId, amount, reason);
  }, []);

  return {
    getAvailableGateways,
    processPayment,
    getTransactions,
    requestRefund
  };
};