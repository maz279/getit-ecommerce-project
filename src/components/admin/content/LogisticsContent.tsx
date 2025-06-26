
import React from 'react';
import { CourierPartnersContent } from './forms/logistics/CourierPartnersContent';

interface LogisticsContentProps {
  selectedSubmenu: string;
}

export const LogisticsContent: React.FC<LogisticsContentProps> = ({ selectedSubmenu }) => {
  const getContent = () => {
    switch (selectedSubmenu) {
      case 'courier-partners':
        return <CourierPartnersContent />;
      case 'shipping-management':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Shipping Management</h1>
            <p className="text-gray-600">Shipping management content for {selectedSubmenu}</p>
          </div>
        );
      case 'warehouse-operations':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Warehouse Operations</h1>
            <p className="text-gray-600">Warehouse operations content for {selectedSubmenu}</p>
          </div>
        );
      case 'shipping-rates':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Shipping Rates</h1>
            <p className="text-gray-600">Shipping rates content for {selectedSubmenu}</p>
          </div>
        );
      case 'delivery-zones':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Delivery Zones</h1>
            <p className="text-gray-600">Delivery zones content for {selectedSubmenu}</p>
          </div>
        );
      case 'shipping-analytics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Shipping Analytics</h1>
            <p className="text-gray-600">Shipping analytics content for {selectedSubmenu}</p>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Logistics & Shipping</h1>
            <p className="text-gray-600">Logistics content for {selectedSubmenu}</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      {getContent()}
    </div>
  );
};
