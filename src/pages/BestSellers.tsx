
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { BestSellersHero } from '../components/bestsellers/BestSellersHero';
import { BestSellerOffers } from '../components/bestsellers/BestSellerOffers';
import { BestSellersNavigationMap } from '../components/bestsellers/BestSellersNavigationMap';
import { ProductRankings } from '../components/bestsellers/ProductRankings';
import { DealsCountdown } from '../components/bestsellers/DealsCountdown';
import { TopSellingCategories } from '../components/bestsellers/TopSellingCategories';
import { FeaturedBestSellers } from '../components/bestsellers/FeaturedBestSellers';
import { CustomerReviews } from '../components/bestsellers/CustomerReviews';
import { VendorSpotlight } from '../components/bestsellers/VendorSpotlight';
import { TrustBadges } from '../components/bestsellers/TrustBadges';
import { TrendingAnalytics } from '../components/bestsellers/TrendingAnalytics';

const BestSellers: React.FC = () => {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <BestSellersHero />
        <BestSellerOffers />
        <BestSellersNavigationMap />
        <ProductRankings />
        <DealsCountdown />
        <TopSellingCategories />
        <FeaturedBestSellers />
        <CustomerReviews />
        <TrustBadges />
        <VendorSpotlight />
        <TrendingAnalytics />
      </main>
      
      <Footer />
    </div>
  );
};

export default BestSellers;
