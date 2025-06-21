import React, { useState, useEffect } from 'react';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/homepage/ProductCard';
import { Star, Gift, Clock, Zap, Heart, ShoppingBag, Phone, MessageCircle, Users, Award, Truck, Globe, DollarSign, Camera, Target, Crown, Sparkles, Flame, CheckCircle, ArrowRight, Eye, Plus, Smartphone, Bot, MapPin, Bell, BarChart3, Download, Mic } from 'lucide-react';

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
      subcategories: [
        "Women's Collection - Salwar Kameez (50% OFF)",
        "Men's Collection - Punjabi (40% OFF)", 
        "Kids Collection - Cute EID Outfits",
        "Footwear - Formal Shoes & Sandals"
      ],
      discount: "Up to 50% OFF",
      color: "bg-gradient-to-br from-pink-500 to-red-500",
      topPicks: "Exclusive designer collections from premium Bangladesh fashion brands"
    },
    { 
      name: "Home & Decor", 
      icon: "🏠", 
      subcategories: [
        "Furniture - Sofas & Dining Tables",
        "Kitchen & Dining - Dinner Sets & Cookware", 
        "Decoration - Islamic Calligraphy & Wall Arts",
        "Cleaning - Storage & Organization"
      ],
      discount: "Up to 60% OFF",
      color: "bg-gradient-to-br from-blue-500 to-teal-500",
      topPicks: "Islamic home decor from local artisans"
    },
    { 
      name: "EID Food & Treats", 
      icon: "🍖", 
      subcategories: [
        "Fresh Meat - Premium Beef & Mutton",
        "Sweets & Desserts - Traditional Mishti", 
        "Rice & Grains - Premium Basmati Rice",
        "Spices - Complete Spice Sets"
      ],
      discount: "Up to 40% OFF",
      color: "bg-gradient-to-br from-green-500 to-yellow-500",
      topPicks: "EID FEAST PACKAGES: Complete meal solutions for 5, 10, 15+ people"
    },
    { 
      name: "Gifts & Electronics", 
      icon: "🎁", 
      subcategories: [
        "Smartphones - Latest iPhone & Samsung",
        "Gift Items - Perfumes & Islamic Books", 
        "Home Appliances - AC & Refrigerators",
        "Beauty Care - Skincare & Cosmetics"
      ],
      discount: "Up to 70% OFF",
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      topPicks: "BUNDLE DEALS: Phone + Accessories combos with extended warranties"
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
      items: ["Living Room Sofa Set", "Dining Table with 6 Chairs", "Islamic Wall Art Collection", "Decorative Lighting Set", "Premium Curtains & Cushions"],
      originalPrice: 65000,
      bundlePrice: 42250,
      savings: 35,
      freeBonus: "FREE Assembly & Installation + EID Delivery Guarantee"
    },
    {
      title: "EID FEAST PACKAGE",
      description: "Complete EID Dinner for 10 People",
      items: ["2KG Premium Beef (Fresh Cut)", "1KG Mutton (Goat)", "2KG Basmati Rice", "Complete Spice Set", "Traditional Sweets (1KG)", "Fruits & Dry Nuts"],
      originalPrice: 7800,
      bundlePrice: 5850,
      savings: 25,
      freeBonus: "FREE Recipe Collection App + Chef Consultation Call"
    }
  ];

  const featuredVendors = [
    { name: "Aarong Fashion House", rating: 4.9, reviews: 5000, specialty: "Traditional & Modern", badge: "🥇", discount: "Up to 60% EID Discount" },
    { name: "Rang Bangladesh", rating: 4.8, reviews: 3200, specialty: "Modest Islamic Wear", badge: "🥇", discount: "Buy 2 Get 1 FREE" },
    { name: "TechLand BD", rating: 4.8, reviews: 8500, specialty: "Latest Electronics", badge: "📱", discount: "Flash Sale: 50% OFF + 2 Year Warranty" },
    { name: "Fresh Food BD", rating: 4.9, reviews: 12000, specialty: "Premium Meat & Groceries", badge: "🍖", discount: "EID Feast Packages + Halal Certified" },
    { name: "HomeStyle Bangladesh", rating: 4.7, reviews: 4100, specialty: "Furniture & Decor", badge: "🏠", discount: "Home Makeover Packages + Interest-Free EMI" },
    { name: "Ecstasy Fashion", rating: 4.7, reviews: 2800, specialty: "Premium Men's Wear", badge: "👔", discount: "Flat 40% OFF Everything + Express Tailoring" },
    { name: "Bengal Handicrafts", rating: 4.6, reviews: 1500, specialty: "Authentic Bengali Art", badge: "🎨", discount: "Support Local Artisans + Custom Islamic Calligraphy" },
    { name: "Gift Corner BD", rating: 4.6, reviews: 2700, specialty: "Unique Gift Items", badge: "🎁", discount: "Bundle Gift Offers + Custom Gift Wrapping" }
  ];

  const giftGuide = [
    {
      recipient: "For Father",
      items: ["Latest Smartphone", "Premium Watch", "Formal Shirt Collection", "Islamic Books", "Prayer Mat & Tasbeeh"],
      priceRange: "৳2,000 - ৳25,000",
      icon: "👨"
    },
    {
      recipient: "For Mother",
      items: ["Gold Jewelry Set", "Designer Saree", "Branded Handbag", "Premium Skincare", "Perfume Collection"],
      priceRange: "৳1,500 - ৳20,000",
      icon: "👩"
    },
    {
      recipient: "For Son",
      items: ["Gaming Console & Games", "Smartphone/Tablet", "Sports Equipment", "Trendy Clothing", "Headphones & Gadgets"],
      priceRange: "৳1,000 - ৳15,000",
      icon: "👦"
    },
    {
      recipient: "For Daughter",
      items: ["Makeup & Beauty Kit", "Trendy Outfit Set", "Books & Stationery", "Art & Craft Supplies", "Jewelry Collection"],
      priceRange: "৳800 - ৳12,000",
      icon: "👧"
    }
  ];

  const contests = [
    {
      title: "MEGA EID LOTTERY",
      description: "Grand Prizes Worth Millions",
      prizes: ["1st Prize: Hajj Trip for 2 People (৳6,00,000)", "2nd Prize: Brand New Car Toyota Vitz (৳18,00,000)", "3rd Prize: Complete Home Appliance Set (৳3,50,000)"],
      participation: "Shop for ৳500+ to get 1 lottery ticket",
      drawDate: "Day after EID"
    },
    {
      title: "EID PHOTO CONTEST",
      description: "My Perfect EID Moment",
      prizes: ["1st Place: iPhone 15 Pro + ৳10,000 voucher", "2nd Place: Samsung Galaxy S24 + ৳5,000 voucher", "3rd Place: OnePlus 12 + ৳3,000 voucher"],
      participation: "Post on Instagram/Facebook with #GetItEID2024",
      drawDate: "Weekly winners announced"
    }
  ];

  const socialImpact = [
    {
      title: "Feed the Hungry Initiative",
      description: "Provide EID Meals to Underprivileged Families",
      impact: "৳100 = 1 Family EID Meal",
      goal: "10,000 Families Fed This EID",
      progress: 82,
      currentCount: "8,247 families helped"
    },
    {
      title: "EID Clothing Drive",
      description: "New EID Clothes for Orphan Children",
      impact: "৳800 = 1 Child's Complete EID Outfit",
      goal: "5,000 Children Across Bangladesh",
      progress: 82,
      currentCount: "4,123 children helped"
    }
  ];

  const mobileAppFeatures = [
    {
      category: "App-Exclusive EID Offers",
      icon: "📱",
      features: [
        {
          title: "Flash Sales Every Hour",
          description: "App-only 60% off deals with push notifications",
          details: ["First 100 users get extra 10% off", "Instant alert notifications", "Hourly surprise deals"]
        },
        {
          title: "App-Exclusive Products",
          description: "Limited edition EID collections available only on mobile",
          details: ["Designer collaborations", "Celebrity endorsed items", "Pre-launch product access"]
        },
        {
          title: "Mobile Banking Bonuses", 
          description: "Extra 2% cashback on app payments",
          details: ["Faster bKash/Nagad checkout", "Biometric payment security", "One-tap payment setup"]
        },
        {
          title: "Priority Delivery",
          description: "App users get delivery preference",
          details: ["Real-time delivery tracking", "GPS-based delivery updates", "Delivery time slot selection"]
        }
      ]
    },
    {
      category: "Smart Features for EID Shopping",
      icon: "🌟",
      features: [
        {
          title: "Visual Search & AR Try-On",
          description: "Take photo to find similar products",
          details: ["AR fitting for clothes and accessories", "Color matching with your wardrobe", "Style recommendations based on photos"]
        },
        {
          title: "Voice Shopping in Bengali",
          description: "Shop using voice commands in Bengali",
          details: ["Natural language processing", "Accent recognition for regional Bengali", "Voice-to-text search capabilities"]
        },
        {
          title: "Location-Based Services",
          description: "Find nearby pickup points and local vendors",
          details: ["Area-specific delivery times", "Regional price comparisons", "Local vendor recommendations"]
        },
        {
          title: "AI Shopping Assistant - Nila",
          description: "Your personal shopping companion",
          details: ["Budget planning and suggestions", "Size and style matching", "EID timeline planning"]
        }
      ]
    },
    {
      category: "App User Benefits",
      icon: "🏆", 
      features: [
        {
          title: "VIP Member Privileges",
          description: "Early access to EID sales and priority support",
          details: ["Exclusive member pricing", "Birthday and anniversary offers", "Priority customer support"]
        },
        {
          title: "Loyalty Points Program",
          description: "Earn 1 point per ৳10 spent",
          details: ["Bonus points for app usage", "Redeem points for discounts", "Special EID point multipliers"]
        },
        {
          title: "Smart Notifications",
          description: "Personalized deal alerts and updates",
          details: ["Back-in-stock notifications", "Price drop alerts", "EID reminder notifications"]
        },
        {
          title: "Personal Shopping Analytics",
          description: "Spending insights and trends analysis",
          details: ["Category-wise purchase analysis", "Budget tracking and alerts", "EID shopping progress tracking"]
        }
      ]
    }
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
              🌙 EID MUBARAK! 🌟
            </h1>
            <p className="text-2xl md:text-4xl mb-6 font-bold text-yellow-300">
              🎉 Bangladesh's Biggest EID Sale 🎉
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
            🤲 EID Mubarak Greetings 🤲
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
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              🛍️ EID Special Collections
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View All Categories
            </Button>
          </div>
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
                  <div className="space-y-2 mb-4">
                    {category.subcategories.map((sub, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle className="w-3 h-3 mt-0.5" />
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-white bg-white bg-opacity-20 p-2 rounded mb-4">
                    🎯 {category.topPicks}
                  </div>
                  <Button variant="secondary" className="w-full text-gray-800 font-bold">
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
          <div className="flex justify-between items-center mb-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3 mb-4">
                <Flame className="w-8 h-8 text-red-500" />
                ⚡ Today's Special Offers ⚡
                <Flame className="w-8 h-8 text-red-500" />
              </h2>
              <p className="text-lg text-gray-600">⏰ Limited Time Flash Deals ⏰</p>
              <div className="bg-red-500 text-white px-4 py-2 rounded-full inline-block font-bold mt-2">
                🔥 ENDING IN: 2:15:30 - Don't Miss Out!
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              View All Flash Deals
            </Button>
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
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              🎁 EID COMBO DEALS 🎁
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              View All Bundles
            </Button>
          </div>
          
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

      {/* Mobile App Promotion */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              📱 GetIt Mobile App - EID Special Features
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download App
            </Button>
          </div>

          {/* App Download Banner */}
          <Card className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-none shadow-xl">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-4">📱 Available only on GetIt Mobile App</h3>
                  <p className="text-xl mb-6">Experience the future of EID shopping with exclusive mobile features</p>
                  <div className="flex gap-4">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-bold">
                      <Download className="w-5 h-5 mr-2" />
                      📱 Download Android
                    </Button>
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold">
                      <Download className="w-5 h-5 mr-2" />
                      🍎 Download iOS
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <Smartphone className="w-32 h-32 mx-auto mb-4 text-yellow-300" />
                  <p className="text-lg font-semibold">Join 2M+ Happy Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile App Features */}
          <div className="space-y-8">
            {mobileAppFeatures.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <span className="text-3xl">{section.icon}</span>
                    {section.category}
                  </h3>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View All Features
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {section.features.map((feature, featureIndex) => (
                    <Card key={featureIndex} className="border-2 border-blue-200 hover:border-blue-400 transform hover:scale-105 transition-all shadow-lg">
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          {feature.title.includes("Flash Sales") && <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />}
                          {feature.title.includes("Exclusive Products") && <Star className="w-8 h-8 mx-auto mb-2 text-purple-500" />}
                          {feature.title.includes("Banking") && <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />}
                          {feature.title.includes("Delivery") && <Truck className="w-8 h-8 mx-auto mb-2 text-blue-500" />}
                          {feature.title.includes("Visual Search") && <Camera className="w-8 h-8 mx-auto mb-2 text-red-500" />}
                          {feature.title.includes("Voice") && <Mic className="w-8 h-8 mx-auto mb-2 text-orange-500" />}
                          {feature.title.includes("Location") && <MapPin className="w-8 h-8 mx-auto mb-2 text-teal-500" />}
                          {feature.title.includes("AI") && <Bot className="w-8 h-8 mx-auto mb-2 text-indigo-500" />}
                          {feature.title.includes("VIP") && <Crown className="w-8 h-8 mx-auto mb-2 text-yellow-500" />}
                          {feature.title.includes("Loyalty") && <Gift className="w-8 h-8 mx-auto mb-2 text-pink-500" />}
                          {feature.title.includes("Notifications") && <Bell className="w-8 h-8 mx-auto mb-2 text-blue-500" />}
                          {feature.title.includes("Analytics") && <BarChart3 className="w-8 h-8 mx-auto mb-2 text-green-500" />}
                          
                          <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {feature.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-start gap-2 text-xs text-gray-600">
                              <CheckCircle className="w-3 h-3 mt-0.5 text-green-500" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                          Try Feature
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* App Benefits Summary */}
          <Card className="mt-8 bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🎯 Why Choose GetIt Mobile App?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h4 className="font-bold text-2xl text-blue-600">50%</h4>
                  <p className="text-sm text-gray-600">Faster Checkout</p>
                </div>
                <div>
                  <h4 className="font-bold text-2xl text-green-600">৳200</h4>
                  <p className="text-sm text-gray-600">Average Extra Savings</p>
                </div>
                <div>
                  <h4 className="font-bold text-2xl text-purple-600">24/7</h4>
                  <p className="text-sm text-gray-600">Smart Shopping Assistant</p>
                </div>
              </div>
              <div className="text-center mt-6">
                <div className="flex gap-2 justify-center">
                  <Button className="bg-blue-500 hover:bg-blue-600">📱 Download Now</Button>
                  <Button variant="outline">🎯 Try Smart Features</Button>
                  <Button variant="outline">🤖 Meet Nila</Button>
                  <Button variant="outline">📍 Find Nearby</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Payment Offers */}
      <section className="py-12 bg-gradient-to-r from-blue-100 to-green-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              💰 EID Payment Bonuses
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              View All Payment Offers
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-pink-500 to-red-500 text-white border-none shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">📱 bKash EID Special</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div>💸 Extra 8% Cashback (Up to ৳800)</div>
                  <div>🎁 Instant ৳200 bonus on first payment</div>
                  <div>🔄 0% transaction fee for all EID purchases</div>
                  <div>💰 Double rewards points until EID</div>
                  <div>📱 Easy 1-tap checkout for repeat purchases</div>
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
                  <div>🎊 Special EID scratch cards with every payment</div>
                  <div>🎁 Win EID gifts worth up to ৳10,000</div>
                  <div>🏆 Lucky draw for Hajj trip (2 winners)</div>
                  <div>💵 Instant payment processing</div>
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
                  <div>📊 Track all EID expenses in Rocket app</div>
                </div>
                <Button variant="secondary" className="w-full text-purple-600 font-bold">
                  💳 Pay with Rocket
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-600 to-gray-800 text-white border-none shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">💳 Bank Cards & COD</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div>💳 Credit/Debit Cards: 3% cashback</div>
                  <div>🏦 Bank Transfer: 2% discount on orders above ৳5,000</div>
                  <div>💰 Cash on Delivery: FREE COD on EID orders</div>
                  <div>📱 EMI Options: 0% interest up to 12 months</div>
                  <div>🎯 All payments 100% secure with bank-level encryption</div>
                </div>
                <Button variant="secondary" className="w-full text-gray-600 font-bold">
                  💳 Other Payment Options
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Delivery Promise */}
      <section className="py-12 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                🎯 EID DELIVERY GUARANTEE
              </h2>
              <div className="text-2xl font-bold text-green-600 mt-4">
                📅 ORDER TODAY, GET BEFORE EID! 📅
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Track My Order
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 border-green-200 hover:border-green-400 transform hover:scale-105 transition-all">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🚚</div>
                <h3 className="font-bold text-gray-800 mb-2">Same Day Delivery</h3>
                <p className="text-sm text-gray-600 mb-2">(Dhaka Metro)</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>⏰ Order before 3 PM → Deliver by 8 PM</div>
                  <div>🏍️ Pathao Express Partnership</div>
                  <div>📍 Covers: Dhanmondi, Gulshan, Uttara, Wari, Old Dhaka</div>
                  <div>💰 FREE on orders above ৳1,500</div>
                  <div>📱 Real-time tracking with live location</div>
                  <div>🎁 Free gift wrapping for same-day orders</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 hover:border-blue-400 transform hover:scale-105 transition-all">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🚛</div>
                <h3 className="font-bold text-gray-800 mb-2">Express Delivery</h3>
                <p className="text-sm text-gray-600 mb-2">(Major Cities)</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>📦 Chittagong, Sylhet, Rajshahi: Next day delivery</div>
                  <div>🚚 Paperfly & Sundarban courier network</div>
                  <div>💰 Cost: ৳80 (FREE on orders above ৳2,000)</div>
                  <div>📅 Order by 12 PM for next-day delivery</div>
                  <div>🔒 Insured delivery for valuable items</div>
                  <div>📞 SMS/Call updates at every step</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 hover:border-purple-400 transform hover:scale-105 transition-all">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🏢</div>
                <h3 className="font-bold text-gray-800 mb-2">Pickup Points</h3>
                <p className="text-sm text-gray-600 mb-2">(Nationwide)</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>📍 50+ Pickup locations across Bangladesh</div>
                  <div>🏪 Shopping malls, markets, community centers</div>
                  <div>💰 FREE pickup service, no delivery charges</div>
                  <div>🕐 Extended hours: 8 AM - 10 PM during EID week</div>
                  <div>🔐 Secure locker system for safe collection</div>
                  <div>📱 SMS notification when ready for pickup</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 hover:border-red-400 transform hover:scale-105 transition-all">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-bold text-gray-800 mb-2">Emergency Delivery</h3>
                <p className="text-sm text-gray-600 mb-2">(2-hour guarantee)</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>🆘 Last-minute EID shopping solution</div>
                  <div>🚁 Drone delivery in select Dhaka areas</div>
                  <div>🏍️ 2-hour guaranteed delivery</div>
                  <div>💰 Premium service: ৳300 flat rate</div>
                  <div>📞 24/7 emergency hotline: 16263</div>
                  <div>🎁 Available for gifts, fashion, electronics</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="py-12 bg-gradient-to-r from-yellow-100 to-orange-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              🏆 EID Featured Vendors
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              View All Vendors
            </Button>
          </div>
          
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
                  <p className="text-sm text-gray-600 mb-2">🎯 {vendor.specialty}</p>
                  <div className="text-xs text-green-600 font-semibold mb-3">{vendor.discount}</div>
                  <Button variant="outline" className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50">
                    🛍️ Shop Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">🎯 All Featured Vendors: Verified ✅ | Top Rated ⭐ | Fast Delivery 🚚</p>
          </div>
        </div>
      </section>

      {/* Gift Guide */}
      <section className="py-12 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              🎁 EID Gift Guide 🎁
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Complete Gift Guide
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {giftGuide.map((guide, index) => (
              <Card key={index} className="border-2 border-pink-200 hover:border-pink-400 transform hover:scale-105 transition-all">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{guide.icon}</div>
                    <h3 className="font-bold text-gray-800 mb-2">{guide.recipient}</h3>
                  </div>
                  <div className="space-y-2 mb-4">
                    {guide.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <Gift className="w-3 h-3 text-pink-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                      {guide.priceRange}
                    </div>
                    <Button variant="outline" className="w-full border-pink-500 text-pink-600 hover:bg-pink-50">
                      🎁 Shop Gifts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🎁 Custom Gift Services 🎁</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-2">📦 Gift Wrapping Services</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Premium EID wrapping paper</li>
                    <li>• Personalized gift messages</li>
                    <li>• Islamic-themed gift boxes</li>
                    <li>• Ribbon & bow decoration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">💌 Personalized Gifts</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Custom name engraving</li>
                    <li>• Photo printing on items</li>
                    <li>• Personalized clothing</li>
                    <li>• Custom gift baskets</li>
                  </ul>
                </div>
              </div>
              <div className="text-center mt-4">
                <div className="flex gap-2 justify-center">
                  <Button className="bg-purple-500 hover:bg-purple-600">🎁 Gift Wrapping</Button>
                  <Button variant="outline">✍️ Personalization</Button>
                  <Button variant="outline">📞 Gift Advice</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contests & Activities */}
      <section className="py-12 bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              🏆 EID CONTESTS & GIVEAWAYS
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              View All Contests
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contests.map((contest, index) => (
              <Card key={index} className="border-2 border-blue-200 hover:border-blue-400 transform hover:scale-105 transition-all shadow-xl">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">🎯 {contest.title}</h3>
                    <p className="text-gray-600 font-semibold">{contest.description}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-bold mb-2">🏅 Prizes:</h4>
                    <div className="space-y-1">
                      {contest.prizes.map((prize, idx) => (
                        <div key={idx} className="text-sm text-gray-600">• {prize}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-bold mb-2">How to Participate:</h4>
                    <p className="text-sm text-gray-600">{contest.participation}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                      📅 {contest.drawDate}
                    </div>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold">
                      🎫 Participate Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Impact */}
      <section className="py-12 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              🤲 EID Giving Program 🤲
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              View All Programs
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {socialImpact.map((program, index) => (
              <Card key={index} className="border-2 border-green-200 hover:border-green-400 transform hover:scale-105 transition-all shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">🍽️ {program.title}</h3>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">{program.impact}</p>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div className="bg-green-500 h-3 rounded-full" style={{width: `${program.progress}%`}}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{program.currentCount}</span>
                      <span className="text-green-600 font-semibold">{program.progress}%</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                      🎯 {program.goal}
                    </div>
                    <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold">
                      💰 Donate Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-yellow-100 to-green-100 border-2 border-green-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">✨ GetIt Matching Program ✨</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h4 className="font-bold text-2xl text-green-600">৳2,45,67,890</h4>
                  <p className="text-sm text-gray-600">Total Raised This EID</p>
                </div>
                <div>
                  <h4 className="font-bold text-2xl text-blue-600">15,678</h4>
                  <p className="text-sm text-gray-600">Caring Hearts (Donors)</p>
                </div>
                <div>
                  <h4 className="font-bold text-2xl text-purple-600">47,892</h4>
                  <p className="text-sm text-gray-600">Lives Touched</p>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="mb-4">🎁 GetIt matches 50% of all donations! Your ৳100 becomes ৳150 impact</p>
                <div className="flex gap-2 justify-center">
                  <Button className="bg-green-500 hover:bg-green-600">💝 Start Giving</Button>
                  <Button variant="outline">📊 Impact Dashboard</Button>
                  <Button variant="outline">🤝 Join Community</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Customer Support */}
      <section className="py-12 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              🤝 EID Customer Support
            </h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Support
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-500 to-teal-500 text-white border-none shadow-xl">
              <CardContent className="p-6 text-center">
                <Phone className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">📞 24/7 EID Helpline</h3>
                <div className="text-2xl font-bold mb-2">16263</div>
                <p className="text-sm mb-4">Call FREE from any operator</p>
                <div className="text-xs space-y-1">
                  <div>🕐 24/7 support until EID</div>
                  <div>🗣️ Bengali & English support</div>
                  <div>🚚 Emergency delivery support</div>
                  <div>🎁 Gift wrapping assistance</div>
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

          <Card className="bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">📱 Social Media & Community Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-2">📱 Follow Us</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>📘 Facebook: GetIt Bangladesh (500K+ members)</li>
                    <li>📷 Instagram: @GetItBangladesh</li>
                    <li>📹 YouTube: GetIt Official</li>
                    <li>💬 WhatsApp Groups: Instant deal notifications</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">🎯 Referral Rewards</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>👥 Refer 1 friend: ৳200 for both</li>
                    <li>🎁 Refer 5 friends: ৳1,500 + bonus ৳500</li>
                    <li>💎 Refer 10 friends: ৳3,500 + VIP membership</li>
                    <li>💰 Family referrals: Extra ৳1,000</li>
                  </ul>
                </div>
              </div>
              <div className="text-center mt-4">
                <div className="flex gap-2 justify-center">
                  <Button className="bg-orange-500 hover:bg-orange-600">📤 Share Now</Button>
                  <Button variant="outline">👥 Refer Friends</Button>
                  <Button variant="outline">🏆 Leaderboard</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
