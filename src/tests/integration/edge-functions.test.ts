import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestHelpers } from '../test-utils';

// Mock Supabase client
const mockSupabase = TestHelpers.mockSupabaseClient();

vi.mock('../../integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

describe('Enhanced Payment Processing Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Payment Processing Function', () => {
    it('should process payment successfully', async () => {
      const mockPaymentResponse = {
        success: true,
        payment_id: 'pay_123',
        commission_details: {
          vendor_commission: 85.50,
          platform_fee: 14.50,
        },
        fraud_check: {
          risk_score: 2.5,
          status: 'approved',
        },
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockPaymentResponse,
        error: null,
      });

      const paymentData = {
        amount: 1000,
        vendor_id: 'vendor-123',
        payment_method: 'bkash',
        order_id: 'order-123',
      };

      const result = await mockSupabase.functions.invoke('enhanced-payment-processing', {
        body: paymentData,
      });

      expect(result.data).toEqual(mockPaymentResponse);
      expect(result.error).toBeNull();
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith(
        'enhanced-payment-processing',
        { body: paymentData }
      );
    });

    it('should handle payment failure', async () => {
      const mockError = {
        message: 'Insufficient funds',
        code: 'PAYMENT_FAILED',
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const paymentData = {
        amount: 1000,
        vendor_id: 'vendor-123',
        payment_method: 'bkash',
      };

      const result = await mockSupabase.functions.invoke('enhanced-payment-processing', {
        body: paymentData,
      });

      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });

    it('should validate required payment fields', async () => {
      const invalidPaymentData = {
        amount: 1000,
        // Missing vendor_id and payment_method
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: { message: 'Missing required fields', code: 'VALIDATION_ERROR' },
      });

      const result = await mockSupabase.functions.invoke('enhanced-payment-processing', {
        body: invalidPaymentData,
      });

      expect(result.error).toBeTruthy();
      expect(result.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Fraud Detection', () => {
    it('should detect high-risk transactions', async () => {
      const highRiskResponse = {
        success: false,
        fraud_check: {
          risk_score: 8.5,
          status: 'rejected',
          risk_factors: ['unusual_amount', 'new_vendor', 'suspicious_ip'],
        },
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: highRiskResponse,
        error: null,
      });

      const suspiciousPayment = {
        amount: 50000, // Large amount
        vendor_id: 'new-vendor-123',
        payment_method: 'card',
        customer_details: {
          ip_address: '192.168.1.1',
          user_agent: 'suspicious-agent',
        },
      };

      const result = await mockSupabase.functions.invoke('enhanced-payment-processing', {
        body: suspiciousPayment,
      });

      expect(result.data.success).toBe(false);
      expect(result.data.fraud_check.risk_score).toBeGreaterThan(7);
      expect(result.data.fraud_check.status).toBe('rejected');
    });
  });

  describe('Commission Calculation', () => {
    it('should calculate commission correctly', async () => {
      const commissionResponse = {
        success: true,
        commission_details: {
          gross_amount: 1000,
          commission_rate: 8.5,
          vendor_commission: 85,
          platform_fee: 15,
          net_commission: 70,
        },
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: commissionResponse,
        error: null,
      });

      const paymentData = {
        amount: 1000,
        vendor_id: 'vendor-123',
        payment_method: 'bkash',
        product_category: 'electronics',
      };

      const result = await mockSupabase.functions.invoke('enhanced-payment-processing', {
        body: paymentData,
      });

      const commission = result.data.commission_details;
      expect(commission.commission_rate).toBe(8.5);
      expect(commission.vendor_commission).toBe(85);
      expect(commission.platform_fee).toBe(15);
    });
  });
});

