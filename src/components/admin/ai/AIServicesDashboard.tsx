import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, Shield, Search, MessageSquare } from 'lucide-react';

interface AIService {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'training';
  accuracy: number;
  requests: number;
  latency: number;
  type: string;
}

export const AIServicesDashboard = () => {
  const [services, setServices] = useState<AIService[]>([
    {
      id: '1',
      name: 'Product Recommendation Engine',
      status: 'active',
      accuracy: 87.5,
      requests: 15420,
      latency: 45,
      type: 'recommendation'
    },
    {
      id: '2',
      name: 'Fraud Detection System',
      status: 'active',
      accuracy: 94.2,
      requests: 8950,
      latency: 23,
      type: 'security'
    },
    {
      id: '3',
      name: 'Search Enhancement',
      status: 'active',
      accuracy: 91.8,
      requests: 45680,
      latency: 67,
      type: 'search'
    },
    {
      id: '4',
      name: 'Customer Support Bot',
      status: 'training',
      accuracy: 82.1,
      requests: 2340,
      latency: 120,
      type: 'support'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-destructive text-destructive-foreground';
      case 'training': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <TrendingUp className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'search': return <Search className="h-4 w-4" />;
      case 'support': return <MessageSquare className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Services Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage AI/ML services</p>
        </div>
        <Button>
          <Brain className="mr-2 h-4 w-4" />
          Deploy New Model
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(s => s.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(services.reduce((acc, s) => acc + s.accuracy, 0) / services.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.reduce((acc, s) => acc + s.requests, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(services.reduce((acc, s) => acc + s.latency, 0) / services.length).toFixed(0)}ms
            </div>
            <p className="text-xs text-muted-foreground">-8ms from last hour</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getServiceIcon(service.type)}
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                  <CardDescription>Type: {service.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Accuracy</p>
                      <p className="text-2xl font-bold text-success">{service.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Requests (24h)</p>
                      <p className="text-2xl font-bold">{service.requests.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Latency</p>
                      <p className="text-2xl font-bold">{service.latency}ms</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline">Configure</Button>
                    <Button size="sm" variant="outline">Retrain</Button>
                    <Button size="sm" variant="outline">View Logs</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>Model Registry</CardTitle>
              <CardDescription>Manage AI/ML model versions and deployments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Model management interface will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Detailed performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Performance analytics will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Training Pipeline</CardTitle>
              <CardDescription>Manage model training and data pipelines</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Training pipeline interface will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};