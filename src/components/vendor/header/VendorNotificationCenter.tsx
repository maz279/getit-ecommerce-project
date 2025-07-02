import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, Package, DollarSign, AlertTriangle, 
  Star, MessageSquare, X 
} from 'lucide-react';

interface VendorNotificationCenterProps {
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    type: 'order',
    icon: ShoppingCart,
    title: 'New Order Received',
    message: 'Order #12345 from Ahmed Rahman',
    time: '2 mins ago',
    unread: true
  },
  {
    id: 2,
    type: 'inventory',
    icon: Package,
    title: 'Low Stock Alert',
    message: 'Wireless Earbuds - Only 3 items left',
    time: '15 mins ago',
    unread: true
  },
  {
    id: 3,
    type: 'payment',
    icon: DollarSign,
    title: 'Payment Received',
    message: '₹12,500 credited to your account',
    time: '1 hour ago',
    unread: false
  },
  {
    id: 4,
    type: 'review',
    icon: Star,
    title: 'New Review',
    message: '5-star review on Smart Watch',
    time: '2 hours ago',
    unread: false
  }
];

export const VendorNotificationCenter: React.FC<VendorNotificationCenterProps> = ({
  onClose
}) => {
  return (
    <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto shadow-lg z-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg">Notifications</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer ${
                notification.unread ? 'bg-blue-50' : ''
              }`}
            >
              <div className={`p-2 rounded-full ${
                notification.type === 'order' ? 'bg-blue-100 text-blue-600' :
                notification.type === 'inventory' ? 'bg-orange-100 text-orange-600' :
                notification.type === 'payment' ? 'bg-green-100 text-green-600' :
                'bg-yellow-100 text-yellow-600'
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          );
        })}
        <div className="p-3 border-t">
          <Button variant="outline" className="w-full" size="sm">
            View All Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};