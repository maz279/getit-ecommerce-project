
import { CustomerBehaviorData, BehaviorSegment, BehaviorMetrics, PersonalizationInsight, BehaviorAlert } from './types';

export const mockCustomerBehaviorData: CustomerBehaviorData[] = [
  {
    customerId: 'cust_001',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    totalSessions: 45,
    totalPageViews: 234,
    avgSessionDuration: 8.5,
    bounceRate: 0.25,
    conversionRate: 0.12,
    lastActive: '2024-06-27T10:30:00Z',
    lifetimeValue: 15420,
    totalOrders: 12,
    averageOrderValue: 1285,
    favoriteCategories: ['Electronics', 'Home & Living'],
    devicePreference: 'mobile',
    behaviorScore: 85,
    riskLevel: 'low',
    customerStage: 'loyal',
    engagementLevel: 'high',
    predictedChurnRisk: 0.15,
    nextPurchaseProbability: 0.78,
    recommendationClickRate: 0.42,
    searchBehavior: {
      totalSearches: 89,
      topSearchTerms: ['smartphone', 'laptop', 'headphones'],
      searchToConversionRate: 0.18
    },
    socialEngagement: {
      reviewsWritten: 8,
      averageRating: 4.2,
      socialShares: 12
    },
    touchpoints: [
      {
        id: 'tp_001',
        timestamp: '2024-06-27T10:30:00Z',
        type: 'product_view',
        details: {
          product: 'iPhone 15 Pro',
          category: 'Electronics',
          deviceType: 'mobile',
          sessionId: 'sess_123',
          duration: 180
        }
      }
    ]
  },
  {
    customerId: 'cust_002',
    name: 'Fatima Rahman',
    email: 'fatima.rahman@email.com',
    totalSessions: 28,
    totalPageViews: 156,
    avgSessionDuration: 12.2,
    bounceRate: 0.18,
    conversionRate: 0.25,
    lastActive: '2024-06-26T15:45:00Z',
    lifetimeValue: 24650,
    totalOrders: 18,
    averageOrderValue: 1369,
    favoriteCategories: ['Fashion', 'Beauty'],
    devicePreference: 'desktop',
    behaviorScore: 92,
    riskLevel: 'low',
    customerStage: 'loyal',
    engagementLevel: 'high',
    predictedChurnRisk: 0.08,
    nextPurchaseProbability: 0.85,
    recommendationClickRate: 0.56,
    searchBehavior: {
      totalSearches: 124,
      topSearchTerms: ['dress', 'makeup', 'skincare'],
      searchToConversionRate: 0.32
    },
    socialEngagement: {
      reviewsWritten: 15,
      averageRating: 4.6,
      socialShares: 28
    },
    touchpoints: []
  }
];

export const mockBehaviorSegments: BehaviorSegment[] = [
  {
    id: 'seg_001',
    name: 'High-Value Loyalists',
    description: 'Customers with high lifetime value and strong engagement',
    customerCount: 1250,
    characteristics: ['High AOV', 'Frequent purchases', 'High engagement', 'Low churn risk'],
    avgLifetimeValue: 28500,
    conversionRate: 0.45,
    retentionRate: 0.92,
    color: '#10B981'
  },
  {
    id: 'seg_002',
    name: 'Mobile-First Shoppers',
    description: 'Customers who primarily shop via mobile devices',
    customerCount: 3200,
    characteristics: ['Mobile preference', 'Quick sessions', 'Impulse buying'],
    avgLifetimeValue: 12800,
    conversionRate: 0.28,
    retentionRate: 0.75,
    color: '#3B82F6'
  },
  {
    id: 'seg_003',
    name: 'At-Risk Customers',
    description: 'Previously active customers showing declining engagement',
    customerCount: 850,
    characteristics: ['Declining activity', 'Long time since last purchase', 'Low engagement'],
    avgLifetimeValue: 8200,
    conversionRate: 0.12,
    retentionRate: 0.35,
    color: '#EF4444'
  }
];

export const mockBehaviorMetrics: BehaviorMetrics = {
  totalActiveCustomers: 12450,
  averageSessionDuration: 9.8,
  overallConversionRate: 0.24,
  customerRetentionRate: 0.78,
  averageEngagementScore: 72,
  churnRiskCustomers: 1240,
  topPerformingSegments: ['High-Value Loyalists', 'Mobile-First Shoppers'],
  behaviorTrends: [
    { date: '2024-06-20', sessions: 15420, conversions: 3650, revenue: 285400 },
    { date: '2024-06-21', sessions: 16200, conversions: 3890, revenue: 298200 },
    { date: '2024-06-22', sessions: 14800, conversions: 3420, revenue: 276800 },
    { date: '2024-06-23', sessions: 17500, conversions: 4200, revenue: 315600 },
    { date: '2024-06-24', sessions: 18200, conversions: 4580, revenue: 342800 },
    { date: '2024-06-25', sessions: 16800, conversions: 4120, revenue: 328400 },
    { date: '2024-06-26', sessions: 19200, conversions: 4850, revenue: 365200 }
  ]
};

export const mockPersonalizationInsights: PersonalizationInsight[] = [
  {
    customerId: 'cust_001',
    recommendationType: 'Similar Products',
    clickThroughRate: 0.42,
    conversionRate: 0.18,
    revenue: 2450,
    effectiveness: 'high',
    recommendations: ['iPhone Accessories', 'Premium Headphones', 'Smart Watch']
  },
  {
    customerId: 'cust_002',
    recommendationType: 'Trending Items',
    clickThroughRate: 0.56,
    conversionRate: 0.32,
    revenue: 3680,
    effectiveness: 'high',
    recommendations: ['Summer Dresses', 'Skincare Sets', 'Designer Bags']
  }
];

export const mockBehaviorAlerts: BehaviorAlert[] = [
  {
    id: 'alert_001',
    type: 'churn_risk',
    severity: 'high',
    customerId: 'cust_003',
    customerName: 'Rahman Ali',
    message: 'Customer has not made a purchase in 45 days and engagement has dropped 60%',
    timestamp: '2024-06-27T08:00:00Z',
    actionRequired: true,
    suggestedActions: ['Send personalized offer', 'Email engagement campaign', 'Customer service outreach']
  },
  {
    id: 'alert_002',
    type: 'high_value_opportunity',
    severity: 'medium',
    customerId: 'cust_004',
    customerName: 'Nadia Khan',
    message: 'Customer showing increased activity and cart value - potential for upselling',
    timestamp: '2024-06-27T09:15:00Z',
    actionRequired: false,
    suggestedActions: ['Show premium product recommendations', 'Offer loyalty program upgrade']
  }
];
