
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, MessageCircle, Calendar, Image } from 'lucide-react';

export const CustomizationOptions: React.FC = () => {
  const customizationFeatures = [
    {
      icon: <Palette className="w-8 h-8 text-purple-600" />,
      title: 'Custom Designs',
      description: 'Choose from 50+ beautiful templates or upload your own design',
      features: ['Festival themes', 'Birthday designs', 'Wedding collections', 'Corporate branding']
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
      title: 'Personal Messages',
      description: 'Add heartfelt messages in Bangla or English',
      features: ['Custom text', 'Voice messages', 'Video greetings', 'Handwriting fonts']
    },
    {
      icon: <Calendar className="w-8 h-8 text-green-600" />,
      title: 'Scheduled Delivery',
      description: 'Schedule gifts for special dates and occasions',
      features: ['Birthday reminders', 'Anniversary alerts', 'Festival timing', 'Surprise delivery']
    },
    {
      icon: <Image className="w-8 h-8 text-pink-600" />,
      title: 'Photo Integration',
      description: 'Add personal photos to make it extra special',
      features: ['Family photos', 'Memory collages', 'Logo placement', 'Photo frames']
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🎨 Make It Personal</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your gift cards into unique, memorable presents with our customization tools
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {customizationFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {feature.icon}
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <p className="text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">🖼️ Preview Your Design</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              See exactly how your gift card will look before purchasing with our real-time preview feature
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
                Try Design Tool
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3">
                View Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
