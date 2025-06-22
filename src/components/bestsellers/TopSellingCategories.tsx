
import React from 'react';
import { Link } from 'react-router-dom';

export const TopSellingCategories: React.FC = () => {
  const categories = [
    { name: 'Electronics', icon: '📱', count: '2.5K+ sold', color: 'from-blue-500 to-blue-600' },
    { name: 'Fashion', icon: '👕', count: '5K+ sold', color: 'from-pink-500 to-pink-600' },
    { name: 'Home & Garden', icon: '🏠', count: '3K+ sold', color: 'from-green-500 to-green-600' },
    { name: 'Beauty', icon: '💄', count: '4K+ sold', color: 'from-purple-500 to-purple-600' },
    { name: 'Sports', icon: '⚽', count: '1.8K+ sold', color: 'from-orange-500 to-orange-600' },
    { name: 'Books', icon: '📚', count: '2.2K+ sold', color: 'from-indigo-500 to-indigo-600' }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Top Selling Categories</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/categories?category=${category.name.toLowerCase()}&sort=best-selling`}
              className={`bg-gradient-to-r ${category.color} rounded-lg p-6 text-white text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className="font-semibold mb-2">{category.name}</h3>
              <p className="text-sm opacity-90">{category.count}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
