
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Store, Package } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: 'product' | 'vendor' | 'brand';
  image?: string;
  price?: number;
  rating?: number;
  description?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  onResultClick: (result: SearchResult) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  error,
  onResultClick
}) => {
  if (isLoading) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 p-4 shadow-lg z-50">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
          <span className="text-sm text-gray-600">Searching...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 p-4 shadow-lg z-50">
        <div className="text-sm text-red-600">{error}</div>
      </Card>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto shadow-lg z-50">
      <div className="divide-y divide-gray-100">
        {results.map((result) => (
          <div
            key={result.id}
            className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onResultClick(result)}
          >
            <div className="flex items-center gap-3">
              {result.image && (
                <img
                  src={result.image}
                  alt={result.title}
                  className="w-10 h-10 object-cover rounded"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm truncate">{result.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {result.type === 'product' && <Package className="w-3 h-3 mr-1" />}
                    {result.type === 'vendor' && <Store className="w-3 h-3 mr-1" />}
                    {result.type === 'brand' && <Star className="w-3 h-3 mr-1" />}
                    {result.type}
                  </Badge>
                </div>
                
                {result.description && (
                  <p className="text-xs text-gray-600 truncate mt-1">
                    {result.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 mt-1">
                  {result.price && (
                    <span className="text-sm font-semibold text-orange-600">
                      ৳{result.price.toLocaleString()}
                    </span>
                  )}
                  
                  {result.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{result.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
