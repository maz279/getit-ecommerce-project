
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductSearchHeader } from './productSearch/ProductSearchHeader';
import { SearchStatsCards } from './productSearch/SearchStatsCards';
import { AdvancedSearchTab } from './productSearch/AdvancedSearchTab';
import { SearchAnalyticsTab } from './productSearch/SearchAnalyticsTab';
import { SearchHistoryTab } from './productSearch/SearchHistoryTab';
import { SearchConfigurationTab } from './productSearch/SearchConfigurationTab';
import { mockProductSearchData } from './productSearch/mockData';
import { SearchFilters } from './productSearch/types';

export const ProductSearchContent: React.FC = () => {
  const [searchResults, setSearchResults] = useState(mockProductSearchData.searchResults);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    priceRange: [0, 100000] as [number, number],
    rating: 0,
    availability: 'all',
    vendor: 'all'
  });

  const handleSearch = (query: string, newFilters?: SearchFilters) => {
    setSearchQuery(query);
    if (newFilters) {
      setFilters(newFilters);
    }
    // Simulate search functionality
    console.log('Searching for:', query, 'with filters:', newFilters || filters);
  };

  return (
    <div className="space-y-6">
      <ProductSearchHeader />
      
      <SearchStatsCards stats={mockProductSearchData.searchStats} />

      <Tabs defaultValue="advanced-search" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="advanced-search">🔍 Advanced Search</TabsTrigger>
          <TabsTrigger value="analytics">📊 Search Analytics</TabsTrigger>
          <TabsTrigger value="history">📝 Search History</TabsTrigger>
          <TabsTrigger value="configuration">⚙️ Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="advanced-search" className="mt-6">
          <AdvancedSearchTab 
            products={mockProductSearchData.products}
            searchResults={searchResults}
            onSearch={handleSearch}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <SearchAnalyticsTab 
            analytics={mockProductSearchData.searchAnalytics}
            trends={mockProductSearchData.searchTrends}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <SearchHistoryTab 
            searchHistory={mockProductSearchData.searchHistory}
            popularSearches={mockProductSearchData.popularSearches}
          />
        </TabsContent>

        <TabsContent value="configuration" className="mt-6">
          <SearchConfigurationTab 
            configuration={mockProductSearchData.searchConfiguration}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
