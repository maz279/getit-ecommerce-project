
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
  
  // Enhanced filtering logic that maps products to categories based on title keywords
  const getProductCategory = (title: string): string => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('laptop') || titleLower.includes('phone') || titleLower.includes('headphone') || 
        titleLower.includes('smart') || titleLower.includes('tech') || titleLower.includes('gaming') ||
        titleLower.includes('wireless') || titleLower.includes('bluetooth') || titleLower.includes('camera')) {
      return 'electronics';
    }
    if (titleLower.includes('shirt') || titleLower.includes('dress') || titleLower.includes('jacket') || 
        titleLower.includes('jeans') || titleLower.includes('shoes') || titleLower.includes('watch') ||
        titleLower.includes('bag') || titleLower.includes('fashion') || titleLower.includes('clothes')) {
      return 'fashion';
    }
    if (titleLower.includes('kitchen') || titleLower.includes('home') || titleLower.includes('furniture') || 
        titleLower.includes('decor') || titleLower.includes('lamp') || titleLower.includes('table') ||
        titleLower.includes('chair') || titleLower.includes('bed') || titleLower.includes('sofa')) {
      return 'home';
    }
    if (titleLower.includes('beauty') || titleLower.includes('skincare') || titleLower.includes('makeup') || 
        titleLower.includes('cream') || titleLower.includes('perfume') || titleLower.includes('shampoo') ||
        titleLower.includes('cosmetic') || titleLower.includes('serum')) {
      return 'beauty';
    }
    if (titleLower.includes('sports') || titleLower.includes('fitness') || titleLower.includes('gym') || 
        titleLower.includes('exercise') || titleLower.includes('outdoor') || titleLower.includes('athletic') ||
        titleLower.includes('running') || titleLower.includes('yoga')) {
      return 'sports';
    }
    if (titleLower.includes('book') || titleLower.includes('novel') || titleLower.includes('guide') || 
        titleLower.includes('manual') || titleLower.includes('story') || titleLower.includes('education') ||
        titleLower.includes('learning') || titleLower.includes('reading')) {
      return 'books';
    }
    
    return 'electronics'; // default category
  };
  
  const filteredDeals = flashDeals.filter(product => {
    if (selectedCategory === 'all') return true;
    return getProductCategory(product.title) === selectedCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return parseFloat(a.salePrice.replace('$', '')) - parseFloat(b.salePrice.replace('$', ''));
    if (sortBy === 'price-high') return parseFloat(b.salePrice.replace('$', '')) - parseFloat(a.salePrice.replace('$', ''));
    if (sortBy === 'discount') return parseFloat(b.discount.replace('%', '')) - parseFloat(a.discount.replace('%', ''));
    return 0;
  });

  return (
    <section className="py-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* More Compact Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 mb-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-purple-200">
            <Flame className="w-4 h-4 text-orange-500" />
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
              Today's Special Offers
            </h2>
            <Star className="w-4 h-4 text-yellow-500" />
          </div>
          
          <p className="text-xs text-gray-700 mb-3 font-medium">
            ✨ Handpicked deals across all categories ✨
          </p>
          
          {/* More Compact Countdown Timer */}
          <div className="flex justify-center mb-3">
            <CountdownTimer 
              initialTime={{ days: 0, hours: 3, minutes: 45, seconds: 20 }}
            />
          </div>
        </div>

        {/* More Compact Controls */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 mb-4 shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-3">
            {/* Category Filter */}
            <div className="w-full lg:w-auto">
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* View and Sort Controls */}
            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-1">
                <Filter className="w-3 h-3 text-purple-500" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-purple-200 rounded-md px-2 py-1 text-xs bg-white/90 backdrop-blur-sm focus:border-purple-400 transition-colors"
                >
                  <option value="featured">✨ Featured</option>
                  <option value="price-low">💰 Low to High</option>
                  <option value="price-high">💎 High to Low</option>
                  <option value="discount">🔥 Best Discount</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-purple-200 rounded-md overflow-hidden bg-white/90 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                      : 'bg-transparent text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  <Grid3X3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-all ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                      : 'bg-transparent text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  <List className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Product Grid */}
        <div className={`grid gap-3 mb-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' 
            : 'grid-cols-1 md:grid-cols-2'
        }`}>
          {filteredDeals.slice(0, 12).map((product, index) => (
            <div
              key={index}
              className="transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <FlashDealCard 
                product={product} 
                isCompact={true}
              />
            </div>
          ))}
        </div>

        {/* Show message when no products found for category */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-8 bg-white/50 rounded-lg">
            <p className="text-gray-600 text-sm">No products found in the {selectedCategory} category.</p>
            <p className="text-gray-500 text-xs mt-1">Try selecting "All" or a different category.</p>
          </div>
        )}

        {/* More Compact GetIt Brand Footer */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-lg p-4 text-center text-white shadow-xl">
          <div className="mb-3">
            <h3 className="text-lg font-bold mb-2">🎯 Why Choose GetIt?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex flex-col items-center gap-1 bg-white/20 backdrop-blur-sm rounded-md p-2">
                <span className="text-sm">🚀</span>
                <span className="font-semibold">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-white/20 backdrop-blur-sm rounded-md p-2">
                <span className="text-sm">🔒</span>
                <span className="font-semibold">Secure Shopping</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-white/20 backdrop-blur-sm rounded-md p-2">
                <span className="text-sm">✅</span>
                <span className="font-semibold">Authentic Products</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-white/20 backdrop-blur-sm rounded-md p-2">
                <span className="text-sm">💝</span>
                <span className="font-semibold">Easy Returns</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <Button 
              variant="outline" 
              className="bg-white/20 backdrop-blur-sm border border-white text-white hover:bg-white hover:text-purple-600 transition-all flex items-center gap-1 text-xs px-3 py-1.5"
            >
              <Plus className="w-3 h-3" />
              View All Offers
            </Button>
            <Button className="bg-white text-purple-600 hover:bg-gray-100 transition-all font-bold text-xs px-3 py-1.5">
              🔔 Get Deal Alerts
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
