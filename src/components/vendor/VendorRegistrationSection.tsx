
import React from 'react';
import { VendorOnboardingWizard } from './VendorOnboardingWizard';

export const VendorRegistrationSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <VendorOnboardingWizard />
      </div>
    </section>
  );
};
