
export interface VendorSearchResult {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  status: 'active' | 'suspended' | 'pending' | 'inactive';
  verificationStatus: 'verified' | 'pending' | 'rejected' | 'unverified';
  performanceLevel: 'excellent' | 'good' | 'average' | 'poor';
  rating: number;
  totalSales: number;
  totalOrders: number;
  joinDate: string;
  lastActivity: string;
  profileCompleteness: number;
  documents: {
    tradeLicense: boolean;
    taxCertificate: boolean;
    bankStatement: boolean;
    identityProof: boolean;
  };
  products: {
    total: number;
    active: number;
    featured: number;
  };
  compliance: {
    score: number;
    issues: number;
    lastAudit: string;
  };
  tags: string[];
  notes: string;
}

export interface VendorSearchFilter {
  searchTerm: string;
  status: string[];
  category: string[];
  location: string[];
  rating: {
    min: number;
    max: number;
  };
  salesVolume: {
    min: number;
    max: number;
  };
  joinDateRange: {
    start: string;
    end: string;
  };
  verificationStatus: string[];
  performanceLevel: string[];
  sortBy: 'relevance' | 'name' | 'rating' | 'sales' | 'joinDate' | 'lastActivity';
  sortOrder: 'asc' | 'desc';
}

export interface VendorSearchStats {
  totalVendors: number;
  activeVendors: number;
  verifiedVendors: number;
  pendingApplications: number;
  suspendedVendors: number;
  newThisMonth: number;
  averageRating: number;
  totalSalesVolume: number;
  searchesThisMonth: number;
  topCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
}

export interface SavedSearch {
  id: string;
  name: string;
  description: string;
  filters: VendorSearchFilter;
  createdAt: string;
  lastUsed: string;
  frequency: number;
  isShared: boolean;
  results: number;
}

export interface SearchAnalytics {
  totalSearches: number;
  averageResultsPerSearch: number;
  topSearchTerms: Array<{
    term: string;
    count: number;
    successRate: number;
  }>;
  filterUsage: Array<{
    filter: string;
    usage: number;
    percentage: number;
  }>;
  searchTrends: Array<{
    date: string;
    searches: number;
    results: number;
  }>;
}
