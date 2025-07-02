import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WebSocketMessage {
  type: string;
  channel?: string;
  data?: any;
  connectionId?: string;
  timestamp?: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  sendMessage: (type: string, payload: any) => void;
  addMessageListener: (type: string, callback: (data: any) => void) => () => void;
  connectionId: string | null;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
  autoConnect?: boolean;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children, 
  autoConnect = true 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isConnected, setIsConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messageListeners = useRef<Map<string, Set<(data: any) => void>>>(new Map());
  const subscriptions = useRef<Set<string>>(new Set());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (!user || wsRef.current?.readyState === WebSocket.CONNECTING) return;

    try {
      const wsUrl = `wss://bbgppsjmspmymrfowytf.functions.supabase.co/websocket-hub`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        
        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'heartbeat',
              userId: user.id
            }));
          }
        }, 30000); // Send heartbeat every 30 seconds

        toast({
          title: "Connected",
          description: "Real-time connection established",
        });
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setConnectionId(null);
        
        // Clear heartbeat
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }

        // Attempt to reconnect after 3 seconds
        if (autoConnect) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to establish real-time connection",
          variant: "destructive",
        });
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }, [user, autoConnect, toast]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setConnectionId(null);
  }, []);

  const handleMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'connection_established':
        setConnectionId(message.connectionId || null);
        // Re-subscribe to all channels
        subscriptions.current.forEach(channel => {
          subscribe(channel);
        });
        break;

      case 'subscription_confirmed':
        console.log(`Subscribed to channel: ${message.channel}`);
        break;

      case 'broadcast':
        // Handle channel broadcasts
        const listeners = messageListeners.current.get(message.type);
        if (listeners) {
          listeners.forEach(callback => callback(message.data));
        }
        break;

      case 'user_message':
        // Handle direct user messages
        const userListeners = messageListeners.current.get('user_message');
        if (userListeners) {
          userListeners.forEach(callback => callback(message.data));
        }
        break;

      case 'notification':
        // Handle real-time notifications
        const notificationListeners = messageListeners.current.get('notification');
        if (notificationListeners) {
          notificationListeners.forEach(callback => callback(message.data));
        }
        break;

      case 'heartbeat_response':
        // Handle heartbeat response
        break;

      default:
        // Handle other message types
        const typeListeners = messageListeners.current.get(message.type);
        if (typeListeners) {
          typeListeners.forEach(callback => callback(message.data || message));
        }
    }
  };

  const subscribe = useCallback((channel: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        channel,
        userId: user?.id
      }));
    }
    subscriptions.current.add(channel);
  }, [user]);

  const unsubscribe = useCallback((channel: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'unsubscribe',
        channel,
        userId: user?.id
      }));
    }
    subscriptions.current.delete(channel);
  }, [user]);

  const sendMessage = useCallback((type: string, payload: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        payload: {
          type,
          ...payload
        },
        userId: user?.id
      }));
    }
  }, [user]);

  const addMessageListener = useCallback((type: string, callback: (data: any) => void) => {
    if (!messageListeners.current.has(type)) {
      messageListeners.current.set(type, new Set());
    }
    messageListeners.current.get(type)!.add(callback);

    // Return cleanup function
    return () => {
      const listeners = messageListeners.current.get(type);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          messageListeners.current.delete(type);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (user && autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user, autoConnect, connect, disconnect]);

  const value: WebSocketContextType = {
    isConnected,
    subscribe,
    unsubscribe,
    sendMessage,
    addMessageListener,
    connectionId
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};