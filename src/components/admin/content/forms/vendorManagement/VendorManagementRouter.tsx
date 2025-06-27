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
import { TinVerificationContent } from './TinVerificationContent';
import { NidVerificationContent } from './NidVerificationContent';
import { BankAccountVerificationContent } from './BankAccountVerificationContent';
import { VendorPerformanceMetricsContent } from './VendorPerformanceMetricsContent';
import { VendorScorecardContent } from './VendorScorecardContent';

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
    // Performance metrics specific submenus route to VendorPerformanceMetricsContent
    case 'performance-metrics':
    case 'vendor-performance-metrics':
    case 'performance-dashboard':
    case 'performance-analysis':
    case 'vendor-kpi':
    case 'performance-benchmarks':
    case 'performance-trends':
    case 'performance-reporting':
    case 'performance-monitoring':
    case 'performance-improvement':
    case 'performance-alerts':
      console.log('✅ Routing to VendorPerformanceMetricsContent with submenu:', selectedSubmenu);
      return <VendorPerformanceMetricsContent selectedSubmenu={selectedSubmenu} />;
    // Vendor scorecard specific submenus route to VendorScorecardContent
    case 'vendor-scorecard':
    case 'scorecard':
    case 'vendor-rating':
    case 'vendor-evaluation':
    case 'performance-scorecard':
    case 'vendor-assessment':
    case 'quality-scorecard':
    case 'supplier-scorecard':
    case 'vendor-grading':
    case 'vendor-scorecards':
    case 'vendor-ratings':
    case 'vendor-reviews':
      console.log('✅ Routing to VendorScorecardContent with submenu:', selectedSubmenu);
      return <VendorScorecardContent />;
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
    case 'tin-verification':
    case 'tin-review':
    case 'tax-verification':
    case 'tin-validation':
    case 'tin-approval':
    case 'tax-compliance':
    case 'tin-analytics':
    case 'tax-registration':
    case 'tin-documents':
    case 'tax-authority-verification':
    case 'expired-tin':
    case 'tin-renewal':
    case 'tax-status-check':
    case 'tin-compliance-monitoring':
      console.log('✅ Routing to TinVerificationContent');
      return <TinVerificationContent />;
    case 'nid-verification':
    case 'nid-review':
    case 'national-id-verification':
    case 'nid-validation':
    case 'nid-approval':
    case 'identity-compliance':
    case 'nid-analytics':
    case 'national-id-registration':
    case 'nid-documents':
    case 'identity-authority-verification':
    case 'expired-nid':
    case 'nid-renewal':
    case 'identity-status-check':
    case 'nid-compliance-monitoring':
    case 'biometric-verification':
    case 'face-matching':
    case 'identity-fraud-detection':
    case 'nid-blacklist-check':
    case 'identity-verification-api':
      console.log('✅ Routing to NidVerificationContent');
      return <NidVerificationContent />;
    case 'bank-account-verification':
    case 'bank-verification':
    case 'banking-verification':
    case 'account-validation':
    case 'bank-approval':
    case 'banking-compliance':
    case 'bank-analytics':
    case 'financial-verification':
    case 'bank-documents':
    case 'banking-authority-verification':
    case 'failed-bank-verification':
    case 'bank-renewal':
    case 'banking-status-check':
    case 'bank-compliance-monitoring':
    case 'financial-audit':
    case 'payment-method-verification':
    case 'banking-fraud-detection':
    case 'account-ownership-verification':
    case 'banking-api-integration':
      console.log('✅ Routing to BankAccountVerificationContent');
      return <BankAccountVerificationContent />;
    default:
      console.log('✅ Routing to VendorDirectoryContent (default)');
      return <VendorDirectoryContent />;
  }
};
