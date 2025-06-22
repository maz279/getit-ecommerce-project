
import React, { useState } from 'react';
import { Heart, Share2, Eye, ShoppingCart, Star, Truck, Clock, CreditCard, MapPin, Zap, AlertTriangle, Gift, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProductProps {
  id: number;
  name: string;
  nameBn?: string;
  price: number;
  originalPrice?: number;
  image: string;
  vendor: {
    name: string;
    rating: number;
    location: string;
    verified: boolean;
  };
  stock: {
    status: 'in_stock' | 'limited' | 'out_of_stock' | 'preorder';
    quantity?: number;
  };
  delivery: {
    estimatedDays: number;
    cod: boolean;
    freeShipping: boolean;
    express: boolean;
  };
  features: {
    emi: boolean;
    priceHistory: boolean;
    trending: boolean;
    festival: boolean;
  };
  viewMode: 'grid' | 'list' | 'compact';
  onRemove: (id: number) => void;
  onAddToCart: (id: number) => void;
  onShare: (id: number) => void;
  onQuickView: (id: number) => void;
}

export const EnhancedProductCard: React.FC<ProductProps> = ({
  id,
  name,
  nameBn,
  price,
  originalPrice,
  image,
  vendor,
  stock,
  delivery,
  features,
  viewMode,
  onRemove,
  onAddToCart,
  onShare,
  onQuickView
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showNameBn, setShowNameBn] = useState(false);

  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const getStockBadge = () => {
    switch (stock.status) {
      case 'in_stock':
        return { text: 'In Stock', textBn: 'সংগ্রহে আছে', color: 'bg-green-100 text-green-800' };
      case 'limited':
        return { text: 'Limited Stock', textBn: 'সীমিত সংগ্রহ', color: 'bg-orange-100 text-orange-800' };
      case 'out_of_stock':
        return { text: 'Out of Stock', textBn: 'স্টক নেই', color: 'bg-red-100 text-red-800' };
      case 'preorder':
        return { text: 'Pre-order', textBn: 'প্রি-অর্ডার', color: 'bg-blue-100 text-blue-800' };
      default:
        return { text: 'Unknown', textBn: 'অজানা', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const stockBadge = getStockBadge();

  const paymentMethods = [
    { name: 'bKash', color: 'text-pink-600' },
    { name: 'Nagad', color: 'text-orange-600' },
    { name: 'Rocket', color: 'text-purple-600' },
    { name: 'COD', color: 'text-green-600' }
  ];

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative w-32 h-32 flex-shrink-0">
              {!imageLoaded && <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>}
              <img
                src={image}
                alt={name}
                className={`w-full h-full object-cover rounded-lg ${imageLoaded ? 'block' : 'hidden'}`}
                onLoad={() => setImageLoaded(true)}
              />
              {features.festival && (
                <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white text-xs">
                  Eid Special
                </Badge>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h3 
                  className="font-semibold text-lg text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                  onMouseEnter={() => setShowNameBn(true)}
                  onMouseLeave={() => setShowNameBn(false)}
                >
                  {showNameBn && nameBn ? nameBn : name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">Sold by</span>
                  <span className="font-medium text-blue-600">{vendor.name}</span>
                  {vendor.verified && <Badge variant="secondary" className="text-xs">Verified</Badge>}
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{vendor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{vendor.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">৳{price.toLocaleString()}</span>
                  {originalPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">৳{originalPrice.toLocaleString()}</span>
                      <Badge className="bg-red-500 text-white">{discountPercentage}% OFF</Badge>
                    </>
                  )}
                </div>
                <Badge className={stockBadge.color}>{stockBadge.text}</Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  <span>{delivery.estimatedDays} days delivery</span>
                </div>
                {delivery.cod && (
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    <span>COD Available</span>
                  </div>
                )}
                {delivery.freeShipping && (
                  <Badge variant="outline" className="text-green-600 border-green-600">Free Shipping</Badge>
                )}
                {features.emi && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">EMI Available</Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {paymentMethods.map((method, index) => (
                  <Badge key={index} variant="outline" className={`text-xs ${method.color}`}>
                    {method.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(id)}
                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Heart className="w-4 h-4 fill-current" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare(id)}
                className="p-2"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuickView(id)}
                className="p-2"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => onAddToCart(id)}
                disabled={stock.status === 'out_of_stock'}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid and Compact view (similar structure but different sizing)
  const cardSize = viewMode === 'compact' ? 'w-64' : 'w-80';
  const imageHeight = viewMode === 'compact' ? 'h-40' : 'h-48';

  return (
    <Card className={`${cardSize} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden border border-gray-100`}>
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          {!imageLoaded && <div className={`w-full ${imageHeight} bg-gray-200 animate-pulse`}></div>}
          <img
            src={image}
            alt={name}
            className={`w-full ${imageHeight} object-cover group-hover:scale-110 transition-transform duration-500 ${imageLoaded ? 'block' : 'hidden'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {features.festival && (
              <Badge className="bg-gradient-to-r from-red-500 to-yellow-500 text-white">Eid Special</Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white">{discountPercentage}% OFF</Badge>
            )}
            {features.trending && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Trending
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(id)}
              className="p-2 bg-white text-red-500 hover:text-red-600 hover:bg-red-50 shadow-lg"
            >
              <Heart className="w-4 h-4 fill-current" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare(id)}
              className="p-2 bg-white shadow-lg"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onQuickView(id)}
              className="p-2 bg-white shadow-lg"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          {/* Stock Warning */}
          {stock.status === 'limited' && stock.quantity && stock.quantity <= 5 && (
            <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Only {stock.quantity} left!
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 
              className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2"
              onMouseEnter={() => setShowNameBn(true)}
              onMouseLeave={() => setShowNameBn(false)}
            >
              {showNameBn && nameBn ? nameBn : name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">Sold by</span>
              <span className="text-sm font-medium text-blue-600">{vendor.name}</span>
              {vendor.verified && <Badge variant="secondary" className="text-xs">✓</Badge>}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(vendor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({vendor.rating})</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{vendor.location}</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-green-600">৳{price.toLocaleString()}</span>
              {originalPrice && (
                <span className="text-sm text-gray-400 line-through">৳{originalPrice.toLocaleString()}</span>
              )}
              {features.priceHistory && (
                <Button variant="ghost" size="sm" className="p-1">
                  <BarChart3 className="w-3 h-3 text-blue-500" />
                </Button>
              )}
            </div>
            <Badge className={stockBadge.color}>{stockBadge.text}</Badge>
          </div>

          {/* Delivery Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{delivery.estimatedDays} days delivery</span>
              {delivery.express && <Badge variant="outline" className="text-xs">Express</Badge>}
            </div>
            <div className="flex flex-wrap gap-1">
              {delivery.cod && <Badge variant="outline" className="text-xs text-green-600">COD</Badge>}
              {delivery.freeShipping && <Badge variant="outline" className="text-xs text-blue-600">Free Ship</Badge>}
              {features.emi && <Badge variant="outline" className="text-xs text-purple-600">EMI</Badge>}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-wrap gap-1">
            {paymentMethods.slice(0, 3).map((method, index) => (
              <Badge key={index} variant="outline" className={`text-xs ${method.color}`}>
                {method.name}
              </Badge>
            ))}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={() => onAddToCart(id)}
            disabled={stock.status === 'out_of_stock'}
            className="w-full flex items-center justify-center gap-2 font-semibold"
          >
            <ShoppingCart className="w-4 h-4" />
            {stock.status === 'preorder' ? 'Pre-order Now' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
