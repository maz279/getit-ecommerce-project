
import { CLVCustomer, CLVMetrics, CLVTrendData, CLVSegmentData, CLVPrediction, CLVCampaign, CLVAnalytics } from './types';

export const mockCLVMetrics: CLVMetrics = {
  totalCustomers: 125000,
  averageCLV: 85000,
  totalCLV: 10625000000,
  highValueCustomers: 15000,
  atRiskCustomers: 8500,
  newCustomersCLV: 45000,
  customerGrowthRate: 15.2,
  retentionRate: 78.5,
  churnRate: 21.5,
  averageCustomerLifespan: 24.5
};

export const mockCLVTrendData: CLVTrendData[] = [
  { month: 'Jan', averageCLV: 78000, totalCLV: 9750000000, newCustomerCLV: 42000, retainedCustomerCLV: 89000 },
  { month: 'Feb', averageCLV: 80000, totalCLV: 10000000000, newCustomerCLV: 43500, retainedCustomerCLV: 91000 },
  { month: 'Mar', averageCLV: 82000, totalCLV: 10250000000, newCustomerCLV: 44000, retainedCustomerCLV: 92500 },
  { month: 'Apr', averageCLV: 83500, totalCLV: 10437500000, newCustomerCLV: 44500, retainedCustomerCLV: 94000 },
  { month: 'May', averageCLV: 85000, totalCLV: 10625000000, newCustomerCLV: 45000, retainedCustomerCLV: 95500 },
  { month: 'Jun', averageCLV: 87000, totalCLV: 10875000000, newCustomerCLV: 46000, retainedCustomerCLV: 97000 }
];

export const mockCLVSegmentData: CLVSegmentData[] = [
  { segment: 'High Value', count: 15000, percentage: 12, averageCLV: 350000, totalValue: 5250000000, color: '#10B981' },
  { segment: 'Medium Value', count: 45000, percentage: 36, averageCLV: 95000, totalValue: 4275000000, color: '#3B82F6' },
  { segment: 'Low Value', count: 52000, percentage: 41.6, averageCLV: 25000, totalValue: 1300000000, color: '#F59E0B' },
  { segment: 'At Risk', count: 8500, percentage: 6.8, averageCLV: 15000, totalValue: 127500000, color: '#EF4444' },
  { segment: 'New Customer', count: 4500, percentage: 3.6, averageCLV: 45000, totalValue: 202500000, color: '#8B5CF6' }
];

export const mockCLVCustomers: CLVCustomer[] = [
  {
    id: '1',
    customerId: 'CUST-001',
    customerName: 'Ahmed Rahman',
    email: 'ahmed.rahman@email.com',
    registrationDate: '2022-01-15',
    firstPurchaseDate: '2022-01-20',
    lastPurchaseDate: '2024-12-15',
    totalOrders: 45,
    totalSpent: 450000,
    averageOrderValue: 10000,
    purchaseFrequency: 1.5,
    currentCLV: 520000,
    predictedCLV: 750000,
    clvTrend: 'increasing',
    customerSegment: 'high_value',
    churnProbability: 0.15,
    monthsActive: 35,
    loyaltyScore: 95,
    preferredCategories: ['Electronics', 'Fashion'],
    lastEngagementDate: '2024-12-20',
    marketingChannelSource: 'Social Media',
    retentionRate: 85,
    crossSellPotential: 80,
    upSellPotential: 75
  },
  {
    id: '2',
    customerId: 'CUST-002',
    customerName: 'Fatima Khan',
    email: 'fatima.khan@email.com',
    registrationDate: '2022-03-10',
    firstPurchaseDate: '2022-03-15',
    lastPurchaseDate: '2024-12-10',
    totalOrders: 38,
    totalSpent: 320000,
    averageOrderValue: 8421,
    purchaseFrequency: 1.2,
    currentCLV: 385000,
    predictedCLV: 520000,
    clvTrend: 'stable',
    customerSegment: 'high_value',
    churnProbability: 0.25,
    monthsActive: 33,
    loyaltyScore: 88,
    preferredCategories: ['Beauty', 'Home & Garden'],
    lastEngagementDate: '2024-12-18',
    marketingChannelSource: 'Email Marketing',
    retentionRate: 78,
    crossSellPotential: 70,
    upSellPotential: 65
  },
  {
    id: '3',
    customerId: 'CUST-003',
    customerName: 'Mohammad Ali',
    email: 'mohammad.ali@email.com',
    registrationDate: '2023-06-20',
    firstPurchaseDate: '2023-06-25',
    lastPurchaseDate: '2024-11-30',
    totalOrders: 22,
    totalSpent: 165000,
    averageOrderValue: 7500,
    purchaseFrequency: 1.8,
    currentCLV: 198000,
    predictedCLV: 280000,
    clvTrend: 'increasing',
    customerSegment: 'medium_value',
    churnProbability: 0.35,
    monthsActive: 18,
    loyaltyScore: 72,
    preferredCategories: ['Sports', 'Books'],
    lastEngagementDate: '2024-12-05',
    marketingChannelSource: 'Search Engine',
    retentionRate: 65,
    crossSellPotential: 60,
    upSellPotential: 55
  }
];

