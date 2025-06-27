
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity,
  Download,
  Filter,
  Calendar
} from 'lucide-react';

export const PerformanceAnalyticsTab: React.FC = () => {
  // Mock analytics data
  const performanceTrends = [
    { month: 'Jan', overall: 8.2, orders: 8.5, quality: 8.0, delivery: 7.9, satisfaction: 8.3 },
    { month: 'Feb', overall: 8.4, orders: 8.6, quality: 8.2, delivery: 8.1, satisfaction: 8.5 },
    { month: 'Mar', overall: 8.6, orders: 8.8, quality: 8.4, delivery: 8.3, satisfaction: 8.7 },
    { month: 'Apr', overall: 8.5, orders: 8.7, quality: 8.3, delivery: 8.2, satisfaction: 8.6 },
    { month: 'May', overall: 8.8, orders: 9.0, quality: 8.6, delivery: 8.5, satisfaction: 8.9 },
    { month: 'Jun', overall: 8.9, orders: 9.1, quality: 8.7, delivery: 8.6, satisfaction: 9.0 }
  ];

  const categoryDistribution = [
    { category: 'Electronics', vendors: 245, avgScore: 8.4, color: '#3B82F6' },
    { category: 'Fashion', vendors: 189, avgScore: 8.1, color: '#EF4444' },
    { category: 'Home & Garden', vendors: 156, avgScore: 7.8, color: '#10B981' },
    { category: 'Health & Beauty', vendors: 134, avgScore: 8.2, color: '#F59E0B' },
    { category: 'Sports', vendors: 98, avgScore: 7.9, color: '#8B5CF6' },
    { category: 'Books', vendors: 87, avgScore: 8.6, color: '#06B6D4' }
  ];

  const performanceDistribution = [
    { name: 'Excellent (9.0+)', value: 34, color: '#10B981' },
    { name: 'Good (8.0-8.9)', value: 42, color: '#3B82F6' },
    { name: 'Average (7.0-7.9)', value: 18, color: '#F59E0B' },
    { name: 'Poor (6.0-6.9)', value: 4, color: '#EF4444' },
    { name: 'Critical (<6.0)', value: 2, color: '#7F1D1D' }
  ];

  const monthlyMetrics = [
    { month: 'Jan', revenue: 45.2, orders: 12430, satisfaction: 4.2, onTime: 87.5 },
    { month: 'Feb', revenue: 48.7, orders: 13250, satisfaction: 4.3, onTime: 89.2 },
    { month: 'Mar', revenue: 52.1, orders: 14100, satisfaction: 4.4, onTime: 90.8 },
    { month: 'Apr', revenue: 49.8, orders: 13800, satisfaction: 4.3, onTime: 88.9 },
    { month: 'May', revenue: 55.6, orders: 15200, satisfaction: 4.5, onTime: 92.1 },
    { month: 'Jun', revenue: 58.9, orders: 16100, satisfaction: 4.6, onTime: 93.4 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Performance Analytics Dashboard
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive vendor performance analytics and insights
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Performance Trends (6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis domain={[7, 10]} stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="overall" stroke="#3B82F6" strokeWidth={3} name="Overall Score" />
                <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} name="Order Management" />
                <Line type="monotone" dataKey="quality" stroke="#F59E0B" strokeWidth={2} name="Quality Score" />
                <Line type="monotone" dataKey="delivery" stroke="#EF4444" strokeWidth={2} name="Delivery Performance" />
                <Line type="monotone" dataKey="satisfaction" stroke="#8B5CF6" strokeWidth={2} name="Customer Satisfaction" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Performance & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
              Performance by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="category" stroke="#6B7280" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="avgScore" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {categoryDistribution.map((cat, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span>{cat.category}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">{cat.vendors} vendors</span>
                    <Badge variant="outline">{cat.avgScore.toFixed(1)}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2 text-orange-600" />
              Performance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {performanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {performanceDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Business Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-indigo-600" />
            Monthly Business Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis yAxisId="left" stroke="#6B7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                  name="Revenue (M ৳)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Positive Trends</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-green-800">Overall performance improving</div>
                    <div className="text-xs text-green-600">Average score increased by 0.7 points over 6 months</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-green-800">Customer satisfaction rising</div>
                    <div className="text-xs text-green-600">Rating improved from 4.2 to 4.6 stars</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-green-800">On-time delivery improving</div>
                    <div className="text-xs text-green-600">Increased from 87.5% to 93.4%</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Areas for Improvement</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Activity className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-orange-800">Home & Garden category lagging</div>
                    <div className="text-xs text-orange-600">Lowest average score at 7.8 points</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Activity className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-orange-800">6% vendors below standards</div>
                    <div className="text-xs text-orange-600">Require immediate attention and support</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Activity className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-orange-800">Quality consistency needed</div>
                    <div className="text-xs text-orange-600">Some categories show high variance in quality scores</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
