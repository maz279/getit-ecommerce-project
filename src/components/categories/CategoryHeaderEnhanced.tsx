
import React from 'react';
import { Filter, Grid3X3, List, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CategoryHeaderEnhancedProps {
  title: string;
  description: string;
  productCount: number;
  viewMode: 'grid' | 'list';
  sortBy: string;
  showFilters: boolean;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortChange: (sortBy: string) => void;
  onToggleFilters: () => void;
}

export const CategoryHeaderEnhanced: React.FC<CategoryHeaderEnhancedProps> = ({
  title,
  description,
  productCount,
  viewMode,
  sortBy,
  showFilters,
  onViewModeChange,
  onSortChange,
  onToggleFilters
}) => {
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'discount', label: 'Biggest Discount' }
  ];

  const currentSort = sortOptions.find(option => option.value === sortBy);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header Info */}
      <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {productCount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Products Available</div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Filters Toggle */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={onToggleFilters}
              className="lg:hidden flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>

            {/* Results Info */}
            <span className="text-sm text-gray-600">
              Showing {productCount.toLocaleString()} results
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  Sort: {currentSort?.label || 'Most Popular'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onSortChange(option.value)}
                    className={sortBy === option.value ? 'bg-blue-50 text-blue-700' : ''}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="rounded-l-none border-l"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