export const mockCLVPredictions: CLVPrediction[] = [
  {
    customerId: 'CUST-001',
    currentCLV: 520000,
    predictedCLV3Months: 580000,
    predictedCLV6Months: 650000,
    predictedCLV12Months: 750000,
    confidenceScore: 92,
    keyFactors: ['High purchase frequency', 'Increasing order values', 'Strong brand loyalty'],
    recommendations: ['Offer premium product recommendations', 'Invite to VIP program', 'Provide early access to new products']
  },
  {
    customerId: 'CUST-002',
    currentCLV: 385000,
    predictedCLV3Months: 410000,
    predictedCLV6Months: 450000,
    predictedCLV12Months: 520000,
    confidenceScore: 85,
    keyFactors: ['Consistent purchase pattern', 'High engagement rate', 'Positive review history'],
    recommendations: ['Cross-sell complementary products', 'Personalized email campaigns', 'Loyalty point bonuses']
  }
];

export const mockCLVCampaigns: CLVCampaign[] = [
  {
    id: '1',
    name: 'High-Value Customer Retention',
    type: 'retention',
    targetSegment: 'high_value',
    startDate: '2024-12-01',
    endDate: '2025-02-28',
    status: 'active',
    targetedCustomers: 15000,
    expectedCLVIncrease: 25000,
    actualCLVIncrease: 28000,
    budget: 5000000,
    roi: 156,
    description: 'Exclusive offers and personalized service for high-value customers'
  },
  {
    id: '2',
    name: 'At-Risk Customer Winback',
    type: 'winback',
    targetSegment: 'at_risk',
    startDate: '2024-11-15',
    endDate: '2024-12-31',
    status: 'active',
    targetedCustomers: 8500,
    expectedCLVIncrease: 15000,
    actualCLVIncrease: 12000,
    budget: 2000000,
    roi: 85,
    description: 'Special discounts and incentives to re-engage at-risk customers'
  }
];

export const mockCLVAnalytics: CLVAnalytics = {
  clvByChannel: [
    { channel: 'Social Media', averageCLV: 95000, customerCount: 35000, totalValue: 3325000000 },
    { channel: 'Email Marketing', averageCLV: 88000, customerCount: 28000, totalValue: 2464000000 },
    { channel: 'Search Engine', averageCLV: 82000, customerCount: 32000, totalValue: 2624000000 },
    { channel: 'Direct', averageCLV: 105000, customerCount: 18000, totalValue: 1890000000 },
    { channel: 'Referral', averageCLV: 120000, customerCount: 12000, totalValue: 1440000000 }
  ],
  clvByCategory: [
    { category: 'Electronics', averageCLV: 125000, contribution: 35 },
    { category: 'Fashion', averageCLV: 95000, contribution: 28 },
    { category: 'Home & Garden', averageCLV: 78000, contribution: 18 },
    { category: 'Beauty', averageCLV: 65000, contribution: 12 },
    { category: 'Sports', averageCLV: 58000, contribution: 7 }
  ],
  cohortAnalysis: [
    { cohort: '2024-Q1', month0: 100, month1: 85, month3: 72, month6: 65, month12: 58 },
    { cohort: '2024-Q2', month0: 100, month1: 88, month3: 75, month6: 68, month12: 0 },
    { cohort: '2024-Q3', month0: 100, month1: 90, month3: 78, month6: 0, month12: 0 },
    { cohort: '2024-Q4', month0: 100, month1: 92, month3: 0, month6: 0, month12: 0 }
  ],
  seasonalTrends: [
    { month: 'Jan', clvGrowth: 5.2, customerAcquisition: 1200 },
    { month: 'Feb', clvGrowth: 3.8, customerAcquisition: 1100 },
    { month: 'Mar', clvGrowth: 4.5, customerAcquisition: 1350 },
    { month: 'Apr', clvGrowth: 6.2, customerAcquisition: 1450 },
    { month: 'May', clvGrowth: 7.8, customerAcquisition: 1600 },
    { month: 'Jun', clvGrowth: 8.5, customerAcquisition: 1750 }
  ]
};
