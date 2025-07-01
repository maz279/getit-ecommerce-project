import React, { useState, useEffect } from 'react';
import { searchApi } from '@/services/api';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  products: any[];
  categories: any[];
  vendors: any[];
  suggestions: string[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface SearchFilters {
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
}

export const EnhancedSearchComponent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevance'
  });
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const performSearch = async (searchQuery = query, searchFilters = filters, offset = 0) => {
    if (!searchQuery.trim() && !searchFilters.category) return;

    setLoading(true);
    setError('');

    try {
      const searchParams: any = {
        q: searchQuery,
        limit: 20,
        offset
      };

      if (searchFilters.category) searchParams.category = searchFilters.category;
      if (searchFilters.minPrice) searchParams.minPrice = parseFloat(searchFilters.minPrice);
      if (searchFilters.maxPrice) searchParams.maxPrice = parseFloat(searchFilters.maxPrice);

      const { data, error: searchError } = await searchApi.search(searchParams);

      if (searchError) {
        setError(searchError.message || 'Search failed');
        toast({
          title: "Search Error",
          description: "Failed to perform search. Please try again.",
          variant: "destructive"
        });
      } else if (data) {
        setResults(data.data);
        
        // Log search for analytics
        if (searchQuery) {
          await searchApi.logSearch({
            searchTerm: searchQuery,
            resultCount: data.data.products.length,
            filters: searchFilters
          });
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred during search.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (query || newFilters.category) {
      performSearch(query, newFilters);
    }
  };

  const loadMore = () => {
    if (results?.pagination.hasMore) {
      performSearch(query, filters, results.pagination.offset + results.pagination.limit);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search products, categories, vendors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </form>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="home-garden">Home & Garden</SelectItem>
                  <SelectItem value="health-beauty">Health & Beauty</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Min Price"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />

              <Input
                placeholder="Max Price"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />

              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && <LoadingState message="Searching..." />}

      {/* Error State */}
      {error && (
        <ErrorState
          message={error}
          onRetry={() => performSearch()}
        />
      )}

      {/* Search Results */}
      {results && !loading && (
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              Search Results ({results.pagination.total} found)
            </h2>
          </div>

          {/* Suggestions */}
          {results.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {results.suggestions.map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => {
                        setQuery(suggestion);
                        performSearch(suggestion, filters);
                      }}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products */}
          {results.products.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.products.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-muted relative">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary">
                            ${product.price}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{product.rating || 0}</span>
                            <span className="text-sm text-muted-foreground">
                              ({product.reviews_count || 0})
                            </span>
                          </div>
                          <Badge variant="outline">
                            {product.vendors?.name || 'Unknown Vendor'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                {results.pagination.hasMore && (
                  <div className="mt-6 text-center">
                    <Button onClick={loadMore} variant="outline">
                      Load More Results
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Categories */}
          {results.categories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {results.categories.map((category) => (
                    <Card
                      key={category.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleFilterChange('category', category.slug)}
                    >
                      <CardContent className="p-4 text-center">
                        <h3 className="font-medium">{category.name}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vendors */}
          {results.vendors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.vendors.map((vendor) => (
                    <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{vendor.name}</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{vendor.rating || 0}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Results */}
          {results.products.length === 0 && results.categories.length === 0 && results.vendors.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-lg text-muted-foreground">
                  No results found for "{query}"
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search terms or filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchComponent;