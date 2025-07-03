import { supabase } from "@/integrations/supabase/client";

export interface RealtimeEvent {
  type: string;
  payload: any;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface WebSocketConnection {
  id: string;
  userId?: string;
  channels: Set<string>;
  lastActivity: number;
  metadata: Record<string, any>;
}

export class WebSocketManager {
  private static instance: WebSocketManager;
  private connections: Map<string, WebSocketConnection> = new Map();
  private channels: Map<string, Set<string>> = new Map(); // channel -> connectionIds
  private subscriptions: Map<string, any> = new Map();
  private eventHandlers: Map<string, ((event: RealtimeEvent) => void)[]> = new Map();

  private constructor() {
    this.initializeRealtimeSubscriptions();
    this.startHeartbeat();
  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private initializeRealtimeSubscriptions() {
    // Orders real-time updates
    const ordersChannel = supabase
      .channel('orders-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        this.broadcastToChannel('orders', {
          type: 'order_update',
          payload,
          timestamp: new Date().toISOString()
        });
      })
      .subscribe();

    // Products real-time updates  
    const productsChannel = supabase
      .channel('products-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products'
      }, (payload) => {
        this.broadcastToChannel('products', {
          type: 'product_update',
          payload,
          timestamp: new Date().toISOString()
        });
      })
      .subscribe();

    // Inventory real-time updates
    const inventoryChannel = supabase
      .channel('inventory-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'product_inventory'
      }, (payload) => {
        this.broadcastToChannel('inventory', {
          type: 'inventory_update',
          payload,
          timestamp: new Date().toISOString()
        });
      })
      .subscribe();

    // Real-time metrics
    const metricsChannel = supabase
      .channel('metrics-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'real_time_metrics'
      }, (payload) => {
        this.broadcastToChannel('metrics', {
          type: 'metrics_update',
          payload,
          timestamp: new Date().toISOString()
        });
      })
      .subscribe();

    this.subscriptions.set('orders', ordersChannel);
    this.subscriptions.set('products', productsChannel);
    this.subscriptions.set('inventory', inventoryChannel);
    this.subscriptions.set('metrics', metricsChannel);
  }

  connect(userId?: string, metadata: Record<string, any> = {}): string {
    const connectionId = crypto.randomUUID();
    
    const connection: WebSocketConnection = {
      id: connectionId,
      userId,
      channels: new Set(),
      lastActivity: Date.now(),
      metadata
    };

    this.connections.set(connectionId, connection);
    
    // Auto-subscribe to user-specific channels
    if (userId) {
      this.subscribeToChannel(connectionId, `user:${userId}`);
      this.subscribeToChannel(connectionId, 'global');
    }

    return connectionId;
  }

  disconnect(connectionId: string) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    // Remove from all channels
    connection.channels.forEach(channel => {
      this.unsubscribeFromChannel(connectionId, channel);
    });

    this.connections.delete(connectionId);
  }

  subscribeToChannel(connectionId: string, channelName: string) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    connection.channels.add(channelName);
    connection.lastActivity = Date.now();

    if (!this.channels.has(channelName)) {
      this.channels.set(channelName, new Set());
    }
    
    this.channels.get(channelName)!.add(connectionId);
  }

  unsubscribeFromChannel(connectionId: string, channelName: string) {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.channels.delete(channelName);
    }

    const channelConnections = this.channels.get(channelName);
    if (channelConnections) {
      channelConnections.delete(connectionId);
      if (channelConnections.size === 0) {
        this.channels.delete(channelName);
      }
    }
  }

  broadcastToChannel(channelName: string, event: Omit<RealtimeEvent, 'sessionId'>) {
    const connections = this.channels.get(channelName);
    if (!connections) return;

    const fullEvent: RealtimeEvent = {
      ...event,
      sessionId: crypto.randomUUID()
    };

    connections.forEach(connectionId => {
      const connection = this.connections.get(connectionId);
      if (connection) {
        this.sendToConnection(connectionId, fullEvent);
      }
    });

    // Log broadcast for analytics
    this.logEvent('broadcast', {
      channel: channelName,
      eventType: event.type,
      connectionCount: connections.size
    });
  }

  sendToUser(userId: string, event: RealtimeEvent) {
    this.broadcastToChannel(`user:${userId}`, event);
  }

  sendToConnection(connectionId: string, event: RealtimeEvent) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    // Trigger event handlers
    const handlers = this.eventHandlers.get(event.type) || [];
    handlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in event handler:', error);
      }
    });

    connection.lastActivity = Date.now();
  }

  addEventListener(eventType: string, handler: (event: RealtimeEvent) => void) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }

  removeEventListener(eventType: string, handler: (event: RealtimeEvent) => void) {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private startHeartbeat() {
    setInterval(() => {
      const now = Date.now();
      const timeout = 5 * 60 * 1000; // 5 minutes

      // Clean up inactive connections
      for (const [connectionId, connection] of this.connections) {
        if (now - connection.lastActivity > timeout) {
          this.disconnect(connectionId);
        }
      }

      // Send heartbeat to active connections
      this.broadcastToChannel('global', {
        type: 'heartbeat',
        payload: { timestamp: new Date().toISOString() },
        timestamp: new Date().toISOString()
      });
    }, 30000); // Every 30 seconds
  }

  private async logEvent(type: string, data: any) {
    try {
      await supabase.from('real_time_metrics').insert({
        vendor_id: crypto.randomUUID(),
        metric_type: 'websocket',
        metric_key: type,
        metric_value: data
      });
    } catch (error) {
      console.warn('Failed to log realtime event:', error);
    }
  }

  // Get connection statistics
  getStats() {
    const channelStats = Array.from(this.channels.entries()).map(([name, connections]) => ({
      channel: name,
      connectionCount: connections.size
    }));

    return {
      totalConnections: this.connections.size,
      totalChannels: this.channels.size,
      channels: channelStats,
      activeHandlers: Array.from(this.eventHandlers.keys())
    };
  }

  // Business-specific broadcasting methods
  broadcastOrderUpdate(orderId: string, orderData: any) {
    this.broadcastToChannel('orders', {
      type: 'order_status_changed',
      payload: { orderId, ...orderData },
      timestamp: new Date().toISOString()
    });

    // Also send to vendor if applicable
    if (orderData.vendor_id) {
      this.sendToUser(orderData.vendor_id, {
        type: 'vendor_order_update',
        payload: { orderId, ...orderData },
        timestamp: new Date().toISOString()
      });
    }
  }

  broadcastInventoryAlert(productId: string, currentStock: number, minStock: number) {
    this.broadcastToChannel('inventory', {
      type: 'low_stock_alert',
      payload: { productId, currentStock, minStock },
      timestamp: new Date().toISOString()
    });
  }

  broadcastFlashSaleUpdate(flashSaleId: string, remainingTime: number, soldCount: number) {
    this.broadcastToChannel('flash-sales', {
      type: 'flash_sale_update',
      payload: { flashSaleId, remainingTime, soldCount },
      timestamp: new Date().toISOString()
    });
  }
}

export const wsManager = WebSocketManager.getInstance();