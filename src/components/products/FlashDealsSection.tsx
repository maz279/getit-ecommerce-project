
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Plus, Clock, Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { flashDeals } from '@/data/productsData';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';

export const FlashDealsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const timeLeft = useCountdownTimer({ days: 0, hours: 2, minutes: 15, seconds: 30 });

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
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl p-4 inline-block shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">FLASH SALE ENDING IN:</span>
            </div>
            <div className="flex gap-2 justify-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-2 min-w-[60px] text-center">
                <div className="text-xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
                <div className="text-xs">Days</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-2 min-w-[60px] text-center">
                <div className="text-xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs">Hours</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-2 min-w-[60px] text-center">
                <div className="text-xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs">Minutes</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-2 min-w-[60px] text-center">
                <div className="text-xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs">Seconds</div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Category Filter */}
        <div className="flex justify-center items-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredDeals.map((product, index) => (
            <Card key={index} className="group relative overflow-hidden border-2 border-red-100 hover:border-red-300 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Enhanced Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                      <Flame className="w-3 h-3" />
                      {product.discount}
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      {product.freeItem}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary" className="p-2 rounded-full">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="p-2 rounded-full">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Stock Warning */}
                  <div className="absolute bottom-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                    Only {product.stockLeft} left!
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                    {product.title}
                  </h3>
                  
                  {/* Rating Display */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews.toLocaleString()})
                    </span>
                  </div>
                  
                  {/* Price Display */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-green-600">{product.salePrice}</span>
                      <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      🚚 {product.delivery}
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-2 shadow-lg transform hover:scale-105 transition-all">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
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
