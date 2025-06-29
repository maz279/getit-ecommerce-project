import React from 'react';
import { DeliveryTrackingContent } from './forms/logistics/DeliveryTrackingContent';
import { ShippingZonesContent } from './forms/logistics/ShippingZonesContent';
import { DeliveryPerformanceContent } from './forms/logistics/DeliveryPerformanceContent';

interface LogisticsContentProps {
  selectedSubmenu: string;
}

export const LogisticsContent: React.FC<LogisticsContentProps> = ({ selectedSubmenu }) => {
  console.log('🔍 LogisticsContent - selectedSubmenu:', selectedSubmenu);
  
  const getContent = () => {
    switch (selectedSubmenu) {
      case 'logistics-overview':
      case 'overview':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Logistics Overview</h1>
            <p className="text-gray-600">Comprehensive logistics management dashboard...</p>
          </div>
        );
      case 'delivery-tracking':
        return <DeliveryTrackingContent />;
      case 'shipping-zones':
        return <ShippingZonesContent />;
      case 'delivery-performance':
        return <DeliveryPerformanceContent />;
      case 'courier-management':
      case 'courier-partners':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Courier Partners Management</h1>
            <p className="text-gray-600">Manage courier partners and their performance...</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Active Partners</h3>
                <p className="text-3xl font-bold text-blue-600">12</p>
                <p className="text-sm text-gray-500">Currently serving</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Pending Applications</h3>
                <p className="text-3xl font-bold text-yellow-600">5</p>
                <p className="text-sm text-gray-500">Under review</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Performance Rating</h3>
                <p className="text-3xl font-bold text-green-600">4.6</p>
                <p className="text-sm text-gray-500">Average rating</p>
              </div>
            </div>
          </div>
        );
      case 'warehouse-operations':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Warehouse Operations</h1>
            <p className="text-gray-600">Monitor and manage warehouse activities...</p>
          </div>
        );
      case 'inventory-tracking':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Inventory Tracking</h1>
            <p className="text-gray-600">Real-time inventory tracking across locations...</p>
          </div>
        );
      case 'supply-chain':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Supply Chain Management</h1>
            <p className="text-gray-600">End-to-end supply chain visibility...</p>
          </div>
        );
      case 'transportation-analytics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Transportation Analytics</h1>
            <p className="text-gray-600">Analyze transportation costs and efficiency...</p>
          </div>
        );
      case 'route-optimization':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Route Optimization</h1>
            <p className="text-gray-600">Optimize delivery routes for efficiency...</p>
          </div>
        );
      case 'cost-analysis':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Cost Analysis</h1>
            <p className="text-gray-600">Analyze logistics costs and identify savings...</p>
          </div>
        );
      case 'delivery-analytics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Delivery Analytics</h1>
            <p className="text-gray-600">Comprehensive delivery performance analytics...</p>
          </div>
        );
      default:
        console.log('⚠️ LogisticsContent - no matching submenu found for:', selectedSubmenu);
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Logistics Overview</h1>
            <p className="text-gray-600">Comprehensive logistics management dashboard...</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {getContent()}
    </div>
  );
};
