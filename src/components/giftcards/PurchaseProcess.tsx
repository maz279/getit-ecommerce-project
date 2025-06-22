
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Send, CheckCircle, Smartphone, Mail, MessageCircle } from 'lucide-react';

export const PurchaseProcess: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Select Your Gift Card',
      icon: <CreditCard className="w-8 h-8 text-blue-600" />,
      details: [
        'Choose denomination or enter custom amount',
        'Select digital delivery method (Email/SMS)', 
        'Add personal message (optional)',
        'Choose design template'
      ]
    },
    {
      step: 2,
      title: 'Payment Options',
      icon: <Smartphone className="w-8 h-8 text-green-600" />,
      details: [
        'bKash - Most popular mobile banking',
        'Nagad - Digital financial services',
        'Rocket - Mobile payment solution',
        'Credit/Debit Cards - Visa, Mastercard',
        'Bank Transfer - Local Bangladesh banks'
      ]
    },
    {
      step: 3,
      title: 'Instant Delivery',
      icon: <Send className="w-8 h-8 text-purple-600" />,
      details: [
        'Recipient receives gift card code immediately',
        'Includes redemption instructions in Bangla & English',
        'Can be forwarded or printed if needed',
        'SMS backup option available'
      ]
    }
  ];

  const paymentMethods = [
    { name: 'bKash', icon: '📱', color: 'bg-pink-100 text-pink-800', popular: true },
    { name: 'Nagad', icon: '💰', color: 'bg-orange-100 text-orange-800', popular: true },
    { name: 'Rocket', icon: '🚀', color: 'bg-purple-100 text-purple-800', popular: false },
    { name: 'Visa/Mastercard', icon: '💳', color: 'bg-blue-100 text-blue-800', popular: false },
    { name: 'Bank Transfer', icon: '🏦', color: 'bg-green-100 text-green-800', popular: false }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">📱 How to Purchase & Send Gift Cards</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple 3-step process to send the perfect gift in minutes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
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
                <div className="space-y-3">
                  {step.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{detail}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center mb-6">🇧🇩 Bangladesh's Most Trusted Payment Methods</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {paymentMethods.map((method, index) => (
                <div key={index} className="relative">
                  {method.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs">
                      Popular
                    </Badge>
                  )}
                  <Card className="text-center hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="text-3xl mb-2">{method.icon}</div>
                      <Badge variant="secondary" className={`${method.color} text-xs`}>
                        {method.name}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">All payment methods are secured with bank-level encryption</p>
              <div className="flex justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Fraud protection</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
