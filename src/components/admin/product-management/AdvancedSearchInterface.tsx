import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, Globe2, TrendingUp, BarChart3, RefreshCw } from 'lucide-react';

interface AdvancedSearchInterfaceProps {
  onSearchResults?: (results: any[]) => void;
}

export const AdvancedSearchInterface: React.FC<AdvancedSearchInterfaceProps> = ({ 
  onSearchResults 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category_id: '',
    brand_id: '',
    min_price: '',
    max_price: '',
    min_rating: '',
    sort_by: 'relevance',
    bangladesh_specific: false,
    material_type: '',
    festival_suitable: ''
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchStats, setSearchStats] = useState({
    total_results: 0,
    search_time: 0,
    suggestions: []
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await supabase.functions.invoke('category-management-service', {
        body: { endpoint: 'categories/tree' }
      });
      if (data?.data) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAdvancedSearch = async () => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      // Use the elasticsearch search service for advanced search
      const searchParams = new URLSearchParams({
        q: searchQuery,
        ...(filters.category_id && { categories: filters.category_id }),
        ...(filters.min_price && { min_price: filters.min_price }),
        ...(filters.max_price && { max_price: filters.max_price }),
        ...(filters.min_rating && { min_rating: filters.min_rating }),
        sort_by: filters.sort_by,
        limit: '20'
      });

      const { data, error } = await supabase.functions.invoke('elasticsearch-search', {
        body: {
          path: '/elasticsearch-search/products',
          method: 'GET',
          params: Object.fromEntries(searchParams)
        }
      });

      if (error) throw error;

      const searchTime = Date.now() - startTime;
      const results = data?.products || [];
      
      setSearchResults(results);
      setSearchStats({
        total_results: results.length,
        search_time: searchTime,
        suggestions: data?.suggestions || []
      });

      if (onSearchResults) {
        onSearchResults(results);
      }

    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  const handleBanglaSearch = async () => {
    if (!searchQuery) return;
    
    try {
      const { data } = await supabase.functions.invoke('product-management-enhanced', {
        body: {
          endpoint: 'search/bangla-phonetic',
          data: { query: searchQuery }
        }
      });

      if (data?.data) {
        setSearchStats(prev => ({
          ...prev,
          suggestions: data.data.map((item: any) => item.bangla).flat()
        }));
      }
    } catch (error) {
      console.error('Bangla search error:', error);
    }
  };

  const resetFilters = () => {
    setFilters({
      category_id: '',
      brand_id: '',
      min_price: '',
      max_price: '',
      min_rating: '',
      sort_by: 'relevance',
      bangladesh_specific: false,
      material_type: '',
      festival_suitable: ''
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  const renderSearchStats = () => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                {searchStats.total_results} results found in {searchStats.search_time}ms
              </span>
            </div>
            {searchStats.suggestions.length > 0 && (
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-green-600" />
                <span className="text-sm text-muted-foreground">
                  Bangla suggestions available
                </span>
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderAdvancedFilters = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Advanced Search Filters
        </CardTitle>
        <CardDescription>
          Use advanced filters to find exactly what you're looking for
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products... (supports English & Bangla)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleAdvancedSearch()}
          />
          <Button 
            size="sm" 
            variant="outline" 
            className="absolute right-2 top-1.5"
            onClick={handleBanglaSearch}
          >
            <Globe2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Bangla Suggestions */}
        {searchStats.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Bangla suggestions:</span>
            {searchStats.suggestions.slice(0, 5).map((suggestion: string, index: number) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => setSearchQuery(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        )}

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={filters.category_id} onValueChange={(value) => 
              setFilters(prev => ({ ...prev, category_id: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category: any) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} {category.name_bn && `(${category.name_bn})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">Min Price (৳)</label>
            <Input
              type="number"
              placeholder="0"
              value={filters.min_price}
              onChange={(e) => setFilters(prev => ({ ...prev, min_price: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Max Price (৳)</label>
            <Input
              type="number"
              placeholder="No limit"
              value={filters.max_price}
              onChange={(e) => setFilters(prev => ({ ...prev, max_price: e.target.value }))}
            />
          </div>

          {/* Rating Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
            <Select value={filters.min_rating} onValueChange={(value) => 
              setFilters(prev => ({ ...prev, min_rating: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Any Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Rating</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <Select value={filters.sort_by} onValueChange={(value) => 
              setFilters(prev => ({ ...prev, sort_by: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bangladesh-specific filters */}
          <div>
            <label className="text-sm font-medium mb-2 block">Material Type</label>
            <Select value={filters.material_type} onValueChange={(value) => 
              setFilters(prev => ({ ...prev, material_type: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Any Material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Material</SelectItem>
                <SelectItem value="cotton">Cotton</SelectItem>
                <SelectItem value="silk">Silk</SelectItem>
                <SelectItem value="jute">Jute</SelectItem>
                <SelectItem value="muslin">Muslin</SelectItem>
                <SelectItem value="khadi">Khadi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bangladesh-specific checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="bangladesh-specific"
            checked={filters.bangladesh_specific}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              bangladesh_specific: e.target.checked 
            }))}
            className="rounded border-gray-300"
          />
          <label htmlFor="bangladesh-specific" className="text-sm font-medium">
            Show only Bangladesh-specific products
          </label>
        </div>

        {/* Search Button */}
        <Button 
          onClick={handleAdvancedSearch} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          {loading ? 'Searching...' : 'Search Products'}
        </Button>
      </CardContent>
    </Card>
  );

  const renderSearchResults = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Search Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        {searchResults.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {loading ? 'Searching...' : 'No results found. Try adjusting your search criteria.'}
          </div>
        ) : (
          <div className="space-y-4">
            {searchResults.map((product: any, index: number) => (
              <div key={product.id || index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50">
                {product.images && product.images[0] && (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  {product.name_bn && (
                    <p className="text-sm text-muted-foreground">{product.name_bn}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">৳{product.price}</Badge>
                    {product.rating_average && (
                      <Badge variant="secondary">
                        ★ {product.rating_average.toFixed(1)}
                      </Badge>
                    )}
                    {product.bangladesh_specific && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Made in Bangladesh
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Advanced Search</TabsTrigger>
          <TabsTrigger value="analytics">Search Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="space-y-4">
          {renderAdvancedFilters()}
          {searchResults.length > 0 && renderSearchStats()}
          {renderSearchResults()}
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Analytics</CardTitle>
              <CardDescription>Insights into search patterns and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-primary">1,234</div>
                  <div className="text-sm text-muted-foreground">Total Searches Today</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-muted-foreground">Search Success Rate</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-blue-600">156ms</div>
                  <div className="text-sm text-muted-foreground">Average Search Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};