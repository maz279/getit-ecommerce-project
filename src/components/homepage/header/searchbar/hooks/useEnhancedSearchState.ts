
import { useState, useRef, useCallback } from 'react';
import { useEnhancedSearch } from '@/hooks/useEnhancedSearch';
import { useNavigationMapper } from '@/utils/navigationMapper';

export const useEnhancedSearchState = (searchQuery: string, setSearchQuery: (query: string) => void) => {
  const [showResults, setShowResults] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState<'bn' | 'en'>('en');
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const enhancedSearch = useEnhancedSearch();
  const { navigateToResult } = useNavigationMapper();

  // Enhanced input change handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      enhancedSearch.getContextualSuggestions(value);
      setShowSuggestions(true);
      setShowResults(false);
    } else {
      setShowSuggestions(false);
      setShowResults(false);
      enhancedSearch.clearResults();
    }
  }, [setSearchQuery, enhancedSearch]);

  // Enhanced search handler
  const handleSearch = useCallback(async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm.trim()) {
      await enhancedSearch.searchWithNavigation(searchTerm);
      setShowResults(true);
      setShowSuggestions(false);
    }
  }, [searchQuery, enhancedSearch]);

  // Result click handler with navigation
  const handleResultClick = useCallback((result: any) => {
    const navigationResult = navigateToResult(result);
    if (navigationResult.success) {
      setShowResults(false);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  }, [navigateToResult, setSearchQuery]);

  return {
    showResults,
    setShowResults,
    showSuggestions,
    setShowSuggestions,
    showFilters,
    setShowFilters,
    voiceLanguage,
    setVoiceLanguage,
    searchRef,
    inputRef,
    enhancedSearch,
    handleInputChange,
    handleSearch,
    handleResultClick
  };
};
