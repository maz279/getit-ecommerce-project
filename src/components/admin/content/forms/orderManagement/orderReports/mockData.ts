
import { OrderReportsData } from './types';

export const mockOrderReportsData: OrderReportsData = {
  stats: {
    totalOrders: 45678,
    totalRevenue: 2845673.50,
    averageOrderValue: 62.35,
    conversionRate: 3.42,
    totalCustomers: 18234,
    returnRate: 2.8,
    fulfillmentTime: 2.3,
    customerSatisfaction: 4.6
  },
  salesReports: [
    {
      period: 'Today',
      orders: 156,
      revenue: 9734.50,
      growth: 12.5,
      averageOrderValue: 62.40,
      topProducts: ['Smartphone Case', 'Wireless Earbuds', 'Power Bank'],
      topCategories: ['Electronics', 'Fashion', 'Home & Garden']
    },
    {
      period: 'Yesterday',
      orders: 139,
      revenue: 8654.30,
      growth: -3.2,
      averageOrderValue: 62.26,
      topProducts: ['Laptop Stand', 'Phone Charger', 'Bluetooth Speaker'],
      topCategories: ['Electronics', 'Accessories', 'Fashion']
    }
  ],
  orderAnalytics: {
    ordersByStatus: [
      { status: 'Delivered', count: 35467, percentage: 77.6, trend: 'up' },
      { status: 'Processing', count: 4567, percentage: 10.0, trend: 'stable' },
      { status: 'Shipped', count: 3456, percentage: 7.6, trend: 'up' },
      { status: 'Cancelled', count: 1234, percentage: 2.7, trend: 'down' },
      { status: 'Returned', count: 954, percentage: 2.1, trend: 'stable' }
    ],
    ordersByTimeOfDay: [
      { hour: 0, orders: 45, revenue: 2890 },
      { hour: 1, orders: 32, revenue: 2045 },
      { hour: 2, orders: 28, revenue: 1789 },
      { hour: 3, orders: 23, revenue: 1456 },
      { hour: 4, orders: 18, revenue: 1123 },
      { hour: 5, orders: 25, revenue: 1567 },
      { hour: 6, orders: 42, revenue: 2678 },
      { hour: 7, orders: 68, revenue: 4234 },
      { hour: 8, orders: 89, revenue: 5567 },
      { hour: 9, orders: 125, revenue: 7890 },
      { hour: 10, orders: 156, revenue: 9876 },
      { hour: 11, orders: 189, revenue: 11234 },
      { hour: 12, orders: 234, revenue: 14567 },
      { hour: 13, orders: 198, revenue: 12345 },
      { hour: 14, orders: 167, revenue: 10456 },
      { hour: 15, orders: 145, revenue: 9234 },
      { hour: 16, orders: 134, revenue: 8567 },
      { hour: 17, orders: 123, revenue: 7890 },
      { hour: 18, orders: 156, revenue: 9876 },
      { hour: 19, orders: 189, revenue: 11567 },
      { hour: 20, orders: 167, revenue: 10234 },
      { hour: 21, orders: 134, revenue: 8456 },
      { hour: 22, orders: 89, revenue: 5567 },
      { hour: 23, orders: 67, revenue: 4234 }
    ],
    fulfillmentMetrics: {
      averageProcessingTime: 1.2,
      averageShippingTime: 2.8,
      onTimeDeliveryRate: 94.5,
      cancellationRate: 2.7
    }
  },
  customerInsights: {
    newVsReturning: {
      newCustomers: 7234,
      returningCustomers: 11000,
      repeatPurchaseRate: 60.3
    },
    customerSegments: [
      {
        segment: 'VIP Customers',
        count: 1823,
        revenue: 456789,
        averageOrderValue: 125.50,
        lifetime_value: 890.25
      },
      {
        segment: 'Regular Customers',
        count: 8456,
        revenue: 1234567,
        averageOrderValue: 78.30,
        lifetime_value: 345.60
      },
      {
        segment: 'New Customers',
        count: 7955,
        revenue: 567890,
        averageOrderValue: 45.20,
        lifetime_value: 87.40
      }
    ],
    customerBehavior: {
      averageSessionDuration: 8.5,
      averagePageViews: 12.3,
      cartAbandonmentRate: 68.7,
      averageTimeBetweenOrders: 23.5
    }
  },
  productPerformance: {
    topSellingProducts: [
      {
        id: '1',
        name: 'Wireless Bluetooth Earbuds',
        category: 'Electronics',
        unitsSold: 2345,
        revenue: 146890,
        growth: 23.5,
        stockLevel: 89,
        rating: 4.7
      },
      {
        id: '2',
        name: 'Smartphone Protective Case',
        category: 'Accessories',
        unitsSold: 1987,
        revenue: 79480,
        growth: 18.2,
        stockLevel: 156,
        rating: 4.5
      },
      {
        id: '3',
        name: 'Portable Power Bank',
        category: 'Electronics',
        unitsSold: 1756,
        revenue: 87800,
        growth: 15.7,
        stockLevel: 234,
        rating: 4.6
      }
    ],
    categoryPerformance: [
      {
        category: 'Electronics',
        orders: 15678,
        revenue: 987654,
        growth: 19.8,
        margin: 22.5
      },
      {
        category: 'Fashion',
        orders: 12456,
        revenue: 654321,
        growth: 14.2,
        margin: 35.8
      },
      {
        category: 'Home & Garden',
        orders: 8976,
        revenue: 456789,
        growth: 11.7,
        margin: 28.3
      }
    ],
    inventoryAnalysis: {
      totalProducts: 15678,
      outOfStock: 234,
      lowStock: 567,
      fastMovingItems: 2345,
      slowMovingItems: 1234
    }
  },
  geographicAnalysis: {
    regionalSales: [
      {
        region: 'Dhaka Division',
        country: 'Bangladesh',
        state: 'Dhaka',
        orders: 18456,
        revenue: 1234567,
        customers: 7456,
        growth: 18.5,
        averageOrderValue: 66.90
      },
      {
        region: 'Chittagong Division',
        country: 'Bangladesh',
        state: 'Chittagong',
        orders: 12345,
        revenue: 789456,
        customers: 4567,
        growth: 15.2,
        averageOrderValue: 63.95
      },
      {
        region: 'Sylhet Division',
        country: 'Bangladesh',
        state: 'Sylhet',
        orders: 8967,
        revenue: 567890,
        customers: 3456,
        growth: 12.8,
        averageOrderValue: 63.35
      }
    ],
    shippingAnalysis: {
      domesticOrders: 42345,
      internationalOrders: 3333,
      averageShippingCost: 4.50,
      popularDestinations: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna']
    }
  },
  trendAnalysis: {
    salesTrends: [
      { date: '2024-01-01', orders: 234, revenue: 14567, customers: 189 },
      { date: '2024-01-02', orders: 267, revenue: 16234, customers: 203 },
      { date: '2024-01-03', orders: 245, revenue: 15678, customers: 195 },
      { date: '2024-01-04', orders: 289, revenue: 18234, customers: 221 },
      { date: '2024-01-05', orders: 312, revenue: 19567, customers: 245 }
    ],
    seasonalPatterns: [
      { month: 'January', orders: 7234, revenue: 456789, growth: 15.2 },
      { month: 'February', orders: 6789, revenue: 423567, growth: 12.8 },
      { month: 'March', orders: 8456, revenue: 534567, growth: 18.5 },
      { month: 'April', orders: 7899, revenue: 489234, growth: 16.3 }
    ],
    forecastData: [
      { period: 'Next Week', predictedOrders: 1567, predictedRevenue: 98456, confidence: 85.5 },
      { period: 'Next Month', predictedOrders: 6789, predictedRevenue: 425678, confidence: 78.2 },
      { period: 'Next Quarter', predictedOrders: 20456, predictedRevenue: 1289456, confidence: 72.8 }
    ]
  }
};
