
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { BulkOrdersHero } from '../components/bulkorders/BulkOrdersHero';
import { BulkOrdersNavigationMap } from '../components/bulkorders/BulkOrdersNavigationMap';
import { BulkCategories } from '../components/bulkorders/BulkCategories';
import { PricingTiers } from '../components/bulkorders/PricingTiers';
import { CustomQuotes } from '../components/bulkorders/CustomQuotes';

const BulkOrders: React.FC = () => {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <BulkOrdersHero />
        <BulkOrdersNavigationMap />
        <BulkCategories />
        <PricingTiers />
        <CustomQuotes />
      </main>
      
      <Footer />
    </div>
  );
};

export default BulkOrders;
