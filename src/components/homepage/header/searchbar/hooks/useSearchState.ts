
import { useState, useEffect, useRef } from 'react';
import { useAISearch } from '@/hooks/useAISearch';
import { getPageSuggestions } from '../utils';

interface UseSearchStateProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAIMode?: boolean;
}

export const useSearchState = ({
  searchQuery,
  setSearchQuery,
  isAIMode = true
}: UseSearchStateProps) => {
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState<'bn' | 'en'>('bn');
  const [pageSuggestions, setPageSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const aiSearch = useAISearch();

  // Load personalized recommendations on component mount
  useEffect(() => {
    if (isAIMode) {
      aiSearch.getPersonalizedRecommendations().catch(console.error);
    }
  }, [isAIMode, aiSearch]);

  // Enhanced input change handler with AI suggestions
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      // Get page suggestions (existing functionality)
      const pageMatches = getPageSuggestions(value);
      setPageSuggestions(pageMatches);
      
      if (isAIMode) {
        // Get AI-powered smart suggestions
        try {
          await aiSearch.getAISuggestions(value);
          console.log('AI suggestions generated for:', value);
        } catch (error) {
          console.error('AI suggestions failed:', error);
        }
        
        // Analyze query in real-time for better UX
        if (value.length > 3) {
          try {
            await aiSearch.analyzeQuery(value);
            console.log('Real-time query analysis completed');
          } catch (error) {
            console.error('Query analysis failed:', error);
          }
        }
      }
      
      setShowSuggestions(true);
      setShowResults(false);
    } else {
      aiSearch.clearResults();
      setPageSuggestions([]);
      setShowSuggestions(false);
      setShowResults(false);
    }
  };

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowSuggestions(false);
        setShowFilters(false);
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
    setPageSuggestions,
    searchRef,
    inputRef,
    aiSearch,
    handleInputChange
  };
};
