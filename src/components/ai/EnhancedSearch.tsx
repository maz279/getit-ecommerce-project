import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Mic, Camera, Sparkles, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedSearchProps {
  onResults?: (results: any[]) => void;
  userId?: string;
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  onResults,
  userId
}) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'text' | 'semantic' | 'voice' | 'visual'>('semantic');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enhancedQuery, setEnhancedQuery] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-enhanced-search', {
        body: {
          query,
          searchType,
          userId,
          filters: {},
          limit: 20
        }
      });

      if (data?.results) {
        setResults(data.results);
        setEnhancedQuery(data.enhanced_query);
        onResults?.(data.results);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI-Enhanced Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search with AI intelligence..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Search Type Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={searchType === 'semantic' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSearchType('semantic')}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Semantic
          </Button>
          <Button
            variant={searchType === 'voice' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSearchType('voice')}
          >
            <Mic className="h-4 w-4 mr-1" />
            Voice
          </Button>
          <Button
            variant={searchType === 'visual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSearchType('visual')}
          >
            <Camera className="h-4 w-4 mr-1" />
            Visual
          </Button>
          <Button
            variant={searchType === 'text' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSearchType('text')}
          >
            <Filter className="h-4 w-4 mr-1" />
            Text
          </Button>
        </div>

        {/* Enhanced Query Display */}
        {enhancedQuery && enhancedQuery !== query && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">AI Enhanced Query:</p>
            <p className="text-sm font-medium">{enhancedQuery}</p>
          </div>
        )}

        {/* Results Preview */}
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Search Results ({results.length})</h3>
              <Badge variant="secondary">{searchType} search</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {results.slice(0, 4).map((product) => (
                <div key={product.id} className="flex gap-3 p-3 border rounded-lg">
                  <div className="w-16 h-16 bg-muted rounded flex-shrink-0">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <p className="font-semibold text-primary text-sm mt-1">
                      ৳{product.price?.toLocaleString() || 'N/A'}
                    </p>
                    {product.ml_score && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {Math.round(product.ml_score * 100)}% relevance
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {results.length > 4 && (
              <p className="text-sm text-muted-foreground text-center">
                + {results.length - 4} more results
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};