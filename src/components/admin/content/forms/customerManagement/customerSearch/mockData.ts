
import { CustomerSearchData, SearchAnalytics, SavedSearch, BulkActionHistory } from './types';

export const customerSearchData: CustomerSearchData[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0123',
    tier: 'VIP',
    status: 'Active',
    registrationDate: '2022-01-15',
    lastActivity: '2024-06-25',
    totalOrders: 45,
    lifetimeValue: 15000,
    averageOrderValue: 333.33,
    location: {
      city: 'New York',
      country: 'USA',
      region: 'North America'
    },
    preferences: {
      categories: ['Electronics', 'Fashion', 'Home & Garden'],
      brands: ['Apple', 'Samsung', 'Nike'],
      priceRange: { min: 100, max: 2000 }
    },
    tags: ['High Value', 'Frequent Buyer', 'Tech Enthusiast'],
    notes: 'Premium customer with consistent purchase history',
    riskScore: 15,
    satisfactionRating: 4.8,
    referralCount: 8,
    communicationPreference: 'Email'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@email.com',
    phone: '+1-555-0124',
    tier: 'Gold',
    status: 'Active',
    registrationDate: '2021-08-10',
    lastActivity: '2024-06-22',
    totalOrders: 68,
    lifetimeValue: 25000,
    averageOrderValue: 367.65,
    location: {
      city: 'San Francisco',
      country: 'USA',
      region: 'North America'
    },
    preferences: {
      categories: ['Books', 'Electronics', 'Sports'],
      brands: ['Sony', 'Adidas', 'Microsoft'],
      priceRange: { min: 50, max: 1500 }
    },
    tags: ['Loyal Customer', 'Bulk Buyer', 'Corporate Account'],
    notes: 'B2B customer with regular bulk orders',
    riskScore: 8,
    satisfactionRating: 4.9,
    referralCount: 12,
    communicationPreference: 'Phone'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'e.rodriguez@email.com',
    phone: '+1-555-0125',
    tier: 'Silver',
    status: 'Active',
    registrationDate: '2022-03-22',
    lastActivity: '2024-06-18',
    totalOrders: 32,
    lifetimeValue: 8500,
    averageOrderValue: 265.63,
    location: {
      city: 'Miami',
      country: 'USA',
      region: 'North America'
    },
    preferences: {
      categories: ['Beauty', 'Health', 'Fashion'],
      brands: ['L\'Oreal', 'Clinique', 'Zara'],
      priceRange: { min: 25, max: 800 }
    },
    tags: ['Beauty Enthusiast', 'Seasonal Shopper'],
    notes: 'Active during sale seasons, prefers beauty products',
    riskScore: 25,
    satisfactionRating: 4.5,
    referralCount: 3,
    communicationPreference: 'SMS'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@email.com',
    phone: '+1-555-0126',
    tier: 'Bronze',
    status: 'Inactive',
    registrationDate: '2023-01-05',
    lastActivity: '2024-03-15',
    totalOrders: 8,
    lifetimeValue: 1200,
    averageOrderValue: 150,
    location: {
      city: 'Toronto',
      country: 'Canada',
      region: 'North America'
    },
    preferences: {
      categories: ['Gaming', 'Electronics'],
      brands: ['PlayStation', 'Nintendo'],
      priceRange: { min: 30, max: 500 }
    },
    tags: ['Gaming', 'Young Adult', 'Price Sensitive'],
    notes: 'Student customer, price-conscious buyer',
    riskScore: 60,
    satisfactionRating: 4.2,
    referralCount: 1,
    communicationPreference: 'Email'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    phone: '+1-555-0127',
    tier: 'Platinum',
    status: 'VIP',
    registrationDate: '2020-11-30',
    lastActivity: '2024-06-26',
    totalOrders: 156,
    lifetimeValue: 45000,
    averageOrderValue: 288.46,
    location: {
      city: 'London',
      country: 'UK',
      region: 'Europe'
    },
    preferences: {
      categories: ['Luxury', 'Fashion', 'Jewelry'],
      brands: ['Gucci', 'Louis Vuitton', 'Tiffany'],
      priceRange: { min: 200, max: 5000 }
    },
    tags: ['VIP', 'Luxury Buyer', 'International'],
    notes: 'Premium international customer, luxury preferences',
    riskScore: 5,
    satisfactionRating: 4.9,
    referralCount: 15,
    communicationPreference: 'WhatsApp'
  }
];

