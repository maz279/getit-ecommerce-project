
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DollarSign, Star, TrendingUp } from 'lucide-react';

export const GiftCardDenominations: React.FC = () => {
  const denominations = [
    {
      amount: '৳500',
      bestFor: 'Small gifts & accessories',
      popular: ['Mobile accessories', 'Cosmetics', 'Books', 'Stationery'],
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      amount: '৳1,000',
      bestFor: 'Fashion & personal items',
      popular: ['Clothing', 'Footwear', 'Personal care', 'Bags'],
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      mostPopular: true
    },
    {
      amount: '৳2,500',
      bestFor: 'Electronics & gadgets',
      popular: ['Headphones', 'Smart devices', 'Home appliances', 'Gadgets'],
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      amount: '৳5,000',
      bestFor: 'Premium gifts',
      popular: ['Smartphones', 'Tablets', 'Premium fashion', 'Jewelry'],
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      amount: '৳10,000',
      bestFor: 'Special occasions',
      popular: ['Laptops', 'Furniture', 'Complete outfit sets', 'Appliances'],
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">💳 Available Gift Card Denominations</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from flexible amounts that suit every budget and occasion
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {denominations.map((denom, index) => (
            <Card key={index} className={`relative ${denom.bgColor} ${denom.borderColor} border-2 hover:shadow-lg transition-all duration-300`}>
              {denom.mostPopular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-800">{denom.amount}</CardTitle>
                <p className="text-sm text-gray-600 font-medium">{denom.bestFor}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Popular Items:</p>
                  {denom.popular.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-sm">
                  Select {denom.amount}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">🎨 Custom Amount Gift Card</h3>
            <p className="text-indigo-100 mb-6">Create a personalized gift with any amount between ৳100 - ৳50,000</p>
            
            <div className="max-w-md mx-auto flex gap-3">
              <Input 
                placeholder="Enter custom amount (৳100 - ৳50,000)"
                className="bg-white text-gray-900"
              />
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-6">
                Create
              </Button>
            </div>
            
            <p className="text-sm text-indigo-200 mt-4">Perfect for weddings, graduations, and special celebrations</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
