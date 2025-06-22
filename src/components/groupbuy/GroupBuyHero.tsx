
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Percent, TrendingUp } from 'lucide-react';

export const GroupBuyHero: React.FC = () => {
  const [activeGroups, setActiveGroups] = useState(1247);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGroups(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const highlights = [
    { icon: <Percent className="w-3 h-3" />, text: "Up to 70% OFF", color: "text-green-500" },
    { icon: <Users className="w-3 h-3" />, text: "Join Groups", color: "text-blue-500" },
    { icon: <Clock className="w-3 h-3" />, text: "Limited Time", color: "text-orange-500" },
    { icon: <TrendingUp className="w-3 h-3" />, text: "Trending Now", color: "text-purple-500" }
  ];

  return (
    <section className="bg-gradient-to-br from-teal-600 via-cyan-500 to-blue-600 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <Badge className="bg-yellow-500 text-black px-3 py-1 text-xs font-bold mb-3 animate-pulse">
            <Users className="w-3 h-3 mr-1" />
            {activeGroups.toLocaleString()} Active Groups
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-white bg-clip-text text-transparent">
              GROUP BUY
            </span>
            <br />
            <span className="text-white text-xl md:text-2xl">REVOLUTION</span>
          </h1>
          
          <p className="text-base md:text-lg mb-6 text-cyan-100 font-semibold max-w-2xl mx-auto">
            Join forces with other shoppers and unlock incredible savings! 
            The more people join, the bigger the discount gets.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-xl mx-auto">
            {highlights.map((highlight, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center">
                <div className={highlight.color}>{highlight.icon}</div>
                <span className="text-xs font-semibold mt-1">{highlight.text}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="default" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2">
              <Users className="w-4 h-4 mr-2" />
              Browse Active Groups
            </Button>
            <Button size="default" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600 px-6 py-2">
              Start Your Own Group
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
