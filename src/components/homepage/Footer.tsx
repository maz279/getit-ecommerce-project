
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Shield, Truck, CreditCard } from 'lucide-react';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Company Information */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">G</span>
              </div>
              <h3 className="text-2xl font-bold">GETIT</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Southeast Asia's leading multi-vendor marketplace connecting millions of buyers with trusted sellers. 
              Discover endless possibilities with secure transactions, fast delivery, and world-class customer service.
            </p>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-semibold">Founded:</span> 2018</p>
              <p className="text-sm"><span className="font-semibold">Active Markets:</span> 12 Countries</p>
              <p className="text-sm"><span className="font-semibold">Registered Vendors:</span> 500K+</p>
              <p className="text-sm"><span className="font-semibold">Products Listed:</span> 50M+</p>
              <p className="text-sm"><span className="font-semibold">Daily Orders:</span> 2M+</p>
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-xs">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-1">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span className="text-xs">PCI Compliant</span>
              </div>
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4 text-orange-400" />
                <span className="text-xs">Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Customer Support & Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-blue-300 mb-4">Customer Service</h4>
            <div className="space-y-2">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Help Center</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Live Chat Support</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Order Tracking</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Return & Refunds</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Exchange Policy</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Warranty Claims</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Product Reviews</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Report an Issue</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Buyer Protection</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">FAQ</a>
            </div>
          </div>

          {/* Delivery & Logistics */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-blue-300 mb-4">Delivery & Logistics</h4>
            <div className="space-y-2">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Delivery Information</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Same Day Delivery</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Express Shipping</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">International Shipping</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Delivery Areas</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Shipping Calculator</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Delivery Issues</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Missing Package</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Damaged Items</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Schedule Delivery</a>
            </div>
          </div>

          {/* For Vendors/Sellers */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-blue-300 mb-4">For Vendors</h4>
            <div className="space-y-2">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Seller Center</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Start Selling</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Vendor Registration</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Seller University</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Marketing Tools</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Analytics Dashboard</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Commission Structure</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Payment Gateway</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Bulk Upload Tools</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Seller Support</a>
            </div>
          </div>

          {/* Company & Policies */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-blue-300 mb-4">Company & Legal</h4>
            <div className="space-y-2">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">About GETIT</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Our Story</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Leadership Team</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Careers</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Press & Media</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Investor Relations</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Terms of Service</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Cookie Policy</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Intellectual Property</a>
            </div>
          </div>
        </div>

        {/* Additional Information Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 pt-8 border-t border-gray-700">
          
          {/* Customer Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-green-300 mb-4">Shop by Category</h4>
            <div className="space-y-2">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Electronics & Gadgets</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Fashion & Beauty</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Home & Garden</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Sports & Outdoor</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Books & Media</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Automotive</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Health & Wellness</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Baby & Kids</a>
            </div>
          </div>

          {/* Special Programs */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-green-300 mb-4">Special Programs</h4>
            <div className="space-y-2">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">GETIT Prime</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Student Discount</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Senior Citizen Benefits</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Corporate Accounts</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Loyalty Program</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Affiliate Program</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Referral Rewards</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Bulk Purchase</a>
            </div>
          </div>

          {/* Payment & Security */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-green-300 mb-4">Payment & Security</h4>
            <div className="space-y-2">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Payment Methods</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Digital Wallets</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Installment Plans</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Gift Cards</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Security Center</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Fraud Protection</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Account Security</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Data Protection</a>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-green-300 mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">GETIT Headquarters</p>
                  <p className="text-sm">123 Commerce Street</p>
                  <p className="text-sm">Singapore 018956</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-semibold">Customer Service</p>
                  <p className="text-sm">+65 6123 4567</p>
                  <p className="text-xs text-gray-400">WhatsApp: +65 9876 5432</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-sm font-semibold">Email Support</p>
                  <p className="text-sm">support@getit.com</p>
                  <p className="text-xs text-gray-400">vendors@getit.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <p className="text-sm">24/7 Customer Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter & App Download */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-700">
          
          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-purple-300 mb-4">Stay Updated</h4>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <p className="text-sm text-gray-300">Subscribe to get exclusive deals, new product alerts, and insider updates</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-l-md text-sm focus:outline-none focus:border-blue-500"
                  required
                />
                <button 
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-r-md text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-400">By subscribing, you agree to our Privacy Policy and Terms of Service</p>
            </form>
          </div>

          {/* App Download */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-purple-300 mb-4">Download Our App</h4>
            <p className="text-sm text-gray-300">Shop on the go with exclusive app-only deals and faster checkout</p>
            <div className="flex space-x-3">
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on App Store"
                className="h-12 cursor-pointer hover:opacity-80 transition-opacity"
              />
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play"
                className="h-12 cursor-pointer hover:opacity-80 transition-opacity"
              />
            </div>
            
            {/* QR Code */}
            <div className="flex items-center space-x-3 mt-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-800 rounded grid grid-cols-3 gap-0.5 p-1">
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-gray-800 rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-gray-800 rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-gray-800 rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-gray-800 rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">Scan QR Code</p>
                <p className="text-xs text-gray-400">Download mobile app instantly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Payment Methods */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            
            {/* Social Media */}
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold">Follow Us:</span>
                <div className="flex space-x-3">
                  <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <span className="text-sm font-bold">f</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                    <span className="text-sm font-bold">IG</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                    <span className="text-sm font-bold">T</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-900 transition-colors">
                    <span className="text-sm font-bold">Li</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                    <span className="text-sm font-bold">YT</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                    <span className="text-sm font-bold">WA</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold">We Accept:</span>
                <div className="flex space-x-2">
                  <div className="w-10 h-7 bg-blue-600 rounded text-xs flex items-center justify-center font-bold">VISA</div>
                  <div className="w-10 h-7 bg-red-600 rounded text-xs flex items-center justify-center font-bold">MC</div>
                  <div className="w-10 h-7 bg-blue-500 rounded text-xs flex items-center justify-center font-bold">AMEX</div>
                  <div className="w-10 h-7 bg-indigo-600 rounded text-xs flex items-center justify-center font-bold">PP</div>
                  <div className="w-10 h-7 bg-green-600 rounded text-xs flex items-center justify-center font-bold">GPay</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400 mb-2">
            © 2025 GETIT Corporation. All Rights Reserved. | Trusted by millions across Southeast Asia and Latin America
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-blue-300 mb-3">
            <span>🇸🇬 Singapore</span>
            <span>•</span>
            <span>🇮🇩 Indonesia</span>
            <span>•</span>
            <span>🇹🇭 Thailand</span>
            <span>•</span>
            <span>🇲🇾 Malaysia</span>
            <span>•</span>
            <span>🇻🇳 Vietnam</span>
            <span>•</span>
            <span>🇵🇭 Philippines</span>
            <span>•</span>
            <span>🇧🇷 Brazil</span>
            <span>•</span>
            <span>🇲🇽 México</span>
            <span>•</span>
            <span>🇨🇴 Colombia</span>
          </div>
          <p className="text-xs text-gray-500">
            Business Registration: GETIT PTE LTD (UEN: 201812345G) | GST Reg: M2-0012345-6 | 
            Operating License: E-Commerce License #EC2018-SG-001
          </p>
        </div>
      </div>
    </footer>
  );
};
