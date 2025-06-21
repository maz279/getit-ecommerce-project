
import React from 'react';
import { Store, Users, TrendingUp, DollarSign, ArrowRight, CheckCircle } from 'lucide-react';

export const VendorCTA: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-purple-600 via-blue-600 to-green-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="flex items-center gap-3 mb-4">
              <Store className="w-8 h-8 text-yellow-300" />
              <span className="text-yellow-300 font-semibold text-lg">Become a Seller</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Start Your Business with GETIT
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of successful sellers in Bangladesh's fastest-growing marketplace
            </p>
            
            {/* Benefits */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Reach millions of customers across Bangladesh</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Easy setup - Start selling in 24 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Secure payment processing & timely payouts</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Free marketing tools & analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Dedicated seller support team</span>
              </div>
            </div>

            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-8 py-4 rounded-full hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105 flex items-center gap-3 text-lg shadow-lg">
              Start Selling Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center border border-white border-opacity-20">
              <Users className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-white opacity-90">Active Sellers</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center border border-white border-opacity-20">
              <TrendingUp className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">2M+</div>
              <div className="text-white opacity-90">Products Listed</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center border border-white border-opacity-20">
              <DollarSign className="w-12 h-12 text-blue-300 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">৳10Cr+</div>
              <div className="text-white opacity-90">Monthly Sales</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center border border-white border-opacity-20">
              <Store className="w-12 h-12 text-purple-300 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-white opacity-90">Seller Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
