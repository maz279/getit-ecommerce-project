
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Clock, Award, Grid3X3 } from 'lucide-react';

interface SubmenuItem {
  name: string;
  subcategories: Array<{
    name: string;
    count: number;
  }>;
}

interface CategoryTabsProps {
  submenu: SubmenuItem | null | undefined;
  selectedTab?: string | null;
  activeTab: string;
  onTabSelect: (tabId: string) => void;
  onActiveTabChange: (tab: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  submenu,
  selectedTab,
  activeTab,
  onTabSelect,
  onActiveTabChange
}) => {
  if (!submenu) return null;

  const totalProducts = submenu.subcategories.reduce((sum, sub) => sum + sub.count, 0);

  return (
    <div className="border-b bg-gray-50 px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{submenu.name}</h3>
          <p className="text-gray-600">
            {totalProducts.toLocaleString()} products available
          </p>
        </div>
        
        {/* Subcategory Tags */}
        <div className="flex flex-wrap gap-2">
          {submenu.subcategories.slice(0, 6).map((sub, index) => (
            <button
              key={index}
              onClick={() => onTabSelect(sub.name)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTab === sub.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {sub.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {sub.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={onActiveTabChange} className="w-full">
        <TabsList className="bg-white shadow-sm border h-12">
          <TabsTrigger value="all" className="flex items-center gap-2 px-4">
            <Grid3X3 className="w-4 h-4" />
            All Products
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-2 px-4">
            <Star className="w-4 h-4" />
            Featured
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2 px-4">
            <TrendingUp className="w-4 h-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center gap-2 px-4">
            <Clock className="w-4 h-4" />
            New Arrivals
          </TabsTrigger>
          <TabsTrigger value="bestsellers" className="flex items-center gap-2 px-4">
            <Award className="w-4 h-4" />
            Best Sellers
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
