
import React, { useState } from 'react';
import { Bell, Search, User, Settings, Menu, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AdminDashboardHeaderProps {
  userProfile?: any;
  onToggleSidebar: () => void;
}

export const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  userProfile,
  onToggleSidebar
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-[70px] bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-b border-gray-200 shadow-sm flex items-center justify-between px-6 relative z-50">
      {/* Left Section - Logo and Toggle */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden p-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">G</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GetIt Admin
              </h1>
              <div className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                <span className="text-xs font-medium text-blue-700">v2.0.1</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 font-medium">Bangladesh Multi-Vendor Ecommerce Platform</p>
          </div>
        </div>
      </div>

      {/* Center Section - Enhanced Search */}
      <div className="flex-1 max-w-2xl mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search vendors, products, orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full bg-white/80 backdrop-blur-sm border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm"
          />
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              <div className="p-2 text-sm text-gray-500">
                Search results for "{searchQuery}"...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Enhanced Actions and Profile */}
      <div className="flex items-center space-x-4">
        {/* Enhanced Notifications */}
        <div className="relative">
          <Button variant="ghost" size="sm" className="p-2 relative hover:bg-white/60 transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs min-w-[20px] h-[20px] flex items-center justify-center p-0 shadow-lg">
              12
            </Badge>
          </Button>
        </div>

        {/* Enhanced Settings */}
        <Button variant="ghost" size="sm" className="p-2 hover:bg-white/60 transition-colors">
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>

        {/* Enhanced User Profile Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-2 hover:bg-white/60 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
              {userProfile?.avatar ? (
                <img 
                  src={userProfile.avatar} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700">
                {userProfile?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500">
                {userProfile?.role || 'System Administrator'}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>

          {/* Enhanced User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{userProfile?.name || 'Admin User'}</p>
                    <p className="text-sm text-gray-600">{userProfile?.email || 'admin@getit.com'}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Online</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>My Profile</span>
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span>Account Settings</span>
                </button>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
