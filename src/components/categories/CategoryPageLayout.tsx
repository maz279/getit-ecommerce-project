
import React from 'react';
import { Header } from '../homepage/Header';
import { Footer } from '../homepage/Footer';
import { CategorySidebar } from './CategorySidebar';
import { CategoryBreadcrumbEnhanced } from './CategoryBreadcrumbEnhanced';
import { CategoryHeaderEnhanced } from './CategoryHeaderEnhanced';
import { CategoryContent } from './CategoryContent';
import { useCategoryData } from './CategoryDataProvider';

export const CategoryPageLayout: React.FC = () => {
  const {
    selectedCategory,
    selectedSubcategory,
    selectedSubSubcategory,
    viewMode,
    sortBy,
    showFilters,
    handleCategorySelect,
    setViewMode,
    setSortBy,
    setShowFilters,
    getCurrentTitle,
    getDescription,
    getTotalProducts,
    getCurrentItems,
    sampleProducts,
    getCurrentCategoryData,
    getCurrentSubcategoryData
  } = useCategoryData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Enhanced Breadcrumb */}
        <CategoryBreadcrumbEnhanced 
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          selectedSubSubcategory={selectedSubSubcategory}
          onNavigate={handleCategorySelect}
        />

        <div className="flex gap-6">
          {/* Enhanced Left Sidebar */}
          <div className="w-80 hidden lg:block">
            <CategorySidebar 
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              selectedSubSubcategory={selectedSubSubcategory}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Enhanced Header Section */}
            <CategoryHeaderEnhanced
              title={getCurrentTitle()}
              description={getDescription()}
              productCount={getTotalProducts()}
              viewMode={viewMode}
              sortBy={sortBy}
              showFilters={showFilters}
              onViewModeChange={setViewMode}
              onSortChange={setSortBy}
              onToggleFilters={() => setShowFilters(!showFilters)}
            />

            {/* Enhanced Category Content with Tabs */}
            <div className="mt-6">
              <CategoryContent
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                selectedSubSubcategory={selectedSubSubcategory}
                viewMode={viewMode}
                onCategorySelect={handleCategorySelect}
                getCurrentItems={getCurrentItems}
                sampleProducts={sampleProducts}
                getCategoryData={getCurrentCategoryData}
                getSubcategoryData={getCurrentSubcategoryData}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
