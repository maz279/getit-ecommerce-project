
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SettingsContentProps {
  selectedSubmenu: string;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({ selectedSubmenu }) => {
  console.log('🔍 SettingsContent - selectedSubmenu:', selectedSubmenu);
  
  const renderContent = () => {
    const normalizedSubmenu = selectedSubmenu?.toString().trim().toLowerCase();
    
    switch (normalizedSubmenu) {
      case 'system-settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>System configuration and settings will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'general-settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>General application settings will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'user-management-settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>User Management Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>User management configuration will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'role-permissions-settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Role & Permissions Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Role and permissions configuration will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'api-configuration':
        return (
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p>API settings and configuration will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'platform-configuration':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Platform configuration settings will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'store-settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Store configuration and settings will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'payment-configuration':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Payment system configuration will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'shipping-configuration':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Shipping Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Shipping settings and configuration will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'tax-settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tax configuration and settings will be displayed here.</p>
            </CardContent>
          </Card>
        );
      default:
        console.log('⚠️ SettingsContent - unknown submenu, defaulting to system settings');
        return (
          <Card>
            <CardHeader>
              <CardTitle>Settings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Settings management overview will be displayed here.</p>
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
