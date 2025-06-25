
import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Star,
  Zap,
  Activity,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const KPIMonitoringDashboard: React.FC = () => {
  const [selectedKPICategory, setSelectedKPICategory] = useState('financial');

  const kpiData = [
    { time: '00:00', revenue: 45000, orders: 120, customers: 89 },
    { time: '04:00', revenue: 32000, orders: 85, customers: 65 },
    { time: '08:00', revenue: 78000, orders: 210, customers: 156 },
    { time: '12:00', revenue: 92000, orders: 245, customers: 189 },
    { time: '16:00', revenue: 85000, orders: 220, customers: 167 },
    { time: '20:00', revenue: 65000, orders: 175, customers: 134 }
  ];

  const financialKPIs = [
    {
      title: 'Monthly Revenue',
      current: 2450000,
      target: 2500000,
      percentage: 98,
      trend: 'up',
      change: '+12%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Profit Margin',
      current: 18.5,
      target: 20,
      percentage: 92.5,
      trend: 'up',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Cost Per Acquisition',
      current: 45,
      target: 40,
      percentage: 88.9,
      trend: 'down',
      change: '-8%',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'ROI',
      current: 285,
      target: 300,
      percentage: 95,
      trend: 'up',
      change: '+15%',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const operationalKPIs = [
    {
      title: 'Order Fulfillment Rate',
      current: 96.5,
      target: 98,
      percentage: 98.5,
      trend: 'up',
      change: '+1.2%',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Average Delivery Time',
      current: 2.8,
      target: 2.5,
      percentage: 89.3,
      trend: 'down',
      change: '-0.3 days',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Customer Satisfaction',
      current: 4.6,
      target: 4.8,
      percentage: 95.8,
      trend: 'up',
      change: '+0.2',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Return Rate',
      current: 3.2,
      target: 2.5,
      percentage: 78.1,
      trend: 'down',
      change: '-0.5%',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const customerKPIs = [
    {
      title: 'Customer Retention',
      current: 87.5,
      target: 90,
      percentage: 97.2,
      trend: 'up',
      change: '+3.2%',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'New Customer Growth',
      current: 15.8,
      target: 18,
      percentage: 87.8,
      trend: 'up',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Average Order Value',
      current: 1850,
      target: 2000,
      percentage: 92.5,
      trend: 'up',
      change: '+8.5%',
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Customer Lifetime Value',
      current: 12500,
      target: 15000,
      percentage: 83.3,
      trend: 'up',
      change: '+12%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const renderKPICards = (kpis: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const IconComponent = kpi.icon;
        const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} className={`${kpi.bgColor} border-l-4 ${kpi.color.replace('text-', 'border-')}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                  <IconComponent className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className={`flex items-center text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendIcon className="w-4 h-4 mr-1" />
                  {kpi.change}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{kpi.title}</h3>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-gray-900">
                  {typeof kpi.current === 'number' && kpi.current > 1000 
                    ? kpi.current.toLocaleString() 
                    : kpi.current}
                  {kpi.title.includes('Rate') || kpi.title.includes('Margin') || kpi.title.includes('Growth') ? '%' : ''}
                </span>
                <span className="text-sm text-gray-600">
                  Target: {kpi.target}{kpi.title.includes('Rate') || kpi.title.includes('Margin') || kpi.title.includes('Growth') ? '%' : ''}
                </span>
              </div>
              
              <Progress value={kpi.percentage} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{kpi.percentage.toFixed(1)}%</span>
                <span>100%</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">KPI Monitoring Dashboard</h1>
          <p className="text-gray-600 text-lg">Track key performance indicators and business metrics</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Configure Alerts</Button>
          <Button>Export Report</Button>
        </div>
      </div>

      {/* KPI Categories */}
      <Tabs value={selectedKPICategory} onValueChange={setSelectedKPICategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="financial">Financial KPIs</TabsTrigger>
          <TabsTrigger value="operational">Operational KPIs</TabsTrigger>
          <TabsTrigger value="customer">Customer KPIs</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-6">
          {renderKPICards(financialKPIs)}
          
          {/* Financial KPI Data Entry */}
          <Card>
            <CardHeader>
              <CardTitle>Update Financial KPI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="kpi-type">KPI Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select KPI" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Monthly Revenue</SelectItem>
                      <SelectItem value="profit">Profit Margin</SelectItem>
                      <SelectItem value="cpa">Cost Per Acquisition</SelectItem>
                      <SelectItem value="roi">ROI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="kpi-value">Current Value</Label>
                  <Input id="kpi-value" type="number" placeholder="Enter value" />
                </div>
                <div>
                  <Label htmlFor="kpi-target">Target Value</Label>
                  <Input id="kpi-target" type="number" placeholder="Enter target" />
                </div>
                <div className="flex items-end">
                  <Button className="w-full">Update KPI</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          {renderKPICards(operationalKPIs)}
        </TabsContent>

        <TabsContent value="customer" className="space-y-6">
          {renderKPICards(customerKPIs)}
        </TabsContent>
      </Tabs>

      {/* KPI Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>KPI Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={kpiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
              <Line type="monotone" dataKey="customers" stroke="#ffc658" name="Customers" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alert Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>KPI Alert Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="alert-kpi">Select KPI</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose KPI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="alert-threshold">Alert Threshold (%)</Label>
              <Input id="alert-threshold" type="number" placeholder="Enter threshold" />
            </div>
            <div className="flex items-end">
              <Button className="w-full">Set Alert</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
