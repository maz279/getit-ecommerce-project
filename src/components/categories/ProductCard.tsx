
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, Eye, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  vendor: string;
  image: string;
  discount?: number;
  freeShipping: boolean;
  location: string;
  verified: boolean;
  quickDelivery: boolean;
  sold: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list' | 'compact';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => (
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
