
import React from 'react';
import { DashboardContent } from './dashboard/DashboardContent';

interface ComprehensiveMainContentProps {
  selectedMenu: string;
  selectedSubmenu: string;
}

export const ComprehensiveMainContent: React.FC<ComprehensiveMainContentProps> = ({
  selectedMenu,
  selectedSubmenu
}) => {
  console.log('ComprehensiveMainContent - selectedMenu:', selectedMenu, 'selectedSubmenu:', selectedSubmenu);
  
  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return <DashboardContent selectedSubmenu={selectedSubmenu} />;
      
      case 'user-management':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            <p className="text-gray-600">User management content for {selectedSubmenu}</p>
          </div>
        );
        
      case 'vendor-management':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Vendor Management</h1>
            <p className="text-gray-600">Vendor management content for {selectedSubmenu}</p>
          </div>
        );
        
      case 'product-management':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Product Management</h1>
            <p className="text-gray-600">Product management content for {selectedSubmenu}</p>
          </div>
        );
        
      case 'order-management':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Order Management</h1>
            <p className="text-gray-600">Order management content for {selectedSubmenu}</p>
          </div>
        );
        
      case 'financial-management':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Financial Management</h1>
            <p className="text-gray-600">Financial management content for {selectedSubmenu}</p>
          </div>
        );
        
      case 'analytics-reports':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Analytics & Reports</h1>
            <p className="text-gray-600">Analytics and reports content for {selectedSubmenu}</p>
          </div>
        );
        
      case 'marketing-promotions':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Marketing & Promotions</h1>
            <p className="text-gray-600">Marketing and promotions content for {selectedSubmenu}</p>
          </div>
        );
        
      case 'content-management':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Content Management</h1>
            <p className="text-gray-600">Content management for {selectedSubmenu}</p>
          </div>
        );
        
      case 'shipping-logistics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Shipping & Logistics</h1>
            <p className="text-gray-600">Shipping and logistics content for {selectedSubmenu}</p>
          </div>
        );
        
      case 'communication':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Communication Hub</h1>
            <p className="text-gray-600">Communication content for {selectedSubmenu}</p>
          </div>
        );
        
      case 'security-audit':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Security & Audit</h1>
            <p className="text-gray-600">Security and audit content for {selectedSubmenu}</p>
          </div>
        );
        
      case 'system-monitoring':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">System Monitoring</h1>
            <p className="text-gray-600">System monitoring content for {selectedSubmenu}</p>
          </div>
        );
        
      case 'settings-configuration':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Settings & Configuration</h1>
            <p className="text-gray-600">Settings and configuration content for {selectedSubmenu}</p>
          </div>
        );
        
      default:
        return <DashboardContent selectedSubmenu="overview" />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {renderContent()}
    </div>
  );
};
