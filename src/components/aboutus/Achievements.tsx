
import React from 'react';
import { Award, Users, TrendingUp, Shield } from 'lucide-react';

export const Achievements: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start space-x-4">
          <Award className="w-8 h-8 text-yellow-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Best E-commerce Platform 2023</h3>
            <p className="text-sm text-gray-600">Recognized by Bangladesh Digital Commerce Association</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <Users className="w-8 h-8 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">10 Million+ Happy Customers</h3>
            <p className="text-sm text-gray-600">Serving customers across Bangladesh since 2018</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <TrendingUp className="w-8 h-8 text-green-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">300% Growth in 2023</h3>
            <p className="text-sm text-gray-600">Fastest growing e-commerce platform in Bangladesh</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <Shield className="w-8 h-8 text-purple-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">99.9% Secure Transactions</h3>
            <p className="text-sm text-gray-600">Industry-leading security and fraud protection</p>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">GetIt - Where Bangladesh Shops, Sells, and Succeeds</h3>
        <p className="text-gray-600">Connecting vendors and customers, building trust, driving growth, and creating the future of ecommerce in Bangladesh.</p>
      </div>
    </div>
  );
};
