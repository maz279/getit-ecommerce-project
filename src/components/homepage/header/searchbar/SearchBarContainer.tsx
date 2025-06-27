
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
  const isAIMode = true;
  
  const { addToSearchIndex } = useSearchIndexing({
    autoIndex: true,
    indexInterval: 5 * 60 * 1000
  });
  
  const searchState = useSearchState({ searchQuery, setSearchQuery, isAIMode });
  const searchHandlers = useSearchHandlers({ 
    ...searchState, 
    isAIMode,
    setSearchQuery // Add the missing prop
  });

  const {
    handleVoiceSearch,
    handleImageSearch,
    handleQRSearch
  } = useSearchBarHandlers({
    aiSearch: searchState.aiSearch,
    isAIMode,
    voiceLanguage: searchState.voiceLanguage,
    setShowResults: searchState.setShowResults,
    setShowSuggestions: searchState.setShowSuggestions
  });

  const {
    handleKeyPress,
    handleClearSearch
  } = useSearchKeyboardHandlers({
    onSearch: searchHandlers.handleSearch,
    setShowResults: searchState.setShowResults,
    setShowSuggestions: searchState.setShowSuggestions,
    setSearchQuery,
    aiSearch: searchState.aiSearch,
    inputRef: searchState.inputRef
  });

  useEffect(() => {
    console.log('Initializing search indexing for SearchBarContainer');
    
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
  const enhancedSuggestions = isAIMode && searchState.aiSearch.aiSuggestions.length > 0 
    ? searchState.aiSearch.aiSuggestions.map((s: any) => s.text)
    : searchState.aiSearch.suggestions;

  // Create wrapper functions to handle the prop type differences
  const handleInputChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchState.handleInputChange(e.target.value);
  };

  const commonProps = {
    searchQuery,
    onInputChange: handleInputChangeWrapper, // Use wrapper function
    onSearch: searchHandlers.handleSearch,
    onKeyPress: handleKeyPress,
    onClearSearch: handleClearSearch,
    voiceLanguage: searchState.voiceLanguage,
    onLanguageToggle: () => searchState.setVoiceLanguage(searchState.voiceLanguage === 'bn' ? 'en' : 'bn'),
    onVoiceSearch: handleVoiceSearch,
    onImageSearch: handleImageSearch,
    onQRSearch: handleQRSearch,
    showFilters: searchState.showFilters,
    onFiltersToggle: () => searchState.setShowFilters(!searchState.showFilters),
    onFiltersApply: (filters: any) => {
      searchState.aiSearch.applyFilters(filters);
      searchState.setShowFilters(false);
    },
    showSuggestions: searchState.showSuggestions,
    suggestions: enhancedSuggestions,
    onSuggestionClick: searchHandlers.handleSuggestionClick,
    showResults: searchState.showResults,
    searchResults: searchState.aiSearch.searchResults,
    isLoading: searchState.aiSearch.isLoading,
    error: searchState.aiSearch.error,
    onResultClick: searchHandlers.handleResultClick,
    language,
    pageSuggestions: searchState.pageSuggestions,
    onPageNavigate: searchHandlers.handlePageNavigation
  };

  return (
    <>
      <MobileSearchButton
        showMobileSearch={showMobileSearch}
        onToggle={() => setShowMobileSearch(!showMobileSearch)}
        isAIMode={isAIMode}
        voiceSearchLabel={currentContent.voiceSearch}
      />

      <DesktopSearchBar
        {...commonProps}
        inputRef={searchState.inputRef}
        searchRef={searchState.searchRef}
        trendingSearches={currentContent.trendingSearches}
        onTrendingClick={searchHandlers.handleTrendingClick}
      />

      <MobileSearchBar
        {...commonProps}
        showMobileSearch={showMobileSearch}
        searchRef={searchState.searchRef}
      />

      <AIModeIndicator isAIMode={isAIMode} />
      
      <ConversationalSearchHelper
        showSuggestions={searchState.showSuggestions}
        searchQuery={searchQuery}
        conversationalSearchText={currentContent.conversationalSearch}
      />
    </>
  );
};
