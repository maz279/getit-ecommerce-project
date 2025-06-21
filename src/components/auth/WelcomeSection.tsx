
import React from 'react';
import { ShoppingCart, Users, Star, MapPin, Truck, Shield } from 'lucide-react';

export const WelcomeSection: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-8">
      <div className="max-w-md text-center space-y-8">
        {/* Main Welcome Message */}
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🛍️ Welcome Back!
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            আবার স্বাগতম!
          </h2>
          <p className="text-lg text-gray-600">
            Sign in to your GetIt account
          </p>
        </div>

        {/* Platform Benefits */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Discover thousands of products from trusted vendors across Bangladesh
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm">10,000+ Trusted Vendors</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm">1M+ Products Available</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-sm">All 64 Districts Covered</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm">Fast & Secure Delivery</span>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Data Protected</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Trusted by 500,000+ Users</span>
            </div>
            <p className="text-xs text-green-600 mt-1 text-center">
              Secured with 256-bit SSL encryption
            </p>
          </div>
        </div>

        {/* Bangladesh Flag Colors Accent */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600 ml-2">Made for Bangladesh</span>
        </div>
      </div>
    </div>
  );
};
