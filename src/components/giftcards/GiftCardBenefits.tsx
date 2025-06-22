
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, CreditCard, Clock, Users, Award, Headphones } from 'lucide-react';

export const GiftCardBenefits: React.FC = () => {
  const benefits = [
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: 'Secure & Protected',
      description: 'All transactions are encrypted and protected by bank-level security',
      details: ['SSL encryption', 'Fraud protection', 'Secure redemption', 'Money-back guarantee']
    },
    {
      icon: <CreditCard className="w-8 h-8 text-blue-600" />,
      title: 'Flexible Payments',
      description: 'Pay with your preferred method - bKash, cards, or bank transfer',
      details: ['bKash/Nagad/Rocket', 'Credit/Debit cards', 'Bank transfer', 'Cash on delivery']
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      title: 'No Expiry Worries',
      description: 'Most gift cards come with extended validity or no expiry dates',
      details: ['Extended validity', 'No expiry options', 'Balance protection', 'Reminder alerts']
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: 'Multi-User Access',
      description: 'Share gift cards with family members or use for group purchases',
      details: ['Family sharing', 'Split payments', 'Group gifting', 'Multiple recipients']
    },
    {
      icon: <Award className="w-8 h-8 text-red-600" />,
      title: 'Rewards Program',
      description: 'Earn points on every purchase and get exclusive member benefits',
      details: ['Loyalty points', 'Member discounts', 'Early access', 'Special offers']
    },
    {
      icon: <Headphones className="w-8 h-8 text-teal-600" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support in Bangla and English',
      details: ['Live chat support', 'Phone assistance', 'Email help', 'Video tutorials']
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🌟 Why Choose Our Gift Cards?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the difference with features designed for Bangladesh's digital lifestyle
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 mb-4">{benefit.description}</p>
                    <div className="space-y-1">
                      {benefit.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white inline-block">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-2">🎯 Over 2 Million Happy Customers</h3>
              <p className="text-green-100 mb-4">Join Bangladesh's most trusted gift card platform</p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold">4.8★</div>
                  <div className="text-green-200">Customer Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-green-200">Partner Brands</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">2M+</div>
                  <div className="text-green-200">Gift Cards Sold</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
