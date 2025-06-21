
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Users, Award, Truck, Star, Globe, DollarSign } from 'lucide-react';

const stats = [
  { label: "Active Customers", value: "2M+", icon: Users },
  { label: "Vendors", value: "5K+", icon: Award },
  { label: "Daily Orders", value: "50K+", icon: Truck },
  { label: "Rating", value: "4.8/5", icon: Star },
  { label: "Districts", value: "64", icon: Globe },
  { label: "Sales", value: "৳500Cr+", icon: DollarSign }
];

const slides = [
  {
    title: "🚀 Become a GetIt Partner",
    subtitle: "Join Bangladesh's fastest growing marketplace",
    description: "🇧🇩 Already 5,000+ successful vendors serving millions across Bangladesh",
    testimonial: "⭐ \"GetIt changed my business completely\" - Rashida Khan",
    background: "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
  },
  {
    title: "💰 Earn More with GetIt",
    subtitle: "Low commission rates starting from 2%",
    description: "🏪 Transparent pricing with no hidden fees - keep more of your profits",
    testimonial: "💼 \"Best commission rates in Bangladesh\" - Karim Electronics",
    background: "bg-gradient-to-br from-green-50 via-blue-50 to-teal-50"
  },
  {
    title: "📈 Grow Your Business Fast",
    subtitle: "Reach 2M+ customers nationwide",
    description: "🚚 Free logistics support with Pathao, Paperfly delivery nationwide",
    testimonial: "📊 \"300% sales growth in 6 months\" - Fatima Fashion",
    background: "bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50"
  }
];

export const VendorHeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    // Scroll to the vendor onboarding section
    const vendorSection = document.getElementById('vendor-onboarding');
    if (vendorSection) {
      vendorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Carousel className="mb-6">
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className={`${slide.background} rounded-lg p-6 text-center`}>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {slide.title}
                  </h1>
                  <p className="text-base text-gray-600 mb-2">
                    {slide.subtitle}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {slide.description}
                  </p>
                  
                  <Button 
                    size="default" 
                    className="mb-4 text-base py-2 px-6"
                    onClick={handleStartJourney}
                  >
                    🏪 Start Your Business Journey
                  </Button>
                  
                  <div className="bg-white/70 p-3 rounded-lg inline-block">
                    <p className="text-blue-800 font-medium text-sm">{slide.testimonial}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-2">
              <CardContent className="pt-2">
                <stat.icon className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <div className="text-sm font-bold text-gray-800">{stat.value}</div>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