export const searchAnalyticsData: SearchAnalytics = {
  totalSearches: 12450,
  averageResultsPerSearch: 23,
  mostSearchedTerms: [
    { term: 'VIP customers', count: 890 },
    { term: 'high value', count: 756 },
    { term: 'inactive', count: 643 },
    { term: 'electronics', count: 521 },
    { term: 'fashion', count: 445 }
  ],
  searchTrends: [
    { date: '2024-06-01', searches: 145 },
    { date: '2024-06-02', searches: 162 },
    { date: '2024-06-03', searches: 138 },
    { date: '2024-06-04', searches: 189 },
    { date: '2024-06-05', searches: 203 },
    { date: '2024-06-06', searches: 176 },
    { date: '2024-06-07', searches: 195 }
  ],
  filterUsage: [
    { filter: 'Customer Tier', usage: 68 },
    { filter: 'Order Count', usage: 45 },
    { filter: 'Lifetime Value', usage: 42 },
    { filter: 'Registration Date', usage: 38 },
    { filter: 'Location', usage: 28 }
  ],
  popularCategories: [
    { category: 'Electronics', searches: 1240 },
    { category: 'Fashion', searches: 980 },
    { category: 'Beauty', searches: 756 },
    { category: 'Home & Garden', searches: 623 },
    { category: 'Sports', searches: 445 }
  ]
};

export const savedSearches: SavedSearch[] = [
  {
    id: '1',
    name: 'High Value Inactive Customers',
    query: 'inactive high value',
    filters: [
      { type: 'status', value: 'Inactive', label: 'Status: Inactive' },
      { type: 'lifetimeValue', value: '5000', operator: 'greater', label: 'Lifetime Value > $5,000' }
    ],
    createdAt: '2024-06-01',
    lastUsed: '2024-06-25',
    resultCount: 23
  },
  {
    id: '2',
    name: 'VIP Electronics Enthusiasts',
    query: 'VIP electronics',
    filters: [
      { type: 'tier', value: 'VIP', label: 'Tier: VIP' },
      { type: 'category', value: 'Electronics', label: 'Category: Electronics' }
    ],
    createdAt: '2024-05-15',
    lastUsed: '2024-06-20',
    resultCount: 45
  },
  {
    id: '3',
    name: 'New Customers Last 30 Days',
    query: '',
    filters: [
      { type: 'registrationDate', value: '2024-05-25', operator: 'greater', label: 'Registration > 2024-05-25' }
    ],
    createdAt: '2024-06-10',
    lastUsed: '2024-06-24',
    resultCount: 67
  }
];

export const bulkActionHistory: BulkActionHistory[] = [
  {
    id: '1',
    action: 'Send Email Campaign',
    customerCount: 150,
    performedBy: 'Marketing Team',
    performedAt: '2024-06-25 14:30',
    status: 'completed',
    details: 'Summer sale promotion email sent successfully'
  },
  {
    id: '2',
    action: 'Update Customer Tier',
    customerCount: 23,
    performedBy: 'Customer Service',
    performedAt: '2024-06-24 09:15',
    status: 'completed',
    details: 'Upgraded customers to Gold tier based on purchase history'
  },
  {
    id: '3',
    action: 'Export Customer Data',
    customerCount: 500,
    performedBy: 'Analytics Team',
    performedAt: '2024-06-23 16:45',
    status: 'completed',
    details: 'Customer data exported for quarterly analysis'
  }
];
