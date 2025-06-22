
import React from 'react';
import { CategoryBreadcrumb } from './CategoryBreadcrumb';
import { ProductGrid } from './ProductGrid';
import { Card } from '@/components/ui/card';
import { MainCategory } from '@/data/categoriesData';
import { CategoryOverview } from './components/CategoryOverview';
import { FeaturedCategories } from './components/FeaturedCategories';
import { SubcategoryDetails } from './components/SubcategoryDetails';

interface SubmenuItem {
  name: string;
  subcategories: Array<{
    name: string;
    count: number;
  }>;
}

interface CategoryMainContentProps {
  selectedCategory?: string | null;
  selectedSubcategory?: string | null;
  selectedSubSubcategory?: string | null;
  currentCategory?: MainCategory | null;
  currentSubmenu?: SubmenuItem | null;
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
}

export const CategoryMainContent: React.FC<CategoryMainContentProps> = ({
  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory,
  currentCategory,
  currentSubmenu,
  activeTab,
  onActiveTabChange
}) => {
  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <CategoryOverview />
        <FeaturedCategories />
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Breadcrumb */}
      <CategoryBreadcrumb
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        selectedSubSubcategory={selectedSubSubcategory}
        currentCategory={currentCategory}
        currentSubmenu={currentSubmenu}
      />

      {/* Main Content with Sidebar */}
      <div className="flex gap-6">
        {/* Left Side - Product Grid */}
        <div className="flex-1">
          <Card className="shadow-sm rounded-lg overflow-hidden">
            <ProductGrid
              category={selectedCategory}
              submenu={selectedSubcategory}
              tab={selectedSubSubcategory}
              activeTab={activeTab}
            />
          </Card>
        </div>

        {/* Right Side - Subcategory Details */}
        {selectedSubSubcategory && (
          <SubcategoryDetails selectedSubSubcategory={selectedSubSubcategory} />
        )}
      </div>
    </div>
  );
};
