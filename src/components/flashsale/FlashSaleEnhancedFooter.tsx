
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Facebook, 
  Instagram,
  Youtube,
  Bot,
  User,
  PhoneCall,
  Megaphone,
  Heart,
  ShoppingCart,
  Eye,
  Play,
  FileText,
  Truck,
  CreditCard,
  RotateCcw
} from 'lucide-react';

export const FlashSaleEnhancedFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Live Chat Widget */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="w-6 h-6" />
            <h3 className="text-xl font-bold">NEED HELP? CHAT WITH US!</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
              <Bot className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
              <User className="w-4 h-4 mr-2" />
              Human Agent
            </Button>
            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
              <PhoneCall className="w-4 h-4 mr-2" />
              Call Back
            </Button>
            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </Button>
          </div>
          <p className="text-sm text-green-200 mb-3">Available in: বাংলা | English</p>
          <Button className="bg-white text-green-600 hover:bg-gray-100 font-bold">
            Start Chat →
          </Button>
        </div>

        {/* Special Announcements */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="w-6 h-6" />
            <h3 className="text-xl font-bold">IMPORTANT ANNOUNCEMENTS</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm">🎊 EID SPECIAL: Extra 10% OFF with code EID2025</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm">🌟 NEW VENDOR: 500+ new sellers joined this month</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm">🚚 DELIVERY UPDATE: Now delivering to 500+ upazilas</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm">💳 PAYMENT: New EMI options available</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm">📱 APP UPDATE: New features in latest version</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm">🔒 SECURITY: Enhanced fraud protection active</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-blue-300 mb-4">📞 CUSTOMER CARE</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-semibold">Hotline: 16263 (24/7)</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-sm">care@getit.com.bd</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm">WhatsApp: +8801XXXXXXXX</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <h5 className="text-sm font-bold text-yellow-300 mb-2">📍 HEAD OFFICE</h5>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm">House 123, Road 456</p>
                  <p className="text-sm">Dhanmondi, Dhaka-1205</p>
                  <p className="text-sm">Bangladesh</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h5 className="text-sm font-bold text-purple-300 mb-2">🕐 BUSINESS HOURS</h5>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm">Saturday-Thursday: 9 AM - 9 PM</p>
                  <p className="text-sm">Friday: 2 PM - 9 PM</p>
                  <p className="text-sm">Online: 24/7 available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-pink-300 mb-4">📱 FOLLOW US</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Facebook className="w-5 h-5 text-blue-400" />
                <p className="text-sm">@GetItBangladesh</p>
              </div>
              <div className="flex items-center space-x-3">
                <Instagram className="w-5 h-5 text-pink-400" />
                <p className="text-sm">@GetItBD</p>
              </div>
              <div className="flex items-center space-x-3">
                <Youtube className="w-5 h-5 text-red-400" />
                <p className="text-sm">GetIt Bangladesh</p>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.56a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.01z"/>
                </svg>
                <p className="text-sm">@GetItOfficial</p>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <p className="text-sm">GetIt Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-green-300 mb-4">📋 LEGAL</h4>
            <div className="space-y-2">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• Terms & Conditions</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• Privacy Policy</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• Return & Refund Policy</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• Shipping Policy</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• Vendor Terms</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• Cookie Policy</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• Complaint Handling</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• Dispute Resolution</a>
            </div>
          </div>

          {/* Quick Help */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-orange-300 mb-4">🆘 QUICK HELP</h4>
            <div className="space-y-2">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• How to Place Order</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• Payment Problems</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• Delivery Issues</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• Return Process</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• Account Problems</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• Technical Support</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• Vendor Support</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">• Bulk Orders</a>
            </div>
          </div>
        </div>

        {/* Seasonal Messages */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold mb-4 text-center">🌟 SEASONAL OFFERS</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs">🌙 Eid Special</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs">🎊 Pohela Boishakh</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs">🪔 Durga Puja</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs">🎄 Winter Collection</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs">🌧️ Monsoon Special</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-xs">🎓 Back to School</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2024 GetIt Bangladesh Limited. All Rights Reserved.
          </p>
          <p className="text-sm text-blue-300 mt-2">
            Developed with ❤️ in Bangladesh | Empowering Local Businesses
          </p>
        </div>
      </div>
    </footer>
  );
};
