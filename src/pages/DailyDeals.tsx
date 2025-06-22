
import React, { useState } from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { DailyDealsNavigationMap } from '../components/dailydeals/DailyDealsNavigationMap';
import { Clock, Star, Truck, Shield, CheckCircle, Zap, Users, Gift, Award, Bell, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DailyDeals: React.FC = () => {
  const dailyDeals = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      description: 'Premium sound quality | 30-hour battery life',
      originalPrice: 3999,
      salePrice: 1999,
      discount: 50,
      savings: 2000,
      timeLeft: '23:45:30',
      stock: 15,
      rating: 4.6,
      reviews: 1234,
      image: '🎧',
      category: 'Electronics',
      verified: true
    },
    {
      id: 2,
      name: 'Premium Bed Sheet Set',
      description: '100% Cotton | King Size | 4 pieces',
      originalPrice: 4500,
      salePrice: 1800,
      discount: 60,
      savings: 2700,
      timeLeft: '23:45:30',
      stock: 8,
      rating: 4.8,
      reviews: 567,
      image: '🛏️',
      category: 'Home & Garden',
      verified: true
    },
    {
      id: 3,
      name: 'Smart Water Bottle',
      description: 'Temperature display | 500ml | BPA-free',
      originalPrice: 2200,
      salePrice: 999,
      discount: 55,
      savings: 1201,
      timeLeft: '23:45:30',
      stock: 25,
      rating: 4.4,
      reviews: 890,
      image: '💧',
      category: 'Health & Beauty',
      verified: true
    },
    {
      id: 4,
      name: 'Traditional Saree Collection',
      description: 'Handwoven silk | Authentic Bengali design | Festival ready',
      originalPrice: 5500,
      salePrice: 2200,
      discount: 60,
      savings: 3300,
      timeLeft: '23:45:30',
      stock: 12,
      rating: 4.7,
      reviews: 445,
      image: '👗',
      category: 'Fashion',
      verified: true
    },
    {
      id: 5,
      name: 'Premium Basmati Rice',
      description: '5kg pack | Imported quality | Aged 2 years',
      originalPrice: 1200,
      salePrice: 720,
      discount: 40,
      savings: 480,
      timeLeft: '23:45:30',
      stock: 50,
      rating: 4.5,
      reviews: 678,
      image: '🍚',
      category: 'Food & Groceries',
      verified: true
    },
    {
      id: 6,
      name: 'Educational Book Bundle',
      description: 'HSC preparation books | Complete set | Latest edition',
      originalPrice: 2800,
      salePrice: 1400,
      discount: 50,
      savings: 1400,
      timeLeft: '23:45:30',
      stock: 30,
      rating: 4.6,
      reviews: 234,
      image: '📚',
      category: 'Books & Education',
      verified: true
    }
  ];

  const whyChooseFeatures = [
    {
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      title: 'Verified Quality Products',
      description: 'Every deal features products from our rigorously vetted vendor network, ensuring authentic items and reliable service across Dhaka, Chittagong, Sylhet, and nationwide.'
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: 'Lightning-Fast Delivery',
      description: 'Same-day delivery available in major cities through our partnerships with Pathao, Paperfly, and Sundarban courier services.'
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      title: 'Transparent Pricing',
      description: 'No hidden fees. All prices include applicable VAT and are displayed in Bangladeshi Taka (BDT) with clear savings calculations.'
    },
    {
      icon: <Shield className="w-8 h-8 text-orange-500" />,
      title: 'Secure Payment Options',
      description: 'Pay your way with bKash, Nagad, Rocket, bank transfer, or cash on delivery (COD) - all transactions protected by advanced security protocols.'
    }
  ];

  const dealCategories = [
    { icon: '📱', title: 'Electronics & Mobile', description: 'Smartphones, accessories, gadgets' },
    { icon: '👗', title: 'Fashion & Lifestyle', description: 'Traditional wear, modern fashion' },
    { icon: '🏠', title: 'Home & Living', description: 'Furniture, appliances, decor' },
    { icon: '📚', title: 'Books & Education', description: 'Academic books, literature' },
    { icon: '🍲', title: 'Food & Groceries', description: 'Premium rice, spices, organics' }
  ];

  const memberBenefits = [
    { icon: <Star className="w-6 h-6 text-yellow-500" />, title: 'Early Access', description: 'GetIt members get 1-hour early access to new deals, starting at 5:00 AM daily.' },
    { icon: <Gift className="w-6 h-6 text-purple-500" />, title: 'Exclusive Discounts', description: 'Additional 5-10% member-only discounts on selected daily deals.' },
    { icon: <Award className="w-6 h-6 text-green-500" />, title: 'Loyalty Rewards', description: 'Earn points on every purchase, redeemable for future discounts and special offers.' },
    { icon: <Bell className="w-6 h-6 text-blue-500" />, title: 'Deal Alerts', description: 'Personalized notifications for deals matching your shopping preferences and wishlist items.' }
  ];

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Enhanced Hero Section */}
        <section className="bg-gradient-to-r from-green-600 via-teal-500 to-blue-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                ⚡ Today's Flash Deals - Limited Time Only ⚡
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-yellow-100 max-w-4xl mx-auto">
                Discover incredible savings on premium products from verified local and international vendors across Bangladesh. Every deal is handpicked to deliver exceptional value and quality.
              </p>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 inline-block mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-6 h-6 text-yellow-300" />
                  <span className="text-xl font-bold">⏰ New Deals Launch In: ⏰</span>
                </div>
                <div className="text-3xl font-bold mb-2">5:32:15</div>
                <p className="text-sm text-yellow-200">Next batch at 6:00 AM Bangladesh Time</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button className="bg-white text-green-600 hover:bg-gray-100 text-lg font-bold px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300">
                  🛒 Browse Current Deals 🌟
                </Button>
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-green-600 text-lg font-bold px-8 py-4 rounded-full">
                  📱 Download Mobile App
                </Button>
              </div>

              <div className="mt-8 text-sm text-yellow-100">
                Join over 2 million satisfied customers who save money daily with GetIt's verified deals
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose GetIt Daily Deals */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">✨ Why Choose GetIt Daily Deals?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the best in quality, service, and value with every purchase
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseFeatures.map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <DailyDealsNavigationMap />

        {/* How Daily Deals Work */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">🕐 How Daily Deals Work</h2>
              <p className="text-xl text-gray-600">Simple steps to amazing savings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="text-4xl mb-4">🌅</div>
                <h3 className="text-xl font-bold mb-3">New Deals Every Morning</h3>
                <p className="text-gray-600">Fresh deals launch daily at 6:00 AM Bangladesh time, featuring products across all categories.</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-xl font-bold mb-3">Time-Sensitive Savings</h3>
                <p className="text-gray-600">Most deals run for 24 hours or until stock expires. Popular items sell out quickly.</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold mb-3">Mobile-First Shopping</h3>
                <p className="text-gray-600">Optimized for Bangladesh's mobile-first habits with fast loading on 2G/3G networks.</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-3">Curated Selection</h3>
                <p className="text-gray-600">Each deal is personally selected based on vendor reliability and genuine savings.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Deal Categories */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">🛍️ Deal Categories</h2>
              <p className="text-xl text-gray-600">Discover deals across all your favorite categories</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {dealCategories.map((category, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Today's Highlighted Deals */}
        <section id="todays-highlights" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">⭐ Today's Highlighted Deals ⭐</h2>
              <p className="text-xl text-gray-600 mb-6">
                Hand-picked deals that expire at midnight - Don't miss out!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dailyDeals.map((deal) => (
                <div key={deal.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-6xl">{deal.image}</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      🔥 {deal.discount}% OFF
                    </div>
                    {deal.verified && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{deal.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{deal.description}</p>

                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl font-bold text-green-600">৳{deal.salePrice.toLocaleString()}</span>
                        <span className="text-lg text-gray-500 line-through">৳{deal.originalPrice.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-green-600 font-semibold">💰 You Save ৳{deal.savings.toLocaleString()}</p>
                    </div>

                    <div className="mb-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-red-500" />
                          Deal expires in:
                        </span>
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">{deal.timeLeft}</span>
                      </div>
                      <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                        📦 Only {deal.stock} left today! Hurry up!
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(deal.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span>{deal.rating}/5 ({deal.reviews.toLocaleString()} reviews)</span>
                      </div>
                    </div>

                    <div className="mb-4 text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-green-500" />
                        <span>🚚 Same-day delivery in Dhaka</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span>💳 bKash/Nagad/Rocket/COD accepted</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mb-4">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold">
                        🛒 Add to Cart
                      </Button>
                      <Button variant="outline" size="icon" className="border-gray-300 hover:bg-red-50 hover:border-red-300">
                        <Heart className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>

                    <div className="text-xs text-gray-600 flex items-center gap-1 bg-gray-50 p-2 rounded">
                      <Shield className="w-3 h-3 text-green-500" />
                      Daily deal guarantee - Valid until midnight | 7-day return policy
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Member Benefits */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">🌟 Member Benefits</h2>
              <p className="text-xl text-gray-600">Unlock exclusive perks and save even more</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {memberBenefits.map((benefit, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 text-center">
                  <div className="flex justify-center mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-full">
                🎯 Join as Member - It's Free!
              </Button>
            </div>
          </div>
        </section>

        {/* Festival Special Deals */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">🎊 Festival Special Deals</h2>
              <p className="text-xl mb-8">Celebrate Bangladesh's rich culture with special festival offers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🌙</div>
                <h3 className="text-xl font-bold mb-3">Eid Collections</h3>
                <p>Spectacular savings during Eid-ul-Fitr and Eid-ul-Adha with extended deal periods and cultural product focus.</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🎊</div>
                <h3 className="text-xl font-bold mb-3">Pohela Boishakh</h3>
                <p>Bengali New Year special deals featuring traditional handicrafts, clothing, and cultural items.</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🎆</div>
                <h3 className="text-xl font-bold mb-3">Victory & Independence Day</h3>
                <p>Patriotic product collections and nationwide shipping promotions honoring Bangladesh's heritage.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Protection Guarantee */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">🛡️ Customer Protection Guarantee</h2>
              <p className="text-xl text-gray-600">Shop with confidence - your satisfaction is guaranteed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg font-bold mb-3">Authenticity Assured</h3>
                <p className="text-gray-600 text-sm">100% genuine products with warranty protection and easy returns within 7 days of delivery.</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-lg font-bold mb-3">Secure Transactions</h3>
                <p className="text-gray-600 text-sm">Bank-level security with encrypted payment processing and fraud protection monitoring.</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-lg font-bold mb-3">Reliable Support</h3>
                <p className="text-gray-600 text-sm">24/7 customer service in Bangla and English via phone, WhatsApp, live chat, and email support.</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-lg font-bold mb-3">Delivery Guarantee</h3>
                <p className="text-gray-600 text-sm">Timely delivery commitment with full refund if orders don't arrive within promised timeframes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">🚀 Start Saving Today</h2>
            <p className="text-xl mb-8">Ready to discover amazing deals?</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button className="bg-white text-green-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-full">
                Browse Current Deals
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-green-600 font-bold px-8 py-3 rounded-full">
                Download Mobile App
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-green-600 font-bold px-8 py-3 rounded-full">
                Join Newsletter for Alerts
              </Button>
            </div>

            <p className="text-lg text-yellow-100">
              Join over 2 million satisfied customers who save money daily with GetIt's verified deals from trusted vendors across Bangladesh.
            </p>
          </div>
        </section>

        {/* Quick Links Footer */}
        <section className="py-12 bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <p className="font-semibold">Categories</p>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>Electronics</p>
                  <p>Fashion</p>
                  <p>Home & Living</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">How It Works</p>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>Member Benefits</p>
                  <p>Customer Support</p>
                  <p>Vendor Information</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Services</p>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>Shipping Areas</p>
                  <p>Payment Methods</p>
                  <p>Return Policy</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Support</p>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>Help Center</p>
                  <p>Track Order</p>
                  <p>Contact Us</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DailyDeals;
