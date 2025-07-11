
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'category' | 'page' | 'vendor' | 'brand' | 'article';
  url: string;
  image?: string;
  category?: string;
  brand?: string;
  price?: number;
  rating?: number;
  tags?: string[];
  dateAdded?: Date;
  isActive?: boolean;
  // ML-related properties
  mlScore?: number;
  mlInsights?: {
    relevanceScore: number;
    recommendationReason: string;
    priceOptimal: boolean;
    trendingScore: number;
  };
}

export interface SearchIndexEntry extends SearchResult {
  searchableText: string;
  lastUpdated: Date;
}

export interface SearchServiceConfig {
  autoIndexInterval?: number;
  maxResults?: number;
}
