
import { MainCategory } from '../categoriesData';
import { Car, Wrench, Settings } from 'lucide-react';
import { carsMotorcyclesData } from './automobiles/carsMotorcyclesData';
import { autoPartsData } from './automobiles/autoPartsData';
import { automotiveServicesData } from './automobiles/automotiveServicesData';

export const automobilesData: MainCategory = {
  id: 'automobiles-vehicles',
  name: 'Automobiles & Vehicles',
  icon: <Car className="w-6 h-6" />,
  color: 'text-gray-600',
  count: 8765,
  featured: false,
  subcategories: {
    'cars-motorcycles': carsMotorcyclesData,
    'auto-parts': autoPartsData,
    'automotive-services': automotiveServicesData
  }
};
