
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { PremiumHero } from '../components/premium/PremiumHero';
import { MembershipTiers } from '../components/premium/MembershipTiers';
import { ExclusiveDeals } from '../components/premium/ExclusiveDeals';
import { PremiumBrands } from '../components/premium/PremiumBrands';
import { PersonalizedRecommendations } from '../components/premium/PersonalizedRecommendations';
import { PremiumSupport } from '../components/premium/PremiumSupport';
import { PremiumPerks } from '../components/premium/PremiumPerks';
import { useSEO } from '@/hooks/useSEO';

const Premium: React.FC = () => {
  useSEO({
    title: 'GetIt Premium | Exclusive Membership Benefits | VIP Shopping Experience',
    description: 'Join GetIt Premium for exclusive deals, free shipping, priority support, and early access to sales. Premium membership with luxury brands and personalized service.',
    keywords: 'getit premium, vip membership, exclusive deals, free shipping, premium brands, luxury shopping, member benefits, priority support',
    canonical: 'https://getit-bangladesh.com/premium',
    ogType: 'website',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "GetIt Premium Membership",
      "description": "Exclusive membership program offering VIP shopping experience with premium benefits",
      "provider": {
        "@type": "Organization",
        "name": "GetIt Bangladesh",
        "url": "https://getit-bangladesh.com"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Premium Membership Benefits",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Free Shipping"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Exclusive Deals"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Priority Support"
            }
          }
        ]
      }
    }
  });

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <PremiumHero />
        <MembershipTiers />
        <ExclusiveDeals />
        <PremiumBrands />
        <PersonalizedRecommendations />
        <PremiumPerks />
        <PremiumSupport />
      </main>
      
      <Footer />
    </div>
  );
};

export default Premium;
