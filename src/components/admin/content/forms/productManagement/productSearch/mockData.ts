
import { ProductSearchResult, SearchStats, SearchAnalytics, SearchTrend, SearchHistoryItem, PopularSearch, SearchConfiguration } from './types';

export const mockProductSearchData = {
  products: [
    {
      id: '1',
      name: 'iPhone 15 Pro Max 256GB Natural Titanium',
      sku: 'APL-IP15PM-256-NT',
      price: 159900,
      originalPrice: 169900,
      discount: 6,
      rating: 4.8,
      reviews: 2847,
      images: ['/api/placeholder/300/300', '/api/placeholder/300/300'],
      category: 'Electronics > Mobile Phones > Smartphones',
      vendor: 'Apple Authorized Dealer BD',
      stock: 45,
      sold: 1289,
      tags: ['premium', 'flagship', 'camera', '5G', 'titanium'],
      description: 'Latest iPhone with titanium build, advanced camera system, and A17 Pro chip',
      isActive: true,
      isFeatured: true,
      dateAdded: new Date('2024-01-15'),
      lastUpdated: new Date('2024-01-20')
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24 Ultra 512GB Titanium Black',
      sku: 'SAM-GS24U-512-TB',
      price: 144900,
      originalPrice: 154900,
      discount: 6,
      rating: 4.7,
      reviews: 1956,
      images: ['/api/placeholder/300/300', '/api/placeholder/300/300'],
      category: 'Electronics > Mobile Phones > Smartphones',
      vendor: 'Samsung Bangladesh',
      stock: 32,
      sold: 876,
      tags: ['premium', 'S-Pen', 'camera', '5G', 'AI'],
      description: 'Premium Android flagship with S Pen, advanced AI features, and titanium frame',
      isActive: true,
      isFeatured: true,
      dateAdded: new Date('2024-01-10'),
      lastUpdated: new Date('2024-01-18')
    },
    {
      id: '3',
      name: 'MacBook Air M3 13-inch 256GB Space Gray',
      sku: 'APL-MBA-M3-256-SG',
      price: 134900,
      originalPrice: 139900,
      discount: 4,
      rating: 4.9,
      reviews: 1234,
      images: ['/api/placeholder/300/300', '/api/placeholder/300/300'],
      category: 'Electronics > Computers > Laptops',
      vendor: 'Apple Authorized Dealer BD',
      stock: 28,
      sold: 567,
      tags: ['ultrabook', 'M3', 'lightweight', 'premium'],
      description: 'Ultra-thin laptop with M3 chip, all-day battery life, and Liquid Retina display',
      isActive: true,
      isFeatured: false,
      dateAdded: new Date('2024-01-05'),
      lastUpdated: new Date('2024-01-15')
    }
  ] as ProductSearchResult[],

  searchResults: [
    {
      id: '1',
      name: 'iPhone 15 Pro Max 256GB Natural Titanium',
      sku: 'APL-IP15PM-256-NT',
      price: 159900,
      rating: 4.8,
      reviews: 2847,
      images: ['/api/placeholder/300/300'],
      category: 'Electronics > Mobile Phones',
      vendor: 'Apple Authorized',
      stock: 45,
      sold: 1289,
      tags: ['premium', 'flagship'],
      description: 'Latest iPhone with titanium build',
      isActive: true,
      isFeatured: true,
      dateAdded: new Date('2024-01-15'),
      lastUpdated: new Date('2024-01-20')
    }
  ] as ProductSearchResult[],

  searchStats: {
    totalSearches: 125847,
    avgSearchTime: 0.24,
    popularKeywords: [
      { keyword: 'iPhone', count: 15234, trend: 'up' as const },
      { keyword: 'Samsung', count: 12456, trend: 'stable' as const },
      { keyword: 'MacBook', count: 9876, trend: 'up' as const },
      { keyword: 'Gaming', count: 8765, trend: 'down' as const },
      { keyword: 'Headphones', count: 7654, trend: 'up' as const }
    ],
    searchSuccessRate: 87.5
  } as SearchStats,

  searchAnalytics: {
    totalQueries: 125847,
    uniqueSearchers: 45678,
    avgResultsPerQuery: 24.7,
    clickThroughRate: 12.8,
    conversionRate: 3.4,
    bounceRate: 34.6
  } as SearchAnalytics,

  searchTrends: [
    { date: '2024-01-01', searches: 4200, clicks: 540, conversions: 89 },
    { date: '2024-01-02', searches: 4580, clicks: 612, conversions: 102 },
    { date: '2024-01-03', searches: 3890, clicks: 467, conversions: 78 },
    { date: '2024-01-04', searches: 5234, clicks: 789, conversions: 134 },
    { date: '2024-01-05', searches: 4967, clicks: 645, conversions: 98 },
    { date: '2024-01-06', searches: 5678, clicks: 834, conversions: 156 },
    { date: '2024-01-07', searches: 4234, clicks: 523, conversions: 87 }
  ] as SearchTrend[],

  searchHistory: [
    {
      id: '1',
      query: 'iPhone 15 Pro Max',
      userId: 'user-123',
      userEmail: 'customer@example.com',
      timestamp: new Date('2024-01-20T10:30:00'),
      resultsCount: 12,
      clickedProduct: 'iPhone 15 Pro Max 256GB',
      converted: true,
      filters: {
        category: 'Electronics',
        priceRange: [100000, 200000] as [number, number],
        rating: 4,
        availability: 'in-stock',
        vendor: 'all'
      }
    },
    {
      id: '2',
      query: 'Samsung Galaxy S24',
      userId: 'user-456',
      userEmail: 'buyer@example.com',
      timestamp: new Date('2024-01-20T09:15:00'),
      resultsCount: 8,
      clickedProduct: 'Samsung Galaxy S24 Ultra',
      converted: false,
      filters: {
        category: 'all',
        priceRange: [0, 150000] as [number, number],
        rating: 0,
        availability: 'all',
        vendor: 'Samsung'
      }
    }
  ] as SearchHistoryItem[],

  popularSearches: [
    { keyword: 'iPhone 15', count: 15234, percentage: 12.1, trend: 'up' as const, trendPercentage: 15.2 },
    { keyword: 'Samsung S24', count: 12456, percentage: 9.9, trend: 'stable' as const, trendPercentage: 2.1 },
    { keyword: 'MacBook Air', count: 9876, percentage: 7.8, trend: 'up' as const, trendPercentage: 8.7 },
    { keyword: 'Gaming Laptop', count: 8765, percentage: 7.0, trend: 'down' as const, trendPercentage: -5.3 },
    { keyword: 'Wireless Headphones', count: 7654, percentage: 6.1, trend: 'up' as const, trendPercentage: 12.4 }
  ] as PopularSearch[],

  searchConfiguration: {
    enableAutoComplete: true,
    enableSearchSuggestions: true,
    enableSpellCheck: true,
    maxResults: 50,
    searchTimeout: 5000,
    enableFilters: true,
    defaultSortBy: 'relevance',
    enableVoiceSearch: true,
    enableImageSearch: false,
    searchWeights: {
      title: 0.4,
      description: 0.3,
      tags: 0.2,
      category: 0.1
    }
  } as SearchConfiguration
};
