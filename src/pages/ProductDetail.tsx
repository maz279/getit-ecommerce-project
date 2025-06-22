
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Star, MapPin, Truck, CreditCard, Shield, Heart, Share2 } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
            <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={product.image || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              {product.titleBn && (
                <h2 className="text-xl text-gray-600 mt-1">{product.titleBn}</h2>
              )}
              
              <div className="flex items-center gap-4 mt-4">
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{product.rating}</span>
                  </div>
                )}
                
                <Badge variant="outline">{product.type}</Badge>
                
                {product.isTrending && (
                  <Badge className="bg-orange-100 text-orange-800">Trending</Badge>
                )}
                
                {product.isFestivalOffer && (
                  <Badge className="bg-red-100 text-red-800">Festival Offer</Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-orange-600">
                  ৳{product.price?.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-400 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              
              {product.discountPercentage && (
                <div className="text-green-600 font-semibold">
                  Save {product.discountPercentage}% (৳{(product.originalPrice - product.price).toLocaleString()})
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
                {product.descriptionBn && (
                  <p className="text-gray-600 mt-2">{product.descriptionBn}</p>
                )}
              </div>
            )}

            {/* Specifications */}
            {product.specifications && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
                <p className="text-gray-600">{product.specifications}</p>
              </div>
            )}

            {/* Vendor Info */}
            {product.vendor && (
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Vendor Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{product.vendor.name}</span>
                    {product.vendor.verified && (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    )}
                  </div>
                  
                  {product.vendor.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{product.vendor.rating} rating</span>
                    </div>
                  )}
                  
                  {product.vendor.location && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{product.vendor.location}</span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                  Add to Cart
                </Button>
                <Button variant="outline">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
              
              <Button variant="outline" className="w-full">
                Buy Now
              </Button>
            </div>

            {/* Delivery & Payment Info */}
            <div className="space-y-3">
              {product.deliveryTime && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Delivery: {product.deliveryTime}</span>
                </div>
              )}
              
              {product.freeShipping && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Truck className="w-4 h-4" />
                  <span>Free Shipping Available</span>
                </div>
              )}
              
              {product.codAvailable && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <CreditCard className="w-4 h-4" />
                  <span>Cash on Delivery Available</span>
                </div>
              )}
              
              {product.vendor?.returnPolicy && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>{product.vendor.returnPolicy}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
