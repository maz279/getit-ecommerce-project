
import React from 'react';
import { VendorDirectoryContent } from './VendorDirectoryContent';
import { ActiveVendorsContent } from './ActiveVendorsContent';
import { VendorOnboardingContent } from './VendorOnboardingContent';
import { VendorVerificationContent } from './VendorVerificationContent';
import { VendorPerformanceContent } from './VendorPerformanceContent';
import { VendorAnalyticsContent } from './VendorAnalyticsContent';
import { VendorPaymentsContent } from './VendorPaymentsContent';
import { VendorSupportContent } from './VendorSupportContent';
import { PendingApplicationsContent } from './PendingApplicationsContent';

interface VendorManagementRouterProps {
  selectedSubmenu: string;
}

export const VendorManagementRouter: React.FC<VendorManagementRouterProps> = ({ selectedSubmenu }) => {
  console.log('🔍 VendorManagementRouter - selectedSubmenu:', selectedSubmenu);
  
  switch (selectedSubmenu) {
    case 'vendor-directory':
    case 'vendor-dashboard':
      console.log('✅ Routing to VendorDirectoryContent');
      return <VendorDirectoryContent />;
    case 'active-vendors':
    case 'active':
      console.log('✅ Routing to ActiveVendorsContent');
      return <ActiveVendorsContent />;
    case 'pending-application':
    case 'pending-applications':
    case 'applications':
      console.log('✅ Routing to PendingApplicationsContent');
      return <PendingApplicationsContent />;
    case 'vendor-onboarding':
    case 'onboarding':
      console.log('✅ Routing to VendorOnboardingContent');
      return <VendorOnboardingContent />;
    case 'vendor-verification':
    case 'verification':
      console.log('✅ Routing to VendorVerificationContent');
      return <VendorVerificationContent />;
    case 'vendor-performance':
    case 'performance':
      console.log('✅ Routing to VendorPerformanceContent');  
      return <VendorPerformanceContent />;
    case 'vendor-analytics':
    case 'analytics':
      console.log('✅ Routing to VendorAnalyticsContent');
      return <VendorAnalyticsContent />;
    case 'vendor-payments':
    case 'payments':
    case 'commission-management':
      console.log('✅ Routing to VendorPaymentsContent');
      return <VendorPaymentsContent />;
    case 'vendor-support':
    case 'support':
      console.log('✅ Routing to VendorSupportContent');
      return <VendorSupportContent />;
    default:
      console.log('✅ Routing to VendorDirectoryContent (default)');
      return <VendorDirectoryContent />;
  }
};
