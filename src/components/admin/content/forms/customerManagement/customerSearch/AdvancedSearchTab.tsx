
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { SearchFilter } from './types';

interface AdvancedSearchTabProps {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  appliedFilters: SearchFilter[];
}

export const AdvancedSearchTab: React.FC<AdvancedSearchTabProps> = ({
  onSearch,
  appliedFilters
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>(appliedFilters);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const addFilter = (type: SearchFilter['type'], value: string, operator?: SearchFilter['operator']) => {
    const newFilter: SearchFilter = {
      type,
      value,
      operator: operator || 'equals',
      label: `${type}: ${value}`
    };
    setFilters(prev => [...prev, newFilter]);
  };

  const removeFilter = (index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    onSearch(searchQuery, filters);
  };

  const clearAllFilters = () => {
    setFilters([]);
    setSearchQuery('');
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="search-query">Search Query</Label>
              <Input
                id="search-query"
                placeholder="Name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="customer-tier">Customer Tier</Label>
              <Select onValueChange={(value) => addFilter('tier', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="customer-status">Customer Status</Label>
              <Select onValueChange={(value) => addFilter('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="min-orders">Minimum Orders</Label>
              <Input
                id="min-orders"
                type="number"
                placeholder="e.g., 10"
                onChange={(e) => e.target.value && addFilter('orderCount', e.target.value, 'greater')}
              />
            </div>
            <div>
              <Label htmlFor="min-value">Minimum Lifetime Value ($)</Label>
              <Input
                id="min-value"
                type="number"
                placeholder="e.g., 1000"
                onChange={(e) => e.target.value && addFilter('lifetimeValue', e.target.value, 'greater')}
              />
            </div>
            <div>
              <Label>Registration Date Range</Label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category & Behavior Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Behavior & Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Preferred Categories</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Electronics', 'Fashion', 'Beauty', 'Home', 'Sports', 'Books'].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      onCheckedChange={(checked) => {
                        if (checked) addFilter('category', category);
                      }}
                    />
                    <Label htmlFor={category} className="text-sm">{category}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Communication Preference</Label>
              <Select onValueChange={(value) => addFilter('communication', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applied Filters */}
      {filters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Applied Filters ({filters.length})
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{filter.label}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter(index)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Actions */}
      <div className="flex justify-center space-x-4">
        <Button onClick={handleSearch} size="lg" className="px-8">
          <Search className="h-4 w-4 mr-2" />
          Search Customers
        </Button>
        <Button variant="outline" onClick={clearAllFilters} size="lg">
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
