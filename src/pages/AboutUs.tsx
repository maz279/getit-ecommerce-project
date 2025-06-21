
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
        <MissionVision />
        <MarketPosition />
        <CompanyStats />
        <UniqueValue />
        <Technology />
        <Security />
        <PlatformCapabilities />
        <Commitment />
        <FutureVision />
        <CoreValues />
        <Leadership />
        <JoinRevolution />
        <Achievements />
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
