
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, Filter, SlidersHorizontal, TrendingUp, Clock, Award, Grid3X3, List, Grid2X2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Enhanced sample product data
const sampleProducts = [
  {
    id: '1',
    name: 'Premium Cotton Saree - Traditional Bengali Design',
    price: 2500,
    originalPrice: 3000,
    rating: 4.5,
    reviews: 156,
    vendor: 'Fashion House BD',
    image: '/placeholder.svg',
    discount: 17,
    freeShipping: true,
    location: 'Dhaka',
    verified: true,
    quickDelivery: true
  },
  {
    id: '2',
    name: 'Embroidered Salwar Kameez - Festival Collection',
    price: 1800,
    rating: 4.2,
    reviews: 89,
    vendor: 'Ethnic Wear',
    image: '/placeholder.svg',
    freeShipping: false,
    location: 'Chittagong',
    verified: true,
    quickDelivery: false
  },
  {
    id: '3',
    name: 'Handloom Silk Saree - Pure Dhakai',
    price: 4500,
    originalPrice: 5200,
    rating: 4.8,
    reviews: 234,
    vendor: 'Heritage Textiles',
    image: '/placeholder.svg',
    discount: 13,
    freeShipping: true,
    location: 'Dhaka',
    verified: true,
    quickDelivery: true
  },
  {
    id: '4',
    name: 'Modern Kurti Set with Palazzo',
    price: 1200,
    rating: 4.1,
    reviews: 67,
    vendor: 'Trendy Fashion',
    image: '/placeholder.svg',
    freeShipping: true,
    location: 'Sylhet',
    verified: false,
    quickDelivery: false
  }
];

interface ProductGridProps {
  category?: string | null;
  submenu?: string | null;
  tab?: string | null;
  activeTab: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  category,
  submenu,
  tab,
  activeTab
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 h-full">
      <CardContent className={`${viewMode === 'list' ? 'flex gap-4' : ''} ${viewMode === 'compact' ? 'p-3' : 'p-4'}`}>
        <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'mb-3'}`}>
          <img
            src={product.image}
            alt={product.name}
            className={`w-full object-cover rounded-lg ${viewMode === 'list' ? 'h-32' : viewMode === 'compact' ? 'h-32' : 'h-48'}`}
          />
          {product.discount && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              {product.discount}% OFF
            </Badge>
          )}
          <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
            <Heart className="w-4 h-4" />
          </button>
        </div>
        
        <div className={`space-y-2 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <h3 className={`font-semibold text-gray-800 group-hover:text-blue-600 transition-colors ${viewMode === 'compact' ? 'text-sm line-clamp-2' : 'line-clamp-2'}`}>
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`font-bold text-gray-900 ${viewMode === 'compact' ? 'text-base' : 'text-lg'}`}>
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">৳{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{product.vendor}</span>
            {product.verified && (
              <Badge variant="outline" className="text-green-600 text-xs">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Verified
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1">
            {product.freeShipping && (
              <Badge variant="outline" className="text-green-600 text-xs">Free Shipping</Badge>
            )}
            {product.quickDelivery && (
              <Badge variant="outline" className="text-blue-600 text-xs">Quick Delivery</Badge>
            )}
            <Badge variant="outline" className="text-gray-600 text-xs">{product.location}</Badge>
          </div>
          
          <Button className="w-full mt-3" size="sm">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="text-center py-16">
      <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );

  const getGridCols = () => {
    switch (viewMode) {
      case 'compact':
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6';
      case 'list':
        return 'grid-cols-1';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  return (
    <div className="p-6">
      {/* Controls Bar */}
      <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <span className="text-sm text-gray-600">
            Showing {sampleProducts.length} of 2,456,789 products
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Customer Rating</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-2"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'compact' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('compact')}
              className="px-2"
            >
              <Grid2X2 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-2"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <TabsContent value="all" className="mt-0">
        <div className={`grid gap-4 ${getGridCols()}`}>
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="featured" className="mt-0">
        <EmptyState 
          icon={Star}
          title="Featured Products"
          description="Discover our handpicked featured products"
        />
      </TabsContent>
      
      <TabsContent value="trending" className="mt-0">
        <EmptyState 
          icon={TrendingUp}
          title="Trending Now"
          description="See what's popular and trending"
        />
      </TabsContent>
      
      <TabsContent value="new" className="mt-0">
        <EmptyState 
          icon={Clock}
          title="New Arrivals"
          description="Latest products just added"
        />
      </TabsContent>
      
      <TabsContent value="bestsellers" className="mt-0">
        <EmptyState 
          icon={Award}
          title="Best Sellers"
          description="Top-selling products in this category"
        />
      </TabsContent>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          Showing 1-{sampleProducts.length} of 2,456,789 results
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {[1, 2, 3, '...', 15432].map((page, index) => (
              <Button
                key={index}
                variant={page === 1 ? 'default' : 'outline'}
                size="sm"
                className="w-10"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
