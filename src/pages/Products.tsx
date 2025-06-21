
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/homepage/ProductCard';
import { Star, Gift, Clock, Zap, Heart, ShoppingBag } from 'lucide-react';

const Products: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    minutes: 45,
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

  const eidProducts = [
    {
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      category: "Fashion",
      title: "Traditional Eid Kurta Collection",
      originalPrice: "৳4,999",
      salePrice: "৳2,999",
      stockLeft: 8,
      rating: 4.8,
      reviews: 156,
      discount: "40% OFF"
    },
    {
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
      category: "Jewelry",
      title: "Golden Eid Jewelry Set",
      originalPrice: "৳8,999",
      salePrice: "৳5,999",
      stockLeft: 3,
      rating: 4.9,
      reviews: 89,
      discount: "33% OFF"
    },
    {
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
      category: "Footwear",
      title: "Premium Eid Formal Shoes",
      originalPrice: "৳6,999",
      salePrice: "৳4,199",
      stockLeft: 12,
      rating: 4.7,
      reviews: 234,
      discount: "40% OFF"
    },
    {
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
      category: "Electronics",
      title: "Eid Special Smartphone Deal",
      originalPrice: "৳45,999",
      salePrice: "৳32,999",
      stockLeft: 5,
      rating: 4.6,
      reviews: 445,
      discount: "28% OFF"
    },
    {
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      category: "Audio",
      title: "Eid Gift Headphones",
      originalPrice: "৳12,999",
      salePrice: "৳7,999",
      stockLeft: 15,
      rating: 4.5,
      reviews: 178,
      discount: "38% OFF"
    },
    {
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop",
      category: "Home",
      title: "Eid Decoration Lights Set",
      originalPrice: "৳3,999",
      salePrice: "৳2,399",
      stockLeft: 20,
      rating: 4.4,
      reviews: 112,
      discount: "40% OFF"
    }
  ];

  const categories = [
    { name: "Traditional Wear", icon: "👘", discount: "Up to 50% OFF" },
    { name: "Jewelry & Accessories", icon: "💍", discount: "Up to 45% OFF" },
    { name: "Footwear", icon: "👞", discount: "Up to 40% OFF" },
    { name: "Electronics", icon: "📱", discount: "Up to 35% OFF" },
    { name: "Home Decor", icon: "🏠", discount: "Up to 60% OFF" },
    { name: "Gifts & Sweets", icon: "🎁", discount: "Up to 30% OFF" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-16 -translate-y-16 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full transform translate-x-12 translate-y-12 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center text-white relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="w-12 h-12 text-yellow-300" />
            <h1 className="text-4xl md:text-6xl font-bold">Eid Mubarak Sale</h1>
            <Gift className="w-12 h-12 text-yellow-300" />
          </div>
          <p className="text-xl md:text-2xl mb-6 opacity-90">
            🌙 Celebrate Eid with Amazing Offers & Discounts 🌙
          </p>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
              <Clock className="w-6 h-6" />
              Eid Sale Ends In:
            </h3>
            <div className="flex justify-center gap-4">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-white bg-opacity-30 rounded-xl p-4 min-w-[80px] border-2 border-yellow-300">
                  <div className="text-3xl font-bold text-yellow-200">{value.toString().padStart(2, '0')}</div>
                  <div className="text-sm uppercase text-yellow-100">{unit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            🎉 Eid Special Categories 🎉
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-yellow-200 hover:border-green-400">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{category.name}</h3>
                  <div className="bg-gradient-to-r from-green-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {category.discount}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals */}
      <section className="py-12 bg-gradient-to-r from-red-100 to-yellow-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-yellow-500" />
              ⚡ Eid Flash Deals ⚡
              <Zap className="w-8 h-8 text-yellow-500" />
            </h2>
            <p className="text-lg text-gray-600">Limited time offers - Grab them before they're gone!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eidProducts.map((product, index) => (
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
                onAddToCart={() => console.log(`Added Eid product ${index + 1} to cart`)}
              />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold px-8 py-4 text-lg">
              <ShoppingBag className="w-5 h-5 mr-2" />
              View All Eid Offers
            </Button>
          </div>
        </div>
      </section>

      {/* Special Banners */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">🎁 Eid Gift Hampers</h3>
                <p className="text-lg mb-6 opacity-90">
                  Special curated gift sets for your loved ones
                </p>
                <div className="bg-white text-purple-600 px-4 py-2 rounded-full inline-block font-bold mb-4">
                  Starting from ৳1,999
                </div>
                <Button variant="secondary" className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Shop Gift Hampers
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500 to-teal-500 text-white overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">🚚 Free Delivery</h3>
                <p className="text-lg mb-6 opacity-90">
                  Free nationwide delivery on Eid orders above ৳2,000
                </p>
                <div className="bg-white text-blue-600 px-4 py-2 rounded-full inline-block font-bold mb-4">
                  Save up to ৳200
                </div>
                <Button variant="secondary" className="w-full">
                  <Star className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
