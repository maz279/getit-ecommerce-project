
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, History, TrendingUp, Filter, Download, Calendar, User, MousePointer } from 'lucide-react';
import { SearchHistoryItem, PopularSearch } from './types';

interface SearchHistoryTabProps {
  searchHistory: SearchHistoryItem[];
  popularSearches: PopularSearch[];
}

export const SearchHistoryTab: React.FC<SearchHistoryTabProps> = ({ 
  searchHistory, 
  popularSearches 
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterConverted, setFilterConverted] = useState('all');

  const filteredHistory = searchHistory.filter(item => {
    const matchesQuery = item.query.toLowerCase().includes(filterQuery.toLowerCase()) ||
                        item.userEmail?.toLowerCase().includes(filterQuery.toLowerCase());
    
    const matchesPeriod = filterPeriod === 'all' || 
      (filterPeriod === 'today' && new Date(item.timestamp).toDateString() === new Date().toDateString()) ||
      (filterPeriod === 'week' && new Date(item.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (filterPeriod === 'month' && new Date(item.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    const matchesConverted = filterConverted === 'all' ||
      (filterConverted === 'converted' && item.converted) ||
      (filterConverted === 'not-converted' && !item.converted);

    return matchesQuery && matchesPeriod && matchesConverted;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Popular Searches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Popular Search Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularSearches.map((search, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{search.keyword}</h3>
                  <Badge variant={
                    search.trend === 'up' ? 'default' : 
                    search.trend === 'down' ? 'destructive' : 
                    'secondary'
                  }>
                    {search.trend === 'up' ? '↗' : search.trend === 'down' ? '↘' : '→'} 
                    {search.trendPercentage > 0 ? '+' : ''}{search.trendPercentage}%
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{search.count.toLocaleString()} searches</p>
                  <p className="text-sm text-gray-500">{search.percentage}% of total</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search History Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Search History Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search queries or users..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterConverted} onValueChange={setFilterConverted}>
              <SelectTrigger>
                <SelectValue placeholder="Conversion Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Searches</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="not-converted">Not Converted</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Search History ({filteredHistory.length})
            </span>
            <Badge variant="outline">{filteredHistory.length} entries</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Search Query</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Results</TableHead>
                  <TableHead>Clicked Product</TableHead>
                  <TableHead>Converted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.query}</div>
                      <div className="text-xs text-gray-500">
                        Category: {item.filters.category} | Price: ৳{item.filters.priceRange[0]}-{item.filters.priceRange[1]}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 text-gray-400" />
                        <div>
                          <div className="text-sm">{item.userEmail || 'Anonymous'}</div>
                          <div className="text-xs text-gray-500">{item.userId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="text-sm">{formatDate(item.timestamp)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.resultsCount} results</Badge>
                    </TableCell>
                    <TableCell>
                      {item.clickedProduct ? (
                        <div className="flex items-center">
                          <MousePointer className="h-4 w-4 mr-1 text-green-500" />
                          <span className="text-sm">{item.clickedProduct}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No clicks</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.converted ? 'default' : 'secondary'}>
                        {item.converted ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredHistory.length === 0 && (
            <div className="text-center py-8">
              <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No search history found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
