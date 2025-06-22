
import React from 'react';
import { CategoryTabs } from './CategoryTabs';
import { CategoryGrid } from './CategoryGrid';
import { CategoryItemsList } from './CategoryItemsList';
import { CategorySubcategoryGrid } from './CategorySubcategoryGrid';
import { CategoryMainGrid } from './CategoryMainGrid';
import { CategoryProductsSection } from './CategoryProductsSection';

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
  // Get total product count for tabs
  const getTotalProductCount = () => {
    const categoryData = getCategoryData();
    const subcategoryData = getSubcategoryData();
    
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

  // No category selected - show category grid
  if (!selectedCategory) {
    return <CategoryGrid onCategorySelect={(categoryId) => onCategorySelect(categoryId)} />;
  }

  // Sub-subcategory selected with items - show items list
  if (selectedSubSubcategory && getCurrentItems().length > 0) {
    return (
      <CategoryItemsList 
        items={getCurrentItems()} 
        categoryName={selectedSubSubcategory} 
      />
    );
  }

  const categoryData = getCategoryData();
  const subcategoryData = getSubcategoryData();

  // Subcategory selected - show sub-subcategories and products
  if (selectedSubcategory && subcategoryData) {
    const subSubcategories = subcategoryData.subcategories || [];
    
    return (
      <CategoryTabs
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        productCount={getTotalProductCount()}
      >
        <div className="space-y-6">
          <CategorySubcategoryGrid
            subSubcategories={subSubcategories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onCategorySelect={onCategorySelect}
          />
          <CategoryProductsSection
            products={sampleProducts}
            viewMode={viewMode}
          />
        </div>
      </CategoryTabs>
    );
  }

  // Category selected - show subcategories
  if (selectedCategory && categoryData) {
    return (
      <CategoryTabs
        selectedCategory={selectedCategory}
        productCount={getTotalProductCount()}
      >
        <CategoryMainGrid
          categoryData={categoryData}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
        />
      </CategoryTabs>
    );
  }

  // Fallback - show products with tabs
  return (
    <CategoryTabs
      selectedCategory={selectedCategory}
      productCount={sampleProducts.length}
    >
      <CategoryProductsSection
        products={sampleProducts}
        viewMode={viewMode}
      />
    </CategoryTabs>
  );
};
