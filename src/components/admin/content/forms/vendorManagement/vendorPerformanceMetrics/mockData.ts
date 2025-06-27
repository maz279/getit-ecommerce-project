
import { VendorPerformanceMetric, VendorAlert, PerformanceBenchmark, VendorScorecard, PerformanceStats } from './types';

export const mockPerformanceStats: PerformanceStats = {
  totalVendors: 1247,
  activeVendors: 1156,
  excellentPerformers: 423,
  underPerformers: 89,
  averageScore: 8.4,
  monthlyGrowth: 12.5,
  alertsCount: 23,
  complianceRate: 96.2
};

export const mockVendorMetrics: VendorPerformanceMetric[] = [
  {
    id: '1',
    vendorId: 'V001',
    vendorName: 'Rashid Ahmed',
    vendorEmail: 'rashid@techbd.com',
    businessName: 'TechBD Electronics',
    category: 'Electronics',
    joinDate: '2023-01-15',
    status: 'excellent',
    overallScore: 9.2,
    kpiScores: {
      orderFulfillment: 9.5,
      customerSatisfaction: 9.1,
      qualityScore: 9.0,
      deliveryPerformance: 9.3,
      responseTime: 8.9,
      returnRate: 9.4,
      complianceScore: 9.6
    },
    monthlyMetrics: {
      totalOrders: 1543,
      totalRevenue: 2450000,
      averageOrderValue: 1587,
      customerRating: 4.6,
      onTimeDelivery: 94.2,
      defectRate: 0.8,
      refundRate: 1.2
    },
    performanceTrends: [
      { month: 'Jan 2024', score: 8.9, orders: 1234, revenue: 1980000, satisfaction: 4.5 },
      { month: 'Feb 2024', score: 9.0, orders: 1367, revenue: 2150000, satisfaction: 4.5 },
      { month: 'Mar 2024', score: 9.2, orders: 1543, revenue: 2450000, satisfaction: 4.6 }
    ],
    alerts: [
      {
        id: 'A001',
        type: 'info',
        category: 'performance',
        title: 'Excellent Performance',
        message: 'Vendor maintains top performance metrics',
        actionRequired: false,
        severity: 'low',
        createdAt: '2024-03-01T10:00:00Z'
      }
    ],
    lastUpdated: '2024-03-15T14:30:00Z'
  },
  {
    id: '2',
    vendorId: 'V002',
    vendorName: 'Sarah Khan',
    vendorEmail: 'sarah@fashionista.bd',
    businessName: 'Fashionista Boutique',
    category: 'Fashion',
    joinDate: '2023-03-20',
    status: 'good',
    overallScore: 8.1,
    kpiScores: {
      orderFulfillment: 8.2,
      customerSatisfaction: 8.0,
      qualityScore: 8.3,
      deliveryPerformance: 7.9,
      responseTime: 8.1,
      returnRate: 7.8,
      complianceScore: 8.4
    },
    monthlyMetrics: {
      totalOrders: 892,
      totalRevenue: 1340000,
      averageOrderValue: 1502,
      customerRating: 4.2,
      onTimeDelivery: 87.5,
      defectRate: 2.1,
      refundRate: 3.4
    },
    performanceTrends: [
      { month: 'Jan 2024', score: 7.8, orders: 756, revenue: 1120000, satisfaction: 4.0 },
      { month: 'Feb 2024', score: 7.9, orders: 823, revenue: 1230000, satisfaction: 4.1 },
      { month: 'Mar 2024', score: 8.1, orders: 892, revenue: 1340000, satisfaction: 4.2 }
    ],
    alerts: [
      {
        id: 'A002',
        type: 'warning',
        category: 'delivery',
        title: 'Delivery Performance Below Target',
        message: 'On-time delivery rate has dropped below 90%',
        actionRequired: true,
        severity: 'medium',
        createdAt: '2024-03-10T09:15:00Z'
      }
    ],
    lastUpdated: '2024-03-15T14:30:00Z'
  },
  {
    id: '3',
    vendorId: 'V003',
    vendorName: 'Mohammad Ali',
    vendorEmail: 'ali@homeneeds.bd',
    businessName: 'Home Needs Bangladesh',
    category: 'Home & Garden',
    joinDate: '2022-11-10',
    status: 'poor',
    overallScore: 6.2,
    kpiScores: {
      orderFulfillment: 6.5,
      customerSatisfaction: 5.8,
      qualityScore: 6.0,
      deliveryPerformance: 5.9,
      responseTime: 6.8,
      returnRate: 5.5,
      complianceScore: 7.1
    },
    monthlyMetrics: {
      totalOrders: 567,
      totalRevenue: 680000,
      averageOrderValue: 1199,
      customerRating: 3.4,
      onTimeDelivery: 74.2,
      defectRate: 5.8,
      refundRate: 8.3
    },
    performanceTrends: [
      { month: 'Jan 2024', score: 6.8, orders: 678, revenue: 780000, satisfaction: 3.6 },
      { month: 'Feb 2024', score: 6.5, orders: 623, revenue: 730000, satisfaction: 3.5 },
      { month: 'Mar 2024', score: 6.2, orders: 567, revenue: 680000, satisfaction: 3.4 }
    ],
    alerts: [
      {
        id: 'A003',
        type: 'critical',
        category: 'performance',
        title: 'Performance Review Required',
        message: 'Multiple KPIs below acceptable thresholds',
        actionRequired: true,
        severity: 'high',
        createdAt: '2024-03-05T08:30:00Z'
      },
      {
        id: 'A004',
        type: 'critical',
        category: 'customer',
        title: 'Customer Satisfaction Critical',
        message: 'Customer rating below 3.5 for consecutive months',
        actionRequired: true,
        severity: 'high',
        createdAt: '2024-03-08T11:45:00Z'
      }
    ],
    lastUpdated: '2024-03-15T14:30:00Z'
  }
];

