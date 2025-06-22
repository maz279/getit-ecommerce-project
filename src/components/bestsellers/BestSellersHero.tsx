
import React from 'react';
import { TrendingUp, Award, Star } from 'lucide-react';

export const BestSellersHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <TrendingUp className="w-12 h-12" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          🏆 Best Sellers 🏆
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Discover the most popular products loved by millions of customers across Bangladesh
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <Award className="w-8 h-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Top Rated</h3>
            <p className="text-sm opacity-90">Products with highest customer ratings</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <Star className="w-8 h-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Most Sold</h3>
            <p className="text-sm opacity-90">Items with highest sales volume</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <TrendingUp className="w-8 h-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Trending Now</h3>
            <p className="text-sm opacity-90">Currently viral products</p>
          </div>
        </div>
      </div>
    </section>
  );
};
