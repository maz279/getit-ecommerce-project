import React from 'react';
import { Calendar, Gift, Star, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/homepage/ProductCard';

export const FestivalSales: React.FC = () => {
  const festivals = [
    {
      id: 'eid',
      name: 'Eid Mubarak Sale',
      nameBn: 'ঈদ মুবারক সেল',
      description: 'Celebrate Eid with amazing discounts up to 70% OFF',
      startDate: '2024-04-10',
      endDate: '2024-04-15',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      discount: '70% OFF',
      theme: 'from-green-500 to-emerald-600',
      icon: '🌙'
    },
    {
      id: 'pohela-boishakh',
      name: 'Pohela Boishakh Festival',
      nameBn: 'পহেলা বৈশাখ উৎসব',
      description: 'Welcome Bengali New Year with traditional offers',
      startDate: '2024-04-14',
      endDate: '2024-04-16',
      image: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=800&h=400&fit=crop',
      discount: 'Special Deals',
      theme: 'from-red-500 to-yellow-500',
      icon: '🎊'
    },
    {
      id: 'durga-puja',
      name: 'Durga Puja Special',
      nameBn: 'দুর্গা পূজা বিশেষ',
      description: 'Divine discounts for the festive season',
      startDate: '2024-10-09',
      endDate: '2024-10-13',
      image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=400&fit=crop',
      discount: 'Mega Sale',
      theme: 'from-purple-500 to-pink-600',
      icon: '🪔'
    }
  ];

  const featuredProducts = [
    {
      id: 'festival-1',
      image: "https://images.unsplash.com/photo-1583743814966-8936f37f8823?w=300&h=300&fit=crop",
      category: "Fashion",
      title: "Traditional Punjabi Set",
      originalPrice: "৳4,500",
      salePrice: "৳2,700",
      stockLeft: 12,
      rating: 4.8,
      reviews: 156,
      discount: "40% OFF",
      badge: "FESTIVAL"
    },
    {
      id: 'festival-2',
      image: "https://images.unsplash.com/photo-1594736797933-d0d9523e7621?w=300&h=300&fit=crop",
      category: "Jewelry",
      title: "Gold Plated Necklace Set",
      originalPrice: "৳8,999",
      salePrice: "৳5,399",
      stockLeft: 8,
      rating: 4.7,
      reviews: 89,
      discount: "40% OFF",
      badge: "FESTIVAL"
    },
    {
      id: 'festival-3',
      image: "https://images.unsplash.com/photo-1571019613540-996a8c044e55?w=300&h=300&fit=crop",
      category: "Home",
      title: "Decorative Lights Set",
      originalPrice: "৳2,200",
      salePrice: "৳1,320",
      stockLeft: 15,
      rating: 4.6,
      reviews: 234,
      discount: "40% OFF",
      badge: "FESTIVAL"
    }
  ];

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const distance = end - now;

    if (distance < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Festival Sales
            </h1>
            <Sparkles className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-xl text-muted-foreground mb-8">
            Celebrate every occasion with unbeatable deals and festive offers
          </p>
          <div className="text-lg text-orange-600 font-semibold">
            🎉 উৎসব ও পর্বের বিশেষ ছাড় 🎉
          </div>
        </div>
      </section>

      {/* Active Festivals */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Active Festivals</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {festivals.map((festival) => {
              const timeRemaining = getTimeRemaining(festival.endDate);
              return (
                <Card key={festival.id} className="overflow-hidden">
                  <div className={`h-48 bg-gradient-to-r ${festival.theme} relative`}>
                    <img 
                      src={festival.image} 
                      alt={festival.name}
                      className="w-full h-full object-cover mix-blend-overlay"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="text-4xl">{festival.icon}</span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-white/20 text-white border-white/30">
                        {festival.discount}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{festival.name}</h3>
                    <p className="text-lg text-orange-600 mb-2">{festival.nameBn}</p>
                    <p className="text-muted-foreground mb-4">{festival.description}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm">
                        {festival.startDate} - {festival.endDate}
                      </span>
                    </div>

                    {/* Countdown Timer */}
                    <div className="bg-red-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-semibold text-red-600">Ends In:</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-red-600 text-white rounded p-2">
                          <div className="font-bold">{timeRemaining.days}</div>
                          <div className="text-xs">Days</div>
                        </div>
                        <div className="bg-red-600 text-white rounded p-2">
                          <div className="font-bold">{timeRemaining.hours}</div>
                          <div className="text-xs">Hours</div>
                        </div>
                        <div className="bg-red-600 text-white rounded p-2">
                          <div className="font-bold">{timeRemaining.minutes}</div>
                          <div className="text-xs">Mins</div>
                        </div>
                        <div className="bg-red-600 text-white rounded p-2">
                          <div className="font-bold">{timeRemaining.seconds}</div>
                          <div className="text-xs">Secs</div>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full">
                      <Gift className="w-4 h-4 mr-2" />
                      Shop Festival Deals
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Festival Products */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Festival Special Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
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
                onAddToCart={() => console.log(`Added ${product.title} to cart`)}
                onClick={() => console.log(`View ${product.title}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Festival Categories */}
      <section className="py-8 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Festival Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Traditional Wear', icon: '👘', color: 'from-purple-500 to-pink-500' },
              { name: 'Jewelry & Accessories', icon: '💎', color: 'from-yellow-500 to-orange-500' },
              { name: 'Home Decoration', icon: '🏮', color: 'from-red-500 to-pink-500' },
              { name: 'Gift Items', icon: '🎁', color: 'from-green-500 to-blue-500' },
              { name: 'Sweets & Treats', icon: '🍬', color: 'from-orange-500 to-red-500' },
              { name: 'Religious Items', icon: '🕯️', color: 'from-indigo-500 to-purple-500' },
              { name: 'Party Supplies', icon: '🎉', color: 'from-pink-500 to-red-500' },
              { name: 'Electronics', icon: '📱', color: 'from-blue-500 to-indigo-500' }
            ].map((category) => (
              <Card key={category.name} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Never Miss a Festival Sale!</h2>
          <p className="text-xl mb-8">Get notified about upcoming festivals and exclusive deals</p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <Button className="bg-white text-orange-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};