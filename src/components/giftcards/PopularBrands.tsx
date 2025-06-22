
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp } from 'lucide-react';

export const PopularBrands: React.FC = () => {
  const popularBrands = [
    { name: 'Daraz', logo: '🛒', discount: '15% off', rating: 4.8, category: 'E-commerce' },
    { name: 'Foodpanda', logo: '🍔', discount: '20% off', rating: 4.6, category: 'Food Delivery' },
    { name: 'Pathao', logo: '🚗', discount: '25% off', rating: 4.7, category: 'Transportation' },
    { name: 'Grameenphone', logo: '📱', discount: '10% off', rating: 4.5, category: 'Telecom' },
    { name: 'bKash', logo: '💳', discount: '5% cashback', rating: 4.9, category: 'Financial' },
    { name: 'Star Cineplex', logo: '🎬', discount: '30% off', rating: 4.4, category: 'Entertainment' },
    { name: 'Aarong', logo: '👗', discount: '20% off', rating: 4.6, category: 'Fashion' },
    { name: 'Agora', logo: '🛍️', discount: '15% off', rating: 4.3, category: 'Retail' }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-4xl font-bold">Popular Brands</h2>
            </div>
            <p className="text-xl text-gray-600">Top-rated gift cards from Bangladesh's favorite brands</p>
          </div>
          <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
            500+ Brands Available
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {popularBrands.map((brand, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {brand.logo}
                </div>
                <h3 className="font-bold text-sm mb-1">{brand.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{brand.category}</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-semibold">{brand.rating}</span>
                </div>
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  {brand.discount}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <button className="bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full font-semibold transition-colors">
            View All 500+ Brands →
          </button>
        </div>
      </div>
    </section>
  );
};
