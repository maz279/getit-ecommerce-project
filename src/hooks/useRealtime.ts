import { useEffect, useState, useCallback, useRef } from 'react';
import { wsManager, RealtimeEvent } from '@/services/realtime/WebSocketManager';

export interface UseRealtimeOptions {
  userId?: string;
  channels?: string[];
  autoConnect?: boolean;
  metadata?: Record<string, any>;
}

export interface RealtimeState {
  isConnected: boolean;
  connectionId: string | null;
  lastEvent: RealtimeEvent | null;
  stats: any;
}

export function useRealtime(options: UseRealtimeOptions = {}) {
  const [state, setState] = useState<RealtimeState>({
    isConnected: false,
    connectionId: null,
    lastEvent: null,
    stats: null
  });

  const eventHandlersRef = useRef<Map<string, ((event: RealtimeEvent) => void)[]>>(new Map());
  const connectionIdRef = useRef<string | null>(null);

  const connect = useCallback(() => {
    if (connectionIdRef.current) return connectionIdRef.current;

    const connectionId = wsManager.connect(options.userId, options.metadata || {});
    connectionIdRef.current = connectionId;

    // Subscribe to initial channels
    if (options.channels) {
      options.channels.forEach(channel => {
        wsManager.subscribeToChannel(connectionId, channel);
      });
    }

    setState(prev => ({
      ...prev,
      isConnected: true,
      connectionId
    }));

    return connectionId;
  }, [options.userId, options.channels, options.metadata]);

  const disconnect = useCallback(() => {
    if (connectionIdRef.current) {
      wsManager.disconnect(connectionIdRef.current);
      connectionIdRef.current = null;
      
      setState(prev => ({
        ...prev,
        isConnected: false,
        connectionId: null
      }));
    }
  }, []);

  const subscribeToChannel = useCallback((channel: string) => {
    if (connectionIdRef.current) {
      wsManager.subscribeToChannel(connectionIdRef.current, channel);
    }
  }, []);

  const unsubscribeFromChannel = useCallback((channel: string) => {
    if (connectionIdRef.current) {
      wsManager.unsubscribeFromChannel(connectionIdRef.current, channel);
    }
  }, []);

  const addEventListener = useCallback((eventType: string, handler: (event: RealtimeEvent) => void) => {
    const handlers = eventHandlersRef.current.get(eventType) || [];
    handlers.push(handler);
    eventHandlersRef.current.set(eventType, handlers);
    
    wsManager.addEventListener(eventType, handler);
  }, []);

  const removeEventListener = useCallback((eventType: string, handler: (event: RealtimeEvent) => void) => {
    const handlers = eventHandlersRef.current.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
        eventHandlersRef.current.set(eventType, handlers);
      }
    }
    
    wsManager.removeEventListener(eventType, handler);
  }, []);

  const sendMessage = useCallback((channel: string, eventType: string, payload: any) => {
    wsManager.broadcastToChannel(channel, {
      type: eventType,
      payload,
      timestamp: new Date().toISOString()
    });
  }, []);

  const sendToUser = useCallback((userId: string, eventType: string, payload: any) => {
    wsManager.sendToUser(userId, {
      type: eventType,
      payload,
      timestamp: new Date().toISOString()
    });
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (options.autoConnect !== false) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [options.autoConnect, connect, disconnect]);

  // Update stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        stats: wsManager.getStats()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Set up global event listener for state updates
  useEffect(() => {
    const handleEvent = (event: RealtimeEvent) => {
      setState(prev => ({
        ...prev,
        lastEvent: event
      }));
    };

    wsManager.addEventListener('*', handleEvent);
    
    return () => {
      wsManager.removeEventListener('*', handleEvent);
    };
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    subscribeToChannel,
    unsubscribeFromChannel,
    addEventListener,
    removeEventListener,
    sendMessage,
    sendToUser
  };
}

// Specialized hooks for common use cases
export function useOrderUpdates(userId?: string) {
  const { addEventListener, removeEventListener, subscribeToChannel, ...rest } = useRealtime({
    userId,
    channels: ['orders'],
    autoConnect: true
  });

  const [orderUpdates, setOrderUpdates] = useState<any[]>([]);

  useEffect(() => {
    const handleOrderUpdate = (event: RealtimeEvent) => {
      if (event.type === 'order_update' || event.type === 'order_status_changed') {
        setOrderUpdates(prev => [event.payload, ...prev.slice(0, 9)]); // Keep last 10
      }
    };

    addEventListener('order_update', handleOrderUpdate);
    addEventListener('order_status_changed', handleOrderUpdate);

    return () => {
      removeEventListener('order_update', handleOrderUpdate);
      removeEventListener('order_status_changed', handleOrderUpdate);
    };
  }, [addEventListener, removeEventListener]);

  return {
    ...rest,
    orderUpdates
  };
}

export function useInventoryAlerts(vendorId?: string) {
  const { addEventListener, removeEventListener, subscribeToChannel, ...rest } = useRealtime({
    userId: vendorId,
    channels: ['inventory'],
    autoConnect: true
  });

  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const handleInventoryAlert = (event: RealtimeEvent) => {
      if (event.type === 'low_stock_alert' || event.type === 'inventory_update') {
        setAlerts(prev => [event.payload, ...prev.slice(0, 19)]); // Keep last 20
      }
    };

    addEventListener('low_stock_alert', handleInventoryAlert);
    addEventListener('inventory_update', handleInventoryAlert);

    return () => {
      removeEventListener('low_stock_alert', handleInventoryAlert);
      removeEventListener('inventory_update', handleInventoryAlert);
    };
  }, [addEventListener, removeEventListener]);

  return {
    ...rest,
    alerts
  };
}

export function useFlashSaleUpdates() {
  const { addEventListener, removeEventListener, subscribeToChannel, ...rest } = useRealtime({
    channels: ['flash-sales'],
    autoConnect: true
  });

  const [flashSaleData, setFlashSaleData] = useState<any>(null);

  useEffect(() => {
    const handleFlashSaleUpdate = (event: RealtimeEvent) => {
      if (event.type === 'flash_sale_update') {
        setFlashSaleData(event.payload);
      }
    };

    addEventListener('flash_sale_update', handleFlashSaleUpdate);

    return () => {
      removeEventListener('flash_sale_update', handleFlashSaleUpdate);
    };
  }, [addEventListener, removeEventListener]);

  return {
    ...rest,
    flashSaleData
  };
}