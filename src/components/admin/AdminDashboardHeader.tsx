
import React, { useState } from 'react';
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
import { GlobalAISearchBar } from './header/GlobalAISearchBar';

interface AdminDashboardHeaderProps {
  userProfile?: any;
}

export const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  userProfile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
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
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      {/* System Status Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-4 py-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-6">
            {/* Logo & Branding */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-md flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xs">G</span>
              </div>
              <div>
                <span className="font-bold text-sm">GETIT Admin</span>
                <div className="text-xs text-blue-100">v2.0.1</div>
              </div>
            </div>

            {/* System Status Indicators */}
            <div className="hidden lg:flex items-center space-x-4">
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs">System: {systemStatus.overall}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between space-x-4">
                      <span>Database:</span>
                      <span className="text-green-400">{systemStatus.database}</span>
                    </div>
                    <div className="flex items-center justify-between space-x-4">
                      <span>Payment:</span>
                      <span className="text-green-400">{systemStatus.paymentGateways}</span>
                    </div>
                    <div className="flex items-center justify-between space-x-4">
                      <span>API:</span>
                      <span className="text-green-400">{systemStatus.apiStatus}</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
              
              <div className="flex items-center space-x-1">
                <Users size={10} />
                <span className="text-xs">Active: {systemStatus.activeUsers}</span>
              </div>
            </div>
          </div>

          {/* Current Time & Language/Currency */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1">
              <Clock size={10} />
              <span className="text-xs">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })} - {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>

            {/* Language & Currency Selector */}
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-6 px-2 text-xs">
                    <Languages size={10} className="mr-1" />
                    {language === 'en' ? 'EN' : 'বাং'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white z-50">
                  <DropdownMenuItem onClick={() => setLanguage('en')}>
                    English {language === 'en' && '✓'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('bn')}>
                    বাংলা {language === 'bn' && '✓'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-6 px-2 text-xs">
                    <DollarSign size={10} className="mr-1" />
                    {currency}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white z-50">
                  <DropdownMenuItem onClick={() => setCurrency('BDT')}>
                    BDT {currency === 'BDT' && '✓'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrency('USD')}>
                    USD {currency === 'USD' && '✓'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="h-[70px] bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-between px-6">
        {/* Left Section - Logo and Branding */}
        <div className="flex items-center space-x-4">
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

        {/* Center Section - Global AI Search */}
        <GlobalAISearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />

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
