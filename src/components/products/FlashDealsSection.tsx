
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flame, Plus, Filter, Grid3X3, List } from 'lucide-react';
import { flashDeals } from '@/data/productsData';
import { CountdownTimer } from './CountdownTimer';
import { CategoryFilter } from './CategoryFilter';
import { FlashDealCard } from './FlashDealCard';

export const FlashDealsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['all', 'electronics', 'fashion', 'home', 'beauty', 'sports', 'books'];
  
  // Enhanced filtering with mixed categories
  const filteredDeals = flashDeals.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.title.toLowerCase().includes(selectedCategory);
  }).sort((a, b) => {
    if (sortBy === 'price-low') return parseFloat(a.salePrice.replace('$', '')) - parseFloat(b.salePrice.replace('$', ''));
    if (sortBy === 'price-high') return parseFloat(b.salePrice.replace('$', '')) - parseFloat(a.salePrice.replace('$', ''));
    if (sortBy === 'discount') return parseFloat(b.discount.replace('%', '')) - parseFloat(a.discount.replace('%', ''));
    return 0; // featured/default
  });

  return (
    <section className="py-8 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Redesigned Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-3 mb-3">
            <Flame className="w-6 h-6 text-red-500 animate-pulse" />
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              🔥 Today's Special Offers 🔥
            </h2>
            <Flame className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          
          <p className="text-gray-600 mb-4">⚡ Limited Time Flash Deals - Mixed Categories ⚡</p>
          
          {/* Compact Countdown Timer */}
          <CountdownTimer 
            initialTime={{ days: 0, hours: 2, minutes: 15, seconds: 30 }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
          {/* Category Filter */}
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* View and Sort Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Products Grid */}
        <div className={`grid gap-4 mb-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {filteredDeals.map((product, index) => (
            <FlashDealCard 
              key={index} 
              product={product} 
              isCompact={viewMode === 'grid'}
            />
          ))}
        </div>

        {/* Enhanced Footer Section */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 text-center">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">🎯 Why Shop Our Flash Sale?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2 bg-white bg-opacity-50 rounded-lg p-2">
                <span className="text-green-500">✅</span>
                Free Shipping
              </div>
              <div className="flex items-center justify-center gap-2 bg-white bg-opacity-50 rounded-lg p-2">
                <span className="text-green-500">✅</span>
                30-Day Returns
              </div>
              <div className="flex items-center justify-center gap-2 bg-white bg-opacity-50 rounded-lg p-2">
                <span className="text-green-500">✅</span>
                Genuine Products
              </div>
              <div className="flex items-center justify-center gap-2 bg-white bg-opacity-50 rounded-lg p-2">
                <span className="text-green-500">✅</span>
                Express Delivery
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3">
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
