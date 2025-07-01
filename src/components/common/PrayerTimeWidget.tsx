import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PrayerTime {
  name: string;
  nameBn: string;
  time: string;
  isNext: boolean;
}

export const PrayerTimeWidget: React.FC = () => {
  const [currentLocation, setCurrentLocation] = React.useState('Dhaka');
  const [prayerTimes, setPrayerTimes] = React.useState<PrayerTime[]>([]);

  React.useEffect(() => {
    // Mock prayer times - in real app, fetch from Islamic prayer time API
    const mockPrayerTimes: PrayerTime[] = [
      { name: 'Fajr', nameBn: 'ফজর', time: '05:15', isNext: false },
      { name: 'Dhuhr', nameBn: 'যুহর', time: '12:10', isNext: true },
      { name: 'Asr', nameBn: 'আসর', time: '15:45', isNext: false },
      { name: 'Maghrib', nameBn: 'মাগরিব', time: '18:20', isNext: false },
      { name: 'Isha', nameBn: 'ইশা', time: '19:45', isNext: false },
    ];
    
    setPrayerTimes(mockPrayerTimes);
  }, [currentLocation]);

  const nextPrayer = prayerTimes.find(prayer => prayer.isNext);

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Prayer Times</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {currentLocation}
          </div>
        </div>

        {nextPrayer && (
          <div className="mb-3 p-2 bg-primary/10 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Next: {nextPrayer.name}</span>
              <Badge variant="secondary" className="text-xs">
                {nextPrayer.time}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">{nextPrayer.nameBn}</span>
          </div>
        )}

        <div className="space-y-1">
          {prayerTimes.map((prayer) => (
            <div 
              key={prayer.name}
              className={`flex items-center justify-between py-1 px-2 rounded text-xs ${
                prayer.isNext ? 'bg-primary/5 font-medium' : ''
              }`}
            >
              <div className="flex flex-col">
                <span>{prayer.name}</span>
                <span className="text-muted-foreground text-xs">{prayer.nameBn}</span>
              </div>
              <span className={prayer.isNext ? 'font-semibold text-primary' : 'text-muted-foreground'}>
                {prayer.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};