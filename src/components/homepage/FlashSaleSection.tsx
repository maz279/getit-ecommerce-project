
import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

export const FlashSaleSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 23,
    minutes: 15,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const products = Array(12).fill(null).map((_, index) => ({
    image: `https://images.unsplash.com/photo-${1523275335684 + index * 1000}-d0ca20e4086b?w=400`,
    category: "Electronics",
    title: `Premium Product ${index + 1} - High Quality Item`,
    originalPrice: `$${(299 + index * 50).toFixed(2)}`,
    salePrice: `$${(199 + index * 30).toFixed(2)}`,
    stockLeft: Math.floor(Math.random() * 10) + 1,
    rating: 4 + Math.random(),
    reviews: Math.floor(Math.random() * 500) + 50,
    discount: `${Math.floor(Math.random() * 40) + 20}% OFF`,
    isFlashSale: true
  }));

  return (
    <section className="py-8 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 mb-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Flash Sale</h2>
                <p className="opacity-90">Limited time offers - Don't miss out!</p>
              </div>
            </div>
            
            {/* Countdown Timer */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Ends in:</span>
              <div className="flex gap-2">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 text-center min-w-[50px]">
                    <div className="text-xl font-bold">{value.toString().padStart(2, '0')}</div>
                    <div className="text-xs uppercase">{unit.slice(0, 3)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                image={product.image}
                category={product.category}
                title={product.title}
                originalPrice={product.originalPrice}
                salePrice={product.salePrice}
                stockLeft={product.stockLeft}
                rating={product.rating}
                reviews={product.reviews}
                discount={product.discount}
                isFlashSale={product.isFlashSale}
                onAddToCart={() => console.log(`Added flash sale product ${index + 1} to cart`)}
              />
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all">
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold px-8 py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg">
            View All Flash Sale Items
          </button>
        </div>
      </div>
    </section>
  );
};
