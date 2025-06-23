
import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Languages, 
  DollarSign 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { NotificationCenter } from './header/NotificationCenter';
import { AdminProfileDropdown } from './header/AdminProfileDropdown';
import { QuickActionsSection } from './header/QuickActionsSection';
import { EnhancedAdminSearchBar } from './header/EnhancedAdminSearchBar';
import { SystemStatusBar } from './header/SystemStatusBar';

interface AdminDashboardHeaderProps {
  userProfile?: any;
}

export const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  userProfile
}) => {
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('BDT');

  // Mock system status data
  const systemStatus = {
    overall: 'Operational',
    database: 'Connected',
    paymentGateways: 'All Active',
    apiStatus: 'Healthy',
    serverLoad: 'Normal',
    activeUsers: '15,437'
  };

  const handleSignOut = () => {
    console.log('Signing out...');
  };

  return (
    <div className="fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-200 shadow-sm z-50">
      {/* System Status Bar */}
      <SystemStatusBar
        systemStatus={systemStatus}
        language={language}
        setLanguage={setLanguage}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* Main Header */}
      <div className="h-[70px] bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-between px-6">
        {/* Left Section - Logo only */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">G</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section - Enhanced AI Search */}
        <EnhancedAdminSearchBar />

        {/* Right Section - Quick Actions and User Profile */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <QuickActionsSection />

          {/* Notifications */}
          <NotificationCenter />

          {/* Admin Profile */}
          <AdminProfileDropdown 
            userProfile={userProfile}
            handleSignOut={handleSignOut}
          />
        </div>
      </div>
    </div>
  );
};
