
import React, { useState } from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { DailyDealsNavigationMap } from '../components/dailydeals/DailyDealsNavigationMap';
import { Clock, Star, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DailyDeals: React.FC = () => {
  const dailyDeals = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      description: 'Premium sound quality | 30-hour battery life',
      originalPrice: 3999,
      salePrice: 1999,
      discount: 50,
      savings: 2000,
      timeLeft: '23:45:30',
      stock: 15,
      rating: 4.6,
      reviews: 1234,
      image: '🎧',
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Premium Bed Sheet Set',
      description: '100% Cotton | King Size | 4 pieces',
      originalPrice: 4500,
      salePrice: 1800,
      discount: 60,
      savings: 2700,
      timeLeft: '23:45:30',
      stock: 8,
      rating: 4.8,
      reviews: 567,
      image: '🛏️',
      category: 'Home & Garden'
    },
    {
      id: 3,
      name: 'Smart Water Bottle',
      description: 'Temperature display | 500ml | BPA-free',
      originalPrice: 2200,
      salePrice: 999,
      discount: 55,
      savings: 1201,
      timeLeft: '23:45:30',
      stock: 25,
      rating: 4.4,
      reviews: 890,
      image: '💧',
      category: 'Health & Beauty'
    },
    {
      id: 4,
      name: 'Organic Face Care Kit',
      description: '5-step routine | Natural ingredients | All skin types',
      originalPrice: 2800,
      salePrice: 1120,
      discount: 60,
      savings: 1680,
      timeLeft: '23:45:30',
      stock: 12,
      rating: 4.7,
      reviews: 445,
      image: '🧴',
      category: 'Beauty'
    },
    {
      id: 5,
      name: 'Fitness Resistance Bands Set',
      description: '5 resistance levels | Exercise guide included',
      originalPrice: 1500,
      salePrice: 450,
      discount: 70,
      savings: 1050,
      timeLeft: '23:45:30',
      stock: 30,
      rating: 4.5,
      reviews: 678,
      image: '🏋️',
      category: 'Sports & Outdoor'
    },
    {
      id: 6,
      name: 'Stylish Canvas Backpack',
      description: 'Laptop compartment | Water-resistant | Multiple pockets',
      originalPrice: 3200,
      salePrice: 1280,
      discount: 60,
      savings: 1920,
      timeLeft: '23:45:30',
      stock: 18,
      rating: 4.3,
      reviews: 234,
      image: '🎒',
      category: 'Fashion'
    }
  ];

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 via-teal-500 to-blue-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                🌟 DAILY DEALS BANGLADESH 🌟
              </h1>
              <h2 className="text-xl md:text-3xl font-bold mb-2 text-yellow-200">
                NEW DEALS EVERY DAY - UP TO 70% OFF
              </h2>
              <p className="text-lg mb-6 text-yellow-100">
                Fresh deals updated daily at midnight!
              </p>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 inline-block mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-300" />
                  <span className="text-lg font-bold">⏰ Today's Deals Reset In: ⏰</span>
                </div>
                <div className="text-2xl font-bold">23:45:30</div>
              </div>

              <Button className="bg-white text-green-600 hover:bg-gray-100 text-lg font-bold px-8 py-3 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300">
                🛒 EXPLORE TODAY'S DEALS 🌟
              </Button>
            </div>
          </div>
        </section>
        
        <DailyDealsNavigationMap />
        
        {/* Today's Highlights Section */}
        <section id="todays-highlights" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                ⭐ TODAY'S HIGHLIGHTS ⭐
              </h2>
              <p className="text-gray-600 mb-4">
                Hand-picked deals that expire at midnight - Don't miss out!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailyDeals.map((deal) => (
                <div key={deal.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-6xl">{deal.image}</span>
                    </div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      🌟 {deal.discount}% OFF
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{deal.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{deal.description}</p>

                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-bold text-green-600">৳{deal.salePrice.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 line-through">৳{deal.originalPrice.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-green-600 font-semibold">💰 Save ৳{deal.savings.toLocaleString()}</p>
                    </div>

                    <div className="mb-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Deal expires in:
                        </span>
                        <span className="font-bold text-green-600">{deal.timeLeft}</span>
                      </div>
                      <div className="text-sm text-orange-600">
                        📦 Only {deal.stock} left today!
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{deal.rating}/5 ({deal.reviews.toLocaleString()} reviews)</span>
                      </div>
                    </div>

                    <div className="mb-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1 mb-1">
                        <Truck className="w-4 h-4" />
                        🚚 FREE delivery today
                      </div>
                      <div>💳 বিকাশ/নগদ/রকেট accepted</div>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        🛒 Add to Cart
                      </Button>
                      <Button variant="outline" size="icon">
                        ❤️
                      </Button>
                    </div>

                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-green-500" />
                      Daily deal guarantee - Valid until midnight
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Limited Time Offers Section */}
        <section id="limited-time-offers" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                ⏰ LIMITED TIME OFFERS ⏰
              </h2>
              <p className="text-gray-600">
                These deals won't last long - Grab them while you can!
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">🔥 Flash Deal Alert! 🔥</h3>
              <p className="text-lg mb-4">
                Get additional 10% OFF on orders above ৳2000
              </p>
              <p className="text-sm mb-4">Use code: DAILY10</p>
              <Button className="bg-white text-red-600 hover:bg-gray-100 font-bold px-6 py-2">
                Shop Now
              </Button>
            </div>
          </div>
        </section>

        {/* Payment Methods Section */}
        <section id="payment-methods" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">💳 Payment Methods</h2>
              <p className="text-gray-600">Choose your preferred payment option</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['bKash', 'Nagad', 'Rocket', 'Cash on Delivery'].map((method, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 text-center border">
                  <div className="text-2xl mb-2">💳</div>
                  <p className="font-semibold">{method}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Delivery Info Section */}
        <section id="delivery-info" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">🚚 Delivery Information</h2>
              <p className="text-gray-600">Fast and reliable delivery across Bangladesh</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="text-3xl mb-4">🚚</div>
                <h3 className="font-bold text-lg mb-2">Same Day Delivery</h3>
                <p className="text-gray-600">Available in Dhaka city</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="text-3xl mb-4">📦</div>
                <h3 className="font-bold text-lg mb-2">Express Delivery</h3>
                <p className="text-gray-600">1-2 days nationwide</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="text-3xl mb-4">🆓</div>
                <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
                <p className="text-gray-600">On orders above ৳1000</p>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section id="customer-reviews" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">⭐ Customer Reviews</h2>
              <p className="text-gray-600">What our customers say about daily deals</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Rahul Ahmed', rating: 5, review: 'Amazing daily deals! Saved so much money.' },
                { name: 'Fatima Khan', rating: 5, review: 'Fresh deals every day. Love the variety!' },
                { name: 'Sabbir Rahman', rating: 4, review: 'Good quality products at great prices.' }
              ].map((review, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold">{review.name}</p>
                      <div className="flex text-yellow-400">
                        {'⭐'.repeat(review.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">"{review.review}"</p>
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

export default DailyDeals;
