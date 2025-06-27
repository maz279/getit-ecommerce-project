
import { 
  LoyaltyProgram, 
  LoyaltyMember, 
  LoyaltyTransaction, 
  LoyaltyReward, 
  LoyaltyAnalytics,
  LoyaltySegment,
  LoyaltyCampaign
} from './types';

export const mockLoyaltyPrograms: LoyaltyProgram[] = [
  {
    id: 'prog-001',
    name: 'GetIt Rewards Program',
    type: 'points',
    status: 'active',
    enrolledMembers: 125000,
    totalRewards: 2450000,
    engagementRate: 68.5,
    retentionRate: 78.2,
    conversionRate: 24.6,
    createdAt: '2023-01-15',
    description: 'Our flagship loyalty program offering points for every purchase'
  },
  {
    id: 'prog-002',
    name: 'VIP Tier Program',
    type: 'tier',
    status: 'active',
    enrolledMembers: 45000,
    totalRewards: 890000,
    engagementRate: 82.3,
    retentionRate: 89.1,
    conversionRate: 45.2,
    createdAt: '2023-03-01',
    description: 'Exclusive tier-based program for high-value customers'
  }
];

export const mockLoyaltyMembers: LoyaltyMember[] = [
  {
    id: 'mem-001',
    customerId: 'cust-001',
    customerName: 'Fatima Rahman',
    email: 'fatima.rahman@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b2fc?w=150',
    currentTier: 'Gold',
    totalPoints: 15240,
    pointsExpiring: 850,
    expiryDate: '2024-08-15',
    lifetimeSpent: 125000,
    totalOrders: 47,
    averageOrderValue: 2660,
    lastActivity: '2024-01-10',
    joinDate: '2023-02-15',
    referrals: 8,
    rewardsRedeemed: 12,
    engagementScore: 89,
    churnRisk: 'low',
    preferredCategories: ['Fashion', 'Electronics', 'Beauty'],
    communicationPreference: 'email'
  },
  {
    id: 'mem-002',
    customerId: 'cust-002',
    customerName: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    currentTier: 'Platinum',
    totalPoints: 28500,
    pointsExpiring: 1200,
    expiryDate: '2024-09-20',
    lifetimeSpent: 245000,
    totalOrders: 89,
    averageOrderValue: 2750,
    lastActivity: '2024-01-08',
    joinDate: '2022-08-10',
    referrals: 15,
    rewardsRedeemed: 24,
    engagementScore: 94,
    churnRisk: 'low',
    preferredCategories: ['Electronics', 'Home & Garden', 'Sports'],
    communicationPreference: 'all'
  },
  {
    id: 'mem-003',
    customerId: 'cust-003',
    customerName: 'Rashida Begum',
    email: 'rashida.begum@email.com',
    currentTier: 'Silver',
    totalPoints: 6750,
    pointsExpiring: 450,
    expiryDate: '2024-07-30',
    lifetimeSpent: 68000,
    totalOrders: 28,
    averageOrderValue: 2430,
    lastActivity: '2023-12-25',
    joinDate: '2023-05-20',
    referrals: 3,
    rewardsRedeemed: 6,
    engagementScore: 72,
    churnRisk: 'medium',
    preferredCategories: ['Fashion', 'Beauty', 'Health'],
    communicationPreference: 'sms'
  }
];

export const mockLoyaltyTransactions: LoyaltyTransaction[] = [
  {
    id: 'trans-001',
    customerId: 'cust-001',
    customerName: 'Fatima Rahman',
    type: 'earn',
    points: 450,
    description: 'Points earned from order #ORD-2024-001',
    orderId: 'ORD-2024-001',
    date: '2024-01-10',
    status: 'completed'
  },
  {
    id: 'trans-002',
    customerId: 'cust-001',
    customerName: 'Fatima Rahman',
    type: 'redeem',
    points: -200,
    description: 'Redeemed 20% discount voucher',
    rewardId: 'rew-001',
    date: '2024-01-08',
    status: 'completed'
  },
  {
    id: 'trans-003',
    customerId: 'cust-002',
    customerName: 'Ahmed Hassan',
    type: 'bonus',
    points: 1000,
    description: 'Birthday bonus points',
    date: '2024-01-05',
    status: 'completed'
  }
];

export const mockLoyaltyRewards: LoyaltyReward[] = [
  {
    id: 'rew-001',
    name: '20% Off Any Purchase',
    description: 'Get 20% discount on your next order (max ৳1000 off)',
    type: 'discount',
    pointsCost: 500,
    value: 1000,
    category: 'Discount',
    availability: 1000,
    redeemed: 234,
    popularity: 87,
    eligibleTiers: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    isActive: true
  },
  {
    id: 'rew-002',
    name: 'Free Shipping Voucher',
    description: 'Free shipping on your next 3 orders',
    type: 'free_shipping',
    pointsCost: 200,
    value: 300,
    category: 'Shipping',
    availability: 2000,
    redeemed: 456,
    popularity: 92,
    eligibleTiers: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    isActive: true
  },
  {
    id: 'rew-003',
    name: 'Premium Gift Box',
    description: 'Exclusive premium gift box with surprise items',
    type: 'product',
    pointsCost: 2000,
    value: 5000,
    category: 'Gift',
    availability: 100,
    redeemed: 23,
    popularity: 78,
    eligibleTiers: ['Gold', 'Platinum', 'Diamond'],
    isActive: true
  }
];

