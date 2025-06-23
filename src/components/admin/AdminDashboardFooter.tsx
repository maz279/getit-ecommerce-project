
import React from 'react';
import { 
  Shield, Globe, Mail, Phone, Clock, Server, Users, Package, 
  FileText, Book, HelpCircle, Settings, Award, Heart,
  Facebook, Linkedin, Twitter, Youtube, MessageCircle,
  AlertTriangle, Database, Monitor, Wifi, Lock
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
    <footer className="bg-gray-50 border-t border-gray-200 mt-8">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          
          {/* Company Information */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Shield className="mr-2" size={16} />
              Company Information
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">GetIt Platform</h4>
                <div className="space-y-1">
                  <p>House 15, Road 8, Dhanmondi</p>
                  <p>Dhaka 1205, Bangladesh</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <Phone size={12} className="mr-2" />
                  <span>+880-2-9876543</span>
                </div>
                <div className="flex items-center">
                  <Mail size={12} className="mr-2" />
                  <span>admin@getit.com.bd</span>
                </div>
                <div className="flex items-center">
                  <Clock size={12} className="mr-2" />
                  <span>Sun-Thu, 9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center text-red-600">
                  <AlertTriangle size={12} className="mr-2" />
                  <span>Emergency: +880-1700-123456</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="mr-2" size={16} />
              Legal & Compliance
            </h3>
            <div className="space-y-2 text-sm">
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Terms of Service
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Privacy Policy
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Admin User Agreement
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Data Protection Policy
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Cookie Policy
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Compliance Documentation
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Regulatory Information
              </button>
            </div>
          </div>

          {/* Documentation & Resources */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Book className="mr-2" size={16} />
              Documentation & Resources
            </h3>
            <div className="space-y-2 text-sm">
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Admin User Manual
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                API Documentation
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Video Tutorials
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Best Practices Guide
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Troubleshooting Guide
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                System Requirements
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Release Notes
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Change Log
              </button>
            </div>
          </div>

          {/* Technical Information */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Server className="mr-2" size={16} />
              Technical Information
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Platform Version:</span>
                <span className="font-medium">2.0.1</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Build Number:</span>
                <span className="font-medium">20250623.001</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Database:</span>
                <span className="font-medium">PostgreSQL 14.2</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Environment:</span>
                <span className="text-green-600 font-medium">Production</span>
              </div>
              <div className="text-xs">
                <p>Last Update: June 20, 2025</p>
                <p>Next Maintenance: June 30, 2025 (2:00 AM - 4:00 AM)</p>
              </div>
            </div>
          </div>

          {/* Quick Support Links */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <HelpCircle className="mr-2" size={16} />
              Quick Support
            </h3>
            <div className="space-y-2 text-sm">
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Submit Support Ticket
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Live Chat Support
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Call Support Hotline
              </button>
              <button className="block w-full text-left text-red-600 hover:text-red-800">
                Emergency Technical Support
              </button>
              <button className="block w-full text-left text-orange-600 hover:text-orange-800">
                Report Security Issue
              </button>
              <button className="block w-full text-left text-green-600 hover:text-green-800">
                Feature Request
              </button>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-8 pt-8 border-t border-gray-200">
          
          {/* Compliance & Certifications */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Award className="mr-2" size={16} />
              Certifications
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield size={12} className="mr-2 text-green-600" />
                <span>PCI DSS Compliant</span>
              </div>
              <div className="flex items-center">
                <Award size={12} className="mr-2 text-blue-600" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center">
                <Shield size={12} className="mr-2 text-green-600" />
                <span>Bangladesh Bank Approved</span>
              </div>
              <div className="flex items-center">
                <Lock size={12} className="mr-2 text-green-600" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center">
                <Globe size={12} className="mr-2 text-blue-600" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center">
                <Monitor size={12} className="mr-2 text-purple-600" />
                <span>SOC 2 Type II</span>
              </div>
            </div>
          </div>

          {/* Partner Information */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Heart className="mr-2" size={16} />
              Technology Partners
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Payment Partners</h4>
                <p>bKash, Nagad, Rocket, SSL Commerz</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Shipping Partners</h4>
                <p>Pathao, Paperfly, Sundarban, RedX, eCourier</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Infrastructure</h4>
                <p>AWS, CloudFlare, New Relic</p>
              </div>
            </div>
          </div>

          {/* System Statistics */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Monitor className="mr-2" size={16} />
              Platform Metrics
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users size={12} className="mr-2" />
                  Vendors
                </span>
                <span className="font-medium">12,456</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users size={12} className="mr-2" />
                  Customers
                </span>
                <span className="font-medium">456,789</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Package size={12} className="mr-2" />
                  Products
                </span>
                <span className="font-medium">2,345,678</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Orders Today</span>
                <span className="font-medium text-green-600">8,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Revenue Today</span>
                <span className="font-medium text-green-600">৳15,67,890</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Wifi size={12} className="mr-2 text-green-600" />
                  Uptime
                </span>
                <span className="font-medium text-green-600">99.97%</span>
              </div>
            </div>
          </div>

          {/* Social Media & Communication */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Globe className="mr-2" size={16} />
              Connect With Us
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Facebook size={14} className="text-blue-600" />
                <button className="text-blue-600 hover:text-blue-800">@GetItBangladesh</button>
              </div>
              <div className="flex items-center space-x-2">
                <Linkedin size={14} className="text-blue-700" />
                <button className="text-blue-600 hover:text-blue-800">GetIt Bangladesh</button>
              </div>
              <div className="flex items-center space-x-2">
                <Twitter size={14} className="text-blue-400" />
                <button className="text-blue-600 hover:text-blue-800">@GetItBD</button>
              </div>
              <div className="flex items-center space-x-2">
                <Youtube size={14} className="text-red-600" />
                <button className="text-blue-600 hover:text-blue-800">GetIt Platform</button>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle size={14} className="text-green-600" />
                <button className="text-blue-600 hover:text-blue-800">+880-1700-654321</button>
              </div>
            </div>
          </div>

          {/* Environment Information */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Database className="mr-2" size={16} />
              Environment Details
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Environment:</span>
                <span className="font-medium text-green-600">Production</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Region:</span>
                <span className="font-medium">Bangladesh</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Load Balancer:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span>CDN Status:</span>
                <span className="font-medium text-green-600">Operational</span>
              </div>
              <div className="text-xs">
                <p>Database: Primary + 2 Replicas</p>
                <p>Cache: Redis Cluster Active</p>
                <p>Data Encryption: AES-256</p>
                <p>Backup: Every 6 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Third Row - Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pt-8 border-t border-gray-200">
          
          {/* Emergency & Maintenance */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="mr-2" size={16} />
              Emergency Information
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Phone size={12} className="mr-2 text-red-600" />
                <span>Emergency: +880-1700-999888</span>
              </div>
              <div className="flex items-center">
                <Clock size={12} className="mr-2 text-blue-600" />
                <span>24/7 Hotline: +880-1700-247365</span>
              </div>
              <div className="text-xs">
                <p>Maintenance: Saturdays 2:00 AM - 4:00 AM</p>
                <p>Status: status.getit.com.bd</p>
                <p>Incidents: incidents@getit.com.bd</p>
              </div>
            </div>
          </div>

          {/* Accessibility & Compliance */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Settings className="mr-2" size={16} />
              Accessibility
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• WCAG 2.1 AA Compliant</p>
              <p>• Screen Reader Compatible</p>
              <p>• Keyboard Navigation Supported</p>
              <p>• High Contrast Mode Available</p>
              <p>• Font Size Adjustment</p>
              <p>• Data Retention: 7 years</p>
              <p>• Audit Log: 10 years</p>
            </div>
          </div>

          {/* Educational Resources */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Book className="mr-2" size={16} />
              Educational Resources
            </h3>
            <div className="space-y-2 text-sm">
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Bangladesh E-commerce Guidelines
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Multi-vendor Best Practices
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Payment Gateway Integration Guide
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Vendor Onboarding Checklist
              </button>
              <button className="block w-full text-left text-blue-600 hover:text-blue-800">
                Security Best Practices
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="bg-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Copyright Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center text-sm text-gray-600 mb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-2 lg:mb-0">
              <span>© 2025 GetIt Platform. All rights reserved.</span>
              <span className="hidden lg:inline">•</span>
              <span>Developed by GetIt Technology Team</span>
              <span className="hidden lg:inline">•</span>
              <span>Powered by Microservices Architecture</span>
              <span className="hidden lg:inline">•</span>
              <span>Hosted on AWS Infrastructure</span>
            </div>
          </div>
          
          {/* Admin Session Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 text-xs text-gray-500 pt-4 border-t border-gray-200">
            <div>
              <span className="font-medium">Last Updated:</span>
              <p>{currentTime}</p>
            </div>
            <div>
              <span className="font-medium">Admin Session:</span>
              <p className="text-orange-600">Expires in 45 minutes</p>
            </div>
            <div>
              <span className="font-medium">Current User:</span>
              <p>john.doe@getit.com.bd</p>
            </div>
            <div>
              <span className="font-medium">IP Address:</span>
              <p>103.xxx.xxx.xxx (Dhaka, Bangladesh)</p>
            </div>
            <div>
              <span className="font-medium">Browser:</span>
              <p>Chrome 124.0.6367.91</p>
            </div>
            <div>
              <span className="font-medium">Screen Resolution:</span>
              <p>1920x1080</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
