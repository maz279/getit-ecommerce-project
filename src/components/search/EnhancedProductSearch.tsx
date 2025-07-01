import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, Star, Heart, ShoppingCart, ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  avgRating: number;
  reviewCount: number;
  inStock: boolean;
}

interface ProductFilter {
  id: string;
  filter_type: string;
  filter_name: string;
  filter_options: any;
}

interface SearchFilters {
  query: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: string;
  inStock: boolean;
}

const EnhancedProductSearch: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilter[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    minPrice: 0,
    maxPrice: 50000,
    minRating: 0,
    sortBy: 'popularity',
    inStock: false
  });

  // Load available filters
  useEffect(() => {
    loadFilters();
  }, []);

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchProducts();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchFilters]);

  const loadFilters = async () => {
    try {
      const response = await fetch(
        `https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/enhanced-products-api?action=filters`,
        {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZ3Bwc2ptc3BteW1yZm93eXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTUzNTcsImV4cCI6MjA2NTY3MTM1N30.qk_wrVRHkJh-oXBbxFWnZwfGoZmdBK35Ce7bBoRQ0To`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFilters(data.filters);
      }
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const searchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        action: 'search',
        q: searchFilters.query,
        minPrice: searchFilters.minPrice.toString(),
        maxPrice: searchFilters.maxPrice.toString(),
        minRating: searchFilters.minRating.toString(),
        sortBy: searchFilters.sortBy,
        inStock: searchFilters.inStock.toString(),
        page: '1',
        limit: '20'
      });

      const response = await fetch(
        `https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/enhanced-products-api?${params}`,
        {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZ3Bwc2ptc3BteW1yZm93eXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTUzNTcsImV4cCI6MjA2NTY3MTM1N30.qk_wrVRHkJh-oXBbxFWnZwfGoZmdBK35Ce7bBoRQ0To`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      toast({
        title: "Search Error",
        description: "Failed to search products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Login Required",
          description: "Please log in to add items to wishlist",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(
        'https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/wishlist-api',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ product_id: productId })
        }
      );

      if (response.ok) {
        toast({
          title: "Added to Wishlist",
          description: "Product added to your wishlist"
        });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add to wishlist",
        variant: "destructive"
      });
    }
  };

  const handleAddToComparison = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    } else if (selectedProducts.length < 4) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      toast({
        title: "Comparison Limit",
        description: "You can compare up to 4 products at once",
        variant: "destructive"
      });
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Filters</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <div className="px-2">
                  <Slider
                    value={[searchFilters.minPrice, searchFilters.maxPrice]}
                    onValueChange={([min, max]) => {
                      updateFilter('minPrice', min);
                      updateFilter('maxPrice', max);
                    }}
                    max={50000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>৳{searchFilters.minPrice}</span>
                    <span>৳{searchFilters.maxPrice}</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                <Select value={searchFilters.minRating.toString()} onValueChange={(value) => updateFilter('minRating', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="1">1+ Stars</SelectItem>
                    <SelectItem value="2">2+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Availability */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={searchFilters.inStock}
                  onCheckedChange={(checked) => updateFilter('inStock', checked)}
                />
                <label htmlFor="inStock" className="text-sm font-medium">
                  In Stock Only
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Header */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchFilters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Select value={searchFilters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Comparison Bar */}
          {selectedProducts.length > 0 && (
            <Card className="mb-6 border-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5" />
                    <span className="font-medium">
                      {selectedProducts.length} products selected for comparison
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={selectedProducts.length < 2}
                      onClick={() => {
                        // Navigate to comparison page
                        window.open(`/compare?products=${selectedProducts.join(',')}`, '_blank');
                      }}
                    >
                      Compare
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProducts([])}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : (
              products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={product.images[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {!product.inStock && (
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        Out of Stock
                      </Badge>
                    )}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleAddToWishlist(product.id)}
                        className="h-8 w-8"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant={selectedProducts.includes(product.id) ? "default" : "secondary"}
                        onClick={() => handleAddToComparison(product.id)}
                        className="h-8 w-8"
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(Math.round(product.avgRating))}
                      <span className="text-sm text-gray-500 ml-1">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">৳{product.price}</span>
                      <Button size="sm" disabled={!product.inStock}>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        {product.inStock ? 'Add' : 'Unavailable'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedProductSearch;