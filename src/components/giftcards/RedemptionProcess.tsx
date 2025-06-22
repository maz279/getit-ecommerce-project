
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, CreditCard, RefreshCw, Eye, Combine } from 'lucide-react';

export const RedemptionProcess: React.FC = () => {
  const redemptionSteps = [
    {
      step: 1,
      title: 'Browse & Shop',
      icon: <Search className="w-8 h-8 text-blue-600" />,
      description: 'Explore thousands of products from verified vendors across all categories'
    },
    {
      step: 2,
      title: 'Add to Cart',
      icon: <ShoppingCart className="w-8 h-8 text-green-600" />,
      description: 'Select items from any vendor on our platform - mix and match as you like'
    },
    {
      step: 3,
      title: 'Apply Gift Card',
      icon: <CreditCard className="w-8 h-8 text-purple-600" />,
      description: 'Enter gift card code at checkout - balance applies automatically'
    }
  ];

  const features = [
    {
      icon: <RefreshCw className="w-6 h-6 text-green-600" />,
      title: 'Partial Usage',
      description: 'Use gift card across multiple purchases until balance is exhausted'
    },
    {
      icon: <Eye className="w-6 h-6 text-blue-600" />,
      title: 'Remaining Balance',
      description: 'Check balance anytime in your account dashboard or via SMS'
    },
    {
      icon: <Combine className="w-6 h-6 text-purple-600" />,
      title: 'Combine Payments',
      description: 'Mix gift card with bKash, cards, or other payment methods'
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-orange-600" />,
      title: 'All Vendors',
      description: 'Works with any verified vendor on the getit platform'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🛒 How Recipients Redeem Gift Cards</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple 3-step process to turn gift cards into amazing products
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {redemptionSteps.map((step, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-all duration-300 bg-white">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {step.step}
                </div>
              </div>
              
              <CardHeader className="text-center pt-8">
                <div className="flex justify-center mb-3">
                  {step.icon}
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 text-center">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">✨ Redemption Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">🎯 Use Across Our Entire Marketplace</h3>
            <p className="text-green-100 mb-6 max-w-3xl mx-auto">
              Your gift card works with all categories: Electronics, Fashion, Home & Garden, Traditional Products, 
              Books, Health & Beauty, Sports, and thousands more items from verified vendors
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <Badge className="bg-white/20 text-white p-3">📱 Electronics</Badge>
              <Badge className="bg-white/20 text-white p-3">👗 Fashion</Badge>
              <Badge className="bg-white/20 text-white p-3">🏠 Home & Garden</Badge>
              <Badge className="bg-white/20 text-white p-3">🎨 Traditional Crafts</Badge>
            </div>
            
            <Button className="mt-6 bg-white text-green-600 hover:bg-gray-100 px-8 py-3">
              Start Shopping Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
