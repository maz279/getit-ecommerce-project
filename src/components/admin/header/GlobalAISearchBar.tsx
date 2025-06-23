
import React, { useState, useRef } from 'react';
import { Search, Filter, ChevronDown, Sparkles, Brain, MessageSquare, Mic, Camera, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface GlobalAISearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
}

export const GlobalAISearchBar: React.FC<GlobalAISearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  searchFilter,
  setSearchFilter
}) => {
  const [isAIMode, setIsAIMode] = useState(true);
  const [searchMode, setSearchMode] = useState<'text' | 'voice' | 'image' | 'conversational'>('text');
  const inputRef = useRef<HTMLInputElement>(null);

  const searchModes = [
    { id: 'text', label: 'Text Search', icon: Search },
    { id: 'voice', label: 'Voice Search', icon: Mic },
    { id: 'image', label: 'Image Search', icon: Camera },
    { id: 'conversational', label: 'AI Chat', icon: MessageSquare }
  ];

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputRef.current?.value || '';
    if (query.trim()) {
      console.log(`AI Search: ${searchMode} mode - "${query}" in ${searchFilter}`);
      // AI/ML/NLP processing would happen here
    }
  };

  return (
    <div className="flex flex-1 max-w-3xl mx-6">
      <div className="relative w-full">
        <form onSubmit={handleSearch} className="flex">
          {/* AI Mode Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={isAIMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAIMode(!isAIMode)}
                className={`rounded-r-none border-r-0 px-3 ${
                  isAIMode 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : 'bg-white text-gray-600'
                }`}
              >
                {isAIMode ? <Sparkles size={16} /> : <Brain size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isAIMode ? 'AI Mode: Enhanced with ML & NLP' : 'Standard Search'}
            </TooltipContent>
          </Tooltip>

          {/* Search Mode Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-none border-r-0 px-3">
                {searchModes.find(m => m.id === searchMode)?.icon && 
                  React.createElement(searchModes.find(m => m.id === searchMode)!.icon, { size: 16 })
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white z-50">
              {searchModes.map((mode) => (
                <DropdownMenuItem 
                  key={mode.id}
                  onClick={() => setSearchMode(mode.id as any)}
                  className="flex items-center"
                >
                  <mode.icon size={16} className="mr-2" />
                  {mode.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-none border-r-0 px-3">
                <Filter size={16} className="mr-2" />
                {searchFilter === 'all' ? 'All' : searchFilter}
                <ChevronDown size={14} className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white z-50">
              <DropdownMenuItem onClick={() => setSearchFilter('all')}>
                All Content
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSearchFilter('orders')}>
                Orders & Transactions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchFilter('products')}>
                Products & Inventory
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchFilter('vendors')}>
                Vendors & Suppliers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchFilter('customers')}>
                Customers & Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchFilter('analytics')}>
                Analytics & Reports
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchFilter('system')}>
                System & Logs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder={
                isAIMode 
                  ? `Ask me anything or search with AI... (${searchMode} mode)`
                  : "Search orders, products, vendors, customers..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-2 border border-l-0 rounded-l-none rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            
            {/* Search Button */}
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              <Search size={14} />
            </Button>
          </div>
        </form>

        {/* AI Capabilities Indicator */}
        {isAIMode && (
          <div className="absolute top-full left-0 right-0 mt-1 flex items-center justify-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 text-xs px-3 py-1 rounded-full text-blue-700 border border-blue-200">
              <Sparkles size={12} className="inline mr-1" />
              AI • ML • NLP • Semantic Search • Voice • Image Recognition
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
