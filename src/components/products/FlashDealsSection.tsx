
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Plus } from 'lucide-react';
import { flashDeals } from '@/data/productsData';
import { CountdownTimer } from './CountdownTimer';
import { CategoryFilter } from './CategoryFilter';
import { FlashDealCard } from './FlashDealCard';

export const FlashDealsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'electronics', 'fashion', 'home', 'food'];
  
  const filteredDeals = flashDeals.filter(product => 
    selectedCategory === 'all' || product.title.toLowerCase().includes(selectedCategory)
  );

  return (
    <section className="py-12 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Countdown */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Flame className="w-8 h-8 text-red-500 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              ⚡ Today's Special Offers ⚡
            </h2>
            <Flame className="w-8 h-8 text-red-500 animate-pulse" />
          </div>
          
          <p className="text-lg text-gray-600 mb-6">🔥 Limited Time Flash Deals - Don't Miss Out! 🔥</p>
          
          {/* Enhanced Countdown Timer */}
          <CountdownTimer 
            initialTime={{ days: 0, hours: 2, minutes: 15, seconds: 30 }}
          />
        </div>

        {/* Simple Category Filter */}
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredDeals.map((product, index) => (
            <FlashDealCard key={index} product={product} />
          ))}
        </div>

        {/* Footer Section */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 text-center">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">🎯 Flash Sale Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-500">✅</span>
                Free shipping on all items
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-500">✅</span>
                30-day return policy
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-500">✅</span>
                Genuine products only
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-500">✅</span>
                Express delivery available
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              View All Flash Deals
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              🔔 Get Flash Sale Alerts
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
