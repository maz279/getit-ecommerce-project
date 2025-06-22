
import React from 'react';
import { Card } from '@/components/ui/card';
import { Home, Search } from 'lucide-react';

interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  pageSuggestions?: string[];
  onPageNavigate?: (pageName: string) => void;
  language: string;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
  pageSuggestions = [],
  onPageNavigate,
  language
}) => {
  const content = {
    EN: {
      pages: "Pages",
      searchSuggestions: "Search Suggestions"
    },
    BD: {
      pages: "পেজসমূহ",
      searchSuggestions: "সার্চ সাজেশন"
    }
  };

  const currentContent = content[language as keyof typeof content];

  if (suggestions.length === 0 && pageSuggestions.length === 0) {
    return null;
  }

  return (
    <Card className="absolute top-full left-0 right-0 mt-1 shadow-lg z-50 max-h-64 overflow-y-auto">
      <div className="divide-y divide-gray-100">
        {/* Page Navigation Suggestions */}
        {pageSuggestions.length > 0 && (
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2 px-2 flex items-center gap-1">
              <Home className="w-3 h-3" />
              {currentContent.pages}
            </div>
            <div className="space-y-1">
              {pageSuggestions.map((page, index) => (
                <button
                  key={`page-${index}`}
                  onClick={() => onPageNavigate?.(page)}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded text-sm text-blue-600 font-medium capitalize transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Home className="w-3 h-3" />
                    <span>{page.replace(/[-_]/g, ' ')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="p-2">
            {pageSuggestions.length > 0 && (
              <div className="text-xs font-medium text-gray-500 mb-2 px-2 flex items-center gap-1">
                <Search className="w-3 h-3" />
                {currentContent.searchSuggestions}
              </div>
            )}
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`search-${index}`}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3 h-3 text-gray-400" />
                    <span>{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
