
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap, Shield } from 'lucide-react';

export const PremiumHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-10 h-10 text-yellow-200" />
              <Badge className="bg-yellow-200 text-yellow-800 text-lg px-4 py-2">
                Premium Membership
              </Badge>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Unlock the Ultimate Shopping Experience
            </h1>
            
            <p className="text-xl mb-8 opacity-90">
              Join GetIt Premium and enjoy exclusive deals, faster delivery, 
              priority support, and access to luxury brands unavailable to regular users.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-200" />
                <span>Exclusive Flash Sales</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-yellow-200" />
                <span>Premium Protection</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-200" />
                <span>VIP Customer Support</span>
              </div>
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-yellow-200" />
                <span>Early Access</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
              <div className="text-6xl mb-4">👑</div>
              <h3 className="text-2xl font-bold mb-4">Join 50K+ Premium Members</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">50%</div>
                  <div className="text-sm opacity-75">Average Savings</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-sm opacity-75">VIP Support</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-sm opacity-75">Exclusive Brands</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
