
import React from 'react';
import { Heart } from 'lucide-react';
import { MainCategory } from '../categoriesData';
import { personalCareData } from './healthBeauty/personalCareData';
import { makeupCosmeticsData } from './healthBeauty/makeupCosmeticsData';
import { fragrancesData } from './healthBeauty/fragrancesData';
import { healthWellnessData } from './healthBeauty/healthWellnessData';
import { babyCareData } from './healthBeauty/babyCareData';

export const healthBeautyData: MainCategory = {
  id: 'health-beauty',
  name: 'Health & Beauty',
  icon: React.createElement(Heart, { className: "w-8 h-8" }),
  color: 'text-pink-500',
  count: 12450,
  featured: true,
  subcategories: {
    'personal-care': personalCareData,
    'makeup-cosmetics': makeupCosmeticsData,
    'fragrances': fragrancesData,
    'health-wellness': healthWellnessData,
    'baby-care': babyCareData
  }
};
