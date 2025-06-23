
import React from 'react';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { HeroSection } from '@/components/products/HeroSection';
import { FestivalGreeting } from '@/components/products/FestivalGreeting';
import { CategoriesSection } from '@/components/products/CategoriesSection';
import { FlashDealsSection } from '@/components/products/FlashDealsSection';
import { BundleOffersSection } from '@/components/products/BundleOffersSection';
import { MobileAppSection } from '@/components/products/MobileAppSection';
import { PaymentOffersSection } from '@/components/products/PaymentOffersSection';
import { DeliverySection } from '@/components/products/DeliverySection';
import { VendorsSection } from '@/components/products/VendorsSection';
import { GiftGuideSection } from '@/components/products/GiftGuideSection';
import { ContestsSection } from '@/components/products/ContestsSection';
import { SocialImpactSection } from '@/components/products/SocialImpactSection';
import { CustomerSupportSection } from '@/components/products/CustomerSupportSection';
import { useSEO } from '@/hooks/useSEO';

const Products: React.FC = () => {
  useSEO({
    title: 'All Products | Complete Product Catalog | GetIt Bangladesh',
    description: 'Explore our complete product catalog. Electronics, fashion, home & garden, books, toys and more. Quality products from verified vendors across Bangladesh.',
    keywords: 'all products bangladesh, product catalog, electronics, fashion, home garden, books, toys, complete collection, verified vendors',
    canonical: 'https://getit-bangladesh.com/products',
    ogType: 'website',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "All Products - Complete Catalog",
      "description": "Complete product catalog featuring electronics, fashion, home essentials and more from verified vendors",
      "url": "https://getit-bangladesh.com/products",
      "isPartOf": {
        "@type": "WebSite",
        "name": "GetIt Bangladesh",
        "url": "https://getit-bangladesh.com"
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <Header />
      <HeroSection />
      <FestivalGreeting />
      <CategoriesSection />
      <FlashDealsSection />
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
