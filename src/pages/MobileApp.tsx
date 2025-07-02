import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/homepage/Footer';
import { Download, Smartphone, Bell, Shield, Zap, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MobileApp: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: 'Lightning Fast',
      description: 'Browse and shop with blazing fast performance'
    },
    {
      icon: <Bell className="w-8 h-8 text-green-500" />,
      title: 'Smart Notifications',
      description: 'Get notified about deals, orders, and exclusive offers'
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      title: 'Secure Payments',
      description: 'Safe and secure payment options including bKash, Nagad'
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: 'Exclusive Deals',
      description: 'Access app-only discounts and special offers'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-red-500 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Shop Smarter with the GetIt Mobile App
                </h1>
                <p className="text-xl text-blue-100">
                  Experience the best of online shopping with our feature-rich mobile app. 
                  Fast, secure, and designed for Bangladesh.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" variant="secondary" className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download for Android
                  </Button>
                  <Button size="lg" variant="outline" className="flex items-center gap-2 border-white text-white hover:bg-white hover:text-blue-600">
                    <Download className="w-5 h-5" />
                    Download for iOS
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">4.8</span>
                  </div>
                  <span className="text-blue-100">10M+ Downloads</span>
                  <span className="text-blue-100">Trusted by millions</span>
                </div>
              </div>
              
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <Smartphone className="w-64 h-96 text-white/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                      <h3 className="text-xl font-bold mb-2">GetIt App</h3>
                      <p className="text-sm text-blue-100">Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose GetIt Mobile App?</h2>
              <p className="text-muted-foreground text-lg">
                Discover the features that make shopping easier and more enjoyable
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* App Preview Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">App Features Preview</h2>
              <p className="text-muted-foreground">
                See what makes our app special
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Easy Navigation</h3>
                <p className="text-muted-foreground mb-4">
                  Intuitive design with Bengali language support for better user experience.
                </p>
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-4 h-40 flex items-center justify-center">
                  <span className="text-muted-foreground">Navigation Preview</span>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Checkout</h3>
                <p className="text-muted-foreground mb-4">
                  One-tap checkout with saved payment methods and addresses.
                </p>
                <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-4 h-40 flex items-center justify-center">
                  <span className="text-muted-foreground">Checkout Preview</span>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Order Tracking</h3>
                <p className="text-muted-foreground mb-4">
                  Real-time order tracking with push notifications for updates.
                </p>
                <div className="bg-gradient-to-br from-purple-100 to-red-100 rounded-lg p-4 h-40 flex items-center justify-center">
                  <span className="text-muted-foreground">Tracking Preview</span>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Download CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Download?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join millions of satisfied customers shopping on GetIt mobile app
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Download className="w-5 h-5 mr-2" />
                Get it on Google Play
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Download className="w-5 h-5 mr-2" />
                Download on App Store
              </Button>
            </div>
            
            <p className="text-sm mt-6 opacity-75">
              Available for Android 5.0+ and iOS 12.0+
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MobileApp;