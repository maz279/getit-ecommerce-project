
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Plus } from 'lucide-react';
import { flashDeals } from '@/data/productsData';

export const FlashDealsSection: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-red-100 to-yellow-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3 mb-4">
              <Flame className="w-8 h-8 text-red-500" />
              ⚡ Today's Special Offers ⚡
              <Flame className="w-8 h-8 text-red-500" />
            </h2>
            <p className="text-lg text-gray-600">⏰ Limited Time Flash Deals ⏰</p>
            <div className="bg-red-500 text-white px-4 py-2 rounded-full inline-block font-bold mt-2">
              🔥 ENDING IN: 2:15:30 - Don't Miss Out!
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            View All Flash Deals
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashDeals.map((product, index) => (
            <Card key={index} className="transform hover:scale-105 transition-all duration-300 border-2 border-red-200 hover:border-red-400 shadow-lg">
              <CardContent className="p-4">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                
                <h3 className="font-bold text-gray-800 mb-2 text-sm">{product.title}</h3>
                
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-gray-400 line-through text-sm">{product.originalPrice}</span>
                    <span className="text-lg font-bold text-green-600 ml-2">{product.salePrice}</span>
                  </div>
                  <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    {product.discount}
                  </div>
                </div>
                
                <div className="space-y-1 text-xs text-gray-600 mb-3">
                  <div>📦 {product.freeItem}</div>
                  <div>🚚 {product.delivery}</div>
                  <div>⭐ {product.rating}/5 ({product.reviews.toLocaleString()} reviews)</div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold">
                  🛒 Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 mb-4">🎯 Only 50 pieces left each! | 🔥 Free shipping all items</p>
        </div>
      </div>
    </section>
  );
};
