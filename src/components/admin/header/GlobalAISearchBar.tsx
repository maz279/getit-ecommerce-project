
import React, { useRef } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GlobalAISearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
}

export const GlobalAISearchBar: React.FC<GlobalAISearchBarProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputRef.current?.value || '';
    if (query.trim()) {
      console.log(`Search: "${query}"`);
    }
  };

  return (
    <div className="flex flex-1 max-w-3xl mx-6">
      <div className="relative w-full">
        <form onSubmit={handleSearch} className="flex">
          {/* Clean Search Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search orders, products, vendors, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            
            {/* Search Button */}
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              <Search size={12} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
