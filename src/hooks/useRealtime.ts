import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseRealtimeOptions {
  vendorId?: string;
  userId?: string;
  channels?: string[];
}

export const useRealtime = ({ vendorId, userId, channels = [] }: UseRealtimeOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const channelRefs = useRef<any[]>([]);

  useEffect(() => {
    const setupRealtimeSubscriptions = () => {
      // Notifications channel
      if (userId) {
        const notificationsChannel = supabase
          .channel('notifications')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'realtime_notifications',
              filter: `user_id=eq.${userId}`,
            },
            (payload) => {
              setNotifications(prev => [payload.new, ...prev.slice(0, 9)]);
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              setIsConnected(true);
            }
          });

        channelRefs.current.push(notificationsChannel);
      }

      // Vendor analytics channel
      if (vendorId) {
        const analyticsChannel = supabase
          .channel('vendor-analytics')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'realtime_analytics',
              filter: `vendor_id=eq.${vendorId}`,
            },
            (payload) => {
              setAnalytics(prev => [payload.new, ...prev.slice(0, 19)]);
            }
          )
          .subscribe();

        channelRefs.current.push(analyticsChannel);
      }

      // Commission updates channel
      if (vendorId) {
        const commissionChannel = supabase
          .channel('commission-updates')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'commission_realtime_events',
              filter: `vendor_id=eq.${vendorId}`,
            },
            (payload) => {
              // Handle commission updates
              console.log('Commission update:', payload);
            }
          )
          .subscribe();

        channelRefs.current.push(commissionChannel);
      }
    };

    setupRealtimeSubscriptions();

    return () => {
      channelRefs.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelRefs.current = [];
      setIsConnected(false);
    };
  }, [vendorId, userId]);

  const sendNotification = async (notification: any) => {
    // Simplified notification - will be implemented via edge function
    console.log('Sending notification:', notification);
  };

  const trackAnalyticsEvent = async (event: any) => {
    // Simplified analytics tracking - will be implemented via edge function
    console.log('Tracking event:', event);
  };

  return {
    isConnected,
    notifications,
    analytics,
    sendNotification,
    trackAnalyticsEvent,
  };
};