
import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { ProductControls } from './ProductControls';
import { ProductPagination } from './ProductPagination';
import { EmptyState } from './EmptyState';
import { ProductGridHeader } from './productGrid/ProductGridHeader';
import { getSareeTypeInfo, getDressTypeInfo, getSalwarKameezTypeInfo, getSuitsTypeInfo } from './productGrid/categoryInfoUtils';
import { getFilteredProducts } from './productGrid/productDataManager';
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

  const filteredProducts = getFilteredProducts(tab, tabType);

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

  // Get category information
  const sareeInfo = tab ? getSareeTypeInfo(tab) : null;
  const dressInfo = tab ? getDressTypeInfo(tab) : null;
  const salwarKameezInfo = tab ? getSalwarKameezTypeInfo(tab) : null;
  const suitsInfo = tab ? getSuitsTypeInfo(tab) : null;

  // Determine color scheme based on category
  const getColorScheme = () => {
    if (sareeInfo) return 'saree';
    if (dressInfo) return 'dress';
    if (salwarKameezInfo) return 'salwar';
    if (suitsInfo) return 'suits';
    return 'saree';
  };

  return (
    <div className="p-6">
      {/* Category Headers */}
      <ProductGridHeader 
        categoryInfo={sareeInfo || dressInfo || salwarKameezInfo || suitsInfo} 
        colorScheme={getColorScheme()}
      />

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
        totalProducts={(tab && (sareeInfo || dressInfo || salwarKameezInfo || suitsInfo)) ? filteredProducts.length : 2456789}
      />
    </div>
  );
};
