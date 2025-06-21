
import React from 'react';
import { Users, Store, Shield, Star, CheckCircle, Gift } from 'lucide-react';

export const RegisterWelcomeSection: React.FC = () => {
  return (
    <div className="hidden lg:block space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-3xl">G</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to GetIt
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Join millions of users in Bangladesh's largest marketplace
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">10M+ Happy Customers</h3>
            <p className="text-gray-600 text-sm">Join our growing community of satisfied shoppers</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Store className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">50K+ Trusted Vendors</h3>
            <p className="text-gray-600 text-sm">Shop from verified sellers across Bangladesh</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Secure & Safe</h3>
            <p className="text-gray-600 text-sm">Your data and transactions are fully protected</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Gift className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Special Offers</h3>
            <p className="text-gray-600 text-sm">Get exclusive deals and discounts as a member</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-gray-600 text-sm">
          "Best shopping experience in Bangladesh!"
        </p>
        <p className="text-gray-500 text-xs mt-1">
          - Over 1 million customer reviews
        </p>
      </div>
    </div>
  );
};
