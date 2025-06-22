
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { Award, Star, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Premium: React.FC = () => {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-yellow-600 to-orange-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">👑 Premium Collection 👑</h1>
            <p className="text-xl mb-8">Exclusive deals for premium members</p>
          </div>
        </section>
        
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Premium Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
                <h3 className="text-xl font-bold mb-2">Exclusive Access</h3>
                <p className="text-gray-600">Early access to sales and new products</p>
              </div>
              <div className="text-center">
                <Star className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
                <h3 className="text-xl font-bold mb-2">Special Discounts</h3>
                <p className="text-gray-600">Additional discounts only for premium members</p>
              </div>
              <div className="text-center">
                <Award className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
                <h3 className="text-xl font-bold mb-2">Priority Support</h3>
                <p className="text-gray-600">24/7 dedicated customer support</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Premium;
