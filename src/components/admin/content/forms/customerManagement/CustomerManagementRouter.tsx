
import React from 'react';
import { CustomerOverviewContent } from './CustomerOverviewContent';
import { AllCustomersContent } from './AllCustomersContent';
import { CustomerAnalyticsContent } from './CustomerAnalyticsContent';
import { CustomerSearchContent } from './CustomerSearchContent';
import { CustomerSegmentsContent } from './CustomerSegmentsContent';
import { VIPCustomersContent } from './VIPCustomersContent';
import { PurchaseHistoryContent } from './PurchaseHistoryContent';
import { CustomerBehaviorContent } from './CustomerBehaviorContent';
import { CLVContent } from './CLVContent';
import { LoyaltyAnalysisContent } from './LoyaltyAnalysisContent';
import { CustomerSupportContent } from './CustomerSupportContent';
import { LiveChatContent } from './LiveChatContent';
import { FeedbackReviewsContent } from './FeedbackReviewsContent';

interface CustomerManagementRouterProps {
  selectedSubmenu: string;
}

export const CustomerManagementRouter: React.FC<CustomerManagementRouterProps> = ({ selectedSubmenu }) => {
  console.log('🎯 CustomerManagementRouter - selectedSubmenu:', selectedSubmenu);
  
  // Input validation for security
  if (!validateRouteInput(selectedSubmenu)) {
    console.warn('⚠️ Invalid route input detected, defaulting to customer-database');
    return <AllCustomersContent />;
  }
  
  const normalizedSubmenu = selectedSubmenu?.toString().trim().toLowerCase();
  console.log('🔄 CustomerManagementRouter - normalizedSubmenu:', normalizedSubmenu);
  
  switch (normalizedSubmenu) {
    case 'customer-database':
      console.log('➡️ Routing to AllCustomersContent (Customer Database)');
      return <AllCustomersContent />;
    
    case 'customer-overview':
      console.log('➡️ Routing to CustomerOverviewContent');
      return <CustomerOverviewContent />;
    
    case 'customer-analytics':
      console.log('➡️ Routing to CustomerAnalyticsContent');
      return <CustomerAnalyticsContent />;
    
    case 'customer-search':
      console.log('➡️ Routing to CustomerSearchContent');
      return <CustomerSearchContent />;
    
    case 'customer-segments':
      console.log('➡️ Routing to CustomerSegmentsContent');
      return <CustomerSegmentsContent />;
    
    case 'vip-customers':
      console.log('➡️ Routing to VIPCustomersContent');
      return <VIPCustomersContent />;
    
    case 'purchase-history':
      console.log('➡️ Routing to PurchaseHistoryContent');
      return <PurchaseHistoryContent />;
    
    case 'customer-behavior':
      console.log('➡️ Routing to CustomerBehaviorContent');
      return <CustomerBehaviorContent />;
    
    case 'clv-analysis':
      console.log('➡️ Routing to CLVContent');
      return <CLVContent />;
    
    case 'loyalty-analysis':
      console.log('➡️ Routing to LoyaltyAnalysisContent');
      return <LoyaltyAnalysisContent />;
    
    case 'customer-support':
      console.log('➡️ Routing to CustomerSupportContent');
      return <CustomerSupportContent />;
    
    case 'live-chat':
      console.log('➡️ Routing to LiveChatContent');
      return <LiveChatContent />;
    
    case 'feedback-reviews':
      console.log('➡️ Routing to FeedbackReviewsContent');
      return <FeedbackReviewsContent />;
    
    default:
      console.log('⚠️ CustomerManagementRouter - Unknown submenu:', normalizedSubmenu, '- falling back to customer database');
      return <AllCustomersContent />;
  }
};

// Input validation function for route security
const validateRouteInput = (input: string): boolean => {
  if (!input || typeof input !== 'string') {
    return false;
  }
  
  // Sanitize input to prevent XSS - Fixed regex with proper escaping
  const sanitized = input.replace(/[<>"\/]/g, '');
  return sanitized === input && sanitized.length <= 100;
};
