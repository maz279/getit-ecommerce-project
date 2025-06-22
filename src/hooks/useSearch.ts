
import { useState, useCallback } from 'react';
import { searchService, SearchResult } from '@/services/searchService';

export interface UseSearchReturn {
  searchResults: SearchResult[];
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  searchText: (query: string, filters?: any) => Promise<void>;
  searchVoice: (audioBlob: Blob, language: 'bn' | 'en') => Promise<void>;
  searchImage: (imageFile: File) => Promise<void>;
  getSuggestions: (query: string) => Promise<string[]>;
  clearResults: () => void;
  applyFilters?: (filters: any) => void;
  addToIndex: (item: SearchResult) => void;
  refreshIndex: () => void;
}

export const useSearch = (): UseSearchReturn => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchText = useCallback(async (query: string, filters?: any) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Searching for:', query);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const results = searchService.search(query, 20);
      
      // Apply filters if provided
      let filteredResults = results;
      if (filters) {
        filteredResults = results.filter(result => {
          if (filters.category && result.category !== filters.category) return false;
          if (filters.type && result.type !== filters.type) return false;
          if (filters.priceMin && result.price && result.price < filters.priceMin) return false;
          if (filters.priceMax && result.price && result.price > filters.priceMax) return false;
          if (filters.brand && result.brand !== filters.brand) return false;
          return true;
        });
      }
      
      setSearchResults(filteredResults);
      console.log('Search results:', filteredResults.length);
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchVoice = useCallback(async (audioBlob: Blob, language: 'bn' | 'en') => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Processing voice search...');
      
      // Simulate voice processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock voice recognition result
      const mockResults = ['samsung phone', 'nike shoes', 'laptop'][Math.floor(Math.random() * 3)];
      await searchText(mockResults);
      
    } catch (err) {
      console.error('Voice search error:', err);
      setError('Voice search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchText]);

  const searchImage = useCallback(async (imageFile: File) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Processing image search...');
      
      // Simulate image processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock image recognition result
      const mockResults = ['smartphone', 'shoes', 'clothing'][Math.floor(Math.random() * 3)];
      await searchText(mockResults);
      
    } catch (err) {
      console.error('Image search error:', err);
      setError('Image search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchText]);

  const getSuggestions = useCallback(async (query: string): Promise<string[]> => {
    if (!query.trim()) {
      setSuggestions([]);
      return [];
    }

    try {
      const newSuggestions = searchService.getSuggestions(query, 8);
      setSuggestions(newSuggestions);
      return newSuggestions;
    } catch (err) {
      console.error('Suggestions error:', err);
      return [];
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setSuggestions([]);
    setError(null);
  }, []);

  const applyFilters = useCallback((filters: any) => {
    console.log('Applying filters:', filters);
    // This would be implemented based on current search query
  }, []);

  // New functionality for automatic indexing
  const addToIndex = useCallback((item: SearchResult) => {
    console.log('Adding item to search index:', item);
    searchService.addToIndex(item);
  }, []);

  const refreshIndex = useCallback(() => {
    console.log('Refreshing search index');
    searchService.refreshIndex();
  }, []);

  return {
    searchResults,
    suggestions,
    isLoading,
    error,
    searchText,
    searchVoice,
    searchImage,
    getSuggestions,
    clearResults,
    applyFilters,
    addToIndex,
    refreshIndex
  };
};
