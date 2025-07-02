import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Flame, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FlashSaleCountdownProps {
  saleId: string;
  className?: string;
  showProgress?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

interface CountdownData {
  timeRemaining: TimeRemaining;
  progress: number;
  isActive: boolean;
  hasStarted: boolean;
  hasEnded: boolean;
  title?: string;
  endTime?: string;
}

export const FlashSaleCountdown: React.FC<FlashSaleCountdownProps> = ({
  saleId,
  className = '',
  showProgress = true
}) => {
  const [countdownData, setCountdownData] = useState<CountdownData>({
    timeRemaining: { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true },
    progress: 0,
    isActive: false,
    hasStarted: false,
    hasEnded: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSaleData();
    
    // Subscribe to flash sale updates
    const channel = supabase
      .channel(`flash-sale-${saleId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'flash_sales',
          filter: `id=eq.${saleId}`
        },
        () => {
          loadSaleData();
        }
      )
      .subscribe();

    // Update countdown every second
    const interval = setInterval(() => {
      if (countdownData.endTime && !countdownData.hasEnded) {
        updateCountdown(countdownData.endTime);
      }
    }, 1000);

    return () => {
      channel.unsubscribe();
      clearInterval(interval);
    };
  }, [saleId]);

  const loadSaleData = async () => {
    try {
      const { data: sale, error } = await supabase
        .from('flash_sales')
        .select('*')
        .eq('id', saleId)
        .single();

      if (error) throw error;

      const timeRemaining = calculateTimeRemaining(sale.end_time);
      const progress = calculateProgress(sale.start_time, sale.end_time);

      setCountdownData({
        timeRemaining,
        progress,
        isActive: sale.status === 'active',
        hasStarted: new Date(sale.start_time) <= new Date(),
        hasEnded: new Date(sale.end_time) <= new Date(),
        title: sale.title,
        endTime: sale.end_time
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading sale data:', error);
      setIsLoading(false);
    }
  };

  const updateCountdown = (endTime: string) => {
    const timeRemaining = calculateTimeRemaining(endTime);
    setCountdownData(prev => ({
      ...prev,
      timeRemaining
    }));
  };

  const calculateTimeRemaining = (endTime: string): TimeRemaining => {
    const end = new Date(endTime);
    const now = new Date();
    const remaining = end.getTime() - now.getTime();

    if (remaining <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, expired: false };
  };

  const calculateProgress = (startTime: string, endTime: string): number => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();

    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  };

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  const getUrgencyLevel = (): 'low' | 'medium' | 'high' => {
    const { timeRemaining } = countdownData;
    const totalMinutes = timeRemaining.days * 24 * 60 + timeRemaining.hours * 60 + timeRemaining.minutes;
    
    if (totalMinutes <= 60) return 'high';
    if (totalMinutes <= 360) return 'medium';
    return 'low';
  };

  const urgencyLevel = getUrgencyLevel();
  const isExpiringSoon = urgencyLevel === 'high';

  if (isLoading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (countdownData.hasEnded || countdownData.timeRemaining.expired) {
    return (
      <Card className={`p-4 bg-muted ${className}`}>
        <div className="text-center">
          <Badge variant="secondary" className="mb-2">
            Sale Ended
          </Badge>
          <p className="text-sm text-muted-foreground">This flash sale has expired</p>
        </div>
      </Card>
    );
  }

  if (!countdownData.hasStarted) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="text-center">
          <Badge className="mb-2">
            <Clock className="w-3 h-3 mr-1" />
            Coming Soon
          </Badge>
          <p className="text-sm text-muted-foreground">Flash sale starts soon!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${isExpiringSoon ? 'ring-2 ring-destructive animate-pulse' : ''} ${className}`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className={`w-4 h-4 ${isExpiringSoon ? 'text-destructive' : 'text-primary'}`} />
            <span className="font-medium text-sm">Flash Sale</span>
          </div>
          <Badge 
            variant={isExpiringSoon ? 'destructive' : urgencyLevel === 'medium' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {isExpiringSoon && <Zap className="w-3 h-3 mr-1" />}
            {urgencyLevel === 'high' ? 'Ending Soon!' : 
             urgencyLevel === 'medium' ? 'Limited Time' : 'Active'}
          </Badge>
        </div>

        {/* Countdown Display */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="space-y-1">
            <div className={`text-lg font-bold ${isExpiringSoon ? 'text-destructive' : 'text-primary'}`}>
              {formatTime(countdownData.timeRemaining.days)}
            </div>
            <div className="text-xs text-muted-foreground">Days</div>
          </div>
          <div className="space-y-1">
            <div className={`text-lg font-bold ${isExpiringSoon ? 'text-destructive' : 'text-primary'}`}>
              {formatTime(countdownData.timeRemaining.hours)}
            </div>
            <div className="text-xs text-muted-foreground">Hours</div>
          </div>
          <div className="space-y-1">
            <div className={`text-lg font-bold ${isExpiringSoon ? 'text-destructive' : 'text-primary'}`}>
              {formatTime(countdownData.timeRemaining.minutes)}
            </div>
            <div className="text-xs text-muted-foreground">Mins</div>
          </div>
          <div className="space-y-1">
            <div className={`text-lg font-bold ${isExpiringSoon ? 'text-destructive' : 'text-primary'}`}>
              {formatTime(countdownData.timeRemaining.seconds)}
            </div>
            <div className="text-xs text-muted-foreground">Secs</div>
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="space-y-1">
            <Progress 
              value={countdownData.progress} 
              className={`h-2 ${isExpiringSoon ? '[&>div]:bg-destructive' : ''}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Started</span>
              <span>{Math.round(countdownData.progress)}% complete</span>
              <span>Ends</span>
            </div>
          </div>
        )}

        {/* Warning Message */}
        {isExpiringSoon && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2">
            <p className="text-xs text-destructive font-medium text-center">
              ⚡ Last chance! Sale ends in under 1 hour
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};