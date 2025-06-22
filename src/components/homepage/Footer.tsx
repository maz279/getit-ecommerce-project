
import React from 'react';
import { FooterMainSection } from './footer/FooterMainSection';
import { FooterSecondarySection } from './footer/FooterSecondarySection';
import { FooterRegionalSection } from './footer/FooterRegionalSection';
import { FooterLegalSection } from './footer/FooterLegalSection';
import { FooterBusinessSection } from './footer/FooterBusinessSection';
import { FooterConnectSection } from './footer/FooterConnectSection';
import { FooterAdditionalServices } from './footer/FooterAdditionalServices';
import { FooterTechnologySection } from './footer/FooterTechnologySection';
import { FooterSpecialPrograms } from './footer/FooterSpecialPrograms';
import { FooterEmergencySupport } from './footer/FooterEmergencySupport';
import { FooterCopyright } from './footer/FooterCopyright';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Section - 4 primary columns */}
        <FooterMainSection />

        {/* Secondary Footer Section - Payment, Shipping, Security */}
        <FooterSecondarySection />

        {/* Regional Information */}
        <FooterRegionalSection />

        {/* Legal & Compliance */}
        <FooterLegalSection />

        {/* Business Information */}
        <FooterBusinessSection />

        {/* Connect With Us */}
        <FooterConnectSection />

        {/* Additional Services */}
        <FooterAdditionalServices />

        {/* Technology & Innovation */}
        <FooterTechnologySection />

        {/* Special Programs */}
        <FooterSpecialPrograms />

        {/* Emergency & Support */}
        <FooterEmergencySupport />

        {/* Copyright */}
        <FooterCopyright />
      </div>
    </footer>
  );
};
