
import React from 'react';
import { Shield, Heart, ExternalLink } from 'lucide-react';

export const AdminDashboardFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 px-6 py-4 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Left Section - Copyright */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">G</span>
              </div>
              <span className="text-sm font-medium text-gray-700">GetIt Bangladesh</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <p className="text-sm text-gray-500">
              © {currentYear} GetIt Bangladesh. All rights reserved.
            </p>
          </div>

          {/* Center Section - Quick Links */}
          <div className="flex items-center space-x-6">
            <a 
              href="#" 
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center space-x-1"
            >
              <span>Privacy Policy</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a 
              href="#" 
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center space-x-1"
            >
              <span>Terms of Service</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a 
              href="#" 
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center space-x-1"
            >
              <span>Support</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Right Section - Status and Version */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">System Status: </span>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500">v2.0.1</span>
              <Heart className="h-3 w-3 text-red-500" />
            </div>
          </div>
        </div>

        {/* Bottom Section - Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <p className="text-xs text-gray-400">
              Designed and built for Bangladesh's growing e-commerce ecosystem
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>Last Updated: {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
              <span>Server Time: {new Date().toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
