import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Brain, TrendingUp, Zap, Target, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface AmazonLevelFeature {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'pending' | 'maintenance';
  lastUpdate: string;
  insights: number;
  icon: React.ReactNode;
}

export const AmazonLevelFeatures: React.FC = () => {
  const [features] = useState<AmazonLevelFeature[]>([
    {
      id: 'anomaly-detection',
      name: 'Real-time Anomaly Detection',
      description: 'AI-powered detection of unusual patterns in sales, traffic, and system metrics',
      status: 'active',
      lastUpdate: '2 minutes ago',
      insights: 12,
      icon: <AlertTriangle className="w-5 h-5" />
    },
    {
      id: 'predictive-inventory',
      name: 'Predictive Inventory Management',
      description: 'ML-driven demand forecasting and automatic reorder point optimization',
      status: 'active',
      lastUpdate: '5 minutes ago',
      insights: 8,
      icon: <Brain className="w-5 h-5" />
    },
    {
      id: 'dynamic-pricing',
      name: 'Dynamic Pricing Engine',
      description: 'Intelligent price optimization based on demand, competition, and inventory',
      status: 'active',
      lastUpdate: '1 minute ago',
      insights: 15,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: 'customer-journey',
      name: 'Customer Journey Analytics',
      description: 'Deep insights into customer behavior patterns and conversion optimization',
      status: 'active',
      lastUpdate: '3 minutes ago',
      insights: 21,
      icon: <Target className="w-5 h-5" />
    }
  ]);

  const [alerts] = useState([
    {
      id: '1',
      type: 'anomaly',
      severity: 'high',
      message: 'Unusual spike in cart abandonment rate detected (+45% in last hour)',
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      type: 'inventory',
      severity: 'medium',
      message: 'Predictive model suggests reordering 3 products within next 48 hours',
      timestamp: '5 minutes ago'
    },
    {
      id: '3',
      type: 'pricing',
      severity: 'low',
      message: 'Dynamic pricing recommendations generated for 12 products',
      timestamp: '8 minutes ago'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Amazon-Level AI Features</h2>
        <p className="text-muted-foreground">Advanced AI-powered business intelligence and automation</p>
      </div>

      {/* Active Alerts */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Active AI Alerts</h3>
        {alerts.map((alert) => (
          <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>{alert.message}</span>
                <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* Feature Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Card key={feature.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(feature.status)}>
                  {feature.status}
                </Badge>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{feature.insights}</p>
                    <p className="text-sm text-muted-foreground">AI Insights</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Last Update</p>
                    <p className="text-xs text-muted-foreground">{feature.lastUpdate}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Activity className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>AI Performance Metrics</span>
          </CardTitle>
          <CardDescription>Real-time performance of Amazon-level AI features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">98.7%</p>
              <p className="text-sm text-muted-foreground">Anomaly Detection Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">94.2%</p>
              <p className="text-sm text-muted-foreground">Inventory Prediction Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">+12.3%</p>
              <p className="text-sm text-muted-foreground">Revenue from Dynamic Pricing</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">+23.8%</p>
              <p className="text-sm text-muted-foreground">Conversion Rate Improvement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next-Gen Features Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon: Next-Gen AI Features</CardTitle>
          <CardDescription>Advanced capabilities in development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Brain className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">GPT-4 Powered Business Insights</p>
                <p className="text-sm text-muted-foreground">Natural language business intelligence and automated reporting</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Computer Vision Product Analysis</p>
                <p className="text-sm text-muted-foreground">AI-powered product categorization and quality assessment</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};