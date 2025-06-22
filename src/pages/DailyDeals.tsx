
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
        {/* Reduced Hero Section */}
        <section className="bg-gradient-to-r from-green-600 via-teal-500 to-blue-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                ⚡ Today's Flash Deals - Limited Time Only ⚡
              </h1>
              <p className="text-base md:text-lg mb-4 text-yellow-100 max-w-3xl mx-auto">
                Discover incredible savings on premium products from verified local and international vendors across Bangladesh.
              </p>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 inline-block mb-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-yellow-300" />
                  <span className="text-base font-bold">⏰ New Deals Launch In: ⏰</span>
                </div>
                <div className="text-xl font-bold mb-1">5:32:15</div>
                <p className="text-xs text-yellow-200">Next batch at 6:00 AM Bangladesh Time</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button className="bg-white text-green-600 hover:bg-gray-100 text-base font-bold px-6 py-2 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300">
                  🛒 Browse Current Deals 🌟
                </Button>
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-green-600 text-base font-bold px-6 py-2 rounded-full">
                  📱 Download Mobile App
                </Button>
              </div>

              <div className="mt-4 text-xs text-yellow-100">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default DailyDeals;
