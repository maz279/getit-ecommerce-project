
import React from 'react';
import { CourierPartnersContent } from './forms/logistics/CourierPartnersContent';
import { DeliveryTrackingContent } from './forms/logistics/DeliveryTrackingContent';
import { ShippingZonesContent } from './forms/logistics/ShippingZonesContent';
import { DeliveryPerformanceContent } from './forms/logistics/DeliveryPerformanceContent';

interface LogisticsContentProps {
  selectedSubmenu: string;
}

export const LogisticsContent: React.FC<LogisticsContentProps> = ({ selectedSubmenu }) => {
  console.log('🚚 LogisticsContent - selectedSubmenu:', selectedSubmenu);
  
  const getContent = () => {
    switch (selectedSubmenu) {
      case 'courier-partners':
        console.log('✅ Routing to CourierPartnersContent');
        return <CourierPartnersContent />;
      case 'delivery-tracking':
        console.log('✅ Routing to DeliveryTrackingContent');
        return <DeliveryTrackingContent />;
      case 'delivery-zones':
      case 'shipping-zones':
        console.log('✅ Routing to ShippingZonesContent');
        return <ShippingZonesContent />;
      case 'delivery-performance':
        console.log('✅ Routing to DeliveryPerformanceContent');
        return <DeliveryPerformanceContent />;
      case 'shipping-management':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Shipping Management</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-4">Comprehensive shipping management system for your platform.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Shipping Methods</h3>
                  <p className="text-sm text-blue-700">Configure and manage various shipping options.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Rate Management</h3>
                  <p className="text-sm text-green-700">Set up shipping rates and pricing rules.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Label Generation</h3>
                  <p className="text-sm text-purple-700">Automated shipping label creation and printing.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'warehouse-operations':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Warehouse Operations</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-4">Manage warehouse operations and inventory flow.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2">Inventory Management</h3>
                  <p className="text-sm text-orange-700">Track stock levels across multiple warehouses.</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-900 mb-2">Pick & Pack</h3>
                  <p className="text-sm text-teal-700">Optimize picking and packing processes.</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Quality Control</h3>
                  <p className="text-sm text-red-700">Ensure product quality before shipping.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'shipping-rates':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Shipping Rates</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-4">Configure shipping rates and pricing strategies.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-900 mb-2">Rate Calculator</h3>
                  <p className="text-sm text-indigo-700">Dynamic shipping rate calculation based on weight, distance, and delivery speed.</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Promotional Rates</h3>
                  <p className="text-sm text-yellow-700">Set up special shipping promotions and discounts.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'shipping-analytics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Shipping Analytics</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-4">Analyze shipping performance and identify optimization opportunities.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">98.5%</div>
                  <div className="text-sm text-blue-700">On-time Delivery</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">2.3 days</div>
                  <div className="text-sm text-green-700">Avg Delivery Time</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">$12.50</div>
                  <div className="text-sm text-purple-700">Avg Shipping Cost</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">1.2%</div>
                  <div className="text-sm text-orange-700">Damage Rate</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'logistics':
      case 'logistics-overview':
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Logistics & Shipping Overview</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-6">Comprehensive logistics management system for your e-commerce platform.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">Shipping Management</h3>
                  <p className="text-sm text-blue-700 mb-4">Configure shipping methods, rates, and delivery options.</p>
                  <div className="text-xs text-blue-600">
                    <div>• Multiple shipping carriers</div>
                    <div>• Real-time rate calculation</div>
                    <div>• Automated label generation</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3">Warehouse Operations</h3>
                  <p className="text-sm text-green-700 mb-4">Optimize warehouse workflows and inventory management.</p>
                  <div className="text-xs text-green-600">
                    <div>• Inventory tracking</div>
                    <div>• Pick & pack optimization</div>
                    <div>• Quality control processes</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-3">Delivery Performance</h3>
                  <p className="text-sm text-purple-700 mb-4">Monitor and improve delivery performance metrics.</p>
                  <div className="text-xs text-purple-600">
                    <div>• On-time delivery tracking</div>
                    <div>• Customer satisfaction scores</div>
                    <div>• Performance analytics</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-3">Courier Partners</h3>
                  <p className="text-sm text-orange-700 mb-4">Manage relationships with delivery partners.</p>
                  <div className="text-xs text-orange-600">
                    <div>• Partner performance metrics</div>
                    <div>• Cost optimization</div>
                    <div>• Service level agreements</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-lg">
                  <h3 className="font-semibold text-teal-900 mb-3">Delivery Tracking</h3>
                  <p className="text-sm text-teal-700 mb-4">Real-time tracking and customer notifications.</p>
                  <div className="text-xs text-teal-600">
                    <div>• Live tracking updates</div>
                    <div>• SMS/Email notifications</div>
                    <div>• Delivery confirmation</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-3">Shipping Zones</h3>
                  <p className="text-sm text-red-700 mb-4">Configure delivery zones and regional settings.</p>
                  <div className="text-xs text-red-600">
                    <div>• Geographic zone mapping</div>
                    <div>• Zone-based pricing</div>
                    <div>• Delivery time estimates</div>
                  </div>
                </div>
              </div>
            </div>
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
