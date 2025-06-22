
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { CategoryMenu } from './CategoryMenu';
import { CategorySubmenu } from './CategorySubmenu';
import { CategoryTabs } from './CategoryTabs';
import { ProductGrid } from './ProductGrid';
import { categoriesData } from '@/data/categoriesData';

export const CategoriesLayout: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category'));
  const [selectedSubmenu, setSelectedSubmenu] = useState(searchParams.get('subcategory'));
  const [selectedTab, setSelectedTab] = useState(searchParams.get('subsubcategory'));
  const [activeTab, setActiveTab] = useState('all');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubmenu(null);
    setSelectedTab(null);
    const params = new URLSearchParams();
    params.set('category', categoryId);
    setSearchParams(params);
  };

  const handleSubmenuSelect = (submenuId: string) => {
    setSelectedSubmenu(submenuId);
    setSelectedTab(null);
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    params.set('subcategory', submenuId);
    setSearchParams(params);
  };

  const handleTabSelect = (tabId: string) => {
    setSelectedTab(tabId);
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSubmenu) params.set('subcategory', selectedSubmenu);
    params.set('subsubcategory', tabId);
    setSearchParams(params);
  };

  const getCurrentCategory = () => {
    return categoriesData.find(cat => cat.id === selectedCategory);
  };

  const getCurrentSubmenu = () => {
    const category = getCurrentCategory();
    return category && selectedSubmenu ? category.subcategories[selectedSubmenu] : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Navigation Structure */}
        <div className="space-y-6">
          {/* Category Menu */}
          <CategoryMenu
            categories={categoriesData}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          {/* Submenu */}
          {selectedCategory && (
            <CategorySubmenu
              category={getCurrentCategory()}
              selectedSubmenu={selectedSubmenu}
              onSubmenuSelect={handleSubmenuSelect}
            />
          )}

          {/* Tabs and Product Grid */}
          {selectedSubmenu && (
            <div className="bg-white rounded-lg shadow-sm">
              <CategoryTabs
                submenu={getCurrentSubmenu()}
                selectedTab={selectedTab}
                activeTab={activeTab}
                onTabSelect={handleTabSelect}
                onActiveTabChange={setActiveTab}
              />
              
              <ProductGrid
                category={selectedCategory}
                submenu={selectedSubmenu}
                tab={selectedTab}
                activeTab={activeTab}
              />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};
