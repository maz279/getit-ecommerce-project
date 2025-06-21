
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { MessageCircle, Phone, Mail, Clock, Search, FileText, Headphones, Shield } from 'lucide-react';

const HelpCenter: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Help Center</h1>
          <p className="text-gray-600">How can we help you today?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600">Chat with our support team</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Start Chat
            </button>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Call Us</h3>
            <p className="text-sm text-gray-600">+880 1700 123456</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Call Now
            </button>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600">support@getit.com.bd</p>
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Send Email
            </button>
          </div>
          
          <div className="bg-orange-50 p-6 rounded-lg text-center">
            <Clock className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">24/7 Support</h3>
            <p className="text-sm text-gray-600">We're always here to help</p>
            <button className="mt-4 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
              Get Help
            </button>
          </div>
        </div>

        {/* Common Issues */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Common Issues</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">Order Issues</h3>
                <p className="text-gray-600 text-sm">Track orders, modify orders, cancel orders</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">Payment Problems</h3>
                <p className="text-gray-600 text-sm">Payment failed, refund status, billing issues</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">Account Help</h3>
                <p className="text-gray-600 text-sm">Login issues, account settings, password reset</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">Product Information</h3>
                <p className="text-gray-600 text-sm">Product details, specifications, compatibility</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Services</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                <Search className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Order Tracking</h3>
                  <p className="text-sm text-gray-600">Track your order status</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold">Return & Refunds</h3>
                  <p className="text-sm text-gray-600">Process returns and refunds</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                <Headphones className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Live Chat Support</h3>
                  <p className="text-sm text-gray-600">Chat with our team</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                <Shield className="w-6 h-6 text-orange-600" />
                <div>
                  <h3 className="font-semibold">Buyer Protection</h3>
                  <p className="text-sm text-gray-600">Your purchases are protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HelpCenter;
