import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Bot, 
  User, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SupportMetrics {
  total_conversations: number;
  active_conversations: number;
  avg_response_time: number;
  customer_satisfaction: number;
  ai_resolution_rate: number;
  agent_utilization: number;
}

interface Conversation {
  id: string;
  channel_type: string;
  customer_name: string;
  status: string;
  priority: string;
  created_at: string;
  assigned_agent_id?: string;
  last_message_at: string;
}

export const SupportDashboard = () => {
  const [metrics, setMetrics] = useState<SupportMetrics | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
    
    // Setup realtime subscription
    const channel = supabase
      .channel('support_dashboard')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'multi_channel_conversations' },
        () => loadDashboardData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load conversations - using support_tickets as fallback
      const { data: conversationsData } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Map support tickets to conversation format
      const mappedConversations = conversationsData?.map(ticket => ({
        id: ticket.id,
        channel_type: 'email',
        customer_name: 'Customer',
        status: ticket.status,
        priority: ticket.priority || 'medium',
        created_at: ticket.created_at,
        last_message_at: ticket.updated_at
      })) || [];

      setConversations(mappedConversations);

      // Calculate metrics
      const activeConversations = mappedConversations.filter(c => c.status === 'open').length || 0;
      const totalConversations = conversationsData?.length || 0;

      // Use mock metrics for now
      setMetrics({
        total_conversations: mappedConversations.length,
        active_conversations: activeConversations,
        avg_response_time: 45,
        customer_satisfaction: 4.2,
        ai_resolution_rate: 65,
        agent_utilization: 78
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChannelIcon = (channelType: string) => {
    switch (channelType) {
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      case 'live_chat':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-gray-500" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-purple-500" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Support Dashboard</h1>
        <Button onClick={loadDashboardData}>
          Refresh
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.active_conversations || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {metrics?.total_conversations || 0} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics?.avg_response_time || 0)}s</div>
            <p className="text-xs text-muted-foreground">
              Target: &lt;30s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Resolution Rate</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics?.ai_resolution_rate || 0)}%</div>
            <p className="text-xs text-muted-foreground">
              Automated resolutions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics?.customer_satisfaction || 0).toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Out of 5.0
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {conversations.slice(0, 10).map((conversation) => (
                      <div key={conversation.id} className="flex items-center gap-3 p-2 rounded border">
                        {getChannelIcon(conversation.channel_type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {conversation.customer_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(conversation.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getPriorityColor(conversation.priority)}>
                            {conversation.priority}
                          </Badge>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(conversation.status)}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Channel Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['whatsapp', 'live_chat', 'email', 'phone'].map((channel) => {
                    const count = conversations.filter(c => c.channel_type === channel).length;
                    const percentage = conversations.length > 0 ? (count / conversations.length) * 100 : 0;
                    
                    return (
                      <div key={channel} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(channel)}
                          <span className="text-sm capitalize">{channel.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{count}</span>
                          <div className="w-16 h-2 bg-muted rounded-full">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversations">
          <Card>
            <CardHeader>
              <CardTitle>All Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <div key={conversation.id} className="flex items-center gap-4 p-3 rounded border hover:bg-muted/50">
                      {getChannelIcon(conversation.channel_type)}
                      
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <div>
                          <p className="font-medium">{conversation.customer_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {conversation.channel_type}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm">
                            {new Date(conversation.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last: {new Date(conversation.last_message_at || conversation.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={getPriorityColor(conversation.priority)}>
                            {conversation.priority}
                          </Badge>
                          <Badge variant="outline">
                            {conversation.status}
                          </Badge>
                          {conversation.assigned_agent_id && (
                            <User className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Agent Utilization</span>
                  <span className="font-bold">{Math.round(metrics?.agent_utilization || 0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>AI Resolution Rate</span>
                  <span className="font-bold">{Math.round(metrics?.ai_resolution_rate || 0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Customer Satisfaction</span>
                  <span className="font-bold">{(metrics?.customer_satisfaction || 0).toFixed(1)}/5.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Avg Response Time</span>
                  <span className="font-bold">{Math.round(metrics?.avg_response_time || 0)}s</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['active', 'pending', 'closed'].map((status) => {
                    const count = conversations.filter(c => c.status === status).length;
                    const percentage = conversations.length > 0 ? (count / conversations.length) * 100 : 0;
                    
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                          <span className="text-sm capitalize">{status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{count}</span>
                          <span className="text-xs text-muted-foreground">
                            ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};