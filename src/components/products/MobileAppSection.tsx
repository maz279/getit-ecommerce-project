
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, CheckCircle, Zap, Star, DollarSign, Truck, Camera, Mic, MapPin, Bot, Crown, Gift, Bell, BarChart3, Smartphone } from 'lucide-react';
import { mobileAppFeatures } from '@/data/productsData';

export const MobileAppSection: React.FC = () => {
  const getFeatureIcon = (title: string) => {
    if (title.includes("Flash Sales")) return <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />;
    if (title.includes("Exclusive Products")) return <Star className="w-8 h-8 mx-auto mb-2 text-purple-500" />;
    if (title.includes("Banking")) return <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />;
    if (title.includes("Delivery")) return <Truck className="w-8 h-8 mx-auto mb-2 text-blue-500" />;
    if (title.includes("Visual Search")) return <Camera className="w-8 h-8 mx-auto mb-2 text-red-500" />;
    if (title.includes("Voice")) return <Mic className="w-8 h-8 mx-auto mb-2 text-orange-500" />;
    if (title.includes("Location")) return <MapPin className="w-8 h-8 mx-auto mb-2 text-teal-500" />;
    if (title.includes("AI")) return <Bot className="w-8 h-8 mx-auto mb-2 text-indigo-500" />;
    if (title.includes("VIP")) return <Crown className="w-8 h-8 mx-auto mb-2 text-yellow-500" />;
    if (title.includes("Loyalty")) return <Gift className="w-8 h-8 mx-auto mb-2 text-pink-500" />;
    if (title.includes("Notifications")) return <Bell className="w-8 h-8 mx-auto mb-2 text-blue-500" />;
    if (title.includes("Analytics")) return <BarChart3 className="w-8 h-8 mx-auto mb-2 text-green-500" />;
    return <Star className="w-8 h-8 mx-auto mb-2 text-purple-500" />;
  };

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            📱 GetIt Mobile App - EID Special Features
          </h2>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download App
          </Button>
        </div>

        {/* App Download Banner */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-none shadow-xl">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">📱 Available only on GetIt Mobile App</h3>
                <p className="text-xl mb-6">Experience the future of EID shopping with exclusive mobile features</p>
                <div className="flex gap-4">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-bold">
                    <Download className="w-5 h-5 mr-2" />
                    📱 Download Android
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold">
                    <Download className="w-5 h-5 mr-2" />
                    🍎 Download iOS
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <Smartphone className="w-32 h-32 mx-auto mb-4 text-yellow-300" />
                <p className="text-lg font-semibold">Join 2M+ Happy Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile App Features */}
        <div className="space-y-8">
          {mobileAppFeatures.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="text-3xl">{section.icon}</span>
                  {section.category}
                </h3>
                <Button variant="outline" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View All Features
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.features.map((feature, featureIndex) => (
                  <Card key={featureIndex} className="border-2 border-blue-200 hover:border-blue-400 transform hover:scale-105 transition-all shadow-lg">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        {getFeatureIcon(feature.title)}
                        <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {feature.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-start gap-2 text-xs text-gray-600">
                            <CheckCircle className="w-3 h-3 mt-0.5 text-green-500" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                        Try Feature
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* App Benefits Summary */}
        <Card className="mt-8 bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🎯 Why Choose GetIt Mobile App?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-bold text-2xl text-blue-600">50%</h4>
                <p className="text-sm text-gray-600">Faster Checkout</p>
              </div>
              <div>
                <h4 className="font-bold text-2xl text-green-600">$20</h4>
                <p className="text-sm text-gray-600">Average Extra Savings</p>
              </div>
              <div>
                <h4 className="font-bold text-2xl text-purple-600">24/7</h4>
                <p className="text-sm text-gray-600">Smart Shopping Assistant</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <div className="flex gap-2 justify-center">
                <Button className="bg-blue-500 hover:bg-blue-600">📱 Download Now</Button>
                <Button variant="outline">🎯 Try Smart Features</Button>
                <Button variant="outline">🤖 Meet Nila</Button>
                <Button variant="outline">📍 Find Nearby</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
