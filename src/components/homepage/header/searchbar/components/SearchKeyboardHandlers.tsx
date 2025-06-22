
import { useCallback } from 'react';

interface SearchKeyboardHandlersProps {
  onSearch: () => void;
  setShowResults: (show: boolean) => void;
  setShowSuggestions: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
  aiSearch: any;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const useSearchKeyboardHandlers = ({
  onSearch,
  setShowResults,
  setShowSuggestions,
  setSearchQuery,
  aiSearch,
  inputRef
}: SearchKeyboardHandlersProps) => {
  
  // Handle Enter key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setShowSuggestions(false);
    }
  }, [onSearch, setShowResults, setShowSuggestions]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    aiSearch.clearResults();
    setShowResults(false);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [setSearchQuery, aiSearch, setShowResults, setShowSuggestions, inputRef]);

  return {
    handleKeyPress,
    handleClearSearch
  };
};
