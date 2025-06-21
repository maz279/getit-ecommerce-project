
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { CategoryList } from '../components/categories/CategoryList';
import { CategoryBreadcrumb } from '../components/categories/CategoryBreadcrumb';
import { CategoryGrid } from '../components/categories/CategoryGrid';
import { ProductGrid } from '../components/categories/ProductGrid';
import { CategoryFilters } from '../components/categories/CategoryFilters';
import { CategoryHeader } from '../components/categories/CategoryHeader';
import { categoriesData } from '@/data/categoriesData';

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

// Sample product data for demonstration
const sampleProducts: ProductInfo[] = [
  {
    id: '1',
    name: 'Samsung Galaxy A54 5G',
    price: 45000,
    originalPrice: 50000,
    rating: 4.5,
    reviews: 156,
    vendor: { id: '1', name: 'Tech Zone BD', rating: 4.8, location: 'Dhaka', products: 250, verified: true },
    image: '/placeholder.svg',
    discount: 10,
    freeShipping: true
  },
  {
    id: '2',
    name: 'Cotton Punjabi for Men',
    price: 1500,
    rating: 4.2,
    reviews: 89,
    vendor: { id: '2', name: 'Fashion House', rating: 4.6, location: 'Chittagong', products: 180, verified: true },
    image: '/placeholder.svg',
    freeShipping: false
  }
];

const Categories: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const selectedSubcategory = searchParams.get('subcategory');
  const selectedSubSubcategory = searchParams.get('subsubcategory');
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

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

  const getCurrentTitle = () => {
    const category = getCurrentCategoryData();
    const subcategory = getCurrentSubcategoryData();
    
    if (selectedSubSubcategory) {
      return selectedSubSubcategory;
    } else if (subcategory) {
      return `${subcategory.name} (${subcategory.nameBn})`;
    } else if (category) {
      return `${category.name} (${category.nameBn})`;
    }
    return 'All Categories';
  };

  const getTotalProducts = () => {
    if (selectedSubSubcategory) {
      const subcategory = getCurrentSubcategoryData();
      const subSubcat = subcategory?.subcategories.find(s => s.name === selectedSubSubcategory);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <CategoryBreadcrumb 
          selectedCategory={selectedCategory || undefined}
          selectedSubcategory={selectedSubcategory || undefined}
          selectedSubSubcategory={selectedSubSubcategory || undefined}
          onNavigate={handleCategorySelect}
        />

        <div className="flex gap-6">
          {/* Enhanced Sidebar */}
          <div className="w-1/4 hidden lg:block">
            <CategoryList 
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory || undefined}
              selectedSubcategory={selectedSubcategory || undefined}
            />
            <CategoryFilters />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header Section */}
            <CategoryHeader
              title={getCurrentTitle()}
              description={getDescription()}
              productCount={getTotalProducts()}
              viewMode={viewMode}
              sortBy={sortBy}
              showFilters={showFilters}
              onViewModeChange={setViewMode}
              onSortChange={setSortBy}
              onToggleFilters={() => setShowFilters(!showFilters)}
            />

            {/* Category Grid or Product Results */}
            {!selectedCategory ? (
              <CategoryGrid onCategorySelect={handleCategorySelect} />
            ) : (
              <ProductGrid products={sampleProducts} viewMode={viewMode} />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
