
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star, MapPin, Shield, TrendingUp, Award } from 'lucide-react';

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

interface CategoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  products: ProductInfo[];
  category: any;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeTab,
  onTabChange,
  products,
  category
}) => {
  const sampleVendors = [
    { id: '1', name: 'Fashion House BD', rating: 4.8, location: 'Dhaka', products: 250, verified: true },
    { id: '2', name: 'Ethnic Wear', rating: 4.6, location: 'Chittagong', products: 180, verified: true },
    { id: '3', name: 'Traditional Styles', rating: 4.5, location: 'Sylhet', products: 120, verified: false }
  ];

  const sampleReviews = [
    { id: '1', user: 'Fatima Ahmed', rating: 5, comment: 'Excellent quality saree, very satisfied!', date: '2 days ago' },
    { id: '2', user: 'Rashida Khan', rating: 4, comment: 'Good fabric and fast delivery.', date: '1 week ago' },
    { id: '3', user: 'Nasreen Ali', rating: 5, comment: 'Beautiful design and perfect fit.', date: '2 weeks ago' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="products" className="text-xs">Top Products</TabsTrigger>
          <TabsTrigger value="vendors" className="text-xs">Top Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-3 mt-0">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="font-medium text-sm">Trending Now</h3>
          </div>
          
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="flex gap-3 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">{product.rating}</span>
                </div>
                <p className="text-xs font-bold text-blue-600">৳{product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}

          <div className="mt-4 pt-3 border-t">
            <h4 className="font-medium text-xs mb-2">Quick Filters</h4>
            <div className="space-y-1">
              <button className="text-xs text-blue-600 hover:underline block">Price: Under ৳2,000</button>
              <button className="text-xs text-blue-600 hover:underline block">Free Shipping</button>
              <button className="text-xs text-blue-600 hover:underline block">Verified Vendors</button>
              <button className="text-xs text-blue-600 hover:underline block">New Arrivals</button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-3 mt-0">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-green-600" />
            <h3 className="font-medium text-sm">Top Rated</h3>
          </div>

          {sampleVendors.map((vendor) => (
            <div key={vendor.id} className="p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-800">{vendor.name}</span>
                {vendor.verified && (
                  <Shield className="w-3 h-3 text-green-600" />
                )}
              </div>
              
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">{vendor.rating}</span>
                <span className="text-xs text-gray-400">({vendor.products} products)</span>
              </div>
              
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-600">{vendor.location}</span>
              </div>
            </div>
          ))}

          <div className="mt-4 pt-3 border-t">
            <h4 className="font-medium text-xs mb-2">Vendor Features</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-green-600" />
                <span className="text-xs text-gray-600">Verified Sellers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-gray-600">4.5+ Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-gray-600">Local Delivery</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Category Stats */}
      {category && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium text-sm mb-2">Category Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Total Products</span>
              <span className="text-xs font-medium">{category.count.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Active Vendors</span>
              <span className="text-xs font-medium">450+</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Avg. Rating</span>
              <span className="text-xs font-medium">4.3 ⭐</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
