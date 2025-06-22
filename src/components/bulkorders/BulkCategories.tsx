
import React from 'react';
import { Link } from 'react-router-dom';

export const BulkCategories: React.FC = () => {
  const categories = [
    { name: 'Electronics', icon: '📱', minOrder: '50+ units', discount: 'Up to 35%', color: 'from-blue-500 to-blue-600' },
    { name: 'Fashion', icon: '👕', minOrder: '100+ units', discount: 'Up to 45%', color: 'from-pink-500 to-pink-600' },
    { name: 'Office Supplies', icon: '🏢', minOrder: '200+ units', discount: 'Up to 40%', color: 'from-green-500 to-green-600' },
    { name: 'Home & Garden', icon: '🏠', minOrder: '75+ units', discount: 'Up to 30%', color: 'from-orange-500 to-orange-600' },
    { name: 'Food & Groceries', icon: '🍚', minOrder: '500+ units', discount: 'Up to 25%', color: 'from-yellow-500 to-yellow-600' },
    { name: 'Industrial', icon: '🏭', minOrder: '25+ units', discount: 'Up to 50%', color: 'from-gray-500 to-gray-600' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Bulk Order Categories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/categories?category=${category.name.toLowerCase()}&bulk=true`}
              className={`bg-gradient-to-r ${category.color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
              <p className="text-sm opacity-90 mb-2">Min Order: {category.minOrder}</p>
              <p className="text-sm font-medium">{category.discount} discount</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
