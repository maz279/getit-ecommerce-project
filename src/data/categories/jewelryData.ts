
import { MainCategory } from '../categoriesData';
import { createElement } from 'react';
import { Gem } from 'lucide-react';
import { traditionalJewelryData } from './jewelry/traditionalJewelryData';
import { fashionJewelryData } from './jewelry/fashionJewelryData';

export const jewelryData: MainCategory = {
  id: 'jewelry-accessories',
  name: 'Jewelry & Accessories',
  icon: createElement(Gem, { className: 'w-6 h-6' }),
  color: 'text-yellow-600',
  count: 3456,
  featured: true,
  subcategories: {
    'traditional-jewelry': traditionalJewelryData,
    'fashion-jewelry': fashionJewelryData
  }
};
