
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/homepage/ProductCard';
import { Star, Gift, Clock, Zap, Heart, ShoppingBag, Phone, MessageCircle, Users, Award, Truck, Globe, DollarSign, Camera, Target, Crown, Sparkles, Flame, CheckCircle, ArrowRight } from 'lucide-react';

const Products: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 25,
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
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashDeals = [
    {
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
      title: "Samsung Galaxy A54",
      originalPrice: "৳45,999",
      salePrice: "৳32,199",
      discount: "30% OFF",
      freeItem: "FREE Earbuds",
      delivery: "Same Day Delivery",
      rating: 4.8,
      reviews: 1200,
      timeLeft: "2:15:30",
      stockLeft: 50
    },
    {
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
      title: "Women's Designer Kurti",
      originalPrice: "৳2,999",
      salePrice: "৳1,499",
      discount: "50% OFF",
      freeItem: "FREE Dupatta",
      delivery: "Express Shipping",
      rating: 4.9,
      reviews: 850,
      timeLeft: "2:15:30",
      stockLeft: 50
    },
    {
      image: "https://images.unsplash.com/photo-1556909114-4f5c28b9c888?w=300&h=300&fit=crop",
      title: "Air Fryer 5L",
      originalPrice: "৳12,999",
      salePrice: "৳7,799",
      discount: "40% OFF",
      freeItem: "Recipe Book FREE",
      delivery: "2 Year Warranty",
      rating: 4.7,
      reviews: 950,
      timeLeft: "2:15:30",
      stockLeft: 50
    },
    {
      image: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=300&h=300&fit=crop",
      title: "Premium Beef Package",
      originalPrice: "৳3,500",
      salePrice: "৳2,800",
      discount: "20% OFF",
      freeItem: "2KG Fresh Cut",
      delivery: "Cold Chain Delivery",
      rating: 4.6,
      reviews: 1100,
      timeLeft: "2:15:30",
      stockLeft: 50
    }
  ];

  const categories = [
    { 
      name: "EID Fashion Collection", 
      icon: "👗", 
      subcategories: ["Women's Collection", "Men's Collection", "Kids Collection", "Footwear"],
      discount: "Up to 50% OFF",
      color: "bg-gradient-to-br from-pink-500 to-red-500"
    },
    { 
      name: "Home & Decor", 
      icon: "🏠", 
      subcategories: ["Furniture", "Kitchen & Dining", "Decoration", "Cleaning"],
      discount: "Up to 60% OFF",
      color: "bg-gradient-to-br from-blue-500 to-teal-500"
    },
    { 
      name: "EID Food & Treats", 
      icon: "🍖", 
      subcategories: ["Fresh Meat", "Sweets & Desserts", "Rice & Grains", "Spices"],
      discount: "Up to 40% OFF",
      color: "bg-gradient-to-br from-green-500 to-yellow-500"
    },
    { 
      name: "Gifts & Electronics", 
      icon: "🎁", 
      subcategories: ["Smartphones", "Gift Items", "Home Appliances", "Beauty Care"],
      discount: "Up to 70% OFF",
      color: "bg-gradient-to-br from-purple-500 to-pink-500"
    }
  ];

  const bundleOffers = [
    {
      title: "FAMILY EID PACKAGE",
      description: "Complete Family Outfit Set",
      items: ["Men's Punjabi + Pajama", "Women's Salwar Kameez", "2 Kids' EID Outfits", "Matching Accessories"],
      originalPrice: 8500,
      bundlePrice: 5100,
      savings: 40,
      freeBonus: "FREE Family Photo Session Voucher"
    },
    {
      title: "EID HOME MAKEOVER COMBO",
      description: "Transform Your Home for EID",
      items: ["Living Room Sofa Set", "Dining Table with 6 Chairs", "Islamic Wall Art Collection", "Decorative Lighting Set"],
      originalPrice: 65000,
      bundlePrice: 42250,
      savings: 35,
      freeBonus: "FREE Assembly & Installation"
    },
    {
      title: "EID FEAST PACKAGE",
      description: "Complete EID Dinner for 10 People",
      items: ["2KG Premium Beef", "1KG Mutton", "2KG Basmati Rice", "Complete Spice Set"],
      originalPrice: 7800,
      bundlePrice: 5850,
      savings: 25,
      freeBonus: "FREE Recipe Collection App"
    }
  ];

  const featuredVendors = [
    { name: "Aarong Fashion House", rating: 4.9, reviews: 5000, specialty: "Traditional & Modern", badge: "🥇" },
    { name: "Rang Bangladesh", rating: 4.8, reviews: 3200, specialty: "Modest Islamic Wear", badge: "🥇" },
    { name: "TechLand BD", rating: 4.8, reviews: 8500, specialty: "Latest Electronics", badge: "📱" },
    { name: "Fresh Food BD", rating: 4.9, reviews: 12000, specialty: "Premium Meat & Groceries", badge: "🍖" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-16 -translate-y-16 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full transform translate-x-12 translate-y-12 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full animate-pulse delay-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center text-white relative z-10">
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              🌙 ঈদ মুবারক! EID MUBARAK! 🌟
            </h1>
            <p className="text-2xl md:text-4xl mb-6 font-bold text-yellow-300">
              🎉 সবচেয়ে বড় ঈদ অফার Bangladesh's Biggest EID Sale 🎉
            </p>
            <div className="text-3xl md:text-5xl font-bold text-yellow-400 mb-6">
              ✨ UP TO 70% OFF ✨
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-lg">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-yellow-300">
              💰 Extra ৳500 Cashback with bKash/Nagad
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-yellow-300">
              🚚 FREE Delivery on Orders Above ৳1000
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-yellow-300">
              🎁 Special EID Gift Wrapping Available
            </div>
          </div>

          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
              <Clock className="w-6 h-6" />
              ⏰ ENDS IN:
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold px-8 py-4 text-lg">
              <ShoppingBag className="w-5 h-5 mr-2" />
              🛒 Shop EID Collection
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-800 font-bold px-8 py-4 text-lg">
              <Gift className="w-5 h-5 mr-2" />
              🎁 EID Gift Guide
            </Button>
          </div>

          <p className="text-lg opacity-90">
            🎯 From 5000+ Verified Vendors Across Bangladesh
          </p>
        </div>
      </section>

      {/* Festival Greeting */}
      <section className="py-12 bg-gradient-to-r from-teal-100 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🤲 ঈদুল ফিতর এর শুভেচ্ছা 🤲
          </h2>
          <p className="text-xl text-gray-600 mb-6 italic">
            "May this blessed occasion bring peace, happiness, and prosperity to you and your loved ones"
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-lg font-semibold">
            <div className="flex items-center gap-2">💚 PEACE</div>
            <div className="flex items-center gap-2">🤝 UNITY</div>
            <div className="flex items-center gap-2">🎁 GIVING</div>
            <div className="flex items-center gap-2">✨ CELEBRATION</div>
          </div>
          <p className="text-lg text-gray-600 mt-4">
            🇧🇩 Celebrating with 2 Million+ Bangladeshi Families
          </p>
        </div>
      </section>

      {/* EID Shopping Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            🛍️ EID Special Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className={`${category.color} text-white transform hover:scale-105 transition-all duration-300 border-none shadow-xl`}>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{category.icon}</div>
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <div className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-bold mt-2">
                      {category.discount}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {category.subcategories.map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" className="w-full mt-4 text-gray-800 font-bold">
                    Shop Collection
                  </Button>
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
              <Flame className="w-8 h-8 text-red-500" />
              ⚡ আজকের বিশেষ অফার ⚡
              <Flame className="w-8 h-8 text-red-500" />
            </h2>
            <p className="text-lg text-gray-600">⏰ Limited Time Flash Deals ⏰</p>
            <div className="bg-red-500 text-white px-4 py-2 rounded-full inline-block font-bold mt-2">
              🔥 ENDING IN: 2:15:30 - Don't Miss Out!
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashDeals.map((product, index) => (
              <Card key={index} className="transform hover:scale-105 transition-all duration-300 border-2 border-red-200 hover:border-red-400 shadow-lg">
                <CardContent className="p-4">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">{product.title}</h3>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-gray-400 line-through text-sm">{product.originalPrice}</span>
                      <span className="text-lg font-bold text-green-600 ml-2">{product.salePrice}</span>
                    </div>
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      {product.discount}
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <div>📦 {product.freeItem}</div>
                    <div>🚚 {product.delivery}</div>
                    <div>⭐ {product.rating}/5 ({product.reviews.toLocaleString()} reviews)</div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold">
                    🛒 Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 mb-4">🎯 Only 50 pieces left each! | 🔥 Free shipping all items</p>
          </div>
        </div>
      </section>

      {/* Bundle Offers */}
      <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            🎁 EID COMBO DEALS - সেট অফার 🎁
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {bundleOffers.map((bundle, index) => (
              <Card key={index} className="transform hover:scale-105 transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 shadow-xl">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      👨‍👩‍👧‍👦 {bundle.title}
                    </h3>
                    <p className="text-gray-600 font-semibold">{bundle.description}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {bundle.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>• {item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">💰 Individual Price:</span>
                      <span className="font-bold">৳{bundle.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-green-600 font-bold">🎊 Bundle Price:</span>
                      <span className="text-xl font-bold text-green-600">৳{bundle.bundlePrice.toLocaleString()}</span>
                    </div>
                    <div className="text-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        ({bundle.savings}% SAVINGS!)
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="text-green-600 font-semibold text-sm">
                      🎁 {bundle.freeBonus}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold">
                      🛒 Get Package
                    </Button>
                    <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-50">
                      📱 Customize
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Offers */}
      <section className="py-12 bg-gradient-to-r from-blue-100 to-green-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            💰 EID Payment Bonuses - পেমেন্ট অফার
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-pink-500 to-red-500 text-white border-none shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">📱 bKash EID Special</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div>💸 Extra 8% Cashback (Up to ৳800)</div>
                  <div>🎁 Instant ৳200 bonus on first payment</div>
                  <div>🔄 0% transaction fee for all EID purchases</div>
                  <div>💰 Double rewards points until EID</div>
                </div>
                <Button variant="secondary" className="w-full text-pink-600 font-bold">
                  💳 Pay with bKash
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white border-none shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">📱 Nagad Mega Offer</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div>💸 Up to 10% Cashback (Maximum ৳1,000)</div>
                  <div>🎊 Special EID scratch cards</div>
                  <div>🎁 Win EID gifts worth up to ৳10,000</div>
                  <div>🏆 Lucky draw for Hajj trip (2 winners)</div>
                </div>
                <Button variant="secondary" className="w-full text-orange-600 font-bold">
                  💳 Pay with Nagad
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-blue-500 text-white border-none shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">📱 Rocket Power Offer</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div>💸 6% Instant Cashback (Up to ৳600)</div>
                  <div>🎁 Free mobile recharge vouchers</div>
                  <div>💰 No minimum purchase requirement</div>
                  <div>🔐 Extra security with PIN + OTP</div>
                </div>
                <Button variant="secondary" className="w-full text-purple-600 font-bold">
                  💳 Pay with Rocket
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Delivery Promise */}
      <section className="py-12 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            🎯 EID DELIVERY GUARANTEE - ডেলিভারি গ্যারান্টি
          </h2>
          
          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-green-600 mb-4">
              📅 ORDER TODAY, GET BEFORE EID! 📅
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 border-green-200 hover:border-green-400 transform hover:scale-105 transition-all">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🚚</div>
                <h3 className="font-bold text-gray-800 mb-2">Same Day Delivery</h3>
                <p className="text-sm text-gray-600 mb-2">(Dhaka Metro)</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>⏰ Order before 3 PM → Deliver by 8 PM</div>
                  <div>💰 FREE on orders above ৳1,500</div>
                  <div>📱 Real-time tracking</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 hover:border-blue-400 transform hover:scale-105 transition-all">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🚛</div>
                <h3 className="font-bold text-gray-800 mb-2">Express Delivery</h3>
                <p className="text-sm text-gray-600 mb-2">(Major Cities)</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>📦 Next day delivery</div>
                  <div>💰 ৳80 (FREE above ৳2,000)</div>
                  <div>🔒 Insured delivery</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 hover:border-purple-400 transform hover:scale-105 transition-all">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🏢</div>
                <h3 className="font-bold text-gray-800 mb-2">Pickup Points</h3>
                <p className="text-sm text-gray-600 mb-2">(Nationwide)</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>📍 50+ Pickup locations</div>
                  <div>💰 FREE pickup service</div>
                  <div>🕐 Extended EID hours</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 hover:border-red-400 transform hover:scale-105 transition-all">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-bold text-gray-800 mb-2">Emergency Delivery</h3>
                <p className="text-sm text-gray-600 mb-2">(2-hour guarantee)</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>🚁 Drone delivery available</div>
                  <div>💰 ৳300 flat rate</div>
                  <div>📞 24/7 hotline: 16263</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="py-12 bg-gradient-to-r from-yellow-100 to-orange-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            🏆 EID Featured Vendors - টপ বিক্রেতা
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVendors.map((vendor, index) => (
              <Card key={index} className="border-2 border-yellow-200 hover:border-yellow-400 transform hover:scale-105 transition-all shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">{vendor.badge}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{vendor.name}</h3>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{vendor.rating}/5</span>
                    <span className="text-gray-500 text-sm">({vendor.reviews.toLocaleString()}+ reviews)</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">🎯 {vendor.specialty}</p>
                  <Button variant="outline" className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50">
                    🛍️ Shop Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Support */}
      <section className="py-12 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            🤝 EID Customer Support - গ্রাহক সেবা
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-500 to-teal-500 text-white border-none shadow-xl">
              <CardContent className="p-6 text-center">
                <Phone className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">📞 24/7 EID Helpline</h3>
                <div className="text-2xl font-bold mb-2">16263</div>
                <p className="text-sm mb-4">Call FREE from any operator</p>
                <div className="text-xs space-y-1">
                  <div>🕐 24/7 support until EID</div>
                  <div>🗣️ বাংলা & English support</div>
                  <div>🚚 Emergency delivery support</div>
                </div>
                <Button variant="secondary" className="w-full mt-4 text-green-600 font-bold">
                  📞 Call Now
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-purple-500 text-white border-none shadow-xl">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">💬 Live Chat & Messaging</h3>
                <div className="text-xs space-y-2 mb-4">
                  <div>💬 Instant response (under 30 seconds)</div>
                  <div>📱 WhatsApp: +880-1600-GetIt</div>
                  <div>📧 eid-support@getit.com.bd</div>
                  <div>🔄 2-hour response guarantee</div>
                </div>
                <Button variant="secondary" className="w-full text-blue-600 font-bold">
                  💬 Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-none shadow-xl">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">🎯 Specialized EID Services</h3>
                <div className="text-xs space-y-2 mb-4">
                  <div>👗 Personal Shopping Assistant</div>
                  <div>🎁 Gift Concierge Service</div>
                  <div>🏠 Home Makeover Consultation</div>
                  <div>🍽️ EID Menu Planning</div>
                </div>
                <Button variant="secondary" className="w-full text-purple-600 font-bold">
                  🎯 Get Expert Help
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
