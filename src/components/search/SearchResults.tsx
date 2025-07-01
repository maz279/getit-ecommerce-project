import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/product/ProductCard';
import { SearchFilters } from './SearchFilters';
import { Product, Vendor } from '@/types';

interface SearchResultsProps {
  query: string;
  products: Product[];
  vendors: Vendor[];
  totalResults: number;
  isLoading?: boolean;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest';

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
];

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  products,
  vendors,
  totalResults,
  isLoading = false
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000] as [number, number],
    categories: [] as string[],
    brands: [] as string[],
    rating: 0,
    inStock: false,
  });

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price_low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      default:
        return sorted;
    }
  }, [products, sortBy]);

  // Filter products based on applied filters
  const filteredProducts = useMemo(() => {
    return sortedProducts.filter(product => {
      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category_id)) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && (product.averageRating || 0) < filters.rating) {
        return false;
      }

      // In stock filter
      if (filters.inStock && product.stock_quantity <= 0) {
        return false;
      }

      return true;
    });
  }, [sortedProducts, filters]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-muted-foreground">
          {totalResults.toLocaleString()} products found
        </p>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
          Electronics
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
          Fashion
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
          Home & Garden
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
          Books
        </Badge>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
          <SearchFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} of {totalResults} products
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredProducts.map(product => {
                const vendor = vendors.find(v => v.id === product.vendor_id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    vendor={vendor}
                    className={viewMode === 'list' ? 'flex flex-row' : ''}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={() => setFilters({
                priceRange: [0, 100000] as [number, number],
                categories: [],
                brands: [],
                rating: 0,
                inStock: false,
              })}>
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Load More */}
          {filteredProducts.length > 0 && filteredProducts.length < totalResults && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Products
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};