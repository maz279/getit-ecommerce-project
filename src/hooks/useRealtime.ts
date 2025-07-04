import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { wsManager } from '@/services/websocket/WebSocketManager';
import { serviceIntegration } from '@/services/integration/ServiceIntegrationLayer';

interface RealtimeConfig {
  channels?: string[];
  events?: string[];
  autoConnect?: boolean;
}

interface RealtimeMetrics {
  activeConnections: number;
  messagesSent: number;
  messagesReceived: number;
  lastUpdate: string;
}

export const useRealtime = (config: RealtimeConfig = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [channels, setChannels] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<RealtimeMetrics>({
    activeConnections: 0,
    messagesSent: 0,
    messagesReceived: 0,
    lastUpdate: new Date().toISOString()
  });
  const [error, setError] = useState<string | null>(null);

  const { 
    channels: configChannels = [], 
    events = [], 
    autoConnect = true 
  } = config;

  // Subscribe to realtime channel
  const subscribe = useCallback((channelName: string, eventName: string, callback: (payload: any) => void) => {
    try {
      const channel = supabase
        .channel(channelName)
        .on('broadcast', { event: eventName }, callback)
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            setChannels(prev => [...prev.filter(c => c.name !== channelName), { name: channelName, status }]);
          }
        });

      return channel;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe to channel');
      return null;
    }
  }, []);

  // Unsubscribe from channel
  const unsubscribe = useCallback((channel: any) => {
    if (channel) {
      supabase.removeChannel(channel);
      setChannels(prev => prev.filter(c => c.name !== channel.topic));
    }
  }, []);

  // Send realtime message
  const sendMessage = useCallback(async (channelName: string, event: string, payload: any) => {
    try {
      const channel = supabase.channel(channelName);
      await channel.send({
        type: 'broadcast',
        event,
        payload
      });
      
      setMetrics(prev => ({
        ...prev,
        messagesSent: prev.messagesSent + 1,
        lastUpdate: new Date().toISOString()
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  }, []);

  // Get live data from specific table
  const getLiveData = useCallback(async (table: string, filters?: Record<string, any>) => {
    try {
      const response = await serviceIntegration.callService('realtime-analytics', '/live-data', {
        method: 'POST',
        body: JSON.stringify({ table, filters })
      });
      
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get live data');
      return null;
    }
  }, []);

  // Subscribe to live inventory updates
  const subscribeToInventory = useCallback((callback: (data: any) => void) => {
    return subscribe('inventory-updates', 'UPDATE', callback);
  }, [subscribe]);

  // Subscribe to live order updates
  const subscribeToOrders = useCallback((callback: (data: any) => void) => {
    return subscribe('order-updates', 'INSERT', callback);
  }, [subscribe]);

  // Subscribe to live analytics
  const subscribeToAnalytics = useCallback((callback: (data: any) => void) => {
    return subscribe('analytics-updates', '*', callback);
  }, [subscribe]);

  // Get realtime metrics
  const getMetrics = useCallback(async () => {
    try {
      const response = await serviceIntegration.callService('realtime-analytics', '/metrics');
      if (response.success && response.data) {
        const data = response.data as any;
        setMetrics(prev => ({
          ...prev,
          activeConnections: data.activeConnections || prev.activeConnections,
          messagesSent: data.messagesSent || prev.messagesSent,
          messagesReceived: data.messagesReceived || prev.messagesReceived,
          lastUpdate: new Date().toISOString()
        }));
      }
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
  }, []);

  // Auto-connect to configured channels
  useEffect(() => {
    if (autoConnect && configChannels.length > 0) {
      const activeChannels = configChannels.map(channelName => {
        return subscribe(channelName, '*', (payload) => {
          setMetrics(prev => ({
            ...prev,
            messagesReceived: prev.messagesReceived + 1,
            lastUpdate: new Date().toISOString()
          }));
        });
      });

      return () => {
        activeChannels.forEach(channel => {
          if (channel) unsubscribe(channel);
        });
      };
    }
  }, [autoConnect, configChannels, subscribe, unsubscribe]);

  // Periodic metrics update
  useEffect(() => {
    const interval = setInterval(getMetrics, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [getMetrics]);

  return {
    isConnected,
    channels,
    metrics,
    error,
    subscribe,
    unsubscribe,
    sendMessage,
    getLiveData,
    subscribeToInventory,
    subscribeToOrders,
    subscribeToAnalytics,
    getMetrics
  };
};