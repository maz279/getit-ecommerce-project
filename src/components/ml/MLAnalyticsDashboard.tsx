import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, ShoppingCart, Target, Brain, Eye, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MLAnalyticsData {
  overview?: any;
  predictive?: any;
  behavioral?: any;
  marketIntelligence?: any;
}

export default function MLAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<MLAnalyticsData>({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [activeTab, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const { data: response, error } = await supabase.functions.invoke('ml-analytics-dashboard', {
        body: { type: activeTab, timeRange }
      });

      if (error) throw error;

      setData(prev => ({
        ...prev,
        [activeTab]: response.data
      }));
    } catch (error) {
      console.error('Error fetching ML analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card className="hover-scale">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={`text-sm flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {change}%
              </p>
            )}
          </div>
          <Icon className="w-8 h-8 text-primary" />
        </div>
      </CardContent>
    </Card>
  );

  const OverviewDashboard = () => {
    const overviewData = data.overview || {};
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={overviewData.totalUsers?.toLocaleString() || '0'}
            change={15.2}
            trend="up"
            icon={Users}
          />
          <StatCard
            title="ML Recommendations"
            value={overviewData.totalRecommendations?.toLocaleString() || '0'}
            change={23.1}
            trend="up"
            icon={Brain}
          />
          <StatCard
            title="Conversion Rate"
            value={`${overviewData.conversionRate || 0}%`}
            change={8.5}
            trend="up"
            icon={Target}
          />
          <StatCard
            title="Avg Session Duration"
            value={`${Math.floor((overviewData.avgSessionDuration || 0) / 60)}:${(overviewData.avgSessionDuration || 0) % 60}`}
            change={12.3}
            trend="up"
            icon={Eye}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ML Performance Overview</CardTitle>
            <CardDescription>Real-time analytics powered by machine learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Mon', recommendations: 120, conversions: 32 },
                  { name: 'Tue', recommendations: 145, conversions: 41 },
                  { name: 'Wed', recommendations: 132, conversions: 38 },
                  { name: 'Thu', recommendations: 168, conversions: 52 },
                  { name: 'Fri', recommendations: 195, conversions: 63 },
                  { name: 'Sat', recommendations: 210, conversions: 71 },
                  { name: 'Sun', recommendations: 189, conversions: 58 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="recommendations" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="conversions" stackId="1" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ML Analytics Dashboard</h1>
          <p className="text-muted-foreground">AI-powered insights and predictions</p>
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
          <TabsTrigger value="marketIntelligence">Market Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <OverviewDashboard />
          )}
        </TabsContent>

        <TabsContent value="predictive">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Predictive analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavioral">
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Behavioral analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketIntelligence">
          <Card>
            <CardHeader>
              <CardTitle>Market Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Market intelligence dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}