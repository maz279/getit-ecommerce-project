
import React from 'react';
import { CourierPartnersContent } from './forms/logistics/CourierPartnersContent';
import { DeliveryPerformanceContent } from './forms/logistics/DeliveryPerformanceContent';
import { DeliveryTrackingContent } from './forms/logistics/DeliveryTrackingContent';
import { ShippingZonesContent } from './forms/logistics/ShippingZonesContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LogisticsContentProps {
  selectedSubmenu: string;
}

export const LogisticsContent: React.FC<LogisticsContentProps> = ({ selectedSubmenu }) => {
  console.log('🔍 LogisticsContent - selectedSubmenu:', selectedSubmenu);
  
  const renderContent = () => {
    const normalizedSubmenu = selectedSubmenu?.toString().trim().toLowerCase();
    
    switch (normalizedSubmenu) {
      case 'courier-partners-logistics':
        return <CourierPartnersContent />;
      case 'pathao-management':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Pathao Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Pathao courier partner management will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'paperfly-integration':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Paperfly Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Paperfly courier integration will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'sundarban-coordination':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Sundarban Coordination</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Sundarban courier coordination will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'redx-monitoring':
        return (
          <Card>
            <CardHeader>
              <CardTitle>RedX Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p>RedX courier monitoring will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'ecourier-tracking':
        return (
          <Card>
            <CardHeader>
              <CardTitle>eCourier Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p>eCourier tracking system will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'delivery-management':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Delivery Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Delivery management interface will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'delivery-zones':
        return <ShippingZonesContent />;
      case 'delivery-scheduling':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Delivery Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Delivery scheduling system will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'route-optimization':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Route Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Route optimization tools will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'delivery-performance-logistics':
        return <DeliveryPerformanceContent />;
      case 'shipping-analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Shipping Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Shipping analytics and insights will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'delivery-reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Delivery Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Delivery performance reports will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'performance-metrics-logistics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Logistics performance metrics will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'cost-analysis-logistics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Logistics cost analysis will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'customer-satisfaction-logistics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Customer Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Customer satisfaction metrics will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'returns-exchanges':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Returns & Exchanges</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Returns and exchanges management will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'return-requests':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Return Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Return requests management will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'exchange-processing':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Exchange Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Exchange processing system will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'refund-management':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Refund Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Refund management system will be displayed here.</p>
            </CardContent>
          </Card>
        );
      case 'return-analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Return Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Return analytics and insights will be displayed here.</p>
            </CardContent>
          </Card>
        );
      default:
        console.log('⚠️ LogisticsContent - unknown submenu, defaulting to courier partners');
        return <CourierPartnersContent />;
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
};
