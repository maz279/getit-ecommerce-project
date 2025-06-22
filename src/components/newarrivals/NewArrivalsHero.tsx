
import React from 'react';
import { Sparkles, Clock, Package } from 'lucide-react';

export const NewArrivalsHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <Sparkles className="w-12 h-12" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          ✨ New Arrivals ✨
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Be the first to discover the latest products from top brands and emerging vendors
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <Clock className="w-8 h-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Fresh Daily</h3>
            <p className="text-sm opacity-90">New products added every day</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <Package className="w-8 h-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Latest Trends</h3>
            <p className="text-sm opacity-90">Stay ahead with trending items</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <Sparkles className="w-8 h-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Exclusive Launches</h3>
            <p className="text-sm opacity-90">First access to new releases</p>
          </div>
        </div>
      </div>
    </section>
  );
};
