
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
    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-3 inline-block shadow-lg">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Clock className="w-4 h-4" />
        <span className="font-semibold text-sm">ENDING IN:</span>
      </div>
      <div className="flex gap-2 justify-center">
        <div className="bg-white bg-opacity-20 rounded-md p-2 min-w-[50px] text-center">
          <div className="text-lg font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
          <div className="text-xs">Days</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-md p-2 min-w-[50px] text-center">
          <div className="text-lg font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="text-xs">Hours</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-md p-2 min-w-[50px] text-center">
          <div className="text-lg font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="text-xs">Min</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-md p-2 min-w-[50px] text-center">
          <div className="text-lg font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="text-xs">Sec</div>
        </div>
      </div>
    </div>
  );
};
