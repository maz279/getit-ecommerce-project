
import React from 'react';
import { Star, MapPin, Truck } from 'lucide-react';

interface VendorInfo {
  id: string;
  name: string;
  rating: number;
  location: string;
  products: number;
  verified: boolean;
}

interface ProductInfo {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  vendor: VendorInfo;
  image: string;
  discount?: number;
  freeShipping: boolean;
}

interface ProductGridProps {
  products: ProductInfo[];
  viewMode: 'grid' | 'list';
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, viewMode }) => {
  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
      {products.map((product) => (
        <div key={product.id} className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex gap-4 p-4' : 'p-4'}`}>
          <div className={viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square mb-4'}>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-gray-800 mb-2">{product.name}</h3>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-blue-600 font-medium">{product.vendor.name}</span>
              {product.vendor.verified && (
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">Verified</span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-gray-800">৳{product.price.toLocaleString()}</div>
                {product.originalPrice && (
                  <div className="text-sm text-gray-500 line-through">৳{product.originalPrice.toLocaleString()}</div>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-1">
                {product.discount && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    {product.discount}% OFF
                  </span>
                )}
                {product.freeShipping && (
                  <div className="flex items-center gap-1 text-green-600 text-xs">
                    <Truck className="w-3 h-3" />
                    <span>Free Shipping</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
