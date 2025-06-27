
import React from 'react';
import { Search, Filter, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const VendorSearchHeader: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Search</h1>
          <p className="text-gray-600 mt-1">
            Search and discover vendors across the platform with advanced filtering
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Search Settings
          </Button>
        </div>
      </div>

      {/* Quick Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search vendors by name, category, location, or keywords..."
          className="pl-10 pr-4 py-3 text-lg"
        />
        <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
          Search
        </Button>
      </div>

      {/* Quick Filter Pills */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Button variant="outline" size="sm" className="rounded-full">
          <Filter className="h-3 w-3 mr-1" />
          Active Vendors
        </Button>
        <Button variant="outline" size="sm" className="rounded-full">
          Top Rated (4.5+)
        </Button>
        <Button variant="outline" size="sm" className="rounded-full">
          Verified Only
        </Button>
        <Button variant="outline" size="sm" className="rounded-full">
          New This Month
        </Button>
        <Button variant="outline" size="sm" className="rounded-full">
          High Volume Sellers
        </Button>
      </div>
    </div>
  );
};
