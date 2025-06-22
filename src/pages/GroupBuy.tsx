
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { GroupBuyHero } from '../components/groupbuy/GroupBuyHero';
import { HowItWorksSection } from '../components/groupbuy/HowItWorksSection';
import { ActiveDealsSection } from '../components/groupbuy/ActiveDealsSection';
import { SuccessStoriesSection } from '../components/groupbuy/SuccessStoriesSection';
import { CategoryGroupsSection } from '../components/groupbuy/CategoryGroupsSection';
import { GroupBuyBenefitsSection } from '../components/groupbuy/GroupBuyBenefitsSection';
import { CreateGroupSection } from '../components/groupbuy/CreateGroupSection';
import { PopularGroupsSection } from '../components/groupbuy/PopularGroupsSection';
import { GroupBuyStatsSection } from '../components/groupbuy/GroupBuyStatsSection';
import { TrustSafetySection } from '../components/groupbuy/TrustSafetySection';
import { GroupBuyFAQSection } from '../components/groupbuy/GroupBuyFAQSection';

const GroupBuy: React.FC = () => {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <GroupBuyHero />
        <GroupBuyStatsSection />
        <HowItWorksSection />
        <ActiveDealsSection />
        <PopularGroupsSection />
        <CategoryGroupsSection />
        <GroupBuyBenefitsSection />
        <CreateGroupSection />
        <SuccessStoriesSection />
        <TrustSafetySection />
        <GroupBuyFAQSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default GroupBuy;
