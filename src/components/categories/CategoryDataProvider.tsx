
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { categoriesData } from '@/data/categoriesData';
import { CategoryPageState, CategoryPageActions, ProductInfo } from './CategoryPageTypes';

interface CategoryDataContextType extends CategoryPageState, CategoryPageActions {
  getCurrentCategoryData: () => any;
  getCurrentSubcategoryData: () => any;
  getCurrentSubSubcategoryData: () => any;
  getCurrentTitle: () => string;
  getTotalProducts: () => number;
  getDescription: () => string;
  getCurrentItems: () => string[];
  sampleProducts: ProductInfo[];
}

const CategoryDataContext = React.createContext<CategoryDataContextType | null>(null);

export const useCategoryData = () => {
  const context = React.useContext(CategoryDataContext);
  if (!context) {
    throw new Error('useCategoryData must be used within CategoryDataProvider');
  }
  return context;
};

interface CategoryDataProviderProps {
  children: React.ReactNode;
  sampleProducts: ProductInfo[];
}

export const CategoryDataProvider: React.FC<CategoryDataProviderProps> = ({ 
  children, 
  sampleProducts 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const selectedSubcategory = searchParams.get('subcategory');
  const selectedSubSubcategory = searchParams.get('subsubcategory');
  
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = React.useState('popular');
  const [showFilters, setShowFilters] = React.useState(false);

  const handleCategorySelect = (categoryId?: string, subcategoryId?: string, subSubcategoryId?: string) => {
    const params = new URLSearchParams();
    if (categoryId) params.set('category', categoryId);
    if (subcategoryId) params.set('subcategory', subcategoryId);
    if (subSubcategoryId) params.set('subsubcategory', subSubcategoryId);
    setSearchParams(params);
  };

  const getCurrentCategoryData = () => {
    if (!selectedCategory) return null;
    return categoriesData.find(cat => cat.id === selectedCategory);
  };

  const getCurrentSubcategoryData = () => {
    const category = getCurrentCategoryData();
    if (!category || !selectedSubcategory) return null;
    return category.subcategories[selectedSubcategory];
  };

  const getCurrentSubSubcategoryData = () => {
    const subcategory = getCurrentSubcategoryData();
    if (!subcategory || !selectedSubSubcategory) return null;
    return subcategory.subcategories.find(s => s.name === selectedSubSubcategory);
  };

  const getCurrentTitle = () => {
    const category = getCurrentCategoryData();
    const subcategory = getCurrentSubcategoryData();
    
    if (selectedSubSubcategory) {
      return selectedSubSubcategory;
    } else if (subcategory) {
      return subcategory.name;
    } else if (category) {
      return category.name;
    }
    return 'All Categories';
  };

  const getTotalProducts = () => {
    if (selectedSubSubcategory) {
      const subSubcat = getCurrentSubSubcategoryData();
      return subSubcat?.count || 0;
    } else if (selectedSubcategory) {
      const subcategory = getCurrentSubcategoryData();
      return subcategory?.subcategories.reduce((sum, sub) => sum + sub.count, 0) || 0;
    } else if (selectedCategory) {
      const category = getCurrentCategoryData();
      return category?.count || 0;
    }
    return categoriesData.reduce((sum, cat) => sum + cat.count, 0);
  };

  const getDescription = () => {
    return selectedCategory 
      ? `Discover amazing products from trusted vendors across Bangladesh`
      : 'Explore all product categories from verified vendors across Bangladesh';
  };

  const getCurrentItems = () => {
    if (selectedSubSubcategory) {
      const subSubcat = getCurrentSubSubcategoryData();
      return subSubcat?.items || [];
    }
    return [];
  };

  const contextValue: CategoryDataContextType = {
    selectedCategory: selectedCategory || undefined,
    selectedSubcategory: selectedSubcategory || undefined,
    selectedSubSubcategory: selectedSubSubcategory || undefined,
    viewMode,
    sortBy,
    showFilters,
    handleCategorySelect,
    setViewMode,
    setSortBy,
    setShowFilters,
    getCurrentCategoryData,
    getCurrentSubcategoryData,
    getCurrentSubSubcategoryData,
    getCurrentTitle,
    getTotalProducts,
    getDescription,
    getCurrentItems,
    sampleProducts
  };

  return (
    <CategoryDataContext.Provider value={contextValue}>
      {children}
    </CategoryDataContext.Provider>
  );
};
