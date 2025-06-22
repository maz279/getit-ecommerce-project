
import React from 'react';
import { CategoryTabs } from './CategoryTabs';
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
  onCategorySelect: (categoryId?: string, subcategoryId?: string, subSubcategoryId?: string) => void;
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
    return <CategoryGrid onCategorySelect={(categoryId) => onCategorySelect(categoryId)} />;
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

  // Get total product count for tabs
  const getTotalProductCount = () => {
    if (selectedSubSubcategory) {
      const subSubcat = subcategoryData?.subcategories.find(s => s.name === selectedSubSubcategory);
      return subSubcat?.count || 0;
    } else if (selectedSubcategory && subcategoryData) {
      return subcategoryData.subcategories.reduce((sum, sub) => sum + sub.count, 0);
    } else if (categoryData) {
      return Object.values(categoryData.subcategories).reduce((sum, sub) => 
        sum + sub.subcategories.reduce((subSum, subSub) => subSum + subSub.count, 0), 0
      );
    }
    return sampleProducts.length;
  };

  // If we have a subcategory selected, show enhanced tabs with sub-subcategories
  if (selectedSubcategory && subcategoryData) {
    const subSubcategories = subcategoryData.subcategories || [];
    
    return (
      <CategoryTabs
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        productCount={getTotalProductCount()}
      >
        <div className="space-y-6">
          {/* Sub-subcategories Grid */}
          {subSubcategories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Browse by Subcategory</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {subSubcategories.map((subSub: SubCategory) => (
                  <div 
                    key={subSub.name}
                    onClick={() => onCategorySelect(selectedCategory, selectedSubcategory, subSub.name)}
                    className="border rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                  >
                    <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                      {subSub.name}
                    </h4>
                    <p className="text-sm text-gray-500">{subSub.count} products</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">All Products</h3>
              <span className="text-sm text-gray-500">{sampleProducts.length} items</span>
            </div>
            <ProductList products={sampleProducts} viewMode={viewMode} gridSize="small" />
          </div>
        </div>
      </CategoryTabs>
    );
  }

  // If we have a category but no subcategory, show subcategories as enhanced cards
  if (selectedCategory && categoryData) {
    const subcategories = Object.values(categoryData.subcategories) as CategoryData[];
    
    return (
      <CategoryTabs
        selectedCategory={selectedCategory}
        productCount={getTotalProductCount()}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">{categoryData.name}</h2>
            <span className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
              {subcategories.reduce((total, sub) => total + (sub.subcategories?.reduce((subTotal, subSub) => subTotal + subSub.count, 0) || 0), 0)} total products
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map((sub: CategoryData, index) => (
              <div 
                key={sub.name}
                onClick={() => onCategorySelect(selectedCategory, Object.keys(categoryData.subcategories)[index])}
                className="border rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-lg">
                    {sub.name}
                  </h3>
                  <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                    {sub.subcategories?.reduce((total: number, subSub: SubCategory) => total + subSub.count, 0) || 0}
                  </div>
                </div>
                
                {sub.subcategories && sub.subcategories.length > 0 ? (
                  <div className="space-y-2">
                    {sub.subcategories.slice(0, 4).map((subSub: SubCategory) => (
                      <div key={subSub.name} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 group-hover:text-gray-700">{subSub.name}</span>
                        <span className="text-gray-400 bg-gray-100 px-2 py-0.5 rounded">({subSub.count})</span>
                      </div>
                    ))}
                    {sub.subcategories.length > 4 && (
                      <div className="text-xs text-blue-600 font-medium">
                        +{sub.subcategories.length - 4} more categories
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No subcategories available</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CategoryTabs>
    );
  }

  // Fallback to regular product list with tabs
  return (
    <CategoryTabs
      selectedCategory={selectedCategory}
      productCount={sampleProducts.length}
    >
      <ProductList products={sampleProducts} viewMode={viewMode} gridSize="small" />
    </CategoryTabs>
  );
};
