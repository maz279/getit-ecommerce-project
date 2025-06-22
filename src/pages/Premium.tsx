
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

const Premium: React.FC = () => {
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
