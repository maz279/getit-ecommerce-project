
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { NewArrivalsHero } from '../components/newarrivals/NewArrivalsHero';
import { NewArrivalsNavigationMap } from '../components/newarrivals/NewArrivalsNavigationMap';
import { LatestProducts } from '../components/newarrivals/LatestProducts';
import { BrandSpotlight } from '../components/newarrivals/BrandSpotlight';
import { SeasonalCollections } from '../components/newarrivals/SeasonalCollections';

const NewArrivals: React.FC = () => {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <NewArrivalsHero />
        <NewArrivalsNavigationMap />
        <LatestProducts />
        <BrandSpotlight />
        <SeasonalCollections />
      </main>
      
      <Footer />
    </div>
  );
};

export default NewArrivals;