export const mockBenchmarks: PerformanceBenchmark[] = [
  {
    id: 'B001',
    category: 'Order Management',
    metric: 'Order Fulfillment Rate',
    industryAverage: 92.5,
    topPerformers: 98.2,
    minimumThreshold: 85.0,
    unit: '%',
    description: 'Percentage of orders successfully fulfilled'
  },
  {
    id: 'B002',
    category: 'Customer Service',
    metric: 'Customer Satisfaction Score',
    industryAverage: 4.2,
    topPerformers: 4.7,
    minimumThreshold: 3.5,
    unit: '/5',
    description: 'Average customer rating score'
  },
  {
    id: 'B003',
    category: 'Logistics',
    metric: 'On-Time Delivery Rate',
    industryAverage: 88.7,
    topPerformers: 96.5,
    minimumThreshold: 80.0,
    unit: '%',
    description: 'Percentage of orders delivered on time'
  },
  {
    id: 'B004',
    category: 'Quality',
    metric: 'Defect Rate',
    industryAverage: 2.8,
    topPerformers: 0.5,
    minimumThreshold: 5.0,
    unit: '%',
    description: 'Percentage of products with defects'
  }
];

export const mockScorecard: VendorScorecard = {
  vendorId: 'V001',
  period: 'March 2024',
  categories: {
    orderManagement: {
      score: 9.2,
      metrics: {
        fulfillmentRate: 95.2,
        processingTime: 1.2,
        accuracyRate: 98.1,
        cancellationRate: 1.8
      }
    },
    customerService: {
      score: 8.9,
      metrics: {
        responseTime: 2.1,
        resolutionRate: 94.5,
        satisfactionScore: 4.6,
        communicationQuality: 4.4
      }
    },
    productQuality: {
      score: 9.0,
      metrics: {
        defectRate: 0.8,
        returnRate: 2.1,
        qualityRating: 4.5,
        complianceScore: 96.2
      }
    },
    logistics: {
      score: 9.1,
      metrics: {
        onTimeDelivery: 94.2,
        shippingAccuracy: 97.8,
        packagingQuality: 4.3,
        trackingUpdates: 98.5
      }
    },
    businessCompliance: {
      score: 9.4,
      metrics: {
        documentCompliance: 100.0,
        policyAdherence: 96.2,
        legalCompliance: 98.1,
        ethicalStandards: 95.8
      }
    }
  },
  recommendations: [
    'Maintain current excellent performance levels',
    'Consider expanding product categories',
    'Implement advanced inventory management'
  ],
  improvementPlan: [
    'Continue monitoring customer feedback',
    'Optimize delivery logistics',
    'Regular quality audits'
  ]
};
