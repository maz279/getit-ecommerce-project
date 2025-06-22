
import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

export const FeaturedBestSellers: React.FC = () => {
  const products = [
    {
      id: 1,
      name: 'Samsung Galaxy A54 5G',
      price: 35999,
      originalPrice: 39999,
      rating: 4.8,
      reviews: 2547,
      sold: '5K+',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Nike Air Max 270',
      price: 8999,
      originalPrice: 12999,
      rating: 4.7,
      reviews: 1823,
      sold: '3.2K+',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'iPhone 15 Pro',
      price: 125000,
      originalPrice: 135000,
      rating: 4.9,
      reviews: 4521,
      sold: '2.8K+',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop'
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5',
      price: 28999,
      originalPrice: 32999,
      rating: 4.6,
      reviews: 987,
      sold: '1.5K+',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop'
    }
  ];

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Featured Best Sellers</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-24 object-cover"
              />
              
              <div className="p-2">
                <h3 className="font-semibold text-gray-800 mb-1 text-sm line-clamp-2">{product.name}</h3>
                
                <div className="flex items-center gap-1 mb-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                  <span className="text-xs text-green-600 font-medium">{product.sold}</span>
                </div>
                
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-sm font-bold text-gray-800">৳{product.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 line-through">৳{product.originalPrice.toLocaleString()}</span>
                  <span className="text-xs text-green-600 font-medium">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                  </span>
                </div>
                
                <button className="w-full bg-blue-600 text-white py-1.5 px-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-xs">
                  <ShoppingCart className="w-3 h-3" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
