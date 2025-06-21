
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
    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-md p-2 inline-block shadow-lg">
      <div className="flex items-center justify-center gap-1 mb-1">
        <Clock className="w-3 h-3" />
        <span className="font-semibold text-xs">ENDING IN:</span>
      </div>
      <div className="flex gap-1 justify-center">
        <div className="bg-white bg-opacity-20 rounded p-1 min-w-[35px] text-center">
          <div className="text-sm font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
          <div className="text-xs">Days</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded p-1 min-w-[35px] text-center">
          <div className="text-sm font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="text-xs">Hrs</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded p-1 min-w-[35px] text-center">
          <div className="text-sm font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="text-xs">Min</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded p-1 min-w-[35px] text-center">
          <div className="text-sm font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="text-xs">Sec</div>
        </div>
      </div>
    </div>
  );
};
