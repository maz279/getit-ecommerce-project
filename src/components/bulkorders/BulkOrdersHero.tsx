
import React from 'react';
import { Package, Users, Calculator } from 'lucide-react';

export const BulkOrdersHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <Package className="w-12 h-12" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          📦 Bulk Orders 📦
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Get the best wholesale prices for bulk purchases. Perfect for businesses, resellers, and large orders.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <Package className="w-8 h-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Wholesale Prices</h3>
            <p className="text-sm opacity-90">Up to 50% off on bulk orders</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <Users className="w-8 h-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Business Support</h3>
            <p className="text-sm opacity-90">Dedicated account managers</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <Calculator className="w-8 h-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Custom Quotes</h3>
            <p className="text-sm opacity-90">Personalized pricing solutions</p>
          </div>
        </div>
      </div>
    </section>
  );
};
