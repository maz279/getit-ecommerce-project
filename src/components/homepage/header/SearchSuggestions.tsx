
import React from 'react';

interface PageSuggestion {
  title: string;
  path: string;
}

interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  language: string;
  pageSuggestions: PageSuggestion[];
  onPageNavigate: (path: string) => void;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
  pageSuggestions,
  onPageNavigate
}) => {
  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-48 overflow-y-auto">
      <div className="p-2">
        {/* Page suggestions */}
        {pageSuggestions.length > 0 && (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1 px-2">Pages:</div>
            {pageSuggestions.map((page, index) => (
              <button
                key={`page-${index}`}
                onClick={() => onPageNavigate(page.path)}
                className="w-full text-left px-2 py-1.5 hover:bg-blue-50 rounded text-sm text-blue-600"
              >
                <span className="w-3 h-3 inline mr-2">🏠</span>
                {page.title}
              </button>
            ))}
          </div>
        )}
        
        {/* Search suggestions */}
        {suggestions.map((suggestion, index) => (
          <button
            key={`search-${index}`}
            onClick={() => onSuggestionClick(suggestion)}
            className="w-full text-left px-2 py-1.5 hover:bg-gray-50 rounded text-sm"
          >
            <span className="w-3 h-3 inline mr-2 text-gray-400">🔍</span>
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
