
import React from 'react';
import { CategoryBreadcrumb } from './CategoryBreadcrumb';
import { CategoryTabs } from './CategoryTabs';
import { ProductGrid } from './ProductGrid';
import { Card } from '@/components/ui/card';
import { categoriesData, MainCategory } from '@/data/categoriesData';

interface SubmenuItem {
  name: string;
  subcategories: Array<{
    name: string;
    count: number;
  }>;
}

interface CategoryMainContentProps {
  selectedCategory?: string | null;
  selectedSubcategory?: string | null;
  selectedSubSubcategory?: string | null;
  currentCategory?: MainCategory | null;
  currentSubmenu?: SubmenuItem | null;
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
}

export const CategoryMainContent: React.FC<CategoryMainContentProps> = ({
  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory,
  currentCategory,
  currentSubmenu,
  activeTab,
  onActiveTabChange
}) => {
  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        {/* Category Overview */}
        <Card className="p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Our Categories
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover millions of products across hundreds of categories from trusted vendors
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categoriesData.slice(0, 12).map((category) => (
              <div
                key={category.id}
                className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color} text-white mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="font-medium text-sm text-center text-gray-800">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {category.count.toLocaleString()} items
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Featured Categories */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesData.filter(cat => cat.featured).map((category) => (
              <div
                key={category.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg border hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                      {category.icon}
                    </div>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Hot
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-white/80 text-sm">
                      {category.count.toLocaleString()} products available
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Breadcrumb */}
      <CategoryBreadcrumb
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        selectedSubSubcategory={selectedSubSubcategory}
        currentCategory={currentCategory}
        currentSubmenu={currentSubmenu}
      />

      {/* Main Content */}
      <Card className="shadow-sm rounded-lg overflow-hidden">
        {/* Tabs Section */}
        {selectedSubcategory && (
          <CategoryTabs
            submenu={currentSubmenu}
            selectedTab={selectedSubSubcategory}
            activeTab={activeTab}
            onTabSelect={() => {}} // Will be handled by URL params
            onActiveTabChange={onActiveTabChange}
          />
        )}
        
        {/* Product Grid Section */}
        <ProductGrid
          category={selectedCategory}
          submenu={selectedSubcategory}
          tab={selectedSubSubcategory}
          activeTab={activeTab}
        />
      </Card>
    </div>
  );
};
