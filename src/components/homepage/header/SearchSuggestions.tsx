
import React from 'react';
import { Search } from 'lucide-react';

interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  language: string;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
  language
}) => {
  const content = {
    EN: { suggestions: "Suggestions" },
    BD: { suggestions: "সাজেশন" }
  };

  const currentContent = content[language as keyof typeof content];

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-60 overflow-y-auto">
      <div className="p-2">
        <div className="text-xs text-gray-500 mb-2">{currentContent.suggestions}</div>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
          >
            <Search className="w-3 h-3 inline mr-2 text-gray-400" />
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
