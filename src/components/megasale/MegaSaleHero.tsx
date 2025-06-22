
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Clock, Star, Zap, Gift, Truck } from 'lucide-react';

export const MegaSaleHero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const highlights = [
    { icon: <Zap className="w-5 h-5" />, text: "Up to 80% OFF", color: "text-yellow-400" },
    { icon: <Gift className="w-5 h-5" />, text: "Free Gifts", color: "text-pink-400" },
    { icon: <Truck className="w-5 h-5" />, text: "Free Shipping", color: "text-green-400" },
    { icon: <Star className="w-5 h-5" />, text: "Exclusive Deals", color: "text-blue-400" }
  ];

  return (
    <section className="bg-gradient-to-br from-red-600 via-purple-700 to-indigo-800 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-pink-400/20 rounded-full animate-pulse delay-100"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/20 rounded-full animate-bounce"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          {/* Sale Badge */}
          <div className="flex justify-center mb-6">
            <Badge className="bg-yellow-500 text-black px-6 py-2 text-lg font-bold animate-pulse">
              <Flame className="w-5 h-5 mr-2" />
              MEGA SALE 2024
            </Badge>
          </div>
          
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 drop-shadow-lg">
            <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              MEGA
            </span>
            <br />
            <span className="text-white">SALE</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl md:text-3xl mb-8 text-yellow-100 font-semibold">
            Bangladesh's Biggest Shopping Festival
          </p>
          
          {/* Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            {highlights.map((highlight, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                <div className={highlight.color}>{highlight.icon}</div>
                <span className="text-sm font-semibold mt-2">{highlight.text}</span>
              </div>
            ))}
          </div>
          
          {/* Countdown Timer */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 inline-block mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-yellow-400" />
              <span className="text-xl font-bold">Sale Ends In:</span>
            </div>
            <div className="flex gap-4">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-white text-red-600 rounded-xl p-4 min-w-[80px] text-center shadow-lg">
                  <div className="text-3xl font-black">{value.toString().padStart(2, '0')}</div>
                  <div className="text-sm uppercase font-bold">{unit}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg">
              <Flame className="w-5 h-5 mr-2" />
              Shop Flash Deals
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg">
              View All Categories
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
