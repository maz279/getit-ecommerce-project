
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3X3, List, Star, TrendingUp, Clock, Award } from 'lucide-react';

interface CategoryTabsProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  children: React.ReactNode;
  productCount: number;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  selectedSubcategory,
  children,
  productCount
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Tabs defaultValue="all" className="w-full">
        <div className="border-b bg-gray-50 px-6 py-3">
          <TabsList className="bg-white shadow-sm border h-11">
            <TabsTrigger value="all" className="flex items-center gap-2 px-4">
              <Grid3X3 className="w-4 h-4" />
              All Products ({productCount})
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center gap-2 px-4">
              <Star className="w-4 h-4" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2 px-4">
              <TrendingUp className="w-4 h-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2 px-4">
              <Clock className="w-4 h-4" />
              New Arrivals
            </TabsTrigger>
            <TabsTrigger value="bestsellers" className="flex items-center gap-2 px-4">
              <Award className="w-4 h-4" />
              Best Sellers
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          <TabsContent value="all" className="mt-0">
            {children}
          </TabsContent>
          
          <TabsContent value="featured" className="mt-0">
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Featured Products</h3>
              <p className="text-gray-600">Discover our handpicked featured products in this category</p>
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="mt-0">
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Trending Now</h3>
              <p className="text-gray-600">See what's popular and trending in this category</p>
            </div>
          </TabsContent>
          
          <TabsContent value="new" className="mt-0">
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibant text-gray-800 mb-2">New Arrivals</h3>
              <p className="text-gray-600">Latest products added to this category</p>
            </div>
          </TabsContent>
          
          <TabsContent value="bestsellers" className="mt-0">
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Best Sellers</h3>
              <p className="text-gray-600">Top-selling products in this category</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
