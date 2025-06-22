
import React from 'react';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';

export const ProductRankings: React.FC = () => {
  const rankings = [
    {
      rank: 1,
      name: 'iPhone 15 Pro Max',
      category: 'Electronics',
      price: 135000,
      originalPrice: 145000,
      sales: '15K+',
      rating: 4.9,
      badge: 'HOT',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop'
    },
    {
      rank: 2,
      name: 'Samsung Galaxy S24 Ultra',
      category: 'Electronics',
      price: 125000,
      originalPrice: 135000,
      sales: '12K+',
      rating: 4.8,
      badge: 'NEW',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
    },
    {
      rank: 3,
      name: 'Nike Air Jordan 1',
      category: 'Fashion',
      price: 15000,
      originalPrice: 18000,
      sales: '8K+',
      rating: 4.7,
      badge: 'TRENDING',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
    },
    {
      rank: 4,
      name: 'Sony WH-1000XM5',
      category: 'Electronics',
      price: 28999,
      originalPrice: 32999,
      sales: '6K+',
      rating: 4.6,
      badge: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
    },
    {
      rank: 5,
      name: 'MacBook Air M2',
      category: 'Electronics',
      price: 125000,
      originalPrice: 135000,
      sales: '4K+',
      rating: 4.8,
      badge: 'BEST',
      image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop'
    },
    {
      rank: 6,
      name: 'Adidas Ultraboost',
      category: 'Fashion',
      price: 12000,
      originalPrice: 15000,
      sales: '5K+',
      rating: 4.5,
      badge: 'SALE',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
    },
    {
      rank: 7,
      name: 'iPad Pro 11"',
      category: 'Electronics',
      price: 89999,
      originalPrice: 95000,
      sales: '3.5K+',
      rating: 4.8,
      badge: 'NEW',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop'
    },
    {
      rank: 8,
      name: 'Canon EOS R5',
      category: 'Electronics',
      price: 285000,
      originalPrice: 300000,
      sales: '2.1K+',
      rating: 4.9,
      badge: 'PREMIUM',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop'
    },
    {
      rank: 9,
      name: 'PlayStation 5',
      category: 'Gaming',
      price: 65000,
      originalPrice: 70000,
      sales: '4.2K+',
      rating: 4.7,
      badge: 'HOT',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop'
    },
    {
      rank: 10,
      name: 'Apple Watch Series 9',
      category: 'Electronics',
      price: 42000,
      originalPrice: 45000,
      sales: '3.8K+',
      rating: 4.6,
      badge: 'TRENDING',
      image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop'
    },
    {
      rank: 11,
      name: 'Puma RS-X',
      category: 'Fashion',
      price: 9500,
      originalPrice: 12000,
      sales: '2.8K+',
      rating: 4.4,
      badge: 'SALE',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop'
    },
    {
      rank: 12,
      name: 'Dell XPS 13',
      category: 'Electronics',
      price: 95000,
      originalPrice: 105000,
      sales: '1.9K+',
      rating: 4.5,
      badge: 'BEST',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop'
    }
  ];

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">🏆 Top Best Sellers This Week</h2>
          <p className="text-gray-600">Most purchased products by our customers</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {rankings.map((product) => (
            <div 
              key={product.rank} 
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
              
              {/* Rank Badge */}
              <div className="absolute top-3 left-3 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                  product.rank === 1 ? 'bg-yellow-500' :
                  product.rank === 2 ? 'bg-gray-400' : 
                  product.rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                }`}>
                  #{product.rank}
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                  product.badge === 'HOT' ? 'bg-red-500 text-white' :
                  product.badge === 'NEW' ? 'bg-green-500 text-white' : 
                  product.badge === 'TRENDING' ? 'bg-blue-500 text-white' :
                  product.badge === 'POPULAR' ? 'bg-purple-500 text-white' :
                  product.badge === 'BEST' ? 'bg-yellow-500 text-white' :
                  product.badge === 'PREMIUM' ? 'bg-indigo-500 text-white' :
                  'bg-orange-500 text-white'
                }`}>
                  {product.badge}
                </span>
              </div>

              {/* Rating */}
              <div className="absolute top-12 right-3 z-10">
                <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  {product.rating}
                </div>
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-10">
                <div className="mb-2">
                  <span className="text-xs opacity-75">{product.category}</span>
                  <h3 className="font-bold text-sm mb-1 line-clamp-2">{product.name}</h3>
                </div>
                
                <div className="mb-2">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs line-through opacity-75">৳{product.originalPrice.toLocaleString()}</span>
                    <span className="text-xs text-green-400">{product.sales}</span>
                  </div>
                  <div className="text-sm font-bold text-yellow-400">৳{product.price.toLocaleString()}</div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black py-1.5 rounded-lg text-xs font-bold hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 flex items-center justify-center gap-1 shadow-lg transform group-hover:scale-105">
                  <ShoppingCart className="w-3 h-3" />
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
