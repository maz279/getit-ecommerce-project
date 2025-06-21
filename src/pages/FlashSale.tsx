import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { Zap, Clock, Flame, ShoppingCart } from 'lucide-react';

const FlashSale: React.FC = () => {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Zap className="w-8 h-8" />
              <Flame className="w-8 h-8" />
              <Zap className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Flash Sale</h1>
            <p className="text-xl mb-8">Limited time offers - Up to 80% off!</p>
            
            {/* Countdown */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <Clock className="w-6 h-6" />
              <span className="text-lg font-semibold">Sale ends in:</span>
              <div className="flex gap-2">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 text-center min-w-[60px]">
                  <div className="text-2xl font-bold">02</div>
                  <div className="text-xs uppercase">Hours</div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 text-center min-w-[60px]">
                  <div className="text-2xl font-bold">34</div>
                  <div className="text-xs uppercase">Minutes</div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 text-center min-w-[60px]">
                  <div className="text-2xl font-bold">56</div>
                  <div className="text-xs uppercase">Seconds</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flash Sale Products */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Lightning Deals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-red-200 relative">
                  {/* Sale Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{Math.floor(Math.random() * 60 + 20)}%
                    </div>
                  </div>
                  
                  {/* Stock indicator */}
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {Math.floor(Math.random() * 20 + 5)} left
                    </div>
                  </div>
                  
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Flash Sale Item {index + 1}</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold text-red-500">৳{(299 + index * 50).toLocaleString()}</span>
                      <span className="text-sm text-gray-500 line-through">৳{(999 + index * 100).toLocaleString()}</span>
                    </div>
                    
                    {/* Progress bar for stock */}
                    <div className="mb-3">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${Math.floor(Math.random() * 70 + 10)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Selling fast!</div>
                    </div>
                    
                    <button className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flash Sale Categories */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Flash Sale Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                'Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports', 'Books',
                'Toys', 'Automotive', 'Health', 'Groceries', 'Jewelry', 'Travel'
              ].map((category, index) => (
                <div key={category} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-sm">{category}</h3>
                  <p className="text-xs text-red-500 mt-1">Up to 80% off</p>
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

export default FlashSale;
