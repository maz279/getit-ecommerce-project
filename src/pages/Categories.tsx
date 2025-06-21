
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { CategoryList } from '../components/categories/CategoryList';
import { CategoryBreadcrumb } from '../components/categories/CategoryBreadcrumb';
import { CategoryGrid } from '../components/categories/CategoryGrid';
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
    name: 'Cotton Saree - Traditional Design',
    price: 2500,
    originalPrice: 3000,
    rating: 4.5,
    reviews: 156,
    vendor: { id: '1', name: 'Fashion House BD', rating: 4.8, location: 'Dhaka', products: 250, verified: true },
    image: '/placeholder.svg',
    discount: 17,
    freeShipping: true
  },
  {
    id: '2',
    name: 'Embroidered Salwar Kameez',
    price: 1800,
    rating: 4.2,
    reviews: 89,
    vendor: { id: '2', name: 'Ethnic Wear', rating: 4.6, location: 'Chittagong', products: 180, verified: true },
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
          {/* Left Sidebar */}
          <div className="w-1/4 hidden lg:block">
            <CategoryList 
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory || undefined}
              selectedSubcategory={selectedSubcategory || undefined}
              selectedSubSubcategory={selectedSubSubcategory || undefined}
            />
            <div className="mt-6">
              <CategoryFilters />
            </div>
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
            ) : selectedSubSubcategory && getCurrentItems().length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800">
                  Available Items in {selectedSubSubcategory}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getCurrentItems().map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{item}</h4>
                          <p className="text-sm text-gray-500">Available from verified vendors</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                  {sampleProducts.map((product) => (
                    <div key={product.id} className={`border rounded-lg hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex gap-4 p-4' : 'p-4'}`}>
                      <div className={viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square mb-4'}>
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 mb-2">{product.name}</h3>
                        <div className="text-lg font-bold text-blue-600">৳{product.price.toLocaleString()}</div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">৳{product.originalPrice.toLocaleString()}</div>
                        )}
                        <div className="text-sm text-gray-600 mt-1">{product.vendor.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
