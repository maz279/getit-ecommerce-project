
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Star, ShoppingCart, Heart, Eye } from 'lucide-react';

interface FlashDealCardProps {
  product: {
    image: string;
    title: string;
    originalPrice: string;
    salePrice: string;
    discount: string;
    freeItem: string;
    delivery: string;
    rating: number;
    reviews: number;
    stockLeft: number;
  };
  isCompact?: boolean;
}

export const FlashDealCard: React.FC<FlashDealCardProps> = ({ product, isCompact = false }) => {
  if (isCompact) {
    return (
      <Card className="group relative overflow-hidden border border-red-100 hover:border-red-300 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={product.image} 
              alt={product.title}
              className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Flame className="w-2 h-2" />
                {product.discount}
              </div>
            </div>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="secondary" className="p-1 rounded-full h-6 w-6">
                <Heart className="w-3 h-3" />
              </Button>
            </div>

            <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              {product.stockLeft} left!
            </div>
          </div>
          
          <div className="p-3">
            <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
              {product.title.length > 30 ? product.title.substring(0, 30) + '...' : product.title}
            </h3>
            
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-2 h-2 ${
                      i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                ({product.reviews})
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-green-600">{product.salePrice}</span>
                <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
              </div>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-1.5 text-xs shadow-md">
              <ShoppingCart className="w-3 h-3 mr-1" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden border-2 border-red-100 hover:border-red-300 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
              <Flame className="w-3 h-3" />
              {product.discount}
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              {product.freeItem}
            </div>
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="p-2 rounded-full">
              <Heart className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="p-2 rounded-full">
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          <div className="absolute bottom-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            Only {product.stockLeft} left!
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews.toLocaleString()})
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-green-600">{product.salePrice}</span>
              <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
            </div>
            <div className="text-right text-sm text-gray-600">
              🚚 {product.delivery}
            </div>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-2 shadow-lg transform hover:scale-105 transition-all">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
