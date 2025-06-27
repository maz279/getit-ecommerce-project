
import { FeaturedProduct, FeaturedCampaign, FeaturedStats, FeaturedAnalytics, FeaturedSettings } from './types';

export const mockFeaturedProductsData = {
  featuredProducts: [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      sku: 'APL-IP15PM-256',
      category: 'Electronics',
      vendor: 'Apple Authorized',
      price: 142000,
      originalPrice: 155000,
      images: ['/images/iphone15.jpg'],
      rating: 4.8,
      reviews: 2341,
      stock: 45,
      sold: 1234,
      isFeatured: true,
      featuredPosition: 1,
      featuredStartDate: new Date('2024-01-01'),
      featuredEndDate: new Date('2024-02-01'),
      featuredType: 'homepage' as const,
      clicks: 15420,
      impressions: 245600,
      conversionRate: 6.3,
      revenue: 8946000
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      sku: 'SAM-GS24U-512',
      category: 'Electronics',
      vendor: 'Samsung Bangladesh',
      price: 135000,
      originalPrice: 145000,
      images: ['/images/galaxys24.jpg'],
      rating: 4.7,
      reviews: 1876,
      stock: 32,
      sold: 987,
      isFeatured: true,
      featuredPosition: 2,
      featuredStartDate: new Date('2024-01-15'),
      featuredEndDate: new Date('2024-02-15'),
      featuredType: 'category' as const,
      clicks: 12340,
      impressions: 198750,
      conversionRate: 5.8,
      revenue: 6627000
    },
    {
      id: '3',
      name: 'MacBook Air M3',
      sku: 'APL-MBA-M3-256',
      category: 'Electronics',
      vendor: 'Apple Authorized',
      price: 128000,
      originalPrice: 135000,
      images: ['/images/macbook.jpg'],
      rating: 4.9,
      reviews: 1245,
      stock: 18,
      sold: 567,
      isFeatured: true,
      featuredPosition: 3,
      featuredStartDate: new Date('2024-01-10'),
      featuredEndDate: new Date('2024-02-10'),
      featuredType: 'search' as const,
      clicks: 9876,
      impressions: 156400,
      conversionRate: 7.2,
      revenue: 4563200
    }
  ] as FeaturedProduct[],

  campaigns: [
    {
      id: '1',
      name: 'New Year Tech Sale',
      type: 'seasonal' as const,
      status: 'active' as const,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      productCount: 25,
      totalViews: 856400,
      totalClicks: 45230,
      totalRevenue: 25684000,
      conversionRate: 5.3,
      priority: 1,
      targetAudience: ['tech-enthusiasts', 'premium-buyers'],
      description: 'Featuring premium tech products for the New Year'
    },
    {
      id: '2',
      name: 'Flash Electronics',
      type: 'flash-sale' as const,
      status: 'scheduled' as const,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-03'),
      productCount: 15,
      totalViews: 0,
      totalClicks: 0,
      totalRevenue: 0,
      conversionRate: 0,
      priority: 2,
      targetAudience: ['bargain-hunters', 'electronics-buyers'],
      description: '72-hour flash sale on electronics'
    }
  ] as FeaturedCampaign[],

  stats: {
    totalFeatured: 45,
    activeCampaigns: 3,
    totalImpressions: 2456780,
    totalClicks: 156420,
    avgConversionRate: 6.1,
    totalRevenue: 45680000,
    topPerformer: 'iPhone 15 Pro Max',
    clickThroughRate: 6.37
  } as FeaturedStats,

  analytics: {
    performanceOverTime: [
      { date: '2024-01-01', impressions: 45600, clicks: 2890, conversions: 185, revenue: 2650000 },
      { date: '2024-01-02', impressions: 52300, clicks: 3340, conversions: 215, revenue: 3080000 },
      { date: '2024-01-03', impressions: 48900, clicks: 3120, conversions: 198, revenue: 2840000 },
      { date: '2024-01-04', impressions: 51200, clicks: 3280, conversions: 208, revenue: 2980000 },
      { date: '2024-01-05', impressions: 49800, clicks: 3180, conversions: 202, revenue: 2890000 }
    ],
    topPerforming: [
      { productName: 'iPhone 15 Pro Max', clicks: 15420, conversions: 972, revenue: 8946000, conversionRate: 6.3 },
      { productName: 'Samsung Galaxy S24 Ultra', clicks: 12340, conversions: 716, revenue: 6627000, conversionRate: 5.8 },
      { productName: 'MacBook Air M3', clicks: 9876, conversions: 711, revenue: 4563200, conversionRate: 7.2 }
    ],
    categoryBreakdown: [
      { category: 'Electronics', count: 28, clicks: 89450, revenue: 34560000 },
      { category: 'Fashion', count: 12, clicks: 45620, revenue: 8900000 },
      { category: 'Home & Garden', count: 5, clicks: 21350, revenue: 2220000 }
    ],
    placementPerformance: [
      { placement: 'Homepage Banner', impressions: 856400, clicks: 54560, ctr: 6.37, revenue: 18956000 },
      { placement: 'Category Pages', impressions: 654300, clicks: 39258, ctr: 6.00, revenue: 14232000 },
      { placement: 'Search Results', impressions: 498200, clicks: 34874, ctr: 7.00, revenue: 12492000 }
    ]
  } as FeaturedAnalytics,

  settings: {
    maxFeaturedProducts: 50,
    autoRotation: true,
    rotationInterval: 24,
    requireApproval: true,
    allowVendorNomination: true,
    defaultFeaturedDuration: 30,
    placementRules: {
      homepage: 8,
      categoryPages: 12,
      searchResults: 6
    },
    qualityThresholds: {
      minRating: 4.0,
      minReviews: 10,
      minStock: 5
    }
  } as FeaturedSettings
};
