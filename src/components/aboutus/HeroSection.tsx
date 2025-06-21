
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    title: "About GetIt",
    subtitle: "Bangladesh's Premier E-commerce Platform",
    description: "Revolutionizing the way millions of Bangladeshis shop, sell, and connect online.",
    bgGradient: "from-blue-600 via-purple-600 to-indigo-800",
    stats: [
      { icon: Users, value: "50K+", label: "Vendors" },
      { icon: ShoppingBag, value: "5M+", label: "Products" },
      { icon: TrendingUp, value: "100K+", label: "Daily Orders" }
    ]
  },
  {
    title: "Empowering Local Businesses",
    subtitle: "Built for Bangladesh, By Bangladesh",
    description: "Supporting local entrepreneurs and connecting them with customers nationwide through cutting-edge technology.",
    bgGradient: "from-green-600 via-teal-600 to-cyan-800",
    stats: [
      { icon: Star, value: "99.9%", label: "Uptime" },
      { icon: Users, value: "64", label: "Districts Covered" },
      { icon: TrendingUp, value: "300%", label: "Growth in 2023" }
    ]
  },
  {
    title: "Innovation & Trust",
    subtitle: "Leading Digital Transformation",
    description: "Combining advanced technology with deep local market understanding to create exceptional experiences.",
    bgGradient: "from-orange-600 via-red-600 to-pink-800",
    stats: [
      { icon: ShoppingBag, value: "10M+", label: "Happy Customers" },
      { icon: Star, value: "4.8", label: "Average Rating" },
      { icon: TrendingUp, value: "#1", label: "E-commerce Platform" }
    ]
  }
];

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [isAnimating]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="relative overflow-hidden mb-16 rounded-2xl">
      <div className={`bg-gradient-to-br ${slide.bgGradient} text-white relative`}>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/30 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-white/30 rounded-full animate-pulse delay-100"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white/30 rounded-full animate-pulse delay-200"></div>
        </div>

        <div className="relative z-10 px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={`space-y-6 ${isAnimating ? 'animate-fade-out' : 'animate-fade-in'}`}>
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                  <Star className="w-4 h-4 text-yellow-300" />
                  <span>Trusted by millions</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  {slide.title}
                </h1>
                
                <h2 className="text-2xl lg:text-3xl font-semibold text-blue-100">
                  {slide.subtitle}
                </h2>
                
                <p className="text-xl text-blue-50 leading-relaxed max-w-2xl">
                  {slide.description}
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3">
                    Learn More
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8 py-3">
                    Join Us Today
                  </Button>
                </div>
              </div>

              <div className={`${isAnimating ? 'animate-scale-out' : 'animate-scale-in'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {slide.stats.map((stat, index) => (
                    <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-300">
                      <stat.icon className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-blue-100">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="absolute inset-y-0 left-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="text-white hover:bg-white/20 w-12 h-12 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="absolute inset-y-0 right-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="text-white hover:bg-white/20 w-12 h-12 rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentSlide(index);
                  setTimeout(() => setIsAnimating(false), 500);
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
