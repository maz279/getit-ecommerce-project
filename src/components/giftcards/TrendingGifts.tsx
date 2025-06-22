
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Flame, Star, Clock } from 'lucide-react';

export const TrendingGifts: React.FC = () => {
  const trendingItems = [
    {
      name: 'Electronics Bundle',
      price: '৳5,000',
      originalPrice: '৳6,000',
      discount: '17%',
      image: '📱',
      category: 'Electronics',
      trending: true,
      timeLeft: '2 hours',
      sold: 234
    },
    {
      name: 'Fashion Collection',
      price: '৳2,500',
      originalPrice: '৳3,200',
      discount: '22%',
      image: '👗',
      category: 'Fashion',
      trending: true,
      timeLeft: '5 hours',
      sold: 189
    },
    {
      name: 'Home & Kitchen',
      price: '৳3,500',
      originalPrice: '৳4,000',
      discount: '13%',
      image: '🏠',
      category: 'Home',
      trending: false,
      timeLeft: '1 day',
      sold: 156
    },
    {
      name: 'Beauty & Care',
      price: '৳1,800',
      originalPrice: '৳2,500',
      discount: '28%',
      image: '💄',
      category: 'Beauty',
      trending: true,
      timeLeft: '3 hours',
      sold: 298
    },
    {
      name: 'Books & Education',
      price: '৳800',
      originalPrice: '৳1,200',
      discount: '33%',
      image: '📚',
      category: 'Education',
      trending: false,
      timeLeft: '6 hours',
      sold: 145
    },
    {
      name: 'Sports & Fitness',
      price: '৳4,200',
      originalPrice: '৳5,500',
      discount: '24%',
      image: '⚽',
      category: 'Sports',
      trending: true,
      timeLeft: '4 hours',
      sold: 167
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-red-500" />
            <h2 className="text-4xl font-bold">🔥 Trending Gift Cards</h2>
            <Badge className="bg-red-500 text-white animate-pulse">Hot!</Badge>
          </div>
          <Button variant="outline" className="px-6">View All Trending</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingItems.map((item, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {item.trending && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge className="bg-red-500 text-white flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </Badge>
                </div>
              )}
              
              <div className="absolute top-3 right-3 z-10">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  -{item.discount}
                </Badge>
              </div>
              
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {item.image}
                  </div>
                  <Badge variant="outline" className="mb-2">{item.category}</Badge>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-3">{item.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-red-600">{item.price}</span>
                    <span className="text-gray-500 line-through text-sm">{item.originalPrice}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.timeLeft} left</span>
                    </div>
                    <span>{item.sold} sold</span>
                  </div>
                  
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Get This Deal
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">⏰ Limited time offers - Don't miss out!</p>
          <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
            Shop All Flash Deals
          </Button>
        </div>
      </div>
    </section>
  );
};
