
import React, { useEffect } from 'react';
import { DesktopSearchBar } from '../DesktopSearchBar';
import { MobileSearchBar } from '../MobileSearchBar';
import { useSearchState } from './hooks/useSearchState';
import { useSearchHandlers } from './hooks/useSearchHandlers';
import { useSearchIndexing } from '@/hooks/useSearchIndexing';
import { SEARCH_CONTENT } from './constants';
import { 
  MobileSearchButton, 
  AIModeIndicator, 
  ConversationalSearchHelper,
  useSearchBarHandlers,
  useSearchKeyboardHandlers
} from './components';

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

  // Custom handlers for voice, image, and QR search
  const {
    handleVoiceSearch,
    handleImageSearch,
    handleQRSearch
  } = useSearchBarHandlers({
    aiSearch,
    isAIMode,
    voiceLanguage,
    setShowResults,
    setShowSuggestions
  });

  // Keyboard handlers
  const {
    handleKeyPress,
    handleClearSearch
  } = useSearchKeyboardHandlers({
    onSearch: handleSearch,
    setShowResults,
    setShowSuggestions,
    setSearchQuery,
    aiSearch,
    inputRef
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

  // Enhanced suggestions that include AI suggestions
  const enhancedSuggestions = isAIMode && aiSearch.aiSuggestions.length > 0 
    ? aiSearch.aiSuggestions.map(s => s.text)
    : aiSearch.suggestions;

  return (
    <>
      <MobileSearchButton
        showMobileSearch={showMobileSearch}
        onToggle={() => setShowMobileSearch(!showMobileSearch)}
        isAIMode={isAIMode}
        voiceSearchLabel={currentContent.voiceSearch}
      />

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

      <AIModeIndicator isAIMode={isAIMode} />
      
      <ConversationalSearchHelper
        showSuggestions={showSuggestions}
        searchQuery={searchQuery}
        conversationalSearchText={currentContent.conversationalSearch}
      />
    </>
  );
};
