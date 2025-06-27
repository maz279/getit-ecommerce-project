
export interface CustomerSearchData {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'VIP';
  registrationDate: string;
  lastActivity: string;
  totalOrders: number;
  lifetimeValue: number;
  averageOrderValue: number;
  location: {
    city: string;
    country: string;
    region: string;
  };
  preferences: {
    categories: string[];
    brands: string[];
    priceRange: { min: number; max: number };
  };
  tags: string[];
  notes: string;
  riskScore: number;
  satisfactionRating: number;
  referralCount: number;
  communicationPreference: string;
}

export interface SearchFilter {
  type: 'tier' | 'status' | 'registrationDate' | 'orderCount' | 'lifetimeValue' | 'location' | 'category' | 'brand' | 'communication';
  value: string;
  operator?: 'equals' | 'greater' | 'less' | 'contains' | 'between';
  label: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilter[];
  createdAt: string;
  lastUsed: string;
  resultCount: number;
}

export interface SearchAnalytics {
  totalSearches: number;
  averageResultsPerSearch: number;
  mostSearchedTerms: Array<{ term: string; count: number }>;
  searchTrends: Array<{ date: string; searches: number }>;
  filterUsage: Array<{ filter: string; usage: number }>;
  popularCategories: Array<{ category: string; searches: number }>;
}

export interface BulkActionHistory {
  id: string;
  action: string;
  customerCount: number;
  performedBy: string;
  performedAt: string;
  status: 'completed' | 'failed' | 'in_progress';
  details: string;
}
