
import React from 'react';
import { MapPin, CreditCard, Truck, MessageSquare } from 'lucide-react';

export const UniqueValue: React.FC = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">What Makes GetIt Unique</h2>
      
      <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <MapPin className="w-8 h-8 text-green-600 mr-3" />
          Built for Bangladesh, By Bangladesh
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Unlike international platforms that adapt to local markets, GetIt was conceived, designed, and built specifically for Bangladesh from the ground up. Every feature, every integration, and every user experience element reflects our deep understanding of Bangladeshi culture, preferences, and business practices.
        </p>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Comprehensive Local Integration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <CreditCard className="w-8 h-8 text-blue-600 mb-4" />
            <h4 className="font-semibold text-gray-800 mb-3">Payment Solutions Tailored for Bangladesh</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Complete integration with bKash, Nagad, and Rocket</li>
              <li>• Robust Cash on Delivery (COD) system</li>
              <li>• Support for all major payment gateways</li>
              <li>• Bangladesh Bank compliance</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <Truck className="w-8 h-8 text-green-600 mb-4" />
            <h4 className="font-semibold text-gray-800 mb-3">Nationwide Delivery Network</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Partnerships with Pathao, Paperfly, Sundarban</li>
              <li>• Same-day delivery in major cities</li>
              <li>• Nationwide coverage (all 64 districts)</li>
              <li>• Real-time tracking and updates</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <MessageSquare className="w-8 h-8 text-purple-600 mb-4" />
            <h4 className="font-semibold text-gray-800 mb-3">Communication in Your Language</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Full Bengali language support</li>
              <li>• SMS through SSL Wireless, Banglalink</li>
              <li>• Customer support in Bengali & English</li>
              <li>• Cultural calendar integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
