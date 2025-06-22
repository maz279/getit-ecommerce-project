
import React from 'react';
import { TrendingUp, Award, Star } from 'lucide-react';

export const BestSellersHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-3">
          🏆 Best Sellers 🏆
        </h1>
        
        <p className="text-lg md:text-xl mb-4 max-w-2xl mx-auto">
          Discover the most popular products loved by millions of customers across Bangladesh
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <Award className="w-6 h-6 mx-auto mb-2" />
            <h3 className="text-base font-semibold mb-1">Top Rated</h3>
            <p className="text-sm opacity-90">Products with highest customer ratings</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <Star className="w-6 h-6 mx-auto mb-2" />
            <h3 className="text-base font-semibold mb-1">Most Sold</h3>
            <p className="text-sm opacity-90">Items with highest sales volume</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <TrendingUp className="w-6 h-6 mx-auto mb-2" />
            <h3 className="text-base font-semibold mb-1">Trending Now</h3>
            <p className="text-sm opacity-90">Currently viral products</p>
          </div>
        </div>
      </div>
    </section>
  );
};
