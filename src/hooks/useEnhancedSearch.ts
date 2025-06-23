
import { useState, useCallback } from 'react';
import { searchService } from '@/services/searchService';
import { SearchResult } from '@/services/search/types';

interface NavigationSuggestion {
  title: string;
  url: string;
  type: string;
  description?: string;
}

export interface UseEnhancedSearchReturn {
  searchResults: SearchResult[];
  navigationSuggestions: NavigationSuggestion[];
  searchSuggestions: string[];
  isLoading: boolean;
  error: string | null;
  searchWithNavigation: (query: string) => Promise<void>;
  getContextualSuggestions: (query: string) => Promise<void>;
  searchByType: (query: string, type: 'product' | 'category' | 'page' | 'vendor') => Promise<void>;
  clearResults: () => void;
}

export const useEnhancedSearch = (): UseEnhancedSearchReturn => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [navigationSuggestions, setNavigationSuggestions] = useState<NavigationSuggestion[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchWithNavigation = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setNavigationSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Enhanced search for:', query);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const { results, navigationSuggestions: navSuggestions } = searchService.searchWithNavigation(query, 20);
      
      setSearchResults(results);
      setNavigationSuggestions(navSuggestions);
      
      console.log('Enhanced search results:', results.length, 'Navigation suggestions:', navSuggestions.length);
      
    } catch (err) {
      console.error('Enhanced search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getContextualSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      setNavigationSuggestions([]);
      return;
    }

    try {
      const { searchSuggestions: suggestions, navigationSuggestions: navSuggestions } = 
        searchService.getContextualSuggestions(query);
      
      setSearchSuggestions(suggestions);
      setNavigationSuggestions(navSuggestions);
      
    } catch (err) {
      console.error('Suggestions error:', err);
    }
  }, []);

  const searchByType = useCallback(async (query: string, type: 'product' | 'category' | 'page' | 'vendor') => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const results = searchService.searchByType(query, type, 15);
      setSearchResults(results);
      
    } catch (err) {
      console.error('Type search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setNavigationSuggestions([]);
    setSearchSuggestions([]);
    setError(null);
  }, []);

  return {
    searchResults,
    navigationSuggestions,
    searchSuggestions,
    isLoading,
    error,
    searchWithNavigation,
    getContextualSuggestions,
    searchByType,
    clearResults
  };
};
