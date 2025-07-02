import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface FestivalConfig {
  id: string;
  festival_name: string;
  festival_name_bn: string;
  start_date: string;
  end_date: string;
  banner_config: {
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
    bannerImage?: string;
    animation?: string;
  };
  discount_config: {
    type?: 'percentage' | 'fixed';
    value?: number;
    maxDiscount?: number;
    categories?: string[];
  };
  cultural_elements: {
    greeting?: string;
    greetingBn?: string;
    emoji?: string;
    pattern?: string;
  };
}

interface FestivalBannerProps {
  variant?: 'full' | 'compact' | 'minimal';
  showGreeting?: boolean;
  language?: 'en' | 'bn';
  onOfferClick?: (festivalId: string) => void;
}

export const FestivalBanner: React.FC<FestivalBannerProps> = ({
  variant = 'full',
  showGreeting = true,
  language = 'en',
  onOfferClick
}) => {
  const [activeFestivals, setActiveFestivals] = useState<FestivalConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadActiveFestivals();
  }, []);

  useEffect(() => {
    if (activeFestivals.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % activeFestivals.length);
      }, 5000); // Change banner every 5 seconds

      return () => clearInterval(interval);
    }
  }, [activeFestivals.length]);

  const loadActiveFestivals = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('bangladesh-localization', {
        body: {
          action: 'get_festival_info'
        }
      });

      if (error) throw error;

      if (data?.success && data.data) {
        setActiveFestivals(data.data);
      }
    } catch (error) {
      console.error('Failed to load festivals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeFestivals.length === 0) {
    return null;
  }

  const currentFestival = activeFestivals[currentIndex];
  const bannerConfig = currentFestival.banner_config || {};
  const discountConfig = currentFestival.discount_config || {};
  const culturalElements = currentFestival.cultural_elements || {};

  const primaryColor = bannerConfig.primaryColor || '#10B981';
  const secondaryColor = bannerConfig.secondaryColor || '#065F46';
  const textColor = bannerConfig.textColor || '#FFFFFF';

  const festivalName = language === 'bn' 
    ? currentFestival.festival_name_bn 
    : currentFestival.festival_name;

  const greeting = language === 'bn' 
    ? culturalElements.greetingBn 
    : culturalElements.greeting;

  const formatDiscount = () => {
    if (!discountConfig.value) return '';
    
    if (discountConfig.type === 'percentage') {
      return `${discountConfig.value}% OFF`;
    } else {
      return `৳${discountConfig.value} OFF`;
    }
  };

  const bannerStyle = {
    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
    color: textColor,
    position: 'relative' as const,
    overflow: 'hidden' as const
  };

  if (variant === 'minimal') {
    return (
      <div 
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
        style={{ backgroundColor: primaryColor, color: textColor }}
      >
        <span>{culturalElements.emoji}</span>
        <span className="font-medium">{festivalName}</span>
        {discountConfig.value && (
          <Badge variant="secondary" className="text-xs">
            {formatDiscount()}
          </Badge>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className="w-full">
        <CardContent className="p-4" style={bannerStyle}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{culturalElements.emoji}</span>
              <div>
                <h3 className="font-bold text-lg">{festivalName}</h3>
                {greeting && showGreeting && (
                  <p className="text-sm opacity-90">{greeting}</p>
                )}
              </div>
            </div>
            
            {discountConfig.value && (
              <div className="text-right">
                <div className="font-bold text-xl">{formatDiscount()}</div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onOfferClick?.(currentFestival.id)}
                  className="mt-1"
                >
                  {language === 'bn' ? 'দেখুন' : 'Shop Now'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div 
          className="relative p-8 text-center"
          style={bannerStyle}
        >
          {/* Decorative Pattern */}
          {culturalElements.pattern && (
            <div 
              className="absolute inset-0 opacity-10"
              style={{ 
                backgroundImage: `url(${culturalElements.pattern})`,
                backgroundRepeat: 'repeat',
                backgroundSize: '100px 100px'
              }}
            />
          )}
          
          {/* Content */}
          <div className="relative z-10 space-y-4">
            <div className="text-6xl mb-4">
              {culturalElements.emoji}
            </div>
            
            <h1 className="text-4xl font-bold mb-2">
              {festivalName}
            </h1>
            
            {greeting && showGreeting && (
              <p className="text-xl opacity-90 mb-4">
                {greeting}
              </p>
            )}
            
            {discountConfig.value && (
              <div className="space-y-4">
                <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                  <div className="text-3xl font-bold">
                    {formatDiscount()}
                  </div>
                  <div className="text-sm opacity-90">
                    {language === 'bn' ? 'সব পণ্যে ছাড়' : 'On All Products'}
                  </div>
                </div>
                
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => onOfferClick?.(currentFestival.id)}
                  className="px-8 py-3 text-lg font-semibold"
                >
                  {language === 'bn' ? 'এখনই কিনুন' : 'Shop Festival Deals'}
                </Button>
              </div>
            )}
            
            {/* Festival Duration */}
            <div className="text-sm opacity-75 mt-4">
              {language === 'bn' ? 'উৎসব চলছে' : 'Festival Active'}: {' '}
              {new Date(currentFestival.start_date).toLocaleDateString()} - {' '}
              {new Date(currentFestival.end_date).toLocaleDateString()}
            </div>
          </div>
          
          {/* Navigation dots for multiple festivals */}
          {activeFestivals.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {activeFestivals.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};