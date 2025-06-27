
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp, Search, Users } from 'lucide-react';

export const SearchAnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Total Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,834</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Avg Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.4</div>
            <p className="text-xs text-gray-500">Per search</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.3%</div>
            <p className="text-xs text-gray-500">Found results</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <BarChart className="h-4 w-4 mr-2" />
              Top Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Status</div>
            <p className="text-xs text-gray-500">Most used</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Search Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Detailed search analytics and insights coming soon. This will include:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
            <li>Search trends and patterns</li>
            <li>Popular search terms</li>
            <li>Filter usage statistics</li>
            <li>Search performance metrics</li>
            <li>User behavior insights</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
