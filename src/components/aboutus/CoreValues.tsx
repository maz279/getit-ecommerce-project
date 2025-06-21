
import React from 'react';
import { Shield, Zap, Heart, TrendingUp } from 'lucide-react';

export const CoreValues: React.FC = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Core Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center p-6 bg-blue-50 rounded-lg">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Trust</h3>
          <p className="text-sm text-gray-600">Building lasting relationships through transparency and reliability</p>
        </div>
        
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Innovation</h3>
          <p className="text-sm text-gray-600">Continuously improving through technology and creative solutions</p>
        </div>
        
        <div className="text-center p-6 bg-purple-50 rounded-lg">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Customer First</h3>
          <p className="text-sm text-gray-600">Putting our customers' needs at the center of everything we do</p>
        </div>
        
        <div className="text-center p-6 bg-orange-50 rounded-lg">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Growth</h3>
          <p className="text-sm text-gray-600">Empowering businesses and individuals to reach their full potential</p>
        </div>
      </div>
    </div>
  );
};
