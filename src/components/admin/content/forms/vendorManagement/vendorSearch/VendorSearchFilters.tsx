
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { VendorSearchFilter } from './types';
import { Filter, X } from 'lucide-react';

interface VendorSearchFiltersProps {
  filters: VendorSearchFilter;
  onFilterChange: (filters: Partial<VendorSearchFilter>) => void;
}

export const VendorSearchFilters: React.FC<VendorSearchFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const categoryOptions = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'books', label: 'Books & Media' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'health-beauty', label: 'Health & Beauty' },
    { value: 'food-beverage', label: 'Food & Beverage' }
  ];

  const verificationOptions = [
    { value: 'verified', label: 'Verified' },
    { value: 'pending', label: 'Pending Verification' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'unverified', label: 'Unverified' }
  ];

  const performanceOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'average', label: 'Average' },
    { value: 'poor', label: 'Poor' }
  ];

  const handleStatusChange = (status: string, checked: boolean) => {
    const updatedStatus = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    onFilterChange({ status: updatedStatus });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...filters.category, category]
      : filters.category.filter(c => c !== category);
    onFilterChange({ category: updatedCategories });
  };

  const clearFilters = () => {
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
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </span>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Status</Label>
          <div className="space-y-2">
            {statusOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${option.value}`}
                  checked={filters.status.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleStatusChange(option.value, checked as boolean)
                  }
                />
                <Label htmlFor={`status-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Category</Label>
          <div className="space-y-2">
            {categoryOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${option.value}`}
                  checked={filters.category.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(option.value, checked as boolean)
                  }
                />
                <Label htmlFor={`category-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Rating: {filters.rating.min} - {filters.rating.max} stars
          </Label>
          <Slider
            value={[filters.rating.min, filters.rating.max]}
            onValueChange={([min, max]) => 
              onFilterChange({ rating: { min, max } })
            }
            max={5}
            min={0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Sales Volume Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Sales Volume: ৳{(filters.salesVolume.min / 1000).toFixed(0)}K - ৳{(filters.salesVolume.max / 1000).toFixed(0)}K
          </Label>
          <Slider
            value={[filters.salesVolume.min, filters.salesVolume.max]}
            onValueChange={([min, max]) => 
              onFilterChange({ salesVolume: { min, max } })
            }
            max={1000000}
            min={0}
            step={10000}
            className="w-full"
          />
        </div>

        {/* Verification Status */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Verification Status</Label>
          <Select
            value={filters.verificationStatus[0] || ''}
            onValueChange={(value) => 
              onFilterChange({ verificationStatus: value ? [value] : [] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select verification status" />
            </SelectTrigger>
            <SelectContent>
              {verificationOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Performance Level */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Performance Level</Label>
          <Select
            value={filters.performanceLevel[0] || ''}
            onValueChange={(value) => 
              onFilterChange({ performanceLevel: value ? [value] : [] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select performance level" />
            </SelectTrigger>
            <SelectContent>
              {performanceOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Join Date Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Join Date Range</Label>
          <div className="space-y-2">
            <Input
              type="date"
              value={filters.joinDateRange.start}
              onChange={(e) => 
                onFilterChange({ 
                  joinDateRange: { ...filters.joinDateRange, start: e.target.value }
                })
              }
              placeholder="Start date"
            />
            <Input
              type="date"
              value={filters.joinDateRange.end}
              onChange={(e) => 
                onFilterChange({ 
                  joinDateRange: { ...filters.joinDateRange, end: e.target.value }
                })
              }
              placeholder="End date"
            />
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => 
              onFilterChange({ sortBy: value as VendorSearchFilter['sortBy'] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="sales">Sales Volume</SelectItem>
              <SelectItem value="joinDate">Join Date</SelectItem>
              <SelectItem value="lastActivity">Last Activity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
