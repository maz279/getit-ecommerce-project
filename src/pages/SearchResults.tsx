
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { useSearch } from '@/hooks/useSearch';
import { SearchResults as SearchResultsComponent } from '@/components/homepage/header/SearchResults';
import { SearchFilters } from '@/components/homepage/header/SearchFilters';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || '';
  const [showFilters, setShowFilters] = useState(false);
  const [language] = useState('EN');

  const {
    searchResults,
    isLoading,
    error,
    searchText,
    applyFilters
  } = useSearch();

  useEffect(() => {
    if (query) {
      searchText(query);
    }
  }, [query, searchText]);

  const handleResultClick = (result: any) => {
    // This will be handled by the SearchResultsComponent
    console.log('Search result clicked:', result);
  };

  const handleFiltersApply = (filters: any) => {
    applyFilters(filters);
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Search Results for "{query}"
          </h1>
          {type && (
            <p className="text-gray-600">Type: {type}</p>
          )}
          
          <div className="flex items-center gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            
            {searchResults.length > 0 && (
              <span className="text-gray-600">
                {searchResults.length} results found
              </span>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="relative mb-6">
          {showFilters && (
            <SearchFilters
              onApply={handleFiltersApply}
              onClose={() => setShowFilters(false)}
              language={language}
            />
          )}
        </div>

        {/* Results */}
        <div className="relative">
          <SearchResultsComponent
            results={searchResults}
            isLoading={isLoading}
            error={error}
            onResultClick={handleResultClick}
            language={language}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
