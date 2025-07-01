import React from 'react';
import { Calendar, Gift, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FestivalEvent {
  id: string;
  name: string;
  nameBn: string;
  startDate: string;
  endDate: string;
  discount: string;
  theme: string;
  icon: string;
}

export const FestivalBanner: React.FC = () => {
  const [currentFestival, setCurrentFestival] = React.useState<FestivalEvent | null>(null);

  const festivals: FestivalEvent[] = [
    {
      id: 'eid',
      name: 'Eid Sale',
      nameBn: 'ঈদ সেল',
      startDate: '2024-04-10',
      endDate: '2024-04-15',
      discount: 'Up to 70% OFF',
      theme: 'bg-gradient-to-r from-green-500 to-emerald-600',
      icon: '🌙'
    },
    {
      id: 'pohela-boishakh',
      name: 'Pohela Boishakh Festival',
      nameBn: 'পহেলা বৈশাখ উৎসব',
      startDate: '2024-04-14',
      endDate: '2024-04-16',
      discount: 'Special Offers',
      theme: 'bg-gradient-to-r from-red-500 to-yellow-500',
      icon: '🎊'
    },
    {
      id: 'durga-puja',
      name: 'Durga Puja Special',
      nameBn: 'দুর্গা পূজা বিশেষ',
      startDate: '2024-10-09',
      endDate: '2024-10-13',
      discount: 'Mega Discounts',
      theme: 'bg-gradient-to-r from-purple-500 to-pink-600',
      icon: '🪔'
    }
  ];

  React.useEffect(() => {
    const checkActiveFestival = () => {
      const today = new Date().toISOString().split('T')[0];
      const activeFestival = festivals.find(
        festival => today >= festival.startDate && today <= festival.endDate
      );
      setCurrentFestival(activeFestival || null);
    };

    checkActiveFestival();
  }, []);

  if (!currentFestival) return null;

  return (
    <div className={`${currentFestival.theme} text-white py-3 px-4 relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentFestival.icon}</span>
          <div>
            <h3 className="font-bold text-lg">
              {currentFestival.name} | {currentFestival.nameBn}
            </h3>
            <p className="text-sm opacity-90">{currentFestival.discount}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Calendar className="w-3 h-3 mr-1" />
            Limited Time
          </Badge>
          <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-white/90">
            <Gift className="w-4 h-4 mr-1" />
            Shop Now
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 opacity-20">
        <Star className="w-6 h-6 animate-pulse" />
      </div>
      <div className="absolute bottom-0 left-1/4 opacity-20">
        <Star className="w-4 h-4 animate-pulse delay-300" />
      </div>
    </div>
  );
};