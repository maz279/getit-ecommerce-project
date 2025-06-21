
import { MainCategory } from '../categoriesData';
import { Baby, Gamepad2, Bed } from 'lucide-react';
import { babyEssentialsData } from './babyKids/babyEssentialsData';
import { toysGamesData } from './babyKids/toysGamesData';
import { kidsFurnitureData } from './babyKids/kidsFurnitureData';

export const babyKidsData: MainCategory = {
  id: 'baby-kids',
  name: 'Baby & Kids',
  icon: <Baby className="w-6 h-6" />,
  color: 'text-pink-600',
  count: 9876,
  featured: true,
  subcategories: {
    'baby-essentials': babyEssentialsData,
    'toys-games': toysGamesData,
    'kids-furniture': kidsFurnitureData
  }
};
