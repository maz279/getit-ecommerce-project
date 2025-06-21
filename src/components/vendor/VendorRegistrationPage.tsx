
import React from 'react';
import { Header } from '../homepage/Header';
import { Footer } from '../homepage/Footer';
import { VendorHeroSection } from './VendorHeroSection';
import { VendorRegistrationSection } from './VendorRegistrationSection';

export const VendorRegistrationPage: React.FC = () => {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <VendorHeroSection />
        <VendorRegistrationSection />
      </main>
      
      <Footer />
    </div>
  );
};
