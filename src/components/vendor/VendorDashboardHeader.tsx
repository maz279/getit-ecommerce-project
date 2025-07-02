import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Menu, Search, Bell, MessageSquare, Plus, Store,
  TrendingUp, Package, ShoppingCart, DollarSign
} from 'lucide-react';
import { VendorProfileDropdown } from './header/VendorProfileDropdown';
import { VendorNotificationCenter } from './header/VendorNotificationCenter';

interface VendorDashboardHeaderProps {
  onSidebarToggle: () => void;
}

export const VendorDashboardHeader: React.FC<VendorDashboardHeaderProps> = ({
  onSidebarToggle
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 h-[120px]">
      {/* Top Bar */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <Store className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Vendor Portal</h1>
              <p className="text-xs text-gray-500">Electronics Store</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products, orders..."
              className="pl-10 w-80"
            />
          </div>

          {/* Quick Actions */}
          <Button size="sm" className="hidden lg:flex">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>
            {showNotifications && (
              <VendorNotificationCenter onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* Messages */}
          <Button variant="ghost" size="sm">
            <MessageSquare className="h-5 w-5" />
            <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              2
            </Badge>
          </Button>

          {/* Profile */}
          <VendorProfileDropdown />
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="h-14 flex items-center justify-between px-6 bg-gray-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Today's Sales: ₹12,450</span>
            <Badge variant="secondary" className="text-xs">+23%</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-blue-600" />
            <span className="text-sm">Pending Orders: 8</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-purple-600" />
            <span className="text-sm">Low Stock: 5 items</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium">Monthly Earnings: ₹1,45,230</span>
        </div>
      </div>
    </header>
  );
};