export const mockLoyaltyAnalytics: LoyaltyAnalytics = {
  totalMembers: 125000,
  activeMembers: 89500,
  newMembersThisMonth: 3450,
  totalPointsIssued: 15600000,
  totalPointsRedeemed: 8900000,
  totalPointsExpired: 1200000,
  averageEngagementScore: 74.5,
  programROI: 4.2,
  memberRetentionRate: 82.3,
  rewardRedemptionRate: 57.1,
  averagePointsPerMember: 124.8,
  topPerformingRewards: mockLoyaltyRewards.slice(0, 3),
  membershipGrowth: [
    { month: 'Jul 2023', newMembers: 2100, activeMembers: 78000, churnedMembers: 450 },
    { month: 'Aug 2023', newMembers: 2800, activeMembers: 82000, churnedMembers: 520 },
    { month: 'Sep 2023', newMembers: 3200, activeMembers: 85500, churnedMembers: 480 },
    { month: 'Oct 2023', newMembers: 2950, activeMembers: 87200, churnedMembers: 390 },
    { month: 'Nov 2023', newMembers: 3100, activeMembers: 88900, churnedMembers: 420 },
    { month: 'Dec 2023', newMembers: 3400, activeMembers: 89500, churnedMembers: 380 }
  ],
  tierDistribution: [
    { tier: 'Bronze', count: 62500, percentage: 50, averageSpend: 15000 },
    { tier: 'Silver', count: 37500, percentage: 30, averageSpend: 35000 },
    { tier: 'Gold', count: 18750, percentage: 15, averageSpend: 75000 },
    { tier: 'Platinum', count: 5000, percentage: 4, averageSpend: 150000 },
    { tier: 'Diamond', count: 1250, percentage: 1, averageSpend: 300000 }
  ],
  pointsAnalytics: [
    { month: 'Jul 2023', issued: 2100000, redeemed: 1200000, expired: 150000 },
    { month: 'Aug 2023', issued: 2450000, redeemed: 1400000, expired: 180000 },
    { month: 'Sep 2023', issued: 2800000, redeemed: 1650000, expired: 160000 },
    { month: 'Oct 2023', issued: 2600000, redeemed: 1500000, expired: 200000 },
    { month: 'Nov 2023', issued: 2900000, redeemed: 1800000, expired: 170000 },
    { month: 'Dec 2023', issued: 3200000, redeemed: 2100000, expired: 190000 }
  ],
  engagementMetrics: [
    { category: 'Fashion', engagementRate: 78.5, conversionRate: 34.2, revenueImpact: 2800000 },
    { category: 'Electronics', engagementRate: 82.1, conversionRate: 28.7, revenueImpact: 3400000 },
    { category: 'Beauty', engagementRate: 89.3, conversionRate: 42.1, revenueImpact: 1900000 },
    { category: 'Home & Garden', engagementRate: 71.2, conversionRate: 25.8, revenueImpact: 1600000 }
  ]
};

export const mockLoyaltySegments: LoyaltySegment[] = [
  {
    id: 'seg-001',
    name: 'High-Value Champions',
    description: 'Premium customers with high engagement and spending',
    criteria: {
      minSpend: 100000,
      tier: ['Platinum', 'Diamond'],
      engagementLevel: 'high'
    },
    memberCount: 6250,
    averageValue: 225000,
    campaignPerformance: 89.5,
    automatedActions: ['VIP offers', 'Early access', 'Personal shopping']
  },
  {
    id: 'seg-002',
    name: 'At-Risk Loyalists',
    description: 'Previously active members showing signs of disengagement',
    criteria: {
      minPoints: 5000,
      churnRisk: 'high'
    },
    memberCount: 12500,
    averageValue: 85000,
    campaignPerformance: 67.2,
    automatedActions: ['Win-back offers', 'Bonus points', 'Personal outreach']
  }
];

export const mockLoyaltyCampaigns: LoyaltyCampaign[] = [
  {
    id: 'camp-001',
    name: 'Double Points Weekend',
    type: 'bonus_points',
    status: 'active',
    startDate: '2024-01-12',
    endDate: '2024-01-14',
    targetSegment: 'All Members',
    participantsCount: 45000,
    engagementRate: 78.5,
    conversionRate: 34.2,
    totalRevenueGenerated: 2800000,
    costPerAcquisition: 62,
    roi: 4.8,
    description: 'Earn double points on all purchases during weekend',
    rules: {
      pointsMultiplier: 2,
      minimumSpend: 1000
    }
  },
  {
    id: 'camp-002',
    name: 'Birthday Celebration',
    type: 'birthday',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    targetSegment: 'All Members',
    participantsCount: 3200,
    engagementRate: 92.1,
    conversionRate: 56.8,
    totalRevenueGenerated: 450000,
    costPerAcquisition: 35,
    roi: 6.2,
    description: 'Special birthday rewards and bonus points',
    rules: {
      bonusPoints: 1000,
      eligibleCategories: ['Fashion', 'Beauty', 'Electronics']
    }
  }
];
