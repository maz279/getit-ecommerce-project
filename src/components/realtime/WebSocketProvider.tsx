import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  source: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => void;
  subscribe: (type: string, callback: (message: WebSocketMessage) => void) => () => void;
  lastMessage: WebSocketMessage | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
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
  endpoint?: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  endpoint = '/realtime-hub'
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const subscribersRef = useRef<Map<string, Set<(message: WebSocketMessage) => void>>>(new Map());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.CONNECTING || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    
    try {
      // Use proper WebSocket endpoint
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}${endpoint}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;
        console.log('WebSocket connected');

        // Send authentication token if available
        const token = localStorage.getItem('supabase.auth.token');
        if (token) {
          sendMessage({
            type: 'auth',
            payload: { token },
            timestamp: Date.now(),
            source: 'client'
          });
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          
          // Notify subscribers
          const subscribers = subscribersRef.current.get(message.type);
          if (subscribers) {
            subscribers.forEach(callback => callback(message));
          }

          // Handle system messages
          handleSystemMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        console.log('WebSocket disconnected:', event.code, event.reason);

        // Attempt to reconnect unless it was intentionally closed
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          scheduleReconnect();
        }
      };

      wsRef.current.onerror = (error) => {
        setConnectionStatus('error');
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      setConnectionStatus('error');
      console.error('Error creating WebSocket connection:', error);
    }
  };

  const scheduleReconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
    reconnectAttempts.current++;

    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})`);
      connect();
    }, delay);
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  };

  const subscribe = (type: string, callback: (message: WebSocketMessage) => void) => {
    if (!subscribersRef.current.has(type)) {
      subscribersRef.current.set(type, new Set());
    }
    
    subscribersRef.current.get(type)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = subscribersRef.current.get(type);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          subscribersRef.current.delete(type);
        }
      }
    };
  };

  const handleSystemMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'ping':
        sendMessage({
          type: 'pong',
          payload: message.payload,
          timestamp: Date.now(),
          source: 'client'
        });
        break;
      
      case 'auth_required':
        // Handle authentication requirement
        window.location.href = '/login';
        break;
      
      case 'rate_limit':
        console.warn('Rate limit exceeded:', message.payload);
        break;
      
      default:
        // Handle other system messages
        break;
    }
  };

  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
      }
    };
  }, []);

  // Monitor connection and attempt reconnection
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isConnected && connectionStatus !== 'connecting' && reconnectAttempts.current < maxReconnectAttempts) {
        connect();
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [isConnected, connectionStatus]);

  const value: WebSocketContextType = {
    isConnected,
    sendMessage,
    subscribe,
    lastMessage,
    connectionStatus
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};