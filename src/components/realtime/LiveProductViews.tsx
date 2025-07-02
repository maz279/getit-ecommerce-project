import React, { useEffect, useState } from 'react';
import { useWebSocket } from './WebSocketProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, TrendingUp, Users } from 'lucide-react';

interface LiveProductViewsProps {
  productId: string;
  className?: string;
}

interface ViewStats {
  currentViewers: number;
  totalViewsToday: number;
  totalViewsWeek: number;
  peakConcurrentViewers: number;
  isPopular: boolean;
}

export const LiveProductViews: React.FC<LiveProductViewsProps> = ({ 
  productId, 
  className = '' 
}) => {
  const [viewStats, setViewStats] = useState<ViewStats>({
    currentViewers: 0,
    totalViewsToday: 0,
    totalViewsWeek: 0,
    peakConcurrentViewers: 0,
    isPopular: false
  });
  const [isTracking, setIsTracking] = useState(false);
  const { isConnected, subscribe } = useWebSocket();

  useEffect(() => {
    // Track this user's view
    trackView();
    
    // Subscribe to real-time view updates
    const channel = supabase
      .channel(`product-views-${productId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_product_views',
          filter: `product_id=eq.${productId}`
        },
        (payload) => {
          const newData = payload.new as any;
          if (newData) {
            setViewStats(prev => ({
              ...prev,
              currentViewers: newData.current_viewers || 0,
              totalViewsToday: newData.total_views_today || 0,
              totalViewsWeek: newData.total_views_week || 0,
              peakConcurrentViewers: newData.peak_concurrent_viewers || 0,
              isPopular: (newData.current_viewers || 0) > 10
            }));
          }
        }
      )
      .subscribe();

    // Load initial view stats
    loadViewStats();

    return () => {
      channel.unsubscribe();
      // Remove user from current viewers when leaving
      if (isTracking) {
        removeViewTracking();
      }
    };
  }, [productId]);

  const trackView = async () => {
    try {
      setIsTracking(true);
      
      // Track individual view
      await supabase
        .from('product_view_tracking')
        .insert({
          product_id: productId,
          session_id: generateSessionId(),
          ip_address: await getUserIP(),
          user_agent: navigator.userAgent,
          referrer: document.referrer
        });

      // Update live view count (would need custom RPC function)
      console.log('Tracking view for product:', productId);

    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const removeViewTracking = async () => {
    try {
      // Would need custom RPC function to decrement
      console.log('Removing tracking for product:', productId);
      setIsTracking(false);
    } catch (error) {
      console.error('Error removing view tracking:', error);
    }
  };

  const loadViewStats = async () => {
    try {
      const { data, error } = await supabase
        .from('live_product_views')
        .select('*')
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setViewStats({
          currentViewers: data.current_viewers,
          totalViewsToday: data.total_views_today,
          totalViewsWeek: data.total_views_week,
          peakConcurrentViewers: data.peak_concurrent_viewers,
          isPopular: data.current_viewers > 10
        });
      }
    } catch (error) {
      console.error('Error loading view stats:', error);
    }
  };

  const generateSessionId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const getUserIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return '0.0.0.0';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Current Viewers */}
      <Card className="p-3 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Eye className="w-4 h-4 text-primary" />
            {viewStats.currentViewers > 0 && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
          <span className="text-sm font-medium text-foreground">
            {viewStats.currentViewers} viewing now
          </span>
          {viewStats.isPopular && (
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>
      </Card>

      {/* View Statistics */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="p-2">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              {formatNumber(viewStats.totalViewsToday)}
            </div>
            <div className="text-xs text-muted-foreground">Today</div>
          </div>
        </Card>
        
        <Card className="p-2">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              {formatNumber(viewStats.totalViewsWeek)}
            </div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
        </Card>
      </div>

      {/* Peak Viewers */}
      {viewStats.peakConcurrentViewers > 0 && (
        <Card className="p-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Peak viewers:</span>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-primary" />
              <span className="font-medium">{viewStats.peakConcurrentViewers}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Connection Status */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{isConnected ? 'Live updates' : 'Offline'}</span>
      </div>
    </div>
  );
};