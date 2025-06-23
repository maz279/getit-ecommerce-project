
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Settings,
  FileText,
  Bell,
  Store,
  DollarSign,
  BarChart3,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed
}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'vendors', label: 'Vendors', icon: Store },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-50 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-lg">GETIT Admin</span>
          </Link>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-gray-700 border-r-4 border-blue-500' : ''
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-400">Admin Panel v2.0</div>
            <div className="text-xs text-gray-300 mt-1">GETIT Bangladesh</div>
          </div>
        </div>
      )}
    </div>
  );
};
