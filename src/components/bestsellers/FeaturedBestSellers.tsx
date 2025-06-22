
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
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Nike Air Max 270',
      price: 8999,
      originalPrice: 12999,
      rating: 4.7,
      reviews: 1823,
      sold: '3.2K+',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'iPhone 15 Pro',
      price: 125000,
      originalPrice: 135000,
      rating: 4.9,
      reviews: 4521,
      sold: '2.8K+',
      image: '/placeholder.svg'
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5',
      price: 28999,
      originalPrice: 32999,
      rating: 4.6,
      reviews: 987,
      sold: '1.5K+',
      image: '/placeholder.svg'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Best Sellers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                  <span className="text-sm text-green-600 font-medium">{product.sold} sold</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-gray-800">৳{product.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 line-through">৳{product.originalPrice.toLocaleString()}</span>
                  <span className="text-sm text-green-600 font-medium">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                  </span>
                </div>
                
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
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
