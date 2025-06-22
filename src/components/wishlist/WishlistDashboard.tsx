
import React, { useState } from 'react';
import { BarChart3, TrendingDown, Package, Bell, Filter, Grid3X3, List, LayoutGrid, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface DashboardProps {
  totalItems: number;
  totalValue: number;
  availableItems: number;
  priceDrops: number;
  onSortChange: (sort: string) => void;
  onFilterChange: (filters: any) => void;
  onViewModeChange: (mode: 'grid' | 'list' | 'compact') => void;
  viewMode: 'grid' | 'list' | 'compact';
}

export const WishlistDashboard: React.FC<DashboardProps> = ({
  totalItems,
  totalValue,
  availableItems,
  priceDrops,
  onSortChange,
  onFilterChange,
  onViewModeChange,
  viewMode
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: '',
    category: '',
    stockStatus: '',
    delivery: '',
    vendor: ''
  });

  const formatBanglaNumber = (num: number) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => banglaDigits[parseInt(digit)] || digit).join('');
  };

  const stats = [
    {
      title: 'Total Items',
      titleBn: 'মোট পণ্য',
      value: totalItems,
      valueBn: formatBanglaNumber(totalItems),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Value',
      titleBn: 'মোট মূল্য',
      value: `৳${totalValue.toLocaleString()}`,
      valueBn: `৳${formatBanglaNumber(totalValue)}`,
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Available Items',
      titleBn: 'উপলব্ধ পণ্য',
      value: availableItems,
      valueBn: formatBanglaNumber(availableItems),
      icon: Check,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Price Drops',
      titleBn: 'দাম কমেছে',
      value: priceDrops,
      valueBn: formatBanglaNumber(priceDrops),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
            <p className="text-xs text-gray-500">{stat.titleBn}: {stat.valueBn}</p>
          </div>
        ))}
      </div>

      {/* Quick Action Toolbar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <Select onValueChange={onSortChange} defaultValue="newest">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Date Added (Newest)</SelectItem>
                <SelectItem value="oldest">Date Added (Oldest)</SelectItem>
                <SelectItem value="price_low">Price (Low to High)</SelectItem>
                <SelectItem value="price_high">Price (High to Low)</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="stock">Stock Availability</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            {Object.values(selectedFilters).some(filter => filter) && (
              <Badge variant="secondary" className="text-xs">
                {Object.values(selectedFilters).filter(f => f).length} active
              </Badge>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="p-2"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'compact' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('compact')}
                className="p-2"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range (BDT)</label>
                <Select value={selectedFilters.priceRange} onValueChange={(value) => setSelectedFilters({...selectedFilters, priceRange: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_1000">Under ৳1,000</SelectItem>
                    <SelectItem value="1000_5000">৳1,000 - ৳5,000</SelectItem>
                    <SelectItem value="5000_10000">৳5,000 - ৳10,000</SelectItem>
                    <SelectItem value="10000_25000">৳10,000 - ৳25,000</SelectItem>
                    <SelectItem value="over_25000">Over ৳25,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                <Select value={selectedFilters.category} onValueChange={(value) => setSelectedFilters({...selectedFilters, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Stock Status</label>
                <Select value={selectedFilters.stockStatus} onValueChange={(value) => setSelectedFilters({...selectedFilters, stockStatus: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Items" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock (সংগ্রহে আছে)</SelectItem>
                    <SelectItem value="limited">Limited Stock (সীমিত সংগ্রহ)</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock (স্টক নেই)</SelectItem>
                    <SelectItem value="preorder">Pre-order Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Delivery Options</label>
                <Select value={selectedFilters.delivery} onValueChange={(value) => setSelectedFilters({...selectedFilters, delivery: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Delivery" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="same_day">Same Day Delivery</SelectItem>
                    <SelectItem value="express">Express Delivery</SelectItem>
                    <SelectItem value="standard">Standard Delivery</SelectItem>
                    <SelectItem value="cod">COD Available</SelectItem>
                    <SelectItem value="free_shipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Vendor Rating</label>
                <Select value={selectedFilters.vendor} onValueChange={(value) => setSelectedFilters({...selectedFilters, vendor: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Vendors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5_star">5 Star Vendors</SelectItem>
                    <SelectItem value="4_plus">4+ Star Vendors</SelectItem>
                    <SelectItem value="3_plus">3+ Star Vendors</SelectItem>
                    <SelectItem value="verified">Verified Vendors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch id="sale-items" />
                  <label htmlFor="sale-items" className="text-sm text-gray-700">Sale Items Only</label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="dhaka-delivery" />
                  <label htmlFor="dhaka-delivery" className="text-sm text-gray-700">Dhaka Delivery Available</label>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFilters({priceRange: '', category: '', stockStatus: '', delivery: '', vendor: ''})}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
