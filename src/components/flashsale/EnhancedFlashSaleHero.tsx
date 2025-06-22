
import React from 'react';
import { Flame, Zap, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedFlashSaleHeroProps {
  timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export const EnhancedFlashSaleHero: React.FC<EnhancedFlashSaleHeroProps> = ({ timeLeft }) => {
  return (
    <section className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-100"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <Flame className="w-12 h-12 animate-bounce text-yellow-300" />
            <Zap className="w-16 h-16 text-yellow-300" />
            <Flame className="w-12 h-12 animate-bounce text-yellow-300" />
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold mb-4 drop-shadow-lg">
            🔥 BANGLADESH'S BIGGEST FLASH SALE 🔥
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold mb-2 text-yellow-200">
            UP TO 90% OFF + FREE DELIVERY
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-yellow-100">
            Limited Time Only - Don't Miss Out!
          </p>
          
          {/* Enhanced Countdown */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 inline-block mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-yellow-300" />
              <span className="text-2xl font-bold">⏰ Sale Ends In: ⏰</span>
            </div>
            <div className="flex gap-4 justify-center">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-white text-red-600 rounded-xl p-6 min-w-[100px] text-center shadow-2xl">
                  <div className="text-3xl md:text-4xl font-bold">{value.toString().padStart(2, '0')}</div>
                  <div className="text-sm uppercase font-medium">{unit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">🔥 67%</div>
              <div className="text-sm text-yellow-200">Items Already Claimed!</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">⚡ 12,847</div>
              <div className="text-sm text-yellow-200">Products Sold Today!</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">156</div>
              <div className="text-sm text-yellow-200">Products Available</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">4.8★</div>
              <div className="text-sm text-yellow-200">Customer Rating</div>
            </div>
          </div>

          <Button className="bg-white text-red-600 hover:bg-gray-100 text-xl font-bold px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
            🛒 SHOP NOW - HURRY UP! 🚀
          </Button>
        </div>
      </div>
    </section>
  );
};
