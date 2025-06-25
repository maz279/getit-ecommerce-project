
import React from 'react';
import { AllOrdersContent } from './forms/orderManagement/AllOrdersContent';
import { OrderSearchContent } from './forms/orderManagement/OrderSearchContent';
import { OrderProcessingContent } from './forms/orderManagement/OrderProcessingContent';
import { OrderTrackingContent } from './forms/orderManagement/OrderTrackingContent';
import { OrderSubmenuContent } from './forms/orderManagement/OrderSubmenuContent';
import { OrderTimelineContent } from './forms/orderManagement/OrderTimelineContent';
import { BulkActionsContent } from './forms/orderManagement/BulkActionsContent';
import { NewOrdersContent } from './forms/orderManagement/NewOrdersContent';

interface OrderManagementContentProps {
  selectedSubmenu: string;
}

export const OrderManagementContent: React.FC<OrderManagementContentProps> = ({ selectedSubmenu }) => {
  const getContent = () => {
    switch (selectedSubmenu) {
      case 'all-orders':
        return <AllOrdersContent />;
      case 'order-search':
      case 'search':
        return <OrderSearchContent />;
      case 'order-timeline':
      case 'timeline':
        return <OrderTimelineContent />;
      case 'bulk-actions':
      case 'bulk':
        return <BulkActionsContent />;
      case 'new-orders':
        return <NewOrdersContent />;
      case 'order-overview':
      case 'order-processing':
      case 'orders':
        return <OrderProcessingContent />;
      case 'order-tracking':
      case 'live-tracking':
        return <OrderTrackingContent />;
      case 'returns-refunds':
        return <OrderSubmenuContent submenu={selectedSubmenu} />;
      default:
        return <OrderProcessingContent />;
    }
  };

  return (
    <div className="p-6">
      {getContent()}
    </div>
  );
};
