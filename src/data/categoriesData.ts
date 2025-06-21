
export interface SubCategory {
  name: string;
  items: string[];
  count: number;
}

export interface MainCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  count: number;
  featured: boolean;
  subcategories: {
    [key: string]: {
      name: string;
      subcategories: SubCategory[];
    };
  };
}

import { fashionData } from './categories/fashionData';
import { electronicsData } from './categories/electronicsData';
import { homeGardenData } from './categories/homeGardenData';
import { healthBeautyData } from './categories/healthBeautyData';
import { foodGroceriesData } from './categories/foodGroceriesData';

export const categoriesData: MainCategory[] = [
  fashionData,
  electronicsData,
  homeGardenData,
  healthBeautyData,
  foodGroceriesData
];
