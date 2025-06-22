
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { HeroSection } from '../components/aboutus/HeroSection';
import { CompanyOverview } from '../components/aboutus/CompanyOverview';
import { MissionVision } from '../components/aboutus/MissionVision';
import { MarketPosition } from '../components/aboutus/MarketPosition';
import { CompanyStats } from '../components/aboutus/CompanyStats';
import { UniqueValue } from '../components/aboutus/UniqueValue';
import { Technology } from '../components/aboutus/Technology';
import { Security } from '../components/aboutus/Security';
import { PlatformCapabilities } from '../components/aboutus/PlatformCapabilities';
import { Commitment } from '../components/aboutus/Commitment';
import { FutureVision } from '../components/aboutus/FutureVision';
import { CoreValues } from '../components/aboutus/CoreValues';
import { Leadership } from '../components/aboutus/Leadership';
import { JoinRevolution } from '../components/aboutus/JoinRevolution';
import { Achievements } from '../components/aboutus/Achievements';
import { Careers } from '../components/aboutus/Careers';
import { PressMedia } from '../components/aboutus/PressMedia';
import { InvestorRelations } from '../components/aboutus/InvestorRelations';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <HeroSection />
        <CompanyOverview />
        <div id="mission-vision">
          <MissionVision />
        </div>
        <MarketPosition />
        <div id="company-stats">
          <CompanyStats />
        </div>
        <UniqueValue />
        <Technology />
        <Security />
        <div id="how-it-works">
          <PlatformCapabilities />
        </div>
        <div id="corporate-social-responsibility">
          <Commitment />
        </div>
        <FutureVision />
        <CoreValues />
        <div id="leadership">
          <Leadership />
        </div>
        <div id="success-stories">
          <Achievements />
        </div>
        <div id="careers">
          <Careers />
        </div>
        <div id="press-media">
          <PressMedia />
        </div>
        <div id="investor-relations">
          <InvestorRelations />
        </div>
        <JoinRevolution />
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
