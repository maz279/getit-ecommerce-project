
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Building, Users, Gift, Calculator } from 'lucide-react';

export const BulkGiftCards: React.FC = () => {
  const bulkOptions = [
    {
      icon: <Building className="w-8 h-8 text-blue-600" />,
      title: 'Corporate Gifting',
      description: 'Perfect for employee rewards, client appreciation, and business events',
      benefits: ['Custom branding', 'Bulk discounts', 'Dedicated support', 'Flexible delivery'],
      minOrder: '50+ cards',
      discount: 'Up to 15% off'
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: 'Event Organizers',
      description: 'Ideal for weddings, conferences, seminars, and special occasions',
      benefits: ['Event-themed cards', 'Group delivery', 'Custom messages', 'Bulk pricing'],
      minOrder: '25+ cards',
      discount: 'Up to 12% off'
    },
    {
      icon: <Gift className="w-8 h-8 text-purple-600" />,
      title: 'Educational Institutions',
      description: 'Student rewards, teacher appreciation, and academic achievements',
      benefits: ['Educational discounts', 'School branding', 'Term-based delivery', 'Student tracking'],
      minOrder: '100+ cards',
      discount: 'Up to 20% off'
    }
  ];

  const pricingTiers = [
    { quantity: '25-49 cards', discount: '5%', price: '৳950 each' },
    { quantity: '50-99 cards', discount: '10%', price: '৳900 each' },
    { quantity: '100-249 cards', discount: '15%', price: '৳850 each' },
    { quantity: '250+ cards', discount: '20%', price: '৳800 each' }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🏢 Bulk Gift Cards & Corporate Solutions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Save more when you buy more. Perfect for businesses, events, and institutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {bulkOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  {option.icon}
                </div>
                <CardTitle className="text-xl">{option.title}</CardTitle>
                <p className="text-gray-600">{option.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 mb-6">
                  {option.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Minimum Order:</span>
                    <Badge variant="secondary">{option.minOrder}</Badge>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-semibold">Discount:</span>
                    <Badge className="bg-green-100 text-green-800">{option.discount}</Badge>
                  </div>
                </div>
                
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Get Quote
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Bulk Pricing Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pricingTiers.map((tier, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold">{tier.quantity}</div>
                      <div className="text-sm text-gray-600">Save {tier.discount}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-600">{tier.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <CardHeader>
              <CardTitle>🎯 Quick Bulk Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Number of Gift Cards</label>
                  <Input placeholder="Enter quantity (minimum 25)" className="bg-white text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm mb-2">Card Value Each</label>
                  <Input placeholder="Enter amount (৳500 - ৳10,000)" className="bg-white text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm mb-2">Organization Name</label>
                  <Input placeholder="Your company/organization" className="bg-white text-gray-900" />
                </div>
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  Calculate & Get Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
