
import React from 'react';
import { CategoryBreadcrumb } from './CategoryBreadcrumb';
import { ProductGrid } from './ProductGrid';
import { Card } from '@/components/ui/card';
import { MainCategory } from '@/data/categoriesData';
import { CategoryOverview } from './components/CategoryOverview';
import { FeaturedCategories } from './components/FeaturedCategories';
import { SubcategoryDetails } from './components/SubcategoryDetails';
import { womensFashionHierarchical } from '@/data/categories/fashion/womensFashionHierarchical';

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
  // Get the actual subcategory name from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const subsubcategoryFromUrl = urlParams.get('subsubcategory');
  
  // Use URL parameter or fallback to selectedSubSubcategory
  const actualSubSubcategory = subsubcategoryFromUrl || selectedSubSubcategory;

  console.log('CategoryMainContent - selectedCategory:', selectedCategory);
  console.log('CategoryMainContent - selectedSubcategory:', selectedSubcategory);
  console.log('CategoryMainContent - actualSubSubcategory:', actualSubSubcategory);

  // Function to get hierarchical data based on current selection
  const getHierarchicalData = () => {
    if (selectedCategory === 'fashion' && selectedSubcategory === 'womens-fashion') {
      return womensFashionHierarchical;
    }
    return null;
  };

  // Function to check if we should show subcategory details
  const shouldShowSubcategoryDetails = () => {
    const hierarchicalData = getHierarchicalData();
    if (!hierarchicalData || !actualSubSubcategory) return false;

    // Check if the actualSubSubcategory exists in any of the hierarchical categories
    for (const mainCat of Object.values(hierarchicalData.subcategories)) {
      for (const subCat of Object.values(mainCat.subcategories)) {
        for (const subSubCat of Object.values(subCat.subcategories)) {
          const hasItem = subSubCat.items.some(item => item.name === actualSubSubcategory);
          if (hasItem) return true;
        }
      }
    }
    return false;
  };

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
        selectedSubSubcategory={actualSubSubcategory}
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
              tab={actualSubSubcategory}
              activeTab={activeTab}
            />
          </Card>
        </div>

        {/* Right Side - Subcategory Details */}
        {shouldShowSubcategoryDetails() && actualSubSubcategory && (
          <SubcategoryDetails selectedSubSubcategory={actualSubSubcategory} />
        )}
      </div>
    </div>
  );
};
