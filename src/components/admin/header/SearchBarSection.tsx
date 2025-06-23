
import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SearchBarSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
}

export const SearchBarSection: React.FC<SearchBarSectionProps> = ({
  searchQuery,
  setSearchQuery,
  searchFilter,
  setSearchFilter
}) => {
  return (
    <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
      <div className="relative w-full">
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-r-none border-r-0">
                <Filter size={16} className="mr-2" />
                {searchFilter === 'all' ? 'All' : searchFilter}
                <ChevronDown size={14} className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white z-50">
              <DropdownMenuItem onClick={() => setSearchFilter('all')}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchFilter('orders')}>Order ID</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchFilter('products')}>Product Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchFilter('vendors')}>Vendor Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchFilter('customers')}>Customer Email</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchFilter('transactions')}>Transaction ID</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search orders, products, vendors, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 border border-l-0 rounded-l-none rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
