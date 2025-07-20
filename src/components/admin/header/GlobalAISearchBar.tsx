
import React, { useRef, useState } from 'react';
import { Search, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { aiSearchService } from '@/services/aiSearchService';
import { Badge } from '@/components/ui/badge';

interface GlobalAISearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
}

export const GlobalAISearchBar: React.FC<GlobalAISearchBarProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDeepSeekActive, setIsDeepSeekActive] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputRef.current?.value || '';
    if (query.trim()) {
      console.log(`Search: "${query}"`);
      
      if (isDeepSeekActive) {
        try {
          const enhancement = await aiSearchService.enhanceSearchWithDeepSeek(query);
          if (enhancement) {
            setAiSuggestions(enhancement.suggestions || []);
            console.log('DeepSeek enhanced search:', enhancement);
          }
        } catch (error) {
          console.error('DeepSeek enhancement failed:', error);
        }
      }
    }
  };

  return (
    <div className="flex flex-1 max-w-3xl mx-6">
      <div className="relative w-full">
        <form onSubmit={handleSearch} className="flex gap-2">
          {/* AI Toggle */}
          <Button
            type="button"
            variant={isDeepSeekActive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsDeepSeekActive(!isDeepSeekActive)}
            className="whitespace-nowrap"
          >
            <Brain size={14} className="mr-1" />
            DeepSeek AI
          </Button>

          {/* Clean Search Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder={isDeepSeekActive ? "AI-enhanced search..." : "Search orders, products, vendors, customers..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            
            {isDeepSeekActive && (
              <Badge variant="secondary" className="absolute right-14 top-1/2 transform -translate-y-1/2 text-xs">
                AI
              </Badge>
            )}
            
            {/* Search Button */}
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              <Search size={12} />
            </Button>
          </div>
        </form>

        {/* AI Suggestions */}
        {isDeepSeekActive && aiSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 p-2">
            <div className="text-xs text-gray-500 mb-2">AI Suggestions:</div>
            <div className="flex flex-wrap gap-1">
              {aiSuggestions.slice(0, 5).map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    if (inputRef.current) {
                      inputRef.current.value = suggestion;
                    }
                  }}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
