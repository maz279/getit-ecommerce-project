import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Sankey, AreaChart, Area } from 'recharts';
import { 
  User, 
  Eye, 
  ShoppingCart, 
  CreditCard, 
  CheckCircle, 
  ArrowRight, 
  TrendingUp,
  Clock,
  Target,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface JourneyStage {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
}

interface CustomerJourney {
  customer_id: string;
  journey_start: string;
  current_stage_id: string;
  total_interactions: number;
  last_interaction: string;
  conversion_value?: number;
}

const journeyStages: JourneyStage[] = [
  { 
    id: 'awareness', 
    name: 'Awareness', 
    icon: Eye, 
    color: 'bg-blue-500', 
    description: 'Customer discovers the platform' 
  },
  { 
    id: 'consideration', 
    name: 'Consideration', 
    icon: User, 
    color: 'bg-yellow-500', 
    description: 'Browsing and comparing products' 
  },
  { 
    id: 'intent', 
    name: 'Purchase Intent', 
    icon: ShoppingCart, 
    color: 'bg-orange-500', 
    description: 'Adding items to cart' 
  },
  { 
    id: 'purchase', 
    name: 'Purchase', 
    icon: CreditCard, 
    color: 'bg-green-500', 
    description: 'Completing the transaction' 
  },
  { 
    id: 'retention', 
    name: 'Retention', 
    icon: CheckCircle, 
    color: 'bg-purple-500', 
    description: 'Repeat purchases and loyalty' 
  }
];

export default function CustomerJourneyVisualizer() {
  const [journeys, setJourneys] = useState<CustomerJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchCustomerJourneys();
  }, [timeRange]);

  const fetchCustomerJourneys = async () => {
    try {
      setLoading(true);
      
      // Fetch customer journey data
      const { data, error } = await supabase
        .from('customer_journey_analytics')
        .select('*')
        .gte('journey_start', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('last_interaction', { ascending: false })
        .limit(100);

      if (error) throw error;
      setJourneys(data || []);
    } catch (error) {
      console.error('Error fetching customer journeys:', error);
    } finally {
      setLoading(false);
    }
  };

  const getJourneyMetrics = () => {
    const totalCustomers = journeys.length;
    const avgInteractions = journeys.reduce((sum, j) => sum + j.total_interactions, 0) / totalCustomers || 0;
    
    const stageDistribution = journeyStages.map(stage => ({
      stage: stage.name,
      count: journeys.filter(j => j.current_stage_id === stage.id).length,
      percentage: ((journeys.filter(j => j.current_stage_id === stage.id).length / totalCustomers) * 100) || 0
    }));

    const conversionRate = ((journeys.filter(j => j.current_stage_id === 'purchase').length / totalCustomers) * 100) || 0;

    return {
      totalCustomers,
      avgInteractions: Math.round(avgInteractions * 10) / 10,
      stageDistribution,
      conversionRate: Math.round(conversionRate * 10) / 10
    };
  };

  const metrics = getJourneyMetrics();

  const JourneyFlowVisualization = () => {
    const flowData = journeyStages.map((stage, index) => {
      const stageCustomers = journeys.filter(j => j.current_stage_id === stage.id).length;
      const nextStage = journeyStages[index + 1];
      const nextStageCustomers = nextStage ? 
        journeys.filter(j => j.current_stage_id === nextStage.id).length : 0;
      
      return {
        stage: stage.name,
        customers: stageCustomers,
        dropoff: index > 0 ? Math.max(0, stageCustomers - nextStageCustomers) : 0,
        conversionRate: index > 0 ? (nextStageCustomers / stageCustomers * 100) || 0 : 100
      };
    });

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {journeyStages.map((stage, index) => {
            const StageIcon = stage.icon;
            const stageData = flowData[index];
            
            return (
              <div key={stage.id} className="relative">
                <Card className="hover-scale">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-full ${stage.color} flex items-center justify-center mx-auto mb-3`}>
                      <StageIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm">{stage.name}</h3>
                    <p className="text-2xl font-bold mt-1">{stageData.customers}</p>
                    <p className="text-xs text-muted-foreground">{stage.description}</p>
                    {index > 0 && (
                      <Badge variant="secondary" className="mt-2">
                        {stageData.conversionRate.toFixed(1)}% conversion
                      </Badge>
                    )}
                  </CardContent>
                </Card>
                
                {index < journeyStages.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Journey Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="customers" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const TimelineAnalysis = () => {
    // Mock timeline data for visualization
    const timelineData = [
      { day: 'Mon', awareness: 120, consideration: 85, intent: 45, purchase: 28, retention: 15 },
      { day: 'Tue', awareness: 135, consideration: 92, intent: 52, purchase: 31, retention: 18 },
      { day: 'Wed', awareness: 128, consideration: 88, intent: 48, purchase: 29, retention: 16 },
      { day: 'Thu', awareness: 142, consideration: 98, intent: 58, purchase: 35, retention: 22 },
      { day: 'Fri', awareness: 156, consideration: 108, intent: 65, purchase: 42, retention: 28 },
      { day: 'Sat', awareness: 178, consideration: 125, intent: 78, purchase: 48, retention: 32 },
      { day: 'Sun', awareness: 165, consideration: 115, intent: 68, purchase: 41, retention: 25 },
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Journey Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="awareness" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="consideration" stroke="#eab308" strokeWidth={2} />
                <Line type="monotone" dataKey="intent" stroke="#f97316" strokeWidth={2} />
                <Line type="monotone" dataKey="purchase" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="retention" stroke="#a855f7" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CustomerSegments = () => {
    const segments = [
      { name: 'Quick Converters', count: 45, avgTime: '2.3 hours', conversionRate: 85 },
      { name: 'Browsers', count: 132, avgTime: '2.8 days', conversionRate: 35 },
      { name: 'Researchers', count: 78, avgTime: '5.2 days', conversionRate: 65 },
      { name: 'Cart Abandoners', count: 89, avgTime: '1.5 days', conversionRate: 12 },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {segments.map((segment) => (
          <Card key={segment.name} className="hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{segment.name}</h3>
                <Badge variant="secondary">{segment.count} customers</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Journey Time:</span>
                  <span className="font-medium">{segment.avgTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Conversion Rate:</span>
                  <span className="font-medium">{segment.conversionRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Journey Analytics</h1>
          <p className="text-muted-foreground">Visualize and analyze customer behavior patterns</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{metrics.totalCustomers}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Interactions</p>
                <p className="text-2xl font-bold">{metrics.avgInteractions}</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Growth</p>
                <p className="text-2xl font-bold text-green-600">+12.5%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Journey Flow</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="individual">Individual Journeys</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <JourneyFlowVisualization />
          )}
        </TabsContent>

        <TabsContent value="timeline">
          <TimelineAnalysis />
        </TabsContent>

        <TabsContent value="segments">
          <CustomerSegments />
        </TabsContent>

        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle>Individual Customer Journeys</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {journeys.slice(0, 20).map((journey) => {
                      const currentStage = journeyStages.find(s => s.id === journey.current_stage_id);
                      const StageIcon = currentStage?.icon || User;
                      
                      return (
                        <div key={journey.customer_id} className="flex items-center justify-between p-4 border rounded-lg hover-scale">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${currentStage?.color || 'bg-gray-500'} flex items-center justify-center`}>
                              <StageIcon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">Customer #{journey.customer_id.slice(-8)}</p>
                              <p className="text-sm text-muted-foreground">
                                {journey.total_interactions} interactions • {currentStage?.name || 'Unknown Stage'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Started {new Date(journey.journey_start).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Last active {new Date(journey.last_interaction).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}