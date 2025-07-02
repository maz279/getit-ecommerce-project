import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, Package, ShoppingCart, BarChart3, DollarSign, 
  Users, Settings, MessageSquare, Star, TrendingUp, FileText,
  CreditCard, Truck, Bell, AlertCircle, Clock, Target
} from 'lucide-react';

interface VendorSidebarProps {
  selectedMenu: string;
  selectedSubmenu: string;
  collapsed: boolean;
  onMenuSelect: (menu: string) => void;
  onSubmenuSelect: (submenu: string) => void;
}

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    subItems: [
      { id: 'overview', label: 'Overview' },
      { id: 'analytics', label: 'Analytics' },
      { id: 'performance', label: 'Performance' }
    ]
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    subItems: [
      { id: 'all-products', label: 'All Products' },
      { id: 'add-product', label: 'Add Product' },
      { id: 'inventory', label: 'Inventory' },
      { id: 'categories', label: 'Categories' }
    ]
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingCart,
    subItems: [
      { id: 'pending', label: 'Pending' },
      { id: 'processing', label: 'Processing' },
      { id: 'shipped', label: 'Shipped' },
      { id: 'completed', label: 'Completed' },
      { id: 'refunds', label: 'Refunds' }
    ]
  },
  {
    id: 'earnings',
    label: 'Earnings',
    icon: DollarSign,
    subItems: [
      { id: 'overview', label: 'Overview' },
      { id: 'commission-tracking', label: 'Commission Tracking' },
      { id: 'payouts', label: 'Payouts' },
      { id: 'disputes', label: 'Disputes' }
    ]
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: Users,
    subItems: [
      { id: 'all-customers', label: 'All Customers' },
      { id: 'reviews', label: 'Reviews' },
      { id: 'messages', label: 'Messages' }
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: TrendingUp,
    subItems: [
      { id: 'campaigns', label: 'Campaigns' },
      { id: 'promotions', label: 'Promotions' },
      { id: 'coupons', label: 'Coupons' }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    subItems: [
      { id: 'sales', label: 'Sales Reports' },
      { id: 'products', label: 'Product Reports' },
      { id: 'customer', label: 'Customer Reports' }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    subItems: [
      { id: 'store', label: 'Store Settings' },
      { id: 'profile', label: 'Profile' },
      { id: 'notifications', label: 'Notifications' }
    ]
  }
];

export const VendorSidebar: React.FC<VendorSidebarProps> = ({
  selectedMenu,
  selectedSubmenu,
  collapsed,
  onMenuSelect,
  onSubmenuSelect
}) => {
  return (
    <div className={`fixed left-0 top-[120px] h-[calc(100vh-120px)] bg-white border-r border-gray-200 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    } overflow-y-auto z-30`}>
      
      {/* Quick Stats (when expanded) */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-50 p-2 rounded">
              <div className="text-green-700 font-medium">₹45,230</div>
              <div className="text-green-600">This Month</div>
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <div className="text-blue-700 font-medium">123</div>
              <div className="text-blue-600">Orders</div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <nav className="p-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = selectedMenu === item.id;
          
          return (
            <div key={item.id} className="mb-1">
              <button
                onClick={() => {
                  onMenuSelect(item.id);
                  if (item.subItems?.length > 0) {
                    onSubmenuSelect(item.subItems[0].id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
              
              {/* Sub Items */}
              {!collapsed && isActive && item.subItems && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => onSubmenuSelect(subItem.id)}
                      className={`w-full text-left px-3 py-1 text-xs rounded transition-colors ${
                        selectedSubmenu === subItem.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Store Rating (when expanded) */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="font-medium">4.8</span>
            <span className="text-gray-500">(234 reviews)</span>
          </div>
        </div>
      )}
    </div>
  );
};