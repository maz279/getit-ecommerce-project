
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Settings, Download, Upload, RefreshCw, BarChart3, Filter } from 'lucide-react';

export const ProductSearchHeader: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Search className="mr-3 h-8 w-8 text-blue-600" />
            Product Search Management
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            🔍 Product Management → Product Catalog → Product Search
          </p>
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <BarChart3 className="h-3 w-3 mr-1" />
            Advanced search capabilities, analytics, and optimization tools for product discovery
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters (12)
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Queries
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Index
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Search Config
          </Button>
        </div>
      </div>
    </div>
  );
};
