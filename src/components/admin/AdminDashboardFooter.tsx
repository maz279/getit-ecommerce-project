
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
  Smartphone,
  Accessibility,
  ShieldCheck,
  BookOpen,
  VideoIcon,
  Wrench,
  CheckCircle,
  Building,
  Code,
  Layers,
  Activity,
  Gauge,
  UserCheck,
  Play,
  GitBranch,
  Construction,
  AlertCircle,
  PhoneCall,
  Tv,
  KeyboardIcon,
  VolumeX,
  Type,
  Archive,
  RefreshCw,
  Hash,
  Timer,
  Building2,
  ChromeIcon,
  Maximize
} from 'lucide-react';

export const AdminDashboardFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-blue-800 via-blue-900 to-teal-900 text-white mt-12">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          
          {/* Company Information */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">G</span>
              </div>
              <h3 className="text-xs font-bold text-emerald-300">GetIt Platform</h3>
            </div>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-start space-x-1">
                <MapPin className="text-emerald-300 mt-0.5" size={10} />
                <span>Shahir Smart Tower 205/1 & 205/1/A, West Kafrul, Taltola, Dhaka-1207</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="text-sky-300" size={10} />
                <span>+880-2-9876543</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="text-violet-300" size={10} />
                <span>admin@getit.com.bd</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="text-amber-300" size={10} />
                <span>Sunday-Thursday, 9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex items-center space-x-1">
                <AlertTriangle className="text-red-300" size={10} />
                <span>Emergency: +880-1700-123456</span>
              </div>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-yellow-300 flex items-center space-x-1">
              <ShieldCheck size={12} />
              <span>Legal & Compliance</span>
            </h3>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <Shield size={8} className="text-blue-300" />
                <span>Terms of Service</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <Lock size={8} className="text-green-300" />
                <span>Privacy Policy</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <Users size={8} className="text-purple-300" />
                <span>Admin User Agreement</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <Eye size={8} className="text-orange-300" />
                <span>Data Protection Policy</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <FileText size={8} className="text-rose-300" />
                <span>Cookie Policy</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <Book size={8} className="text-cyan-300" />
                <span>Compliance Documentation</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <FileQuestion size={8} className="text-indigo-300" />
                <span>Regulatory Information</span>
              </a>
            </div>
          </div>

          {/* Documentation & Resources */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-cyan-300 flex items-center space-x-1">
              <BookOpen size={12} />
              <span>Documentation & Resources</span>
            </h3>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <Book size={8} className="text-blue-300" />
                <span>Admin User Manual</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <Code size={8} className="text-green-300" />
                <span>API Documentation</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <VideoIcon size={8} className="text-red-300" />
                <span>Video Tutorials</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <CheckCircle size={8} className="text-emerald-300" />
                <span>Best Practices Guide</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <Wrench size={8} className="text-orange-300" />
                <span>Troubleshooting Guide</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <Settings size={8} className="text-purple-300" />
                <span>System Requirements</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <GitBranch size={8} className="text-yellow-300" />
                <span>Release Notes</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <Activity size={8} className="text-pink-300" />
                <span>Change Log</span>
              </a>
            </div>
          </div>

          {/* Technical Information */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-purple-300 flex items-center space-x-1">
              <Server size={12} />
              <span>Technical Information</span>
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Settings size={8} className="text-blue-300" />
                  <span>Platform Version:</span>
                </span>
                <span className="text-green-300 font-medium">2.0.1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Hash size={8} className="text-cyan-300" />
                  <span>Build Number:</span>
                </span>
                <span className="text-green-300 font-medium">20250623.001</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Database size={8} className="text-purple-300" />
                  <span>Database:</span>
                </span>
                <span className="text-green-300 font-medium">PostgreSQL 14.2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Cloud size={8} className="text-orange-300" />
                  <span>Environment:</span>
                </span>
                <span className="text-green-300 font-medium">Production</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <RefreshCw size={8} className="text-emerald-300" />
                  <span>Last Update:</span>
                </span>
                <span className="text-yellow-300 font-medium">June 20, 2025</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Calendar size={8} className="text-red-300" />
                  <span>Next Maintenance:</span>
                </span>
                <span className="text-yellow-300 font-medium">June 30, 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - More Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-600">
          
          {/* Quick Support Links */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-green-300 flex items-center space-x-1">
              <Headphones size={12} />
              <span>Quick Support Links</span>
            </h3>
            <div className="space-y-1 text-xs">
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <FileText size={8} className="text-blue-300" />
                <span>Submit Support Ticket</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <MessageCircle size={8} className="text-green-300" />
                <span>Live Chat Support</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <PhoneCall size={8} className="text-purple-300" />
                <span>Call Support Hotline</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <AlertTriangle size={8} className="text-red-300" />
                <span>Emergency Technical Support</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <ShieldCheck size={8} className="text-orange-300" />
                <span>Report Security Issue</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <Zap size={8} className="text-yellow-300" />
                <span>Feature Request</span>
              </a>
            </div>
          </div>

          {/* Social Media & Communication */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-pink-300 flex items-center space-x-1">
              <Globe size={12} />
              <span>Social Media & Communication</span>
            </h3>
            <div className="space-y-1 text-xs">
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <Facebook size={8} className="text-blue-400" />
                <span>@GetItBangladesh</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <Linkedin size={8} className="text-blue-300" />
                <span>GetIt Bangladesh</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <Twitter size={8} className="text-sky-300" />
                <span>@GetItBD</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <Youtube size={8} className="text-red-400" />
                <span>GetIt Platform</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors flex items-center space-x-1">
                <MessageCircle size={8} className="text-green-400" />
                <span>WhatsApp: +880-1700-654321</span>
              </a>
            </div>
          </div>

          {/* Emergency & Maintenance */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-red-300 flex items-center space-x-1">
              <AlertCircle size={12} />
              <span>Emergency & Maintenance</span>
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center space-x-1">
                <Phone size={8} className="text-red-300" />
                <span>Emergency: +880-1700-999888</span>
              </div>
              <div className="flex items-center space-x-1">
                <PhoneCall size={8} className="text-orange-300" />
                <span>24/7 Hotline: +880-1700-247365</span>
              </div>
              <div className="flex items-center space-x-1">
                <Construction size={8} className="text-yellow-300" />
                <span>Maintenance: Sat 2:00-4:00 AM</span>
              </div>
              <div className="flex items-center space-x-1">
                <Activity size={8} className="text-green-300" />
                <span>Status: status.getit.com.bd</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail size={8} className="text-blue-300" />
                <span>Incidents: incidents@getit.com.bd</span>
              </div>
            </div>
          </div>

          {/* Accessibility & Compliance */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-indigo-300 flex items-center space-x-1">
              <Accessibility size={12} />
              <span>Accessibility</span>
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center space-x-1">
                <UserCheck size={8} className="text-green-300" />
                <span>WCAG 2.1 AA Compliant</span>
              </div>
              <div className="flex items-center space-x-1">
                <VolumeX size={8} className="text-blue-300" />
                <span>Screen Reader Compatible</span>
              </div>
              <div className="flex items-center space-x-1">
                <KeyboardIcon size={8} className="text-purple-300" />
                <span>Keyboard Navigation</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye size={8} className="text-orange-300" />
                <span>High Contrast Mode</span>
              </div>
              <div className="flex items-center space-x-1">
                <Type size={8} className="text-yellow-300" />
                <span>Font Size Adjustment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Third Row - Data, Environment, Additional Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-600">
          
          {/* Data & Analytics */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-emerald-300 flex items-center space-x-1">
              <Database size={12} />
              <span>Data & Analytics</span>
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center space-x-1">
                <Archive size={8} className="text-blue-300" />
                <span>Data Retention: 7 years</span>
              </div>
              <div className="flex items-center space-x-1">
                <RefreshCw size={8} className="text-green-300" />
                <span>Backup: Every 6 hours</span>
              </div>
              <div className="flex items-center space-x-1">
                <Building2 size={8} className="text-purple-300" />
                <span>Data Center: Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock size={8} className="text-orange-300" />
                <span>Encryption: AES-256</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText size={8} className="text-yellow-300" />
                <span>Audit Logs: 10 years</span>
              </div>
            </div>
          </div>

          {/* Environment Information */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-teal-300 flex items-center space-x-1">
              <Cloud size={12} />
              <span>Environment Information</span>
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center space-x-1">
                <Server size={8} className="text-green-300" />
                <span>Environment: Production</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe size={8} className="text-blue-300" />
                <span>Region: Bangladesh (Asia/Dhaka)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Gauge size={8} className="text-purple-300" />
                <span>Load Balancer: Active</span>
              </div>
              <div className="flex items-center space-x-1">
                <Wifi size={8} className="text-orange-300" />
                <span>CDN: Operational</span>
              </div>
              <div className="flex items-center space-x-1">
                <Database size={8} className="text-yellow-300" />
                <span>DB: Primary + 2 Replicas</span>
              </div>
              <div className="flex items-center space-x-1">
                <HardDrive size={8} className="text-red-300" />
                <span>Cache: Redis Cluster Active</span>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-violet-300 flex items-center space-x-1">
              <BookOpen size={12} />
              <span>Additional Resources</span>
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center space-x-1">
                <Globe size={8} className="text-green-300" />
                <span>Bangladesh E-commerce Guidelines</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users size={8} className="text-blue-300" />
                <span>Multi-vendor Best Practices</span>
              </div>
              <div className="flex items-center space-x-1">
                <CreditCard size={8} className="text-purple-300" />
                <span>Payment Gateway Guide</span>
              </div>
              <div className="flex items-center space-x-1">
                <UserCheck size={8} className="text-orange-300" />
                <span>Vendor Onboarding Checklist</span>
              </div>
              <div className="flex items-center space-x-1">
                <Headphones size={8} className="text-yellow-300" />
                <span>Customer Service Standards</span>
              </div>
              <div className="flex items-center space-x-1">
                <ShieldCheck size={8} className="text-red-300" />
                <span>Security Best Practices</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications & Partners Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-600">
          
          {/* Certifications */}
          <div>
            <h3 className="text-xs font-bold text-purple-300 flex items-center space-x-1 mb-2">
              <Award size={12} />
              <span>Compliance & Certifications</span>
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <Shield size={8} className="text-green-300" />
                <span className="text-gray-300">PCI DSS</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award size={8} className="text-blue-300" />
                <span className="text-gray-300">ISO 27001</span>
              </div>
              <div className="flex items-center space-x-1">
                <CreditCard size={8} className="text-yellow-300" />
                <span className="text-gray-300">BB Approved</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock size={8} className="text-green-300" />
                <span className="text-gray-300">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe size={8} className="text-blue-300" />
                <span className="text-gray-300">GDPR</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap size={8} className="text-purple-300" />
                <span className="text-gray-300">SOC 2 Type II</span>
              </div>
            </div>
          </div>

          {/* Technology Partners */}
          <div>
            <h3 className="text-xs font-bold text-orange-300 flex items-center space-x-1 mb-2">
              <Truck size={12} />
              <span>Technology Partners</span>
            </h3>
            <div className="space-y-1 text-xs text-gray-300">
              <div>
                <span className="text-blue-300 font-medium">Payment:</span> bKash, Nagad, Rocket, SSL Commerz
              </div>
              <div>
                <span className="text-green-300 font-medium">Shipping:</span> Pathao, Paperfly, Sundarban, RedX, eCourier
              </div>
              <div>
                <span className="text-purple-300 font-medium">Cloud:</span> AWS, CloudFlare, New Relic
              </div>
            </div>
          </div>
        </div>

        {/* System Statistics */}
        <div className="mt-4 pt-4 border-t border-gray-600">
          <h3 className="text-xs font-bold text-red-300 flex items-center space-x-1 mb-2">
            <BarChart3 size={12} />
            <span>Real-time Platform Metrics</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="text-center">
              <div className="text-blue-300 font-bold text-xs">12,456</div>
              <div className="text-gray-400">Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-green-300 font-bold text-xs">456,789</div>
              <div className="text-gray-400">Customers</div>
            </div>
            <div className="text-center">
              <div className="text-purple-300 font-bold text-xs">2,345,678</div>
              <div className="text-gray-400">Products</div>
            </div>
            <div className="text-center">
              <div className="text-orange-300 font-bold text-xs">8,234</div>
              <div className="text-gray-400">Orders Today</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-300 font-bold text-xs">15,67,890</div>
              <div className="text-gray-400">Revenue (BDT)</div>
            </div>
            <div className="text-center">
              <div className="text-cyan-300 font-bold text-xs">99.97%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>

        {/* Copyright & Attribution */}
        <div className="mt-4 pt-4 border-t border-gray-600">
          <h3 className="text-xs font-bold text-amber-300 flex items-center space-x-1 mb-2">
            <Building size={12} />
            <span>Copyright & Attribution</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-gray-300">
            <div className="flex items-center space-x-1">
              <Heart size={8} className="text-red-300" />
              <span>© 2025 GetIt Platform</span>
            </div>
            <div className="flex items-center space-x-1">
              <Code size={8} className="text-blue-300" />
              <span>GetIt Technology Team</span>
            </div>
            <div className="flex items-center space-x-1">
              <Layers size={8} className="text-purple-300" />
              <span>Microservices Architecture</span>
            </div>
            <div className="flex items-center space-x-1">
              <Cloud size={8} className="text-green-300" />
              <span>Hosted on AWS Infrastructure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-teal-900 to-blue-900 border-t border-gray-600">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-1 lg:space-y-0 text-xs text-gray-400">
            <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-3">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <RefreshCw size={8} className="text-green-300" />
                  <span>Last Updated: June 23, 2025 at 2:45 PM</span>
                </span>
                <span className="hidden md:inline">|</span>
                <span className="flex items-center space-x-1">
                  <Timer size={8} className="text-yellow-300" />
                  <span>Session: Expires in 45 min</span>
                </span>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center space-y-1 lg:space-y-0 lg:space-x-3">
              <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-3">
                <span className="flex items-center space-x-1">
                  <Users size={8} className="text-blue-300" />
                  <span>User: john.doe@getit.com.bd</span>
                </span>
                <span className="hidden md:inline">|</span>
                <span className="flex items-center space-x-1">
                  <Globe size={8} className="text-purple-300" />
                  <span>IP: 103.xxx.xxx.xxx (Dhaka)</span>
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-3">
                <span className="flex items-center space-x-1">
                  <ChromeIcon size={8} className="text-orange-300" />
                  <span>Chrome 124.0.6367.91</span>
                </span>
                <span className="hidden md:inline">|</span>
                <div className="flex items-center space-x-1">
                  <Monitor size={8} className="text-cyan-300" />
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
