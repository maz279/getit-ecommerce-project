
import React from 'react';
import { Shield, Globe, Mail, Phone, Clock, Server, Users, Package } from 'lucide-react';

export const AdminDashboardFooter: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-8">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Platform Info */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Shield className="mr-2" size={16} />
              Platform Management
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>GETIT Bangladesh</p>
              <p>Multi-Vendor E-commerce Platform</p>
              <p>Admin Control Panel v2.0</p>
              <div className="flex items-center mt-3">
                <Globe size={14} className="mr-2" />
                <span>Serving Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Platform Statistics</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users size={14} className="mr-2" />
                  Active Vendors
                </span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Package size={14} className="mr-2" />
                  Total Products
                </span>
                <span className="font-medium">45,678</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Server size={14} className="mr-2" />
                  System Status
                </span>
                <span className="text-green-600 font-medium">Online</span>
              </div>
            </div>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Admin Support</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail size={14} className="mr-2" />
                <span>admin@getit.com.bd</span>
              </div>
              <div className="flex items-center">
                <Phone size={14} className="mr-2" />
                <span>+880-1XXX-XXXXXX</span>
              </div>
              <div className="flex items-center">
                <Clock size={14} className="mr-2" />
                <span>24/7 System Monitoring</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="block w-full text-left text-sm text-blue-600 hover:text-blue-800">
                View System Logs
              </button>
              <button className="block w-full text-left text-sm text-blue-600 hover:text-blue-800">
                Generate Reports
              </button>
              <button className="block w-full text-left text-sm text-blue-600 hover:text-blue-800">
                Backup Database
              </button>
              <button className="block w-full text-left text-sm text-blue-600 hover:text-blue-800">
                Security Audit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>© 2024 GETIT Bangladesh. All rights reserved.</span>
            <span>•</span>
            <span>Admin Panel Version 2.0.1</span>
          </div>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <span>Last Login: {new Date().toLocaleDateString()}</span>
            <span>•</span>
            <span className="flex items-center">
              <Server size={12} className="mr-1" />
              Server: BD-ADMIN-01
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
