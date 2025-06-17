import React from 'react';
import { Header } from '../components/homepage/Header';
import { HeroSection } from '../components/homepage/HeroSection';
import { QuickAccessIcons } from '../components/homepage/QuickAccessIcons';
import { FeaturedCategories } from '../components/homepage/FeaturedCategories';
import { FlashSaleSection } from '../components/homepage/FlashSaleSection';
import { PromotionalBanners } from '../components/homepage/PromotionalBanners';
import { TrendingProducts } from '../components/homepage/TrendingProducts';
import { ARShowcase } from '../components/homepage/ARShowcase';
import { ContestSections } from '../components/homepage/ContestSections';
import { Footer } from '../components/homepage/Footer';

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
        <TrendingProducts />
        <ARShowcase />
        <ContestSections />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
