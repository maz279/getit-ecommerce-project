
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
import { useSEO } from '@/hooks/useSEO';

const MegaSale: React.FC = () => {
  useSEO({
    title: 'Mega Sale 2024 | Up to 80% Off | Biggest Online Shopping Event | GetIt Bangladesh',
    description: 'Join Bangladesh\'s biggest online sale! Up to 80% off on electronics, fashion, home essentials. Limited time offers, flash deals, free delivery. Shop now!',
    keywords: 'mega sale bangladesh, biggest sale, 80% discount, flash deals, limited time offers, online shopping sale, electronics sale, fashion sale',
    canonical: 'https://getit-bangladesh.com/mega-sale',
    ogType: 'website',
    ogImage: 'https://getit-bangladesh.com/images/mega-sale-banner.jpg',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "GetIt Mega Sale 2024",
      "description": "Bangladesh's biggest online shopping event with up to 80% discounts",
      "startDate": new Date().toISOString(),
      "endDate": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
      "location": {
        "@type": "VirtualLocation",
        "url": "https://getit-bangladesh.com/mega-sale"
      },
      "organizer": {
        "@type": "Organization",
        "name": "GetIt Bangladesh",
        "url": "https://getit-bangladesh.com"
      }
    }
  });

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main>
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
