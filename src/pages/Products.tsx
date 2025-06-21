
import React from 'react';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { HeroSection } from '@/components/products/HeroSection';
import { FestivalGreeting } from '@/components/products/FestivalGreeting';
import { CategoriesSection } from '@/components/products/CategoriesSection';
import { BundleOffersSection } from '@/components/products/BundleOffersSection';
import { MobileAppSection } from '@/components/products/MobileAppSection';
import { PaymentOffersSection } from '@/components/products/PaymentOffersSection';
import { DeliverySection } from '@/components/products/DeliverySection';
import { VendorsSection } from '@/components/products/VendorsSection';
import { GiftGuideSection } from '@/components/products/GiftGuideSection';
import { ContestsSection } from '@/components/products/ContestsSection';
import { SocialImpactSection } from '@/components/products/SocialImpactSection';
import { CustomerSupportSection } from '@/components/products/CustomerSupportSection';

const Products: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <Header />
      <HeroSection />
      <FestivalGreeting />
      <CategoriesSection />
      <BundleOffersSection />
      <MobileAppSection />
      <PaymentOffersSection />
      <DeliverySection />
      <VendorsSection />
      <GiftGuideSection />
      <ContestsSection />
      <SocialImpactSection />
      <CustomerSupportSection />
      <Footer />
    </div>
  );
};

export default Products;
