
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Shield, Users, TrendingDown } from 'lucide-react';

export const MultiVendorBenefits: React.FC = () => {
  const benefits = [
    {
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      title: 'Product Diversity',
      description: 'From local handicrafts to international brands - unlimited choices',
      details: ['Traditional Bangladeshi products', 'International electronics', 'Fashion from global brands', 'Handmade artisan items']
    },
    {
      icon: <TrendingDown className="w-8 h-8 text-green-600" />,
      title: 'Competitive Pricing',
      description: 'Multiple vendors ensure best prices and deals',
      details: ['Price comparison across vendors', 'Regular discount offers', 'Seasonal sales events', 'Bulk purchase discounts']
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: 'Quality Assurance',
      description: 'All vendors verified and rated by real customers',
      details: ['Vendor verification process', 'Quality checks', 'Return & refund protection', 'Authenticity guarantee']
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: 'Customer Reviews',
      description: 'Make informed decisions with authentic reviews',
      details: ['Verified purchase reviews', 'Photo & video reviews', 'Detailed ratings', 'Helpful community feedback']
    }
  ];

  const stats = [
    { number: '500+', label: 'Verified Vendors', icon: '🏪' },
    { number: '50,000+', label: 'Products Available', icon: '📦' },
    { number: '4.8★', label: 'Average Rating', icon: '⭐' },
    { number: '2M+', label: 'Happy Customers', icon: '😊' }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🏪 What Makes getit Gift Cards Special?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of Bangladesh's largest multi-vendor marketplace
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  {benefit.icon}
                </div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {benefit.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">{detail}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-white mb-8">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center mb-8">📊 Multi-Vendor Marketplace Statistics</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">🇧🇩 Supporting Local Bangladesh Economy</h3>
            <p className="text-purple-100 mb-6 max-w-3xl mx-auto">
              When you purchase getit gift cards, you're not just giving a gift - you're supporting local vendors, 
              artisans, and small businesses across Bangladesh while providing access to quality international products.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Badge className="bg-white/20 text-white p-4 text-center">
                <div className="text-2xl mb-2">🏪</div>
                <div>Local SMEs Supported</div>
              </Badge>
              <Badge className="bg-white/20 text-white p-4 text-center">
                <div className="text-2xl mb-2">🎨</div>
                <div>Artisan Communities</div>
              </Badge>
              <Badge className="bg-white/20 text-white p-4 text-center">
                <div className="text-2xl mb-2">🌍</div>
                <div>Global Brand Access</div>
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
