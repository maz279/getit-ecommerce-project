import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Eye, ShoppingCart, TrendingUp, TrendingDown, Star, Package, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProductPerformance {
  id: string;
  product_id: string;
  analytics_date: string;
  views_count: number;
  cart_additions: number;
  purchases_count: number;
  revenue: number;
  conversion_rate: number;
  return_rate: number;
  average_rating: number;
  review_count: number;
  profit_margin: number;
  products: {
    name: string;
    description: string;
    image_url: string;
    price: number;
  };
}

interface ProductInsights {
  topPerformers: ProductPerformance[];
  totalProductRevenue: number;
  avgConversionRate: number;
  totalProducts: number;
}

const ProductPerformance: React.FC = () => {
  const [products, setProducts] = useState<ProductPerformance[]>([]);
  const [insights, setInsights] = useState<ProductInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('revenue');
  const [filterBy, setFilterBy] = useState('all');

  const fetchProductPerformance = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('vendor-analytics-engine', {
        body: { type: 'products' }
      });

      if (error) throw error;

      setProducts(data.products || []);
      setInsights(data.insights || null);
    } catch (error) {
      console.error('Error fetching product performance:', error);
      toast({
        title: "Error",
        description: "Failed to load product performance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductPerformance();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.products.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'high-conversion') return matchesSearch && product.conversion_rate > 0.05;
      if (filterBy === 'low-conversion') return matchesSearch && product.conversion_rate <= 0.02;
      if (filterBy === 'high-return') return matchesSearch && product.return_rate > 0.1;
      if (filterBy === 'top-rated') return matchesSearch && product.average_rating >= 4.0;
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.revenue - a.revenue;
        case 'views':
          return b.views_count - a.views_count;
        case 'conversion':
          return b.conversion_rate - a.conversion_rate;
        case 'rating':
          return b.average_rating - a.average_rating;
        case 'profit':
          return b.profit_margin - a.profit_margin;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Product Performance</h2>
          <p className="text-muted-foreground">Analyze individual product metrics and trends</p>
        </div>
        
        <Button onClick={fetchProductPerformance} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{insights?.totalProducts || 0}</p>
                <p className="text-sm text-muted-foreground mt-1">Active listings</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Product Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(insights?.totalProductRevenue || 0)}</p>
                <p className="text-sm text-muted-foreground mt-1">Total earnings</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Conversion</p>
                <p className="text-2xl font-bold">{((insights?.avgConversionRate || 0) * 100).toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mt-1">View to purchase</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Performers</p>
                <p className="text-2xl font-bold">{insights?.topPerformers?.length || 0}</p>
                <p className="text-sm text-muted-foreground mt-1">High revenue products</p>
              </div>
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Products by Revenue</CardTitle>
          <CardDescription>Your highest earning products</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights?.topPerformers?.slice(0, 10) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="products.name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                labelFormatter={(label) => `Product: ${label}`}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Product Analysis</CardTitle>
          <CardDescription>Filter and analyze your product performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="views">Views</SelectItem>
                <SelectItem value="conversion">Conversion</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="profit">Profit Margin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="high-conversion">High Conversion</SelectItem>
                <SelectItem value="low-conversion">Low Conversion</SelectItem>
                <SelectItem value="high-return">High Returns</SelectItem>
                <SelectItem value="top-rated">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product List */}
          <div className="space-y-4">
            {filteredAndSortedProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <img
                  src={product.products.image_url || '/placeholder-product.jpg'}
                  alt={product.products.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{product.products.name}</h3>
                  <p className="text-sm text-muted-foreground">{formatCurrency(product.products.price)}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm font-medium">{product.views_count}</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{(product.conversion_rate * 100).toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Conversion</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{formatCurrency(product.revenue)}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      <p className="text-sm font-medium">{product.average_rating.toFixed(1)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">({product.review_count})</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  {product.conversion_rate > 0.05 && (
                    <Badge variant="default" className="text-xs">High Convert</Badge>
                  )}
                  {product.return_rate > 0.1 && (
                    <Badge variant="destructive" className="text-xs">High Returns</Badge>
                  )}
                  {product.average_rating >= 4.5 && (
                    <Badge variant="secondary" className="text-xs">Top Rated</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No products found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductPerformance;