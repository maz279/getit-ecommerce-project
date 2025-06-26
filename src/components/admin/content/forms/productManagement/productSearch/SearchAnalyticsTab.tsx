
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, MousePointer, Target, Eye, Clock, BarChart3 } from 'lucide-react';
import { SearchAnalytics, SearchTrend } from './types';

interface SearchAnalyticsTabProps {
  analytics: SearchAnalytics;
  trends: SearchTrend[];
}

export const SearchAnalyticsTab: React.FC<SearchAnalyticsTabProps> = ({ analytics, trends }) => {
  const conversionData = [
    { name: 'Searches', value: analytics.totalQueries, color: '#3B82F6' },
    { name: 'Clicks', value: Math.round(analytics.totalQueries * (analytics.clickThroughRate / 100)), color: '#10B981' },
    { name: 'Conversions', value: Math.round(analytics.totalQueries * (analytics.conversionRate / 100)), color: '#F59E0B' }
  ];

  const performanceMetrics = [
    {
      title: 'Click-Through Rate',
      value: `${analytics.clickThroughRate}%`,
      change: '+2.4%',
      trend: 'up' as const,
      icon: MousePointer,
      color: 'blue'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      change: '+0.8%',
      trend: 'up' as const,
      icon: Target,
      color: 'green'
    },
    {
      title: 'Bounce Rate',
      value: `${analytics.bounceRate}%`,
      change: '-1.2%',
      trend: 'down' as const,
      icon: Eye,
      color: 'orange'
    },
    {
      title: 'Avg Results/Query',
      value: analytics.avgResultsPerQuery.toFixed(1),
      change: '+3.1',
      trend: 'up' as const,
      icon: BarChart3,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className={`bg-gradient-to-r from-${metric.color}-50 to-${metric.color}-100 border-${metric.color}-200`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium text-${metric.color}-700 flex items-center`}>
                  <Icon className="h-4 w-4 mr-1" />
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold text-${metric.color}-900`}>{metric.value}</div>
                <p className={`text-xs mt-1 flex items-center ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 inline mr-1" />
                  )}
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Search Trends Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="searches" stroke="#3B82F6" strokeWidth={2} name="Searches" />
              <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} name="Clicks" />
              <Line type="monotone" dataKey="conversions" stroke="#F59E0B" strokeWidth={2} name="Conversions" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Search Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Searches</span>
                  <span className="text-sm text-gray-600">{analytics.totalQueries.toLocaleString()}</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Clicked Results</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(analytics.totalQueries * (analytics.clickThroughRate / 100)).toLocaleString()}
                  </span>
                </div>
                <Progress value={analytics.clickThroughRate} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Conversions</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(analytics.totalQueries * (analytics.conversionRate / 100)).toLocaleString()}
                  </span>
                </div>
                <Progress value={analytics.conversionRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Quality Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Search Quality Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Unique Searchers</p>
                  <p className="text-sm text-blue-600">Active users searching</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-900">{analytics.uniqueSearchers.toLocaleString()}</p>
                  <Badge className="bg-blue-100 text-blue-800">+15.2%</Badge>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Results Quality</p>
                  <p className="text-sm text-green-600">Avg results per query</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-900">{analytics.avgResultsPerQuery.toFixed(1)}</p>
                  <Badge className="bg-green-100 text-green-800">Optimal</Badge>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-900">Search Satisfaction</p>
                  <p className="text-sm text-orange-600">Low bounce rate indicates quality</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-900">{(100 - analytics.bounceRate).toFixed(1)}%</p>
                  <Badge className="bg-orange-100 text-orange-800">Good</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Performance Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">✅ Performing Well</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  High conversion rate ({analytics.conversionRate}%)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Good click-through rate ({analytics.clickThroughRate}%)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Optimal results per query ({analytics.avgResultsPerQuery.toFixed(1)})
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-orange-600">⚠️ Areas for Improvement</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  Reduce bounce rate (currently {analytics.bounceRate}%)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  Improve search suggestions accuracy
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  Optimize for mobile search experience
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
