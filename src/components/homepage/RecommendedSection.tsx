
import React from 'react';
import { ProductCard } from './ProductCard';
import { Heart, Target } from 'lucide-react';

export const RecommendedSection: React.FC = () => {
  const products = Array(8).fill(null).map((_, index) => ({
    image: `https://images.unsplash.com/photo-${1523275335684 + index * 1500}-d0ca20e4086b?w=400`,
    category: "Recommended",
    title: `Recommended Product ${index + 1} - Perfect for You`,
    originalPrice: `$${(299 + index * 40).toFixed(2)}`,
    salePrice: `$${(199 + index * 35).toFixed(2)}`,
    stockLeft: Math.floor(Math.random() * 15) + 3,
    rating: 4.2 + Math.random() * 0.8,
    reviews: Math.floor(Math.random() * 500) + 100,
    discount: `${Math.floor(Math.random() * 35) + 20}% OFF`,
    badge: "FOR YOU"
  }));

  return (
    <section className="py-8 bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-full">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Recommended for You</h2>
              <p className="text-gray-600">Handpicked based on your interests</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-teal-600 transition-all">
            <Heart className="w-4 h-4" /> More for You
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
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
              onAddToCart={() => console.log(`Added recommended product ${index + 1} to cart`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
