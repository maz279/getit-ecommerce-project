
export interface ProductSearchResult {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  images: string[];
  category: string;
  vendor: string;
  stock: number;
  sold: number;
  tags: string[];
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  dateAdded: Date;
  lastUpdated: Date;
}

export interface SearchFilters {
  category: string;
  priceRange: [number, number];
  rating: number;
  availability: string;
  vendor: string;
  brand?: string;
  discount?: boolean;
  freeShipping?: boolean;
  inStock?: boolean;
}

export interface SearchStats {
  totalSearches: number;
  avgSearchTime: number;
  popularKeywords: Array<{
    keyword: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  searchSuccessRate: number;
}

export interface SearchAnalytics {
  totalQueries: number;
  uniqueSearchers: number;
  avgResultsPerQuery: number;
  clickThroughRate: number;
  conversionRate: number;
  bounceRate: number;
}

export interface SearchTrend {
  date: string;
  searches: number;
  clicks: number;
  conversions: number;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  userId?: string;
  userEmail?: string;
  timestamp: Date;
  resultsCount: number;
  clickedProduct?: string;
  converted: boolean;
  filters: SearchFilters;
}

export interface PopularSearch {
  keyword: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface SearchConfiguration {
  enableAutoComplete: boolean;
  enableSearchSuggestions: boolean;
  enableSpellCheck: boolean;
  maxResults: number;
  searchTimeout: number;
  enableFilters: boolean;
  defaultSortBy: string;
  enableVoiceSearch: boolean;
  enableImageSearch: boolean;
  searchWeights: {
    title: number;
    description: number;
    tags: number;
    category: number;
  };
}
