
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Bell, Share, Download } from 'lucide-react';

export const MobileFeaturesSection: React.FC = () => {
  const mobileFeatures = [
    {
      icon: <Smartphone className="w-8 h-8 text-blue-600" />,
      title: "Mobile Optimized",
      description: "Seamless experience on all devices",
      details: ["Responsive design", "Touch-friendly interface", "Fast loading"]
    },
    {
      icon: <Bell className="w-8 h-8 text-green-600" />,
      title: "Smart Notifications",
      description: "Never miss a group opportunity",
      details: ["SMS alerts", "Push notifications", "Email updates"]
    },
    {
      icon: <Share className="w-8 h-8 text-purple-600" />,
      title: "Easy Sharing",
      description: "Share groups with one tap",
      details: ["WhatsApp integration", "Social media sharing", "Direct links"]
    },
    {
      icon: <Download className="w-8 h-8 text-orange-600" />,
      title: "Offline Support",
      description: "Access saved groups offline",
      details: ["Cached data", "Offline browsing", "Sync when online"]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">📱 Mobile First Experience</h2>
          <p className="text-xl text-gray-600">Optimized for mobile shoppers in Bangladesh</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mobileFeatures.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center justify-center gap-2">
                      <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">📲 Get the GetIt App</h3>
              <p className="text-lg text-gray-600 mb-6">
                Download our mobile app for the best group buying experience. Available for Android and iOS devices.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✅</span>
                  <span>Instant notifications for group updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✅</span>
                  <span>Quick sharing via WhatsApp and social media</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✅</span>
                  <span>Offline access to your joined groups</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✅</span>
                  <span>Secure mobile payment integration</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-6">📱</div>
              <div className="space-y-4">
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                  <Download className="w-5 h-5 mr-2" />
                  Download for Android
                </Button>
                <Button size="lg" variant="outline" className="w-full border-gray-300">
                  <Download className="w-5 h-5 mr-2" />
                  Download for iOS
                </Button>
                <p className="text-sm text-gray-500">
                  Coming soon to App Store and Google Play
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
