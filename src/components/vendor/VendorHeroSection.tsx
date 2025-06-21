
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Store, Users, TrendingUp, Award, Clock, Shield } from 'lucide-react';

export const VendorHeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <Store className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Become a GetIt Partner
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Join Bangladesh's fastest-growing marketplace and reach millions of customers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-white" />
              <div className="text-3xl font-bold mb-2">10M+</div>
              <p className="text-white/90">Active Customers</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <Store className="w-12 h-12 mx-auto mb-4 text-white" />
              <div className="text-3xl font-bold mb-2">50K+</div>
              <p className="text-white/90">Successful Vendors</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-white" />
              <div className="text-3xl font-bold mb-2">৳500Cr+</div>
              <p className="text-white/90">Monthly Sales Volume</p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Award className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Reach Millions</h3>
            <p className="text-white/90">Access to 10+ million active customers across Bangladesh</p>
          </div>
          
          <div className="text-center">
            <Clock className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quick Setup</h3>
            <p className="text-white/90">Start selling in 24-48 hours with our streamlined process</p>
          </div>
          
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Seller Protection</h3>
            <p className="text-white/90">Secure payments and dedicated seller support</p>
          </div>
        </div>
      </div>
    </section>
  );
};
