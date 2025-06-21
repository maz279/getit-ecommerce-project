
import { MainCategory } from '../categoriesData';
import { Dumbbell, Zap, TreePine, Users } from 'lucide-react';
import { sportsEquipmentData } from './sportsOutdoor/sportsEquipmentData';
import { fitnessGymData } from './sportsOutdoor/fitnessGymData';
import { outdoorActivitiesData } from './sportsOutdoor/outdoorActivitiesData';
import { teamSportsData } from './sportsOutdoor/teamSportsData';

export const sportsOutdoorData: MainCategory = {
  id: 'sports-outdoor',
  name: 'Sports & Outdoor',
  icon: <Dumbbell className="w-6 h-6" />,
  color: 'text-green-600',
  count: 12340,
  featured: true,
  subcategories: {
    'sports-equipment': sportsEquipmentData,
    'fitness-gym': fitnessGymData,
    'outdoor-activities': outdoorActivitiesData,
    'team-sports': teamSportsData
  }
};
