
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, Filter, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Sample product data
const sampleProducts = [
  {
    id: '1',
    name: 'Cotton Saree - Traditional Design',
    price: 2500,
    originalPrice: 3000,
    rating: 4.5,
    reviews: 156,
    vendor: 'Fashion House BD',
    image: '/placeholder.svg',
    discount: 17,
    freeShipping: true
  },
  {
    id: '2',
    name: 'Embroidered Salwar Kameez',
    price: 1800,
    rating: 4.2,
    reviews: 89,
    vendor: 'Ethnic Wear',
    image: '/placeholder.svg',
    freeShipping: false
  },
  // Add more sample products as needed
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4">
        <div className="relative mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          {product.discount && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              {product.discount}% OFF
            </Badge>
          )}
          <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
            <Heart className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
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
            <span className="text-lg font-bold text-gray-900">৳{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">৳{product.originalPrice}</span>
            )}
          </div>
          
          <div className="text-sm text-gray-600">{product.vendor}</div>
          
          {product.freeShipping && (
            <Badge variant="outline" className="text-green-600">Free Shipping</Badge>
          )}
          
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

  return (
    <div className="p-6">
      {/* Filters and Controls */}
      <div className="flex items-center justify-between mb-6">
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
            Showing {sampleProducts.length} of 10,000+ products
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      <TabsContent value="all" className="mt-0">
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
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
      
      {/* Load More */}
      <div className="text-center mt-8">
        <Button variant="outline" size="lg">
          Load More Products
        </Button>
      </div>
    </div>
  );
};
