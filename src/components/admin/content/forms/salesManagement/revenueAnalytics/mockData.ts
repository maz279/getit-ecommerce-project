
import { RevenueAnalyticsData } from './types';

export const mockRevenueAnalyticsData: RevenueAnalyticsData = {
  metrics: {
    totalRevenue: 28500000,
    monthlyRevenue: 2850000,
    dailyRevenue: 95000,
    yearlyRevenue: 34200000,
    revenueGrowth: 18.5,
    monthlyGrowth: 12.3,
    avgOrderValue: 1250,
    conversionRate: 3.2,
    customerLifetimeValue: 8500,
    returnOnInvestment: 24.8
  },
  channelData: [
    {
      channel: 'Web Platform',
      revenue: 15200000,
      orders: 12160,
      growthRate: 15.2,
      marketShare: 53.3,
      avgOrderValue: 1250
    },
    {
      channel: 'Mobile App',
      revenue: 8900000,
      orders: 8045,
      growthRate: 28.7,
      marketShare: 31.2,
      avgOrderValue: 1106
    },
    {
      channel: 'Social Commerce',
      revenue: 3200000,
      orders: 2667,
      growthRate: 45.3,
      marketShare: 11.2,
      avgOrderValue: 1200
    },
    {
      channel: 'Partner API',
      revenue: 1200000,
      orders: 800,
      growthRate: 12.1,
      marketShare: 4.2,
      avgOrderValue: 1500
    }
  ],
  categoryData: [
    {
      category: 'Electronics',
      revenue: 12800000,
      orders: 6400,
      growthRate: 22.1,
      profitMargin: 18.5,
      topProducts: ['iPhone 15', 'Samsung Galaxy S24', 'MacBook Air M3']
    },
    {
      category: 'Fashion',
      revenue: 8200000,
      orders: 10250,
      growthRate: 15.7,
      profitMargin: 35.2,
      topProducts: ['Traditional Sarees', 'Formal Shirts', 'Sports Shoes']
    },
    {
      category: 'Home & Garden',
      revenue: 4100000,
      orders: 3280,
      growthRate: 18.9,
      profitMargin: 28.7,
      topProducts: ['Air Conditioner', 'Dining Set', 'LED TV']
    },
    {
      category: 'Health & Beauty',
      revenue: 2200000,
      orders: 4400,
      growthRate: 31.2,
      profitMargin: 42.1,
      topProducts: ['Skincare Set', 'Vitamins', 'Hair Care']
    },
    {
      category: 'Books & Education',
      revenue: 1200000,
      orders: 2400,
      growthRate: 8.5,
      profitMargin: 25.3,
      topProducts: ['Academic Books', 'Online Courses', 'Stationery']
    }
  ],
  regionData: [
    {
      region: 'Dhaka Division',
      country: 'Bangladesh',
      revenue: 15200000,
      orders: 12160,
      customers: 8540,
      growthRate: 16.8,
      avgOrderValue: 1250
    },
    {
      region: 'Chittagong Division',
      country: 'Bangladesh',
      revenue: 7800000,
      orders: 6240,
      customers: 4380,
      growthRate: 19.2,
      avgOrderValue: 1250
    },
    {
      region: 'Sylhet Division',
      country: 'Bangladesh',
      revenue: 3100000,
      orders: 2480,
      customers: 1740,
      growthRate: 21.5,
      avgOrderValue: 1250
    },
    {
      region: 'Rajshahi Division',
      country: 'Bangladesh',
      revenue: 1800000,
      orders: 1440,
      customers: 1010,
      growthRate: 14.3,
      avgOrderValue: 1250
    },
    {
      region: 'Khulna Division',
      country: 'Bangladesh',
      revenue: 600000,
      orders: 480,
      customers: 340,
      growthRate: 12.7,
      avgOrderValue: 1250
    }
  ],
  trendData: [
    { date: '2024-01', revenue: 2100000, orders: 1680, customers: 1176, avgOrderValue: 1250, conversionRate: 3.1 },
    { date: '2024-02', revenue: 2250000, orders: 1800, customers: 1260, avgOrderValue: 1250, conversionRate: 3.2 },
    { date: '2024-03', revenue: 2400000, orders: 1920, customers: 1344, avgOrderValue: 1250, conversionRate: 3.3 },
    { date: '2024-04', revenue: 2550000, orders: 2040, customers: 1428, avgOrderValue: 1250, conversionRate: 3.4 },
    { date: '2024-05', revenue: 2700000, orders: 2160, customers: 1512, avgOrderValue: 1250, conversionRate: 3.5 },
    { date: '2024-06', revenue: 2850000, orders: 2280, customers: 1596, avgOrderValue: 1250, conversionRate: 3.6 }
  ],
  forecastingData: [
    {
      period: '2024-07',
      predictedRevenue: 3000000,
      predictedOrders: 2400,
      confidence: 87.5,
      factors: ['Seasonal increase', 'Marketing campaigns', 'New product launches']
    },
    {
      period: '2024-08',
      predictedRevenue: 3150000,
      predictedOrders: 2520,
      confidence: 82.3,
      factors: ['Back-to-school season', 'Festival preparations']
    },
    {
      period: '2024-09',
      predictedRevenue: 3300000,
      predictedOrders: 2640,
      confidence: 79.1,
      factors: ['Festival season', 'Holiday shopping']
    },
    {
      period: '2024-10',
      predictedRevenue: 3500000,
      predictedOrders: 2800,
      confidence: 75.8,
      factors: ['Durga Puja', 'Winter collection launch']
    }
  ]
};
