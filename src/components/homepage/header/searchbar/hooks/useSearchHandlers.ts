
import { RefObject } from 'react';

interface UseSearchHandlersProps {
  aiSearch: any;
  isAIMode: boolean;
  inputRef: RefObject<HTMLInputElement>;
  setShowSuggestions: (show: boolean) => void;
  setShowResults: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useSearchHandlers = ({
  aiSearch,
  isAIMode,
  inputRef,
  setShowSuggestions,
  setShowResults,
  setSearchQuery
}: UseSearchHandlersProps) => {
  const handleSearch = async () => {
    if (isAIMode && aiSearch.searchQuery.trim()) {
      await aiSearch.performSearch();
      setShowSuggestions(false);
      setShowResults(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (isAIMode) {
      aiSearch.performSearch(suggestion);
      setShowResults(true);
    }
  };

  const handlePageNavigation = (path: string) => {
    window.location.href = path;
  };

  const handleResultClick = (result: any) => {
    console.log('Clicked result:', result);
    setShowResults(false);
  };

  const handleTrendingClick = (query: string) => {
    setSearchQuery(query);
    handleSearch();
  };

  return {
    handleSearch,
    handleSuggestionClick,
    handlePageNavigation,
    handleResultClick,
    handleTrendingClick
  };
};
