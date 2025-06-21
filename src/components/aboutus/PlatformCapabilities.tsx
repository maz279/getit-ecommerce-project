
import React from 'react';
import { ShoppingBag, Users } from 'lucide-react';

export const PlatformCapabilities: React.FC = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Platform Capabilities & Scale</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-blue-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <ShoppingBag className="w-8 h-8 text-blue-600 mr-3" />
            For Vendors: Your Gateway to Success
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Simplified Onboarding:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Streamlined registration with Bangladesh KYC verification</li>
                <li>• Trade License, TIN, and NID verification support</li>
                <li>• Comprehensive vendor training programs</li>
                <li>• Dedicated vendor success managers</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Powerful Management Tools:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Intuitive vendor dashboard for business oversight</li>
                <li>• Bulk product upload capabilities</li>
                <li>• Real-time inventory tracking and alerts</li>
                <li>• Advanced analytics for performance insights</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Growth Support:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Marketing tools and promotional campaigns</li>
                <li>• Performance-based vendor recognition</li>
                <li>• Access to GetIt's marketing channels</li>
                <li>• Digital marketing training programs</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Users className="w-8 h-8 text-green-600 mr-3" />
            For Customers: Exceptional Shopping Experience
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Discovery Made Easy:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Advanced search with Bengali phonetic support</li>
                <li>• AI-powered product recommendations</li>
                <li>• Visual search capabilities</li>
                <li>• Category-based browsing for local preferences</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Trust & Security:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Comprehensive vendor verification systems</li>
                <li>• Secure payment processing with PCI DSS compliance</li>
                <li>• Buyer protection and dispute resolution</li>
                <li>• Transparent reviews from verified purchasers</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Convenience at Every Step:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mobile-first design for Bangladesh's market</li>
                <li>• One-click checkout and saved preferences</li>
                <li>• Real-time order tracking with notifications</li>
                <li>• Flexible delivery options and pickup points</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
