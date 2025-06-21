
import { MainCategory } from '../categoriesData';
import { createElement } from 'react';
import { Store } from 'lucide-react';
import { petFoodCareData } from './petSupplies/petFoodCareData';

export const petSuppliesData: MainCategory = {
  id: 'pet-supplies',
  name: 'Pet Supplies',
  icon: createElement(Store, { className: 'w-6 h-6' }),
  color: 'text-green-700',
  count: 1876,
  featured: false,
  subcategories: {
    'pet-food-care': petFoodCareData
  }
};
