
import { MainCategory } from '../categoriesData';
import { createElement } from 'react';
import { Gift } from 'lucide-react';
import { festivalCollectionsData } from './seasonalFestival/festivalCollectionsData';
import { weddingCollectionsData } from './seasonalFestival/weddingCollectionsData';
import { seasonalProductsData } from './seasonalFestival/seasonalProductsData';

export const seasonalFestivalData: MainCategory = {
  id: 'seasonal-festival',
  name: 'Seasonal & Festival Items',
  icon: createElement(Gift, { className: 'w-6 h-6' }),
  color: 'text-red-500',
  count: 8765,
  featured: true,
  subcategories: {
    'festival-collections': festivalCollectionsData,
    'wedding-collections': weddingCollectionsData,
    'seasonal-products': seasonalProductsData
  }
};
