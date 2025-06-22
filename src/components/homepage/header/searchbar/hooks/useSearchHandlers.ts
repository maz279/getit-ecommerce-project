
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseAISearchReturn } from '@/hooks/useAISearch';
import { getDirectPageMatch, isConversationalQuery } from '../utils';
import { PAGE_NAVIGATION_MAP } from '../constants';

interface UseSearchHandlersProps {
  aiSearch: UseAISearchReturn;
  isAIMode: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
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
  const navigate = useNavigate();

  const handleSearch = useCallback(async (e?: React.FormEvent, query?: string) => {
    if (e) e.preventDefault();
    const searchQuery = query || inputRef.current?.value || '';
    
    if (searchQuery.trim()) {
      // First check if it's a direct page match
      const directPageMatch = getDirectPageMatch(searchQuery);
      if (directPageMatch) {
        navigate(directPageMatch);
        setShowSuggestions(false);
        setShowResults(false);
        return;
      }
      
      // Check if it's a conversational query
      const isConversational = isConversationalQuery(searchQuery);
      
      if (isAIMode) {
        try {
          if (isConversational) {
            console.log('Processing conversational query with AI');
            await aiSearch.processConversationalQuery(searchQuery);
          } else {
            console.log('Processing search with AI');
            await aiSearch.searchWithAI(searchQuery);
          }
        } catch (error) {
          console.error('AI search failed, falling back to basic search');
        }
      }
      
      setShowResults(true);
      setShowSuggestions(false);
      setSearchQuery(searchQuery);
    }
  }, [aiSearch, isAIMode, inputRef, navigate, setShowSuggestions, setShowResults, setSearchQuery]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    // Check if it's a page suggestion
    const pageMatch = PAGE_NAVIGATION_MAP[suggestion.toLowerCase() as keyof typeof PAGE_NAVIGATION_MAP];
    if (pageMatch) {
      navigate(pageMatch);
      setShowSuggestions(false);
      setShowResults(false);
      setSearchQuery('');
      return;
    }
    
    // Regular search suggestion
    setSearchQuery(suggestion);
    handleSearch(undefined, suggestion);
    setShowSuggestions(false);
  }, [navigate, setShowSuggestions, setShowResults, setSearchQuery, handleSearch]);

  const handlePageNavigation = useCallback((pageName: string) => {
    const route = PAGE_NAVIGATION_MAP[pageName.toLowerCase() as keyof typeof PAGE_NAVIGATION_MAP];
    if (route) {
      navigate(route);
      setShowSuggestions(false);
      setShowResults(false);
      setSearchQuery('');
    }
  }, [navigate, setShowSuggestions, setShowResults, setSearchQuery]);

  const handleResultClick = useCallback((result: any) => {
    console.log('Selected result:', result);
    setShowResults(false);
    setShowSuggestions(false);
    
    // Navigate based on result type
    switch (result.type) {
      case 'product':
        navigate(`/product/${result.id}`, { state: { product: result } });
        break;
      case 'vendor':
        navigate(`/vendor/${result.id}`, { state: { vendor: result } });
        break;
      case 'category':
        navigate(`/categories/${result.category?.toLowerCase() || result.title.toLowerCase()}`);
        break;
      case 'brand':
        navigate(`/brands/${result.brand?.toLowerCase() || result.title.toLowerCase()}`);
        break;
      default:
        navigate(`/search?q=${encodeURIComponent(result.title)}&type=${result.type}`);
    }
  }, [navigate, setShowResults, setShowSuggestions]);

  const handleTrendingClick = useCallback((search: string) => {
    setSearchQuery(search);
    handleSearch(undefined, search);
  }, [setSearchQuery, handleSearch]);

  return {
    handleSearch,
    handleSuggestionClick,
    handlePageNavigation,
    handleResultClick,
    handleTrendingClick
  };
};
