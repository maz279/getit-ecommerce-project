
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MarketingContentProps {
  selectedSubmenu: string;
}

export const MarketingContent: React.FC<MarketingContentProps> = ({ selectedSubmenu }) => {
  console.log('🔍 MarketingContent - selectedSubmenu:', selectedSubmenu);
  
  const renderContent = () => {
    const normalizedSubmenu = selectedSubmenu?.toString().trim().toLowerCase();
    
    switch (normalizedSubmenu) {
      case 'marketing-campaigns':
      case 'campaigns':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Marketing Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Marketing campaigns management interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'active-campaigns':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Active campaigns monitoring interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'create-campaign':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Create Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Campaign creation interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'campaign-analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Campaign analytics and performance metrics will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'ab-testing':
        return (
          <Card>
            <CardHeader>
              <CardTitle>A/B Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <p>A/B testing management interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'promotions-discounts':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Promotions & Discounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Promotions and discounts management interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'discount-codes':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Discount Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Discount codes management interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'flash-sales':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Flash Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Flash sales management interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'seasonal-offers':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Seasonal offers management interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'bundle-deals':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Bundle Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Bundle deals management interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'email-marketing':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Email Marketing</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Email marketing management interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'email-campaigns':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Email campaigns management interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'newsletter-management':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Newsletter management interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'automated-emails':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Automated Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Automated emails management interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      default:
        console.log('⚠️ MarketingContent - unknown submenu, defaulting to campaigns overview');
        return (
          <Card>
            <CardHeader>
              <CardTitle>Marketing Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Marketing management overview interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
};
