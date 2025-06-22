
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
      badge: 'HOT',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Nike Air Max 270',
      price: 8999,
      originalPrice: 12999,
      rating: 4.7,
      reviews: 1823,
      sold: '3.2K+',
      badge: 'SALE',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'iPhone 15 Pro',
      price: 125000,
      originalPrice: 135000,
      rating: 4.9,
      reviews: 4521,
      sold: '2.8K+',
      badge: 'NEW',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5',
      price: 28999,
      originalPrice: 32999,
      rating: 4.6,
      reviews: 987,
      sold: '1.5K+',
      badge: 'TRENDING',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      name: 'MacBook Air M2',
      price: 115000,
      originalPrice: 125000,
      rating: 4.8,
      reviews: 3245,
      sold: '2.1K+',
      badge: 'BEST',
      image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop'
    },
    {
      id: 6,
      name: 'AirPods Pro',
      price: 19999,
      originalPrice: 24999,
      rating: 4.7,
      reviews: 1567,
      sold: '4.3K+',
      badge: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop'
    },
    {
      id: 7,
      name: 'Xbox Series X',
      price: 55000,
      originalPrice: 60000,
      rating: 4.6,
      reviews: 892,
      sold: '1.8K+',
      badge: 'GAMING',
      image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop'
    },
    {
      id: 8,
      name: 'Apple iPad Air',
      price: 65000,
      originalPrice: 70000,
      rating: 4.8,
      reviews: 2156,
      sold: '2.5K+',
      badge: 'NEW',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop'
    },
    {
      id: 9,
      name: 'Nintendo Switch',
      price: 32000,
      originalPrice: 35000,
      rating: 4.7,
      reviews: 1834,
      sold: '3.1K+',
      badge: 'FUN',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    },
    {
      id: 10,
      name: 'Beats Studio3',
      price: 22999,
      originalPrice: 26999,
      rating: 4.5,
      reviews: 743,
      sold: '1.9K+',
      badge: 'AUDIO',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop'
    },
    {
      id: 11,
      name: 'Surface Pro 9',
      price: 95000,
      originalPrice: 105000,
      rating: 4.6,
      reviews: 1456,
      sold: '1.3K+',
      badge: 'PREMIUM',
      image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=400&fit=crop'
    },
    {
      id: 12,
      name: 'Fossil Gen 6',
      price: 18500,
      originalPrice: 22000,
      rating: 4.4,
      reviews: 658,
      sold: '2.2K+',
      badge: 'SMART',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
    },
    {
      id: 13,
      name: 'Razer DeathAdder',
      price: 4500,
      originalPrice: 5500,
      rating: 4.7,
      reviews: 2341,
      sold: '5.8K+',
      badge: 'GAMING',
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop'
    },
    {
      id: 14,
      name: 'Canon EOS M50',
      price: 45000,
      originalPrice: 50000,
      rating: 4.8,
      reviews: 987,
      sold: '1.7K+',
      badge: 'PHOTO',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop'
    },
    {
      id: 15,
      name: 'Kindle Paperwhite',
      price: 12000,
      originalPrice: 14000,
      rating: 4.6,
      reviews: 1254,
      sold: '3.4K+',
      badge: 'READ',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    }
  ];

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Featured Best Sellers</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 aspect-square"
            >
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${product.image})`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                  product.badge === 'HOT' ? 'bg-red-500 text-white' :
                  product.badge === 'NEW' ? 'bg-green-500 text-white' : 
                  product.badge === 'TRENDING' ? 'bg-blue-500 text-white' :
                  product.badge === 'POPULAR' ? 'bg-purple-500 text-white' :
                  product.badge === 'BEST' ? 'bg-yellow-500 text-white' :
                  product.badge === 'SALE' ? 'bg-orange-500 text-white' :
                  product.badge === 'GAMING' ? 'bg-indigo-500 text-white' :
                  product.badge === 'PREMIUM' ? 'bg-gray-700 text-white' :
                  product.badge === 'SMART' ? 'bg-cyan-500 text-white' :
                  product.badge === 'AUDIO' ? 'bg-pink-500 text-white' :
                  product.badge === 'FUN' ? 'bg-lime-500 text-white' :
                  product.badge === 'PHOTO' ? 'bg-rose-500 text-white' :
                  product.badge === 'READ' ? 'bg-emerald-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {product.badge}
                </span>
              </div>

              {/* Rating */}
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  {product.rating}
                </div>
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-10">
                <h3 className="font-bold text-sm mb-2 line-clamp-2">{product.name}</h3>
                
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs line-through opacity-75">৳{product.originalPrice.toLocaleString()}</span>
                    <span className="text-xs text-green-400">({product.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-yellow-400">৳{product.price.toLocaleString()}</div>
                    <span className="text-xs text-green-400 font-medium">{product.sold}</span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black py-2 rounded-lg text-xs font-bold hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 flex items-center justify-center gap-1 shadow-lg transform group-hover:scale-105">
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
