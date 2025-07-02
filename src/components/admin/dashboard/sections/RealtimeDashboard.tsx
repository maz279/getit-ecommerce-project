import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Zap, Users, MessageSquare, BarChart3, Globe } from 'lucide-react';
import { toast } from "sonner";

interface WebSocketSession {
  id: string;
  session_id: string;
  user_id: string;
  connection_status: string;
  connected_at: string;
  last_activity: string;
  message_count: number;
  channel_subscriptions: any;
}

interface EventStream {
  id: string;
  event_type: string;
  source_service: string;
  processing_status: string;
  event_timestamp: string;
  event_payload: any;
}

interface BusinessMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_type: string;
  time_window: string;
  dimensions: any;
}

export const RealtimeDashboard: React.FC = () => {
  const [sessions, setSessions] = useState<WebSocketSession[]>([]);
  const [events, setEvents] = useState<EventStream[]>([]);
  const [metrics, setMetrics] = useState<BusinessMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsResponse, eventsResponse, metricsResponse] = await Promise.all([
        supabase
          .from('websocket_sessions')
          .select('*')
          .order('connected_at', { ascending: false })
          .limit(20),
        supabase
          .from('event_streams')
          .select('*')
          .order('event_timestamp', { ascending: false })
          .limit(50),
        supabase
          .from('realtime_business_metrics')
          .select('*')
          .order('time_window', { ascending: false })
          .limit(100)
      ]);

      if (sessionsResponse.data) setSessions(sessionsResponse.data);
      if (eventsResponse.data) setEvents(eventsResponse.data);
      if (metricsResponse.data) setMetrics(metricsResponse.data);
    } catch (error) {
      console.error('Error fetching realtime data:', error);
      toast.error('Failed to fetch realtime data');
    } finally {
      setLoading(false);
    }
  };

  const publishTestEvent = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('realtime-event-gateway', {
        body: {
          action: 'publish_event',
          event_data: {
            type: 'test_event',
            source: 'dashboard',
            payload: {
              message: 'Test event from dashboard',
              timestamp: new Date().toISOString()
            },
            customer_id: crypto.randomUUID(),
            session_id: crypto.randomUUID()
          }
        }
      });

      if (error) throw error;
      toast.success('Test event published successfully');
      fetchData();
    } catch (error) {
      console.error('Failed to publish test event:', error);
      toast.error('Failed to publish test event');
    }
  };

  const processEvents = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('realtime-event-gateway', {
        body: { action: 'process_events' }
      });

      if (error) throw error;
      toast.success(`Processed ${data.processed_count} events`);
      fetchData();
    } catch (error) {
      console.error('Failed to process events:', error);
      toast.error('Failed to process events');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'pending': return 'outline';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const calculateMetrics = () => {
    const activeSessions = sessions.filter(s => s.connection_status === 'active').length;
    const totalMessages = sessions.reduce((sum, s) => sum + s.message_count, 0);
    const pendingEvents = events.filter(e => e.processing_status === 'pending').length;
    const recentRevenue = metrics
      .filter(m => m.metric_name === 'revenue')
      .reduce((sum, m) => sum + m.metric_value, 0);

    return { activeSessions, totalMessages, pendingEvents, recentRevenue };
  };

  const stats = calculateMetrics();

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Real-time Gateway Dashboard</h1>
          <p className="text-muted-foreground">WebSocket connections, event streams, and real-time analytics</p>
        </div>
        <div className="space-x-2">
          <Button onClick={publishTestEvent} variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Publish Test Event
          </Button>
          <Button onClick={processEvents}>
            <Activity className="h-4 w-4 mr-2" />
            Process Events
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              WebSocket connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              Total processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real-time Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.recentRevenue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">
            <Users className="h-4 w-4 mr-2" />
            WebSocket Sessions
          </TabsTrigger>
          <TabsTrigger value="events">
            <Activity className="h-4 w-4 mr-2" />
            Event Streams
          </TabsTrigger>
          <TabsTrigger value="metrics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Business Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Active WebSocket Sessions</CardTitle>
              <CardDescription>Real-time connection monitoring and management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{session.session_id.slice(0, 8)}...</p>
                        <Badge variant={getStatusColor(session.connection_status)}>
                          {session.connection_status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Connected: {new Date(session.connected_at).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Channels: {session.channel_subscriptions?.length || 0}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{session.message_count}</p>
                      <p className="text-xs text-muted-foreground">messages</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event Stream Processing</CardTitle>
              <CardDescription>Real-time event processing and routing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{event.event_type}</p>
                        <Badge variant={getStatusColor(event.processing_status)}>
                          {event.processing_status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Source: {event.source_service}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.event_timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Business Metrics</CardTitle>
              <CardDescription>Live business intelligence and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.slice(0, 20).map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{metric.metric_name.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        Type: {metric.metric_type} • {new Date(metric.time_window).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {metric.metric_name === 'revenue' ? '৳' : ''}{metric.metric_value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealtimeDashboard;