
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { BestSellersHero } from '../components/bestsellers/BestSellersHero';
import { BestSellersNavigationMap } from '../components/bestsellers/BestSellersNavigationMap';
import { TopSellingCategories } from '../components/bestsellers/TopSellingCategories';
import { FeaturedBestSellers } from '../components/bestsellers/FeaturedBestSellers';
import { VendorSpotlight } from '../components/bestsellers/VendorSpotlight';
import { TrendingAnalytics } from '../components/bestsellers/TrendingAnalytics';

const BestSellers: React.FC = () => {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <BestSellersHero />
        <BestSellersNavigationMap />
        <TopSellingCategories />
        <FeaturedBestSellers />
        <VendorSpotlight />
        <TrendingAnalytics />
      </main>
      
      <Footer />
    </div>
  );
};

export default BestSellers;
