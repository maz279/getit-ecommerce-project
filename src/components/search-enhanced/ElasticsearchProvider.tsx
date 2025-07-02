import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchFilters {
  category?: string;
  priceRange?: { min: number; max: number };
  location?: string;
  vendor?: string;
  rating?: number;
  availability?: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  vendor_id: string;
  rating: number;
  availability: boolean;
  score: number;
}

interface SearchState {
  query: string;
  filters: SearchFilters;
  results: SearchResult[];
  suggestions: string[];
  isLoading: boolean;
  totalResults: number;
  facets: Record<string, any[]>;
}

interface ElasticsearchContextType {
  searchState: SearchState;
  search: (query: string, filters?: SearchFilters) => Promise<void>;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  clearSearch: () => void;
  getSuggestions: (partialQuery: string) => Promise<string[]>;
  getPopularSearches: () => Promise<string[]>;
}

const ElasticsearchContext = createContext<ElasticsearchContextType | undefined>(undefined);

export const useElasticsearch = () => {
  const context = useContext(ElasticsearchContext);
  if (!context) {
    throw new Error('useElasticsearch must be used within an ElasticsearchProvider');
  }
  return context;
};

interface ElasticsearchProviderProps {
  children: ReactNode;
}

export const ElasticsearchProvider: React.FC<ElasticsearchProviderProps> = ({ children }) => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    filters: {},
    results: [],
    suggestions: [],
    isLoading: false,
    totalResults: 0,
    facets: {}
  });

  const search = async (query: string, filters: SearchFilters = {}) => {
    setSearchState(prev => ({ ...prev, isLoading: true, query, filters }));

    try {
      // Call our elasticsearch edge function
      const response = await supabase.functions.invoke('elasticsearch-search', {
        body: {
          action: 'search',
          data: {
            query,
            filters,
            size: 20,
            from: 0,
            include_facets: true
          }
        }
      });

      if (response.error) throw response.error;

      const { results, total, facets, suggestions } = response.data;

      setSearchState(prev => ({
        ...prev,
        results: results || [],
        totalResults: total || 0,
        facets: facets || {},
        suggestions: suggestions || [],
        isLoading: false
      }));

      // Log search for analytics
      await logSearchQuery(query, filters, total || 0);

    } catch (error) {
      console.error('Search failed:', error);
      setSearchState(prev => ({ 
        ...prev, 
        isLoading: false,
        results: [],
        totalResults: 0
      }));
    }
  };

  const updateFilters = async (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...searchState.filters, ...newFilters };
    if (searchState.query) {
      await search(searchState.query, updatedFilters);
    } else {
      setSearchState(prev => ({ ...prev, filters: updatedFilters }));
    }
  };

  const clearSearch = () => {
    setSearchState({
      query: '',
      filters: {},
      results: [],
      suggestions: [],
      isLoading: false,
      totalResults: 0,
      facets: {}
    });
  };

  const getSuggestions = async (partialQuery: string): Promise<string[]> => {
    if (!partialQuery || partialQuery.length < 2) return [];

    try {
      const response = await supabase.functions.invoke('elasticsearch-search', {
        body: {
          action: 'suggest',
          data: { query: partialQuery }
        }
      });

      if (response.error) throw response.error;
      return response.data.suggestions || [];
    } catch (error) {
      console.error('Suggestions failed:', error);
      return [];
    }
  };

  const getPopularSearches = async (): Promise<string[]> => {
    try {
      const response = await supabase.functions.invoke('elasticsearch-search', {
        body: {
          action: 'popular_searches',
          data: { limit: 10 }
        }
      });

      if (response.error) throw response.error;
      return response.data.popular_searches || [];
    } catch (error) {
      console.error('Popular searches failed:', error);
      return [];
    }
  };

  const logSearchQuery = async (query: string, filters: SearchFilters, resultCount: number) => {
    try {
      await supabase.from('search_queries').insert({
        query: query,
        results_count: resultCount,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });
    } catch (error) {
      console.error('Failed to log search query:', error);
    }
  };

  // Auto-complete functionality
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (searchState.query && searchState.query.length >= 2) {
        const suggestions = await getSuggestions(searchState.query);
        setSearchState(prev => ({ ...prev, suggestions }));
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchState.query]);

  const contextValue: ElasticsearchContextType = {
    searchState,
    search,
    updateFilters,
    clearSearch,
    getSuggestions,
    getPopularSearches
  };

  return (
    <ElasticsearchContext.Provider value={contextValue}>
      {children}
    </ElasticsearchContext.Provider>
  );
};