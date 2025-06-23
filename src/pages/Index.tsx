
import React from 'react';
import { Header } from '../components/homepage/Header';
import { HeroSection } from '../components/homepage/HeroSection';
import { QuickAccessIcons } from '../components/homepage/QuickAccessIcons';
import { FeaturedCategories } from '../components/homepage/FeaturedCategories';
import { FlashSaleSection } from '../components/homepage/FlashSaleSection';
import { PromotionalBanners } from '../components/homepage/PromotionalBanners';
import { MegaSaleSection } from '../components/homepage/MegaSaleSection';
import { TrendingProducts } from '../components/homepage/TrendingProducts';
import { NewProductsSection } from '../components/homepage/NewProductsSection';
import { RecommendedSection } from '../components/homepage/RecommendedSection';
import { TopSellingSection } from '../components/homepage/TopSellingSection';
import { VendorCTA } from '../components/homepage/VendorCTA';
import { TrustIndicators } from '../components/homepage/TrustIndicators';
import { BangladeshFeatures } from '../components/homepage/BangladeshFeatures';
import { Footer } from '../components/homepage/Footer';
import { useSEO } from '@/hooks/useSEO';

const Index: React.FC = () => {
  // SEO optimization for homepage
  useSEO({
    title: 'GetIt - Bangladesh\'s Leading Multi-Vendor Ecommerce Platform | Online Shopping',
    description: 'Shop from thousands of verified vendors on GetIt Bangladesh. Electronics, Fashion, Home & Garden, Books and more. Best prices, fast delivery, secure payments across Bangladesh.',
    keywords: 'online shopping bangladesh, ecommerce, multi-vendor marketplace, electronics, fashion, home garden, books, getit, bengali shopping, dhaka delivery, trusted vendors',
    canonical: 'https://getit-bangladesh.com/',
    ogType: 'website',
    ogImage: 'https://getit-bangladesh.com/images/homepage-banner.jpg',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "GetIt Bangladesh",
      "url": "https://getit-bangladesh.com",
      "description": "Bangladesh's leading multi-vendor ecommerce platform offering electronics, fashion, home & garden products with fast delivery",
      "publisher": {
        "@type": "Organization",
        "name": "GetIt Bangladesh",
        "logo": {
          "@type": "ImageObject",
          "url": "https://getit-bangladesh.com/logo.png"
        }
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://getit-bangladesh.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  });

  return (
    <div className="bg-white flex flex-col overflow-hidden items-stretch min-h-screen">
      <Header />
      
      <main>
        <HeroSection />
        <QuickAccessIcons />
        <FeaturedCategories />
        <FlashSaleSection />
        <TrendingProducts />
        <PromotionalBanners />
        <MegaSaleSection />
        <NewProductsSection />
        <VendorCTA />
        <RecommendedSection />
        <TopSellingSection />
        <TrustIndicators />
        <BangladeshFeatures />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
