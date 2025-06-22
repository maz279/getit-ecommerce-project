
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { MegaSaleHero } from '../components/megasale/MegaSaleHero';
import { FlashDealsSection } from '../components/megasale/FlashDealsSection';
import { CategoryDealsSection } from '../components/megasale/CategoryDealsSection';
import { BestSellersSection } from '../components/megasale/BestSellersSection';
import { PaymentOffersSection } from '../components/megasale/PaymentOffersSection';
import { CustomerReviewsSection } from '../components/megasale/CustomerReviewsSection';
import { DeliveryPromisesSection } from '../components/megasale/DeliveryPromisesSection';
import { BrandShowcaseSection } from '../components/megasale/BrandShowcaseSection';
import { SaleStatsSection } from '../components/megasale/SaleStatsSection';
import { LimitedTimeOffersSection } from '../components/megasale/LimitedTimeOffersSection';
import { MegaSaleFAQ } from '../components/megasale/MegaSaleFAQ';

const MegaSale: React.FC = () => {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <MegaSaleHero />
        <SaleStatsSection />
        <FlashDealsSection />
        <CategoryDealsSection />
        <BestSellersSection />
        <LimitedTimeOffersSection />
        <BrandShowcaseSection />
        <PaymentOffersSection />
        <DeliveryPromisesSection />
        <CustomerReviewsSection />
        <MegaSaleFAQ />
      </main>
      
      <Footer />
    </div>
  );
};

export default MegaSale;
