
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { NewArrivalsHero } from '../components/newarrivals/NewArrivalsHero';
import { NewArrivalsNavigationMap } from '../components/newarrivals/NewArrivalsNavigationMap';
import { LatestProducts } from '../components/newarrivals/LatestProducts';
import { BrandSpotlight } from '../components/newarrivals/BrandSpotlight';
import { SeasonalCollections } from '../components/newarrivals/SeasonalCollections';
import { TodaysArrivals } from '../components/newarrivals/TodaysArrivals';
import { CategoryShowcase } from '../components/newarrivals/CategoryShowcase';
import { LimitedTimeOffers } from '../components/newarrivals/LimitedTimeOffers';
import { CustomerFavorites } from '../components/newarrivals/CustomerFavorites';
import { PreOrderSection } from '../components/newarrivals/PreOrderSection';
import { TrendingNow } from '../components/newarrivals/TrendingNow';
import { RecentlyLaunched } from '../components/newarrivals/RecentlyLaunched';
import { NewArrivalsStats } from '../components/newarrivals/NewArrivalsStats';

const NewArrivals: React.FC = () => {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <NewArrivalsHero />
        <NewArrivalsNavigationMap />
        <NewArrivalsStats />
        <TodaysArrivals />
        <CategoryShowcase />
        <LimitedTimeOffers />
        <TrendingNow />
        <LatestProducts />
        <CustomerFavorites />
        <BrandSpotlight />
        <RecentlyLaunched />
        <PreOrderSection />
        <SeasonalCollections />
      </main>
      
      <Footer />
    </div>
  );
};

export default NewArrivals;
