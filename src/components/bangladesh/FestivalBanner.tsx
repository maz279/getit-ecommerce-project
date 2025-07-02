import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gift, Sparkles, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FestivalConfig {
  id: string;
  festival_name: string;
  festival_name_bn: string;
  festival_type: string;
  start_date: string;
  end_date: string;
  banner_config: {
    background_color?: string;
    text_color?: string;
    animation?: string;
    image_url?: string;
  };
  discount_config: {
    discount_percentage?: number;
    min_amount?: number;
    max_discount?: number;
  };
  cultural_elements?: {
    greeting_text?: string;
    greeting_text_bn?: string;
    traditional_colors?: string[];
  };
}

interface FestivalBannerProps {
  onDismiss?: () => void;
  language?: 'en' | 'bn';
  compact?: boolean;
}

export const FestivalBanner: React.FC<FestivalBannerProps> = ({
  onDismiss,
  language = 'en',
  compact = false
}) => {
  const [activeFestival, setActiveFestival] = useState<FestivalConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchActiveFestival();
  }, []);

  const fetchActiveFestival = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('bd_festival_configs')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', today)
        .gte('end_date', today)
        .order('start_date', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setActiveFestival(data as FestivalConfig);
      }
    } catch (error) {
      console.error('Failed to fetch festival config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading || dismissed || !activeFestival) {
    return null;
  }

  const daysRemaining = calculateDaysRemaining(activeFestival.end_date);
  const festivalName = language === 'bn' ? activeFestival.festival_name_bn : activeFestival.festival_name;
  const greetingText = language === 'bn' 
    ? activeFestival.cultural_elements?.greeting_text_bn 
    : activeFestival.cultural_elements?.greeting_text;

  const bannerStyle = {
    background: activeFestival.banner_config?.background_color || 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
    color: activeFestival.banner_config?.text_color || '#ffffff',
  };

  if (compact) {
    return (
      <div 
        className="flex items-center justify-between p-2 rounded-lg text-sm animate-pulse"
        style={bannerStyle}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium">{festivalName}</span>
          {activeFestival.discount_config?.discount_percentage && (
            <Badge variant="secondary" className="text-xs">
              {activeFestival.discount_config.discount_percentage}% OFF
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={handleDismiss}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="relative overflow-hidden animate-fade-in">
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: activeFestival.banner_config?.image_url 
            ? `url(${activeFestival.banner_config.image_url})` 
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <CardContent className="relative p-6" style={bannerStyle}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-6 w-6" />
              <Badge variant="secondary" className="bg-white/20 text-white">
                {activeFestival.festival_type}
              </Badge>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">{festivalName}</h2>
            
            {greetingText && (
              <p className="text-lg mb-3 opacity-90">{greetingText}</p>
            )}
            
            {activeFestival.discount_config?.discount_percentage && (
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-3xl font-bold">
                    {activeFestival.discount_config.discount_percentage}%
                  </div>
                  <div className="text-sm opacity-90">OFF</div>
                </div>
                
                <div>
                  <div className="text-sm opacity-90">
                    {language === 'bn' ? 'সর্বনিম্ন অর্ডার' : 'Min. Order'}
                  </div>
                  <div className="font-bold">
                    ৳{activeFestival.discount_config.min_amount?.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm opacity-90">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {daysRemaining} {language === 'bn' ? 'দিন বাকি' : 'days left'}
                </span>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-4">
          <Button variant="secondary" className="bg-white text-black hover:bg-white/90">
            {language === 'bn' ? 'এখনই কিনুন' : 'Shop Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};