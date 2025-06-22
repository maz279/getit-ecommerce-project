
import React, { useState, useEffect } from 'react';
import { Clock, Flame } from 'lucide-react';

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
    { name: 'MacBook Air M2', originalPrice: 125000, salePrice: 89999, discount: 28, image: '/placeholder.svg' },
    { name: 'Sony WH-1000XM5', originalPrice: 35000, salePrice: 24999, discount: 29, image: '/placeholder.svg' },
    { name: 'iPad Pro 11"', originalPrice: 95000, salePrice: 69999, discount: 26, image: '/placeholder.svg' },
    { name: 'AirPods Pro', originalPrice: 28000, salePrice: 19999, discount: 29, image: '/placeholder.svg' }
  ];

  return (
    <section className="py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-yellow-300" />
            <h2 className="text-xl font-bold">⚡ Flash Sale Ending Soon! ⚡</h2>
            <Flame className="w-5 h-5 text-yellow-300" />
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 inline-block">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">Time Remaining:</span>
            </div>
            <div className="flex gap-2">
              <div className="text-center">
                <div className="bg-white text-black rounded p-2 min-w-[40px]">
                  <div className="text-lg font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                </div>
                <div className="text-xs mt-1">Hours</div>
              </div>
              <div className="text-center">
                <div className="bg-white text-black rounded p-2 min-w-[40px]">
                  <div className="text-lg font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                </div>
                <div className="text-xs mt-1">Minutes</div>
              </div>
              <div className="text-center">
                <div className="bg-white text-black rounded p-2 min-w-[40px]">
                  <div className="text-lg font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                </div>
                <div className="text-xs mt-1">Seconds</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {deals.map((deal, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/20 transition-colors">
              <img
                src={deal.image}
                alt={deal.name}
                className="w-full h-20 object-cover rounded mb-2"
              />
              <h3 className="font-semibold text-xs mb-1">{deal.name}</h3>
              <div className="mb-2">
                <span className="text-xs line-through opacity-75">৳{deal.originalPrice.toLocaleString()}</span>
                <div className="text-sm font-bold">৳{deal.salePrice.toLocaleString()}</div>
              </div>
              <div className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold mb-2">
                {deal.discount}% OFF
              </div>
              <button className="w-full bg-yellow-400 text-black py-1 rounded text-xs font-semibold hover:bg-yellow-300 transition-colors">
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
