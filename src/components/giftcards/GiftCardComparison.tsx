
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Star } from 'lucide-react';

export const GiftCardComparison: React.FC = () => {
  const comparisonData = [
    {
      feature: 'Number of Partner Vendors',
      getit: '500+',
      competitor1: '50-100',
      competitor2: '200+',
      advantage: 'getit'
    },
    {
      feature: 'Expiration Policy',
      getit: 'No Expiry',
      competitor1: '1 Year',
      competitor2: '2 Years',
      advantage: 'getit'
    },
    {
      feature: 'Multi-language Support',
      getit: 'Bangla + English',
      competitor1: 'English Only',
      competitor2: 'English Only',
      advantage: 'getit'
    },
    {
      feature: 'Local Payment Methods',
      getit: 'bKash, Nagad, Rocket',
      competitor1: 'Cards Only',
      competitor2: 'Limited',
      advantage: 'getit'
    },
    {
      feature: 'Delivery Speed',
      getit: 'Instant',
      competitor1: '24 Hours',
      competitor2: 'Instant',
      advantage: 'tie'
    },
    {
      feature: 'Customer Support',
      getit: '24/7 Local Support',
      competitor1: 'Business Hours',
      competitor2: 'Email Only',
      advantage: 'getit'
    }
  ];

  const plans = [
    {
      name: 'getit Gift Cards',
      price: 'Best Value',
      features: [
        '500+ Partner Vendors',
        'No Expiry Date',
        'Instant Digital Delivery',
        'Bangla + English Support',
        'All Local Payment Methods',
        '24/7 Customer Support',
        'Custom Branding Available',
        'Bulk Order Discounts'
      ],
      recommended: true,
      buttonText: 'Choose getit',
      buttonColor: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      name: 'Traditional Gift Cards',
      price: 'Limited Options',
      features: [
        'Single Store Only',
        '1-2 Year Expiry',
        'Physical Cards Only',
        'Limited Language',
        'Cash/Card Payments',
        'Store Hours Support',
        'No Customization',
        'No Bulk Discounts'
      ],
      recommended: false,
      buttonText: 'Old Method',
      buttonColor: 'bg-gray-400'
    },
    {
      name: 'International Platforms',
      price: 'Not Local',
      features: [
        'Limited BD Vendors',
        'Various Expiry Dates',
        'USD Currency Only',
        'English Only',
        'International Cards',
        'Timezone Issues',
        'Generic Templates',
        'High Minimum Orders'
      ],
      recommended: false,
      buttonText: 'Not Suitable',
      buttonColor: 'bg-gray-400'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">📊 Why getit Gift Cards Lead the Market</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare our features with traditional gift cards and international platforms
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.recommended ? 'ring-2 ring-purple-500 shadow-xl' : ''}`}>
              {plan.recommended && (
                <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-6 py-2">
                  <Star className="w-4 h-4 mr-1" />
                  Recommended
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-xl font-bold text-purple-600">{plan.price}</div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {plan.recommended ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      <span className={plan.recommended ? 'text-gray-800' : 'text-gray-500'}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Button className={`w-full ${plan.buttonColor}`} disabled={!plan.recommended}>
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-center text-2xl">🏆 Feature-by-Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Features</th>
                    <th className="text-center p-4 font-semibold text-purple-600">getit Gift Cards</th>
                    <th className="text-center p-4 font-semibold">Traditional Cards</th>
                    <th className="text-center p-4 font-semibold">International Platforms</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className={`text-center p-4 ${row.advantage === 'getit' ? 'bg-green-50 text-green-800 font-semibold' : ''}`}>
                        {row.getit}
                      </td>
                      <td className="text-center p-4 text-gray-600">{row.competitor1}</td>
                      <td className="text-center p-4 text-gray-600">{row.competitor2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white inline-block">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">🇧🇩 Built for Bangladesh, Loved by Bangladeshis</h3>
              <p className="mb-6 max-w-2xl">
                getit Gift Cards are specifically designed for the Bangladeshi market with local payment methods, 
                language support, and partnerships with trusted local vendors.
              </p>
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
                Experience the Difference
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
