
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Video, Headphones, Clock, Shield } from 'lucide-react';

export const PremiumSupport: React.FC = () => {
  const supportFeatures = [
    {
      icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
      title: "Live Chat Priority",
      description: "Skip the queue with instant access to premium support agents",
      availability: "24/7"
    },
    {
      icon: <Phone className="w-8 h-8 text-green-600" />,
      title: "Dedicated Phone Line",
      description: "Direct phone line for premium members with <30s wait time",
      availability: "6 AM - 12 AM"
    },
    {
      icon: <Video className="w-8 h-8 text-purple-600" />,
      title: "Video Call Support",
      description: "Face-to-face assistance for complex issues and product demos",
      availability: "9 AM - 9 PM"
    },
    {
      icon: <Headphones className="w-8 h-8 text-orange-600" />,
      title: "Personal Account Manager",
      description: "Dedicated relationship manager for Diamond tier members",
      availability: "Business Hours"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🛡️ Premium Customer Support</h2>
          <p className="text-xl text-gray-600">
            Get the help you need, when you need it, with our premium support team
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {supportFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="bg-gray-100 p-4 rounded-xl">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-3">{feature.description}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        Available: {feature.availability}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                Premium Protection Plan
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Extended warranty on all electronics</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Free returns and exchanges</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Purchase protection up to ৳100,000</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Priority repair and replacement</span>
                </li>
              </ul>
              <Button className="w-full">Learn More</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-blue-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">📞 Contact Premium Support</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">Premium Hotline</div>
                    <div className="text-sm text-gray-600">+880-1777-123456</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Live Chat</div>
                    <div className="text-sm text-gray-600">Available 24/7</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Video className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Video Support</div>
                    <div className="text-sm text-gray-600">Schedule a call</div>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Contact Support Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
