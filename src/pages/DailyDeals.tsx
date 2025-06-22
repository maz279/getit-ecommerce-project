
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { DailyDealsNavigationMap } from '../components/dailydeals/DailyDealsNavigationMap';
import { WhyChooseSection } from '../components/dailydeals/WhyChooseSection';
import { HowItWorksSection } from '../components/dailydeals/HowItWorksSection';
import { DealCategoriesSection } from '../components/dailydeals/DealCategoriesSection';
import { TodaysHighlightsSection } from '../components/dailydeals/TodaysHighlightsSection';
import { MemberBenefitsSection } from '../components/dailydeals/MemberBenefitsSection';
import { FestivalSpecialSection } from '../components/dailydeals/FestivalSpecialSection';
import { CustomerProtectionSection } from '../components/dailydeals/CustomerProtectionSection';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DailyDeals: React.FC = () => {
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
        <WhyChooseSection />
        
        <DailyDealsNavigationMap />

        {/* How Daily Deals Work */}
        <HowItWorksSection />

        {/* Deal Categories */}
        <DealCategoriesSection />
        
        {/* Today's Highlighted Deals */}
        <TodaysHighlightsSection />

        {/* Member Benefits */}
        <MemberBenefitsSection />

        {/* Festival Special Deals */}
        <FestivalSpecialSection />

        {/* Customer Protection Guarantee */}
        <CustomerProtectionSection />

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
