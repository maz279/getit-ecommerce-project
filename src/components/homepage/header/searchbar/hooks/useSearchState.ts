
import { useState, useRef, useEffect } from 'react';
import { useAISearch } from '@/hooks/useAISearch';

interface UseSearchStateProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAIMode: boolean;
}

export const useSearchState = ({ searchQuery, setSearchQuery, isAIMode }: UseSearchStateProps) => {
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState<'en' | 'bn'>('en');
  const [pageSuggestions] = useState([
    { title: 'Electronics', path: '/categories/electronics' },
    { title: 'Fashion', path: '/categories/fashion' },
    { title: 'Home & Garden', path: '/categories/home-garden' },
    { title: 'Books', path: '/categories/books' }
  ]);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Call useAISearch without arguments as it likely manages its own state internally
  const aiSearch = useAISearch();

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      setShowSuggestions(true);
      setShowResults(false);
    } else {
      setShowSuggestions(false);
      setShowResults(false);
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    showResults,
    setShowResults,
    showFilters,
    setShowFilters,
    showSuggestions,
    setShowSuggestions,
    voiceLanguage,
    setVoiceLanguage,
    pageSuggestions,
    searchRef,
    inputRef,
    aiSearch,
    handleInputChange
  };
};
