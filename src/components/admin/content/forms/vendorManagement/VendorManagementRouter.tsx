
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
import { SuspendedVendorsContent } from './SuspendedVendorsContent';
import { VendorSearchContent } from './VendorSearchContent';
import { DocumentReviewContent } from './DocumentReviewContent';
import { TradeLicenseVerificationContent } from './TradeLicenseVerificationContent';

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
    case 'suspended-vendors':
    case 'suspended':
      console.log('✅ Routing to SuspendedVendorsContent');
      return <SuspendedVendorsContent />;
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
    case 'vendor-search':
    case 'search-vendors':
    case 'find-vendors':
    case 'vendor-finder':
    case 'advanced-vendor-search':
    case 'vendor-database-search':
    case 'vendor-lookup':
    case 'search-directory':
      console.log('✅ Routing to VendorSearchContent');
      return <VendorSearchContent />;
    case 'document-review':
    case 'document-verification':
    case 'kyc-verification':
    case 'kyc-review':
    case 'compliance-check':
    case 'identity-verification':
    case 'business-verification':
    case 'document-approval':
    case 'verification-queue':
    case 'rejected-documents':
    case 'pending-verification':
    case 'verified-documents':
    case 'compliance-status':
      console.log('✅ Routing to DocumentReviewContent');
      return <DocumentReviewContent />;
    case 'trade-license-verification':
    case 'trade-license-review':
    case 'license-validation':
    case 'license-approval':
    case 'license-renewal':
    case 'expired-licenses':
    case 'license-compliance':
    case 'license-analytics':
    case 'business-registration':
    case 'regulatory-compliance':
    case 'license-documents':
    case 'certificate-verification':
      console.log('✅ Routing to TradeLicenseVerificationContent');
      return <TradeLicenseVerificationContent />;
    default:
      console.log('✅ Routing to VendorDirectoryContent (default)');
      return <VendorDirectoryContent />;
  }
};
