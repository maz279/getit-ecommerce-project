
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VendorSearchHeader } from './vendorSearch/VendorSearchHeader';
import { VendorSearchStatsCards } from './vendorSearch/VendorSearchStatsCards';
import { VendorSearchFilters } from './vendorSearch/VendorSearchFilters';
import { VendorSearchResults } from './vendorSearch/VendorSearchResults';
import { AdvancedSearchTab } from './vendorSearch/AdvancedSearchTab';
import { SavedSearchesTab } from './vendorSearch/SavedSearchesTab';
import { SearchAnalyticsTab } from './vendorSearch/SearchAnalyticsTab';
import { BulkActionsTab } from './vendorSearch/BulkActionsTab';
import { mockVendorSearchStats, mockVendorSearchResults } from './vendorSearch/mockData';
import { VendorSearchFilter } from './vendorSearch/types';

export const VendorSearchContent: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState<VendorSearchFilter>({
    searchTerm: '',
    status: [],
    category: [],
    location: [],
    rating: { min: 0, max: 5 },
    salesVolume: { min: 0, max: 1000000 },
    joinDateRange: { start: '', end: '' },
    verificationStatus: [],
    performanceLevel: [],
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const [searchResults, setSearchResults] = useState(mockVendorSearchResults);

  const handleFilterChange = (newFilters: Partial<VendorSearchFilter>) => {
    setSearchFilters(prev => ({ ...prev, ...newFilters }));
    // In a real app, this would trigger an API call to search vendors
    console.log('Applying filters:', { ...searchFilters, ...newFilters });
  };

  return (
    <div className="space-y-6">
      <VendorSearchHeader />
      
      <VendorSearchStatsCards stats={mockVendorSearchStats} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <VendorSearchFilters
            filters={searchFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="results" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="results">Search Results</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Search</TabsTrigger>
              <TabsTrigger value="saved">Saved Searches</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-6">
              <VendorSearchResults
                results={searchResults}
                filters={searchFilters}
                onFilterChange={handleFilterChange}
              />
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <AdvancedSearchTab
                filters={searchFilters}
                onFilterChange={handleFilterChange}
              />
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
              <SavedSearchesTab />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <SearchAnalyticsTab />
            </TabsContent>

            <TabsContent value="bulk" className="space-y-6">
              <BulkActionsTab selectedVendors={[]} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
