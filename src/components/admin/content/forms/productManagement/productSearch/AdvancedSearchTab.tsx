
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, SlidersHorizontal, Star, Package, ShoppingCart } from 'lucide-react';
import { ProductSearchResult, SearchFilters } from './types';

interface AdvancedSearchTabProps {
  products: ProductSearchResult[];
  searchResults: ProductSearchResult[];
  onSearch: (query: string, filters?: SearchFilters) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export const AdvancedSearchTab: React.FC<AdvancedSearchTabProps> = ({
  products,
  searchResults,
  onSearch,
  filters,
  onFiltersChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery, filters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Advanced Product Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products by name, SKU, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Home">Home & Garden</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Vendor</label>
              <Select value={filters.vendor} onValueChange={(value) => handleFilterChange('vendor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Vendors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  <SelectItem value="Apple">Apple Authorized</SelectItem>
                  <SelectItem value="Samsung">Samsung Bangladesh</SelectItem>
                  <SelectItem value="Local">Local Vendors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Availability</label>
              <Select value={filters.availability} onValueChange={(value) => handleFilterChange('availability', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Price Range (৳)</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0]}
                  onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 100000])}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
              <Select value={filters.rating.toString()} onValueChange={(value) => handleFilterChange('rating', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Rating</SelectItem>
                  <SelectItem value="1">1+ Stars</SelectItem>
                  <SelectItem value="2">2+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="5">5 Stars Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Search Results ({searchResults.length})
            </span>
            <Badge variant="outline">{searchResults.length} products found</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No products found. Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                          <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">৳{product.price.toLocaleString()}</p>
                          {product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">৳{product.originalPrice.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm">{product.rating} ({product.reviews})</span>
                          </div>
                          <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </Badge>
                          <span className="text-sm text-gray-500">{product.sold} sold</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
