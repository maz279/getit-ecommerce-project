import React, { useEffect } from 'react';
import { Search } from 'lucide-react';
import { DesktopSearchBar } from '../DesktopSearchBar';
import { MobileSearchBar } from '../MobileSearchBar';
import { useSearchState } from './hooks/useSearchState';
import { useSearchHandlers } from './hooks/useSearchHandlers';
import { useSearchIndexing } from '@/hooks/useSearchIndexing';
import { SEARCH_CONTENT } from './constants';

interface SearchBarContainerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showMobileSearch: boolean;
  setShowMobileSearch: (show: boolean) => void;
  language: string;
}

export const SearchBarContainer: React.FC<SearchBarContainerProps> = ({
  searchQuery,
  setSearchQuery,
  showMobileSearch,
  setShowMobileSearch,
  language
}) => {
  const isAIMode = true; // AI mode enabled by default
  
  // Initialize search indexing
  const { addToSearchIndex, refreshSearchIndex } = useSearchIndexing({
    autoIndex: true,
    indexInterval: 5 * 60 * 1000 // 5 minutes
  });
  
  const {
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
  } = useSearchState({ searchQuery, setSearchQuery, isAIMode });

  const {
    handleSearch,
    handleSuggestionClick,
    handlePageNavigation,
    handleResultClick,
    handleTrendingClick
  } = useSearchHandlers({
    aiSearch,
    isAIMode,
    inputRef,
    setShowSuggestions,
    setShowResults,
    setSearchQuery
  });

  // Initialize search index on component mount
  useEffect(() => {
    console.log('Initializing search indexing for SearchBarContainer');
    
    // Auto-index current page content
    const currentPageData = {
      id: `page-${window.location.pathname}`,
      title: document.title || 'Current Page',
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      type: 'page' as const,
      url: window.location.pathname,
      tags: window.location.pathname.split('/').filter(Boolean),
      dateAdded: new Date(),
      isActive: true
    };
    
    addToSearchIndex(currentPageData);
  }, [addToSearchIndex]);

  const currentContent = SEARCH_CONTENT[language as keyof typeof SEARCH_CONTENT];

  // Enhanced voice search handler
  const handleVoiceSearch = async (audioBlob: Blob) => {
    try {
      if (isAIMode) {
        console.log('Processing voice search with AI');
        await aiSearch.processVoiceInput(audioBlob, voiceLanguage);
      }
      setShowResults(true);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Voice search failed:', error);
    }
  };

  // Enhanced image search handler
  const handleImageSearch = async (file: File) => {
    try {
      if (isAIMode) {
        console.log('Processing image search with AI');
        await aiSearch.processImageSearch(file);
      }
      setShowResults(true);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Image search failed:', error);
    }
  };

  // Enhanced QR search handler
  const handleQRSearch = async (file: File) => {
    try {
      if (isAIMode) {
        console.log('Processing QR search with AI');
        await aiSearch.processImageSearch(file);
      }
      setShowResults(true);
      setShowSuggestions(false);
    } catch (error) {
      console.error('QR search failed:', error);
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

  const handleClearSearch = () => {
    setSearchQuery('');
    aiSearch.clearResults();
    setShowResults(false);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Enhanced suggestions that include AI suggestions
  const enhancedSuggestions = isAIMode && aiSearch.aiSuggestions.length > 0 
    ? aiSearch.aiSuggestions.map(s => s.text)
    : aiSearch.suggestions;

  // Mobile Search Button with AI indicator
  return (
    <>
      <button 
        onClick={() => setShowMobileSearch(!showMobileSearch)}
        className={`md:hidden p-1.5 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all relative ${
          isAIMode ? 'bg-gradient-to-r from-purple-500 to-blue-500' : ''
        }`}
        aria-label={currentContent.voiceSearch}
      >
        <Search className="w-4 h-4" />
        {isAIMode && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        )}
      </button>

      {/* Desktop Search Bar with AI enhancements */}
      <DesktopSearchBar
        searchQuery={searchQuery}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
        onClearSearch={handleClearSearch}
        inputRef={inputRef}
        searchRef={searchRef}
        voiceLanguage={voiceLanguage}
        onLanguageToggle={() => setVoiceLanguage(voiceLanguage === 'bn' ? 'en' : 'bn')}
        onVoiceSearch={handleVoiceSearch}
        onImageSearch={handleImageSearch}
        onQRSearch={handleQRSearch}
        showFilters={showFilters}
        onFiltersToggle={() => setShowFilters(!showFilters)}
        onFiltersApply={(filters) => {
          aiSearch.applyFilters(filters);
          setShowFilters(false);
        }}
        showSuggestions={showSuggestions}
        suggestions={enhancedSuggestions}
        onSuggestionClick={handleSuggestionClick}
        showResults={showResults}
        searchResults={aiSearch.searchResults}
        isLoading={aiSearch.isLoading}
        error={aiSearch.error}
        onResultClick={handleResultClick}
        trendingSearches={currentContent.trendingSearches}
        onTrendingClick={handleTrendingClick}
        language={language}
        pageSuggestions={pageSuggestions}
        onPageNavigate={handlePageNavigation}
      />

      {/* Mobile Search Bar with AI enhancements */}
      <MobileSearchBar
        showMobileSearch={showMobileSearch}
        searchQuery={searchQuery}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
        onClearSearch={handleClearSearch}
        searchRef={searchRef}
        voiceLanguage={voiceLanguage}
        onLanguageToggle={() => setVoiceLanguage(voiceLanguage === 'bn' ? 'en' : 'bn')}
        onVoiceSearch={handleVoiceSearch}
        onImageSearch={handleImageSearch}
        onQRSearch={handleQRSearch}
        showFilters={showFilters}
        onFiltersToggle={() => setShowFilters(!showFilters)}
        onFiltersApply={(filters) => {
          aiSearch.applyFilters(filters);
          setShowFilters(false);
        }}
        showSuggestions={showSuggestions}
        suggestions={enhancedSuggestions}
        onSuggestionClick={handleSuggestionClick}
        showResults={showResults}
        searchResults={aiSearch.searchResults}
        isLoading={aiSearch.isLoading}
        error={aiSearch.error}
        onResultClick={handleResultClick}
        language={language}
        pageSuggestions={pageSuggestions}
        onPageNavigate={handlePageNavigation}
      />

      {/* AI Mode Indicator */}
      {isAIMode && (
        <div className="hidden md:block absolute top-full right-0 mt-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-full text-xs">
          AI Enhanced
        </div>
      )}
      
      {/* Conversational Search Helper */}
      {showSuggestions && !searchQuery && (
        <div className="hidden md:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 max-w-md text-center">
          💡 {currentContent.conversationalSearch}
        </div>
      )}
    </>
  );
};
