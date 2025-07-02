import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MapPin, Truck, Clock, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { useWebSocket } from './WebSocketProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderTrackingData {
  id: string;
  order_id: string;
  tracking_number?: string;
  carrier?: string;
  current_location?: string;
  status: string;
  status_description?: string;
  estimated_delivery?: string;
  delivery_attempts: number;
  tracking_events: any;
  coordinates?: any;
  last_update: string;
}

interface LiveOrderTrackingProps {
  orderId: string;
  customerId?: string;
}

export const LiveOrderTracking: React.FC<LiveOrderTrackingProps> = ({ 
  orderId, 
  customerId 
}) => {
  const { toast } = useToast();
  const { subscribe, unsubscribe, addMessageListener, isConnected } = useWebSocket();
  const [trackingData, setTrackingData] = useState<OrderTrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial tracking data
  useEffect(() => {
    const loadTrackingData = async () => {
      try {
        const { data, error } = await supabase
          .from('live_order_tracking')
          .select('*')
          .eq('order_id', orderId)
          .eq('is_active', true)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setTrackingData(data);
      } catch (err) {
        console.error('Error loading tracking data:', err);
        setError('Failed to load tracking information');
        toast({
          title: "Error",
          description: "Failed to load tracking information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTrackingData();
  }, [orderId, toast]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isConnected) return;

    const channel = `order_tracking_${orderId}`;
    subscribe(channel);

    const cleanup = addMessageListener('order_status_update', (data) => {
      if (data.orderId === orderId) {
        setTrackingData(prev => prev ? { ...prev, ...data.tracking } : data.tracking);
        
        toast({
          title: "Order Update",
          description: data.tracking.status_description || `Order status updated to ${data.tracking.status}`,
        });
      }
    });

    return () => {
      unsubscribe(channel);
      cleanup();
    };
  }, [orderId, subscribe, unsubscribe, addMessageListener, isConnected, toast]);

  const getStatusIcon = (status: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      pending: <Clock className="h-4 w-4" />,
      processing: <Package className="h-4 w-4" />,
      shipped: <Truck className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
      cancelled: <AlertCircle className="h-4 w-4" />,
      returned: <AlertCircle className="h-4 w-4" />
    };
    return iconMap[status] || <Package className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      pending: 'secondary',
      processing: 'default',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive',
      returned: 'destructive'
    };
    return colorMap[status] || 'secondary';
  };

  const getProgressPercentage = (status: string) => {
    const progressMap: { [key: string]: number } = {
      pending: 10,
      processing: 30,
      shipped: 70,
      delivered: 100,
      cancelled: 0,
      returned: 0
    };
    return progressMap[status] || 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading tracking information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !trackingData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-muted-foreground">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error || 'No tracking information available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Tracking Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(trackingData.status)}
              Order Tracking
            </CardTitle>
            <Badge variant={getStatusColor(trackingData.status) as any}>
              {trackingData.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Order Progress</span>
              <span>{getProgressPercentage(trackingData.status)}%</span>
            </div>
            <Progress value={getProgressPercentage(trackingData.status)} />
          </div>

          {/* Tracking Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trackingData.tracking_number && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tracking Number</label>
                <p className="font-mono">{trackingData.tracking_number}</p>
              </div>
            )}
            
            {trackingData.carrier && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Carrier</label>
                <p>{trackingData.carrier}</p>
              </div>
            )}
            
            {trackingData.current_location && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Location</label>
                <p className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {trackingData.current_location}
                </p>
              </div>
            )}
            
            {trackingData.estimated_delivery && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Estimated Delivery</label>
                <p>{formatDate(trackingData.estimated_delivery)}</p>
              </div>
            )}
          </div>

          {trackingData.status_description && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">{trackingData.status_description}</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Last updated: {formatDate(trackingData.last_update)}
          </div>
        </CardContent>
      </Card>

      {/* Tracking Events */}
      {trackingData.tracking_events && trackingData.tracking_events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tracking History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trackingData.tracking_events.map((event, index) => (
                <div key={index} className="flex gap-3 pb-3 border-b last:border-b-0">
                  <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{event.description}</p>
                        {event.location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(event.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Status */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          {isConnected ? 'Live updates enabled' : 'Connecting...'}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};