
import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { ProductControls } from './ProductControls';
import { ProductPagination } from './ProductPagination';
import { EmptyState } from './EmptyState';
import { sampleProducts } from '@/data/sampleProducts';
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
        totalProducts={2456789}
      />
    </div>
  );
};
