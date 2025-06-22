
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/hooks/useSearch';
import { DesktopSearchBar } from './DesktopSearchBar';
import { MobileSearchBar } from './MobileSearchBar';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showMobileSearch: boolean;
  setShowMobileSearch: (show: boolean) => void;
  language: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  showMobileSearch,
  setShowMobileSearch,
  language
}) => {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState<'bn' | 'en'>('bn');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    searchResults,
    suggestions,
    isLoading,
    error,
    searchText,
    searchVoice,
    searchImage,
    searchQR,
    getSuggestions,
    clearResults,
    applyFilters
  } = useSearch();

  const content = {
    EN: {
      voiceSearch: "Voice Search",
      trendingSearches: ['Mobile', 'Fashion', 'Electronics', 'Groceries', 'Books']
    },
    BD: {
      voiceSearch: "ভয়েস সার্চ",
      trendingSearches: ['মোবাইল', 'ফ্যাশন', 'ইলেকট্রনিক্স', 'মুদি', 'বই']
    }
  };

  const currentContent = content[language as keyof typeof content];

  // Handle input change with suggestions
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      await getSuggestions(value);
      setShowSuggestions(true);
      setShowResults(false);
    } else {
      clearResults();
      setShowSuggestions(false);
      setShowResults(false);
    }
  };

  // Handle search submit
  const handleSearch = async (e?: React.FormEvent, query?: string) => {
    if (e) e.preventDefault();
    const searchQuery = query || inputRef.current?.value || '';
    
    if (searchQuery.trim()) {
      await searchText(searchQuery);
      setShowResults(true);
      setShowSuggestions(false);
      setSearchQuery(searchQuery);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(undefined, suggestion);
    setShowSuggestions(false);
  };

  // Handle trending search click
  const handleTrendingClick = (search: string) => {
    setSearchQuery(search);
    handleSearch(undefined, search);
  };

  // Enhanced result click handler with proper navigation
  const handleResultClick = (result: any) => {
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
        // Fallback to search results page
        navigate(`/search?q=${encodeURIComponent(result.title)}&type=${result.type}`);
    }
  };

  // Handle voice search
  const handleVoiceSearch = async (audioBlob: Blob) => {
    try {
      await searchVoice(audioBlob, voiceLanguage);
      setShowResults(true);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Voice search failed:', error);
    }
  };

  // Handle image search
  const handleImageSearch = async (file: File) => {
    try {
      await searchImage(file);
      setShowResults(true);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Image search failed:', error);
    }
  };

  // Handle QR search
  const handleQRSearch = async (file: File) => {
    try {
      await searchQR(file);
      setShowResults(true);
      setShowSuggestions(false);
    } catch (error) {
      console.error('QR search failed:', error);
    }
  };

  // Handle filters apply
  const handleFiltersApply = (filters: any) => {
    applyFilters(filters);
    setShowFilters(false);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    clearResults();
    setShowResults(false);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Toggle language
  const handleLanguageToggle = () => {
    setVoiceLanguage(voiceLanguage === 'bn' ? 'en' : 'bn');
  };

  // Toggle filters
  const handleFiltersToggle = () => {
    setShowFilters(!showFilters);
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

  return (
    <>
      {/* Mobile Search Button */}
      <button 
        onClick={() => setShowMobileSearch(!showMobileSearch)}
        className="md:hidden p-1.5 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
        aria-label={currentContent.voiceSearch}
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Desktop Search Bar */}
      <DesktopSearchBar
        searchQuery={searchQuery}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
        onClearSearch={handleClearSearch}
        inputRef={inputRef}
        searchRef={searchRef}
        voiceLanguage={voiceLanguage}
        onLanguageToggle={handleLanguageToggle}
        onVoiceSearch={handleVoiceSearch}
        onImageSearch={handleImageSearch}
        onQRSearch={handleQRSearch}
        showFilters={showFilters}
        onFiltersToggle={handleFiltersToggle}
        onFiltersApply={handleFiltersApply}
        showSuggestions={showSuggestions}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
        showResults={showResults}
        searchResults={searchResults}
        isLoading={isLoading}
        error={error}
        onResultClick={handleResultClick}
        trendingSearches={currentContent.trendingSearches}
        onTrendingClick={handleTrendingClick}
        language={language}
      />

      {/* Mobile Search Bar */}
      <MobileSearchBar
        showMobileSearch={showMobileSearch}
        searchQuery={searchQuery}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
        onClearSearch={handleClearSearch}
        searchRef={searchRef}
        voiceLanguage={voiceLanguage}
        onLanguageToggle={handleLanguageToggle}
        onVoiceSearch={handleVoiceSearch}
        onImageSearch={handleImageSearch}
        onQRSearch={handleQRSearch}
        showFilters={showFilters}
        onFiltersToggle={handleFiltersToggle}
        onFiltersApply={handleFiltersApply}
        showSuggestions={showSuggestions}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
        showResults={showResults}
        searchResults={searchResults}
        isLoading={isLoading}
        error={error}
        onResultClick={handleResultClick}
        language={language}
      />
    </>
  );
};
