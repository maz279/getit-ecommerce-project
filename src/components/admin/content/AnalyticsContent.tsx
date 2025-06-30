
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsContentProps {
  selectedSubmenu: string;
}

export const AnalyticsContent: React.FC<AnalyticsContentProps> = ({ selectedSubmenu }) => {
  console.log('🔍 AnalyticsContent - selectedSubmenu:', selectedSubmenu);
  
  const renderContent = () => {
    const normalizedSubmenu = selectedSubmenu?.toString().trim().toLowerCase();
    
    switch (normalizedSubmenu) {
      case 'business-intelligence':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Business Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Business intelligence dashboard and insights will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'executive-dashboard':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Executive Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Executive dashboard with high-level metrics will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'key-metrics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Key performance metrics and KPI tracking will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'trend-analysis':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Trend analysis and forecasting will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'predictive-analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Predictive analytics and machine learning insights will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'financial-reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Financial reports and analysis will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'profit-loss':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Profit and loss statements will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'cash-flow':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Cash flow analysis and reports will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'tax-reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Tax Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tax reports and compliance documentation will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'audit-reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Audit Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Audit reports and compliance tracking will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'operational-reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Operational Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Operational reports and performance metrics will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'inventory-reports-analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Inventory Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Inventory analytics and reports will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'shipping-reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Shipping Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Shipping performance reports will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'performance-reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Performance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Overall performance reports and analysis will be displayed here.</p>
            </CardContent>
          </Card>
        );
      default:
        console.log('⚠️ AnalyticsContent - unknown submenu, defaulting to business intelligence');
        return (
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Analytics and reporting overview will be displayed here.</p>
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
