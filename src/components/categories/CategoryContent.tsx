
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryGrid } from './CategoryGrid';
import { CategoryItemsList } from './CategoryItemsList';
import { ProductList } from './ProductList';

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

interface SubCategory {
  name: string;
  count: number;
  items?: string[];
}

interface CategoryData {
  name: string;
  subcategories: SubCategory[];
}

interface MainCategoryData {
  id: string;
  name: string;
  subcategories: {
    [key: string]: CategoryData;
  };
}

interface CategoryContentProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedSubSubcategory?: string;
  viewMode: 'grid' | 'list';
  onCategorySelect: (categoryId: string) => void;
  getCurrentItems: () => string[];
  sampleProducts: ProductInfo[];
  getCategoryData: () => MainCategoryData | null;
  getSubcategoryData: () => CategoryData | null;
}

export const CategoryContent: React.FC<CategoryContentProps> = ({
  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory,
  viewMode,
  onCategorySelect,
  getCurrentItems,
  sampleProducts,
  getCategoryData,
  getSubcategoryData
}) => {
  if (!selectedCategory) {
    return <CategoryGrid onCategorySelect={onCategorySelect} />;
  }

  if (selectedSubSubcategory && getCurrentItems().length > 0) {
    return (
      <CategoryItemsList 
        items={getCurrentItems()} 
        categoryName={selectedSubSubcategory} 
      />
    );
  }

  // Get current category and subcategory data
  const categoryData = getCategoryData();
  const subcategoryData = getSubcategoryData();

  // If we have a subcategory selected, show tabs for its sub-subcategories
  if (selectedSubcategory && subcategoryData) {
    const subSubcategories = subcategoryData.subcategories || [];
    
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <Tabs defaultValue={subSubcategories[0]?.name || 'all'} className="w-full">
          <div className="border-b px-6 py-4">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="all" className="whitespace-nowrap">All Products</TabsTrigger>
              {subSubcategories.map((subSub: SubCategory) => (
                <TabsTrigger 
                  key={subSub.name} 
                  value={subSub.name}
                  className="whitespace-nowrap"
                >
                  {subSub.name} ({subSub.count})
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="all">
              <ProductList products={sampleProducts} viewMode={viewMode} gridSize="small" />
            </TabsContent>
            
            {subSubcategories.map((subSub: SubCategory) => (
              <TabsContent key={subSub.name} value={subSub.name}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{subSub.name}</h3>
                    <span className="text-sm text-gray-500">{subSub.count} products available</span>
                  </div>
                  <ProductList 
                    products={sampleProducts.filter((_, index) => index % 3 === subSubcategories.indexOf(subSub) % 3)} 
                    viewMode={viewMode} 
                    gridSize="small"
                  />
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    );
  }

  // If we have a category but no subcategory, show subcategories as cards
  if (selectedCategory && categoryData) {
    const subcategories = Object.values(categoryData.subcategories || {}) as CategoryData[];
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">{categoryData.name}</h2>
            <span className="text-sm text-gray-500">
              {subcategories.reduce((total, sub) => total + (sub.subcategories?.reduce((subTotal, subSub) => subTotal + subSub.count, 0) || 0), 0)} products available
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map((sub: CategoryData) => (
              <div key={sub.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-gray-800 mb-3">{sub.name}</h3>
                
                {sub.subcategories && sub.subcategories.length > 0 ? (
                  <div className="space-y-2">
                    {sub.subcategories.slice(0, 4).map((subSub: SubCategory) => (
                      <div key={subSub.name} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{subSub.name}</span>
                        <span className="text-gray-400">({subSub.count})</span>
                      </div>
                    ))}
                    {sub.subcategories.length > 4 && (
                      <div className="text-xs text-blue-600">+{sub.subcategories.length - 4} more</div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No subcategories available</div>
                )}
                
                <div className="mt-4 pt-3 border-t">
                  <div className="text-sm font-medium text-blue-600">
                    {sub.subcategories?.reduce((total: number, subSub: SubCategory) => total + subSub.count, 0) || 0} products
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fallback to regular product list
  return <ProductList products={sampleProducts} viewMode={viewMode} gridSize="small" />;
};
