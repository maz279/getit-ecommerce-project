
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentManagementContentProps {
  selectedSubmenu: string;
}

export const PaymentManagementContent: React.FC<PaymentManagementContentProps> = ({ selectedSubmenu }) => {
  console.log('🔍 PaymentManagementContent - selectedSubmenu:', selectedSubmenu);
  
  const renderContent = () => {
    const normalizedSubmenu = selectedSubmenu?.toString().trim().toLowerCase();
    
    switch (normalizedSubmenu) {
      case 'revenue-dashboard-payment':
      case 'revenue-overview':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Revenue Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Payment revenue dashboard and overview will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'revenue-trends':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Revenue trends and analysis will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'commission-summary':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Commission Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Commission tracking and summary will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'profit-analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profit Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Profit analytics and insights will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'payment-gateways':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Payment gateways management and configuration will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'bkash-integration':
        return (
          <Card>
            <CardHeader>
              <CardTitle>bKash Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p>bKash payment integration and settings will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'nagad-integration':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Nagad Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Nagad payment integration and settings will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'rocket-integration':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Rocket Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Rocket payment integration and settings will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'international-gateways':
        return (
          <Card>
            <CardHeader>
              <CardTitle>International Gateways</CardTitle>
            </CardHeader>
            <CardContent>
              <p>International payment gateways will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'payment-analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payment Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Payment analytics and performance metrics will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'vendor-payouts':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Vendor Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Vendor payout management will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'payout-schedule':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payout Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Payout scheduling and management will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'pending-payments':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Pending payments tracking will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'payout-history':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Payout history and records will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'payout-reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payout Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Payout reports and analytics will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'financial-reports-payment':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Payment financial reports will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'daily-reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Daily Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Daily payment reports will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'monthly-reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Monthly payment reports will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'tax-reports-payment':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Tax Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Payment tax reports will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'audit-reports-payment':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Audit Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Payment audit reports will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'transaction-monitoring':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Transaction Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Transaction monitoring and oversight will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'transaction-logs':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Transaction Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Transaction logs and history will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'fraud-detection':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Fraud detection and prevention will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'security-monitoring-payment':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Security Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Payment security monitoring will be displayed here.</p>
            </CardContent>
          </Card>
        );
      default:
        console.log('⚠️ PaymentManagementContent - unknown submenu, defaulting to revenue dashboard');
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payment Management Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Payment management overview will be displayed here.</p>
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
