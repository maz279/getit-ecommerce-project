
import React from 'react';
import { ProductCard } from './ProductCard';
import { TrendingUp, Award } from 'lucide-react';

export const TopSellingSection: React.FC = () => {
  const products = Array(20).fill(null).map((_, index) => ({
    image: `https://images.unsplash.com/photo-${1523275335684 + index * 1500}-d0ca20e4086b?w=400`,
    category: "Best Seller",
    title: `Top Selling Product ${index + 1} - Customer Favorite`,
    originalPrice: `৳${((299 + index * 40) * 120).toFixed(0)}`,
    salePrice: `৳${((199 + index * 35) * 120).toFixed(0)}`,
    stockLeft: Math.floor(Math.random() * 15) + 3,
    rating: 4.2 + Math.random() * 0.8,
    reviews: Math.floor(Math.random() * 500) + 100,
    discount: `${Math.floor(Math.random() * 35) + 20}% OFF`,
    badge: "#1 SELLER"
  }));

  return (
    <section className="py-8 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Top Selling Products</h2>
              <p className="text-gray-600">Most loved by our customers</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all">
            <TrendingUp className="w-4 h-4" /> View Rankings
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
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
              isCompact={true}
              onAddToCart={() => console.log(`Added top selling product ${index + 1} to cart`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
