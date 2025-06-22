
import React from 'react';
import { SearchInput } from './SearchInput';
import { SearchControls } from './SearchControls';
import { SearchSuggestions } from './SearchSuggestions';
import { SearchResults } from './SearchResults';
import { SearchFilters } from './SearchFilters';

interface MobileSearchBarProps {
  showMobileSearch: boolean;
  searchQuery: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (e?: React.FormEvent) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onClearSearch: () => void;
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
  
  language: string;
}

export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  showMobileSearch,
  searchQuery,
  onInputChange,
  onSearch,
  onKeyPress,
  onClearSearch,
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
  language
}) => {
  const content = {
    EN: { placeholder: "Search products, brands, vendors... (Type in English or বাংলা)" },
    BD: { placeholder: "পণ্য, ব্র্যান্ড, বিক্রেতা খুঁজুন... (ইংরেজি বা বাংলায় লিখুন)" }
  };

  const currentContent = content[language as keyof typeof content];

  if (!showMobileSearch) return null;

  return (
    <div className="md:hidden mt-3 px-2" ref={searchRef}>
      <form onSubmit={onSearch} className="bg-white rounded-lg shadow-lg overflow-visible w-full relative">
        <div className="flex items-center">
          <SearchInput
            value={searchQuery}
            placeholder={currentContent.placeholder}
            onChange={onInputChange}
            onKeyPress={onKeyPress}
            onClear={onClearSearch}
            inputRef={React.createRef()}
            className="px-3 py-2"
          />
          
          <SearchControls
            voiceLanguage={voiceLanguage}
            onLanguageToggle={onLanguageToggle}
            onVoiceSearch={onVoiceSearch}
            onImageSearch={onImageSearch}
            onQRSearch={onQRSearch}
            onFiltersToggle={onFiltersToggle}
            isLoading={isLoading}
            isMobile={true}
            language={language}
          />
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="w-full text-left px-2 py-1.5 hover:bg-gray-50 rounded text-sm"
                >
                  <span className="w-3 h-3 inline mr-2 text-gray-400">🔍</span>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
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
    </div>
  );
};
