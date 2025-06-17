
import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Clock, Star } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 9,
    hours: 23,
    minutes: 10,
    seconds: 45
  });

  const [currentSlide, setCurrentSlide] = useState(0);

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

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 7);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, []);

  const heroSlides = [
    {
      bg: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600",
      title: "AI-Powered Shopping Experience",
      subtitle: "Discover products tailored just for you",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"
    },
    {
      bg: "bg-gradient-to-r from-green-500 via-teal-500 to-blue-500",
      title: "Flash Sale Extravaganza",
      subtitle: "Up to 80% off on trending items",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
    },
    {
      bg: "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500",
      title: "Limited Time Mega Deals",
      subtitle: "Don't miss out on these exclusive offers",
      image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800"
    },
    {
      bg: "bg-gradient-to-r from-purple-600 via-pink-600 to-red-500",
      title: "Premium Electronics Collection",
      subtitle: "Latest smartphones, laptops & gadgets",
      image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800"
    },
    {
      bg: "bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500",
      title: "Smart Home Revolution",
      subtitle: "Transform your home with AI technology",
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800"
    },
    {
      bg: "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500",
      title: "Fashion Forward Collection",
      subtitle: "Trending styles for every season",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
    },
    {
      bg: "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500",
      title: "Health & Fitness Essentials",
      subtitle: "Everything for your wellness journey",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
    }
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Hero Carousel */}
          <div className="lg:col-span-3">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  } ${slide.bg}`}
                >
                  <div className="flex items-center h-full p-8">
                    <div className="flex-1 text-white">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6 text-yellow-300" />
                        <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                          AI Recommended
                        </span>
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-xl mb-6 opacity-90">{slide.subtitle}</p>
                      
                      {/* Countdown Timer */}
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-lg font-semibold">Ends in:</span>
                        <div className="flex gap-2">
                          {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 text-center min-w-[50px]">
                              <div className="text-2xl font-bold">{value.toString().padStart(2, '0')}</div>
                              <div className="text-xs uppercase">{unit}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-8 py-3 rounded-full hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105 shadow-lg">
                          Shop Now
                        </button>
                        <button className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-gray-800 transition-all">
                          Learn More
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 hidden md:block">
                      <img src={slide.image} alt="Hero" className="w-full h-80 object-cover rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Side Banners */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-xl p-6 text-white h-44 flex flex-col justify-between">
              <div>
                <Zap className="w-8 h-8 mb-2" />
                <h3 className="font-bold text-lg">Flash Sale</h3>
                <p className="text-sm opacity-90">Up to 70% off</p>
              </div>
              <button className="bg-white text-green-600 font-semibold px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition-all">
                Shop Now
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white h-44 flex flex-col justify-between">
              <div>
                <Star className="w-8 h-8 mb-2" />
                <h3 className="font-bold text-lg">AI Picks</h3>
                <p className="text-sm opacity-90">Just for you</p>
              </div>
              <button className="bg-white text-purple-600 font-semibold px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition-all">
                Explore
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
