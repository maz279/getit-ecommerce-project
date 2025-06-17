
import React from 'react';
import { FooterCompanyInfo } from './footer/FooterCompanyInfo';
import { FooterCustomerService } from './footer/FooterCustomerService';
import { FooterDeliveryInfo } from './footer/FooterDeliveryInfo';
import { FooterVendorInfo } from './footer/FooterVendorInfo';
import { FooterCompanyLegal } from './footer/FooterCompanyLegal';
import { FooterCategories } from './footer/FooterCategories';
import { FooterSpecialPrograms } from './footer/FooterSpecialPrograms';
import { FooterPaymentSecurity } from './footer/FooterPaymentSecurity';
import { FooterContact } from './footer/FooterContact';
import { FooterNewsletter } from './footer/FooterNewsletter';
import { FooterAppDownload } from './footer/FooterAppDownload';
import { FooterSocialPayment } from './footer/FooterSocialPayment';
import { FooterCopyright } from './footer/FooterCopyright';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <FooterCompanyInfo />
          <FooterCustomerService />
          <FooterDeliveryInfo />
          <FooterVendorInfo />
          <FooterCompanyLegal />
        </div>

        {/* Additional Information Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 pt-8 border-t border-gray-700">
          <FooterCategories />
          <FooterSpecialPrograms />
          <FooterPaymentSecurity />
          <FooterContact />
        </div>

        {/* Newsletter & App Download */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-700">
          <FooterNewsletter />
          <FooterAppDownload />
        </div>

        {/* Social Media & Payment Methods */}
        <FooterSocialPayment />

        {/* Copyright */}
        <FooterCopyright />
      </div>
    </footer>
  );
};
