
import React from 'react';
import { AllOrdersContent } from '../forms/orderManagement/AllOrdersContent';
import { OrderSearchContent } from '../forms/orderManagement/OrderSearchContent';
import { OrderProcessingContent } from '../forms/orderManagement/OrderProcessingContent';
import { OrderTrackingContent } from '../forms/orderManagement/OrderTrackingContent';
import { OrderSubmenuContent } from '../forms/orderManagement/OrderSubmenuContent';
import { OrderTimelineContent } from '../forms/orderManagement/OrderTimelineContent';
import { BulkActionsContent } from '../forms/orderManagement/BulkActionsContent';
import { NewOrdersContent } from '../forms/orderManagement/NewOrdersContent';
import { ProcessingOrdersContent } from '../forms/orderManagement/ProcessingOrdersContent';
import { ShippedOrdersContent } from '../forms/orderManagement/ShippedOrdersContent';
import { DeliveredOrdersContent } from '../forms/orderManagement/DeliveredOrdersContent';
import { PaymentStatusContent } from '../forms/orderManagement/PaymentStatusContent';
import { PaymentMethodsContent } from '../forms/orderManagement/PaymentMethodsContent';
import { FailedPaymentsContent } from '../forms/orderManagement/FailedPaymentsContent';
import { RefundProcessingContent } from '../forms/orderManagement/RefundProcessingContent';
import { OrderReportsContent } from '../forms/orderManagement/OrderReportsContent';
import { PerformanceMetricsContent } from '../forms/orderManagement/PerformanceMetricsContent';

interface OrderContentRouterProps {
  selectedSubmenu: string;
}

export const OrderContentRouter: React.FC<OrderContentRouterProps> = ({ selectedSubmenu }) => {
  console.log('🔍 OrderContentRouter - selectedSubmenu:', selectedSubmenu);
  
  switch (selectedSubmenu) {
    case 'all-orders':
      console.log('✅ Routing to AllOrdersContent');
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
    // Order status specific routes
    case 'new-orders':
      console.log('✅ Routing to NewOrdersContent');
      return <NewOrdersContent />;
    case 'processing-orders':
      console.log('✅ Routing to ProcessingOrdersContent');
      return <ProcessingOrdersContent />;
    case 'shipped-orders':
      console.log('✅ Routing to ShippedOrdersContent');
      return <ShippedOrdersContent />;
    case 'delivered-orders':
      console.log('✅ Routing to DeliveredOrdersContent');
      return <DeliveredOrdersContent />;
    case 'cancelled-orders':
    case 'pending-orders':
    case 'completed-orders':
    case 'failed-orders':
    case 'returned-orders':
      return <OrderSubmenuContent submenu={selectedSubmenu} />;
    // Payment related routes
    case 'payment-status':
    case 'payment-management':
    case 'payment-gateway':
    case 'transaction-monitoring':
    case 'payment-analytics':
    case 'payment-disputes':
      console.log('✅ Routing to PaymentStatusContent');
      return <PaymentStatusContent />;
    case 'payment-methods':
      return <PaymentMethodsContent />;
    case 'failed-payments':
      console.log('✅ Routing to FailedPaymentsContent');
      return <FailedPaymentsContent />;
    case 'refund-processing':
    case 'refund-management':
      return <RefundProcessingContent />;
    case 'order-reports':
    case 'order-analytics':
    case 'detailed-reports':
    case 'summary-reports':
    case 'comparative-analysis':
      return <OrderReportsContent />;
    case 'performance-reports':
    case 'performance-metrics':
      return <PerformanceMetricsContent />;
    case 'order-overview':
    case 'order-processing':
    case 'orders':
      console.log('✅ Routing to OrderProcessingContent (default order management)');
      return <OrderProcessingContent />;
    case 'order-tracking':
    case 'live-tracking':
      return <OrderTrackingContent />;
    case 'returns-refunds':
      return <OrderSubmenuContent submenu={selectedSubmenu} />;
    default:
      console.log('⚠️ OrderContentRouter - defaulting to OrderProcessingContent for:', selectedSubmenu);
      return <OrderProcessingContent />;
  }
};
