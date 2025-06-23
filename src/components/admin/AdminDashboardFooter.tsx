
import React from 'react';
import { 
  Shield, 
  Heart, 
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  FileText,
  Book,
  Users,
  Database,
  Server,
  Wifi,
  Cloud,
  CreditCard,
  Truck,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  MessageCircle,
  Award,
  Zap,
  Eye,
  Lock,
  HardDrive,
  Settings,
  BarChart3,
  Globe,
  Headphones,
  FileQuestion,
  Download,
  Calendar,
  Monitor,
  Smartphone
} from 'lucide-react';

export const AdminDashboardFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white mt-12">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Company Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <h3 className="text-sm font-bold text-blue-400">GetIt Platform</h3>
            </div>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-start space-x-2">
                <MapPin className="text-green-400 mt-0.5" size={12} />
                <span>House 15, Road 8, Dhanmondi, Dhaka 1205, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="text-blue-400" size={12} />
                <span>+880-2-9876543</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="text-purple-400" size={12} />
                <span>admin@getit.com.bd</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="text-orange-400" size={12} />
                <span>Sunday-Thursday, 9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="text-red-400" size={12} />
                <span>Emergency: +880-1700-123456</span>
              </div>
            </div>
          </div>

          {/* Legal & Documentation */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-yellow-400 flex items-center space-x-2">
              <FileText size={14} />
              <span>Legal & Documentation</span>
            </h3>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-1">
                <Shield size={10} className="text-blue-400" />
                <span>Terms of Service</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-1">
                <Lock size={10} className="text-green-400" />
                <span>Privacy Policy</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-1">
                <Users size={10} className="text-purple-400" />
                <span>Admin User Agreement</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-1">
                <Eye size={10} className="text-orange-400" />
                <span>Data Protection Policy</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-1">
                <Book size={10} className="text-red-400" />
                <span>API Documentation</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-1">
                <FileQuestion size={10} className="text-cyan-400" />
                <span>Troubleshooting Guide</span>
              </a>
            </div>
          </div>

          {/* Technical Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-cyan-400 flex items-center space-x-2">
              <Server size={14} />
              <span>System Details</span>
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Settings size={10} className="text-blue-400" />
                  <span>Platform Version:</span>
                </span>
                <span className="text-green-400 font-medium">2.0.1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Database size={10} className="text-purple-400" />
                  <span>Database:</span>
                </span>
                <span className="text-green-400 font-medium">PostgreSQL 14.2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Cloud size={10} className="text-orange-400" />
                  <span>Environment:</span>
                </span>
                <span className="text-green-400 font-medium">Production</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Wifi size={10} className="text-green-400" />
                  <span>System Uptime:</span>
                </span>
                <span className="text-green-400 font-medium">99.97%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Calendar size={10} className="text-red-400" />
                  <span>Next Maintenance:</span>
                </span>
                <span className="text-yellow-400 font-medium">June 30, 2025</span>
              </div>
            </div>
          </div>

          {/* Quick Support & Social */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-green-400 flex items-center space-x-2">
              <Headphones size={14} />
              <span>Support & Connect</span>
            </h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-1 text-xs">
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-1">
                  <MessageCircle size={10} className="text-blue-400" />
                  <span>Live Chat</span>
                </a>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-1">
                  <Phone size={10} className="text-green-400" />
                  <span>Call Support</span>
                </a>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-1">
                  <FileText size={10} className="text-purple-400" />
                  <span>Submit Ticket</span>
                </a>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-1">
                  <AlertTriangle size={10} className="text-red-400" />
                  <span>Report Issue</span>
                </a>
              </div>
              
              {/* Social Media */}
              <div className="flex items-center space-x-3 pt-2 border-t border-gray-700">
                <Facebook size={14} className="text-blue-500 hover:text-blue-400 cursor-pointer transition-colors" />
                <Linkedin size={14} className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors" />
                <Twitter size={14} className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors" />
                <Youtube size={14} className="text-red-500 hover:text-red-400 cursor-pointer transition-colors" />
                <MessageCircle size={14} className="text-green-500 hover:text-green-400 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Certifications & Partners Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-700">
          
          {/* Certifications */}
          <div>
            <h3 className="text-sm font-bold text-purple-400 flex items-center space-x-2 mb-3">
              <Award size={14} />
              <span>Certifications & Compliance</span>
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <Shield size={10} className="text-green-400" />
                <span className="text-gray-300">PCI DSS</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award size={10} className="text-blue-400" />
                <span className="text-gray-300">ISO 27001</span>
              </div>
              <div className="flex items-center space-x-1">
                <CreditCard size={10} className="text-yellow-400" />
                <span className="text-gray-300">BB Approved</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock size={10} className="text-green-400" />
                <span className="text-gray-300">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe size={10} className="text-blue-400" />
                <span className="text-gray-300">GDPR</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap size={10} className="text-purple-400" />
                <span className="text-gray-300">SOC 2 Type II</span>
              </div>
            </div>
          </div>

          {/* Partners */}
          <div>
            <h3 className="text-sm font-bold text-orange-400 flex items-center space-x-2 mb-3">
              <Truck size={14} />
              <span>Technology Partners</span>
            </h3>
            <div className="space-y-2 text-xs text-gray-300">
              <div>
                <span className="text-blue-400 font-medium">Payment:</span> bKash, Nagad, Rocket, SSL Commerz
              </div>
              <div>
                <span className="text-green-400 font-medium">Shipping:</span> Pathao, Paperfly, Sundarban, RedX
              </div>
              <div>
                <span className="text-purple-400 font-medium">Cloud:</span> AWS, CloudFlare, New Relic
              </div>
            </div>
          </div>
        </div>

        {/* System Statistics */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h3 className="text-sm font-bold text-red-400 flex items-center space-x-2 mb-3">
            <BarChart3 size={14} />
            <span>Real-time Platform Metrics</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
            <div className="text-center">
              <div className="text-blue-400 font-bold text-sm">12,456</div>
              <div className="text-gray-400">Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold text-sm">456,789</div>
              <div className="text-gray-400">Customers</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold text-sm">2,345,678</div>
              <div className="text-gray-400">Products</div>
            </div>
            <div className="text-center">
              <div className="text-orange-400 font-bold text-sm">8,234</div>
              <div className="text-gray-400">Orders Today</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold text-sm">15,67,890</div>
              <div className="text-gray-400">Revenue (BDT)</div>
            </div>
            <div className="text-center">
              <div className="text-cyan-400 font-bold text-sm">99.97%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <span>© 2025 GetIt Platform. All rights reserved.</span>
              <span className="hidden md:inline">|</span>
              <span className="flex items-center space-x-1">
                <Heart size={10} className="text-red-400" />
                <span>Built with passion for Bangladesh</span>
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-4">
              <div className="flex items-center space-x-4">
                <span>Last Updated: June 23, 2025 at 2:45 PM</span>
                <span className="hidden md:inline">|</span>
                <span>Session: Expires in 45 min</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>User: john.doe@getit.com.bd</span>
                <span className="hidden md:inline">|</span>
                <div className="flex items-center space-x-1">
                  <Monitor size={10} className="text-blue-400" />
                  <span>1920x1080</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
