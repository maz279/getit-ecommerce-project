
import React from 'react';
import { CategoryOverview } from '../components/CategoryOverview';
import { FeaturedCategories } from '../components/FeaturedCategories';

export const DefaultContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <CategoryOverview />
      <FeaturedCategories />
    </div>
  );
};
