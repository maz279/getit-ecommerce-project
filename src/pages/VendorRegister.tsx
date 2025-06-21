
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { VendorHeroSection } from '../components/vendor/VendorHeroSection';
import { VendorOnboardingWizard } from '../components/vendor/VendorOnboardingWizard';

const VendorRegister: React.FC = () => {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <VendorHeroSection />

        {/* Registration Form */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <VendorOnboardingWizard />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default VendorRegister;
