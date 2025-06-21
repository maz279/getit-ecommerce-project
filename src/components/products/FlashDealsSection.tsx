
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
    <section className="py-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-purple-200">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
              Today's Special Offers
            </h2>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          
          <p className="text-sm text-gray-700 mb-4 font-medium">
            ✨ Handpicked deals across all categories ✨
          </p>
          
          {/* Compact Countdown Timer */}
          <div className="flex justify-center mb-4">
            <CountdownTimer 
              initialTime={{ days: 0, hours: 3, minutes: 45, seconds: 20 }}
            />
          </div>
        </div>

        {/* Compact Controls */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Category Filter */}
            <div className="w-full lg:w-auto">
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* View and Sort Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-500" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-2 border-purple-200 rounded-lg px-3 py-1 text-sm bg-white/90 backdrop-blur-sm focus:border-purple-400 transition-colors"
                >
                  <option value="featured">✨ Featured</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💎 Price: High to Low</option>
                  <option value="discount">🔥 Highest Discount</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex border-2 border-purple-200 rounded-lg overflow-hidden bg-white/90 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                      : 'bg-transparent text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-all ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                      : 'bg-transparent text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Product Grid */}
        <div className={`grid gap-4 mb-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
            : 'grid-cols-1 md:grid-cols-2'
        }`}>
          {filteredDeals.slice(0, 10).map((product, index) => (
            <div
              key={index}
              className="transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <FlashDealCard 
                product={product} 
                isCompact={true}
              />
            </div>
          ))}
        </div>

        {/* Compact GetIt Brand Footer */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-xl p-6 text-center text-white shadow-xl">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-3">🎯 Why Choose GetIt?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex flex-col items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <span className="text-lg">🚀</span>
                <span className="font-semibold">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <span className="text-lg">🔒</span>
                <span className="font-semibold">Secure Shopping</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <span className="text-lg">✅</span>
                <span className="font-semibold">Authentic Products</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <span className="text-lg">💝</span>
                <span className="font-semibold">Easy Returns</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button 
              variant="outline" 
              className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-all flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              View All Offers
            </Button>
            <Button className="bg-white text-purple-600 hover:bg-gray-100 transition-all font-bold text-sm">
              🔔 Get Deal Alerts
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
