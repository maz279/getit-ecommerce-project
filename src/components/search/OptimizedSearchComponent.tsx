import React, { useState, useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchApi } from '@/services/api';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { debounce } from 'lodash';

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

export const OptimizedSearchComponent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevance'
  });
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { toast } = useToast();

  // Debounced search to avoid excessive API calls
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setDebouncedQuery(value);
    }, 300),
    []
  );

  // Update debounced query when query changes
  React.useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  // Infinite query for search results with caching
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useInfiniteQuery({
    queryKey: ['search', debouncedQuery, filters],
    queryFn: async ({ pageParam = 0 }) => {
      if (!debouncedQuery.trim() && !filters.category) {
        return { data: { data: { products: [], categories: [], vendors: [], suggestions: [], pagination: { total: 0, limit: 20, offset: 0, hasMore: false } } } };
      }

      const searchParams: any = {
        q: debouncedQuery,
        limit: 20,
        offset: pageParam
      };

      if (filters.category) searchParams.category = filters.category;
      if (filters.minPrice) searchParams.minPrice = parseFloat(filters.minPrice);
      if (filters.maxPrice) searchParams.maxPrice = parseFloat(filters.maxPrice);

      const response = await searchApi.search(searchParams);
      
      if (response.error) {
        throw new Error(response.error.message || 'Search failed');
      }

      // Log search for analytics (only on first page)
      if (pageParam === 0 && debouncedQuery) {
        searchApi.logSearch({
          searchTerm: debouncedQuery,
          resultCount: (response as any).data?.data?.products?.length || 0,
          filters
        }).catch(console.error);
      }

      return response;
    },
    getNextPageParam: (lastPage: any) => {
      const pagination = lastPage?.data?.data?.pagination;
      return pagination?.hasMore ? pagination.offset + pagination.limit : undefined;
    },
    enabled: Boolean(debouncedQuery.trim() || filters.category),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    retry: 2,
    retryDelay: 1000
  });

  // Memoized search results
  const searchResults = useMemo(() => {
    if (!data?.pages?.length) return null;

    const firstPage = (data.pages[0] as any)?.data?.data;
    if (!firstPage) return null;

    // Combine all pages of products
    const allProducts = data.pages.flatMap((page: any) => page?.data?.data?.products || []);
    
    return {
      ...firstPage,
      products: allProducts,
      pagination: (data.pages[data.pages.length - 1] as any)?.data?.data?.pagination
    };
  }, [data]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query !== debouncedQuery) {
      setDebouncedQuery(query);
    }
  }, [query, debouncedQuery]);

  const handleFilterChange = useCallback((key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Memoized product cards to prevent unnecessary re-renders
  const ProductCard = React.memo(({ product }: { product: any }) => (
    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-muted relative">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
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
  ));

  if (error) {
    return (
      <ErrorState
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Products
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {['fashion', 'electronics', 'home-garden', 'health-beauty'].map((cat) => (
              <Button
                key={cat}
                variant={filters.category === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('category', filters.category === cat ? '' : cat)}
              >
                {cat.replace('-', ' & ').replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && <LoadingState message="Searching..." />}

      {/* Search Results */}
      {searchResults && !isLoading && (
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {searchResults.pagination.total > 0 
                ? `${searchResults.pagination.total} results found`
                : 'No results found'
              }
            </h2>
            {isFetching && !isFetchingNextPage && (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}
          </div>

          {/* Suggestions */}
          {searchResults.suggestions?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {searchResults.suggestions.map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => setQuery(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products */}
          {searchResults.products?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More */}
                {hasNextPage && (
                  <div className="mt-6 text-center">
                    <Button 
                      onClick={loadMore} 
                      variant="outline"
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        'Load More Results'
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Categories & Vendors */}
          {(searchResults.categories?.length > 0 || searchResults.vendors?.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Categories */}
              {searchResults.categories?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {searchResults.categories.map((category) => (
                        <Button
                          key={category.id}
                          variant="outline"
                          onClick={() => handleFilterChange('category', category.slug)}
                          className="h-auto p-3 text-left"
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Vendors */}
              {searchResults.vendors?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Vendors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {searchResults.vendors.map((vendor) => (
                        <div key={vendor.id} className="flex items-center justify-between p-2 border rounded">
                          <span className="font-medium">{vendor.name}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{vendor.rating || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OptimizedSearchComponent;