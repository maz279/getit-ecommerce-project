
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, Filter, SlidersHorizontal, TrendingUp, Clock, Award, Grid3X3, List, Grid2X2, Eye, Share2, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Enhanced sample product data with real product images
const sampleProducts = [
  {
    id: '1',
    name: 'Premium Cotton Saree - Traditional Bengali Design',
    price: 2500,
    originalPrice: 3000,
    rating: 4.5,
    reviews: 156,
    vendor: 'Fashion House BD',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop',
    discount: 17,
    freeShipping: true,
    location: 'Dhaka',
    verified: true,
    quickDelivery: true,
    sold: 89,
    category: 'Traditional Wear'
  },
  {
    id: '2',
    name: 'Embroidered Salwar Kameez - Festival Collection',
    price: 1800,
    rating: 4.2,
    reviews: 89,
    vendor: 'Ethnic Wear',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop',
    freeShipping: false,
    location: 'Chittagong',
    verified: true,
    quickDelivery: false,
    sold: 45,
    category: 'Salwar Kameez'
  },
  {
    id: '3',
    name: 'Handloom Silk Saree - Pure Dhakai',
    price: 4500,
    originalPrice: 5200,
    rating: 4.8,
    reviews: 234,
    vendor: 'Heritage Textiles',
    image: 'https://images.unsplash.com/photo-1594736797933-d0e501ba2fe6?w=400&h=400&fit=crop',
    discount: 13,
    freeShipping: true,
    location: 'Dhaka',
    verified: true,
    quickDelivery: true,
    sold: 156,
    category: 'Traditional Wear'
  },
  {
    id: '4',
    name: 'Modern Kurti Set with Palazzo',
    price: 1200,
    rating: 4.1,
    reviews: 67,
    vendor: 'Trendy Fashion',
    image: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1e5?w=400&h=400&fit=crop',
    freeShipping: true,
    location: 'Sylhet',
    verified: false,
    quickDelivery: false,
    sold: 23,
    category: 'Kurti & Tops'
  },
  {
    id: '5',
    name: 'Designer Lehenga - Wedding Special',
    price: 8900,
    originalPrice: 12000,
    rating: 4.7,
    reviews: 78,
    vendor: 'Bridal Couture',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
    discount: 26,
    freeShipping: true,
    location: 'Dhaka',
    verified: true,
    quickDelivery: true,
    sold: 12,
    category: 'Traditional Wear'
  },
  {
    id: '6',
    name: 'Western Top & Jeans Combo',
    price: 2200,
    rating: 4.3,
    reviews: 134,
    vendor: 'Urban Style',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    freeShipping: true,
    location: 'Dhaka',
    verified: true,
    quickDelivery: false,
    sold: 67,
    category: 'Western Wear'
  },
  {
    id: '7',
    name: 'Casual Cotton Dress',
    price: 1500,
    rating: 4.0,
    reviews: 92,
    vendor: 'Comfort Zone',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop',
    freeShipping: false,
    location: 'Chittagong',
    verified: true,
    quickDelivery: false,
    sold: 34,
    category: 'Western Wear'
  },
  {
    id: '8',
    name: 'Party Wear Gown',
    price: 3500,
    originalPrice: 4200,
    rating: 4.6,
    reviews: 156,
    vendor: 'Glamour Collection',
    image: 'https://images.unsplash.com/photo-1566479179817-0d0c12e18b3b?w=400&h=400&fit=crop',
    discount: 17,
    freeShipping: true,
    location: 'Dhaka',
    verified: true,
    quickDelivery: true,
    sold: 28,
    category: 'Western Wear'
  }
];

interface ProductGridProps {
  category?: string | null;
  submenu?: string | null;
  tab?: string | null;
  activeTab: string;
  tabType?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  category,
  submenu,
  tab,
  activeTab,
  tabType = 'all'
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
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className={`space-y-2 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
            {product.sold && (
              <span className="text-xs text-gray-500">{product.sold} sold</span>
            )}
          </div>

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

  const getTabContent = () => {
    switch (tabType) {
      case 'all':
        return (
          <div className={`grid gap-4 ${getGridCols()}`}>
            {sampleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        );
      case 'featured':
        return (
          <div className={`grid gap-4 ${getGridCols()}`}>
            {sampleProducts.filter(p => p.rating >= 4.5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        );
      case 'trending':
        return (
          <div className={`grid gap-4 ${getGridCols()}`}>
            {sampleProducts.filter(p => p.sold && p.sold > 50).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        );
      case 'new':
        return (
          <div className={`grid gap-4 ${getGridCols()}`}>
            {sampleProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        );
      case 'bestsellers':
        return (
          <div className={`grid gap-4 ${getGridCols()}`}>
            {sampleProducts.filter(p => p.sold && p.sold > 30).sort((a, b) => (b.sold || 0) - (a.sold || 0)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        );
      default:
        return (
          <div className={`grid gap-4 ${getGridCols()}`}>
            {sampleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        );
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

      {/* Product Content */}
      {getTabContent()}
      
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
