
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { Users, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GroupBuy: React.FC = () => {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">👥 Group Buy 👥</h1>
            <p className="text-xl mb-8">Buy together and save more!</p>
          </div>
        </section>
        
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">How Group Buy Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold mb-2">Join a Group</h3>
                <p className="text-gray-600">Find or create a group for the product you want</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-xl font-bold mb-2">Wait for Others</h3>
                <p className="text-gray-600">More people joining means bigger discounts</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold mb-2">Save Money</h3>
                <p className="text-gray-600">Enjoy lower prices when the group is complete</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default GroupBuy;
