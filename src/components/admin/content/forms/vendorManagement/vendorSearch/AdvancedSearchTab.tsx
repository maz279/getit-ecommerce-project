
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
import { CalendarIcon, X, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { VendorSearchFilter } from './types';

interface AdvancedSearchTabProps {
  filters: VendorSearchFilter;
  onFilterChange: (filters: Partial<VendorSearchFilter>) => void;
}

export const AdvancedSearchTab: React.FC<AdvancedSearchTabProps> = ({
  filters,
  onFilterChange
}) => {
  const [searchQuery, setSearchQuery] = useState(filters.searchTerm || '');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const handleSearch = () => {
    onFilterChange({
      searchTerm: searchQuery,
      joinDateRange: {
        start: dateFrom ? format(dateFrom, 'yyyy-MM-dd') : '',
        end: dateTo ? format(dateTo, 'yyyy-MM-dd') : ''
      }
    });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setDateFrom(undefined);
    setDateTo(undefined);
    onFilterChange({
      searchTerm: '',
      status: [],
      category: [],
      location: [],
      rating: { min: 0, max: 5 },
      salesVolume: { min: 0, max: 1000000 },
      joinDateRange: { start: '', end: '' },
      verificationStatus: [],
      performanceLevel: [],
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
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
                placeholder="Business name, contact person, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="vendor-status">Vendor Status</Label>
              <Select onValueChange={(value) => onFilterChange({ status: [value] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="vendor-category">Category</Label>
              <Select onValueChange={(value) => onFilterChange({ category: [value] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                  <SelectItem value="beauty">Beauty & Health</SelectItem>
                  <SelectItem value="sports">Sports & Recreation</SelectItem>
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
              <Label htmlFor="min-rating">Minimum Rating</Label>
              <Select onValueChange={(value) => onFilterChange({ rating: { ...filters.rating, min: parseFloat(value) } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select minimum rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Rating</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="min-sales">Minimum Sales Volume</Label>
              <Input
                id="min-sales"
                type="number"
                placeholder="e.g., 10000"
                onChange={(e) => e.target.value && onFilterChange({ 
                  salesVolume: { ...filters.salesVolume, min: parseInt(e.target.value) } 
                })}
              />
            </div>
            <div>
              <Label>Join Date Range</Label>
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

        {/* Verification & Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Verification & Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Verification Status</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['verified', 'pending', 'rejected', 'unverified'].map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={status}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onFilterChange({ 
                            verificationStatus: [...filters.verificationStatus, status] 
                          });
                        } else {
                          onFilterChange({ 
                            verificationStatus: filters.verificationStatus.filter(s => s !== status) 
                          });
                        }
                      }}
                    />
                    <Label htmlFor={status} className="text-sm capitalize">{status}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Performance Level</Label>
              <Select onValueChange={(value) => onFilterChange({ performanceLevel: [value] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select performance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Location</Label>
              <Select onValueChange={(value) => onFilterChange({ location: [value] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dhaka">Dhaka</SelectItem>
                  <SelectItem value="chittagong">Chittagong</SelectItem>
                  <SelectItem value="sylhet">Sylhet</SelectItem>
                  <SelectItem value="rajshahi">Rajshahi</SelectItem>
                  <SelectItem value="khulna">Khulna</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applied Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Applied Filters
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {filters.searchTerm && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>Search: {filters.searchTerm}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => onFilterChange({ searchTerm: '' })} />
              </Badge>
            )}
            {filters.status.map((status, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                <span>Status: {status}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => 
                  onFilterChange({ status: filters.status.filter(s => s !== status) })
                } />
              </Badge>
            ))}
            {filters.category.map((category, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                <span>Category: {category}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => 
                  onFilterChange({ category: filters.category.filter(c => c !== category) })
                } />
              </Badge>
            ))}
            {filters.verificationStatus.map((status, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                <span>Verification: {status}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => 
                  onFilterChange({ verificationStatus: filters.verificationStatus.filter(s => s !== status) })
                } />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Actions */}
      <div className="flex justify-center space-x-4">
        <Button onClick={handleSearch} size="lg" className="px-8">
          <Search className="h-4 w-4 mr-2" />
          Search Vendors
        </Button>
        <Button variant="outline" onClick={clearAllFilters} size="lg">
          <Filter className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
