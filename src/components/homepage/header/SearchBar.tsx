
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { SearchResults } from './SearchResults';
import { VoiceSearch } from './VoiceSearch';
import { ImageSearch } from './ImageSearch';

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
  const searchRef = useRef<HTMLDivElement>(null);
  
  const {
    searchResults,
    isLoading,
    error,
    searchText,
    searchVoice,
    searchImage,
    searchQR,
    clearResults
  } = useSearch();

  const content = {
    EN: {
      placeholder: "Search products, brands, vendors...",
      trending: "Trending:",
      trendingSearches: ['Mobile', 'Fashion', 'Electronics', 'Groceries']
    },
    BD: {
      placeholder: "পণ্য, ব্র্যান্ড, বিক্রেতা খুঁজুন...",
      trending: "ট্রেন্ডিং:",
      trendingSearches: ['মোবাইল', 'ফ্যাশন', 'ইলেকট্রনিক্স', 'মুদি']
    }
  };

  const currentContent = content[language as keyof typeof content];

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      searchText(value);
      setShowResults(true);
    } else {
      clearResults();
      setShowResults(false);
    }
  };

  // Handle search submit
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      searchText(searchQuery);
      setShowResults(true);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle trending search click
  const handleTrendingClick = (search: string) => {
    setSearchQuery(search);
    searchText(search);
    setShowResults(true);
  };

  // Handle result click
  const handleResultClick = (result: any) => {
    console.log('Selected result:', result);
    setShowResults(false);
    // Here you would typically navigate to the result page
  };

  // Handle voice search
  const handleVoiceSearch = async (audioBlob: Blob) => {
    try {
      await searchVoice(audioBlob);
      setShowResults(true);
    } catch (error) {
      console.error('Voice search failed:', error);
    }
  };

  // Handle image search
  const handleImageSearch = async (file: File) => {
    try {
      await searchImage(file);
      setShowResults(true);
    } catch (error) {
      console.error('Image search failed:', error);
    }
  };

  // Handle QR search
  const handleQRSearch = async (file: File) => {
    try {
      await searchQR(file);
      setShowResults(true);
    } catch (error) {
      console.error('QR search failed:', error);
    }
  };

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
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
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Desktop Search Bar */}
      <div className="hidden md:flex flex-1 max-w-3xl flex-col" ref={searchRef}>
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg overflow-hidden w-full relative">
          <div className="flex items-center">
            <input
              type="text"
              placeholder={currentContent.placeholder}
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-3 text-sm focus:outline-none"
            />
            <div className="flex items-center gap-2 px-3">
              <VoiceSearch 
                onVoiceSearch={handleVoiceSearch}
                isLoading={isLoading}
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
                type="submit"
                className="bg-gradient-to-r from-orange-400 to-yellow-400 p-2 rounded-r-lg hover:from-orange-500 hover:to-yellow-500 transition-all"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          
          {/* Search Results */}
          {showResults && (
            <SearchResults
              results={searchResults}
              isLoading={isLoading}
              error={error}
              onResultClick={handleResultClick}
            />
          )}
        </form>
        
        {/* Trending Searches */}
        <div className="mt-2 flex items-center gap-2 text-xs text-white">
          <span>{currentContent.trending}</span>
          {currentContent.trendingSearches.map((search) => (
            <button 
              key={search}
              onClick={() => handleTrendingClick(search)}
              className="bg-white bg-opacity-20 px-2 py-1 rounded-full hover:bg-opacity-30 transition-all"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="md:hidden mt-3 px-2" ref={searchRef}>
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg overflow-hidden w-full relative">
            <div className="flex items-center">
              <input
                type="text"
                placeholder={currentContent.placeholder}
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
              />
              <div className="flex items-center gap-1 px-2">
                <VoiceSearch 
                  onVoiceSearch={handleVoiceSearch}
                  isLoading={isLoading}
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
                  type="submit"
                  className="bg-gradient-to-r from-orange-400 to-yellow-400 p-2 rounded-r-lg"
                >
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            
            {/* Mobile Search Results */}
            {showResults && (
              <SearchResults
                results={searchResults}
                isLoading={isLoading}
                error={error}
                onResultClick={handleResultClick}
              />
            )}
          </form>
        </div>
      )}
    </>
  );
};
