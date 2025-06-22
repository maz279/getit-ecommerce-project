
import React from 'react';
import { TrendingUp, Eye, ShoppingCart, Heart } from 'lucide-react';

export const TrendingAnalytics: React.FC = () => {
  const stats = [
    { icon: <Eye className="w-6 h-6" />, label: 'Daily Views', value: '2.5M+', color: 'text-blue-600' },
    { icon: <ShoppingCart className="w-6 h-6" />, label: 'Orders Today', value: '15K+', color: 'text-green-600' },
    { icon: <Heart className="w-6 h-6" />, label: 'Wishlist Adds', value: '8.2K+', color: 'text-red-600' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'Growth Rate', value: '+25%', color: 'text-purple-600' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Trending Analytics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 ${stat.color}`}>
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Join the Best Sellers</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Want to see your products here? Start selling on our platform and reach millions of customers across Bangladesh.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
            Become a Seller
          </button>
        </div>
      </div>
    </section>
  );
};
