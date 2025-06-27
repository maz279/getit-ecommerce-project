
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Save, Clock, TrendingUp } from 'lucide-react';
import { SearchFilter } from './types';

interface CustomerSearchHeaderProps {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  searchHistory: string[];
  totalResults: number;
}

export const CustomerSearchHeader: React.FC<CustomerSearchHeaderProps> = ({
  onSearch,
  searchHistory,
  totalResults
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery, []);
  };

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    onSearch(query, []);
    setShowHistory(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Search</h1>
          <p className="text-gray-600 mt-1">
            Advanced customer search and analytics dashboard
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>{totalResults} Results</span>
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search customers by name, email, phone, or tags..."
              className="pl-10 pr-20 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowHistory(!showHistory)}
              >
                <Clock className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={handleSearch}>
                Search
              </Button>
            </div>
          </div>

          {showHistory && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              <div className="p-2 border-b bg-gray-50">
                <span className="text-xs font-medium text-gray-600">Recent Searches</span>
              </div>
              {searchHistory.map((query, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleHistoryClick(query)}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">{query}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex-1">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['VIP Customers', 'High Value', 'Inactive Users', 'New Registrations', 'Bulk Buyers'].map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => {
              setSearchQuery(tag);
              onSearch(tag, []);
            }}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};
