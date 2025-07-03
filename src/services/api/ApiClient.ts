import { supabase } from '@/integrations/supabase/client';

export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = 'https://bbgppsjmspmymrfowytf.supabase.co/functions/v1';
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token || ''}`,
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // User Service
  async getUserProfile(userId: string) {
    return this.makeRequest(`/user-service/profile/${userId}`);
  }

  async updateUserProfile(userId: string, data: any) {
    return this.makeRequest(`/user-service/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Vendor Service
  async getVendorAnalytics(vendorId: string) {
    return this.makeRequest(`/vendor-analytics-engine?vendor_id=${vendorId}`);
  }

  async getVendorOrders(vendorId: string) {
    return this.makeRequest(`/vendor-order-management?vendor_id=${vendorId}`);
  }

  // Product Service
  async searchProducts(query: string, filters?: any) {
    const params = new URLSearchParams({ query, ...filters });
    return this.makeRequest(`/search-api?${params}`);
  }

  async getProductRecommendations(userId: string) {
    return this.makeRequest(`/ml-recommendation-engine?user_id=${userId}`);
  }

  // Payment Service
  async processPayment(paymentData: any) {
    return this.makeRequest('/payment-processing', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getBkashPaymentUrl(amount: number, orderId: string) {
    return this.makeRequest('/payment-processing/bkash', {
      method: 'POST',
      body: JSON.stringify({ amount, orderId }),
    });
  }

  // Order Service
  async createOrder(orderData: any) {
    return this.makeRequest('/order-service', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrderTracking(orderId: string) {
    return this.makeRequest(`/order-service/tracking/${orderId}`);
  }

  // Analytics Service
  async getBusinessAnalytics(dateRange: string) {
    return this.makeRequest(`/real-time-analytics?range=${dateRange}`);
  }

  async getVendorPerformance(vendorId: string) {
    return this.makeRequest(`/vendor-analytics-engine/performance/${vendorId}`);
  }

  // Notification Service
  async sendNotification(notificationData: any) {
    return this.makeRequest('/notification-engine', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  // ML Service
  async getFraudDetection(transactionData: any) {
    return this.makeRequest('/ai-fraud-detection-enhanced', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async getPriceOptimization(productId: string) {
    return this.makeRequest(`/dynamic-pricing-optimization?product_id=${productId}`);
  }

  // Shipping Service
  async getShippingRates(origin: string, destination: string) {
    return this.makeRequest(`/shipping-tracking-service/rates?origin=${origin}&destination=${destination}`);
  }

  async trackShipment(trackingId: string) {
    return this.makeRequest(`/shipping-tracking-service/track/${trackingId}`);
  }
}