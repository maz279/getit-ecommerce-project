
import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const FooterContact: React.FC = () => {
  return (
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
  );
};
