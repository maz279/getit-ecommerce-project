/**
 * Real-time WebSocket Hook
 * Manages WebSocket connections for live data
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RealtimeMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface RealtimeEvent {
  type: string;
  payload: any;
  timestamp: string;
}

export interface UseRealtimeOptions {
  userId?: string;
  channels?: string[];
  autoConnect?: boolean;
  metadata?: Record<string, any>;
}

export const useRealtime = (options: UseRealtimeOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [lastMessage, setLastMessage] = useState<RealtimeMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const channelRef = useRef<any>(null);
  const listenersRef = useRef<Map<string, ((data: any) => void)[]>>(new Map());

  // Connect to real-time
  const connect = useCallback(() => {
    if (channelRef.current) {
      return;
    }

    setConnectionState('connecting');
    setError(null);

    try {
      channelRef.current = supabase.channel('realtime-dashboard', {
        config: {
          broadcast: { self: true },
          presence: { key: 'user_id' }
        }
      });

      channelRef.current
        .on('broadcast', { event: '*' }, (payload: any) => {
          const message: RealtimeMessage = {
            type: payload.event,
            data: payload.payload,
            timestamp: new Date().toISOString()
          };

          setLastMessage(message);

          // Notify listeners
          const listeners = listenersRef.current.get(payload.event) || [];
          listeners.forEach(listener => listener(payload.payload));
        })
        .subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            setConnectionState('connected');
          } else if (status === 'CHANNEL_ERROR') {
            setIsConnected(false);
            setConnectionState('disconnected');
            setError('Connection failed');
          }
        });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setConnectionState('disconnected');
    }
  }, []);

  // Disconnect from real-time
  const disconnect = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    setIsConnected(false);
    setConnectionState('disconnected');
  }, []);

  // Add event listener
  const addEventListener = useCallback((event: string, listener: (data: any) => void) => {
    const currentListeners = listenersRef.current.get(event) || [];
    listenersRef.current.set(event, [...currentListeners, listener]);
  }, []);

  // Remove event listener
  const removeEventListener = useCallback((event: string, listener: (data: any) => void) => {
    const currentListeners = listenersRef.current.get(event) || [];
    const filteredListeners = currentListeners.filter(l => l !== listener);
    
    if (filteredListeners.length === 0) {
      listenersRef.current.delete(event);
    } else {
      listenersRef.current.set(event, filteredListeners);
    }
  }, []);

  // Send message
  const sendMessage = useCallback((event: string, data: any) => {
    if (channelRef.current && isConnected) {
      channelRef.current.send({
        type: 'broadcast',
        event,
        payload: data
      });
    }
  }, [isConnected]);

  // Auto-connect on mount
  useEffect(() => {
    if (options.autoConnect !== false) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [options.autoConnect, connect, disconnect]);

  return {
    isConnected,
    connectionState,
    lastMessage,
    error,
    connect,
    disconnect,
    addEventListener,
    removeEventListener,
    sendMessage
  };
};