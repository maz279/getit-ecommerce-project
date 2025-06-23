
import React from 'react';
import { 
  Shield, Globe, Mail, Phone, Clock, Server, Users, Package, 
  FileText, Book, HelpCircle, Settings, Award, Heart,
  Facebook, Linkedin, Twitter, Youtube, MessageCircle,
  AlertTriangle, Database, Monitor, Wifi, Lock, Building2
} from 'lucide-react';

export const AdminDashboardFooter: React.FC = () => {
  const currentTime = new Date().toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white mt-8">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          
          {/* Company Information with Logo */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-3">
              <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-2 rounded-lg mr-3">
                <Building2 className="text-white" size={16} />
              </div>
              <h3 className="text-sm font-semibold text-blue-300">
                GetIt Bangladesh
              </h3>
            </div>
            <div className="space-y-2 text-xs text-gray-300">
              <div>
                <h4 className="font-medium text-white mb-1 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">GetIt Bangladesh</h4>
                <div className="space-y-1">
                  <p>Jahir Smart Tower 205/1 & 205/1/A</p>
                  <p>West Kafrul, Taltola</p>
                  <p>Dhaka-1207, Bangladesh</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <Phone size={10} className="mr-1 text-green-400" />
                  <span>+880-2-9876543</span>
                </div>
                <div className="flex items-center">
                  <Mail size={10} className="mr-1 text-blue-400" />
                  <span>admin@getit.com.bd</span>
                </div>
                <div className="flex items-center">
                  <Clock size={10} className="mr-1 text-orange-400" />
                  <span>Sun-Thu, 9AM-6PM</span>
                </div>
                <div className="flex items-center text-red-400">
                  <AlertTriangle size={10} className="mr-1" />
                  <span>Emergency: +880-1700-123456</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold mb-3 flex items-center text-purple-300">
              <FileText className="mr-2 text-purple-400" size={14} />
              Legal & Compliance
            </h3>
            <div className="space-y-1 text-xs">
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Terms of Service
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Privacy Policy
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Admin User Agreement
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Data Protection Policy
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Cookie Policy
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Compliance Documentation
              </button>
            </div>
          </div>

          {/* Documentation & Resources */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold mb-3 flex items-center text-green-300">
              <Book className="mr-2 text-green-400" size={14} />
              Documentation
            </h3>
            <div className="space-y-1 text-xs">
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Admin User Manual
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                API Documentation
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Video Tutorials
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Best Practices Guide
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Troubleshooting Guide
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                System Requirements
              </button>
            </div>
          </div>

          {/* Technical Information */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold mb-3 flex items-center text-orange-300">
              <Server className="mr-2 text-orange-400" size={14} />
              Technical Info
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center justify-between">
                <span>Platform:</span>
                <span className="font-medium text-white">2.0.1</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Build:</span>
                <span className="font-medium text-white">20250623.001</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Database:</span>
                <span className="font-medium text-white">PostgreSQL 14.2</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Environment:</span>
                <span className="text-green-400 font-medium">Production</span>
              </div>
              <div className="text-xs">
                <p>Update: June 20, 2025</p>
                <p>Maintenance: June 30, 2025</p>
              </div>
            </div>
          </div>

          {/* Quick Support */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold mb-3 flex items-center text-red-300">
              <HelpCircle className="mr-2 text-red-400" size={14} />
              Quick Support
            </h3>
            <div className="space-y-1 text-xs">
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Support Ticket
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Live Chat
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Call Support
              </button>
              <button className="block w-full text-left text-red-300 hover:text-red-100 transition-colors">
                Emergency Support
              </button>
              <button className="block w-full text-left text-orange-300 hover:text-orange-100 transition-colors">
                Security Issue
              </button>
              <button className="block w-full text-left text-green-300 hover:text-green-100 transition-colors">
                Feature Request
              </button>
            </div>
          </div>

          {/* Certifications */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold mb-3 flex items-center text-yellow-300">
              <Award className="mr-2 text-yellow-400" size={14} />
              Certifications
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center">
                <Shield size={10} className="mr-1 text-green-400" />
                <span>PCI DSS Compliant</span>
              </div>
              <div className="flex items-center">
                <Award size={10} className="mr-1 text-blue-400" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center">
                <Shield size={10} className="mr-1 text-green-400" />
                <span>Bangladesh Bank Approved</span>
              </div>
              <div className="flex items-center">
                <Lock size={10} className="mr-1 text-purple-400" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center">
                <Globe size={10} className="mr-1 text-blue-400" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-6 pt-6 border-t border-gray-700">
          
          {/* Partners */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold mb-3 flex items-center text-pink-300">
              <Heart className="mr-2 text-pink-400" size={14} />
              Partners
            </h3>
            <div className="space-y-2 text-xs text-gray-300">
              <div>
                <h4 className="font-medium text-white mb-1">Payment</h4>
                <p>bKash, Nagad, Rocket, SSL Commerz</p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Shipping</h4>
                <p>Pathao, Paperfly, Sundarban, RedX</p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Infrastructure</h4>
                <p>AWS, CloudFlare, New Relic</p>
              </div>
            </div>
          </div>

          {/* Platform Metrics */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold mb-3 flex items-center text-cyan-300">
              <Monitor className="mr-2 text-cyan-400" size={14} />
              Platform Metrics
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users size={10} className="mr-1 text-blue-400" />
                  Vendors
                </span>
                <span className="font-medium text-white">12,456</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users size={10} className="mr-1 text-green-400" />
                  Customers
                </span>
                <span className="font-medium text-white">456,789</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Package size={10} className="mr-1 text-purple-400" />
                  Products
                </span>
                <span className="font-medium text-white">2,345,678</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Orders Today</span>
                <span className="font-medium text-green-400">8,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Revenue Today</span>
                <span className="font-medium text-green-400">৳15,67,890</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Wifi size={10} className="mr-1 text-green-400" />
                  Uptime
                </span>
                <span className="font-medium text-green-400">99.97%</span>
              </div>
            </div>
          </div>

          {/* Connect With Us */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold mb-3 flex items-center text-indigo-300">
              <Globe className="mr-2 text-indigo-400" size={14} />
              Connect With Us
            </h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <Facebook size={12} className="text-blue-500" />
                <button className="text-blue-300 hover:text-blue-100 transition-colors">@GetItBangladesh</button>
              </div>
              <div className="flex items-center space-x-2">
                <Linkedin size={12} className="text-blue-600" />
                <button className="text-blue-300 hover:text-blue-100 transition-colors">GetIt Bangladesh</button>
              </div>
              <div className="flex items-center space-x-2">
                <Twitter size={12} className="text-blue-400" />
                <button className="text-blue-300 hover:text-blue-100 transition-colors">@GetItBD</button>
              </div>
              <div className="flex items-center space-x-2">
                <Youtube size={12} className="text-red-500" />
                <button className="text-blue-300 hover:text-blue-100 transition-colors">GetIt Platform</button>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle size={12} className="text-green-500" />
                <button className="text-blue-300 hover:text-blue-100 transition-colors">+880-1700-654321</button>
              </div>
            </div>
          </div>

          {/* Environment Details */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold mb-3 flex items-center text-teal-300">
              <Database className="mr-2 text-teal-400" size={14} />
              Environment
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center justify-between">
                <span>Environment:</span>
                <span className="font-medium text-green-400">Production</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Region:</span>
                <span className="font-medium text-white">Bangladesh</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Load Balancer:</span>
                <span className="font-medium text-green-400">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span>CDN Status:</span>
                <span className="font-medium text-green-400">Operational</span>
              </div>
              <div className="text-xs">
                <p>Database: Primary + 2 Replicas</p>
                <p>Cache: Redis Cluster Active</p>
                <p>Encryption: AES-256</p>
                <p>Backup: Every 6 hours</p>
              </div>
            </div>
          </div>

          {/* Emergency Information */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold mb-3 flex items-center text-red-300">
              <AlertTriangle className="mr-2 text-red-400" size={14} />
              Emergency
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center">
                <Phone size={10} className="mr-1 text-red-400" />
                <span>Emergency: +880-1700-999888</span>
              </div>
              <div className="flex items-center">
                <Clock size={10} className="mr-1 text-blue-400" />
                <span>24/7: +880-1700-247365</span>
              </div>
              <div className="text-xs">
                <p>Maintenance: Saturdays 2-4 AM</p>
                <p>Status: status.getit.com.bd</p>
                <p>Incidents: incidents@getit.com.bd</p>
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold mb-3 flex items-center text-emerald-300">
              <Settings className="mr-2 text-emerald-400" size={14} />
              Accessibility
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <p>• WCAG 2.1 AA Compliant</p>
              <p>• Screen Reader Compatible</p>
              <p>• Keyboard Navigation</p>
              <p>• High Contrast Mode</p>
              <p>• Font Size Adjustment</p>
              <p>• Data Retention: 7 years</p>
              <p>• Audit Log: 10 years</p>
            </div>
          </div>
        </div>

        {/* Third Row - Educational Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-700">
          
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center text-violet-300">
              <Book className="mr-2 text-violet-400" size={14} />
              Educational Resources
            </h3>
            <div className="space-y-1 text-xs">
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Bangladesh E-commerce Guidelines
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Multi-vendor Best Practices
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Payment Gateway Integration
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Vendor Onboarding Checklist
              </button>
              <button className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors">
                Security Best Practices
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center text-amber-300">
              <Database className="mr-2 text-amber-400" size={14} />
              Data Information
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <p>• Data Retention Policy: 7 years</p>
              <p>• Backup Frequency: Every 6 hours</p>
              <p>• Data Center: Dhaka, Bangladesh</p>
              <p>• Data Encryption: AES-256</p>
              <p>• Audit Log Retention: 10 years</p>
              <p>• Compliance: GDPR, PCI DSS</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center text-rose-300">
              <Monitor className="mr-2 text-rose-400" size={14} />
              System Status
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <p>• Environment: Production</p>
              <p>• Region: Bangladesh (Asia/Dhaka)</p>
              <p>• Load Balancer: Active</p>
              <p>• CDN Status: Operational</p>
              <p>• Database: Primary + 2 Replicas</p>
              <p>• Cache: Redis Cluster Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar - Compact */}
      <div className="bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          {/* Copyright Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center text-xs text-gray-300 mb-3">
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-3 mb-2 lg:mb-0">
              <span>© 2025 GetIt Bangladesh. All rights reserved.</span>
              <span className="hidden lg:inline">•</span>
              <span>Developed by GetIt Technology Team</span>
              <span className="hidden lg:inline">•</span>
              <span>Powered by Microservices</span>
              <span className="hidden lg:inline">•</span>
              <span>Hosted on AWS</span>
            </div>
          </div>
          
          {/* Admin Session Information */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs text-gray-400 pt-3 border-t border-gray-600">
            <div>
              <span className="font-medium text-gray-300">Last Updated:</span>
              <p className="text-gray-400">{currentTime}</p>
            </div>
            <div>
              <span className="font-medium text-gray-300">Session:</span>
              <p className="text-orange-400">Expires in 45 min</p>
            </div>
            <div>
              <span className="font-medium text-gray-300">User:</span>
              <p className="text-gray-400">john.doe@getit.com.bd</p>
            </div>
            <div>
              <span className="font-medium text-gray-300">IP:</span>
              <p className="text-gray-400">103.xxx.xxx.xxx (Dhaka)</p>
            </div>
            <div>
              <span className="font-medium text-gray-300">Browser:</span>
              <p className="text-gray-400">Chrome 124.0.6367.91</p>
            </div>
            <div>
              <span className="font-medium text-gray-300">Resolution:</span>
              <p className="text-gray-400">1920x1080</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
