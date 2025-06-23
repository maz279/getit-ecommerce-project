
import React from 'react';
import { Card } from '@/components/ui/card';
import { ProductGrid } from '../ProductGrid';
import { SubcategoryDetails } from '../components/SubcategoryDetails';

interface CategoryContentLayoutProps {
  selectedCategory?: string | null;
  selectedSubcategory?: string | null;
  actualSubSubcategory?: string | null;
  activeTab: string;
  shouldShowSubcategoryDetails: boolean;
}

export const CategoryContentLayout: React.FC<CategoryContentLayoutProps> = ({
  selectedCategory,
  selectedSubcategory,
  actualSubSubcategory,
  activeTab,
  shouldShowSubcategoryDetails
}) => {
  return (
    <div className="flex gap-6">
      {/* Left Side - Product Grid */}
      <div className="flex-1">
        <Card className="shadow-sm rounded-lg overflow-hidden">
          <ProductGrid
            category={selectedCategory}
            submenu={selectedSubcategory}
            tab={actualSubSubcategory}
            activeTab={activeTab}
          />
        </Card>
      </div>

      {/* Right Side - Subcategory Details */}
      {shouldShowSubcategoryDetails && actualSubSubcategory && (
        <SubcategoryDetails selectedSubSubcategory={actualSubSubcategory} />
      )}
    </div>
  );
};
