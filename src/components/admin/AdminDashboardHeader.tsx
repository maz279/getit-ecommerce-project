
import React from 'react';
import { Bell, Search, User, LogOut, Menu, Globe, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AdminDashboardHeaderProps {
  userProfile: any;
  onToggleSidebar: () => void;
}

export const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  userProfile,
  onToggleSidebar
}) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      {/* Top admin bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Shield size={16} />
              <span>Admin Panel - GETIT Bangladesh</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe size={16} />
              <span>Multi-Vendor Platform Management</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TrendingUp size={16} />
              <span>System Status: All Services Online</span>
            </div>
            <div className="text-xs opacity-75">
              Last Updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {userProfile?.full_name || 'Admin'} - Manage your multi-vendor platform
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search vendors, products, orders..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-64"
              />
            </div>

            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <button className="px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                Add Vendor
              </button>
              <button className="px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                View Reports
              </button>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-gray-700">
                  {userProfile?.full_name || 'Admin User'}
                </div>
                <div className="text-xs text-gray-500">
                  Platform Administrator
                </div>
              </div>
              
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
