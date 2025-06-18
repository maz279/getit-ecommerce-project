
import React from 'react';
import { Header } from '../components/homepage/Header';
import { HeroSection } from '../components/homepage/HeroSection';
import { QuickAccessIcons } from '../components/homepage/QuickAccessIcons';
import { FeaturedCategories } from '../components/homepage/FeaturedCategories';
import { FlashSaleSection } from '../components/homepage/FlashSaleSection';
import { PromotionalBanners } from '../components/homepage/PromotionalBanners';
import { MegaSaleSection } from '../components/homepage/MegaSaleSection';
import { NewProductsSection } from '../components/homepage/NewProductsSection';
import { RecommendedSection } from '../components/homepage/RecommendedSection';
import { TopSellingSection } from '../components/homepage/TopSellingSection';
import { Footer } from '../components/homepage/Footer';
import { OfferPopup } from '../components/homepage/OfferPopup';

const Index: React.FC = () => {
  return (
    <div className="bg-white flex flex-col overflow-hidden items-stretch min-h-screen">
      <Header />
      
      <main>
        <HeroSection />
        <QuickAccessIcons />
        <FeaturedCategories />
        <FlashSaleSection />
        <PromotionalBanners />
        <MegaSaleSection />
        <NewProductsSection />
        <RecommendedSection />
        <TopSellingSection />
      </main>
      
      <Footer />
      <OfferPopup />
    </div>
  );
};

export default Index;
