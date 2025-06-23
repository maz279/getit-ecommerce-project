
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SystemStatusBar } from './header/SystemStatusBar';
import { SearchBarSection } from './header/SearchBarSection';
import { QuickActionsSection } from './header/QuickActionsSection';
import { NotificationCenter } from './header/NotificationCenter';
import { AdminProfileDropdown } from './header/AdminProfileDropdown';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('BDT');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const systemStatus = {
    overall: 'Operational',
    database: 'Connected',
    paymentGateways: 'All Active',
    apiStatus: 'Healthy',
    serverLoad: 'Normal',
    activeUsers: '15,437'
  };

  return (
    <TooltipProvider>
      <header className="bg-white shadow-lg border-b border-gray-200">
        {/* Top Status Bar */}
        <SystemStatusBar
          systemStatus={systemStatus}
          language={language}
          setLanguage={setLanguage}
          currency={currency}
          setCurrency={setCurrency}
        />

        {/* Main Header */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Menu & Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu size={20} />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {userProfile?.full_name || 'John Doe'} - Super Administrator
                </p>
              </div>
            </div>

            {/* Center - Search Bar */}
            <SearchBarSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
            />

            {/* Right side - Quick Actions, Notifications, Profile */}
            <div className="flex items-center space-x-4">
              <QuickActionsSection />
              <NotificationCenter />
              <AdminProfileDropdown 
                userProfile={userProfile}
                handleSignOut={handleSignOut}
              />
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};
