
import React from 'react';
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

interface CategoryContentProps {
  selectedCategory?: string;
  selectedSubSubcategory?: string;
  viewMode: 'grid' | 'list';
  onCategorySelect: (categoryId: string) => void;
  getCurrentItems: () => string[];
  sampleProducts: ProductInfo[];
}

export const CategoryContent: React.FC<CategoryContentProps> = ({
  selectedCategory,
  selectedSubSubcategory,
  viewMode,
  onCategorySelect,
  getCurrentItems,
  sampleProducts
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

  return <ProductList products={sampleProducts} viewMode={viewMode} />;
};
