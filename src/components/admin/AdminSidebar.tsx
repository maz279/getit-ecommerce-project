
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
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 text-gray-800 transition-all duration-300 z-50 shadow-lg border-r border-gray-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-300 bg-white/50 backdrop-blur-sm">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            <span className="font-bold text-base text-gray-700">GETIT Admin</span>
          </Link>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Scrollable Navigation */}
      <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
        <nav className="mt-4 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2.5 mb-1 text-left hover:bg-white/60 hover:shadow-sm transition-all duration-200 rounded-lg text-xs ${
                  isActive ? 'bg-white shadow-md border-l-4 border-blue-500 text-blue-700' : 'text-gray-600'
                }`}
              >
                <Icon size={16} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="ml-2.5 font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5 shadow-sm border border-gray-200">
            <div className="text-xs text-gray-500">Admin Panel v2.0</div>
            <div className="text-xs text-gray-600 mt-0.5 font-medium">GETIT Bangladesh</div>
          </div>
        </div>
      )}
    </div>
  );
};
