
import React, { useState, useEffect } from 'react';
import { Clock, Flame, ShoppingCart, Star } from 'lucide-react';

export const DealsCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const deals = [
    { 
      name: 'MacBook Air M2', 
      originalPrice: 125000, 
      salePrice: 89999, 
      discount: 28,
      rating: 4.8,
      reviews: 1250,
      image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop'
    },
    { 
      name: 'Sony WH-1000XM5', 
      originalPrice: 35000, 
      salePrice: 24999, 
      discount: 29,
      rating: 4.7,
      reviews: 890,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
    },
    { 
      name: 'iPad Pro 11"', 
      originalPrice: 95000, 
      salePrice: 69999, 
      discount: 26,
      rating: 4.9,
      reviews: 2100,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop'
    },
    { 
      name: 'AirPods Pro', 
      originalPrice: 28000, 
      salePrice: 19999, 
      discount: 29,
      rating: 4.6,
      reviews: 760,
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop'
    },
    { 
      name: 'iPhone 15 Pro', 
      originalPrice: 135000, 
      salePrice: 125000, 
      discount: 7,
      rating: 4.9,
      reviews: 3200,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop'
    }
  ];

  return (
    <section className="py-6 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Flame className="w-6 h-6 text-yellow-300 animate-pulse" />
            <h2 className="text-2xl md:text-3xl font-bold">⚡ Best Seller Offer ⚡</h2>
            <Flame className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 inline-block shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5" />
              <span className="text-lg font-semibold">Time Remaining:</span>
            </div>
            <div className="flex gap-3">
              <div className="text-center">
                <div className="bg-white text-black rounded-lg p-3 min-w-[50px] shadow-lg">
                  <div className="text-xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                </div>
                <div className="text-sm mt-2 font-medium">Hours</div>
              </div>
              <div className="text-center">
                <div className="bg-white text-black rounded-lg p-3 min-w-[50px] shadow-lg">
                  <div className="text-xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                </div>
                <div className="text-sm mt-2 font-medium">Minutes</div>
              </div>
              <div className="text-center">
                <div className="bg-white text-black rounded-lg p-3 min-w-[50px] shadow-lg">
                  <div className="text-xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                </div>
                <div className="text-sm mt-2 font-medium">Seconds</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {deals.map((deal, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 aspect-square"
            >
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${deal.image})`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Discount Badge */}
              <div className="absolute top-3 left-3 z-10">
                <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  {deal.discount}% OFF
                </div>
              </div>

              {/* Rating */}
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  {deal.rating}
                </div>
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                <h3 className="font-bold text-sm mb-2 line-clamp-2">{deal.name}</h3>
                
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs line-through opacity-75">৳{deal.originalPrice.toLocaleString()}</span>
                    <span className="text-xs text-gray-300">({deal.reviews} reviews)</span>
                  </div>
                  <div className="text-lg font-bold text-yellow-400">৳{deal.salePrice.toLocaleString()}</div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black py-2 rounded-lg text-sm font-bold hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform group-hover:scale-105">
                  <ShoppingCart className="w-4 h-4" />
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
