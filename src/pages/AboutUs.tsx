
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
        <div id="platform-capabilities">
          <PlatformCapabilities />
        </div>
        <div id="commitment">
          <Commitment />
        </div>
        <FutureVision />
        <CoreValues />
        <div id="leadership">
          <Leadership />
        </div>
        <JoinRevolution />
        <div id="achievements">
          <Achievements />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
