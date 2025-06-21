
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flame, Plus, Filter, Grid3X3, List, Star } from 'lucide-react';
import { flashDeals } from '@/data/productsData';
import { CountdownTimer } from './CountdownTimer';
import { CategoryFilter } from './CategoryFilter';
import { FlashDealCard } from './FlashDealCard';

export const FlashDealsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['all', 'electronics', 'fashion', 'home', 'beauty', 'sports', 'books'];
  
  const filteredDeals = flashDeals.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.title.toLowerCase().includes(selectedCategory);
  }).sort((a, b) => {
    if (sortBy === 'price-low') return parseFloat(a.salePrice.replace('$', '')) - parseFloat(b.salePrice.replace('$', ''));
    if (sortBy === 'price-high') return parseFloat(b.salePrice.replace('$', '')) - parseFloat(a.salePrice.replace('$', ''));
    if (sortBy === 'discount') return parseFloat(b.discount.replace('%', '')) - parseFloat(a.discount.replace('%', ''));
    return 0;
  });

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Elegant Header with GetIt Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-purple-200">
            <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
              Today's Special Offers
            </h2>
            <Star className="w-6 h-6 text-yellow-500 animate-spin" />
          </div>
          
          <p className="text-lg text-gray-700 mb-6 font-medium">
            ✨ Handpicked deals across all categories - Only on GetIt! ✨
          </p>
          
          {/* Elegant Countdown Timer */}
          <div className="flex justify-center mb-6">
            <CountdownTimer 
              initialTime={{ days: 0, hours: 3, minutes: 45, seconds: 20 }}
            />
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Category Filter */}
            <div className="w-full lg:w-auto">
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* View and Sort Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-500" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-2 border-purple-200 rounded-xl px-4 py-2 text-sm bg-white/90 backdrop-blur-sm focus:border-purple-400 transition-colors"
                >
                  <option value="featured">✨ Featured</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💎 Price: High to Low</option>
                  <option value="discount">🔥 Highest Discount</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex border-2 border-purple-200 rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'bg-transparent text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'bg-transparent text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Product Grid */}
        <div className={`grid gap-6 mb-8 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1 md:grid-cols-2'
        }`}>
          {filteredDeals.map((product, index) => (
            <div
              key={index}
              className="transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <FlashDealCard 
                product={product} 
                isCompact={viewMode === 'grid'}
              />
            </div>
          ))}
        </div>

        {/* GetIt Brand Footer */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-2xl p-8 text-center text-white shadow-2xl">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4">🎯 Why Choose GetIt for Special Offers?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <span className="text-2xl">🚀</span>
                <span className="font-semibold">Lightning Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <span className="text-2xl">🔒</span>
                <span className="font-semibold">100% Secure Shopping</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <span className="text-2xl">✅</span>
                <span className="font-semibold">Authentic Products</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <span className="text-2xl">💝</span>
                <span className="font-semibold">Easy Returns</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="outline" 
              className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              View All Special Offers
            </Button>
            <Button className="bg-white text-purple-600 hover:bg-gray-100 transition-all font-bold">
              🔔 Get Instant Deal Alerts
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
