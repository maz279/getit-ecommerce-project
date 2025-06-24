
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { useSEO } from '@/hooks/useSEO';

const DailyDeals: React.FC = () => {
  useSEO({
    title: 'Daily Deals - GetIt Bangladesh | Today\'s Best Offers',
    description: 'Discover today\'s best deals and discounts. New offers added daily on top products.',
    keywords: 'daily deals, today offers, discounts, bangladesh deals'
  });

  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-600 mb-4">📅 Daily Deals 📅</h1>
            <p className="text-lg text-gray-600">Fresh deals updated every day!</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">🌅 Today's Special Offers 🌅</h2>
            <p className="mb-6">Daily deal products will be featured here with special pricing valid for 24 hours only.</p>
            <div className="text-6xl mb-4">💰</div>
            <p className="text-lg">New deals coming soon!</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DailyDeals;
