
import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Zap, Clock, Fire } from 'lucide-react';

export const MegaSaleSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 30,
    seconds: 45
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
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const products = Array(12).fill(null).map((_, index) => ({
    image: `https://images.unsplash.com/photo-${1523275335684 + index * 3000}-d0ca20e4086b?w=400`,
    category: "Mega Sale",
    title: `Mega Sale Product ${index + 1} - Huge Discount`,
    originalPrice: `$${(499 + index * 60).toFixed(2)}`,
    salePrice: `$${(199 + index * 25).toFixed(2)}`,
    stockLeft: Math.floor(Math.random() * 5) + 1,
    rating: 4.3 + Math.random() * 0.7,
    reviews: Math.floor(Math.random() * 800) + 150,
    discount: `${Math.floor(Math.random() * 50) + 40}% OFF`,
    badge: "MEGA SALE"
  }));

  return (
    <section className="py-8 bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Fire className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">MEGA SALE</h2>
                <p className="opacity-90 text-lg">Up to 70% OFF - Limited Time Only!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <span className="text-lg font-semibold">Ends in:</span>
              <div className="flex gap-2">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[60px]">
                    <div className="text-2xl font-bold">{value.toString().padStart(2, '0')}</div>
                    <div className="text-xs uppercase">{unit.slice(0, 3)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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
              badge={product.badge}
              isFlashSale={true}
              onAddToCart={() => console.log(`Added mega sale product ${index + 1} to cart`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
