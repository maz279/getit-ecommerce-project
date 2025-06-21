
import React from 'react';
import { Clock } from 'lucide-react';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';

interface CountdownTimerProps {
  initialTime: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialTime }) => {
  const timeLeft = useCountdownTimer(initialTime);

  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl p-4 inline-block shadow-lg">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Clock className="w-5 h-5" />
        <span className="font-semibold">FLASH SALE ENDING IN:</span>
      </div>
      <div className="flex gap-2 justify-center">
        <div className="bg-white bg-opacity-20 rounded-lg p-2 min-w-[60px] text-center">
          <div className="text-xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
          <div className="text-xs">Days</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-2 min-w-[60px] text-center">
          <div className="text-xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="text-xs">Hours</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-2 min-w-[60px] text-center">
          <div className="text-xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="text-xs">Minutes</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-2 min-w-[60px] text-center">
          <div className="text-xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="text-xs">Seconds</div>
        </div>
      </div>
    </div>
  );
};
