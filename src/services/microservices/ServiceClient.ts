import { supabase } from "@/integrations/supabase/client";

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  correlation_id?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export class ServiceClient {
  private baseUrl: string;
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.baseUrl = `${import.meta.env.VITE_SUPABASE_URL || 'https://bbgppsjmspnyrmfowytf.supabase.co'}/functions/v1`;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ServiceResponse<T>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`${this.baseUrl}/${this.serviceName}/${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`${this.serviceName} Service Error:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ServiceResponse<T>> {
    const url = params 
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;
    
    return this.makeRequest<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }

  async healthCheck(): Promise<ServiceResponse<{ status: string; timestamp: string; version: string }>> {
    return this.get('health');
  }
}

// Service-specific clients
export class UserServiceClient extends ServiceClient {
  constructor() {
    super('user-service');
  }

  async getProfile() {
    return this.get('profile');
  }

  async updateProfile(data: any) {
    return this.put('profile', data);
  }

  async getPreferences() {
    return this.get('preferences');
  }

  async updatePreferences(preferences: any, notifications: any, privacy: any) {
    return this.put('preferences', { preferences, notifications, privacy });
  }
}

export class ProductServiceClient extends ServiceClient {
  constructor() {
    super('product-service');
  }

  async getCatalog(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    vendor_id?: string;
    featured?: boolean;
  }) {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = params.page.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.category) queryParams.category = params.category;
    if (params?.search) queryParams.search = params.search;
    if (params?.vendor_id) queryParams.vendor_id = params.vendor_id;
    if (params?.featured) queryParams.featured = params.featured.toString();

    return this.get('catalog', queryParams);
  }

  async getFeaturedProducts(limit = 10) {
    return this.get('featured', { limit: limit.toString() });
  }

  async getVendorProducts() {
    return this.get('products');
  }

  async createProduct(productData: any) {
    return this.post('products', productData);
  }

  async updateInventory(productId: string, inventoryData: any) {
    return this.put('inventory', { product_id: productId, ...inventoryData });
  }
}

export class OrderServiceClient extends ServiceClient {
  constructor() {
    super('order-service');
  }

  async getOrders(params?: {
    status?: string;
    vendor_id?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams: Record<string, string> = {};
    if (params?.status) queryParams.status = params.status;
    if (params?.vendor_id) queryParams.vendor_id = params.vendor_id;
    if (params?.page) queryParams.page = params.page.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();

    return this.get('orders', queryParams);
  }

  async createOrder(orderData: any) {
    return this.post('orders', orderData);
  }

  async updateOrderStatus(orderId: string, status: string, vendorNotes?: string) {
    return this.put('update-status', {
      order_id: orderId,
      status,
      vendor_notes: vendorNotes
    });
  }

  async getAnalytics() {
    return this.get('analytics');
  }
}

export class PaymentServiceClient extends ServiceClient {
  constructor() {
    super('payment-service');
  }

  async getAvailableGateways() {
    return this.get('gateways');
  }

  async processPayment(paymentData: {
    order_id?: string;
    amount: number;
    currency?: string;
    payment_method: string;
    gateway_name: string;
    vendor_id?: string;
    metadata?: any;
  }) {
    return this.post('process', paymentData);
  }

  async getTransactions(params?: {
    status?: string;
    order_id?: string;
  }) {
    const queryParams: Record<string, string> = {};
    if (params?.status) queryParams.status = params.status;
    if (params?.order_id) queryParams.order_id = params.order_id;

    return this.get('transactions', queryParams);
  }

  async requestRefund(transactionId: string, amount?: number, reason?: string) {
    return this.post('refund', {
      transaction_id: transactionId,
      amount,
      reason
    });
  }
}

export class ConfigManagerClient extends ServiceClient {
  constructor() {
    super('config-manager');
  }

  async getConfigs(params?: {
    service_name?: string;
    environment?: string;
    config_type?: string;
  }) {
    const queryParams: Record<string, string> = {};
    if (params?.service_name) queryParams.service_name = params.service_name;
    if (params?.environment) queryParams.environment = params.environment;
    if (params?.config_type) queryParams.config_type = params.config_type;

    return this.get('configs', queryParams);
  }

  async createConfig(configData: {
    service_name: string;
    environment: string;
    config_type: string;
    config_key: string;
    config_value: any;
    is_encrypted?: boolean;
    is_sensitive?: boolean;
  }) {
    return this.post('configs', configData);
  }

  async updateConfig(id: string, configValue: any, isSensitive?: boolean) {
    return this.put('configs', {
      id,
      config_value: configValue,
      is_sensitive: isSensitive
    });
  }

  async getServices() {
    return this.get('services');
  }

  async registerService(serviceData: {
    service_name: string;
    service_type: string;
    endpoint_url: string;
    health_check_url?: string;
    configuration?: any;
    dependencies?: string[];
    resource_limits?: any;
  }) {
    return this.post('services', serviceData);
  }

  async healthCheckService(serviceName: string) {
    return this.post('health-check', { service_name: serviceName });
  }

  async getEnvironmentConfigs(environment = 'production') {
    return this.get('environment-configs', { environment });
  }
}

// Singleton instances
export const userService = new UserServiceClient();
export const productService = new ProductServiceClient();
export const orderService = new OrderServiceClient();
export const paymentService = new PaymentServiceClient();
export const configManager = new ConfigManagerClient();