
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap, Shield } from 'lucide-react';

export const PremiumHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-yellow-200" />
              <Badge className="bg-yellow-200 text-yellow-800 text-base px-3 py-1">
                Premium Membership
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Unlock the Ultimate Shopping Experience
            </h1>
            
            <p className="text-base md:text-lg mb-6 opacity-90">
              Join GetIt Premium and enjoy exclusive deals, faster delivery, 
              priority support, and access to luxury brands unavailable to regular users.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-200" />
                <span className="text-sm">Exclusive Flash Sales</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-200" />
                <span className="text-sm">Premium Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-200" />
                <span className="text-sm">VIP Customer Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-200" />
                <span className="text-sm">Early Access</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-6 py-2">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-6 py-2">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">
              <div className="text-4xl mb-3">👑</div>
              <h3 className="text-xl font-bold mb-3">Join 50K+ Premium Members</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-2xl font-bold">50%</div>
                  <div className="text-xs opacity-75">Average Savings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-xs opacity-75">VIP Support</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-xs opacity-75">Exclusive Brands</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
