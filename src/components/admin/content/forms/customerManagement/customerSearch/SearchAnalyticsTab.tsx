
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { SearchAnalytics } from './types';

interface SearchAnalyticsTabProps {
  analyticsData: SearchAnalytics;
  searchHistory: string[];
}

export const SearchAnalyticsTab: React.FC<SearchAnalyticsTabProps> = ({
  analyticsData,
  searchHistory
}) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ searches: {} }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.searchTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="searches" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most Searched Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ count: {} }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.mostSearchedTerms}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="term" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filter Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ usage: {} }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.filterUsage}
                  dataKey="usage"
                  nameKey="filter"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {analyticsData.filterUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.popularCategories.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between">
                <span className="text-sm font-medium">{category.category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(category.searches / Math.max(...analyticsData.popularCategories.map(c => c.searches))) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{category.searches}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
