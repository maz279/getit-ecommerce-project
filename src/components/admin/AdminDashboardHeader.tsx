
import React, { useState } from 'react';
import { 
  Bell, Search, User, LogOut, Menu, Globe, Shield, TrendingUp, 
  Settings, Key, Activity, ShieldCheck, ChevronDown, Plus, 
  CheckCircle, DollarSign, FileText, Wrench, AlertTriangle,
  Database, Wifi, Server, Users, Clock, Filter, Languages
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

  const notifications = [
    { type: 'vendor', count: 5, text: 'New vendor applications' },
    { type: 'product', count: 8, text: 'Pending product approvals' },
    { type: 'system', count: 3, text: 'System alerts' },
    { type: 'complaint', count: 4, text: 'Customer complaints' },
    { type: 'payment', count: 3, text: 'Payment failures' }
  ];

  const totalNotifications = notifications.reduce((sum, n) => sum + n.count, 0);

  const systemStatus = {
    overall: 'Operational',
    database: 'Connected',
    paymentGateways: 'All Active',
    apiStatus: 'Healthy',
    serverLoad: 'Normal',
    activeUsers: '15,437'
  };

  const quickActions = [
    { icon: Plus, label: 'Add Product', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: CheckCircle, label: 'Approve Vendor', color: 'bg-green-500 hover:bg-green-600' },
    { icon: DollarSign, label: 'Process Payout', color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: FileText, label: 'Generate Report', color: 'bg-orange-500 hover:bg-orange-600' },
    { icon: Wrench, label: 'Maintenance', color: 'bg-gray-500 hover:bg-gray-600' },
    { icon: AlertTriangle, label: 'Emergency Stop', color: 'bg-red-500 hover:bg-red-600' }
  ];

  return (
    <TooltipProvider>
      <header className="bg-white shadow-lg border-b border-gray-200">
        {/* Top Status Bar with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-6 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-8">
              {/* Logo & Branding */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <div>
                  <span className="font-bold text-lg">GETIT Admin</span>
                  <div className="text-xs text-blue-100">Bangladesh Multi-Vendor Ecommerce Platform v2.0.1</div>
                </div>
              </div>

              {/* System Status Indicators */}
              <div className="hidden lg:flex items-center space-x-6">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
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
                        <span>Payment Gateways:</span>
                        <span className="text-green-400">{systemStatus.paymentGateways}</span>
                      </div>
                      <div className="flex items-center justify-between space-x-4">
                        <span>API Status:</span>
                        <span className="text-green-400">{systemStatus.apiStatus}</span>
                      </div>
                      <div className="flex items-center justify-between space-x-4">
                        <span>Server Load:</span>
                        <span className="text-green-400">{systemStatus.serverLoad}</span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
                
                <div className="flex items-center space-x-2">
                  <Users size={14} />
                  <span className="text-xs">Active: {systemStatus.activeUsers}</span>
                </div>
              </div>
            </div>

            {/* Current Time & Language/Currency */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-2">
                <Clock size={14} />
                <span className="text-xs">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} - {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>

              {/* Language & Currency Selector */}
              <div className="flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <Languages size={14} className="mr-1" />
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
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <DollarSign size={14} className="mr-1" />
                      {currency}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white z-50">
                    <DropdownMenuItem onClick={() => setCurrency('BDT')}>
                      BDT (Primary) {currency === 'BDT' && '✓'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCurrency('USD')}>
                      USD (Secondary) {currency === 'USD' && '✓'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

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
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <div className="flex">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="rounded-r-none border-r-0">
                        <Filter size={16} className="mr-2" />
                        {searchFilter === 'all' ? 'All' : searchFilter}
                        <ChevronDown size={14} className="ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white z-50">
                      <DropdownMenuItem onClick={() => setSearchFilter('all')}>All</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSearchFilter('orders')}>Order ID</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSearchFilter('products')}>Product Name</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSearchFilter('vendors')}>Vendor Name</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSearchFilter('customers')}>Customer Email</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSearchFilter('transactions')}>Transaction ID</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search orders, products, vendors, customers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 border border-l-0 rounded-l-none rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Quick Actions, Notifications, Profile */}
            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <div className="hidden xl:flex items-center space-x-2">
                {quickActions.slice(0, 4).map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          className={`${action.color} text-white px-3 py-2`}
                        >
                          <IconComponent size={16} className="mr-2" />
                          <span className="hidden 2xl:inline">{action.label}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {action.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>

              {/* Notification Center */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="relative p-2">
                    <Bell size={20} className="text-gray-600" />
                    {totalNotifications > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                        {totalNotifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-white border shadow-lg z-50" align="end">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Badge variant="secondary">{totalNotifications} unread</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {notifications.map((notification, index) => (
                    <DropdownMenuItem key={index} className="flex items-center justify-between p-3">
                      <span className="text-sm">{notification.text}</span>
                      <Badge variant="outline" className="ml-2">
                        {notification.count}
                      </Badge>
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center text-blue-600 font-medium">
                    View All Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-center text-gray-600">
                    Notification Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Admin Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-3 p-2">
                    <div className="hidden md:block text-right">
                      <div className="text-sm font-medium text-gray-700">
                        {userProfile?.full_name || 'John Doe'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Super Administrator
                      </div>
                    </div>
                    
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <ChevronDown size={14} className="text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white border shadow-lg z-50" align="end">
                  <DropdownMenuLabel>
                    <div className="space-y-1">
                      <div className="font-medium">{userProfile?.full_name || 'John Doe'}</div>
                      <div className="text-xs text-gray-500">Super Administrator</div>
                      <div className="text-xs text-gray-500">Last Login: Today, 09:30 AM</div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem className="flex items-center">
                    <Settings size={16} className="mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Key size={16} className="mr-2" />
                    Change Password
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Activity size={16} className="mr-2" />
                    Activity Log
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <ShieldCheck size={16} className="mr-2" />
                    Two-Factor Authentication
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center text-red-600"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};
