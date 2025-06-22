
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Gift, Sparkles } from 'lucide-react';

export const GiftCardHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-10 left-10 text-6xl opacity-20">🎁</div>
      <div className="absolute bottom-10 right-10 text-8xl opacity-20">💳</div>
      <div className="absolute top-1/2 left-1/4 text-4xl opacity-10">✨</div>
      
      <div className="relative max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Gift className="w-8 h-8 text-yellow-300" />
          <h1 className="text-5xl md:text-6xl font-bold">Gift Cards</h1>
          <Sparkles className="w-8 h-8 text-yellow-300" />
        </div>
        
        <p className="text-xl md:text-2xl mb-8 text-pink-100 max-w-3xl mx-auto">
          Perfect gifts for every occasion from 500+ trusted brands and vendors across Bangladesh
        </p>
        
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Input 
              placeholder="Search gift cards by brand, category, or occasion..."
              className="w-full h-14 pl-12 pr-4 text-gray-900 text-lg rounded-full border-0"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button className="bg-white text-purple-600 hover:bg-gray-100 text-lg font-bold px-8 py-4 rounded-full shadow-xl">
            🛍️ Browse All Gift Cards
          </Button>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600 text-lg font-bold px-8 py-4 rounded-full">
            🎯 Gift Card Finder
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-bold mb-1">Customizable</h3>
            <p className="text-sm text-pink-100">Add personal messages & designs</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-bold mb-1">Instant Delivery</h3>
            <p className="text-sm text-pink-100">Digital cards delivered instantly</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-bold mb-1">Secure & Reliable</h3>
            <p className="text-sm text-pink-100">Protected transactions & support</p>
          </div>
        </div>
      </div>
    </section>
  );
};
