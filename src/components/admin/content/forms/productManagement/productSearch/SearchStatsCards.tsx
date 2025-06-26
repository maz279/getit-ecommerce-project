
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, Target, Users, MousePointer } from 'lucide-react';
import { SearchStats } from './types';

interface SearchStatsCardsProps {
  stats: SearchStats;
}

export const SearchStatsCards: React.FC<SearchStatsCardsProps> = ({ stats }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
            <Target className="h-4 w-4 mr-1" />
            Total Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{formatNumber(stats.totalSearches)}</div>
          <p className="text-xs text-blue-600 mt-1">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            +12.5% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Avg Search Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{stats.avgSearchTime}s</div>
          <p className="text-xs text-green-600 mt-1">
            <TrendingDown className="h-3 w-3 inline mr-1" />
            -8.2% faster response
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
            <MousePointer className="h-4 w-4 mr-1" />
            Success Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{stats.searchSuccessRate}%</div>
          <p className="text-xs text-purple-600 mt-1">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            +3.1% improvement
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-700 flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Top Keywords
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {stats.popularKeywords.slice(0, 3).map((keyword, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">{keyword.keyword}</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    keyword.trend === 'up' ? 'text-green-600 border-green-300' : 
                    keyword.trend === 'down' ? 'text-red-600 border-red-300' : 
                    'text-gray-600 border-gray-300'
                  }`}
                >
                  {keyword.trend === 'up' ? '↗' : keyword.trend === 'down' ? '↘' : '→'} {formatNumber(keyword.count)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
