
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
    <header className="h-[70px] bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 relative z-50">
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
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-gray-800">GetIt Admin</h1>
            <p className="text-xs text-gray-500">Multi-Vendor Platform</p>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-2xl mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search vendors, products, orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Section - Actions and Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
              3
            </Badge>
          </Button>
        </div>

        {/* Settings */}
        <Button variant="ghost" size="sm" className="p-2">
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-2"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              {userProfile?.avatar ? (
                <img 
                  src={userProfile.avatar} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <User className="h-4 w-4 text-blue-600" />
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

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-100">
                <p className="font-medium text-gray-800">{userProfile?.name || 'Admin User'}</p>
                <p className="text-sm text-gray-500">{userProfile?.email || 'admin@getit.com'}</p>
                <p className="text-xs text-blue-600 mt-1">{userProfile?.role || 'System Administrator'}</p>
              </div>
              
              <div className="py-2">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </button>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
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
