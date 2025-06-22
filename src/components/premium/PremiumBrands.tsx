
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Star } from 'lucide-react';

export const PremiumBrands: React.FC = () => {
  const premiumBrands = [
    { name: "Apple", logo: "🍎", description: "Latest iPhones, MacBooks, and accessories", exclusive: true },
    { name: "Samsung", logo: "📱", description: "Premium Galaxy series and smart devices", exclusive: false },
    { name: "Sony", logo: "🎮", description: "PlayStation, cameras, and audio equipment", exclusive: true },
    { name: "Nike", logo: "👟", description: "Limited edition sneakers and sportswear", exclusive: true },
    { name: "Adidas", logo: "⚽", description: "Premium athletic wear and equipment", exclusive: false },
    { name: "Louis Vuitton", logo: "👜", description: "Luxury handbags and accessories", exclusive: true },
    { name: "Rolex", logo: "⌚", description: "Authentic luxury timepieces", exclusive: true },
    { name: "BMW", logo: "🚗", description: "Automotive parts and accessories", exclusive: true }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Crown className="w-8 h-8 text-purple-600" />
            Premium & Luxury Brands
          </h2>
          <p className="text-xl text-gray-600">
            Exclusive access to world's most prestigious brands
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {premiumBrands.map((brand, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="relative">
                  {brand.exclusive && (
                    <Badge className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs">
                      Exclusive
                    </Badge>
                  )}
                  
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {brand.logo}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">{brand.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{brand.description}</p>
                  
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">🎯 Brand Partnerships</h3>
            <p className="text-gray-600 mb-6">
              We partner directly with brands to bring you authentic products at exclusive prices. 
              Premium members get first access to limited collections and special collaborations.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">1000+</div>
                <div className="text-sm text-gray-600">Premium Brands</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-gray-600">Authentic Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Brand Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
