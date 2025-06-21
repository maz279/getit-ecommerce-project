
import React from 'react';
import { Truck, CreditCard, Headphones, RefreshCw, Award, Clock } from 'lucide-react';

export const RegistrationBenefits: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Why Choose GetIt?</h2>
        <p className="text-gray-600">Experience the best of online shopping</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <Truck className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-gray-700">Free Delivery</span>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Secure Payments</span>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
          <Headphones className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">24/7 Support</span>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
          <RefreshCw className="w-5 h-5 text-orange-600" />
          <span className="text-sm font-medium text-gray-700">Easy Returns</span>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
          <Award className="w-5 h-5 text-red-600" />
          <span className="text-sm font-medium text-gray-700">Quality Guarantee</span>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
          <Clock className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-medium text-gray-700">Quick Delivery</span>
        </div>
      </div>

      <div className="text-center pt-4 border-t">
        <p className="text-xs text-gray-500">
          Trusted by millions • Since 2020 • Made in Bangladesh
        </p>
      </div>
    </div>
  );
};
