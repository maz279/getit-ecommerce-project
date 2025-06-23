
import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { ProductControls } from './ProductControls';
import { ProductPagination } from './ProductPagination';
import { EmptyState } from './EmptyState';
import { sampleProducts } from '@/data/sampleProducts';
import { cottonSareeProducts } from '@/data/products/cottonSareeProducts';
import { Search } from 'lucide-react';

interface ProductGridProps {
  category?: string | null;
  submenu?: string | null;
  tab?: string | null;
  activeTab: string;
  tabType?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  category,
  submenu,
  tab,
  activeTab,
  tabType = 'all'
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const getGridCols = () => {
    switch (viewMode) {
      case 'compact':
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6';
      case 'list':
        return 'grid-cols-1';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  const getFilteredProducts = () => {
    // Check if we're specifically viewing Cotton Saree products
    if (tab === 'Cotton Saree' || (category === 'fashion' && submenu === 'womens-fashion' && tab === 'Cotton Saree')) {
      console.log('Showing Cotton Saree products');
      return cottonSareeProducts;
    }

    // Default product filtering logic
    switch (tabType) {
      case 'featured':
        return sampleProducts.filter(p => p.rating >= 4.5);
      case 'trending':
        return sampleProducts.filter(p => p.sold && p.sold > 50);
      case 'new':
        return sampleProducts.slice(0, 4);
      case 'bestsellers':
        return sampleProducts.filter(p => p.sold && p.sold > 30).sort((a, b) => (b.sold || 0) - (a.sold || 0));
      default:
        return sampleProducts;
    }
  };

  const filteredProducts = getFilteredProducts();

  const renderProductGrid = () => {
    if (filteredProducts.length === 0) {
      return (
        <EmptyState
          icon={Search}
          title="No products found"
          description="Try adjusting your filters or search criteria"
        />
      );
    }

    return (
      <div className={`grid gap-4 ${getGridCols()}`}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} viewMode={viewMode} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header section for Cotton Saree category */}
      {tab === 'Cotton Saree' && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cotton Saree Collection</h2>
          <p className="text-gray-600 mb-4">
            Discover our premium collection of authentic Bengali cotton sarees. From traditional handloom designs to modern printed patterns, find the perfect saree for every occasion.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              ✓ 100% Pure Cotton
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              ✓ Handloom Available
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              ✓ Traditional Designs
            </span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              ✓ Free Shipping
            </span>
          </div>
        </div>
      )}

      <ProductControls
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalProducts={filteredProducts.length}
      />

      {renderProductGrid()}
      
      <ProductPagination
        currentProducts={filteredProducts.length}
        totalProducts={tab === 'Cotton Saree' ? cottonSareeProducts.length : 2456789}
      />
    </div>
  );
};
