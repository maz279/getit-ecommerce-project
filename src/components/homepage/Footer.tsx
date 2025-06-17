
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">G</span>
              </div>
              <h3 className="text-2xl font-bold">GETIT</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your premier destination for online shopping. Discover millions of products with unbeatable prices, 
              fast delivery, and exceptional customer service.
            </p>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-semibold">Est:</span> 2018</p>
              <p className="text-sm"><span className="font-semibold">Stores:</span> 50+ Countries</p>
              <p className="text-sm"><span className="font-semibold">Products:</span> 10M+ Items</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-blue-300 mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm">123 Commerce Street</p>
                  <p className="text-sm">Singapore 018956</p>
                  <p className="text-sm">Southeast Asia</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm">+65 6123 4567</p>
                  <p className="text-xs text-gray-400">WhatsApp: +65 9876 5432</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-sm">support@getit.com</p>
                  <p className="text-xs text-gray-400">business@getit.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <p className="text-sm">24/7 Customer Support</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-blue-300 mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">About Us</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Careers</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Help Center</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Returns</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Shipping Info</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Track Order</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Bulk Orders</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Seller Center</a>
            </div>
          </div>

          {/* Newsletter & App Download */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-blue-300 mb-4">Stay Connected</h4>
            
            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="space-y-2">
              <p className="text-sm text-gray-300">Get exclusive deals & updates</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-l-md text-sm focus:outline-none focus:border-blue-500"
                  required
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-r-md text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Subscribe
                </button>
              </div>
            </form>

            {/* App Download */}
            <div className="space-y-3">
              <p className="text-sm font-semibold">Download Our App</p>
              <div className="flex space-x-2">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on App Store"
                  className="h-10 cursor-pointer hover:opacity-80 transition-opacity"
                />
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  className="h-10 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            </div>

            {/* QR Code */}
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-800 rounded"></div>
              </div>
              <p className="text-xs text-gray-400">Scan to download mobile app</p>
            </div>
          </div>
        </div>

        {/* Social Media & Payment Methods */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold">Follow Us:</span>
              <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <span className="text-xs font-bold">f</span>
                </a>
                <a href="#" className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                  <span className="text-xs font-bold">IG</span>
                </a>
                <a href="#" className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <span className="text-xs font-bold">T</span>
                </a>
                <a href="#" className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-900 transition-colors">
                  <span className="text-xs font-bold">Li</span>
                </a>
                <a href="#" className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                  <span className="text-xs font-bold">YT</span>
                </a>
                <a href="#" className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <span className="text-xs font-bold">WA</span>
                </a>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold">We Accept:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-6 bg-blue-600 rounded text-xs flex items-center justify-center">VISA</div>
                <div className="w-8 h-6 bg-red-600 rounded text-xs flex items-center justify-center">MC</div>
                <div className="w-8 h-6 bg-blue-500 rounded text-xs flex items-center justify-center">AMEX</div>
                <div className="w-8 h-6 bg-indigo-600 rounded text-xs flex items-center justify-center">PP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2025 GETIT Corporation. All Rights Reserved. | 
            <span className="text-blue-300"> Singapore</span> | 
            <span className="text-blue-300"> Indonesia</span> | 
            <span className="text-blue-300"> Thailand</span> | 
            <span className="text-blue-300"> Malaysia</span> | 
            <span className="text-blue-300"> Vietnam</span> | 
            <span className="text-blue-300"> Philippines</span> | 
            <span className="text-blue-300"> Brazil</span> | 
            <span className="text-blue-300"> México</span> | 
            <span className="text-blue-300"> Colombia</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Business Registration: GETIT PTE LTD (UEN: 201812345G) | GST Reg: M2-0012345-6
          </p>
        </div>
      </div>
    </footer>
  );
};
