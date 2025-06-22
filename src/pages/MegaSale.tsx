
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { Percent, Clock, Star, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MegaSale: React.FC = () => {
  const megaDeals = [
    {
      id: 1,
      name: 'Smartphone Bundle',
      originalPrice: 25000,
      salePrice: 12500,
      discount: 50,
      image: '📱',
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Fashion Collection',
      originalPrice: 8000,
      salePrice: 2400,
      discount: 70,
      image: '👕',
      category: 'Fashion'
    },
    {
      id: 3,
      name: 'Home Appliances',
      originalPrice: 15000,
      salePrice: 6000,
      discount: 60,
      image: '🏠',
      category: 'Home & Garden'
    }
  ];

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">🔥 MEGA SALE 🔥</h1>
            <p className="text-xl mb-8">Biggest discounts of the year - Up to 70% OFF</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <span>Sale ends in: 5 days 12:34:56</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mega Deals */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Mega Sale Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {megaDeals.map((deal) => (
                <div key={deal.id} className="bg-white rounded-lg shadow-lg p-6 border">
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-4">{deal.image}</div>
                    <h3 className="text-xl font-bold mb-2">{deal.name}</h3>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                      {deal.discount}% OFF
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-blue-600">৳{deal.salePrice.toLocaleString()}</span>
                      <span className="text-gray-500 line-through">৳{deal.originalPrice.toLocaleString()}</span>
                    </div>
                    <p className="text-center text-green-600 font-semibold">
                      Save ৳{(deal.originalPrice - deal.salePrice).toLocaleString()}
                    </p>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Shop Now
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MegaSale;
