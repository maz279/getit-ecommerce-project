
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SecurityContentProps {
  selectedSubmenu: string;
}

export const SecurityContent: React.FC<SecurityContentProps> = ({ selectedSubmenu }) => {
  console.log('🔍 SecurityContent - selectedSubmenu:', selectedSubmenu);
  
  const renderContent = () => {
    const normalizedSubmenu = selectedSubmenu?.toString().trim().toLowerCase();
    
    switch (normalizedSubmenu) {
      case 'security-monitoring':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Security Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Real-time security monitoring dashboard will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'threat-detection':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Threat Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Threat detection and analysis system will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'fraud-prevention':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Fraud Prevention</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Fraud prevention tools and monitoring will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'access-logs':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Access Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p>System access logs and monitoring will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'security-alerts':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Security alerts and notifications will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'compliance':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Compliance management and reporting will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'data-protection':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Data Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Data protection and privacy management will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'privacy-settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Privacy settings and configuration will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'audit-trails':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Audit Trails</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Audit trails and activity tracking will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'compliance-reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Compliance reports and documentation will be displayed here.</p>
            </CardContent>
          </Card>
        );
      default:
        console.log('⚠️ SecurityContent - unknown submenu, defaulting to security monitoring');
        return (
          <Card>
            <CardHeader>
              <CardTitle>Security Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Security management overview will be displayed here.</p>
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
