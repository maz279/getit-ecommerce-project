import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, Camera, Sparkles, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  categories: { name: string; slug: string };
  vendors: { business_name: string; rating: number };
}

interface EnhancedAISearchProps {
  onResults?: (results: SearchResult[]) => void;
  className?: string;
}

export const EnhancedAISearch: React.FC<EnhancedAISearchProps> = ({ 
  onResults, 
  className 
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'text' | 'voice' | 'image' | 'ai'>('text');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) {
        performSearch();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters, searchType]);

  const performSearch = async () => {
    setIsSearching(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-enhanced-search', {
        body: {
          query,
          type: searchType,
          filters,
          page: 1,
          limit: 20
        }
      });

      if (error) throw error;

      setResults(data.results || []);
      if (data.ai_suggestions) {
        setSuggestions(data.ai_suggestions);
      }

      onResults?.(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVoiceSearch = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setSearchType('voice');
      setIsSearching(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setSearchType('voice');
    };

    recognition.onerror = () => {
      setIsSearching(false);
      setSearchType('text');
    };

    recognition.onend = () => {
      setIsSearching(false);
    };

    recognition.start();
  };

  const handleImageSearch = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setSearchType('image');
      setIsSearching(true);

      try {
        // In a real implementation, you would upload the image and use vision AI
        // For now, we'll simulate with a generic search
        setQuery('Image search result');
        await performSearch();
      } catch (error) {
        console.error('Image search failed:', error);
      } finally {
        setIsSearching(false);
      }
    };

    input.click();
  };

  const toggleAIMode = () => {
    setSearchType(searchType === 'ai' ? 'text' : 'ai');
  };

  const applySuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
  };

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const removeFilter = (key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input Section */}
      <div className="relative">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchType === 'ai' ? 'Ask AI to find products...' : 'Search products...'}
              className="pl-10 pr-20"
            />
            
            {/* Search Type Icons */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceSearch}
                disabled={isSearching}
                className="h-8 w-8 p-0"
              >
                <Mic className={`h-4 w-4 ${searchType === 'voice' ? 'text-primary' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleImageSearch}
                disabled={isSearching}
                className="h-8 w-8 p-0"
              >
                <Camera className={`h-4 w-4 ${searchType === 'image' ? 'text-primary' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAIMode}
                disabled={isSearching}
                className="h-8 w-8 p-0"
              >
                <Sparkles className={`h-4 w-4 ${searchType === 'ai' ? 'text-primary' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-8 w-8 p-0"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1">
            <CardContent className="p-3">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filters Section */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => (
                  <Badge key={key} variant="outline" className="flex items-center gap-1">
                    {key}: {value}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeFilter(key)}
                    />
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      type="number"
                      placeholder="Min"
                      onChange={(e) => updateFilter('priceMin', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      onChange={(e) => updateFilter('priceMax', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    placeholder="Category"
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Brand</label>
                  <Input
                    placeholder="Brand"
                    onChange={(e) => updateFilter('brand', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Status */}
      {isSearching && (
        <div className="text-center text-muted-foreground">
          {searchType === 'ai' ? 'AI is enhancing your search...' : 'Searching...'}
        </div>
      )}

      {/* Search Results Count */}
      {results.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Found {results.length} products
          {searchType === 'ai' && (
            <Badge variant="secondary" className="ml-2">
              AI Enhanced
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};