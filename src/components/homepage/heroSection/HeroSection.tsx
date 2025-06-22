
import React, { useState, useEffect } from 'react';
import { heroSlides } from './heroSlidesData';
import { HeroCarousel } from './HeroCarousel';
import { SideBanners } from './SideBanners';
import { TimeLeft } from './types';

export const HeroSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
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
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <HeroCarousel 
            slides={heroSlides}
            currentSlide={currentSlide}
            timeLeft={timeLeft}
            onSlideChange={setCurrentSlide}
          />
          <SideBanners />
        </div>
      </div>
    </section>
  );
};
