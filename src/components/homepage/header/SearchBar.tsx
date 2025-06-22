
import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, X, Globe } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { SearchResults } from './SearchResults';
import { VoiceSearch } from './VoiceSearch';
import { ImageSearch } from './ImageSearch';
import { SearchFilters } from './SearchFilters';

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
      placeholder: "Search products, brands, vendors... (Type in English or বাংলা)",
      trending: "Trending:",
      trendingSearches: ['Mobile', 'Fashion', 'Electronics', 'Groceries', 'Books'],
      filters: "Filters",
      voiceSearch: "Voice Search",
      imageSearch: "Image Search",
      qrSearch: "QR Search",
      clearSearch: "Clear Search",
      searchIn: "Search in:",
      bengali: "বাংলা",
      english: "English",
      suggestions: "Suggestions",
      noResults: "No results found",
      searchFailed: "Search failed. Please try again."
    },
    BD: {
      placeholder: "পণ্য, ব্র্যান্ড, বিক্রেতা খুঁজুন... (ইংরেজি বা বাংলায় লিখুন)",
      trending: "ট্রেন্ডিং:",
      trendingSearches: ['মোবাইল', 'ফ্যাশন', 'ইলেকট্রনিক্স', 'মুদি', 'বই'],
      filters: "ফিল্টার",
      voiceSearch: "ভয়েস সার্চ",
      imageSearch: "ইমেজ সার্চ",
      qrSearch: "কিউআর সার্চ",
      clearSearch: "সার্চ মুছুন",
      searchIn: "যেখানে খুঁজবেন:",
      bengali: "বাংলা",
      english: "English",
      suggestions: "সাজেশন",
      noResults: "কোন ফলাফল পাওয়া যায়নি",
      searchFailed: "সার্চ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"
    }
  };

  const currentContent = content[language as keyof typeof content];

  // Handle input change with suggestions
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      // Get suggestions
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

  // Handle result click
  const handleResultClick = (result: any) => {
    console.log('Selected result:', result);
    setShowResults(false);
    setShowSuggestions(false);
    // Navigate to result page based on type
    if (result.type === 'product') {
      // Navigate to product details
    } else if (result.type === 'vendor') {
      // Navigate to vendor store
    } else if (result.type === 'brand') {
      // Navigate to brand page
    } else if (result.type === 'category') {
      // Navigate to category page
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
      <div className="hidden md:flex flex-1 max-w-4xl flex-col" ref={searchRef}>
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg overflow-visible w-full relative">
          <div className="flex items-center">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder={currentContent.placeholder}
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 text-sm focus:outline-none pr-8"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={currentContent.clearSearch}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-1 px-3 border-l border-gray-200">
              {/* Language Toggle for Voice Search */}
              <button
                type="button"
                onClick={() => setVoiceLanguage(voiceLanguage === 'bn' ? 'en' : 'bn')}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 text-xs"
                title={`${currentContent.searchIn} ${voiceLanguage === 'bn' ? currentContent.bengali : currentContent.english}`}
              >
                <Globe className="w-3 h-3" />
              </button>

              <VoiceSearch 
                onVoiceSearch={handleVoiceSearch}
                isLoading={isLoading}
                language={voiceLanguage}
              />
              
              <ImageSearch
                onImageSearch={handleImageSearch}
                onQRSearch={handleQRSearch}
                isLoading={isLoading}
                type="image"
              />
              
              <ImageSearch
                onImageSearch={handleImageSearch}
                onQRSearch={handleQRSearch}
                isLoading={isLoading}
                type="qr"
              />
              
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600"
                title={currentContent.filters}
              >
                <Filter className="w-4 h-4" />
              </button>
              
              <button 
                type="submit"
                className="bg-gradient-to-r from-orange-400 to-yellow-400 p-2 rounded-r-lg hover:from-orange-500 hover:to-yellow-500 transition-all"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          
          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs text-gray-500 mb-2">{currentContent.suggestions}</div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
                  >
                    <Search className="w-3 h-3 inline mr-2 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Search Results */}
          {showResults && (
            <SearchResults
              results={searchResults}
              isLoading={isLoading}
              error={error}
              onResultClick={handleResultClick}
              language={language}
            />
          )}

          {/* Search Filters */}
          {showFilters && (
            <SearchFilters
              onApply={handleFiltersApply}
              onClose={() => setShowFilters(false)}
              language={language}
            />
          )}
        </form>
        
        {/* Trending Searches */}
        <div className="mt-2 flex items-center gap-2 text-xs text-white flex-wrap">
          <span className="whitespace-nowrap">{currentContent.trending}</span>
          {currentContent.trendingSearches.map((search) => (
            <button 
              key={search}
              onClick={() => handleTrendingClick(search)}
              className="bg-white bg-opacity-20 px-2 py-1 rounded-full hover:bg-opacity-30 transition-all whitespace-nowrap"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="md:hidden mt-3 px-2" ref={searchRef}>
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg overflow-visible w-full relative">
            <div className="flex items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={currentContent.placeholder}
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full px-3 py-2 text-sm focus:outline-none pr-8"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-1 px-2">
                <button
                  type="button"
                  onClick={() => setVoiceLanguage(voiceLanguage === 'bn' ? 'en' : 'bn')}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 text-xs"
                >
                  <Globe className="w-3 h-3" />
                </button>

                <VoiceSearch 
                  onVoiceSearch={handleVoiceSearch}
                  isLoading={isLoading}
                  language={voiceLanguage}
                />
                
                <ImageSearch
                  onImageSearch={handleImageSearch}
                  onQRSearch={handleQRSearch}
                  isLoading={isLoading}
                  type="image"
                />
                
                <ImageSearch
                  onImageSearch={handleImageSearch}
                  onQRSearch={handleQRSearch}
                  isLoading={isLoading}
                  type="qr"
                />
                
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600"
                >
                  <Filter className="w-3 h-3" />
                </button>
                
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-orange-400 to-yellow-400 p-2 rounded-r-lg"
                >
                  <Search className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
            
            {/* Mobile Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                <div className="p-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-2 py-1.5 hover:bg-gray-50 rounded text-sm"
                    >
                      <Search className="w-3 h-3 inline mr-2 text-gray-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Mobile Search Results */}
            {showResults && (
              <SearchResults
                results={searchResults}
                isLoading={isLoading}
                error={error}
                onResultClick={handleResultClick}
                language={language}
              />
            )}

            {/* Mobile Search Filters */}
            {showFilters && (
              <SearchFilters
                onApply={handleFiltersApply}
                onClose={() => setShowFilters(false)}
                language={language}
              />
            )}
          </form>
        </div>
      )}
    </>
  );
};
