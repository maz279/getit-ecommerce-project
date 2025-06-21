
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star, MapPin, Shield, TrendingUp, Award, Filter, Package } from 'lucide-react';

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
    { id: '1', name: 'Fashion House BD', rating: 4.8, location: 'New York', products: 250, verified: true },
    { id: '2', name: 'Ethnic Wear Store', rating: 4.6, location: 'Los Angeles', products: 180, verified: true },
    { id: '3', name: 'Traditional Styles', rating: 4.5, location: 'Chicago', products: 120, verified: false },
    { id: '4', name: 'Modern Fashion', rating: 4.7, location: 'Miami', products: 95, verified: true }
  ];

  const quickFilters = [
    { label: 'Under $50', count: 245 },
    { label: 'Free Shipping', count: 189 },
    { label: 'On Sale', count: 156 },
    { label: 'New Arrivals', count: 89 },
    { label: 'Top Rated', count: 134 },
    { label: 'Premium Brands', count: 67 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-50">
          <TabsTrigger value="products" className="text-xs font-medium">
            <Package className="w-3 h-3 mr-1" />
            Products
          </TabsTrigger>
          <TabsTrigger value="vendors" className="text-xs font-medium">
            <Shield className="w-3 h-3 mr-1" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="filters" className="text-xs font-medium">
            <Filter className="w-3 h-3 mr-1" />
            Filters
          </TabsTrigger>
        </TabsList>

        <div className="p-4">
          <TabsContent value="products" className="space-y-4 mt-0">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-sm">Trending Products</h3>
            </div>
            
            <div className="space-y-3">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded border" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-bold text-blue-600">${product.price.toLocaleString()}</p>
                      {product.discount && (
                        <span className="text-xs bg-red-100 text-red-600 px-1 rounded">-{product.discount}%</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium text-sm mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left text-sm text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors">
                  View All Products →
                </button>
                <button className="w-full text-left text-sm text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors">
                  Compare Products
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vendors" className="space-y-4 mt-0">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-green-600" />
              <h3 className="font-semibold text-sm">Top Rated Vendors</h3>
            </div>

            <div className="space-y-3">
              {sampleVendors.map((vendor) => (
                <div key={vendor.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">{vendor.name}</span>
                    {vendor.verified && (
                      <Shield className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{vendor.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">{vendor.products} products</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{vendor.location}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium text-sm mb-3">Vendor Benefits</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-3 h-3 text-green-600" />
                  <span>Verified Sellers</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span>Quality Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="filters" className="space-y-4 mt-0">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-purple-600" />
              <h3 className="font-semibold text-sm">Quick Filters</h3>
            </div>

            <div className="space-y-2">
              {quickFilters.map((filter, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                >
                  <span>{filter.label}</span>
                  <span className="text-xs text-gray-400">({filter.count})</span>
                </button>
              ))}
            </div>

            {/* Category Stats */}
            {category && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium text-sm mb-3">Category Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Total Products</span>
                    <span className="text-xs font-medium">{category.count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Active Vendors</span>
                    <span className="text-xs font-medium">250+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Avg. Rating</span>
                    <span className="text-xs font-medium">4.3 ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Price Range</span>
                    <span className="text-xs font-medium">$10 - $500</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
