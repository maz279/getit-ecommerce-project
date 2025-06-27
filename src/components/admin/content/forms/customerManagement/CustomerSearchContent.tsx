
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerSearchHeader } from './customerSearch/CustomerSearchHeader';
import { CustomerSearchStatsCards } from './customerSearch/CustomerSearchStatsCards';
import { AdvancedSearchTab } from './customerSearch/AdvancedSearchTab';
import { SearchResultsTab } from './customerSearch/SearchResultsTab';
import { SearchAnalyticsTab } from './customerSearch/SearchAnalyticsTab';
import { SavedSearchesTab } from './customerSearch/SavedSearchesTab';
import { BulkActionsTab } from './customerSearch/BulkActionsTab';
import { customerSearchData, searchAnalyticsData } from './customerSearch/mockData';
import { CustomerSearchData, SearchFilter } from './customerSearch/types';

export const CustomerSearchContent: React.FC = () => {
  const [searchData, setSearchData] = useState<CustomerSearchData[]>(customerSearchData);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<SearchFilter[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = (query: string, filters: SearchFilter[]) => {
    console.log('Performing search:', { query, filters });
    setSearchQuery(query);
    setAppliedFilters(filters);
    
    // Add to search history
    if (query && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 9)]);
    }

    // Filter data based on query and filters
    let filteredData = customerSearchData;

    if (query) {
      filteredData = filteredData.filter(customer => 
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase()) ||
        customer.phone.includes(query) ||
        customer.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Apply additional filters
    filters.forEach(filter => {
      switch (filter.type) {
        case 'tier':
          filteredData = filteredData.filter(customer => 
            customer.tier.toLowerCase() === filter.value.toLowerCase()
          );
          break;
        case 'status':
          filteredData = filteredData.filter(customer => 
            customer.status.toLowerCase() === filter.value.toLowerCase()
          );
          break;
        case 'registrationDate':
          // Simple date filtering logic
          const filterDate = new Date(filter.value);
          filteredData = filteredData.filter(customer => 
            new Date(customer.registrationDate) >= filterDate
          );
          break;
        case 'orderCount':
          filteredData = filteredData.filter(customer => 
            customer.totalOrders >= parseInt(filter.value)
          );
          break;
        case 'lifetimeValue':
          filteredData = filteredData.filter(customer => 
            customer.lifetimeValue >= parseFloat(filter.value)
          );
          break;
      }
    });

    setSearchData(filteredData);
  };

  const handleCustomerSelect = (customerId: string, selected: boolean) => {
    if (selected) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log('Performing bulk action:', action, 'on customers:', selectedCustomers);
    // Here you would implement the actual bulk action logic
    setSelectedCustomers([]);
  };

  return (
    <div className="space-y-6">
      <CustomerSearchHeader 
        onSearch={handleSearch}
        searchHistory={searchHistory}
        totalResults={searchData.length}
      />

      <CustomerSearchStatsCards 
        customers={searchData}
        selectedCount={selectedCustomers.length}
      />

      <Tabs defaultValue="results" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="results">Search Results</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Search</TabsTrigger>
          <TabsTrigger value="analytics">Search Analytics</TabsTrigger>
          <TabsTrigger value="saved">Saved Searches</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <SearchResultsTab
            customers={searchData}
            selectedCustomers={selectedCustomers}
            onCustomerSelect={handleCustomerSelect}
            searchQuery={searchQuery}
            appliedFilters={appliedFilters}
          />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedSearchTab
            onSearch={handleSearch}
            appliedFilters={appliedFilters}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <SearchAnalyticsTab
            analyticsData={searchAnalyticsData}
            searchHistory={searchHistory}
          />
        </TabsContent>

        <TabsContent value="saved">
          <SavedSearchesTab
            onLoadSearch={handleSearch}
          />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkActionsTab
            selectedCustomers={selectedCustomers}
            onBulkAction={handleBulkAction}
            customers={searchData.filter(c => selectedCustomers.includes(c.id))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
