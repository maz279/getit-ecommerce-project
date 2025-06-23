
import React from 'react';
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

interface SystemStatusBarProps {
  systemStatus: {
    overall: string;
    database: string;
    paymentGateways: string;
    apiStatus: string;
    serverLoad: string;
    activeUsers: string;
  };
  language: string;
  setLanguage: (lang: string) => void;
  currency: string;
  setCurrency: (curr: string) => void;
}

export const SystemStatusBar: React.FC<SystemStatusBarProps> = ({
  systemStatus,
  language,
  setLanguage,
  currency,
  setCurrency
}) => {
  return (
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
  );
};
