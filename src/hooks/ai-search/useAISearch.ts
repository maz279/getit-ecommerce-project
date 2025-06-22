
import { useCallback, useEffect } from 'react';
import { useSearch } from '../useSearch';
import { useAISearchState } from './useAISearchState';
import { useAISearchOperations } from './useAISearchOperations';
import { UseAISearchReturn } from './types';

export const useAISearch = (): UseAISearchReturn => {
  const baseSearch = useSearch();
  
  const {
    aiSuggestions,
    personalizedRecommendations,
    queryAnalysis,
    isProcessingAI,
    aiError,
    setAISuggestions,
    setPersonalizedRecommendations,
    setQueryAnalysis,
    setIsProcessingAI,
    setAIError,
    clearAIState
  } = useAISearchState();

  const operations = useAISearchOperations({
    setAISuggestions,
    setPersonalizedRecommendations,
    setQueryAnalysis,
    setIsProcessingAI,
    setAIError
  });

  const clearResults = useCallback(() => {
    baseSearch.clearResults();
    clearAIState();
  }, [baseSearch, clearAIState]);

  return {
    // AI operations
    ...operations,

    // AI state
    aiSuggestions,
    personalizedRecommendations,
    queryAnalysis,
    isProcessingAI,
    aiError,

    // Base search functionality
    searchResults: baseSearch.searchResults,
    suggestions: baseSearch.suggestions,
    isLoading: baseSearch.isLoading || isProcessingAI,
    error: baseSearch.error || aiError,
    clearResults
  };
};
