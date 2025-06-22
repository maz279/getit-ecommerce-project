
import React, { useState } from 'react';
import { Header } from '../components/homepage/Header';
import { EnhancedFlashSaleHero } from '../components/flashsale/EnhancedFlashSaleHero';
import { CategoryQuickAccess } from '../components/flashsale/CategoryQuickAccess';
import { FlashSaleFilters } from '../components/flashsale/FlashSaleFilters';
import { FlashSaleProductGrid } from '../components/flashsale/FlashSaleProductGrid';
import { PaymentMethodsSection } from '../components/flashsale/PaymentMethodsSection';
import { DeliveryOptionsSection } from '../components/flashsale/DeliveryOptionsSection';
import { CustomerReviewsSection } from '../components/flashsale/CustomerReviewsSection';
import { TrustIndicatorsSection } from '../components/flashsale/TrustIndicatorsSection';
import { Footer } from '../components/homepage/Footer';
import { useFlashSaleTimer } from '../hooks/useFlashSaleTimer';
import { generateFlashProducts, categories } from '../data/flashSaleData';

const FlashSale: React.FC = () => {
  const timeLeft = useFlashSaleTimer({
    hours: 2,
    minutes: 34,
    seconds: 56
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  const flashProducts = generateFlashProducts();

  const filteredProducts = flashProducts.filter(product => {
    if (selectedCategory !== 'all') return Math.random() > 0.3; // Mock filtering
    return product.salePrice >= priceRange[0] && product.salePrice <= priceRange[1];
  });

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <EnhancedFlashSaleHero timeLeft={timeLeft} />
        
        <CategoryQuickAccess />
        
        <FlashSaleFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />

        <FlashSaleProductGrid
          products={filteredProducts}
          viewMode={viewMode}
        />

        <PaymentMethodsSection />
        
        <DeliveryOptionsSection />
        
        <CustomerReviewsSection />
        
        <TrustIndicatorsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default FlashSale;
