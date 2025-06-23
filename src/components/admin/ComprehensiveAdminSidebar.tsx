
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ComprehensiveAdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const ComprehensiveAdminSidebar: React.FC<ComprehensiveAdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed
}) => {
  return (
    <div className={`fixed left-0 top-[120px] bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-800 transition-all duration-300 z-30 shadow-lg border-r border-gray-200 ${
      collapsed ? 'w-16' : 'w-80'
    }`} style={{ bottom: '-360px', height: 'calc(100vh + 360px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🏪</span>
            </div>
            <div>
              <span className="font-bold text-lg text-gray-800">GetIt Admin</span>
              <div className="text-xs text-gray-500">Multi-Vendor Platform</div>
              <div className="text-xs text-blue-600 font-medium">v2.0.1</div>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Empty Navigation Area */}
      <div className="flex-1 overflow-hidden" style={{ height: 'calc(100vh + 200px)' }}>
        <ScrollArea className="h-full">
          <nav className="p-3">
            <div className="text-center text-gray-500 text-sm mt-10">
              Navigation menu cleared
            </div>
          </nav>
        </ScrollArea>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute left-4 right-4" style={{ bottom: '20px' }}>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-200">
            <div className="text-xs text-gray-600 font-medium">System Status</div>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-xs text-green-600 font-medium">All Systems Operational</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Last updated: 2 min ago</div>
          </div>
        </div>
      )}
    </div>
  );
};
