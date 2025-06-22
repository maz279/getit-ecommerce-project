
import React from 'react';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';

export const ProductRankings: React.FC = () => {
  const rankings = [
    {
      rank: 1,
      name: 'iPhone 15 Pro Max',
      category: 'Electronics',
      price: 135000,
      sales: '15K+',
      rating: 4.9,
      badge: 'HOT',
      image: '/placeholder.svg'
    },
    {
      rank: 2,
      name: 'Samsung Galaxy S24 Ultra',
      category: 'Electronics',
      price: 125000,
      sales: '12K+',
      rating: 4.8,
      badge: 'NEW',
      image: '/placeholder.svg'
    },
    {
      rank: 3,
      name: 'Nike Air Jordan 1',
      category: 'Fashion',
      price: 15000,
      sales: '8K+',
      rating: 4.7,
      badge: 'TRENDING',
      image: '/placeholder.svg'
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">🏆 Top 3 Best Sellers This Week</h2>
          <p className="text-gray-600">Most purchased products by our customers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rankings.map((product) => (
            <div key={product.rank} className="relative bg-white rounded-xl shadow-lg overflow-hidden border hover:shadow-xl transition-shadow">
              <div className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                product.rank === 1 ? 'bg-yellow-500' :
                product.rank === 2 ? 'bg-gray-400' : 'bg-orange-500'
              }`}>
                #{product.rank}
              </div>
              
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                  product.badge === 'HOT' ? 'bg-red-500 text-white' :
                  product.badge === 'NEW' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {product.badge}
                </span>
              </div>
              
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              
              <div className="p-4">
                <span className="text-sm text-gray-500 mb-1 block">{product.category}</span>
                <h3 className="font-bold text-base mb-2">{product.name}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-green-600 font-medium">{product.sales} sold</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">৳{product.price.toLocaleString()}</span>
                  <div className="flex gap-2">
                    <button className="p-2 border rounded-lg hover:bg-gray-50">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
