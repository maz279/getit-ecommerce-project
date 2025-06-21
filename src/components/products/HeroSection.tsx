
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ShoppingBag, Gift } from 'lucide-react';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';

export const HeroSection: React.FC = () => {
  const timeLeft = useCountdownTimer({
    days: 3,
    hours: 12,
    minutes: 25,
    seconds: 45
  });

  return (
    <section className="relative py-16 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-16 -translate-y-16 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full transform translate-x-12 translate-y-12 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full animate-pulse delay-500"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 text-center text-white relative z-10">
        <div className="mb-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            🌙 EID MUBARAK! 🌟
          </h1>
          <p className="text-2xl md:text-4xl mb-6 font-bold text-yellow-300">
            🎉 The Biggest EID Sale 🎉
          </p>
          <div className="text-3xl md:text-5xl font-bold text-yellow-400 mb-6">
            ✨ UP TO 70% OFF ✨
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-lg">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-yellow-300">
            💰 Extra $50 Cashback with Mobile Payment
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-yellow-300">
            🚚 FREE Delivery on Orders Above $100
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-yellow-300">
            🎁 Special EID Gift Wrapping Available
          </div>
        </div>

        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto mb-8">
          <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
            <Clock className="w-6 h-6" />
            ⏰ ENDS IN:
          </h3>
          <div className="flex justify-center gap-4">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="bg-white bg-opacity-30 rounded-xl p-4 min-w-[80px] border-2 border-yellow-300">
                <div className="text-3xl font-bold text-yellow-200">{value.toString().padStart(2, '0')}</div>
                <div className="text-sm uppercase text-yellow-100">{unit}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold px-8 py-4 text-lg">
            <ShoppingBag className="w-5 h-5 mr-2" />
            🛒 Shop EID Collection
          </Button>
          <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-800 font-bold px-8 py-4 text-lg">
            <Gift className="w-5 h-5 mr-2" />
            🎁 EID Gift Guide
          </Button>
        </div>

        <p className="text-lg opacity-90">
          🎯 From 5000+ Verified Vendors Worldwide
        </p>
      </div>
    </section>
  );
};
