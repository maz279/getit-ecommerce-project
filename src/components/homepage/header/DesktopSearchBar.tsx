
import React from 'react';
import { SearchInput } from './SearchInput';
import { SearchControls } from './SearchControls';
import { SearchSuggestions } from './SearchSuggestions';
import { SearchResults } from './SearchResults';
import { SearchFilters } from './SearchFilters';
import { TrendingSearches } from './TrendingSearches';

interface PageSuggestion {
  title: string;
  path: string;
}

interface DesktopSearchBarProps {
  searchQuery: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (e?: React.FormEvent) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onClearSearch: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  searchRef: React.RefObject<HTMLDivElement>;
  
  // Voice and image search
  voiceLanguage: 'bn' | 'en';
  onLanguageToggle: () => void;
  onVoiceSearch: (audioBlob: Blob) => void;
  onImageSearch: (file: File) => void;
  onQRSearch: (file: File) => void;
  
  // Filters
  showFilters: boolean;
  onFiltersToggle: () => void;
  onFiltersApply: (filters: any) => void;
  
  // Suggestions and results
  showSuggestions: boolean;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  showResults: boolean;
  searchResults: any[];
  isLoading: boolean;
  error: string | null;
  onResultClick: (result: any) => void;
  
  // Trending
  trendingSearches: string[];
  onTrendingClick: (search: string) => void;
  
  // Page navigation
  pageSuggestions: PageSuggestion[];
  onPageNavigate: (path: string) => void;
  
  language: string;
}

export const DesktopSearchBar: React.FC<DesktopSearchBarProps> = ({
  searchQuery,
  onInputChange,
  onSearch,
  onKeyPress,
  onClearSearch,
  inputRef,
  searchRef,
  voiceLanguage,
  onLanguageToggle,
  onVoiceSearch,
  onImageSearch,
  onQRSearch,
  showFilters,
  onFiltersToggle,
  onFiltersApply,
  showSuggestions,
  suggestions,
  onSuggestionClick,
  showResults,
  searchResults,
  isLoading,
  error,
  onResultClick,
  trendingSearches,
  onTrendingClick,
  language,
  pageSuggestions,
  onPageNavigate
}) => {
  const content = {
    EN: { placeholder: "Search products, brands, vendors... or navigate to any page (Type in English or বাংলা)" },
    BD: { placeholder: "পণ্য, ব্র্যান্ড, বিক্রেতা খুঁজুন... বা যেকোনো পেজে যান (ইংরেজি বা বাংলায় লিখুন)" }
  };

  const currentContent = content[language as keyof typeof content];

  return (
    <div className="hidden md:flex flex-1 max-w-4xl flex-col" ref={searchRef}>
      <form onSubmit={onSearch} className="bg-white rounded-lg shadow-lg overflow-visible w-full relative">
        <div className="flex items-center">
          <SearchInput
            value={searchQuery}
            placeholder={currentContent.placeholder}
            onChange={onInputChange}
            onKeyPress={onKeyPress}
            onClear={onClearSearch}
            inputRef={inputRef}
          />
          
          <SearchControls
            voiceLanguage={voiceLanguage}
            onLanguageToggle={onLanguageToggle}
            onVoiceSearch={onVoiceSearch}
            onImageSearch={onImageSearch}
            onQRSearch={onQRSearch}
            onFiltersToggle={onFiltersToggle}
            isLoading={isLoading}
            language={language}
          />
        </div>
        
        {showSuggestions && (
          <SearchSuggestions
            suggestions={suggestions}
            onSuggestionClick={onSuggestionClick}
            language={language}
            pageSuggestions={pageSuggestions}
            onPageNavigate={onPageNavigate}
          />
        )}
        
        {showResults && (
          <SearchResults
            results={searchResults}
            isLoading={isLoading}
            error={error}
            onResultClick={onResultClick}
            language={language}
          />
        )}

        {showFilters && (
          <SearchFilters
            onApply={onFiltersApply}
            onClose={() => onFiltersToggle()}
            language={language}
          />
        )}
      </form>
      
      <TrendingSearches
        searches={trendingSearches}
        onTrendingClick={onTrendingClick}
        language={language}
      />
    </div>
  );
};
