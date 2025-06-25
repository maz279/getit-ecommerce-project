
import React, { useState } from 'react';
import { TrendingUp, Calendar, BarChart3, Target, AlertTriangle, Download, RefreshCw, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export const SalesForecastContent: React.FC = () => {
  const [forecastPeriod, setForecastPeriod] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGeneratingForecast, setIsGeneratingForecast] = useState(false);

  // Mock forecast data
  const forecastData = [
    { month: 'Jan', actual: 450000, predicted: 420000, optimistic: 480000, pessimistic: 380000 },
    { month: 'Feb', actual: 520000, predicted: 510000, optimistic: 570000, pessimistic: 450000 },
    { month: 'Mar', actual: 480000, predicted: 490000, optimistic: 540000, pessimistic: 440000 },
    { month: 'Apr', actual: null, predicted: 580000, optimistic: 640000, pessimistic: 520000 },
    { month: 'May', actual: null, predicted: 620000, optimistic: 680000, pessimistic: 560000 },
    { month: 'Jun', actual: null, predicted: 650000, optimistic: 720000, pessimistic: 580000 }
  ];

  const categoryForecast = [
    { category: 'Electronics', current: 2100000, forecast: 2450000, growth: 16.7, confidence: 85 },
    { category: 'Fashion', current: 1800000, forecast: 2020000, growth: 12.2, confidence: 78 },
    { category: 'Home & Garden', current: 1200000, forecast: 1380000, growth: 15.0, confidence: 82 },
    { category: 'Sports', current: 890000, forecast: 980000, growth: 10.1, confidence: 74 }
  ];

  const riskFactors = [
    { factor: 'Seasonal Fluctuation', impact: 'Medium', probability: 70, mitigation: 'Inventory adjustment' },
    { factor: 'Supply Chain Disruption', impact: 'High', probability: 25, mitigation: 'Diversify suppliers' },
    { factor: 'Economic Downturn', impact: 'High', probability: 30, mitigation: 'Flexible pricing' },
    { factor: 'Competition Increase', impact: 'Medium', probability: 60, mitigation: 'Marketing boost' }
  ];

  const demandDrivers = [
    { driver: 'Festival Season', impact: '+25%', period: 'Oct-Dec', status: 'Upcoming' },
    { driver: 'New Product Launch', impact: '+15%', period: 'Apr-May', status: 'Planned' },
    { driver: 'Marketing Campaign', impact: '+12%', period: 'Mar-Apr', status: 'Active' },
    { driver: 'Price Optimization', impact: '+8%', period: 'Ongoing', status: 'Active' }
  ];

  const handleGenerateForecast = () => {
    setIsGeneratingForecast(true);
    setTimeout(() => setIsGeneratingForecast(false), 2000);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            Sales Forecast & Predictions
          </h1>
          <p className="text-gray-600 mt-1">AI-powered sales forecasting and demand prediction analytics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleGenerateForecast} disabled={isGeneratingForecast}>
            {isGeneratingForecast ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Regenerate Forecast
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Forecast Settings
          </Button>
        </div>
      </div>

      {/* Forecast Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Forecast Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Forecast Period</Label>
              <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30d">Next 30 Days</SelectItem>
                  <SelectItem value="90d">Next 3 Months</SelectItem>
                  <SelectItem value="180d">Next 6 Months</SelectItem>
                  <SelectItem value="365d">Next 12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Confidence Level</Label>
              <Select defaultValue="80">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="95">95% Confidence</SelectItem>
                  <SelectItem value="90">90% Confidence</SelectItem>
                  <SelectItem value="80">80% Confidence</SelectItem>
                  <SelectItem value="70">70% Confidence</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Model Type</Label>
              <Select defaultValue="ensemble">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ensemble">Ensemble Model</SelectItem>
                  <SelectItem value="arima">ARIMA</SelectItem>
                  <SelectItem value="lstm">LSTM Neural Network</SelectItem>
                  <SelectItem value="prophet">Facebook Prophet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Forecast Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Forecast Overview</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="categories">Category Forecast</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
          <TabsTrigger value="planning">Demand Planning</TabsTrigger>
        </TabsList>

        {/* Forecast Overview */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Predicted Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳1.85M</div>
                <p className="text-xs opacity-80">Next 30 days</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+14.2%</div>
                <p className="text-xs opacity-80">vs previous period</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.3%</div>
                <p className="text-xs opacity-80">Last 6 months avg</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Confidence Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82%</div>
                <p className="text-xs opacity-80">High confidence</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Forecast Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Forecast Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  actual: { label: "Actual", color: "#3b82f6" },
                  predicted: { label: "Predicted", color: "#10b981" },
                  optimistic: { label: "Optimistic", color: "#f59e0b" },
                  pessimistic: { label: "Pessimistic", color: "#ef4444" }
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
                    <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="optimistic" stroke="#f59e0b" strokeWidth={2} strokeDasharray="2 2" />
                    <Line type="monotone" dataKey="pessimistic" stroke="#ef4444" strokeWidth={2} strokeDasharray="2 2" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Forecast */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category-wise Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {categoryForecast.map((category, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{category.category}</h4>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          ৳{(category.current / 1000000).toFixed(1)}M → ৳{(category.forecast / 1000000).toFixed(1)}M
                        </span>
                        <Badge className={category.growth > 15 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                          +{category.growth}%
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Forecast Confidence</span>
                        <span>{category.confidence}%</span>
                      </div>
                      <Progress value={category.confidence} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Assessment */}
        <TabsContent value="risks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Risk Factors Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactors.map((risk, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{risk.factor}</h4>
                      <Badge className={
                        risk.impact === 'High' ? 'bg-red-100 text-red-800' :
                        risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {risk.impact} Impact
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Probability: {risk.probability}%</span>
                        <span>Mitigation: {risk.mitigation}</span>
                      </div>
                      <Progress value={risk.probability} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demand Planning */}
        <TabsContent value="planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Demand Drivers & Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demandDrivers.map((driver, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{driver.driver}</h4>
                      <p className="text-sm text-gray-600">Period: {driver.period}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-green-600">{driver.impact}</span>
                      <Badge className={
                        driver.status === 'Active' ? 'bg-green-100 text-green-800' :
                        driver.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {driver.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Planning */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Planning Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Stock Increase Recommendation</h4>
                  <p className="text-blue-700 mt-1">Increase Electronics inventory by 25% for upcoming festival season</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900">Caution Alert</h4>
                  <p className="text-yellow-700 mt-1">Fashion category showing seasonal decline - consider promotional activities</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">Opportunity</h4>
                  <p className="text-green-700 mt-1">Home & Garden showing strong growth potential - expand product range</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