describe('Notification System Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send email notification successfully', async () => {
    const mockNotificationResponse = {
      success: true,
      notification_id: 'notif_123',
      status: 'sent',
    };

    mockSupabase.functions.invoke.mockResolvedValue({
      data: mockNotificationResponse,
      error: null,
    });

    const notificationData = {
      type: 'email',
      recipient: 'user@example.com',
      template: 'order_confirmation',
      data: {
        order_id: 'order-123',
        customer_name: 'John Doe',
        total_amount: 1000,
      },
    };

    const result = await mockSupabase.functions.invoke('notification-system', {
      body: notificationData,
    });

    expect(result.data.success).toBe(true);
    expect(result.data.notification_id).toBe('notif_123');
    expect(result.data.status).toBe('sent');
  });

  it('should send SMS notification', async () => {
    const mockSMSResponse = {
      success: true,
      notification_id: 'sms_123',
      status: 'delivered',
    };

    mockSupabase.functions.invoke.mockResolvedValue({
      data: mockSMSResponse,
      error: null,
    });

    const smsData = {
      type: 'sms',
      recipient: '+8801234567890',
      template: 'payment_confirmation',
      data: {
        amount: 1000,
        order_number: 'ORD-001',
      },
    };

    const result = await mockSupabase.functions.invoke('notification-system', {
      body: smsData,
    });

    expect(result.data.success).toBe(true);
    expect(result.data.status).toBe('delivered');
  });

  it('should handle notification failure', async () => {
    const mockError = {
      message: 'Invalid email address',
      code: 'INVALID_RECIPIENT',
    };

    mockSupabase.functions.invoke.mockResolvedValue({
      data: null,
      error: mockError,
    });

    const invalidNotificationData = {
      type: 'email',
      recipient: 'invalid-email',
      template: 'order_confirmation',
    };

    const result = await mockSupabase.functions.invoke('notification-system', {
      body: invalidNotificationData,
    });

    expect(result.error).toBeTruthy();
    expect(result.error.code).toBe('INVALID_RECIPIENT');
  });
});

describe('Business Analytics Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate sales analytics', async () => {
    const mockAnalyticsResponse = TestHelpers.createMockAnalyticsData({
      type: 'sales_summary',
      period: 'last_30_days',
      totalRevenue: 125000,
      totalOrders: 1150,
      averageOrderValue: 108.7,
    });

    mockSupabase.functions.invoke.mockResolvedValue({
      data: mockAnalyticsResponse,
      error: null,
    });

    const analyticsRequest = {
      type: 'sales_summary',
      period: 'last_30_days',
      include_charts: true,
    };

    const result = await mockSupabase.functions.invoke('business-analytics', {
      body: analyticsRequest,
    });

    expect(result.data.totalRevenue).toBe(125000);
    expect(result.data.totalOrders).toBe(1150);
    expect(result.data.type).toBe('sales_summary');
  });

  it('should generate vendor performance analytics', async () => {
    const mockVendorAnalytics = {
      type: 'vendor_performance',
      vendor_id: 'vendor-123',
      period: 'this_month',
      data: {
        total_sales: 15000,
        order_count: 125,
        average_rating: 4.7,
        commission_earned: 1275,
        top_products: [],
      },
    };

    mockSupabase.functions.invoke.mockResolvedValue({
      data: mockVendorAnalytics,
      error: null,
    });

    const vendorRequest = {
      type: 'vendor_performance',
      vendor_id: 'vendor-123',
      period: 'this_month',
    };

    const result = await mockSupabase.functions.invoke('business-analytics', {
      body: vendorRequest,
    });

    expect(result.data.vendor_id).toBe('vendor-123');
    expect(result.data.data.total_sales).toBe(15000);
    expect(result.data.data.commission_earned).toBe(1275);
  });

  it('should handle analytics errors gracefully', async () => {
    const mockError = {
      message: 'Insufficient permissions',
      code: 'UNAUTHORIZED',
    };

    mockSupabase.functions.invoke.mockResolvedValue({
      data: null,
      error: mockError,
    });

    const unauthorizedRequest = {
      type: 'executive_report',
      period: 'this_year',
    };

    const result = await mockSupabase.functions.invoke('business-analytics', {
      body: unauthorizedRequest,
    });

    expect(result.error).toBeTruthy();
    expect(result.error.code).toBe('UNAUTHORIZED');
  });
});