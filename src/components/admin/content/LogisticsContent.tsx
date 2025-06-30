
import React from 'react';
import { DeliveryTrackingContent } from './forms/logistics/DeliveryTrackingContent';
import { ShippingZonesContent } from './forms/logistics/ShippingZonesContent';
import { DeliveryPerformanceContent } from './forms/logistics/DeliveryPerformanceContent';
import { CourierPartnersContent } from './forms/logistics/CourierPartnersContent';

interface LogisticsContentProps {
  selectedSubmenu: string;
}

export const LogisticsContent: React.FC<LogisticsContentProps> = ({ selectedSubmenu }) => {
  console.log('🔍 LogisticsContent - selectedSubmenu:', selectedSubmenu);
  
  const getContent = () => {
    switch (selectedSubmenu) {
      // Courier Partners section
      case 'courier-partners-logistics':
      case 'pathao-management':
      case 'paperfly-integration':
      case 'sundarban-coordination':
      case 'redx-monitoring':
      case 'ecourier-tracking':
        return <CourierPartnersContent />;
      
      // Delivery Management section  
      case 'delivery-management':
      case 'delivery-zones':
      case 'delivery-scheduling':
      case 'route-optimization':
      case 'delivery-performance-logistics':
        return <DeliveryPerformanceContent />;
      
      // Shipping Analytics section
      case 'shipping-analytics':
      case 'delivery-reports':
      case 'performance-metrics-logistics':
      case 'cost-analysis-logistics':
      case 'customer-satisfaction-logistics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Shipping Analytics</h1>
            <p className="text-gray-600">Comprehensive shipping and delivery analytics dashboard...</p>
          </div>
        );
      
      // Returns & Exchanges section
      case 'returns-exchanges':
      case 'return-requests':
      case 'exchange-processing':
      case 'refund-management':
      case 'return-analytics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Returns & Exchanges</h1>
            <p className="text-gray-600">Manage returns, exchanges and refund processing...</p>
          </div>
        );
      
      // Legacy support for old routing
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
        return <CourierPartnersContent />;
      
      default:
        console.log('⚠️ LogisticsContent - no matching submenu found for:', selectedSubmenu);
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Courier Partners</h1>
            <p className="text-gray-600">Manage courier partnerships and delivery services...</p>
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
