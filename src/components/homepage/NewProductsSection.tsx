
import React from 'react';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export const NewProductsSection: React.FC = () => {
  const products = Array(8).fill(null).map((_, index) => ({
    image: `https://images.unsplash.com/photo-${1523275335684 + index * 1000}-d0ca20e4086b?w=400`,
    category: "Electronics",
    title: `New Product ${index + 1} - Latest Release`,
    originalPrice: `$${(199 + index * 30).toFixed(2)}`,
    salePrice: `$${(149 + index * 25).toFixed(2)}`,
    stockLeft: Math.floor(Math.random() * 20) + 5,
    rating: 4 + Math.random(),
    reviews: Math.floor(Math.random() * 300) + 50,
    discount: `${Math.floor(Math.random() * 30) + 15}% OFF`,
    badge: "NEW"
  }));

  return (
    <section className="py-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">New Products</h2>
              <p className="text-gray-600">Fresh arrivals just for you</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all">
            View All <ArrowRight className="w-4 h-4" />
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
              onAddToCart={() => console.log(`Added new product ${index + 1} to cart`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
