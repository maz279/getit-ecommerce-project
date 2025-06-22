
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { Gift, Star, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GiftCards: React.FC = () => {
  const giftCardTypes = [
    {
      id: 1,
      name: 'Digital Gift Card',
      description: 'Instant delivery via email',
      amounts: [500, 1000, 2000, 5000],
      image: '💳',
      features: ['Instant delivery', 'No expiry', 'Easy to use']
    },
    {
      id: 2,
      name: 'Physical Gift Card',
      description: 'Beautiful physical card delivered to you',
      amounts: [1000, 2000, 3000, 5000],
      image: '🎁',
      features: ['Premium packaging', '1 year validity', 'Perfect for gifting']
    }
  ];

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">🎁 Gift Cards 🎁</h1>
            <p className="text-xl mb-8">Perfect gifts for your loved ones</p>
            <Button className="bg-white text-purple-600 hover:bg-gray-100 text-lg font-bold px-8 py-3 rounded-full">
              Shop Gift Cards
            </Button>
          </div>
        </section>

        {/* Gift Card Types */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Choose Your Gift Card</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {giftCardTypes.map((card) => (
                <div key={card.id} className="bg-white rounded-lg shadow-lg p-6 border">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{card.image}</div>
                    <h3 className="text-2xl font-bold mb-2">{card.name}</h3>
                    <p className="text-gray-600">{card.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Available Amounts:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {card.amounts.map((amount) => (
                        <button key={amount} className="bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors">
                          ৳{amount.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Features:</h4>
                    <ul className="space-y-2">
                      {card.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Select This Card
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

export default GiftCards;
