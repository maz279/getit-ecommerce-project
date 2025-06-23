
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SystemStatusBar } from './header/SystemStatusBar';
import { GlobalAISearchBar } from './header/GlobalAISearchBar';
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
        {/* Top Status Bar - Made thinner */}
        <SystemStatusBar
          systemStatus={systemStatus}
          language={language}
          setLanguage={setLanguage}
          currency={currency}
          setCurrency={setCurrency}
        />

        {/* Main Header - Reduced padding */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Left side - Menu & Title - Compressed */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu size={18} />
              </button>
              
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-600">
                  Welcome, {userProfile?.full_name || 'John Doe'} - Super Admin
                </p>
              </div>
            </div>

            {/* Center - Global AI Search Bar */}
            <GlobalAISearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
            />

            {/* Right side - Quick Actions, Notifications, Profile - Compressed */}
            <div className="flex items-center space-x-2">
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
