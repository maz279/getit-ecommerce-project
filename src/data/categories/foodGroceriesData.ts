
import React from 'react';
import { ShoppingBasket } from 'lucide-react';
import { MainCategory } from '../categoriesData';
import { freshFoodData } from './foodGroceries/freshFoodData';
import { staplesGrainsData } from './foodGroceries/staplesGrainsData';
import { spicesCondimentsData } from './foodGroceries/spicesCondimentsData';
import { packagedFoodsData } from './foodGroceries/packagedFoodsData';
import { beveragesData } from './foodGroceries/beveragesData';
import { organicHealthFoodsData } from './foodGroceries/organicHealthFoodsData';

export const foodGroceriesData: MainCategory = {
  id: 'food-groceries',
  name: 'Food & Groceries',
  icon: React.createElement(ShoppingBasket, { className: "w-8 h-8" }),
  color: 'text-orange-500',
  count: 15780,
  featured: true,
  subcategories: {
    'fresh-food': freshFoodData,
    'staples-grains': staplesGrainsData,
    'spices-condiments': spicesCondimentsData,
    'packaged-foods': packagedFoodsData,
    'beverages': beveragesData,
    'organic-health-foods': organicHealthFoodsData
  }
};
